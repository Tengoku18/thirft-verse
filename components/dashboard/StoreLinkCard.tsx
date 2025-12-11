import { BodyMediumText, BodySemiboldText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

interface StoreLinkCardProps {
  storeUsername: string;
}

export const StoreLinkCard: React.FC<StoreLinkCardProps> = ({
  storeUsername,
}) => {
  const storeUrl = `https://${storeUsername}.thriftverse.shop/`;

  const handleOpenStore = () => {
    Linking.openURL(storeUrl);
  };

  return (
    <View className="px-4 mb-4">
      <TouchableOpacity
        onPress={handleOpenStore}
        activeOpacity={0.8}
        className="bg-white rounded-2xl p-4 flex-row items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
        >
          <IconSymbol name="link" size={22} color="#22C55E" />
        </View>
        <View className="flex-1">
          <BodySemiboldText style={{ fontSize: 14 }}>
            Your Store Link
          </BodySemiboldText>
          <BodyMediumText
            style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {storeUsername}.thriftverse.shop
          </BodyMediumText>
        </View>
        <IconSymbol name="arrow.up.right" size={18} color="#22C55E" />
      </TouchableOpacity>
    </View>
  );
};
