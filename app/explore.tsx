import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import ProductCard from "@/components/molecules/ProductCard";
import { ProductCardSkeleton } from "@/components/molecules/ProductCardSkeleton";
import StoreCard from "@/components/molecules/StoreCard";
import { StoreCardSkeleton } from "@/components/molecules/StoreCardSkeleton";
import {
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts, getAllStores } from "@/lib/api-helpers";
import {
  filterProductsByAvailability,
  filterProductsByCategory,
  filterProductsBySearch,
  filterStoresBySearch,
  ProductSortOption,
  sortProducts,
  sortStores,
  StoreSortOption,
} from "@/lib/explore-helpers";
import { ProductWithStore, Profile } from "@/lib/types/database";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ExploreTab = "products" | "stores";

export default function ExploreScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<ExploreTab>("products");

  // Data state
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [stores, setStores] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Product filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [productSortBy, setProductSortBy] =
    useState<ProductSortOption>("newest");

  // Store filters
  const [storeSortBy, setStoreSortBy] = useState<StoreSortOption>("newest");

  // Sort menu visibility
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch data on mount and when user changes
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [productsResult, storesResult] = await Promise.all([
        getAllAvailableProducts(),
        getAllStores(),
      ]);
      // Filter out current user's own products
      const otherUsersProducts = user
        ? productsResult.data.filter((p) => p.store_id !== user.id)
        : productsResult.data;
      setProducts(otherUsersProducts);

      // Filter out current user's own store
      const otherUsersStores = user
        ? storesResult.data.filter((s) => s.id !== user.id)
        : storesResult.data;
      setStores(otherUsersStores);
    } catch (error) {
      console.error("Error fetching explore data:", error);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search
    filtered = filterProductsBySearch(filtered, searchQuery);

    // Apply category filter
    filtered = filterProductsByCategory(filtered, selectedCategories);

    // Apply availability filter
    filtered = filterProductsByAvailability(filtered, inStockOnly);

    // Apply sort
    filtered = sortProducts(filtered, productSortBy);

    return filtered;
  }, [products, searchQuery, selectedCategories, inStockOnly, productSortBy]);

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let filtered = stores;

    // Apply search
    filtered = filterStoresBySearch(filtered, searchQuery);

    // Apply sort
    filtered = sortStores(filtered, storeSortBy);

    return filtered;
  }, [stores, searchQuery, storeSortBy]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setInStockOnly(false);
    setProductSortBy("newest");
    setStoreSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    inStockOnly ||
    productSortBy !== "newest" ||
    storeSortBy !== "newest";

  const productSortOptions: { value: ProductSortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "Name: A to Z" },
    { value: "name-za", label: "Name: Z to A" },
  ];

  const storeSortOptions: { value: StoreSortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "name-az", label: "Name: A to Z" },
    { value: "name-za", label: "Name: Z to A" },
  ];

  const renderSkeletonLoading = () => {
    return (
      <View className="pt-2">
        {activeTab === "products" ? (
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <View key={key} style={{ width: "48%" }} className="mb-3">
                <ProductCardSkeleton />
              </View>
            ))}
          </View>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((key) => (
              <StoreCardSkeleton key={key} />
            ))}
          </>
        )}
      </View>
    );
  };

  // Header with back button + search bar in same line
  const HeaderWithSearch = (
    <View className="flex-row items-center px-4 pb-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="pr-2"
        activeOpacity={0.7}
      >
        <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center bg-white rounded-3xl px-3.5 py-2.5">
        <Ionicons name="search" size={20} color="#9CA3AF" className="mr-3" />
        <TextInput
          className="flex-1 text-[15px] text-[#3B2F2F]"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Sticky tabs component
  const StickyTabs = (
    <View className="bg-[#3B2F2F]">
      {HeaderWithSearch}
      <View className="flex-row px-4 bg-white border-b border-[#E5E7EB]">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "products" ? "border-[#3B2F2F]" : "border-transparent"
          }`}
          onPress={() => setActiveTab("products")}
          style={{ marginBottom: -1 }}
        >
          <BodySemiboldText
            style={{
              color: activeTab === "products" ? "#3B2F2F" : "#9CA3AF",
              fontSize: 15,
            }}
          >
            Products ({filteredProducts.length})
          </BodySemiboldText>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "stores" ? "border-[#3B2F2F]" : "border-transparent"
          }`}
          onPress={() => setActiveTab("stores")}
          style={{ marginBottom: -1 }}
        >
          <BodySemiboldText
            style={{
              color: activeTab === "stores" ? "#3B2F2F" : "#9CA3AF",
              fontSize: 15,
            }}
          >
            Stores ({filteredStores.length})
          </BodySemiboldText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TabScreenLayout showHeader={false} stickyComponent={StickyTabs}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
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
        {/* Product Filters */}
        {activeTab === "products" && (
          <View className="px-4 pt-4 mb-2">
            {/* Categories Header with Clear Button */}
            <View className="flex-row justify-between items-center mb-2.5">
              <BodySemiboldText style={{ color: "#6B7280", fontSize: 12 }}>
                Categories
              </BodySemiboldText>
              {hasActiveFilters && (
                <TouchableOpacity onPress={resetFilters}>
                  <BodySemiboldText style={{ color: "#DC2626", fontSize: 13 }}>
                    Clear all
                  </BodySemiboldText>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {PRODUCT_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2.5 rounded-full mr-2 border-[1.5px] ${
                      isSelected
                        ? "bg-[#3B2F2F] border-[#3B2F2F]"
                        : "bg-white border-[#E5E7EB]"
                    }`}
                    onPress={() => toggleCategory(category)}
                  >
                    <BodySemiboldText
                      style={{
                        color: isSelected ? "#FFFFFF" : "#6B7280",
                        fontSize: 14,
                      }}
                    >
                      {category}
                    </BodySemiboldText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Controls Row */}
            <View className="flex-row justify-between items-center mb-2">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setInStockOnly(!inStockOnly)}
              >
                <View
                  className={`w-[22px] h-[22px] rounded-md border-2 mr-2.5 justify-center items-center ${
                    inStockOnly
                      ? "bg-[#3B2F2F] border-[#3B2F2F]"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  {inStockOnly && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <BodyMediumText style={{ color: "#3B2F2F", fontSize: 14 }}>
                  In stock only
                </BodyMediumText>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB]"
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Ionicons name="swap-vertical" size={16} color="#1A1A1A" />
                <BodySemiboldText
                  style={{ color: "#3B2F2F", fontSize: 13, marginLeft: 4 }}
                >
                  Sort
                </BodySemiboldText>
              </TouchableOpacity>
            </View>

            {/* Sort Menu */}
            {showSortMenu && (
              <View className="bg-white rounded-xl p-2 mt-2 shadow-md">
                {productSortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="flex-row justify-between items-center py-3 px-3"
                    onPress={() => {
                      setProductSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                  >
                    <BodyMediumText
                      style={{
                        color:
                          productSortBy === option.value
                            ? "#3B2F2F"
                            : "#6B7280",
                        fontSize: 14,
                        fontWeight:
                          productSortBy === option.value ? "700" : "500",
                      }}
                    >
                      {option.label}
                    </BodyMediumText>
                    {productSortBy === option.value && (
                      <Ionicons name="checkmark" size={20} color="#1A1A1A" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Store Sort */}
        {activeTab === "stores" && (
          <View className="px-4 pt-3 pb-2">
            <View className="flex-row justify-between items-center mb-2">
              <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
                {filteredStores.length} stores
              </BodyMediumText>
              <TouchableOpacity
                className="flex-row items-center px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB]"
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Ionicons name="swap-vertical" size={14} color="#3B2F2F" />
                <BodySemiboldText
                  style={{ color: "#3B2F2F", fontSize: 13, marginLeft: 4 }}
                >
                  Sort
                </BodySemiboldText>
              </TouchableOpacity>
            </View>

            {/* Sort Menu */}
            {showSortMenu && (
              <View className="bg-white rounded-xl p-2 mt-2 shadow-md">
                {storeSortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="flex-row justify-between items-center py-3 px-3"
                    onPress={() => {
                      setStoreSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                  >
                    <BodyMediumText
                      style={{
                        color:
                          storeSortBy === option.value ? "#3B2F2F" : "#6B7280",
                        fontSize: 14,
                        fontWeight:
                          storeSortBy === option.value ? "700" : "500",
                      }}
                    >
                      {option.label}
                    </BodyMediumText>
                    {storeSortBy === option.value && (
                      <Ionicons name="checkmark" size={20} color="#1A1A1A" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Results */}
        <View className="px-4">
          {loading ? (
            renderSkeletonLoading()
          ) : activeTab === "products" ? (
            filteredProducts.length === 0 ? (
              <View className="py-16 items-center">
                <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
                <HeadingBoldText
                  style={{ color: "#3B2F2F", marginTop: 16, marginBottom: 4 }}
                >
                  No products found
                </HeadingBoldText>
                <BodyRegularText style={{ color: "#6B7280", fontSize: 14 }}>
                  Try adjusting your filters
                </BodyRegularText>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                  <View style={{ width: "47%" }}>
                    <ProductCard product={item} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
                scrollEnabled={false}
              />
            )
          ) : filteredStores.length === 0 ? (
            <View className="py-16 items-center">
              <Ionicons name="storefront-outline" size={64} color="#CCCCCC" />
              <HeadingBoldText
                style={{ color: "#3B2F2F", marginTop: 16, marginBottom: 4 }}
              >
                No stores found
              </HeadingBoldText>
              <BodyRegularText style={{ color: "#6B7280", fontSize: 14 }}>
                Try adjusting your search
              </BodyRegularText>
            </View>
          ) : (
            filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))
          )}
        </View>
      </ScrollView>
    </TabScreenLayout>
  );
}
