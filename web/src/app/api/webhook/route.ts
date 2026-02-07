import { sendPushNotification } from "@/lib/expo-push";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_STATUSES = ["cancelled", "refunded"] as const;

const NOTIFICATION_MESSAGES: Record<string, { title: string; body: string }> = {
  cancelled: {
    title: "Order Cancelled",
    body: "An order has been cancelled.",
  },
  refunded: {
    title: "Order Refunded",
    body: "An order has been refunded.",
  },
};

export async function POST(request: NextRequest) {
  // 1. Verify webhook secret
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NCM_WEBHOOK_SECRET) {
    console.error("Webhook auth failed: invalid secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { error: "Empty body. Send JSON with order_id and status." },
        { status: 400 }
      );
    }
    const payload = JSON.parse(text);
    console.log("=== Webhook Received ===");
    console.log(JSON.stringify(payload, null, 2));

    const { order_id, status } = payload;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "Missing order_id or status" },
        { status: 400 }
      );
    }

    // 2. Only allow cancelled and refunded
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // 3. Find the order with product details
    const supabase = createServiceRoleClient();
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, status, seller_id, order_code, amount, product_id")
      .eq("id", order_id)
      .single();

    if (findError || !order) {
      console.error("Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Update the order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    console.log(`Order ${order.id} updated: "${order.status}" → "${status}"`);

    // 5. Send push notification to seller (all devices)
    const [{ data: seller }, { data: product }] = await Promise.all([
      supabase
        .from("profiles")
        .select("expo_push_tokens, config")
        .eq("id", order.seller_id)
        .single(),
      supabase
        .from("products")
        .select("title, cover_image, price")
        .eq("id", order.product_id)
        .single(),
    ]);

    // Check if seller has muted notifications
    if (seller?.config?.notifications_muted) {
      console.log("Seller has muted notifications, skipping");
    } else {
      const tokens: string[] = seller?.expo_push_tokens ?? [];

      if (tokens.length > 0) {
        const message = NOTIFICATION_MESSAGES[status];
        const productName = product?.title || "Unknown product";
        const orderCode = order.order_code || order.id.slice(0, 8);

        await sendPushNotification({
          to: tokens,
          title: message.title,
          body: `"${productName}" - Rs.${order.amount} (Order #${orderCode})`,
          data: {
            order_id: order.id,
            status,
            product_title: productName,
            product_image: product?.cover_image || "",
            amount: String(order.amount),
          },
        });
        console.log(`Push notification sent to ${tokens.length} device(s) for seller:`, order.seller_id);
      } else {
        console.log("Seller has no push tokens, skipping notification");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "order-webhook" });
}
