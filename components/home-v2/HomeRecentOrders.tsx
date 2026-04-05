import BagIcon from "@/components/icons/BagIcon";
import { Typography } from "@/components/ui/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { HomeOrderCard } from "./HomeOrderCard";

interface OrderData {
  id: string;
  short_id?: string;
  amount: number;
  status: string;
  created_at: string;
  product?: {
    id: string;
    title: string;
    cover_image: string;
  } | null;
}

interface HomeRecentOrdersProps {
  orders: OrderData[];
}

export const HomeRecentOrders: React.FC<HomeRecentOrdersProps> = ({
  orders,
}) => {
  const router = useRouter();

  return (
    <View className="px-5 mt-5">
      <View className="flex-row items-center justify-between mb-3">
        <Typography variation="h5" style={{ fontSize: 16, color: "#3B2F2F" }}>
          Recent Orders
        </Typography>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/orders")}
          activeOpacity={0.7}
        >
          <Typography
            variation="label"
            style={{ fontSize: 12, fontWeight: "700", color: "#D4A373" }}
          >
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      {orders.length > 0 ? (
        <View style={{ gap: 10 }}>
          {orders.map((order) => (
            <HomeOrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/order/${order.id}` as any)}
            />
          ))}
        </View>
      ) : (
        <View
          className="bg-white py-10 items-center rounded-2xl"
          style={{
            borderWidth: 1,
            borderColor: "rgba(59,47,47,0.05)",
          }}
        >
          <View
            className="w-14 h-14 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: "rgba(59,47,47,0.05)" }}
          >
            <BagIcon width={24} height={24} />
          </View>
          <Typography
            variation="label"
            style={{ color: "#3B2F2F", fontSize: 14 }}
          >
            No orders yet
          </Typography>
          <Typography
            variation="body-sm"
            style={{
              color: "rgba(59,47,47,0.5)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Orders will appear here
          </Typography>
        </View>
      )}
    </View>
  );
};
