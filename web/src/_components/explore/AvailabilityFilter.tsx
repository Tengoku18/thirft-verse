'use client'

interface AvailabilityFilterProps {
  inStockOnly: boolean
  onChange: (inStockOnly: boolean) => void
  className?: string
}

export default function AvailabilityFilter({
  inStockOnly,
  onChange,
  className = '',
}: AvailabilityFilterProps) {
  return (
    <div className={className}>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Availability
      </h3>
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-200 focus:ring-offset-0"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">In stock only</span>
      </label>
    </div>
  )
}
