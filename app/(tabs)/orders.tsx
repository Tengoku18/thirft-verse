import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import {
  BodyBoldText,
  BodyExtraboldText,
  BodyRegularText,
  BodySmallSemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByBuyer, getOrdersBySeller } from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { OrderWithDetails } from "@/lib/types/database";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "purchases" | "sales";

interface OrderItemProps {
  order: OrderWithDetails;
  type: "purchase" | "sale";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return { bg: "#FEF3C7", text: "#D97706" };
    case "completed":
      return { bg: "#D1FAE5", text: "#059669" };
    case "cancelled":
      return { bg: "#FEE2E2", text: "#DC2626" };
    case "refunded":
      return { bg: "#E0E7FF", text: "#4F46E5" };
    default:
      return { bg: "#F3F4F6", text: "#6B7280" };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

function OrderItem({ order, type }: OrderItemProps) {
  const statusColors = getStatusColor(order.status);

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-3 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
    >
      <View className="p-4">
        {/* Header Row */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <CaptionText style={{ color: "#6B7280", fontWeight: "600" }}>
              {order.order_code || `#${order.id.slice(0, 8)}`}
            </CaptionText>
          </View>
          <View
            style={{
              backgroundColor: statusColors.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <CaptionText
              style={{
                color: statusColors.text,
                fontWeight: "700",
                fontSize: 11,
                textTransform: "capitalize",
              }}
            >
              {order.status}
            </CaptionText>
          </View>
        </View>

        {/* Product Info */}
        <View className="flex-row">
          {order.product?.cover_image && (
            <Image
              source={{ uri: getProductImageUrl(order.product.cover_image) }}
              className="w-16 h-16 rounded-xl mr-3"
              style={{ backgroundColor: "#F3F4F6" }}
            />
          )}
          <View className="flex-1 justify-center">
            <BodyBoldText
              style={{ fontSize: 15 }}
              className="mb-1"
              numberOfLines={2}
            >
              {order.product?.title || "Product"}
            </BodyBoldText>
            {type === "purchase" && order.seller && (
              <BodySmallSemiboldText
                style={{ color: "#6B7280", fontWeight: "400" }}
              >
                Sold by @{order.seller.store_username}
              </BodySmallSemiboldText>
            )}
            {type === "sale" && (
              <BodySmallSemiboldText
                style={{ color: "#6B7280", fontWeight: "400" }}
              >
                Buyer: {order.buyer_name}
              </BodySmallSemiboldText>
            )}
          </View>
          <View className="justify-center items-end">
            <BodyExtraboldText style={{ fontSize: 16 }}>
              {formatPrice(order.amount)}
            </BodyExtraboldText>
            <CaptionText style={{ color: "#9CA3AF", fontSize: 11 }} className="mt-1">
              {formatDate(order.created_at)}
            </CaptionText>
          </View>
        </View>

        {/* Shipping Address Preview for Sales */}
        {type === "sale" && order.status === "pending" && (
          <View className="mt-3 pt-3 border-t border-[#F3F4F6]">
            <View className="flex-row items-center">
              <IconSymbol name="location.fill" size={14} color="#6B7280" />
              <CaptionText
                style={{ color: "#6B7280" }}
                className="ml-1 flex-1"
                numberOfLines={1}
              >
                {order.shipping_address?.city}, {order.shipping_address?.state}
              </CaptionText>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ type }: { type: TabType }) {
  return (
    <View className="py-16 items-center px-6">
      <View className="w-24 h-24 rounded-full bg-[#FAFAFA] justify-center items-center mb-4">
        <IconSymbol
          name={type === "purchases" ? "bag" : "dollarsign.circle"}
          size={40}
          color="#9CA3AF"
        />
      </View>
      <HeadingBoldText className="mb-2 text-center">
        {type === "purchases" ? "No Purchases Yet" : "No Sales Yet"}
      </HeadingBoldText>
      <BodyRegularText
        className="text-center leading-relaxed"
        style={{ color: "#6B7280" }}
      >
        {type === "purchases"
          ? "Your purchase history will appear here once you buy something"
          : "Orders from your customers will appear here"}
      </BodyRegularText>
    </View>
  );
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("purchases");
  const [purchases, setPurchases] = useState<OrderWithDetails[]>([]);
  const [sales, setSales] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const [purchasesResult, salesResult] = await Promise.all([
        getOrdersByBuyer(user.email || ""),
        getOrdersBySeller(user.id),
      ]);

      if (purchasesResult.success) {
        setPurchases(purchasesResult.data as OrderWithDetails[]);
      }
      if (salesResult.success) {
        setSales(salesResult.data as OrderWithDetails[]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [user]);

  const currentOrders = activeTab === "purchases" ? purchases : sales;
  const pendingCount = {
    purchases: purchases.filter((o) => o.status === "pending").length,
    sales: sales.filter((o) => o.status === "pending").length,
  };

  if (loading) {
    return (
      <TabScreenLayout title="Orders">
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </TabScreenLayout>
    );
  }

  return (
    <TabScreenLayout title="Orders">
      <View className="flex-1 bg-[#FAFAFA]">
        {/* Tab Buttons */}
        <View className="bg-white px-4 pt-2 pb-0">
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F3F4F6",
              borderRadius: 12,
              padding: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab("purchases")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor:
                  activeTab === "purchases" ? "#FFFFFF" : "transparent",
                shadowColor: activeTab === "purchases" ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: activeTab === "purchases" ? 0.1 : 0,
                shadowRadius: 2,
                elevation: activeTab === "purchases" ? 2 : 0,
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
                <IconSymbol
                  name="bag"
                  size={18}
                  color={activeTab === "purchases" ? "#3B2F2F" : "#6B7280"}
                />
                <BodyBoldText
                  className="ml-2"
                  style={{
                    color: activeTab === "purchases" ? "#3B2F2F" : "#6B7280",
                  }}
                >
                  Purchases
                </BodyBoldText>
                {pendingCount.purchases > 0 && (
                  <View
                    style={{
                      backgroundColor: "#EF4444",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 6,
                    }}
                  >
                    <CaptionText
                      style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 11 }}
                    >
                      {pendingCount.purchases}
                    </CaptionText>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("sales")}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor:
                  activeTab === "sales" ? "#FFFFFF" : "transparent",
                shadowColor: activeTab === "sales" ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: activeTab === "sales" ? 0.1 : 0,
                shadowRadius: 2,
                elevation: activeTab === "sales" ? 2 : 0,
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
                <IconSymbol
                  name="dollarsign.circle"
                  size={18}
                  color={activeTab === "sales" ? "#3B2F2F" : "#6B7280"}
                />
                <BodyBoldText
                  className="ml-2"
                  style={{
                    color: activeTab === "sales" ? "#3B2F2F" : "#6B7280",
                  }}
                >
                  Sales
                </BodyBoldText>
                {pendingCount.sales > 0 && (
                  <View
                    style={{
                      backgroundColor: "#EF4444",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 6,
                    }}
                  >
                    <CaptionText
                      style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 11 }}
                    >
                      {pendingCount.sales}
                    </CaptionText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
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
          {currentOrders.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            currentOrders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                type={activeTab === "purchases" ? "purchase" : "sale"}
              />
            ))
          )}
        </ScrollView>
      </View>
    </TabScreenLayout>
  );
}
