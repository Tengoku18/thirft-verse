// Database types for Supabase tables

export type UserRole = 'ADMIN' | 'USER'
export type SubscriptionPlan = 'BASIC' | 'SILVER' | 'GOLD'
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'
export type ProfileStatus = 'active' | 'suspended' | 'deleted'
export type DeletionRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface ProfileConfig {
  status: ProfileStatus
  requestedForDeletion: boolean
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  reviewer_name: string
  created_at: string
}

export interface Profile {
  id: string
  name: string
  bio: string | null
  address: string | null
  profile_image: string | null
  currency: string
  store_username: string
  role: UserRole
  plan: SubscriptionPlan
  reviews: Review[]
  config: ProfileConfig
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number | null
}

export type ProductStatus = 'available' | 'out_of_stock'

export interface Product {
  id: string
  store_id: string
  title: string
  description: string | null
  category: string
  price: number
  cover_image: string
  other_images: string[]
  availability_count: number
  status: ProductStatus
  shipping_fee: number
  created_at: string
  updated_at: string
}

export interface ProductWithStore extends Product {
  store: Pick<Profile, 'id' | 'name' | 'store_username' | 'currency'> | null
}

export interface Order {
  id: string
  order_code: string | null
  seller_id: string
  product_id: string
  quantity: number
  buyer_email: string
  buyer_name: string
  shipping_address: ShippingAddress
  transaction_code: string
  transaction_uuid: string
  amount: number
  shipping_fee: number
  shipping_option: 'home' | 'branch' | null
  payment_method: string
  status: OrderStatus
  sellers_earning: number
  platform_earnings: number
  created_at: string
  updated_at: string
}

export interface OrderWithDetails extends Order {
  seller: Pick<Profile, 'id' | 'name' | 'store_username'> | null
  product: Pick<Product, 'id' | 'title' | 'cover_image' | 'price'> | null
}

export interface AccountDeletionRequest {
  id: string
  user_id: string
  email: string
  reason: string
  status: DeletionRequestStatus
  admin_notes: string | null
  requested_at: string
  processed_at: string | null
  processed_by: string | null
  created_at: string
  updated_at: string
}
