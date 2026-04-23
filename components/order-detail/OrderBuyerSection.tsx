import {
  BodyMediumText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";

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
        <CaptionText
          style={{ fontSize: 11, color: "rgba(59,48,48,0.4)", letterSpacing: 0.8, fontWeight: "700" }}
        >
          BUYER INFORMATION
        </CaptionText>
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
            <BodySemiboldText style={{ color: "#D4A373", fontSize: 16 }}>
              {initials}
            </BodySemiboldText>
          ) : (
            <IconSymbol name="person.fill" size={20} color="#D4A373" />
          )}
        </View>

        {/* Name + label */}
        <View>
          <BodySemiboldText style={{ fontSize: 15, color: "#3B2F2F" }}>
            {name}
          </BodySemiboldText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
            <IconSymbol name="checkmark.seal.fill" size={12} color="#059669" />
            <CaptionText style={{ color: "#059669", fontSize: 12 }}>
              Verified Buyer
            </CaptionText>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "rgba(59,48,48,0.06)", marginHorizontal: 16 }} />

      {/* Contact info */}
      {email && email !== "Not available" && (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <IconSymbol name="envelope.fill" size={14} color="rgba(59,48,48,0.35)" />
          <BodyMediumText style={{ fontSize: 13, color: "rgba(59,48,48,0.6)", flex: 1 }} numberOfLines={1}>
            {email}
          </BodyMediumText>
        </View>
      )}
      {phone && phone !== "Not available" && (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <IconSymbol name="phone.fill" size={14} color="rgba(59,48,48,0.35)" />
          <BodyMediumText style={{ fontSize: 13, color: "rgba(59,48,48,0.6)" }}>
            {phone}
          </BodyMediumText>
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
          <IconSymbol name="phone.fill" size={14} color="#3B2F2F" />
          <BodySemiboldText style={{ fontSize: 13, color: "#3B2F2F" }}>Call</BodySemiboldText>
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
          <IconSymbol name="doc.on.doc.fill" size={14} color="#3B2F2F" />
          <BodySemiboldText style={{ fontSize: 13, color: "#3B2F2F" }}>Copy Email</BodySemiboldText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
