'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Shield, ShoppingBag } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'
import { formatCheckoutPrice } from '@/utils/formatPrice'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

interface ProductPurchaseSectionProps {
  productId: string
  productName: string
  price: number
  currency: string
  availabilityCount: number
  isOutOfStock: boolean
  storeId?: string
  storeName?: string
  coverImage?: string
}

export default function ProductPurchaseSection({
  productId,
  productName,
  price,
  currency,
  availabilityCount,
  isOutOfStock,
  storeId,
  storeName,
  coverImage,
}: ProductPurchaseSectionProps) {
  const router = useRouter()
  const { addItem, isInCart, getItemQuantity } = useCart()
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

  const handleAddToCart = () => {
    if (isOutOfStock || quantity < 1 || quantity > availabilityCount) return
    if (!storeId || !storeName) {
      toast.error('Store information is missing')
      return
    }

    // Check current cart quantity
    const currentCartQty = getItemQuantity(storeId, productId)
    const totalQty = currentCartQty + quantity

    if (totalQty > availabilityCount) {
      toast.error(`Only ${availabilityCount - currentCartQty} more available`)
      return
    }

    addItem(storeId, storeName, currency, {
      productId,
      productName,
      price,
      quantity: totalQty, // Update to new total
      coverImage: coverImage || undefined,
      availabilityCount,
    })

    toast.success(`${quantity} item(s) added to cart!`)
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

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        {/* Add to Cart Button - Only show if storeId is provided */}
        {storeId && !isOutOfStock && (
          <button
            onClick={handleAddToCart}
            disabled={isBuyDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary bg-transparent px-8 py-4 font-semibold text-secondary shadow-lg transition-all hover:bg-secondary hover:text-surface hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </button>
        )}

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isBuyDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <ShoppingCart className="h-5 w-5" />
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-sm text-primary/60">
          <Shield className="h-4 w-4" />
          <span>Secure payment with eSewa</span>
        </div>
      </div>
    </div>
  )
}
