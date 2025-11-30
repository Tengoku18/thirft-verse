import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import ProductCard from "@/components/molecules/ProductCard";
import {
  BodyExtraboldText,
  BodyRegularText,
  BodySemiboldText,
  BodySmallSemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts } from "@/lib/api-helpers";
import { getProductsByStoreId } from "@/lib/database-helpers";
import { ProductWithStore } from "@/lib/types/database";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface Stats {
  itemsSold: number;
  totalViews: number;
  totalProducts: number;
  monthlyEarnings: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [exploreProducts, setExploreProducts] = useState<ProductWithStore[]>([]);
  const [stats, setStats] = useState<Stats>({
    itemsSold: 0,
    totalViews: 0,
    totalProducts: 0,
    monthlyEarnings: 0,
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
        const { count: totalCount } = await getProductsByStoreId({
          storeId: user.id,
          limit: 100,
        });

        const { count: soldCount } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
        });

        setStats({
          itemsSold: soldCount || 0,
          totalViews: 0,
          totalProducts: totalCount || 0,
          monthlyEarnings: 0,
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
    <TabScreenLayout
      title="Home"
      rightComponent={
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <IconSymbol name="gearshape" size={24} color="#3B2F2F" />
        </TouchableOpacity>
      }
    >
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
        {/* Statistics Section */}
        <View className="px-6 pt-4">
          <HeadingBoldText className="mb-4">Statistics</HeadingBoldText>

          {/* Stats Grid - 2x2 */}
          <View className="flex-row gap-3 mb-3">
            <StatCard
              label="Items sold"
              value={stats.itemsSold.toString()}
              icon="checkmark.seal.fill"
              bgColor="#FEF2F2"
              iconBgColor="#FEE2E2"
              textColor="#DC2626"
              onPress={() => router.push("/(tabs)/profile?tab=sold")}
            />
            <StatCard
              label="Total views"
              value={formatNumber(stats.totalViews)}
              icon="eye.fill"
              bgColor="#F5F3FF"
              iconBgColor="#EDE9FE"
              textColor="#7C3AED"
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label="Monthly earn"
              value={`NPR ${formatNumber(stats.monthlyEarnings)}`}
              icon="banknote"
              bgColor="#F9FAFB"
              iconBgColor="#F3F4F6"
              textColor="#374151"
            />
            <StatCard
              label="Total Products"
              value={stats.totalProducts.toString()}
              icon="bag.fill"
              bgColor="#EFF6FF"
              iconBgColor="#DBEAFE"
              textColor="#2563EB"
              onPress={() => router.push("/(tabs)/profile?tab=listings")}
            />
          </View>
        </View>

        {/* Explore Section */}
        <View className="mt-6">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <HeadingBoldText>Explore</HeadingBoldText>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/explore")}
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
                <View key={product.id} style={{ width: '47%' }}>
                  <ProductCard
                    product={product}
                    onPress={() => Linking.openURL(`https://www.thriftverse.shop/product/${product.id}`)}
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

// Stat Card Component - Updated Design
function StatCard({
  label,
  value,
  icon,
  bgColor,
  iconBgColor,
  textColor,
  onPress,
}: {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  onPress?: () => void;
}) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: bgColor }}
      {...(onPress && { onPress, activeOpacity: 0.7 })}
    >
      <View className="flex-row items-center justify-between mb-3">
        <BodySmallSemiboldText style={{ color: textColor }}>
          {label}
        </BodySmallSemiboldText>
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconSymbol name={icon as any} size={16} color={textColor} />
        </View>
      </View>
      <BodyExtraboldText style={{ color: textColor, fontSize: 26 }}>
        {value}
      </BodyExtraboldText>
    </Container>
  );
}

