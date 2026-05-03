import { Typography } from "@/components/ui/Typography";

import React from "react";
import { View } from "react-native";
import { LocationIcon } from "@/components/icons";

interface ShippingAddress {
  street: string;
  city: string;
  district: string;
  country: string;
}

interface OrderShippingSectionProps {
  method: string;
  fee: number;
  address: ShippingAddress | null;
}

function InfoRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      <Typography variation="body-sm" style={{ fontSize: 13, color: "rgba(59,48,48,0.5)" }}>
        {label}
      </Typography>
      <Typography variation="label" style={{ fontSize: 14, color: "#3B2F2F" }}>
        {value}
      </Typography>
    </View>
  );
}

export function OrderShippingSection({
  method,
  fee,
  address,
}: OrderShippingSectionProps) {
  const fullAddress = address
    ? [address.street, address.city, address.district, address.country]
        .filter(Boolean)
        .join(", ")
    : null;

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
      {/* Section label */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
        <Typography variation="caption"
          style={{ fontSize: 11, color: "rgba(59,48,48,0.4)", letterSpacing: 0.8, fontWeight: "700" }}
        >
          SHIPPING DETAILS
        </Typography>
      </View>

      <InfoRow label="Method" value={method} />
      {fee > 0 && (
        <InfoRow
          label="Shipping Fee"
          value={`Rs. ${fee.toLocaleString()}`}
        />
      )}

      {fullAddress && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "rgba(59,48,48,0.06)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#D4A37315",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <LocationIcon width={14} height={14} color="#D4A373" />
            </View>
            <View style={{ flex: 1 }}>
              <Typography variation="caption"
                style={{ fontSize: 11, color: "rgba(59,48,48,0.4)", letterSpacing: 0.5, marginBottom: 4 }}
              >
                DELIVERY ADDRESS
              </Typography>
              <Typography variation="body-sm" style={{ fontSize: 14, color: "#3B2F2F", lineHeight: 20 }}>
                {fullAddress}
              </Typography>
            </View>
          </View>
        </View>
      )}

      {!address && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Typography variation="body-sm" style={{ fontSize: 13, color: "rgba(59,48,48,0.4)", fontStyle: "italic" }}>
            No delivery address provided
          </Typography>
        </View>
      )}
    </View>
  );
}
