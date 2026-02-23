export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  coverImage?: string
  availabilityCount: number
}

export interface StoreCart {
  storeId: string
  storeName: string
  currency: string
  items: CartItem[]
  expiresAt: number // timestamp
  createdAt: number // timestamp
}

export interface CartStorage {
  [storeId: string]: StoreCart
}
