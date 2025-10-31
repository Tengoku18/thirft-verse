// Database types for Supabase tables

export type UserRole = 'ADMIN' | 'USER'
export type SubscriptionPlan = 'BASIC' | 'SILVER' | 'GOLD'

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
  profile_image: string | null
  currency: string
  store_username: string
  role: UserRole
  plan: SubscriptionPlan
  reviews: Review[]
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
  created_at: string
  updated_at: string
}

export interface ProductWithStore extends Product {
  store: Pick<Profile, 'id' | 'name' | 'store_username' | 'currency'> | null
}
