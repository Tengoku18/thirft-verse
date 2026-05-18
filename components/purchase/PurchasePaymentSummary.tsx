import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";
import { CashIcon } from "@/components/icons";

/**
 * Buyer-facing payment summary. Deliberately mirrors the seller
 * OrderPaymentSummary layout but OMITS marketplace fee and seller earnings —
 * a buyer must never see the store's financials. It ends on "Total Paid".
 */
interface PurchasePaymentSummaryProps {
  method: string;
  transactionCode: string | null;
  subtotal: number;
  discountedSubtotal: number;
  offerCode: string | null;
  offerDiscountPercent: number | null;
  offerDiscountAmount: number;
  shippingFee: number;
  total: number;
  /** Per-item breakdown for multi-product orders */
  items?: { title: string; quantity: number; price: number }[];
}

function SummaryRow({
  label,
  value,
  valueColor,
  bold = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      <Typography
        variation="body-sm"
        style={{ fontSize: 13, color: "rgba(59,48,48,0.55)" }}
      >
        {label}
      </Typography>
      <Typography
        variation={bold ? "label" : "body-sm"}
        style={{ fontSize: 14, color: valueColor ?? "#3B2F2F" }}
      >
        {value}
      </Typography>
    </View>
  );
}

export function PurchasePaymentSummary({
  method,
  transactionCode,
  subtotal,
  discountedSubtotal,
  offerCode,
  offerDiscountPercent,
  offerDiscountAmount,
  shippingFee,
  total,
  items,
}: PurchasePaymentSummaryProps) {
  const hasOffer = !!(
    offerCode ||
    offerDiscountPercent ||
    offerDiscountAmount > 0
  );
  const hasItemBreakdown = items && items.length > 1;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View
        style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}
      >
        <Typography
          variation="caption"
          style={{
            fontSize: 11,
            color: "rgba(59,48,48,0.4)",
            letterSpacing: 0.8,
            fontWeight: "700",
          }}
        >
          PAYMENT SUMMARY
        </Typography>
      </View>

      <SummaryRow label="Payment Method" value={method} bold />
      {transactionCode && (
        <SummaryRow label="Transaction ID" value={transactionCode} />
      )}

      <View
        style={{
          height: 1,
          backgroundColor: "rgba(59,48,48,0.06)",
          marginHorizontal: 16,
        }}
      />

      {hasItemBreakdown &&
        items!.map((item, idx) => (
          <SummaryRow
            key={idx}
            label={`${item.title} ×${item.quantity}`}
            value={`Rs. ${item.price.toLocaleString()}`}
          />
        ))}

      <SummaryRow
        label={hasItemBreakdown ? "Items Total" : "Subtotal"}
        value={`Rs. ${subtotal.toLocaleString()}`}
        bold
      />

      {hasOffer && (
        <>
          <SummaryRow
            label="Offer Code"
            value={
              offerCode && offerDiscountPercent
                ? `${offerCode} (${offerDiscountPercent}% OFF)`
                : offerCode ||
                  (offerDiscountPercent
                    ? `${offerDiscountPercent}% OFF`
                    : "Applied")
            }
            valueColor="#059669"
          />
          {offerDiscountAmount > 0 && (
            <SummaryRow
              label="Discount"
              value={`- Rs. ${offerDiscountAmount.toLocaleString()}`}
              valueColor="#059669"
            />
          )}
          {discountedSubtotal < subtotal && (
            <SummaryRow
              label="Discounted Total"
              value={`Rs. ${discountedSubtotal.toLocaleString()}`}
              bold
            />
          )}
        </>
      )}

      {shippingFee > 0 && (
        <SummaryRow
          label="Shipping Fee"
          value={`Rs. ${shippingFee.toLocaleString()}`}
        />
      )}

      {/* Total paid — highlighted row (no marketplace fee / earnings here) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 18,
          borderTopWidth: 1,
          borderTopColor: "rgba(59,48,48,0.08)",
          borderStyle: "dashed",
          backgroundColor: "#FBF8F4",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <CashIcon width={16} height={16} color="#D4A373" />
          <Typography
            variation="label"
            style={{ fontSize: 14, color: "#3B2F2F" }}
          >
            Total Paid
          </Typography>
        </View>
        <Typography variation="h2" style={{ fontSize: 20, color: "#D4A373" }}>
          Rs. {Math.round(total).toLocaleString()}
        </Typography>
      </View>
    </View>
  );
}
