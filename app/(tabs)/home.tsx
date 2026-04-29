import { RefreshScrollView } from "@/components/atoms/RefreshScrollView";
import {
  HomeBrowseSection,
  HomeExploreSearchBar,
  HomeGreetingHeader,
  HomeRecentOrders,
  RevenueOverview,
  StorefrontCard,
  WeeklyPerformanceCard,
} from "@/components/home-v2";
import { useAuth } from "@/contexts/AuthContext";
import { useRefresh } from "@/hooks/useRefresh";
import {
  getOrdersBySeller,
  getProductsByStoreId,
} from "@/lib/database-helpers";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileRevenue {
  pendingAmount: number;
  confirmedAmount: number;
  withdrawnAmount: number;
  withdrawalHistory: any[];
}

interface OrderData {
  id: string;
  short_id?: string;
  buyer_name: string;
  amount: number;
  earnings: number;
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
  data: number[];
  labels: string[];
  total: number;
  lastWeekTotal: number;
  growthPercent: number;
  highlightIndex: number;
}

const initialWeekly: WeeklyData = {
  data: [0, 0, 0, 0, 0, 0, 0],
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  total: 0,
  lastWeekTotal: 0,
  growthPercent: 0,
  highlightIndex: dayjs().day() === 0 ? 6 : dayjs().day() - 1,
};

export default function HomeScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const unreadCount = useAppSelector(
    (state) => state.notifications.unreadCount,
  );

  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(initialWeekly);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      dispatch(fetchUserProfile(user.id));

      const ordersResult = await getOrdersBySeller(user.id);
      const realOrders = ordersResult.success ? ordersResult.data : [];

      let orderItems: OrderData[] = [];

      if (realOrders.length > 0) {
        orderItems = realOrders.map((order: any) => {
          const shippingFee = order.shipping_fee || 0;
          const earnings = (order.amount || 0) - shippingFee;
          return {
            id: order.id,
            short_id: order.short_id,
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
        const { data: soldProducts } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
          limit: 100,
        });

        if (soldProducts && soldProducts.length > 0) {
          orderItems = soldProducts.map((product: any) => ({
            id: product.id,
            buyer_name: "Customer",
            amount: product.price,
            earnings: product.price,
            shipping_fee: 0,
            status:
              dayjs().diff(
                dayjs(product.updated_at || product.created_at),
                "day",
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

      setRecentOrders(orderItems.slice(0, 3));
      setWeeklyData(calculateWeeklyData(orderItems));
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData]),
  );

  const { refreshing, onRefresh } = useRefresh(loadDashboardData);

  const revenue = profile?.revenue as ProfileRevenue | undefined;
  const firstName = (profile?.name || "there").split(" ")[0];
  const avatarUrl = profile?.profile_image
    ? getProfileImageUrl(profile.profile_image)
    : null;

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: "#FAF7F2" }}
        edges={["top"]}
      >
        <StatusBar barStyle="dark-content" />
        <FullScreenLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "#FAF7F2" }}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />
      <RefreshScrollView refreshing={refreshing} onRefresh={onRefresh}>
        <HomeGreetingHeader
          name={firstName}
          avatarUrl={avatarUrl}
          unreadCount={unreadCount}
        />

        <HomeExploreSearchBar />

        {profile?.store_username && (
          <StorefrontCard
            storeUsername={profile.store_username}
            storeName={profile.name || profile.store_username}
          />
        )}

        <RevenueOverview
          pendingAmount={revenue?.pendingAmount || 0}
          confirmedAmount={revenue?.confirmedAmount || 0}
          withdrawnAmount={revenue?.withdrawnAmount || 0}
        />

        <WeeklyPerformanceCard
          data={weeklyData.data}
          labels={weeklyData.labels}
          highlightIndex={weeklyData.highlightIndex}
          growthPercent={weeklyData.growthPercent}
        />

        <HomeRecentOrders orders={recentOrders} />

        <HomeBrowseSection />
      </RefreshScrollView>
    </SafeAreaView>
  );
}

function calculateWeeklyData(orders: OrderData[]): WeeklyData {
  const today = dayjs();
  const labels: string[] = [];
  const data: number[] = [];
  let total = 0;
  let highlightIndex = 0;

  // Mon..Sun of the current week (start Monday)
  const startOfWeek = today.startOf("week").add(1, "day"); // Monday

  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, "day");
    const dayLetter = ["M", "T", "W", "T", "F", "S", "S"][i];
    labels.push(dayLetter);

    if (date.isSame(today, "day")) highlightIndex = i;

    const dayRevenue = orders
      .filter((o) => dayjs(o.created_at).isSame(date, "day"))
      .reduce((sum, o) => sum + (o.earnings || 0), 0);

    data.push(dayRevenue);
    total += dayRevenue;
  }

  // Last week total for growth %
  const lastWeekStart = startOfWeek.subtract(7, "day");
  const lastWeekEnd = startOfWeek.subtract(1, "day");
  const lastWeekTotal = orders
    .filter((o) => {
      const d = dayjs(o.created_at);
      return (
        d.isAfter(lastWeekStart.subtract(1, "second")) &&
        d.isBefore(lastWeekEnd.add(1, "day"))
      );
    })
    .reduce((sum, o) => sum + (o.earnings || 0), 0);

  const growthPercent =
    lastWeekTotal > 0
      ? Math.round(((total - lastWeekTotal) / lastWeekTotal) * 100)
      : total > 0
        ? 100
        : 0;

  return { data, labels, total, lastWeekTotal, growthPercent, highlightIndex };
}
