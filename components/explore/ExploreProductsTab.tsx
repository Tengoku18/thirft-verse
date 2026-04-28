import { ExploreCategoryChips } from "@/components/explore/ExploreCategoryChips";
import { ExploreFilterRow } from "@/components/explore/ExploreFilterRow";
import { ExploreProductCard } from "@/components/explore/ExploreProductCard";
import { ExploreProductSkeleton } from "@/components/explore/ExploreProductSkeleton";
import { ExploreSearchBar } from "@/components/explore/ExploreSearchBar";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts } from "@/lib/api-helpers";
import {
  filterProductsByAvailability,
  filterProductsByCategory,
  filterProductsBySearch,
  filterProductsByVerification,
  ProductSortOption,
  sortProducts,
} from "@/lib/explore-helpers";
import { ProductWithStore } from "@/lib/types/database";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

const PAGE_SIZE = 20;

interface HeaderProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  selectedCategories: string[];
  onToggle: (cat: string) => void;
  onClearAll: () => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  sortBy: ProductSortOption;
  onSortChange: (v: ProductSortOption) => void;
}

function ProductsListHeader({
  searchQuery,
  onSearch,
  selectedCategories,
  onToggle,
  onClearAll,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
}: HeaderProps) {
  return (
    <View style={{ backgroundColor: "#FAF7F2", paddingBottom: 8 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <ExploreSearchBar
          value={searchQuery}
          onChangeText={onSearch}
          placeholder="Search products..."
        />
      </View>
      <ExploreCategoryChips
        selected={selectedCategories}
        onToggle={onToggle}
        onClearAll={onClearAll}
      />
      <ExploreFilterRow
        inStockOnly={inStockOnly}
        onToggleInStock={onToggleInStock}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
    </View>
  );
}

function ProductsEmptyLoading() {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 10,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={{ width: "47%" }}>
          <ExploreProductSkeleton />
        </View>
      ))}
    </View>
  );
}

function ProductsEmptyState() {
  return (
    <View className="py-16 items-center px-4">
      <Ionicons name="cube-outline" size={56} color="#CCCCCC" />
      <Typography variation="h4" style={{ color: "#3B2F2F", marginTop: 12 }}>
        No products found
      </Typography>
      <Typography
        variation="body-sm"
        style={{ color: "#9CA3AF", marginTop: 4 }}
      >
        Try adjusting your filters
      </Typography>
    </View>
  );
}

export function ExploreProductsTab() {
  const { user } = useAuth();
  // Use stable primitive (string) so fetchPage doesn't recreate on every render
  const userId = user?.id;

  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState<ProductSortOption>("newest");

  const pageRef = useRef(0);
  const fetchingRef = useRef(false);
  // Track hasMore in a ref so handleEndReached never has a stale closure
  const hasMoreRef = useRef(true);

  const fetchPage = useCallback(
    async (page: number, reset = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const result = await getAllAvailableProducts(
          PAGE_SIZE,
          page * PAGE_SIZE,
        );
        const fetched = userId
          ? result.data.filter((p) => p.store_id !== userId)
          : result.data;
        hasMoreRef.current = result.data.length === PAGE_SIZE;
        setProducts((prev) => (reset ? fetched : [...prev, ...fetched]));
      } catch {
        // silently fail
      } finally {
        fetchingRef.current = false;
      }
    },
    [userId], // stable primitive — only changes on real login/logout
  );

  useEffect(() => {
    setLoading(true);
    pageRef.current = 0;
    hasMoreRef.current = true;
    fetchPage(0, true).finally(() => setLoading(false));
  }, [fetchPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 0;
    hasMoreRef.current = true;
    await fetchPage(0, true);
    setRefreshing(false);
  }, [fetchPage]);

  const handleEndReached = useCallback(() => {
    // Use ref for hasMore to avoid stale closure
    if (loadingMore || !hasMoreRef.current || loading || fetchingRef.current)
      return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setLoadingMore(true);
    fetchPage(nextPage).finally(() => setLoadingMore(false));
  }, [fetchPage]);

  const filteredProducts = useMemo(() => {
    let r = filterProductsBySearch(products, searchQuery);
    r = filterProductsByCategory(r, selectedCategories);
    r = filterProductsByAvailability(r, inStockOnly);
    r = filterProductsByVerification(r, true);
    return sortProducts(r, sortBy);
  }, [products, searchQuery, selectedCategories, inStockOnly, sortBy]);

  const toggleCategory = useCallback(
    (cat: string) =>
      setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
      ),
    [],
  );

  // Stable callback so FlatList doesn't remount the header on every render
  const renderListHeader = useCallback(
    () => (
      <ProductsListHeader
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onClearAll={() => setSelectedCategories([])}
        inStockOnly={inStockOnly}
        onToggleInStock={() => setInStockOnly((v) => !v)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    ),
    [searchQuery, selectedCategories, inStockOnly, sortBy, toggleCategory],
  );

  const renderListEmpty = useCallback(
    () => (loading ? <ProductsEmptyLoading /> : <ProductsEmptyState />),
    [loading],
  );

  const renderListFooter = useCallback(
    () =>
      loadingMore ? (
        <ActivityIndicator
          size="small"
          color="#3B2F2F"
          style={{ marginVertical: 16 }}
        />
      ) : null,
    [loadingMore],
  );

  const renderItem = useCallback(
    ({ item }: { item: ProductWithStore }) => (
      <View style={{ width: "48%" }}>
        <ExploreProductCard product={item} />
      </View>
    ),
    [],
  );

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      ListHeaderComponent={renderListHeader}
      ListEmptyComponent={renderListEmpty}
      ListFooterComponent={renderListFooter}
      columnWrapperStyle={{ gap: 10, paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingBottom: 130 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#3B2F2F"
          colors={["#3B2F2F"]}
        />
      }
      removeClippedSubviews={false}
      scrollEventThrottle={16}
      renderItem={renderItem}
    />
  );
}
