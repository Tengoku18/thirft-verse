'use client'

import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { ProductWithStore, Profile } from '@/types/database'
import {
  filterProductsByAvailability, filterProductsByCategory, filterProductsBySearch,
  filterStoresBySearch, ProductSortOption, sortProducts,
  sortStores, StoreSortOption
} from '@/utils/exploreHelpers'
import { Package, Store } from 'lucide-react'
import { useMemo, useState } from 'react'
import ProductCard from '../ProductCard'
import StoreCard from '../StoreCard'
import type { ExploreTab } from './index'
import {
  ExploreNavbar,
  ExploreTabs,
  PRODUCT_SORT_OPTIONS,
  SearchBar,
  SortSelect,
  STORE_SORT_OPTIONS,
} from './index'

interface ExploreContentProps {
  initialProducts: ProductWithStore[]
  initialStores: Profile[]
}

export default function ExploreContent({
  initialProducts,
  initialStores,
}: ExploreContentProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<ExploreTab>('products')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  // Product filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [productSortBy, setProductSortBy] = useState<ProductSortOption>('newest')

  // Store filters
  const [storeSortBy, setStoreSortBy] = useState<StoreSortOption>('newest')

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts

    // Apply search
    filtered = filterProductsBySearch(filtered, searchQuery)

    // Apply category filter
    filtered = filterProductsByCategory(filtered, selectedCategories)

    // Apply availability filter
    filtered = filterProductsByAvailability(filtered, inStockOnly)

    // Apply sort
    filtered = sortProducts(filtered, productSortBy)

    return filtered
  }, [initialProducts, searchQuery, selectedCategories, inStockOnly, productSortBy])

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let filtered = initialStores

    // Apply search
    filtered = filterStoresBySearch(filtered, searchQuery)

    // Apply sort
    filtered = sortStores(filtered, storeSortBy)

    return filtered
  }, [initialStores, searchQuery, storeSortBy])

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setInStockOnly(false)
    setProductSortBy('newest')
    setStoreSortBy('newest')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    inStockOnly ||
    productSortBy !== 'newest' ||
    storeSortBy !== 'newest'

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <ExploreNavbar />

      {/* Main Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-8 flex flex-col gap-6">
          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            {/* Search */}
            <div className="w-full sm:w-96">
              <SearchBar
                placeholder={`Search ${activeTab}...`}
                onSearch={setSearchQuery}
              />
            </div>

            {/* Tabs */}
            <ExploreTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              productsCount={filteredProducts.length}
              storesCount={filteredStores.length}
            />
          </div>

          {/* Filters Bar */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-4">
              {/* Categories - Horizontal Scroll */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Categories</span>
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2 pb-1">
                    {PRODUCT_CATEGORIES.map((category) => {
                      const isSelected = selectedCategories.includes(category)
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategories(selectedCategories.filter(c => c !== category))
                            } else {
                              setSelectedCategories([...selectedCategories, category])
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                        >
                          {category}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  {/* In Stock Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0"
                    />
                    <span className="text-sm text-neutral-700">In stock only</span>
                  </label>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Results & Sort */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-500">
                    {filteredProducts.length} products
                  </span>
                  <div className="w-44">
                    <SortSelect
                      value={productSortBy}
                      onChange={setProductSortBy}
                      options={PRODUCT_SORT_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Controls */}
          {activeTab === 'stores' && (
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="text-sm text-neutral-500">
                {filteredStores.length} stores
              </span>
              <div className="w-44">
                <SortSelect
                  value={storeSortBy}
                  onChange={setStoreSortBy}
                  options={STORE_SORT_OPTIONS}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {activeTab === 'products' ? (
          filteredProducts.length === 0 ? (
            <div className="py-32 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
              <p className="text-lg font-medium text-neutral-900 mb-1">
                No products found
              </p>
              <p className="text-sm text-neutral-500">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={product.store?.currency || 'USD'}
                />
              ))}
            </div>
          )
        ) : (
          filteredStores.length === 0 ? (
            <div className="py-32 text-center">
              <Store className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
              <p className="text-lg font-medium text-neutral-900 mb-1">
                No stores found
              </p>
              <p className="text-sm text-neutral-500">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} profile={store} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
