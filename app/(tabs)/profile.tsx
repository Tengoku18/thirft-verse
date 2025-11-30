import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { ProductGrid } from "@/components/molecules/ProductGrid";
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
import { getProductsByStoreId } from "@/lib/database-helpers";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  email: string;
  store_username: string;
  bio?: string;
  profile_image?: string;
}

type TabType = "listings" | "sold";

export default function ProfileScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState({ listings: 0, sold: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(
    tab === "sold" ? "sold" : "listings"
  );

  // Update active tab when navigating with tab param
  useEffect(() => {
    if (tab === "sold" || tab === "listings") {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    loadProfile();
    if (user) {
      loadProducts();
    }
  }, [user]);

  // Reload products when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadProducts();
      }
    }, [user])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadProducts()]);
    setRefreshing(false);
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get user profile from metadata first (from signup)
      const userMetadata = user.user_metadata;

      // Try to get from profiles table if it exists
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && profileData) {
        setProfile({
          name: profileData.name,
          email: user.email || "",
          store_username: profileData.store_username,
          bio: profileData.bio,
          profile_image: profileData.profile_image,
        });
      } else {
        // Fallback to user metadata if profile doesn't exist in DB
        setProfile({
          name: userMetadata?.name || "User",
          email: user.email || "",
          store_username: userMetadata?.username || "username",
          bio: "", // Empty bio to show placeholder
          profile_image: userMetadata?.profile_image,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile({
        name: user?.user_metadata?.name || "User",
        email: user?.email || "",
        store_username: user?.user_metadata?.username || "username",
        bio: "", // Empty bio to show placeholder
        profile_image: user?.user_metadata?.profile_image,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!user) return;

    setLoadingProducts(true);
    try {
      // Fetch all products (available + out of stock)
      const { data: allProducts, count: totalCount } =
        await getProductsByStoreId({
          storeId: user.id,
          limit: 100, // Load up to 100 products
        });

      // Fetch available products count
      const { count: availableCount } = await getProductsByStoreId({
        storeId: user.id,
        status: "available",
      });

      // Calculate sold items (out of stock)
      const soldCount = (totalCount || 0) - (availableCount || 0);

      setProducts(allProducts);
      setProductsCount({
        listings: availableCount || 0,
        sold: soldCount,
      });
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <BodyRegularText
          className="text-center"
          style={{ color: "#6B7280", fontSize: 18 }}
        >
          Unable to load profile
        </BodyRegularText>
      </View>
    );
  }

  // Filter products based on active tab
  const filteredProducts = products.filter((product) => {
    if (activeTab === "listings") {
      return product.status === "available";
    } else {
      return product.status === "out_of_stock";
    }
  });

  return (
    <TabScreenLayout
      title="Profile"
      rightComponent={
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <IconSymbol name="line.3.horizontal" size={24} color="#3B2F2F" />
        </TouchableOpacity>
      }
    >
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B2F2F"
            colors={["#3B2F2F"]}
          />
        }
      >
        {/* Profile Content */}
        <View className="px-6 pb-6">
          {/* Profile Info Row */}
          <View className="flex-row items-center mb-5">
            {/* Avatar with Border */}
            <View className="mr-7">
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  padding: 3,
                  backgroundColor: "#F5F5F5",
                }}
              >
                {profile.profile_image ? (
                  <Image
                    source={{ uri: getProfileImageUrl(profile.profile_image) }}
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 42,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 42,
                      backgroundColor: "#3B2F2F",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 30 }}>
                      {profile.name.charAt(0).toUpperCase()}
                    </HeadingBoldText>
                  </View>
                )}
              </View>
            </View>

            {/* Stats Row - Enhanced Marketplace Style */}
            <View className="flex-1 flex-row justify-around">
              <TouchableOpacity
                className="items-center"
                onPress={() => setActiveTab("listings")}
              >
                <BodyExtraboldText style={{ fontSize: 20 }} className="mb-1">
                  {productsCount.listings}
                </BodyExtraboldText>
                <BodySmallSemiboldText style={{ color: "#6B7280" }}>
                  Listings
                </BodySmallSemiboldText>
              </TouchableOpacity>

              <View
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "#E5E7EB",
                }}
              />

              <TouchableOpacity
                className="items-center"
                onPress={() => setActiveTab("sold")}
              >
                <BodyExtraboldText style={{ fontSize: 20 }} className="mb-1">
                  {productsCount.sold}
                </BodyExtraboldText>
                <BodySmallSemiboldText style={{ color: "#6B7280" }}>
                  Sold
                </BodySmallSemiboldText>
              </TouchableOpacity>

              <View
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "#E5E7EB",
                }}
              />

              <TouchableOpacity className="items-center">
                <BodyExtraboldText style={{ fontSize: 20 }} className="mb-1">
                  0
                </BodyExtraboldText>
                <BodySmallSemiboldText style={{ color: "#6B7280" }}>
                  Reviews
                </BodySmallSemiboldText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name and Bio - Instagram Style */}
          <View className="mb-3">
            <BodyBoldText style={{ fontSize: 15 }} className="mb-1">
              {profile.name}
            </BodyBoldText>

            {/* Bio Section - Enhanced */}
            {profile.bio && profile.bio.trim() !== "" ? (
              <BodyRegularText className="leading-relaxed">
                {profile.bio}
              </BodyRegularText>
            ) : (
              <TouchableOpacity
                onPress={() => router.push("/edit-profile")}
                activeOpacity={0.7}
              >
                <BodyRegularText
                  className="leading-relaxed"
                  style={{ color: "#9CA3AF", fontStyle: "italic" }}
                >
                  Add a bio to tell your story...
                </BodyRegularText>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={() => router.push("/edit-profile")}
              style={{
                flex: 1,
                backgroundColor: "#EFEFEF",
                height: 36,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 6,
              }}
              activeOpacity={0.7}
            >
              <IconSymbol name="pencil" size={16} color="#3B2F2F" />
              <BodySmallSemiboldText style={{ fontWeight: "700" }}>
                Edit Profile
              </BodySmallSemiboldText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                try {
                  const storeUrl = `https://${profile.store_username}.thriftverse.shop`;
                  await Share.share({
                    message: `Check out my ThriftVerse store!\n${storeUrl}`,
                    url: storeUrl,
                  });
                } catch (error) {
                  console.error("Error sharing:", error);
                }
              }}
              style={{
                flex: 1,
                backgroundColor: "#EFEFEF",
                height: 36,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 6,
              }}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="square.and.arrow.up"
                size={16}
                color="#3B2F2F"
              />
              <BodySmallSemiboldText style={{ fontWeight: "700" }}>
                Share
              </BodySmallSemiboldText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Buttons - Enhanced Design */}
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 0.5,
            borderTopColor: "#DBDBDB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("listings")}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "listings" ? "#3B2F2F" : "transparent",
            }}
            activeOpacity={0.7}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <IconSymbol
                name="square.grid.3x3.fill"
                size={18}
                color={activeTab === "listings" ? "#3B2F2F" : "#9CA3AF"}
              />
              <CaptionText
                style={{
                  color: activeTab === "listings" ? "#3B2F2F" : "#9CA3AF",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Listings
              </CaptionText>
              <View
                style={{
                  backgroundColor:
                    activeTab === "listings" ? "#3B2F2F" : "#E5E7EB",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 10,
                  minWidth: 24,
                }}
              >
                <CaptionText
                  className="text-center"
                  style={{
                    color: activeTab === "listings" ? "#FFFFFF" : "#6B7280",
                    fontWeight: "700",
                    fontSize: 10,
                  }}
                >
                  {productsCount.listings}
                </CaptionText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("sold")}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: "center",
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "sold" ? "#3B2F2F" : "transparent",
            }}
            activeOpacity={0.7}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={18}
                color={activeTab === "sold" ? "#3B2F2F" : "#9CA3AF"}
              />
              <CaptionText
                style={{
                  color: activeTab === "sold" ? "#3B2F2F" : "#9CA3AF",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Sold
              </CaptionText>
              <View
                style={{
                  backgroundColor: activeTab === "sold" ? "#3B2F2F" : "#E5E7EB",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 10,
                  minWidth: 24,
                }}
              >
                <CaptionText
                  className="text-center"
                  style={{
                    color: activeTab === "sold" ? "#FFFFFF" : "#6B7280",
                    fontWeight: "700",
                    fontSize: 10,
                  }}
                >
                  {productsCount.sold}
                </CaptionText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Products Grid Section - Instagram Style */}
        <View>
          {loadingProducts ? (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color="#3B2F2F" />
              <BodyRegularText style={{ color: "#6B7280" }} className="mt-4">
                Loading products...
              </BodyRegularText>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="py-16 items-center px-6">
              <View className="w-24 h-24 rounded-full bg-[#FAFAFA] justify-center items-center mb-4">
                {activeTab === "listings" ? (
                  <IconSymbol name="bag" size={40} color="#9CA3AF" />
                ) : (
                  <IconSymbol
                    name="checkmark.seal.fill"
                    size={40}
                    color="#9CA3AF"
                  />
                )}
              </View>
              <HeadingBoldText className="mb-2 text-center">
                {activeTab === "listings"
                  ? "No Active Listings"
                  : "No Sold Items"}
              </HeadingBoldText>
              <BodyRegularText
                className="text-center leading-relaxed"
                style={{ color: "#6B7280" }}
              >
                {activeTab === "listings"
                  ? "Start listing your thrift finds to share with the community"
                  : "Your sold items will appear here once you complete sales"}
              </BodyRegularText>
            </View>
          ) : (
            <ProductGrid
              products={filteredProducts}
              onProductPress={(product) => {
                router.push(`/product/${product.id}`);
              }}
            />
          )}
        </View>
      </ScrollView>
    </TabScreenLayout>
  );
}
