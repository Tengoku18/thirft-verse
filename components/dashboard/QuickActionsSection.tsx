import { BodySemiboldText } from "@/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, View } from "react-native";
import { QuickActionButton } from "./QuickActionButton";

interface QuickActionsSectionProps {
  storeUsername?: string;
  pendingOrdersBadge: number;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  storeUsername,
  pendingOrdersBadge,
}) => {
  const router = useRouter();

  return (
    <View className="px-4 mb-4">
      <BodySemiboldText style={{ fontSize: 15, marginBottom: 12 }}>
        Quick Actions
      </BodySemiboldText>
      <View
        className="flex-row justify-between bg-white rounded-2xl py-4 px-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <QuickActionButton
          icon="plus.circle.fill"
          label="Add Product"
          iconColor="#3B2F2F"
          iconBgColor="#F5F5F5"
          onPress={() => router.push("/(tabs)/product")}
        />
        <QuickActionButton
          icon="bag.fill"
          label="Orders"
          iconColor="#3B82F6"
          iconBgColor="rgba(59, 130, 246, 0.1)"
          onPress={() => router.push("/(tabs)/orders")}
          badge={pendingOrdersBadge}
        />
        <QuickActionButton
          icon="shippingbox.fill"
          label="Products"
          iconColor="#8B5CF6"
          iconBgColor="rgba(139, 92, 246, 0.1)"
          onPress={() => router.push("/(tabs)/my-products")}
        />
        <QuickActionButton
          icon="storefront.fill"
          label="My Store"
          iconColor="#22C55E"
          iconBgColor="rgba(34, 197, 94, 0.1)"
          onPress={() =>
            storeUsername &&
            Linking.openURL(`https://${storeUsername}.thriftverse.shop/`)
          }
        />
      </View>
    </View>
  );
};
