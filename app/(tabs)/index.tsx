import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import ProductCard from "@/components/molecules/ProductCard";
import {
  BodyBoldText,
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts } from "@/lib/api-helpers";
import { getOrdersBySeller, getProductsByStoreId } from "@/lib/database-helpers";
import { ProductWithStore } from "@/lib/types/database";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface Stats {
  itemsSold: number;
  pendingOrders: number;
  totalProducts: number;
  totalEarnings: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [exploreProducts, setExploreProducts] = useState<ProductWithStore[]>(
    []
  );
  const [stats, setStats] = useState<Stats>({
    itemsSold: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    try {
      // Load other users' products for explore section (exclude own products)
      const { data: allProducts } = await getAllAvailableProducts();
      const otherUsersProducts = user
        ? allProducts.filter((p) => p.store_id !== user.id)
        : allProducts;
      setExploreProducts(otherUsersProducts.slice(0, 4));

      // Load user's own stats if logged in
      if (user) {
        // Get product counts
        const { count: totalCount } = await getProductsByStoreId({
          storeId: user.id,
          limit: 100,
        });

        const { data: soldProducts, count: soldCount } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
        });

        // Try to get orders for real earnings data
        const ordersResult = await getOrdersBySeller(user.id);

        let totalEarnings = 0;
        let pendingOrders = 0;
        let itemsSold = soldCount || 0;

        if (ordersResult.success && ordersResult.data.length > 0) {
          // Calculate from real orders
          const orders = ordersResult.data;
          totalEarnings = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0);
          pendingOrders = orders.filter((o: any) => o.status === "pending").length;
          itemsSold = orders.filter((o: any) => o.status === "completed").length;
        } else if (soldProducts && soldProducts.length > 0) {
          // Fallback: calculate from sold products
          totalEarnings = soldProducts.reduce((sum, product) => sum + product.price, 0);
        }

        setStats({
          itemsSold,
          pendingOrders,
          totalProducts: totalCount || 0,
          totalEarnings,
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
      </View>
    );
  }

  return (
    <TabScreenLayout title="ThriftVerse">
      <ScrollView
        className="flex-1 bg-white"
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
        {/* Portfolio Card */}
        <View className="px-4 pt-4">
          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: "#3B2F2F",
              shadowColor: "#3B2F2F",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {/* Top Section - Balance */}
            <View className="mb-4">
              <BodyMediumText
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}
              >
                Total Earnings
              </BodyMediumText>
              <View className="flex-row items-center justify-between mt-2">
                <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 36 }}>
                  Rs. {formatNumber(stats.totalEarnings)}
                </HeadingBoldText>
                {stats.pendingOrders > 0 ? (
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/orders")}
                    className="flex-row items-center px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "rgba(251, 191, 36, 0.15)" }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="clock.fill" size={14} color="#F59E0B" />
                    <BodySemiboldText
                      style={{ color: "#F59E0B", fontSize: 14, marginLeft: 4 }}
                    >
                      {stats.pendingOrders} pending
                    </BodySemiboldText>
                  </TouchableOpacity>
                ) : (
                  <View
                    className="flex-row items-center px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                  >
                    <IconSymbol name="checkmark.circle.fill" size={14} color="#22C55E" />
                    <BodySemiboldText
                      style={{ color: "#22C55E", fontSize: 14, marginLeft: 4 }}
                    >
                      All done
                    </BodySemiboldText>
                  </View>
                )}
              </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row items-center mb-5">
              <TouchableOpacity
                className="flex-1 flex-row items-center"
                onPress={() => router.push("/profile?tab=sold")}
                activeOpacity={0.7}
              >
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                >
                  <IconSymbol
                    name="checkmark.seal.fill"
                    size={16}
                    color="#22C55E"
                  />
                </View>
                <View>
                  <BodyBoldText style={{ color: "#FFFFFF", fontSize: 18 }}>
                    {stats.itemsSold}
                  </BodyBoldText>
                  <BodyRegularText
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                  >
                    Items Sold
                  </BodyRegularText>
                </View>
              </TouchableOpacity>

              <View
                className="w-px h-10 mx-3"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />

              <TouchableOpacity
                className="flex-1 flex-row items-center"
                onPress={() => router.push("/profile?tab=listings")}
                activeOpacity={0.7}
              >
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                >
                  <IconSymbol
                    name="shippingbox.fill"
                    size={16}
                    color="#60A5FA"
                  />
                </View>
                <View>
                  <BodyBoldText style={{ color: "#FFFFFF", fontSize: 18 }}>
                    {stats.totalProducts}
                  </BodyBoldText>
                  <BodyRegularText
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
                  >
                    Products
                  </BodyRegularText>
                </View>
              </TouchableOpacity>
            </View>

            {/* Action Buttons Row */}
            <View
              className="flex-row items-center justify-between rounded-2xl p-2"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <TouchableOpacity
                className="flex-1 items-center py-3"
                onPress={() => router.push("/(tabs)/product")}
                activeOpacity={0.7}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <IconSymbol name="plus" size={20} color="#FFFFFF" />
                </View>
                <BodyMediumText style={{ color: "#FFFFFF", fontSize: 12 }}>
                  Add Product
                </BodyMediumText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center py-3"
                onPress={() => router.push("/(tabs)/orders")}
                activeOpacity={0.7}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <IconSymbol name="bag.fill" size={20} color="#FFFFFF" />
                </View>
                <BodyMediumText style={{ color: "#FFFFFF", fontSize: 12 }}>
                  Orders
                </BodyMediumText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center py-3"
                onPress={() => router.push("/profile?tab=listings")}
                activeOpacity={0.7}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <IconSymbol name="chart.bar.fill" size={20} color="#FFFFFF" />
                </View>
                <BodyMediumText style={{ color: "#FFFFFF", fontSize: 12 }}>
                  Analytics
                </BodyMediumText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Explore Section */}
        <View className="mt-6">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <HeadingBoldText>Explore</HeadingBoldText>
            <TouchableOpacity
              onPress={() => router.push("/explore")}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <BodySemiboldText style={{ color: "#6B7280" }} className="mr-1">
                See all
              </BodySemiboldText>
              <IconSymbol name="arrow.right" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Products Grid */}
          {exploreProducts.length > 0 ? (
            <View className="px-4 flex-row flex-wrap" style={{ gap: 12 }}>
              {exploreProducts.map((product) => (
                <View key={product.id} style={{ width: "47%" }}>
                  <ProductCard
                    product={product}
                    onPress={() => router.push(`/product/${product.id}`)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View className="px-6 py-12 items-center">
              <View className="w-20 h-20 rounded-full bg-[#F5F5F5] justify-center items-center mb-4">
                <IconSymbol name="bag" size={36} color="#9CA3AF" />
              </View>
              <BodySemiboldText style={{ fontSize: 16 }} className="mb-2">
                No products available
              </BodySemiboldText>
              <BodyRegularText
                style={{ color: "#6B7280" }}
                className="text-center"
              >
                Check back later for new items
              </BodyRegularText>
            </View>
          )}
        </View>
      </ScrollView>
    </TabScreenLayout>
  );
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
