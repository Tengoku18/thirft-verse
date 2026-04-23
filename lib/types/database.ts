// Database types for Supabase tables
// Aligned with web app types

export type UserRole = "ADMIN" | "USER";
export type SubscriptionPlan = "BASIC" | "SILVER" | "GOLD";
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";
export type ProductStatus = "available" | "out_of_stock";
export type ProfileStatus = "active" | "suspended" | "deleted";
export type DeletionRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";
export type NotificationType =
  | "new_order"
  | "order_cancelled"
  | "order_refunded";

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Record<string, string>;
  is_read: boolean;
  created_at: string;
}

export interface ProfileConfig {
  status: ProfileStatus;
  requestedForDeletion: boolean;
  notifications_muted?: boolean;
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

export interface ProfileOfferCodeObject {
  code: string;
  discountPercent: number;
  expiresAt: string;
  updatedAt: string;
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
  expo_push_tokens: string[];
  offer_code_object: ProfileOfferCodeObject | null;
  // Signup progress — persisted in DB so progress survives reinstalls / device switches
  auth_completed: boolean;
  signup_step: number; // last completed step (1–6); auth_completed=true once step 6 done
  // Founder Circle
  is_founder: boolean;
  is_founder_creator: boolean;
  is_founder_seller: boolean;
  founder_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Referral types ──────────────────────────────────────────────────────────

export interface Referral {
  id: string;
  referrer_id: string;
  referrer_email: string;
  code: string;
  created_at: string;
}

export interface ReferralUser {
  id: string;
  referral_id: string;
  referred_user_id: string;
  referred_email: string;
  commission_expires_at: string;
  created_at: string;
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
  // AI semantic search fields
  embedding?: number[] | null;
  embedding_model?: string | null;
  embedding_generated_at?: string | null;
}

export interface ProductWithStore extends Product {
  store: Pick<Profile, "id" | "name" | "store_username" | "currency"> | null;
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
  product_id: string | null; // NULL for multi-product orders (use order_items instead)
  quantity: number;
  buyer_email: string;
  buyer_name: string;
  shipping_address: ShippingAddress;
  transaction_code: string;
  transaction_uuid: string;
  amount: number;
  shipping_fee: number;
  items_subtotal: number | null;
  discounted_items_total: number | null;
  shipping_option: "home" | "branch" | null;
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
  // NCM (Nepal Can Move) tracking fields
  ncm_order_id: number | null;
  ncm_status: string | null; // "sent_to_ncm", etc.
  ncm_delivery_status: string | null; // Last delivery status from NCM (e.g., "Delivered", "Sent for Pickup")
  ncm_payment_status: string | null; // Payment status from NCM (e.g., "Pending", "Completed")
  ncm_delivery_charge: number | null; // Actual delivery charge from NCM
  ncm_last_synced_at: string | null; // When we last fetched status from NCM
  ncm_data: NCMCachedData | null; // Full cached NCM response (saves API calls, used by website)
}

/** Cached NCM data stored as JSONB — avoids repeated API calls (200/day limit) */
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

export interface OrderWithDetails extends Order {
  seller: Pick<Profile, "id" | "name" | "store_username"> | null;
  product: Pick<Product, "id" | "title" | "cover_image" | "price"> | null;
}

export interface OrderWithItems extends Order {
  seller: Pick<Profile, "id" | "name" | "store_username" | "currency"> | null;
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
