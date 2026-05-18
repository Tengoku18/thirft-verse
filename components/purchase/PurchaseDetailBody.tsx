import { NCMCommentsSection, NCMTrackingSection } from "@/components/order";
import { OrderItemsList } from "@/components/order-detail/OrderItemsList";
import { OrderShippingSection } from "@/components/order-detail/OrderShippingSection";
import { OrderStatusCard } from "@/components/order-detail/OrderStatusCard";
import Typography from "@/components/ui/Typography";
import { StoreIcon } from "@/components/icons";
import { OrderDetail } from "@/lib/types/order";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { PurchasePaymentSummary } from "./PurchasePaymentSummary";

interface PurchaseDetailBodyProps {
  order: OrderDetail;
  refreshing: boolean;
  refreshTrigger: number;
  onRefresh: () => void;
}

/**
 * Read-only purchase view for buyers. Shows status, who it was bought from,
 * delivery tracking, items, delivery address and a buyer payment summary.
 * No edit / NCM-send / contact-as-seller actions, and never the seller's
 * earnings or marketplace fee.
 */
export function PurchaseDetailBody({
  order,
  refreshing,
  refreshTrigger,
  onRefresh,
}: PurchaseDetailBodyProps) {
  const itemsCount =
    order.items.length > 1 ? order.items.length : order.quantity;
  const storeName =
    order.seller?.name || order.seller?.storeUsername || "Store";

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 110 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B2F2F"
          colors={["#3B2F2F"]}
        />
      }
    >
      <OrderStatusCard
        status={order.status}
        orderCode={order.orderCode}
        itemsCount={itemsCount}
        totalAmount={order.payment.total}
        paymentMethod={order.payment.method}
        ncmDeliveryStatus={order.ncm?.deliveryStatus}
      />

      {/* Sold by */}
      {order.seller && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "rgba(59,47,47,0.06)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StoreIcon width={20} height={20} color="#3B2F2F" />
          </View>
          <View style={{ flex: 1 }}>
            <Typography
              variation="caption"
              style={{ fontSize: 11, color: "rgba(59,48,48,0.45)" }}
            >
              Sold by
            </Typography>
            <Typography
              variation="label"
              style={{ fontSize: 14, color: "#3B2F2F" }}
              numberOfLines={1}
            >
              {storeName}
            </Typography>
            {order.seller.storeUsername ? (
              <Typography
                variation="caption"
                style={{ fontSize: 12, color: "rgba(59,48,48,0.5)" }}
              >
                @{order.seller.storeUsername}
              </Typography>
            ) : null}
          </View>
        </View>
      )}

      {/* Delivery tracking (read-only) */}
      {order.ncm?.orderId ? (
        <View>
          <Typography variation="label" className="text-brand-espresso">
            Delivery Tracking
          </Typography>
          <NCMTrackingSection
            ncmOrderId={order.ncm.orderId}
            deliveryStatus={order.ncm.deliveryStatus}
            paymentStatus={order.ncm.paymentStatus}
            deliveryCharge={order.ncm.deliveryCharge}
            lastSyncedAt={order.ncm.lastSyncedAt}
            onSync={async () => onRefresh()}
            refreshTrigger={refreshTrigger}
          />
          <NCMCommentsSection
            ncmOrderId={order.ncm.orderId}
            refreshTrigger={refreshTrigger}
          />
        </View>
      ) : null}

      <Typography variation="label" className="text-brand-espresso">
        {order.items.length > 1
          ? `Items in Order (${order.items.length})`
          : "Item in Order"}
      </Typography>
      <OrderItemsList
        items={order.items}
        product={order.product}
        quantity={order.quantity}
      />

      <Typography variation="label" className="text-brand-espresso">
        Delivery Details
      </Typography>
      <OrderShippingSection
        method={order.shipping.method}
        fee={order.shipping.fee}
        address={order.shipping.address}
      />

      <Typography variation="label" className="text-brand-espresso">
        Payment Summary
      </Typography>
      <PurchasePaymentSummary
        method={order.payment.method}
        transactionCode={order.payment.transactionCode}
        subtotal={order.payment.subtotal}
        discountedSubtotal={order.payment.discountedSubtotal}
        offerCode={order.payment.offerCode}
        offerDiscountPercent={order.payment.offerDiscountPercent}
        offerDiscountAmount={order.payment.offerDiscountAmount}
        shippingFee={order.shipping.fee}
        total={order.payment.total}
        items={
          order.items.length > 1
            ? order.items.map((i) => ({
                title: i.title,
                quantity: i.quantity,
                price: i.price,
              }))
            : undefined
        }
      />
    </ScrollView>
  );
}
