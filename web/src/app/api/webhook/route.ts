import { sendPushNotification } from "@/lib/expo-push";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// ============================================================
// NCM Webhook — handles all delivery status updates from NCM
// ============================================================

// Map NCM delivery status → our order status
// Only terminal NCM statuses change our order status.
// Intermediate statuses (Pickup Complete, Dispatched, Arrived, Sent for Delivery)
// only update ncm_data — NCM handles those stages.
const NCM_TO_ORDER_STATUS: Record<string, string | null> = {
  "Pickup Complete": null,
  "Dispatched": null,
  "Arrived": null,
  "Sent for Delivery": null,
  "Delivered": "completed",
  "Cancelled": "cancelled",
  "Returned": "refunded",
};

// Notification config for each NCM status
const STATUS_NOTIF: Record<
  string,
  { title: string; body: string; type: string } | null
> = {
  "Pickup Complete": {
    title: "Picked Up",
    body: "has been picked up by NCM",
    type: "order_update",
  },
  "Dispatched": {
    title: "Dispatched",
    body: "has been dispatched from the origin branch",
    type: "order_update",
  },
  "Arrived": {
    title: "Arrived",
    body: "has arrived at the destination branch",
    type: "order_update",
  },
  "Sent for Delivery": {
    title: "Out for Delivery",
    body: "is out for delivery",
    type: "order_update",
  },
  "Delivered": {
    title: "Delivered",
    body: "has been delivered successfully",
    type: "order_completed",
  },
  "Cancelled": {
    title: "Cancelled",
    body: "has been cancelled",
    type: "order_cancelled",
  },
  "Returned": {
    title: "Returned",
    body: "has been returned",
    type: "order_refunded",
  },
};

/**
 * Process a single NCM order status update
 * ncmOrderId: NCM's order ID (number)
 * status: NCM delivery status string
 */
async function processOrderUpdate(
  supabase: ReturnType<typeof createServiceRoleClient>,
  ncmOrderId: string,
  status: string,
  timestamp: string
) {
  const now = timestamp || new Date().toISOString();

  // 1. Find order by NCM order ID (not our internal UUID!)
  const { data: order, error: findError } = await supabase
    .from("orders")
    .select(
      "id, status, seller_id, order_code, amount, product_id, buyer_name, ncm_data, ncm_order_id, sellers_earning"
    )
    .eq("ncm_order_id", Number(ncmOrderId))
    .single();

  if (findError || !order) {
    console.error(`Order not found for NCM ID: ${ncmOrderId}`);
    return { success: false, error: "Order not found" };
  }

  // 2. Build ncm_data update
  const existingNcmData =
    (order.ncm_data as Record<string, unknown>) || {};
  const ncmDataUpdate = {
    ...existingNcmData,
    last_delivery_status: status,
    last_synced_at: now,
    status_history: [
      ...((existingNcmData.status_history as Array<Record<string, string>>) ||
        []),
      { status, added_time: now },
    ],
  };

  // 3. Determine if we should update our order status
  const newOrderStatus = NCM_TO_ORDER_STATUS[status] ?? null;

  const updateData: Record<string, unknown> = {
    ncm_delivery_status: status,
    ncm_data: ncmDataUpdate,
    ncm_last_synced_at: now,
    updated_at: now,
  };

  if (newOrderStatus) {
    updateData.status = newOrderStatus;
  }

  // 4. Update order
  const { error: updateError } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", order.id);

  if (updateError) {
    console.error(`Failed to update order ${order.id}:`, updateError);
    return { success: false, error: "Failed to update order" };
  }

  const displayStatus = newOrderStatus || order.status;
  console.log(
    `Order ${order.id} (NCM #${ncmOrderId}): "${order.status}" → "${displayStatus}" [NCM: ${status}]`
  );

  // 4b. Update seller revenue on terminal statuses
  if (newOrderStatus && order.sellers_earning) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("revenue")
      .eq("id", order.seller_id)
      .single();

    const currentRevenue = (profile?.revenue as {
      pendingAmount: number;
      confirmedAmount: number;
      withdrawnAmount: number;
      withdrawalHistory: unknown[];
    }) || {
      pendingAmount: 0,
      confirmedAmount: 0,
      withdrawnAmount: 0,
      withdrawalHistory: [],
    };

    const earning = order.sellers_earning || 0;
    let updatedRevenue = { ...currentRevenue };

    if (newOrderStatus === "completed") {
      // Delivered: move from pending → confirmed
      updatedRevenue.pendingAmount = Math.max(0, (currentRevenue.pendingAmount || 0) - earning);
      updatedRevenue.confirmedAmount = (currentRevenue.confirmedAmount || 0) + earning;
    } else if (newOrderStatus === "cancelled" || newOrderStatus === "refunded") {
      // Cancelled/Returned: remove from pending
      updatedRevenue.pendingAmount = Math.max(0, (currentRevenue.pendingAmount || 0) - earning);
    }

    await supabase
      .from("profiles")
      .update({
        revenue: updatedRevenue,
        updated_at: now,
      })
      .eq("id", order.seller_id);

    console.log(
      `Revenue updated for seller ${order.seller_id}: pending=${updatedRevenue.pendingAmount}, confirmed=${updatedRevenue.confirmedAmount}`
    );
  }

  // 5. Send notifications
  const notifConfig = STATUS_NOTIF[status];
  if (!notifConfig) {
    return { success: true, orderId: order.id };
  }

  // Fetch seller profile
  const { data: seller } = await supabase
    .from("profiles")
    .select("expo_push_tokens, config")
    .eq("id", order.seller_id)
    .single();

  // Build product name
  let productName = "Unknown product";
  let productImage = "";

  if (order.product_id) {
    const { data: product } = await supabase
      .from("products")
      .select("title, cover_image")
      .eq("id", order.product_id)
      .single();
    productName = product?.title || "Unknown product";
    productImage = product?.cover_image || "";
  } else {
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

  const orderCode = order.order_code || order.id.slice(0, 8);
  const notifTitle = `Order ${notifConfig.title} · #${orderCode}`;
  const notifBody = `"${productName}" worth Rs.${Number(order.amount).toLocaleString()} ${notifConfig.body}`;

  // Push notification (if not muted)
  if (!seller?.config?.notifications_muted) {
    const tokens: string[] = seller?.expo_push_tokens ?? [];
    if (tokens.length > 0) {
      await sendPushNotification({
        to: tokens,
        title: notifTitle,
        body: notifBody,
        data: {
          order_id: order.id,
          status: displayStatus,
          ncm_status: status,
          product_title: productName,
          product_image: productImage,
          buyer_name: order.buyer_name || "",
          amount: String(order.amount),
        },
      });
      console.log(
        `Push sent to ${tokens.length} device(s) for seller:`,
        order.seller_id
      );
    }
  }

  // In-app notification (always)
  await supabase.from("notifications").insert({
    user_id: order.seller_id,
    title: notifTitle,
    body: notifBody,
    type: notifConfig.type,
    data: {
      order_id: order.id,
      status: displayStatus,
      ncm_status: status,
      product_title: productName,
      buyer_name: order.buyer_name || "",
      amount: String(order.amount),
    },
  });

  return { success: true, orderId: order.id };
}

// ============================================================
// POST handler
// ============================================================
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
    console.log("=== NCM Webhook Received ===");
    console.log(JSON.stringify(payload, null, 2));

    // 2. Handle test webhooks from NCM portal
    if (payload.test) {
      console.log("Test webhook received — responding OK");
      return NextResponse.json({ status: "success" });
    }

    const { order_id, order_ids, status, timestamp } = payload;

    if (!status) {
      return NextResponse.json(
        { error: "Missing status field" },
        { status: 400 }
      );
    }

    if (!order_id && !order_ids) {
      return NextResponse.json(
        { error: "Missing order_id or order_ids" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // 3. Handle single or bulk order updates
    const ncmOrderIds: string[] = order_id
      ? [String(order_id)]
      : (order_ids || []).map(String);

    const results = await Promise.allSettled(
      ncmOrderIds.map((id) =>
        processOrderUpdate(supabase, id, status, timestamp)
      )
    );

    const succeeded = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - succeeded;

    console.log(
      `Webhook processed: ${succeeded} succeeded, ${failed} failed out of ${results.length} order(s)`
    );

    return NextResponse.json({
      success: true,
      processed: succeeded,
      failed,
      total: results.length,
    });
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
  return NextResponse.json({ status: "ok", endpoint: "ncm-order-webhook" });
}
