'use client'

import { Package, Store } from 'lucide-react'

export type ExploreTab = 'products' | 'stores'

interface ExploreTabsProps {
  activeTab: ExploreTab
  onTabChange: (tab: ExploreTab) => void
  productsCount: number
  storesCount: number
  className?: string
}

export default function ExploreTabs({
  activeTab,
  onTabChange,
  productsCount,
  storesCount,
  className = '',
}: ExploreTabsProps) {
  return (
    <div className={`flex sm:inline-flex gap-2 rounded-lg bg-white border border-neutral-200 p-1 w-full sm:w-auto ${className}`}>
      <button
        onClick={() => onTabChange('products')}
        className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-all cursor-pointer flex-1 sm:flex-initial ${
          activeTab === 'products'
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        <Package className="h-4 w-4" />
        <span>Products</span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'products'
              ? 'bg-white/20 text-white'
              : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {productsCount}
        </span>
      </button>

      <button
        onClick={() => onTabChange('stores')}
        className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-all cursor-pointer flex-1 sm:flex-initial ${
          activeTab === 'stores'
            ? 'bg-neutral-900 text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        <Store className="h-4 w-4" />
        <span>Stores</span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'stores'
              ? 'bg-white/20 text-white'
              : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {storesCount}
        </span>
      </button>
    </div>
  )
}
