'use client'

import { ProductSortOption, StoreSortOption } from '@/utils/exploreHelpers'
import { ArrowDownUp } from 'lucide-react'

interface SortSelectProps<T extends ProductSortOption | StoreSortOption> {
  value: T
  onChange: (value: T) => void
  options: readonly { value: T; label: string }[]
  className?: string
}

export default function SortSelect<T extends ProductSortOption | StoreSortOption>({
  value,
  onChange,
  options,
  className = '',
}: SortSelectProps<T>) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-9 text-sm text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-200 cursor-pointer transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-4 w-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

// Predefined sort options for products
export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest First' },
  { value: 'price-low' as const, label: 'Price: Low to High' },
  { value: 'price-high' as const, label: 'Price: High to Low' },
  { value: 'name-az' as const, label: 'Name: A-Z' },
  { value: 'name-za' as const, label: 'Name: Z-A' },
]

// Predefined sort options for stores
export const STORE_SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest First' },
  { value: 'name-az' as const, label: 'Name: A-Z' },
  { value: 'name-za' as const, label: 'Name: Z-A' },
]
