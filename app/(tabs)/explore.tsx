import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import ProductCard from "@/components/molecules/ProductCard";
import { ProductCardSkeleton } from "@/components/molecules/ProductCardSkeleton";
import StoreCard from "@/components/molecules/StoreCard";
import { StoreCardSkeleton } from "@/components/molecules/StoreCardSkeleton";
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
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ExploreTab = "products" | "stores";

export default function ExploreScreen() {
  const { user } = useAuth();

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
      <View style={styles.skeletonContainer}>
        {activeTab === "products" ? (
          <View style={styles.productSkeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <View key={key} style={styles.productSkeletonItem}>
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

  const SearchBar = (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#9CA3AF"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
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
  );

  return (
    <TabScreenLayout title="Explore" stickyComponent={SearchBar}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "products" && styles.activeTab]}
            onPress={() => setActiveTab("products")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "products" && styles.activeTabText,
              ]}
            >
              Products ({filteredProducts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "stores" && styles.activeTab]}
            onPress={() => setActiveTab("stores")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "stores" && styles.activeTabText,
              ]}
            >
              Stores ({filteredStores.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Filters */}
        {activeTab === "products" && (
          <View style={styles.filtersContainer}>
            {/* Categories Header with Clear Button */}
            <View style={styles.categoriesHeader}>
              <Text style={styles.filterLabel}>Categories</Text>
              {hasActiveFilters && (
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.clearButtonText}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {PRODUCT_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setInStockOnly(!inStockOnly)}
              >
                <View
                  style={[
                    styles.checkbox,
                    inStockOnly && styles.checkboxChecked,
                  ]}
                >
                  {inStockOnly && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>In stock only</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Ionicons name="swap-vertical" size={16} color="#1A1A1A" />
                <Text style={styles.sortButtonText}>Sort</Text>
              </TouchableOpacity>
            </View>

            {/* Sort Menu */}
            {showSortMenu && (
              <View style={styles.sortMenu}>
                {productSortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.sortOption}
                    onPress={() => {
                      setProductSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        productSortBy === option.value &&
                          styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
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
          <View style={styles.filtersContainer}>
            <View style={styles.controlsRow}>
              <Text style={styles.resultCount}>
                {filteredStores.length} stores
              </Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <Ionicons name="swap-vertical" size={16} color="#1A1A1A" />
                <Text style={styles.sortButtonText}>Sort</Text>
              </TouchableOpacity>
            </View>

            {/* Sort Menu */}
            {showSortMenu && (
              <View style={styles.sortMenu}>
                {storeSortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.sortOption}
                    onPress={() => {
                      setStoreSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        storeSortBy === option.value &&
                          styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
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
        <View style={styles.resultsContainer}>
          {loading ? (
            renderSkeletonLoading()
          ) : activeTab === "products" ? (
            filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyStateTitle}>No products found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your filters
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.productRow}
                scrollEnabled={false}
              />
            )
          ) : filteredStores.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No stores found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search
              </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skeletonContainer: {
    paddingTop: 8,
  },
  productSkeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productSkeletonItem: {
    width: "48%",
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#3B2F2F",
    fontFamily: "NunitoSans_400Regular",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },
  activeTab: {
    borderBottomColor: "#3B2F2F",
  },
  tabText: {
    fontSize: 15,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#3B2F2F",
    fontFamily: "NunitoSans_700Bold",
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: "NunitoSans_700Bold",
    color: "#6B7280",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#3B2F2F",
    borderColor: "#3B2F2F",
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#6B7280",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3B2F2F",
    borderColor: "#3B2F2F",
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: "NunitoSans_500Medium",
    color: "#3B2F2F",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#3B2F2F",
    marginLeft: 6,
  },
  sortMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sortOptionText: {
    fontSize: 14,
    fontFamily: "NunitoSans_500Medium",
    color: "#6B7280",
  },
  sortOptionTextActive: {
    color: "#3B2F2F",
    fontFamily: "NunitoSans_700Bold",
  },
  clearButtonText: {
    fontSize: 13,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#DC2626",
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "NunitoSans_500Medium",
    color: "#6B7280",
  },
  resultsContainer: {
    paddingHorizontal: 12,
  },
  productRow: {
    justifyContent: "space-between",
    gap: 8,
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "NunitoSans_700Bold",
    color: "#3B2F2F",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "NunitoSans_400Regular",
    color: "#6B7280",
  },
});
