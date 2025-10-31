'use client'

import { ShoppingCart, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BuyNowButtonProps {
  productId: string
  productName: string
  price: number
  currency: string
  isOutOfStock: boolean
}

export default function BuyNowButton({
  productId,
  productName,
  price,
  currency,
  isOutOfStock,
}: BuyNowButtonProps) {
  const router = useRouter()

  const handleBuyNow = () => {
    if (isOutOfStock) return

    // Navigate to checkout page with product details
    const params = new URLSearchParams({
      productId,
      productName,
      price: price.toString(),
      currency,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <button
        onClick={handleBuyNow}
        disabled={isOutOfStock}
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
  )
}
