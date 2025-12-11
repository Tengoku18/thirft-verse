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
import { useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

interface Stats {
  totalRevenue: number;
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
  amount: number;
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
  const profile = useAppSelector((state) => state.profile.profile);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
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

      let totalRevenue = 0;
      let pendingOrders = 0;
      let completedOrders = 0;
      let totalOrders = 0;
      let orderItems: OrderData[] = [];

      if (realOrders.length > 0) {
        // Use real orders
        totalRevenue = realOrders.reduce(
          (sum: number, order: any) => sum + (order.amount || 0),
          0
        );
        pendingOrders = realOrders.filter(
          (o: any) => o.status === "pending"
        ).length;
        completedOrders = realOrders.filter(
          (o: any) => o.status === "completed"
        ).length;
        totalOrders = realOrders.length;
        orderItems = realOrders;
      } else {
        // Fallback to sold products (same as orders screen)
        const { data: soldProducts } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
          limit: 100,
        });

        if (soldProducts && soldProducts.length > 0) {
          totalRevenue = soldProducts.reduce(
            (sum: number, product: any) => sum + (product.price || 0),
            0
          );
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
            status: dayjs().diff(dayjs(product.updated_at || product.created_at), "day") > 7 ? "completed" : "pending",
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
        totalRevenue,
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

  const calculateWeeklyData = (orders: any[]): WeeklyData => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = dayjs();
    const labels: string[] = [];
    const data: number[] = [];
    let total = 0;

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, "day");
      labels.push(days[date.day()]);

      const dayOrders = orders.filter((order: any) =>
        dayjs(order.created_at).isSame(date, "day")
      );

      const dayRevenue = dayOrders.reduce(
        (sum: number, order: any) => sum + (order.amount || 0),
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
    <TabScreenLayout title="Dashboard">
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
          totalRevenue={stats.totalRevenue}
          completedOrders={stats.completedOrders}
          pendingOrders={stats.pendingOrders}
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

        {profile?.store_username && (
          <StoreLinkCard storeUsername={profile.store_username} />
        )}
      </ScrollView>
    </TabScreenLayout>
  );
}
