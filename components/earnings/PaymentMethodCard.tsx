import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { QRCodeIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";


interface PaymentMethodCardProps {
  username: string;
  qrImageUrl: string | null;
  onChangePress: () => void;
}

export function PaymentMethodCard({
  username,
  qrImageUrl,
  onChangePress,
}: PaymentMethodCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(59,48,48,0.06)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Typography variation="label" style={{ fontSize: 16, color: "#3B2F2F" }}>
          Payment Method
        </Typography>
        <TouchableOpacity onPress={onChangePress} activeOpacity={0.7}>
          <Typography variation="label" style={{ fontSize: 14, color: "#D4A373" }}>
            Change
          </Typography>
        </TouchableOpacity>
      </View>

      {/* eSewa info row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {/* QR code preview */}
        <View
          style={{
            width: 72,
            height: 72,
            backgroundColor: "#FAF7F2",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: "rgba(59,48,48,0.2)",
            overflow: "hidden",
          }}
        >
          {qrImageUrl ? (
            <Image
              source={{ uri: qrImageUrl }}
              style={{ width: 60, height: 60, opacity: 0.85 }}
              resizeMode="contain"
            />
          ) : (
            <QRCodeIcon width={32} height={32} color="rgba(59,48,48,0.3)" />
          )}
        </View>

        {/* Account details */}
        <View style={{ flex: 1 }}>
          {/* eSewa badge + name */}
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: "#4CAF50",
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variation="label" style={{ color: "#FFFFFF", fontSize: 10 }}>
                e
              </Typography>
            </View>
            <Typography variation="label" style={{ fontSize: 15, color: "#3B2F2F" }}>
              eSewa Wallet
            </Typography>
          </View>

          <Typography variation="caption" style={{ color: "rgba(59,48,48,0.55)", fontSize: 13, marginBottom: 2 }}>
            @{username}
          </Typography>
          <Typography variation="caption" style={{ color: "rgba(59,48,48,0.35)", fontSize: 11 }}>
            Primary payout account
          </Typography>
        </View>
      </View>
    </View>
  );
}
