import { sendPushNotification } from "@/lib/expo-push";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_STATUSES = ["cancelled", "refunded"] as const;

const STATUS_LABELS: Record<string, { title: string; past: string }> = {
  cancelled: { title: "Cancelled", past: "cancelled" },
  refunded: { title: "Refunded", past: "refunded" },
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
      .select("id, status, seller_id, order_code, amount, product_id, buyer_name")
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
    // Fetch seller profile
    const { data: seller } = await supabase
      .from("profiles")
      .select("expo_push_tokens, config")
      .eq("id", order.seller_id)
      .single();

    // Build product name — handle both single and multi-product orders
    let productName = "Unknown product";
    let productImage = "";

    if (order.product_id) {
      // Single-product order: fetch from products table
      const { data: product } = await supabase
        .from("products")
        .select("title, cover_image")
        .eq("id", order.product_id)
        .single();
      productName = product?.title || "Unknown product";
      productImage = product?.cover_image || "";
    } else {
      // Multi-product order: fetch from order_items table
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, cover_image")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });

      if (items && items.length > 0) {
        productName = items[0].product_name;
        productImage = items[0].cover_image || "";
        if (items.length > 1) {
          productName += ` + ${items.length - 1} more item${items.length > 2 ? "s" : ""}`;
        }
      }
    }

    const label = STATUS_LABELS[status] || { title: status, past: status };
    const orderCode = order.order_code || order.id.slice(0, 8);
    const notifTitle = `Order ${label.title} · #${orderCode}`;
    const notifBody = `"${productName}" worth Rs.${Number(order.amount).toLocaleString()} has been ${label.past}`;
    const notificationType = status === "cancelled" ? "order_cancelled" : "order_refunded";

    // Send push notification if not muted
    if (seller?.config?.notifications_muted) {
      console.log("Seller has muted notifications, skipping push");
    } else {
      const tokens: string[] = seller?.expo_push_tokens ?? [];

      if (tokens.length > 0) {
        await sendPushNotification({
          to: tokens,
          title: notifTitle,
          body: notifBody,
          data: {
            order_id: order.id,
            status,
            product_title: productName,
            product_image: productImage,
            buyer_name: order.buyer_name || "",
            amount: String(order.amount),
          },
        });
        console.log(`Push notification sent to ${tokens.length} device(s) for seller:`, order.seller_id);
      } else {
        console.log("Seller has no push tokens, skipping push");
      }
    }

    // Insert in-app notification (always, regardless of mute)
    await supabase.from("notifications").insert({
      user_id: order.seller_id,
      title: notifTitle,
      body: notifBody,
      type: notificationType,
      data: {
        order_id: order.id,
        status,
        product_title: productName,
        buyer_name: order.buyer_name || "",
        amount: String(order.amount),
      },
    });

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
