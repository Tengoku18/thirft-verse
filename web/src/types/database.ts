// Database types for Supabase tables

export type UserRole = 'ADMIN' | 'USER';
export type SubscriptionPlan = 'BASIC' | 'SILVER' | 'GOLD';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded';
export type ProfileStatus = 'active' | 'suspended' | 'deleted';
export type DeletionRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface ProfileConfig {
  status: ProfileStatus;
  requestedForDeletion: boolean;
}

export interface ProfileOfferCodeObject {
  code: string;
  discountPercent: number;
  expiresAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  district: string;
  country: string;
  phone: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  bio: string | null;
  address: string | null;
  profile_image: string | null;
  currency: string;
  store_username: string;
  role: UserRole;
  plan: SubscriptionPlan;
  reviews: Review[];
  config: ProfileConfig;
  offer_code_object: ProfileOfferCodeObject | null;
  created_at: string;
  updated_at: string;
}

export interface OfferCode {
  id: string;
  owner_user_id: string;
  code: string;
  code_normalized: string;
  discount_percent: number;
  expires_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferCodeUsage {
  id: string;
  offer_code_id: string;
  owner_user_id: string;
  client_user_id: string | null;
  client_email: string | null;
  order_id: string | null;
  items_subtotal: number;
  discount_percent: number;
  discount_amount: number;
  discounted_items_total: number;
  final_amount: number;
  used_at: string;
  metadata: Record<string, unknown> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number | null;
}

export type ProductStatus = 'available' | 'out_of_stock';

export interface Product {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  cover_image: string;
  other_images: string[];
  availability_count: number;
  status: ProductStatus;
  shipping_fee: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithStore extends Product {
  store: Pick<Profile, 'id' | 'name' | 'store_username' | 'currency'> | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  cover_image: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_code: string | null;
  seller_id: string;
  product_id: string | null; // Nullable for multi-product orders
  quantity: number;
  buyer_email: string;
  buyer_name: string;
  buyer_notes: string | null;
  shipping_address: ShippingAddress;
  transaction_code: string;
  transaction_uuid: string;
  amount: number;
  shipping_fee: number;
  items_subtotal: number | null;
  discounted_items_total: number | null;
  shipping_option: 'home' | 'branch' | null;
  payment_method: string;
  status: OrderStatus;
  sellers_earning: number;
  platform_earnings: number;
  offer_code_id: string | null;
  offer_code_text: string | null;
  offer_discount_percent: number | null;
  offer_discount_amount: number | null;
  created_at: string;
  updated_at: string;
  // NCM tracking
  ncm_order_id: number | null;
  ncm_delivery_status: string | null;
  ncm_payment_status: string | null;
  ncm_delivery_charge: number | null;
  ncm_last_synced_at: string | null;
  ncm_data: NCMCachedData | null;
}

/** Cached NCM data stored as JSONB — used by website to show tracking without hitting NCM API */
export interface NCMCachedData {
  order_id: number;
  cod_charge: string;
  delivery_charge: string;
  last_delivery_status: string;
  payment_status: string;
  status_history: {
    status: string;
    added_time: string;
  }[];
  last_synced_at: string;
}

export interface OrderWithDetails extends Order {
  seller: Pick<Profile, 'id' | 'name' | 'store_username'> | null;
  product: Pick<Product, 'id' | 'title' | 'cover_image' | 'price'> | null;
}

export interface OrderWithItems extends Order {
  seller: Pick<Profile, 'id' | 'name' | 'store_username' | 'currency'> | null;
  order_items: OrderItem[];
}

export interface AccountDeletionRequest {
  id: string;
  user_id: string;
  email: string;
  reason: string;
  status: DeletionRequestStatus;
  admin_notes: string | null;
  requested_at: string;
  processed_at: string | null;
  processed_by: string | null;
  created_at: string;
  updated_at: string;
}
