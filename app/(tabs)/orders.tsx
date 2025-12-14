import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import {
  BodyBoldText,
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersBySeller } from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import dayjs from "dayjs";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed";

// Unified item type that works for both orders and sold products
interface OrderItem {
  id: string;
  type: "order" | "sold_product";
  order_code: string | null;
  product_title: string;
  product_image: string | null;
  buyer_name: string;
  amount: number;
  shipping_fee: number;
  payment_method: string;
  status: string; // Can be: pending, shipped, completed, cancelled, refunded
  created_at: string;
  // Original data for navigation
  originalId: string;
}

interface OrderCardProps {
  item: OrderItem;
  onPress?: () => void;
}

const formatPrice = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "#FEF3C7", text: "#D97706", label: "Pending" },
  processing: { bg: "#DBEAFE", text: "#2563EB", label: "Processing" },
  shipping: { bg: "#93C5FD", text: "#1D4ED8", label: "Shipping" },
  delivered: { bg: "#D1FAE5", text: "#059669", label: "Delivered" },
  completed: { bg: "#D1FAE5", text: "#059669", label: "Completed" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626", label: "Cancelled" },
  refunded: { bg: "#E9D5FF", text: "#7C3AED", label: "Refunded" },
};

const defaultStatus = { bg: "#F3F4F6", text: "#6B7280", label: "Unknown" };

function OrderCard({ item, onPress }: OrderCardProps) {
  const itemDate = dayjs(item.created_at);
  const currentStatus = statusConfig[item.status] || defaultStatus;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Status Bar at Top */}
      <View
        style={{ backgroundColor: currentStatus.bg }}
        className="px-4 py-2 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: currentStatus.text }}
          />
          <CaptionText
            style={{
              color: currentStatus.text,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {currentStatus.label}
          </CaptionText>
        </View>
        <CaptionText style={{ color: currentStatus.text, fontSize: 11 }}>
          {item.order_code || `#${item.id.slice(0, 8).toUpperCase()}`}
        </CaptionText>
      </View>

      <View className="p-4">
        {/* Product Info Row */}
        <View className="flex-row">
          {/* Product Image */}
          {item.product_image ? (
            <Image
              source={{ uri: getProductImageUrl(item.product_image) }}
              className="w-20 h-20 rounded-xl"
              style={{ backgroundColor: "#F3F4F6" }}
            />
          ) : (
            <View className="w-20 h-20 rounded-xl bg-[#F3F4F6] justify-center items-center">
              <IconSymbol name="bag.fill" size={28} color="#9CA3AF" />
            </View>
          )}

          {/* Order Details */}
          <View className="flex-1 ml-4 justify-center">
            <BodyBoldText style={{ fontSize: 16 }} numberOfLines={2}>
              {item.product_title}
            </BodyBoldText>

            <View className="flex-row items-center mt-2">
              <IconSymbol name="person.fill" size={12} color="#6B7280" />
              <BodyMediumText
                style={{ color: "#6B7280", fontSize: 13, marginLeft: 4 }}
                numberOfLines={1}
              >
                {item.buyer_name}
              </BodyMediumText>
            </View>

            <HeadingBoldText
              style={{ fontSize: 18, color: "#3B2F2F", marginTop: 8 }}
            >
              {formatPrice(item.amount)}
            </HeadingBoldText>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-4 pt-3 border-t border-[#F3F4F6] flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconSymbol name="calendar" size={14} color="#9CA3AF" />
            <CaptionText
              style={{ color: "#9CA3AF", marginLeft: 4, fontSize: 12 }}
            >
              {itemDate.format("DD MMM, YYYY")}
            </CaptionText>
          </View>

          <View className="flex-row items-center bg-[#F3F4F6] px-2 py-1 rounded-md">
            <IconSymbol name="tag.fill" size={12} color="#6B7280" />
            <CaptionText
              style={{ color: "#6B7280", marginLeft: 4, fontSize: 11 }}
            >
              {item.payment_method}
            </CaptionText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View className="py-16 items-center px-6">
      <View className="w-24 h-24 rounded-full bg-[#F3F4F6] justify-center items-center mb-4">
        <IconSymbol name="bag.fill" size={40} color="#9CA3AF" />
      </View>
      <HeadingBoldText className="mb-2 text-center">
        No Orders Yet
      </HeadingBoldText>
      <BodyRegularText
        className="text-center leading-relaxed"
        style={{ color: "#6B7280" }}
      >
        When customers purchase your products, their orders will appear here for
        you to manage and track.
      </BodyRegularText>
    </View>
  );
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Set filter from query params
  useEffect(() => {
    if (filter === "pending" || filter === "completed") {
      setStatusFilter(filter);
    }
  }, [filter]);

  const loadData = async () => {
    if (!user) {
      console.log("⚠️ No user logged in");
      setLoading(false);
      return;
    }

    try {
      console.log("📦 Loading orders for user ID:", user.id);

      // First, try to get actual orders from the orders table
      const ordersResult = await getOrdersBySeller(user.id);

      console.log("📦 Orders result:", JSON.stringify(ordersResult, null, 2));

      let orderItems: OrderItem[] = [];

      if (ordersResult.success) {
        console.log("✅ Found orders:", ordersResult.data.length);
        if (ordersResult.data.length > 0) {
          console.log(
            "📦 First order:",
            JSON.stringify(ordersResult.data[0], null, 2)
          );
        }
        orderItems = ordersResult.data.map((order: any) => {
          const shippingFee = order.shipping_fee || 0;
          const productPrice = (order.amount || 0) - shippingFee;
          return {
            id: order.id,
            type: "order" as const,
            order_code: order.order_code || order.transaction_code || null,
            product_title: order.product?.title || "Order Item",
            product_image: order.product?.cover_image || null,
            buyer_name: order.buyer_name || "Customer",
            amount: productPrice,
            shipping_fee: shippingFee,
            payment_method: order.payment_method || "eSewa",
            status: order.status || "pending",
            created_at: order.created_at || new Date().toISOString(),
            originalId: order.id,
          };
        });
      } else {
        console.log("❌ Failed to fetch orders:", ordersResult.error);
      }

      setItems(orderItems);
    } catch (error) {
      console.error("💥 Error loading data:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filter items based on status
  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  // Count by status
  const statusCounts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    processing: items.filter((i) => i.status === "processing").length,
    shipping: items.filter((i) => i.status === "shipping").length,
    delivered: items.filter((i) => i.status === "delivered").length,
    completed: items.filter((i) => i.status === "completed").length,
  };

  // Calculate total revenue for filtered items
  const totalRevenue = filteredItems.reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <TabScreenLayout title="Orders">
        <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading orders...
          </BodyMediumText>
        </View>
      </TabScreenLayout>
    );
  }

  const filterOptions: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipping", label: "Shipping" },
    { key: "delivered", label: "Delivered" },
    { key: "completed", label: "Completed" },
  ];

  const handleItemPress = (item: OrderItem) => {
    // Always navigate to the single order detail screen
    // It handles both real orders and sold products dynamically
    router.push(`/order/${item.originalId}`);
  };

  return (
    <TabScreenLayout title="Orders">
      <View className="flex-1 bg-[#FAFAFA]">
        {/* Status Filter Tabs */}
        <View className="px-4 pt-4 pb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {filterOptions.map((option) => {
              const isActive = statusFilter === option.key;
              const count = statusCounts[option.key];

              return (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setStatusFilter(option.key)}
                  className="flex-row items-center px-4 py-2.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "#3B2F2F" : "#FFFFFF",
                    borderWidth: isActive ? 0 : 1,
                    borderColor: "#E5E7EB",
                  }}
                  activeOpacity={0.7}
                >
                  <BodySemiboldText
                    style={{
                      color: isActive ? "#FFFFFF" : "#374151",
                      fontSize: 14,
                    }}
                  >
                    {option.label}
                  </BodySemiboldText>
                  <View
                    className="ml-2 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "#F3F4F6",
                    }}
                  >
                    <CaptionText
                      style={{
                        color: isActive ? "#FFFFFF" : "#6B7280",
                        fontWeight: "700",
                        fontSize: 11,
                      }}
                    >
                      {count}
                    </CaptionText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B2F2F"
              colors={["#3B2F2F"]}
            />
          }
        >
          {filteredItems.length === 0 ? (
            <EmptyState />
          ) : (
            filteredItems.map((item) => (
              <OrderCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </TabScreenLayout>
  );
}
