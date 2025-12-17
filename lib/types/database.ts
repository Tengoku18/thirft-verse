// Database types for Supabase tables
// Aligned with web app types

export type UserRole = 'ADMIN' | 'USER';
export type SubscriptionPlan = 'BASIC' | 'SILVER' | 'GOLD';
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
export type ProductStatus = 'available' | 'out_of_stock';
export type ProfileStatus = 'active' | 'suspended' | 'deleted';
export type DeletionRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface ProfileConfig {
  status: ProfileStatus;
  requestedForDeletion: boolean;
}

export interface WithdrawalRecord {
  amount: number;
  settledBy: string;
  transactionId: string;
  settlementDate: string;
}

export interface ProfileRevenue {
  pendingAmount: number;
  confirmedAmount: number;
  withdrawnAmount: number;
  withdrawalHistory: WithdrawalRecord[];
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
  config: ProfileConfig;
  payment_username: string | null;
  payment_qr_image: string | null;
  revenue: ProfileRevenue | null;
  created_at: string;
  updated_at: string;
}

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
  created_at: string;
  updated_at: string;
}

export interface ProductWithStore extends Product {
  store: Pick<Profile, 'id' | 'name' | 'store_username' | 'currency'> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number | null;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
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

export interface Order {
  id: string;
  order_code: string | null;
  seller_id: string;
  product_id: string;
  buyer_email: string;
  buyer_name: string;
  shipping_address: ShippingAddress;
  transaction_code: string;
  transaction_uuid: string;
  amount: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails extends Order {
  seller: Pick<Profile, 'id' | 'name' | 'store_username'> | null;
  product: Pick<Product, 'id' | 'title' | 'cover_image' | 'price'> | null;
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
