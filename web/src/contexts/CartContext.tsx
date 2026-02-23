'use client'

import { CartItem, CartStorage, StoreCart } from '@/types/cart'
import {
  addItemToCart as addItemToStorage,
  calculateStoreCartTotal,
  clearAllCarts as clearAllCartsStorage,
  clearStoreCart as clearStoreCartStorage,
  getCartsFromStorage,
  getStoreCart as getStoreCartFromStorage,
  getStoreCartItemsCount,
  getTotalCartItemsCount,
  removeItemFromCart as removeItemFromStorage,
  updateItemQuantity as updateItemQuantityStorage,
} from '@/lib/cart/storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface CartContextType {
  carts: CartStorage
  addItem: (
    storeId: string,
    storeName: string,
    currency: string,
    item: CartItem
  ) => void
  removeItem: (storeId: string, productId: string) => void
  updateQuantity: (storeId: string, productId: string, quantity: number) => void
  clearStoreCart: (storeId: string) => void
  clearAllCarts: () => void
  getStoreCart: (storeId: string) => StoreCart | null
  getStoreTotal: (storeId: string) => number
  getStoreItemsCount: (storeId: string) => number
  getTotalItemsCount: () => number
  isInCart: (storeId: string, productId: string) => boolean
  getItemQuantity: (storeId: string, productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartStorage>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    setCarts(getCartsFromStorage())
    setIsInitialized(true)
  }, [])

  const addItem = (
    storeId: string,
    storeName: string,
    currency: string,
    item: CartItem
  ) => {
    const updatedCart = addItemToStorage(storeId, storeName, currency, item)
    setCarts(getCartsFromStorage())
  }

  const removeItem = (storeId: string, productId: string) => {
    removeItemFromStorage(storeId, productId)
    setCarts(getCartsFromStorage())
  }

  const updateQuantity = (storeId: string, productId: string, quantity: number) => {
    updateItemQuantityStorage(storeId, productId, quantity)
    setCarts(getCartsFromStorage())
  }

  const clearStoreCart = (storeId: string) => {
    clearStoreCartStorage(storeId)
    setCarts(getCartsFromStorage())
  }

  const clearAllCarts = () => {
    clearAllCartsStorage()
    setCarts({})
  }

  const getStoreCart = (storeId: string): StoreCart | null => {
    return getStoreCartFromStorage(storeId)
  }

  const getStoreTotal = (storeId: string): number => {
    return calculateStoreCartTotal(storeId)
  }

  const getStoreItemsCount = (storeId: string): number => {
    return getStoreCartItemsCount(storeId)
  }

  const getTotalItemsCount = (): number => {
    return getTotalCartItemsCount()
  }

  const isInCart = (storeId: string, productId: string): boolean => {
    const cart = carts[storeId]
    if (!cart) return false
    return cart.items.some((item) => item.productId === productId)
  }

  const getItemQuantity = (storeId: string, productId: string): number => {
    const cart = carts[storeId]
    if (!cart) return 0
    const item = cart.items.find((item) => item.productId === productId)
    return item?.quantity || 0
  }

  // Don't render until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null
  }

  return (
    <CartContext.Provider
      value={{
        carts,
        addItem,
        removeItem,
        updateQuantity,
        clearStoreCart,
        clearAllCarts,
        getStoreCart,
        getStoreTotal,
        getStoreItemsCount,
        getTotalItemsCount,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
