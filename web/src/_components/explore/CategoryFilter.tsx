'use client'

import { PRODUCT_CATEGORIES } from '@/lib/constants/categories'
import { Check } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  className?: string
}

export default function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  className = '',
}: CategoryFilterProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const handleClearAll = () => {
    onCategoryChange([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Categories
        </h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        {PRODUCT_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <label
              key={category}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{category}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
