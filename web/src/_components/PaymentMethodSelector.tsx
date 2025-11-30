'use client'

import { Check, Truck } from 'lucide-react'
import { useState } from 'react'

export type PaymentMethod = 'esewa' | 'fonepay' | 'cod'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(null)

  const paymentMethods = [
    {
      id: 'esewa' as PaymentMethod,
      name: 'eSewa',
      description: 'Digital wallet payment',
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#60bb46]/10">
          <span className="text-xl font-bold text-[#60bb46]">e</span>
        </div>
      ),
      color: '#60bb46',
    },
    // {
    //   id: 'fonepay' as PaymentMethod,
    //   name: 'FonePay',
    //   description: 'Bank payment gateway',
    //   icon: (
    //     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ee3124]/10">
    //       <span className="text-xl font-bold text-[#ee3124]">F</span>
    //     </div>
    //   ),
    //   color: '#ee3124',
    // },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]/10">
          <Truck className="h-6 w-6 text-[#f59e0b]" strokeWidth={2.5} />
        </div>
      ),
      color: '#f59e0b',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-primary">
        Select Payment Method
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id
          const isHovered = hoveredMethod === method.id

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
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
              <div className="shrink-0">{method.icon}</div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-primary">{method.name}</h4>
                <p className="text-sm text-primary/60">{method.description}</p>
              </div>

              {/* Check Icon */}
              {isSelected && (
                <div
                  className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition-all"
                  style={{ backgroundColor: method.color }}
                >
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Hover Effect Border */}
              {(isHovered || isSelected) && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${method.color}20 0%, ${method.color}05 100%)`,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Info Note */}
      <div className="rounded-xl bg-secondary/5 p-4">
        <p className="text-sm text-primary/70">
          {selectedMethod === 'esewa' && (
            <>
              You will be redirected to <span className="font-semibold">eSewa</span> to complete
              your payment securely.
            </>
          )}
          {selectedMethod === 'fonepay' && (
            <>
              You will be redirected to <span className="font-semibold">FonePay</span> to select
              your bank and complete payment.
            </>
          )}
          {selectedMethod === 'cod' && (
            <>
              Pay with <span className="font-semibold">cash</span> when your order is delivered.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
