'use client'

import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { ProductWithStore, Profile } from '@/types/database'
import {
  filterProductsByAvailability, filterProductsByCategory, filterProductsBySearch,
  filterStoresBySearch, ProductSortOption, sortProducts,
  sortStores, StoreSortOption
} from '@/utils/exploreHelpers'
import { Package, RotateCcw, Sparkles, Store } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '../ProductCard'
import StoreCard from '../StoreCard'
import type { ExploreTab } from './index'
import {
  ExploreNavbar,
  ExploreSellerCTA,
  ExploreTabs,
  PRODUCT_SORT_OPTIONS,
  SearchBar,
  SortSelect,
  STORE_SORT_OPTIONS,
} from './index'

const PAGE_SIZE = 12

interface ExploreContentProps {
  initialProducts: ProductWithStore[]
  initialStores: Profile[]
}

export default function ExploreContent({
  initialProducts,
  initialStores,
}: ExploreContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = (searchParams.get('tab') as ExploreTab) || 'products'
  const setActiveTab = (tab: ExploreTab) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'products') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [productSortBy, setProductSortBy] = useState<ProductSortOption>('newest')
  const [storeSortBy, setStoreSortBy] = useState<StoreSortOption>('newest')

  const productSentinelRef = useRef<HTMLDivElement>(null)
  const storeSentinelRef = useRef<HTMLDivElement>(null)

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts
    filtered = filterProductsBySearch(filtered, searchQuery)
    filtered = filterProductsByCategory(filtered, selectedCategories)
    filtered = filterProductsByAvailability(filtered, inStockOnly)
    filtered = sortProducts(filtered, productSortBy)
    return filtered
  }, [initialProducts, searchQuery, selectedCategories, inStockOnly, productSortBy])

  const filteredStores = useMemo(() => {
    let filtered = initialStores
    filtered = filterStoresBySearch(filtered, searchQuery)
    filtered = sortStores(filtered, storeSortBy)
    return filtered
  }, [initialStores, searchQuery, storeSortBy])

  const productFilterKey = `${searchQuery}|${selectedCategories.join(',')}|${inStockOnly}|${productSortBy}`
  const storeFilterKey = `${searchQuery}|${storeSortBy}`
  const [productScroll, setProductScroll] = useState({ key: productFilterKey, count: PAGE_SIZE })
  const [storeScroll, setStoreScroll] = useState({ key: storeFilterKey, count: PAGE_SIZE })
  const visibleProductCount = productScroll.key === productFilterKey ? productScroll.count : PAGE_SIZE
  const visibleStoreCount = storeScroll.key === storeFilterKey ? storeScroll.count : PAGE_SIZE

  useEffect(() => {
    const sentinel = productSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setProductScroll((prev) => ({
            key: productFilterKey,
            count: Math.min(
              (prev.key === productFilterKey ? prev.count : PAGE_SIZE) + PAGE_SIZE,
              filteredProducts.length
            ),
          }))
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [filteredProducts.length, activeTab, productFilterKey])

  useEffect(() => {
    const sentinel = storeSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStoreScroll((prev) => ({
            key: storeFilterKey,
            count: Math.min(
              (prev.key === storeFilterKey ? prev.count : PAGE_SIZE) + PAGE_SIZE,
              filteredStores.length
            ),
          }))
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [filteredStores.length, activeTab, storeFilterKey])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setInStockOnly(false)
    setProductSortBy('newest')
    setStoreSortBy('newest')
  }

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategories.length > 0 ||
    inStockOnly ||
    productSortBy !== 'newest' ||
    storeSortBy !== 'newest'

  const displayedProducts = filteredProducts.slice(0, visibleProductCount)
  const displayedStores = filteredStores.slice(0, visibleStoreCount)

  const totalForTab = activeTab === 'products' ? filteredProducts.length : filteredStores.length

  return (
    <div className="bg-background min-h-screen">
      <ExploreNavbar />

      {/* Sticky marketplace filter bar — soft shadow instead of hard border */}
      <div className="bg-background/92 sticky top-14 z-40 shadow-[0_10px_24px_-20px_rgba(59,47,47,0.25)] backdrop-blur-md sm:top-16">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {/* Row 1: search + tabs */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="w-full sm:max-w-md sm:flex-1">
              <SearchBar
                placeholder={
                  activeTab === 'products'
                    ? 'Search products, styles, or stores…'
                    : 'Search store names, handles…'
                }
                onSearch={setSearchQuery}
              />
            </div>
            <ExploreTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              productsCount={filteredProducts.length}
              storesCount={filteredStores.length}
            />
          </div>

          {/* Row 2: categories (products only) */}
          {activeTab === 'products' && (
            <div className="hide-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5">
              {PRODUCT_CATEGORIES.map((category, i) => {
                const isSelected = selectedCategories.includes(category)
                return (
                  <button
                    key={category}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== category)
                        )
                      } else {
                        setSelectedCategories([...selectedCategories, category])
                      }
                    }}
                    style={{ animationDelay: `${i * 25}ms` }}
                    className={`animate-fade-up shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 font-sans text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 sm:text-[13px] ${
                      isSelected
                        ? 'border-primary bg-primary text-surface shadow-sm'
                        : 'border-border/70 bg-surface text-primary/75 hover:border-secondary/50 hover:bg-secondary/10 hover:text-primary'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          )}

          {/* Row 3: meta controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-primary/60 font-sans text-xs font-semibold tabular-nums sm:text-sm">
                <span className="text-primary">{totalForTab.toLocaleString()}</span>{' '}
                {activeTab === 'products'
                  ? totalForTab === 1
                    ? 'item'
                    : 'items'
                  : totalForTab === 1
                    ? 'store'
                    : 'stores'}
              </span>

              {activeTab === 'products' && (
                <label className="group flex cursor-pointer items-center gap-2">
                  <span className="relative inline-flex h-4 w-4 shrink-0">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="peer border-border/80 checked:border-primary checked:bg-primary focus:ring-secondary/30 bg-surface h-4 w-4 cursor-pointer appearance-none rounded border transition-all duration-200 focus:ring-4 focus:outline-none"
                    />
                    <svg
                      className="text-surface pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 peer-checked:block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-primary/75 group-hover:text-primary font-sans text-xs font-medium transition-colors sm:text-sm">
                    In stock only
                  </span>
                </label>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="animate-fade-up text-primary/70 hover:text-primary inline-flex cursor-pointer items-center gap-1.5 font-sans text-xs font-semibold underline-offset-4 transition-colors hover:underline sm:text-sm"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={2.4} />
                  Clear filters
                </button>
              )}
            </div>

            <div className="w-40 sm:w-44">
              {activeTab === 'products' ? (
                <SortSelect
                  value={productSortBy}
                  onChange={setProductSortBy}
                  options={PRODUCT_SORT_OPTIONS}
                />
              ) : (
                <SortSelect
                  value={storeSortBy}
                  onChange={setStoreSortBy}
                  options={STORE_SORT_OPTIONS}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14 lg:px-8">
        {activeTab === 'products' ? (
          filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" strokeWidth={1.6} />}
              title="No products match your filters"
              description="Try clearing a filter, widening your search, or browsing a different category — there's more to find."
              onReset={hasActiveFilters ? resetFilters : undefined}
            />
          ) : (
            <>
              <div
                key={productFilterKey}
                className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
              >
                {displayedProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i, 11) * 30}ms` }}
                  >
                    <ProductCard
                      product={product}
                      currency={product.store?.currency || 'USD'}
                    />
                  </div>
                ))}
              </div>
              <div ref={productSentinelRef} className="h-1" />
              {visibleProductCount < filteredProducts.length && (
                <div className="py-10 text-center">
                  <div className="border-border/80 border-t-primary inline-block h-6 w-6 animate-spin rounded-full border-2" />
                </div>
              )}
            </>
          )
        ) : filteredStores.length === 0 ? (
          <EmptyState
            icon={<Store className="h-8 w-8" strokeWidth={1.6} />}
            title="No stores match your search"
            description="Try a different name or handle — more makers are joining Thriftverse every week."
            onReset={hasActiveFilters ? resetFilters : undefined}
          />
        ) : (
          <>
            <div
              key={storeFilterKey}
              className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
            >
              {displayedStores.map((store, i) => (
                <div
                  key={store.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 11) * 30}ms` }}
                >
                  <StoreCard profile={store} />
                </div>
              ))}
            </div>
            <div ref={storeSentinelRef} className="h-1" />
            {visibleStoreCount < filteredStores.length && (
              <div className="py-10 text-center">
                <div className="border-border/80 border-t-primary inline-block h-6 w-6 animate-spin rounded-full border-2" />
              </div>
            )}
          </>
        )}
      </section>

      <SectionOrnament />

      <ExploreSellerCTA />
    </div>
  )
}

function SectionOrnament() {
  return (
    <div
      aria-hidden
      className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <span className="via-secondary/50 h-px w-16 bg-linear-to-r from-transparent to-transparent sm:w-28" />
      <span className="flex items-center gap-1.5">
        <span className="bg-secondary/30 h-1 w-1 rounded-full" />
        <span className="bg-secondary h-1.5 w-1.5 rounded-full" />
        <span className="bg-secondary/30 h-1 w-1 rounded-full" />
      </span>
      <span className="via-secondary/50 h-px w-16 bg-linear-to-r from-transparent to-transparent sm:w-28" />
    </div>
  )
}

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  onReset?: () => void
}

function EmptyState({ icon, title, description, onReset }: EmptyStateProps) {
  return (
    <div className="border-border/60 bg-surface animate-fade-up mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed px-6 py-14 text-center sm:px-10 sm:py-20">
      <span className="border-secondary/40 bg-secondary/10 text-secondary animate-soft-pulse mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border sm:mb-6 sm:h-16 sm:w-16">
        {icon}
      </span>
      <p className="text-primary/60 mb-1.5 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
        Nothing here — yet
      </p>
      <h3 className="font-heading text-primary mb-2 text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h3>
      <p className="text-primary/70 mb-6 max-w-sm font-sans text-sm leading-relaxed sm:mb-7 sm:text-base">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="group bg-primary text-surface hover:bg-primary/90 relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-sans text-sm font-semibold tracking-wide shadow-sm transition-colors duration-200"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
            style={{ transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <span className="absolute inset-y-0 left-0 w-1/3 bg-white/20 blur-md" />
          </span>
          <Sparkles className="relative h-3.5 w-3.5" strokeWidth={2.4} />
          <span className="relative">Reset filters</span>
        </button>
      )}
    </div>
  )
}
