import { PlusIcon } from "@/components/icons";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import type { OrderItem } from "@/components/orders";
import {
  OrderCard,
  OrderEmptyState,
  OrderFilterBar,
  StatusFilter,
} from "@/components/orders";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersBySeller } from "@/lib/database-helpers";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import { Pressable, View } from "react-native";

// // ─────────────── Guide banner ───────────────
// function GuideBanner({ onDismiss }: { onDismiss: () => void }) {
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#FFFBEB",
//         borderRadius: 14,
//         padding: 14,
//         borderWidth: 1,
//         borderColor: "#FDE68A",
//       }}
//     >
//       <TouchableOpacity
//         style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
//         activeOpacity={0.7}
//         onPress={() =>
//           Linking.openURL(
//             "https://www.thriftverse.shop/blogs/how-to-handle-orders",
//           )
//         }
//       >
//         <View
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: 12,
//             backgroundColor: "#FEF3C7",
//             alignItems: "center",
//             justifyContent: "center",
//             marginRight: 12,
//           }}
//         >
//           <ReceiptIcon width={20} height={20} color="#D97706" />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Typography variation="label" style={{ fontSize: 14, color: "#92400E" }}>
//             New to selling?
//           </Typography>
//           <Typography variation="body-sm" style={{ fontSize: 12, color: "#A16207", marginTop: 2 }}>
//             Learn how to handle orders step by step
//           </Typography>
//         </View>
//         <ArrowUpRightIcon width={14} height={14} color="#D97706" style={{ marginRight: 8 }} />
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={onDismiss}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         activeOpacity={0.6}
//       >
//         <XIcon width={14} height={14} color="#D97706" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// ─────────────── Screen ───────────────
export default function OrdersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { filter: filterParam } = useLocalSearchParams<{ filter?: string }>();

  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  // const [showGuideBanner, setShowGuideBanner] = useState(false);

  // useEffect(() => {
  //   AsyncStorage.getItem("@thriftverse_seen_order_guide").then((val) => {
  //     if (val !== "true") setShowGuideBanner(true);
  //   });
  // }, []);

  // const dismissGuideBanner = () => {
  //   setShowGuideBanner(false);
  //   AsyncStorage.setItem("@thriftverse_seen_order_guide", "true");
  // };

  useEffect(() => {
    const valid: StatusFilter[] = [
      "pending",
      "processing",
      "completed",
      "cancelled",
      "refunded",
    ];
    if (valid.includes(filterParam as StatusFilter)) {
      setStatusFilter(filterParam as StatusFilter);
    }
  }, [filterParam]);

  // ── Data fetching ──
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const result = await getOrdersBySeller(user.id);
      if (!result.success) {
        setItems([]);
        return;
      }

      const mapped: OrderItem[] = result.data.map((order: any) => {
        const shippingFee = order.shipping_fee || 0;
        const productPrice = (order.amount || 0) - shippingFee;
        const isMultiProduct = !order.product_id;
        const isCustomOrder = !!order.shipping_address?.is_custom_order;
        const hasOrderItems = order.order_items?.length > 0;

        let productTitle = order.product?.title || "Order Item";
        let productImage = order.product?.cover_image || null;
        let itemsCount = 1;

        if ((isMultiProduct || isCustomOrder) && hasOrderItems) {
          const first = order.order_items[0];
          productTitle =
            order.order_items.length > 1
              ? `${first.product_name} + ${order.order_items.length - 1} more`
              : first.product_name;
          productImage = first.cover_image;
          itemsCount = order.order_items.length;
        } else if (isMultiProduct && !hasOrderItems) {
          productTitle = `${order.quantity} items`;
          itemsCount = order.quantity || 1;
        }

        const itemsSubtotal = order.items_subtotal ?? productPrice;
        const discountedItemsTotal =
          order.discounted_items_total ?? itemsSubtotal;
        const offerDiscountAmount =
          order.offer_discount_amount ??
          Math.max(
            0,
            Math.round((itemsSubtotal - discountedItemsTotal) * 100) / 100,
          );

        return {
          id: order.id,
          type: "order" as const,
          order_code: order.order_code || order.transaction_code || null,
          product_title: productTitle,
          product_image: productImage,
          buyer_name: order.buyer_name || "Customer",
          amount: productPrice,
          shipping_fee: shippingFee,
          payment_method: order.payment_method || "eSewa",
          status: order.status || "pending",
          created_at: order.created_at || new Date().toISOString(),
          quantity: order.quantity || 1,
          items_count: itemsCount,
          items_subtotal: itemsSubtotal,
          discounted_items_total: discountedItemsTotal,
          offer_code_text: order.offer_code_text || null,
          offer_discount_percent: order.offer_discount_percent || null,
          offer_discount_amount: offerDiscountAmount,
          originalId: order.id,
        };
      });

      setItems(mapped);
    } catch (err) {
      console.error("Error loading orders:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData]),
  );

  // ── Derived state ──
  const counts: Record<StatusFilter, number> = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    processing: items.filter((i) => i.status === "processing").length,
    completed: items.filter((i) => i.status === "completed").length,
    cancelled: items.filter((i) => i.status === "cancelled").length,
    refunded: items.filter((i) => i.status === "refunded").length,
  };

  const filteredItems =
    statusFilter === "all"
      ? items
      : items.filter((i) => i.status === statusFilter);

  const activeFilterLabel =
    statusFilter === "all"
      ? "All"
      : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);

  const filterBar = (
    <OrderFilterBar
      active={statusFilter}
      counts={counts}
      onChange={setStatusFilter}
    />
  );

  const createOrderButton = __DEV__ ? (
    <Pressable
      onPress={() => router.push("/order/custom-order")}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className="p-1"
    >
      <PlusIcon width={22} height={22} color="#3B2F2F" />
    </Pressable>
  ) : null;

  // ── Loading ──
  if (loading) {
    return (
      <TabScreenLayout
        title="Orders"
        headerVariant="light"
        stickyComponent={filterBar}
        scrollable={false}
        rightComponent={createOrderButton}
      >
        <FullScreenLoader message="Loading orders..." />
      </TabScreenLayout>
    );
  }

  return (
    <TabScreenLayout
      title="Orders"
      headerVariant="light"
      stickyComponent={filterBar}
      onRefresh={loadData}
      rightComponent={createOrderButton}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}
    >
      {/* {showGuideBanner && <GuideBanner onDismiss={dismissGuideBanner} />} */}

      {filteredItems.length === 0 ? (
        <OrderEmptyState filterLabel={activeFilterLabel} />
      ) : (
        filteredItems.map((item) => (
          <OrderCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/order/${item.originalId}`)}
          />
        ))
      )}
    </TabScreenLayout>
  );
}
