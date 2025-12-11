import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyBoldText,
  BodyMediumText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersBySeller, getProductsByStoreId } from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import dayjs from "dayjs";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string | null;
  buyer_name: string;
  amount: number;
  status: string;
  created_at: string;
}

interface TopProduct {
  id: string;
  title: string;
  image: string | null;
  totalSales: number;
  orderCount: number;
}

type TimePeriod = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

const TIME_PERIODS: { key: TimePeriod; label: string; days: number }[] = [
  { key: "1D", label: "1D", days: 1 },
  { key: "1W", label: "1W", days: 7 },
  { key: "1M", label: "1M", days: 30 },
  { key: "3M", label: "3M", days: 90 },
  { key: "6M", label: "6M", days: 180 },
  { key: "1Y", label: "1Y", days: 365 },
];

const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString()}`;

const formatCompactPrice = (amount: number): string => {
  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }
  return `Rs. ${amount.toLocaleString()}`;
};

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1W");

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const ordersResult = await getOrdersBySeller(user.id);
      let orderItems: OrderItem[] = [];

      if (ordersResult.success && ordersResult.data.length > 0) {
        orderItems = ordersResult.data.map((order: any) => ({
          id: order.id,
          product_id: order.product_id || order.product?.id,
          product_title: order.product?.title || "Order Item",
          product_image: order.product?.cover_image || null,
          buyer_name: order.buyer_name,
          amount: order.amount,
          status: order.status,
          created_at: order.created_at,
        }));
      } else {
        const { data: soldProducts } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
          limit: 100,
        });

        if (soldProducts && soldProducts.length > 0) {
          orderItems = soldProducts.map((product: any) => ({
            id: product.id,
            product_id: product.id,
            product_title: product.title,
            product_image: product.cover_image,
            buyer_name: "Customer",
            amount: product.price,
            status: dayjs().diff(dayjs(product.updated_at || product.created_at), "day") > 7 ? "completed" : "pending",
            created_at: product.updated_at || product.created_at,
          }));
        }
      }

      setAllOrders(orderItems);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Get filtered orders for selected period
  const getFilteredOrders = () => {
    const period = TIME_PERIODS.find(p => p.key === selectedPeriod);
    if (!period) return allOrders;

    const startDate = dayjs().subtract(period.days, "day");
    return allOrders.filter(order => dayjs(order.created_at).isAfter(startDate));
  };

  // Get previous period orders for comparison
  const getPreviousPeriodOrders = () => {
    const period = TIME_PERIODS.find(p => p.key === selectedPeriod);
    if (!period) return [];

    const currentStart = dayjs().subtract(period.days, "day");
    const previousStart = dayjs().subtract(period.days * 2, "day");

    return allOrders.filter(order => {
      const orderDate = dayjs(order.created_at);
      return orderDate.isAfter(previousStart) && orderDate.isBefore(currentStart);
    });
  };

  // Calculate chart data based on selected period
  const getChartData = () => {
    const filteredOrders = getFilteredOrders();
    const period = TIME_PERIODS.find(p => p.key === selectedPeriod);
    if (!period) return { labels: [], data: [] };

    const now = dayjs();
    let labels: string[] = [];
    let data: number[] = [];

    if (selectedPeriod === "1D") {
      // Hourly data for today
      for (let i = 23; i >= 0; i -= 4) {
        const hour = now.subtract(i, "hour");
        labels.push(hour.format("ha"));
        const hourOrders = filteredOrders.filter(o =>
          dayjs(o.created_at).isSame(hour, "hour")
        );
        data.push(hourOrders.reduce((sum, o) => sum + o.amount, 0));
      }
    } else if (selectedPeriod === "1W") {
      // Daily data for last 7 days
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = now.subtract(i, "day");
        labels.push(days[date.day()]);
        const dayOrders = filteredOrders.filter(o =>
          dayjs(o.created_at).isSame(date, "day")
        );
        data.push(dayOrders.reduce((sum, o) => sum + o.amount, 0));
      }
    } else if (selectedPeriod === "1M") {
      // Weekly data for last month
      for (let i = 3; i >= 0; i--) {
        const weekStart = now.subtract(i * 7, "day");
        labels.push(`W${4 - i}`);
        const weekOrders = filteredOrders.filter(o => {
          const orderDate = dayjs(o.created_at);
          return orderDate.isAfter(weekStart.subtract(7, "day")) && orderDate.isBefore(weekStart.add(1, "day"));
        });
        data.push(weekOrders.reduce((sum, o) => sum + o.amount, 0));
      }
    } else {
      // Monthly data for longer periods
      const months = selectedPeriod === "3M" ? 3 : selectedPeriod === "6M" ? 6 : 12;
      for (let i = months - 1; i >= 0; i--) {
        const month = now.subtract(i, "month");
        labels.push(month.format("MMM"));
        const monthOrders = filteredOrders.filter(o =>
          dayjs(o.created_at).isSame(month, "month")
        );
        data.push(monthOrders.reduce((sum, o) => sum + o.amount, 0));
      }
    }

    return { labels, data: data.length > 0 ? data : [0] };
  };

  // Calculate top products
  const getTopProducts = (): TopProduct[] => {
    const filteredOrders = getFilteredOrders();
    const productMap = new Map<string, TopProduct>();

    filteredOrders.forEach(order => {
      const existing = productMap.get(order.product_id);
      if (existing) {
        existing.totalSales += order.amount;
        existing.orderCount += 1;
      } else {
        productMap.set(order.product_id, {
          id: order.product_id,
          title: order.product_title,
          image: order.product_image,
          totalSales: order.amount,
          orderCount: 1,
        });
      }
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);
  };

  const filteredOrders = getFilteredOrders();
  const previousOrders = getPreviousPeriodOrders();
  const chartData = getChartData();
  const topProducts = getTopProducts();

  // Calculate stats
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const previousRevenue = previousOrders.reduce((sum, o) => sum + o.amount, 0);
  const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const completedOrders = filteredOrders.filter(o => o.status === "completed").length;
  const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;

  const periodLabel = TIME_PERIODS.find(p => p.key === selectedPeriod)?.label || "";

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Sales Analytics" showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading analytics...
          </BodyMediumText>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Sales Analytics" showBackButton />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B2F2F" />
        }
      >
        {/* Time Period Selector */}
        <View className="flex-row mx-4 mt-4 bg-white rounded-2xl p-1.5" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key)}
              className="flex-1 py-2.5 rounded-xl items-center"
              style={{ backgroundColor: selectedPeriod === period.key ? "#3B2F2F" : "transparent" }}
            >
              <BodySemiboldText style={{ color: selectedPeriod === period.key ? "#FFFFFF" : "#6B7280", fontSize: 13 }}>
                {period.label}
              </BodySemiboldText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue Chart */}
        <View className="bg-white rounded-2xl p-4 mx-4 mt-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <CaptionText style={{ color: "#6B7280" }}>Revenue ({periodLabel})</CaptionText>
              <HeadingBoldText style={{ fontSize: 28, marginTop: 4 }}>
                {formatCompactPrice(totalRevenue)}
              </HeadingBoldText>
            </View>
            {revenueGrowth !== 0 && (
              <View className="flex-row items-center px-3 py-1.5 rounded-full" style={{ backgroundColor: revenueGrowth > 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)" }}>
                <IconSymbol name={revenueGrowth > 0 ? "arrow.up.right" : "arrow.down.right"} size={14} color={revenueGrowth > 0 ? "#22C55E" : "#EF4444"} />
                <BodySemiboldText style={{ color: revenueGrowth > 0 ? "#22C55E" : "#EF4444", fontSize: 12, marginLeft: 4 }}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </BodySemiboldText>
              </View>
            )}
          </View>

          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.data.length > 0 ? chartData.data : [0], color: (opacity = 1) => `rgba(59, 47, 47, ${opacity})`, strokeWidth: 2 }],
            }}
            width={screenWidth - 64}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 47, 47, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#3B2F2F" },
              propsForBackgroundLines: { strokeDasharray: "", stroke: "#F3F4F6", strokeWidth: 1 },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16, marginLeft: -16 }}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            fromZero={true}
          />
        </View>

        {/* Summary Stats */}
        <View className="flex-row mx-4 mt-4" style={{ gap: 12 }}>
          <View className="flex-1 bg-white rounded-2xl p-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}>
              <IconSymbol name="bag.fill" size={18} color="#3B82F6" />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Orders</CaptionText>
            <HeadingBoldText style={{ fontSize: 20, marginTop: 2 }}>{filteredOrders.length}</HeadingBoldText>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
              <IconSymbol name="chart.bar.fill" size={18} color="#8B5CF6" />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Avg. Order</CaptionText>
            <HeadingBoldText style={{ fontSize: 20, marginTop: 2 }}>{formatCompactPrice(avgOrderValue)}</HeadingBoldText>
          </View>
        </View>

        <View className="flex-row mx-4 mt-3" style={{ gap: 12 }}>
          <View className="flex-1 bg-white rounded-2xl p-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
              <IconSymbol name="checkmark.circle.fill" size={18} color="#22C55E" />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Completed</CaptionText>
            <HeadingBoldText style={{ fontSize: 20, marginTop: 2 }}>{completedOrders}</HeadingBoldText>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
            <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
              <IconSymbol name="clock.fill" size={18} color="#F59E0B" />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Pending</CaptionText>
            <HeadingBoldText style={{ fontSize: 20, marginTop: 2 }}>{pendingOrders}</HeadingBoldText>
          </View>
        </View>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <View className="mt-6 px-4">
            <BodySemiboldText style={{ fontSize: 15, marginBottom: 12 }}>Top Products</BodySemiboldText>
            <View className="bg-white rounded-2xl overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              {topProducts.map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center p-4">
                    <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
                      <BodyBoldText style={{ color: "#6B7280", fontSize: 12 }}>#{index + 1}</BodyBoldText>
                    </View>
                    {product.image ? (
                      <Image source={{ uri: getProductImageUrl(product.image) }} className="w-12 h-12 rounded-xl" style={{ backgroundColor: "#F3F4F6" }} />
                    ) : (
                      <View className="w-12 h-12 rounded-xl bg-[#F3F4F6] items-center justify-center">
                        <IconSymbol name="bag.fill" size={18} color="#9CA3AF" />
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <BodySemiboldText style={{ fontSize: 14 }} numberOfLines={1}>{product.title}</BodySemiboldText>
                      <CaptionText style={{ color: "#6B7280", marginTop: 2 }}>{product.orderCount} orders</CaptionText>
                    </View>
                    <View className="items-end">
                      <BodyBoldText style={{ fontSize: 15, color: "#059669" }}>{formatCompactPrice(product.totalSales)}</BodyBoldText>
                    </View>
                  </View>
                  {index < topProducts.length - 1 && <View className="h-px bg-[#F3F4F6] ml-[76px]" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Orders List */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <BodySemiboldText style={{ fontSize: 15 }}>Orders ({periodLabel})</BodySemiboldText>
            <CaptionText style={{ color: "#6B7280" }}>{filteredOrders.length} total</CaptionText>
          </View>

          {filteredOrders.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "#F3F4F6" }}>
                <IconSymbol name="chart.bar.fill" size={28} color="#9CA3AF" />
              </View>
              <BodySemiboldText style={{ color: "#6B7280", fontSize: 14 }}>No orders in this period</BodySemiboldText>
              <BodyMediumText style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4, textAlign: "center" }}>
                Try selecting a different time range
              </BodyMediumText>
            </View>
          ) : (
            <View className="bg-white rounded-2xl overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              {filteredOrders.slice(0, 20).map((order, index) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => router.push(`/order/${order.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center p-4">
                    {order.product_image ? (
                      <Image source={{ uri: getProductImageUrl(order.product_image) }} className="w-14 h-14 rounded-xl" style={{ backgroundColor: "#F3F4F6" }} />
                    ) : (
                      <View className="w-14 h-14 rounded-xl bg-[#F3F4F6] items-center justify-center">
                        <IconSymbol name="bag.fill" size={20} color="#9CA3AF" />
                      </View>
                    )}
                    <View className="flex-1 ml-3">
                      <BodySemiboldText style={{ fontSize: 14 }} numberOfLines={1}>{order.product_title}</BodySemiboldText>
                      <View className="flex-row items-center mt-1">
                        <IconSymbol name="person.fill" size={10} color="#9CA3AF" />
                        <CaptionText style={{ color: "#6B7280", marginLeft: 4 }}>{order.buyer_name}</CaptionText>
                      </View>
                      <CaptionText style={{ color: "#9CA3AF", marginTop: 2, fontSize: 11 }}>
                        {dayjs(order.created_at).format("DD MMM, YYYY • h:mm A")}
                      </CaptionText>
                    </View>
                    <View className="items-end">
                      <BodyBoldText style={{ fontSize: 15, color: "#059669" }}>{formatPrice(order.amount)}</BodyBoldText>
                      <View className="px-2 py-1 rounded-full mt-1" style={{ backgroundColor: order.status === "completed" ? "#D1FAE5" : "#FEF3C7" }}>
                        <CaptionText style={{ color: order.status === "completed" ? "#059669" : "#D97706", fontSize: 10, fontWeight: "600" }}>
                          {order.status === "completed" ? "Completed" : "Pending"}
                        </CaptionText>
                      </View>
                    </View>
                  </View>
                  {index < Math.min(filteredOrders.length, 20) - 1 && <View className="h-px bg-[#F3F4F6] ml-[82px]" />}
                </TouchableOpacity>
              ))}
              {filteredOrders.length > 20 && (
                <View className="py-3 items-center border-t border-[#F3F4F6]">
                  <CaptionText style={{ color: "#6B7280" }}>Showing 20 of {filteredOrders.length} orders</CaptionText>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
