import { ReceiptIcon, ShareIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { downloadReceipt, shareReceipt, type ReceiptData } from "@/lib/receipt";
import { OrderDetail } from "@/lib/types/order";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

function toReceiptData(order: OrderDetail): ReceiptData {
  const quantity = order.quantity || 1;
  const subtotal = order.payment.subtotal;
  return {
    orderCode: order.orderCode,
    date: new Date(order.createdAt),
    paymentMethod:
      order.payment.method === "cod"
        ? "Cash on Delivery"
        : order.payment.method,
    buyerName: order.buyer.name,
    productName: order.product.title,
    quantity,
    unitPrice: order.product.price || subtotal / Math.max(quantity, 1),
    subtotal,
    offerCode: order.payment.offerCode,
    discountAmount: order.payment.offerDiscountAmount,
    shippingFee: order.shipping.fee,
    total: order.payment.total,
  };
}

export function PurchaseReceiptActions({ order }: { order: OrderDetail }) {
  const toast = useToast();
  const [busy, setBusy] = useState<"download" | "share" | null>(null);

  const handleDownload = async () => {
    if (busy) return;
    setBusy("download");
    try {
      const result = await downloadReceipt(toReceiptData(order));
      if (result.status === "saved")
        toast.success(`Receipt saved to ${result.location}`);
      else if (result.status === "denied")
        toast.error("Pick a folder to save the receipt");
      else toast.error("Saving isn't available on this device");
    } catch (e) {
      console.error("Receipt download failed:", e);
      toast.error("Couldn't generate the receipt");
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy("share");
    try {
      const ok = await shareReceipt(toReceiptData(order));
      if (!ok) toast.error("Sharing isn't available on this device");
    } catch (e) {
      console.error("Receipt share failed:", e);
      toast.error("Couldn't generate the receipt");
    } finally {
      setBusy(null);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 28,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "rgba(59,48,48,0.08)",
      }}
    >
      <TouchableOpacity
        onPress={handleDownload}
        activeOpacity={0.8}
        disabled={!!busy}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 14,
          borderRadius: 14,
          backgroundColor: "#3B2F2F",
          opacity: busy && busy !== "download" ? 0.5 : 1,
        }}
      >
        {busy === "download" ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <ReceiptIcon width={18} height={18} color="#FFFFFF" />
        )}
        <Typography
          variation="label"
          style={{ fontSize: 14, color: "#FFFFFF" }}
        >
          Download Receipt
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleShare}
        activeOpacity={0.8}
        disabled={!!busy}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 14,
          backgroundColor: "rgba(59,48,48,0.08)",
          opacity: busy && busy !== "share" ? 0.5 : 1,
        }}
      >
        {busy === "share" ? (
          <ActivityIndicator size="small" color="#3B2F2F" />
        ) : (
          <ShareIcon width={18} height={18} color="#3B2F2F" />
        )}
        <Typography
          variation="label"
          style={{ fontSize: 14, color: "#3B2F2F" }}
        >
          Share
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
