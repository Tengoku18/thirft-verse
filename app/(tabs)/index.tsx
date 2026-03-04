import {
  QuickActionsSection,
  RecentOrdersSection,
  RevenueCard,
  SalesAnalyticsSection,
  StoreLinkCard,
  StoreOverviewSection,
} from "@/components/dashboard";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrdersBySeller,
  getProductsByStoreId,
} from "@/lib/database-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

interface ProfileRevenue {
  pendingAmount: number;
  confirmedAmount: number;
  withdrawnAmount: number;
  withdrawalHistory: any[];
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  availableProducts: number;
  outOfStock: number;
}

interface OrderData {
  id: string;
  buyer_name: string;
  amount: number; // Total amount (product + shipping)
  earnings: number; // Store owner earnings (amount - shipping_fee)
  shipping_fee: number;
  status: string;
  created_at: string;
  product?: {
    id: string;
    title: string;
    cover_image: string;
  } | null;
}

interface WeeklyData {
  labels: string[];
  data: number[];
  total: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    availableProducts: 0,
    outOfStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    labels: [],
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [user])
  );

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Refresh profile to get latest revenue data
      dispatch(fetchUserProfile(user.id));

      // Fetch products data
      const { count: totalProducts } = await getProductsByStoreId({
        storeId: user.id,
        limit: 100,
      });

      const { count: availableProducts } = await getProductsByStoreId({
        storeId: user.id,
        status: "available",
      });

      const { count: outOfStock } = await getProductsByStoreId({
        storeId: user.id,
        status: "out_of_stock",
      });

      // Fetch orders data
      const ordersResult = await getOrdersBySeller(user.id);
      const realOrders = ordersResult.success ? ordersResult.data : [];

      let pendingOrders = 0;
      let completedOrders = 0;
      let totalOrders = 0;
      let orderItems: OrderData[] = [];

      if (realOrders.length > 0) {
        // Pending = only pending status (matches Orders screen filter)
        pendingOrders = realOrders.filter(
          (o: any) => o.status === "pending"
        ).length;
        // Completed = only completed status (matches Orders screen filter)
        completedOrders = realOrders.filter(
          (o: any) => o.status === "completed"
        ).length;
        totalOrders = realOrders.length;
        // Map orders with earnings calculation
        orderItems = realOrders.map((order: any) => {
          const shippingFee = order.shipping_fee || 0;
          const earnings = (order.amount || 0) - shippingFee;
          return {
            id: order.id,
            buyer_name: order.buyer_name,
            amount: order.amount || 0,
            earnings,
            shipping_fee: shippingFee,
            status: order.status,
            created_at: order.created_at,
            product: order.product,
          };
        });
      } else {
        // Fallback to sold products (same as orders screen)
        const { data: soldProducts } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
          limit: 100,
        });

        if (soldProducts && soldProducts.length > 0) {
          // Calculate pending/completed based on days since sold (7 day threshold)
          soldProducts.forEach((product: any) => {
            const soldDate = dayjs(product.updated_at || product.created_at);
            const daysSinceSold = dayjs().diff(soldDate, "day");
            if (daysSinceSold > 7) {
              completedOrders++;
            } else {
              pendingOrders++;
            }
          });
          totalOrders = soldProducts.length;
          // Convert sold products to order format for recent orders
          orderItems = soldProducts.map((product: any) => ({
            id: product.id,
            buyer_name: "Customer",
            amount: product.price,
            earnings: product.price, // For sold products, earnings = price
            shipping_fee: 0,
            status:
              dayjs().diff(
                dayjs(product.updated_at || product.created_at),
                "day"
              ) > 7
                ? "completed"
                : "pending",
            created_at: product.updated_at || product.created_at,
            product: {
              id: product.id,
              title: product.title,
              cover_image: product.cover_image,
            },
          }));
        }
      }

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalProducts: totalProducts || 0,
        availableProducts: availableProducts || 0,
        outOfStock: outOfStock || 0,
      });

      // Set recent orders (last 5)
      setRecentOrders(orderItems.slice(0, 5));

      // Calculate weekly data
      const weeklyStats = calculateWeeklyData(orderItems);
      setWeeklyData(weeklyStats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyData = (orders: OrderData[]): WeeklyData => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = dayjs();
    const labels: string[] = [];
    const data: number[] = [];
    let total = 0;

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, "day");
      labels.push(days[date.day()]);

      const dayOrders = orders.filter((order) =>
        dayjs(order.created_at).isSame(date, "day")
      );

      // Use earnings (amount - shipping_fee) instead of total amount
      const dayRevenue = dayOrders.reduce(
        (sum: number, order) => sum + (order.earnings || 0),
        0
      );
      data.push(dayRevenue);
      total += dayRevenue;
    }

    return { labels, data, total };
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
      </View>
    );
  }

  return (
    <TabScreenLayout showTextLogo>
      {profile?.store_username && (
        <StoreLinkCard storeUsername={profile.store_username} />
      )}
      <ScrollView
        className="flex-1 bg-[#FAFAFA]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B2F2F"
            colors={["#3B2F2F"]}
          />
        }
      >
        <RevenueCard
          availableBalance={
            (profile?.revenue as ProfileRevenue)?.confirmedAmount || 0
          }
          pendingAmount={
            (profile?.revenue as ProfileRevenue)?.pendingAmount || 0
          }
          withdrawnAmount={
            (profile?.revenue as ProfileRevenue)?.withdrawnAmount || 0
          }
        />

        <QuickActionsSection
          storeUsername={profile?.store_username}
          pendingOrdersBadge={stats.pendingOrders}
        />

        <StoreOverviewSection
          totalOrders={stats.totalOrders}
          totalProducts={stats.totalProducts}
          availableProducts={stats.availableProducts}
          pendingOrders={stats.pendingOrders}
          outOfStock={stats.outOfStock}
        />

        <SalesAnalyticsSection
          data={weeklyData.data}
          labels={weeklyData.labels}
          totalAmount={weeklyData.total}
        />

        <RecentOrdersSection orders={recentOrders} />
      </ScrollView>
    </TabScreenLayout>
  );
}
