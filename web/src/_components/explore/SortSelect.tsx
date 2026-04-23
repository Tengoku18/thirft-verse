'use client'

import { ProductSortOption, StoreSortOption } from '@/utils/exploreHelpers'
import { ArrowUpDown, ChevronDown } from 'lucide-react'

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
    <div className={`group relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3.5">
        <ArrowUpDown
          className="text-primary/50 group-hover:text-primary/80 h-3.5 w-3.5 transition-colors duration-200"
          strokeWidth={2.2}
        />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="border-border/70 bg-surface text-primary hover:border-primary/30 focus:border-secondary/70 focus:ring-secondary/20 relative w-full cursor-pointer appearance-none rounded-full border py-2 pr-9 pl-9 font-sans text-sm font-medium transition-all duration-200 focus:ring-4 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ChevronDown
          className="text-primary/50 group-hover:text-primary h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
          strokeWidth={2.2}
        />
      </div>
    </div>
  )
}

export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest first' },
  { value: 'price-low' as const, label: 'Price: Low to high' },
  { value: 'price-high' as const, label: 'Price: High to low' },
  { value: 'name-az' as const, label: 'Name: A–Z' },
  { value: 'name-za' as const, label: 'Name: Z–A' },
]

export const STORE_SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest first' },
  { value: 'name-az' as const, label: 'Name: A–Z' },
  { value: 'name-za' as const, label: 'Name: Z–A' },
]
