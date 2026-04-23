import { EditOrderModal } from "@/components/modals/EditOrderModal";
import { NCMOrderModal } from "@/components/modals/NCMOrderModal";
import { SellerGuideModal } from "@/components/modals/SellerGuideModal";
import { ShippingConfirmModal } from "@/components/modals/ShippingConfirmModal";
import { SuccessModal } from "@/components/molecules/SuccessModal";
import { OrderBottomActions } from "@/components/order-detail";
import { NCMSuccessContent } from "@/components/order-detail/NCMSuccessContent";
import { OrderDetailBody } from "@/components/order-detail/OrderDetailBody";
import {
  OrderDetailError,
  OrderDetailLoading,
} from "@/components/order-detail/OrderDetailFallback";
import { OrderDetailHeader } from "@/components/order-detail/OrderDetailHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useOrderActions } from "./hooks/useOrderActions";
import { useOrderDetail } from "./hooks/useOrderDetail";

export default function SingleOrderScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { order, loading, refreshing, refreshTrigger, loadOrder, onRefresh } =
    useOrderDetail();
  const actions = useOrderActions(order, loadOrder);

  const isSeller = order ? user?.id === order.sellerId : false;
  const isEditable =
    !!order &&
    !!isSeller &&
    order.status === "pending" &&
    !order.ncm?.orderId &&
    order.type === "order";
  const showBottomActions =
    !!order &&
    !!isSeller &&
    order.status === "pending" &&
    order.type === "order";

  return (
    <View className="flex-1 bg-[#FAF7F2]">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header always visible regardless of loading / error state */}
      <OrderDetailHeader
        orderCode={order?.orderCode ?? ""}
        isSeller={!!isSeller}
        isEditable={isEditable}
        onEdit={() => actions.setShowEditModal(true)}
        onGuide={() => actions.setShowGuideModal(true)}
      />

      {/* Body — switches between loading skeleton, error, and content */}
      {loading ? (
        <OrderDetailLoading />
      ) : !order ? (
        <OrderDetailError />
      ) : (
        <>
          <OrderDetailBody
            order={order}
            refreshing={refreshing}
            refreshTrigger={refreshTrigger}
            showBottomPadding={showBottomActions}
            onRefresh={onRefresh}
            onNCMSync={actions.handleNCMSync}
            onContact={actions.handleContact}
          />

          <OrderBottomActions
            status={order.status}
            isEditable={isEditable}
            onEditOrder={() => actions.setShowEditModal(true)}
            onSendToNCM={() => actions.setShowNCMModal(true)}
          />

          <SellerGuideModal
            visible={actions.showGuideModal}
            onClose={() => actions.setShowGuideModal(false)}
          />
          <ShippingConfirmModal
            visible={actions.showShippingModal}
            shippingId={actions.shippingId}
            billImageUri={actions.billImageUri}
            uploading={actions.uploadingBill}
            onChangeId={actions.setShippingId}
            onPickImage={actions.handlePickBillImage}
            onConfirm={actions.handleConfirmShipping}
            onClose={() => {
              actions.setShowShippingModal(false);
              actions.setShippingId("");
              actions.setBillImageUri(null);
            }}
          />

          {order.type === "order" && (
            <NCMOrderModal
              visible={actions.showNCMModal}
              onClose={() => actions.setShowNCMModal(false)}
              onSuccess={actions.handleNCMOrderSuccess}
              orderData={{
                orderId: order.id,
                orderCode: order.orderCode,
                buyerName: order.buyer.name,
                buyerPhone: order.buyer.phone,
                shippingAddress: {
                  street: order.shipping.address?.street || "",
                  city: order.shipping.address?.city || "",
                  district: order.shipping.address?.district || "",
                  country: order.shipping.address?.country || "Nepal",
                  phone: order.buyer.phone,
                },
                productTitle: order.product.title,
                totalAmount: order.payment.total,
                shippingFee: order.shipping.fee,
              }}
            />
          )}

          {order.type === "order" && (
            <EditOrderModal
              visible={actions.showEditModal}
              onClose={() => actions.setShowEditModal(false)}
              onSuccess={() => {
                actions.setShowEditModal(false);
                loadOrder();
              }}
              orderId={order.id}
              initialData={{
                buyerName: order.buyer.name,
                buyerEmail: order.buyer.email,
                buyerPhone: order.buyer.phone,
                shippingAddress: {
                  street: order.shipping.address?.street || "",
                  city: order.shipping.address?.city || "",
                  district: order.shipping.address?.district || "",
                  country: order.shipping.address?.country || "Nepal",
                },
              }}
            />
          )}

          <SuccessModal
            visible={actions.showSuccessModal}
            title="Sent to NCM!"
            onClose={() => actions.setShowSuccessModal(false)}
            actions={[
              {
                label: "View Orders",
                variant: "primary",
                onPress: () => {
                  actions.setShowSuccessModal(false);
                  router.replace("/orders?filter=processing");
                },
              },
              {
                label: "Stay Here",
                variant: "text",
                onPress: () => actions.setShowSuccessModal(false),
              },
            ]}
          >
            <NCMSuccessContent ncmOrderId={actions.ncmOrderId} />
          </SuccessModal>
        </>
      )}
    </View>
  );
}
