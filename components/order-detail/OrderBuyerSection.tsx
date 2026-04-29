import { Typography } from "@/components/ui/Typography";

import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { CheckmarkSealFillIcon, CopyIcon, MailIcon, PhoneFillIcon, UserIcon } from "@/components/icons";

interface OrderBuyerSectionProps {
  name: string;
  email: string;
  phone: string;
  onCall: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function OrderBuyerSection({
  name,
  email,
  phone,
  onCall,
}: OrderBuyerSectionProps) {
  const initials = getInitials(name);
  const hasEmail = email && email !== "Not available";

  const handleCopyEmail = async () => {
    if (!hasEmail) return;
    await Clipboard.setStringAsync(email);
    Alert.alert("Copied!", "Email address copied to clipboard");
  };

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
          BUYER INFORMATION
        </Typography>
      </View>

      {/* Buyer info row */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        {/* Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#D4A37320",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {initials ? (
            <Typography variation="label" style={{ color: "#D4A373", fontSize: 16 }}>
              {initials}
            </Typography>
          ) : (
            <UserIcon width={20} height={20} color="#D4A373" />
          )}
        </View>

        {/* Name + label */}
        <View>
          <Typography variation="label" style={{ fontSize: 15, color: "#3B2F2F" }}>
            {name}
          </Typography>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <CheckmarkSealFillIcon width={12} height={12} color="#059669" />
            <Typography variation="caption" style={{ color: "#059669", fontSize: 12 }}>
              Verified Buyer
            </Typography>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "rgba(59,48,48,0.06)", marginHorizontal: 16 }} />

      {/* Contact info */}
      {email && email !== "Not available" && (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <MailIcon width={14} height={14} color="rgba(59,48,48,0.35)" />
          <Typography variation="body-sm" style={{ fontSize: 13, color: "rgba(59,48,48,0.6)", flex: 1 }} numberOfLines={1}>
            {email}
          </Typography>
        </View>
      )}
      {phone && phone !== "Not available" && (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <PhoneFillIcon width={14} height={14} color="rgba(59,48,48,0.35)" />
          <Typography variation="body-sm" style={{ fontSize: 13, color: "rgba(59,48,48,0.6)" }}>
            {phone}
          </Typography>
        </View>
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "rgba(59,48,48,0.06)", marginHorizontal: 16 }} />

      {/* Action buttons */}
      <View style={{ flexDirection: "row", padding: 12, gap: 10 }}>
        <TouchableOpacity
          onPress={onCall}
          activeOpacity={0.75}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 11,
            borderRadius: 12,
            backgroundColor: "rgba(59,48,48,0.06)",
            borderWidth: 1,
            borderColor: "rgba(59,48,48,0.08)",
          }}
        >
          <PhoneFillIcon width={14} height={14} color="#3B2F2F" />
          <Typography variation="label" style={{ fontSize: 13, color: "#3B2F2F" }}>Call</Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyEmail}
          activeOpacity={0.75}
          disabled={!hasEmail}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingVertical: 11,
            borderRadius: 12,
            backgroundColor: "rgba(59,48,48,0.06)",
            borderWidth: 1,
            borderColor: "rgba(59,48,48,0.08)",
            opacity: hasEmail ? 1 : 0.4,
          }}
        >
          <CopyIcon width={14} height={14} color="#3B2F2F" />
          <Typography variation="label" style={{ fontSize: 13, color: "#3B2F2F" }}>Copy Email</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
