import {
  BodyMediumText,
  BodySemiboldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { RecentOrderItem } from "./RecentOrderItem";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface OrderData {
  id: string;
  buyer_name: string;
  amount: number;
  status: string;
  created_at: string;
  product?: {
    id: string;
    title: string;
    cover_image: string;
  } | null;
}

interface RecentOrdersSectionProps {
  orders: OrderData[];
}

export const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = ({
  orders,
}) => {
  const router = useRouter();

  return (
    <View className="px-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <BodySemiboldText style={{ fontSize: 15 }}>
          Recent Orders
        </BodySemiboldText>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/orders")}
          className="flex-row items-center"
        >
          <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
            View All
          </BodyMediumText>
          <IconSymbol
            name="chevron.right"
            size={14}
            color="#6B7280"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <View key={order.id}>
              <RecentOrderItem
                order={order}
                onPress={() => router.push(`/order/${order.id}` as any)}
              />
              {index < orders.length - 1 && (
                <View className="h-px bg-[#F3F4F6] ml-[68px]" />
              )}
            </View>
          ))
        ) : (
          <View className="py-12 items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <IconSymbol name="bag" size={28} color="#9CA3AF" />
            </View>
            <BodySemiboldText style={{ color: "#6B7280", fontSize: 14 }}>
              No orders yet
            </BodySemiboldText>
            <BodyMediumText
              style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}
            >
              Orders will appear here
            </BodyMediumText>
          </View>
        )}
      </View>
    </View>
  );
};
