import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import {
  OrderDetailError,
  OrderDetailLoading,
} from "@/components/order-detail/OrderDetailFallback";
import { PurchaseDetailBody } from "@/components/purchase/PurchaseDetailBody";
import { PurchaseReceiptActions } from "@/components/purchase/PurchaseReceiptActions";
import React from "react";
import { View } from "react-native";
import { useOrderDetail } from "../order/hooks/useOrderDetail";

/**
 * Read-only purchase detail for buyers. Reuses useOrderDetail (getOrderById),
 * which returns the buyer's own order thanks to the
 * "buyers can view their own orders" RLS policy (migration 011). The buyer
 * can only view status, tracking and details — there are no actions here.
 */
export default function PurchaseDetailScreen() {
  const { order, loading, refreshing, refreshTrigger, onRefresh } =
    useOrderDetail();

  return (
    <View className="flex-1 bg-[#FAF7F2]">
      <ScreenHeader title="Purchase Details" showBackButton />

      {loading ? (
        <OrderDetailLoading />
      ) : !order ? (
        <OrderDetailError />
      ) : (
        <>
          <PurchaseDetailBody
            order={order}
            refreshing={refreshing}
            refreshTrigger={refreshTrigger}
            onRefresh={onRefresh}
          />
          <PurchaseReceiptActions order={order} />
        </>
      )}
    </View>
  );
}
