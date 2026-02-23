import { CartStorage, StoreCart, CartItem } from '@/types/cart'

const CART_STORAGE_KEY = 'thriftverse_cart'
const CART_EXPIRY_HOURS = 24

/**
 * Get all carts from localStorage, removing expired ones
 */
export function getCartsFromStorage(): CartStorage {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return {}

    const carts: CartStorage = JSON.parse(stored)
    const now = Date.now()

    // Filter out expired carts
    const validCarts: CartStorage = {}
    Object.entries(carts).forEach(([storeId, cart]) => {
      if (cart.expiresAt > now) {
        validCarts[storeId] = cart
      }
    })

    // Update storage if any carts were removed
    if (Object.keys(validCarts).length !== Object.keys(carts).length) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validCarts))
    }

    return validCarts
  } catch (error) {
    console.error('Error reading cart from storage:', error)
    return {}
  }
}

/**
 * Save carts to localStorage
 */
export function saveCartsToStorage(carts: CartStorage): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carts))
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

/**
 * Get cart for a specific store
 */
export function getStoreCart(storeId: string): StoreCart | null {
  const carts = getCartsFromStorage()
  return carts[storeId] || null
}

/**
 * Add item to store cart
 */
export function addItemToCart(
  storeId: string,
  storeName: string,
  currency: string,
  item: CartItem
): StoreCart {
  const carts = getCartsFromStorage()
  const now = Date.now()
  const expiresAt = now + CART_EXPIRY_HOURS * 60 * 60 * 1000

  let storeCart = carts[storeId]

  if (!storeCart) {
    // Create new store cart
    storeCart = {
      storeId,
      storeName,
      currency,
      items: [item],
      createdAt: now,
      expiresAt,
    }
  } else {
    // Update existing cart
    const existingItemIndex = storeCart.items.findIndex(
      (i) => i.productId === item.productId
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      storeCart.items[existingItemIndex].quantity = item.quantity
    } else {
      // Add new item
      storeCart.items.push(item)
    }

    // Refresh expiry time
    storeCart.expiresAt = expiresAt
  }

  carts[storeId] = storeCart
  saveCartsToStorage(carts)

  return storeCart
}

/**
 * Remove item from store cart
 */
export function removeItemFromCart(storeId: string, productId: string): StoreCart | null {
  const carts = getCartsFromStorage()
  const storeCart = carts[storeId]

  if (!storeCart) return null

  storeCart.items = storeCart.items.filter((item) => item.productId !== productId)

  if (storeCart.items.length === 0) {
    // Remove store cart if no items left
    delete carts[storeId]
    saveCartsToStorage(carts)
    return null
  }

  carts[storeId] = storeCart
  saveCartsToStorage(carts)

  return storeCart
}

/**
 * Update item quantity in cart
 */
export function updateItemQuantity(
  storeId: string,
  productId: string,
  quantity: number
): StoreCart | null {
  if (quantity <= 0) {
    return removeItemFromCart(storeId, productId)
  }

  const carts = getCartsFromStorage()
  const storeCart = carts[storeId]

  if (!storeCart) return null

  const item = storeCart.items.find((i) => i.productId === productId)
  if (!item) return null

  // Don't exceed availability
  item.quantity = Math.min(quantity, item.availabilityCount)

  carts[storeId] = storeCart
  saveCartsToStorage(carts)

  return storeCart
}

/**
 * Clear specific store cart
 */
export function clearStoreCart(storeId: string): void {
  const carts = getCartsFromStorage()
  delete carts[storeId]
  saveCartsToStorage(carts)
}

/**
 * Clear all carts
 */
export function clearAllCarts(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_STORAGE_KEY)
}

/**
 * Get total items count across all stores
 */
export function getTotalCartItemsCount(): number {
  const carts = getCartsFromStorage()
  return Object.values(carts).reduce(
    (total, cart) => total + cart.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  )
}

/**
 * Get total items count for a specific store
 */
export function getStoreCartItemsCount(storeId: string): number {
  const cart = getStoreCart(storeId)
  if (!cart) return 0
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Calculate cart total for a store
 */
export function calculateStoreCartTotal(storeId: string): number {
  const cart = getStoreCart(storeId)
  if (!cart) return 0
  return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
}
