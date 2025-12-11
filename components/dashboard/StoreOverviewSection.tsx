import { BodySemiboldText } from "@/components/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { DashboardStatCard } from "./DashboardStatCard";

interface StoreOverviewSectionProps {
  totalOrders: number;
  totalProducts: number;
  availableProducts: number;
  pendingOrders: number;
  outOfStock: number;
}

export const StoreOverviewSection: React.FC<StoreOverviewSectionProps> = ({
  totalOrders,
  totalProducts,
  availableProducts,
  pendingOrders,
  outOfStock,
}) => {
  const router = useRouter();

  return (
    <View className="px-4 mb-4">
      <BodySemiboldText style={{ fontSize: 15, marginBottom: 12 }}>
        Store Overview
      </BodySemiboldText>
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        <View style={{ width: "48%" }}>
          <DashboardStatCard
            title="Total Orders"
            value={totalOrders}
            icon="bag.fill"
            iconColor="#3B82F6"
            iconBgColor="rgba(59, 130, 246, 0.1)"
            onPress={() => router.push("/(tabs)/orders")}
          />
        </View>
        <View style={{ width: "48%" }}>
          <DashboardStatCard
            title="Available Products"
            value={availableProducts}
            icon="shippingbox.fill"
            iconColor="#8B5CF6"
            iconBgColor="rgba(139, 92, 246, 0.1)"
            onPress={() => router.push("/(tabs)/my-products?filter=available")}
          />
        </View>
        <View style={{ width: "48%" }}>
          <DashboardStatCard
            title="Pending Orders"
            value={pendingOrders}
            icon="clock.fill"
            iconColor="#F59E0B"
            iconBgColor="rgba(245, 158, 11, 0.1)"
            onPress={() => router.push("/(tabs)/orders?filter=pending")}
          />
        </View>
        <View style={{ width: "48%" }}>
          <DashboardStatCard
            title="Out of Stock"
            value={outOfStock}
            icon="exclamationmark.triangle.fill"
            iconColor="#EF4444"
            iconBgColor="rgba(239, 68, 68, 0.1)"
            onPress={() => router.push("/(tabs)/my-products?filter=out_of_stock")}
          />
        </View>
      </View>
    </View>
  );
};
