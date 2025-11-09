import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllAvailableProducts, getAllStores } from '@/lib/api-helpers';
import { ProductWithStore, Profile } from '@/lib/types/database';
import {
  filterProductsBySearch,
  filterProductsByCategory,
  filterProductsByAvailability,
  filterStoresBySearch,
  sortProducts,
  sortStores,
  ProductSortOption,
  StoreSortOption,
} from '@/lib/explore-helpers';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import ProductCard from '@/components/molecules/ProductCard';
import StoreCard from '@/components/molecules/StoreCard';
import { Ionicons } from '@expo/vector-icons';

type ExploreTab = 'products' | 'stores';

export default function ExploreScreen() {
  // Tab state
  const [activeTab, setActiveTab] = useState<ExploreTab>('products');

  // Data state
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [stores, setStores] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Product filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [productSortBy, setProductSortBy] = useState<ProductSortOption>('newest');

  // Store filters
  const [storeSortBy, setStoreSortBy] = useState<StoreSortOption>('newest');

  // Sort menu visibility
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsResult, storesResult] = await Promise.all([
        getAllAvailableProducts(),
        getAllStores(),
      ]);
      setProducts(productsResult.data);
      setStores(storesResult.data);
    } catch (error) {
      console.error('Error fetching explore data:', error);
    } finally {
      setLoading(false);
    }
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
    setSearchQuery('');
    setSelectedCategories([]);
    setInStockOnly(false);
    setProductSortBy('newest');
    setStoreSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    inStockOnly ||
    productSortBy !== 'newest' ||
    storeSortBy !== 'newest';

  const productSortOptions: { value: ProductSortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' },
  ];

  const storeSortOptions: { value: StoreSortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Products ({filteredProducts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stores' && styles.activeTab]}
            onPress={() => setActiveTab('stores')}
          >
            <Text style={[styles.tabText, activeTab === 'stores' && styles.activeTabText]}>
              Stores ({filteredStores.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Filters */}
        {activeTab === 'products' && (
          <View style={styles.filtersContainer}>
            {/* Categories */}
            <Text style={styles.filterLabel}>Categories</Text>
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
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}
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
                <View style={[styles.checkbox, inStockOnly && styles.checkboxChecked]}>
                  {inStockOnly && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
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
                        productSortBy === option.value && styles.sortOptionTextActive,
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

            {/* Clear Filters */}
            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearButton} onPress={resetFilters}>
                <Text style={styles.clearButtonText}>Clear all filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Store Sort */}
        {activeTab === 'stores' && (
          <View style={styles.filtersContainer}>
            <View style={styles.controlsRow}>
              <Text style={styles.resultCount}>{filteredStores.length} stores</Text>
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
                        storeSortBy === option.value && styles.sortOptionTextActive,
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
          {activeTab === 'products' ? (
            filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyStateTitle}>No products found</Text>
                <Text style={styles.emptyStateText}>Try adjusting your filters</Text>
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
              <Text style={styles.emptyStateText}>Try adjusting your search</Text>
            </View>
          ) : (
            filteredStores.map((store) => <StoreCard key={store.id} store={store} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  sortMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  sortOptionTextActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  clearButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textDecorationLine: 'underline',
  },
  resultCount: {
    fontSize: 14,
    color: '#666666',
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
  },
});
