'use client'

import { Check, Home, Store } from 'lucide-react'
import { useState } from 'react'

export type ShippingOption = 'home' | 'branch' | null

interface ShippingOptionSelectorProps {
  selectedOption: ShippingOption
  onOptionChange: (option: ShippingOption) => void
  currency?: string
}

const SHIPPING_FEES = {
  home: 170,
  branch: 120,
}

export function getShippingFee(option: ShippingOption): number {
  if (!option) return 0
  return SHIPPING_FEES[option]
}

export default function ShippingOptionSelector({
  selectedOption,
  onOptionChange,
  currency = 'NPR',
}: ShippingOptionSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<ShippingOption>(null)

  const shippingOptions = [
    {
      id: 'home' as const,
      name: 'Home Delivery',
      description: 'Delivered to your doorstep',
      fee: SHIPPING_FEES.home,
      icon: <Home className="h-6 w-6" strokeWidth={2.5} />,
      color: '#3b82f6',
    },
    {
      id: 'branch' as const,
      name: 'Branch Pickup',
      description: 'Collect from our branch',
      fee: SHIPPING_FEES.branch,
      icon: <Store className="h-6 w-6" strokeWidth={2.5} />,
      color: '#10b981',
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-semibold text-primary">
          Delivery Method <span className="text-red-500">*</span>
        </h3>
        <p className="mt-1 text-sm text-primary/60">
          Please select how you would like to receive your order
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shippingOptions.map((option) => {
          const isSelected = selectedOption === option.id
          const isHovered = hoveredOption === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onOptionChange(option.id)}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`
                relative flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border/30 bg-background hover:border-primary/30 hover:bg-primary/5'
                }
              `}
            >
              {/* Icon */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <div style={{ color: option.color }}>{option.icon}</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-primary">{option.name}</h4>
                <p className="text-sm text-primary/60">{option.description}</p>
                <p className="mt-1 font-semibold" style={{ color: option.color }}>
                  {currency} {option.fee.toFixed(2)}
                </p>
              </div>

              {/* Check Icon */}
              {isSelected && (
                <div
                  className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition-all"
                  style={{ backgroundColor: option.color }}
                >
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Hover Effect Border */}
              {(isHovered || isSelected) && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${option.color}20 0%, ${option.color}05 100%)`,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Info Note */}
      {selectedOption && (
        <div className="rounded-xl bg-secondary/5 p-4">
          <p className="text-sm text-primary/70">
            {selectedOption === 'home' && (
              <>
                Your order will be <span className="font-semibold">delivered to your address</span>.
                Shipping fee: <span className="font-semibold">{currency} {SHIPPING_FEES.home.toFixed(2)}</span>
              </>
            )}
            {selectedOption === 'branch' && (
              <>
                You can <span className="font-semibold">collect your order from our branch</span>.
                Shipping fee: <span className="font-semibold">{currency} {SHIPPING_FEES.branch.toFixed(2)}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
