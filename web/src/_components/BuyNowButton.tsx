'use client'

import { initiateEsewaPayment } from '@/actions/payment'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

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
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyNow = async () => {
    if (isOutOfStock) return

    setIsProcessing(true)

    try {
      // Initiate eSewa payment
      const result = await initiateEsewaPayment({
        amount: price,
        productId,
        productName,
        taxAmount: 0,
        deliveryCharge: 0,
      })

      if (result.success && result.formHtml) {
        // Open the payment form in a new window or current window
        const paymentWindow = window.open('', '_self')
        if (paymentWindow) {
          paymentWindow.document.write(result.formHtml)
          paymentWindow.document.close()
        }
      } else {
        alert(`Payment initiation failed: ${result.error}`)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('Failed to initiate payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <button
      onClick={handleBuyNow}
      disabled={isOutOfStock || isProcessing}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      <ShoppingCart className="h-5 w-5" />
      {isProcessing
        ? 'Processing...'
        : isOutOfStock
          ? 'Out of Stock'
          : 'Buy Now'}
    </button>
  )
}
