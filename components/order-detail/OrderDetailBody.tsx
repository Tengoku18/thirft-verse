import { NCMCommentsSection, NCMTrackingSection } from "@/components/order";
import Typography from "@/components/ui/Typography";
import { OrderDetail } from "@/lib/types/order";
import dayjs from "dayjs";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { OrderBuyerSection } from "./OrderBuyerSection";
import { OrderItemsList } from "./OrderItemsList";
import { OrderPaymentSummary } from "./OrderPaymentSummary";
import { OrderShippingSection } from "./OrderShippingSection";

interface OrderDetailBodyProps {
  order: OrderDetail;
  refreshing: boolean;
  refreshTrigger: number;
  showBottomPadding: boolean;
  onRefresh: () => void;
  onNCMSync: () => void;
  onContact: (type: "email" | "phone") => void;
}

export function OrderDetailBody({
  order,
  refreshing,
  refreshTrigger,
  showBottomPadding,
  onRefresh,
  onNCMSync,
  onContact,
}: OrderDetailBodyProps) {
  const totalItems =
    order.items.length > 1 ? order.items.length : order.quantity;

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 16,
        gap: 14,
        paddingBottom: showBottomPadding ? 130 : 40,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B2F2F"
          colors={["#3B2F2F"]}
        />
      }
    >
      {order.ncm?.orderId ? (
        <View className="">
          <Typography variation="label" className="text-brand-espresso">
            Delivery Tracking
          </Typography>
          <NCMTrackingSection
            ncmOrderId={order.ncm.orderId}
            deliveryStatus={order.ncm.deliveryStatus}
            paymentStatus={order.ncm.paymentStatus}
            deliveryCharge={order.ncm.deliveryCharge}
            lastSyncedAt={order.ncm.lastSyncedAt}
            onSync={onNCMSync}
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
        Buyer Information
      </Typography>
      <OrderBuyerSection
        name={order.buyer.name}
        email={order.buyer.email}
        phone={order.buyer.phone}
        onCall={() => onContact("phone")}
      />

      <Typography variation="label" className="text-brand-espresso">
        Shipping Details
      </Typography>
      <OrderShippingSection
        method={order.shipping.method}
        fee={order.shipping.fee}
        address={order.shipping.address}
      />

      <Typography variation="label" className="text-brand-espresso">
        Payment Summary
      </Typography>
      <OrderPaymentSummary
        method={order.payment.method}
        transactionCode={order.payment.transactionCode}
        subtotal={order.payment.subtotal}
        discountedSubtotal={order.payment.discountedSubtotal}
        offerCode={order.payment.offerCode}
        offerDiscountPercent={order.payment.offerDiscountPercent}
        offerDiscountAmount={order.payment.offerDiscountAmount}
        shippingFee={order.shipping.fee}
        sellersEarning={order.payment.sellersEarning}
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

      <View className="px-1 gap-1">
        <Typography
          variation="caption"
          style={{ color: "rgba(59,48,48,0.35)" }}
        >
          Order ID: {order.id.slice(0, 16)}…
        </Typography>
        <Typography
          variation="caption"
          style={{ color: "rgba(59,48,48,0.35)" }}
        >
          Last updated: {dayjs(order.updatedAt).format("DD MMM YYYY, h:mm A")}
        </Typography>
      </View>
    </ScrollView>
  );
}
