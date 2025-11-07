import { ProductGrid } from "@/components/molecules/ProductGrid";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsByStoreId } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
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
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState({ listings: 0, sold: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("listings");

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
        console.log('🔄 Profile screen focused, reloading products...');
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
      // Set default profile data
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/signin");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
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
        <ThemedText
          className="text-lg text-center"
          style={{ color: "#6B7280" }}
        >
          Unable to load profile
        </ThemedText>
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
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3B2F2F"
          colors={['#3B2F2F']}
        />
      }
    >
      {/* Header - Clean Design */}
      <View className="px-6 pt-14 pb-6">
        {/* Username Header with Settings Icon */}
        <View className="flex-row items-center justify-between mb-6">
          <ThemedText
            className="text-[28px] font-[PlayfairDisplay_700Bold] leading-tight"
            style={{ color: "#3B2F2F" }}
          >
            {profile.store_username}
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="w-10 h-10 justify-center items-center"
            activeOpacity={0.7}
          >
            <IconSymbol name="line.3.horizontal" size={24} color="#3B2F2F" />
          </TouchableOpacity>
        </View>

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
                  source={{ uri: profile.profile_image }}
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
                  <ThemedText
                    className="text-3xl font-bold font-[PlayfairDisplay_700Bold]"
                    style={{ color: "#FFFFFF" }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </ThemedText>
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
              <ThemedText
                className="text-[20px] font-[NunitoSans_800ExtraBold] mb-1"
                style={{ color: "#3B2F2F" }}
              >
                {productsCount.listings}
              </ThemedText>
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold]"
                style={{ color: "#6B7280" }}
              >
                Listings
              </ThemedText>
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
              <ThemedText
                className="text-[20px] font-[NunitoSans_800ExtraBold] mb-1"
                style={{ color: "#3B2F2F" }}
              >
                {productsCount.sold}
              </ThemedText>
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold]"
                style={{ color: "#6B7280" }}
              >
                Sold
              </ThemedText>
            </TouchableOpacity>

            <View
              style={{
                width: 1,
                height: 40,
                backgroundColor: "#E5E7EB",
              }}
            />

            <TouchableOpacity className="items-center">
              <ThemedText
                className="text-[20px] font-[NunitoSans_800ExtraBold] mb-1"
                style={{ color: "#3B2F2F" }}
              >
                0
              </ThemedText>
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold]"
                style={{ color: "#6B7280" }}
              >
                Reviews
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name and Bio - Instagram Style */}
        <View className="mb-3">
          <ThemedText
            className="text-[15px] font-[NunitoSans_700Bold] mb-1"
            style={{ color: "#3B2F2F" }}
          >
            {profile.name}
          </ThemedText>

          {/* Bio Section - Enhanced */}
          {profile.bio && profile.bio.trim() !== "" ? (
            <ThemedText
              className="text-[14px] font-[NunitoSans_400Regular] leading-relaxed"
              style={{ color: "#3B2F2F" }}
            >
              {profile.bio}
            </ThemedText>
          ) : (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Add Bio",
                  "Tell us about yourself and your thrift shop! Share your story with the community.",
                  [
                    { text: "Later", style: "cancel" },
                    {
                      text: "Add Bio",
                      onPress: () => {
                        // TODO: Navigate to edit profile screen
                        Alert.alert(
                          "Edit Profile",
                          "Edit profile functionality coming soon!"
                        );
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <ThemedText
                className="text-[14px] font-[NunitoSans_400Regular] leading-relaxed"
                style={{ color: "#9CA3AF", fontStyle: "italic" }}
              >
                Add a bio to tell your story...
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Edit Profile",
                "Edit profile functionality coming soon!"
              )
            }
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
            <ThemedText
              className="text-[13px] font-[NunitoSans_700Bold]"
              style={{ color: "#3B2F2F" }}
            >
              Edit Profile
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Share Profile",
                `Share your ThriftVerse profile @${profile.store_username} with others!`
              );
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
            <IconSymbol name="square.and.arrow.up" size={16} color="#3B2F2F" />
            <ThemedText
              className="text-[13px] font-[NunitoSans_700Bold]"
              style={{ color: "#3B2F2F" }}
            >
              Share
            </ThemedText>
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <IconSymbol
              name="square.grid.3x3.fill"
              size={18}
              color={activeTab === "listings" ? "#3B2F2F" : "#9CA3AF"}
            />
            <ThemedText
              className="text-[12px] font-[NunitoSans_700Bold] uppercase tracking-wider"
              style={{
                color: activeTab === "listings" ? "#3B2F2F" : "#9CA3AF",
              }}
            >
              Listings
            </ThemedText>
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
              <ThemedText
                className="text-[10px] font-[NunitoSans_700Bold] text-center"
                style={{
                  color: activeTab === "listings" ? "#FFFFFF" : "#6B7280",
                }}
              >
                {productsCount.listings}
              </ThemedText>
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
            borderBottomColor: activeTab === "sold" ? "#3B2F2F" : "transparent",
          }}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={18}
              color={activeTab === "sold" ? "#3B2F2F" : "#9CA3AF"}
            />
            <ThemedText
              className="text-[12px] font-[NunitoSans_700Bold] uppercase tracking-wider"
              style={{ color: activeTab === "sold" ? "#3B2F2F" : "#9CA3AF" }}
            >
              Sold
            </ThemedText>
            <View
              style={{
                backgroundColor: activeTab === "sold" ? "#3B2F2F" : "#E5E7EB",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 10,
                minWidth: 24,
              }}
            >
              <ThemedText
                className="text-[10px] font-[NunitoSans_700Bold] text-center"
                style={{ color: activeTab === "sold" ? "#FFFFFF" : "#6B7280" }}
              >
                {productsCount.sold}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Products Grid Section - Instagram Style */}
      <View>
        {loadingProducts ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color="#3B2F2F" />
            <ThemedText
              className="text-[14px] font-[NunitoSans_400Regular] mt-4"
              style={{ color: "#6B7280" }}
            >
              Loading products...
            </ThemedText>
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
            <ThemedText
              className="text-[20px] font-[PlayfairDisplay_700Bold] mb-2 text-center"
              style={{ color: "#3B2F2F" }}
            >
              {activeTab === "listings"
                ? "No Active Listings"
                : "No Sold Items"}
            </ThemedText>
            <ThemedText
              className="text-[14px] font-[NunitoSans_400Regular] text-center leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              {activeTab === "listings"
                ? "Start listing your thrift finds to share with the community"
                : "Your sold items will appear here once you complete sales"}
            </ThemedText>
          </View>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onProductPress={(product) => {
              // TODO: Navigate to product details screen
              Alert.alert("Product", `Viewing ${product.title}`);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
