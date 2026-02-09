'use client'

import { useCart } from '@/contexts/CartContext'
import { formatProductPrice } from '@/utils/formatPrice'
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Button from '@/_components/common/Button'
import { StoreCart } from '@/types/cart'

function CartContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storeId = searchParams.get('storeId')
  const { getStoreCart, updateQuantity, removeItem, getStoreTotal, clearStoreCart } = useCart()
  const [cart, setCart] = useState<StoreCart | null>(null)

  useEffect(() => {
    if (storeId) {
      const storeCart = getStoreCart(storeId)
      setCart(storeCart)
    }
  }, [storeId, getStoreCart])

  if (!storeId || !cart) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-primary/30" />
          <h1 className="mb-2 font-heading text-2xl font-bold text-primary">
            Your cart is empty
          </h1>
          <p className="mb-6 text-primary/60">
            Start adding items to your cart!
          </p>
          <Button variant="primary" size="md" onClick={() => router.push('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const total = getStoreTotal(storeId)
  const currency = cart.currency

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(storeId, productId, newQuantity)
    setCart(getStoreCart(storeId))
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(storeId, productId)
    const updatedCart = getStoreCart(storeId)
    if (!updatedCart) {
      router.push('/')
    } else {
      setCart(updatedCart)
    }
  }

  const handleCheckout = () => {
    // Navigate to checkout with cart items
    router.push(`/checkout?storeId=${storeId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface py-6 sm:py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Continue Shopping</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your cart?')) {
                clearStoreCart(storeId)
                router.push('/')
              }
            }}
            className="text-sm text-primary/60 transition-colors hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>

        {/* Store Info */}
        <div className="mb-6 rounded-2xl bg-background p-4 shadow-lg border border-border/20">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-secondary" />
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">
                Your Cart
              </h1>
              <p className="text-sm text-primary/60">
                {cart.storeName} • {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="rounded-2xl bg-background p-4 shadow-lg border border-border/20"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  {item.coverImage && (
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
                      <Image
                        src={item.coverImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-primary line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="mt-1 font-heading text-lg font-bold text-secondary">
                        {formatProductPrice(item.price, currency, false)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-surface text-primary transition-colors hover:bg-secondary/10 disabled:opacity-50 disabled:hover:bg-surface"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.availabilityCount}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-surface text-primary transition-colors hover:bg-secondary/10 disabled:opacity-50 disabled:hover:bg-surface"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="flex items-center gap-1 text-sm text-red-600 transition-colors hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    {item.quantity >= item.availabilityCount && (
                      <p className="mt-2 text-xs text-amber-600">
                        Max available: {item.availabilityCount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl bg-background p-6 shadow-lg border border-border/20">
              <h2 className="mb-4 font-heading text-xl font-bold text-primary">
                Order Summary
              </h2>

              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-primary/70">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium text-primary">
                      {formatProductPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-primary/10 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">Subtotal</span>
                    <span className="font-heading text-xl font-bold text-secondary">
                      {formatProductPrice(total, currency)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-primary/60">
                    Shipping will be calculated at checkout
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCheckout}
                className="mt-6 w-full"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            <p className="font-heading text-xl font-semibold text-primary">
              Loading cart...
            </p>
          </div>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  )
}
