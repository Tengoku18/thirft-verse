'use client'

import { useCart } from '@/contexts/CartContext'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CartButtonProps {
  storeId: string
  className?: string
}

export default function CartButton({ storeId, className = '' }: CartButtonProps) {
  const { getStoreItemsCount } = useCart()
  const router = useRouter()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setItemCount(getStoreItemsCount(storeId))
  }, [storeId, getStoreItemsCount])

  const handleClick = () => {
    router.push(`/cart?storeId=${storeId}`)
  }

  if (itemCount === 0) return null

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary shadow-lg transition-all hover:scale-105 hover:shadow-xl ${className}`}
      aria-label={`View cart (${itemCount} items)`}
    >
      <ShoppingCart className="h-6 w-6 text-surface" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-surface">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
