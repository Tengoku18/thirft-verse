'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Shield } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'
import { formatCheckoutPrice } from '@/utils/formatPrice'

interface ProductPurchaseSectionProps {
  productId: string
  productName: string
  price: number
  currency: string
  availabilityCount: number
  isOutOfStock: boolean
}

export default function ProductPurchaseSection({
  productId,
  productName,
  price,
  currency,
  availabilityCount,
  isOutOfStock,
}: ProductPurchaseSectionProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const handleBuyNow = () => {
    if (isOutOfStock || quantity < 1 || quantity > availabilityCount) return

    // Navigate to checkout page with product details including quantity
    const params = new URLSearchParams({
      productId,
      productName,
      price: price.toString(),
      currency,
      quantity: quantity.toString(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  const totalPrice = price * quantity
  const isBuyDisabled = isOutOfStock || quantity < 1 || quantity > availabilityCount

  return (
    <div className="w-full space-y-6">
      {/* Quantity Selector - Only show if product is in stock */}
      {!isOutOfStock && availabilityCount > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-secondary/5 to-accent-2/5 p-6">
          <QuantitySelector
            maxQuantity={availabilityCount}
            onQuantityChange={setQuantity}
            initialQuantity={1}
          />

          {/* Total Price Display */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-background/50 p-4">
            <span className="text-sm font-medium text-primary/70">Total Price:</span>
            <span className="font-heading text-2xl font-bold text-secondary">
              {formatCheckoutPrice(totalPrice, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Buy Now Button */}
      <div className="w-full">
        <button
          onClick={handleBuyNow}
          disabled={isBuyDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <ShoppingCart className="h-5 w-5" />
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-primary/60">
          <Shield className="h-4 w-4" />
          <span>Secure payment with eSewa</span>
        </div>
      </div>
    </div>
  )
}
