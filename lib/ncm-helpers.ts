// NCM (Nepal Can Move) API Integration
// API Documentation: https://demo.nepalcanmove.com/api/v2/
//
// AUTH PATTERNS:
// - ALL v1 endpoints (GET and POST) → Token auth
// - v2 endpoints (branches) → Bearer auth

import axios, { AxiosError } from "axios";

const NCM_API_BASE_URL =
  process.env.EXPO_PUBLIC_NCM_API_BASE_URL || "https://demo.nepalcanmove.com/api";

// Get token lazily to ensure env vars are loaded
const getNCMToken = () => {
  const token = process.env.EXPO_PUBLIC_NCM_API_TOKEN;
  if (!token) {
    console.warn("⚠️ NCM API Token not found in environment variables");
  }
  return token;
};

// ============================================
// Axios instances for different auth types
// ============================================

// For ALL v1 endpoints (both GET and POST) - uses "Token" prefix
const ncmApiWithToken = axios.create({
  baseURL: NCM_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

ncmApiWithToken.interceptors.request.use((config) => {
  const token = getNCMToken();
  config.headers.Authorization = `Token ${token}`;
  console.log(`📡 NCM [Token] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// For v2 endpoints ONLY (branches) - uses "Bearer" prefix
const ncmApiWithBearer = axios.create({
  baseURL: NCM_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

ncmApiWithBearer.interceptors.request.use((config) => {
  const token = getNCMToken();
  config.headers.Authorization = `Bearer ${token}`;
  console.log(`📡 NCM [Bearer] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

export interface NCMBranch {
  pk: number;
  code: string;
  name: string;
  phone: string;
  phone2?: string | null;
  branch_type: string;
  areas_covered?: string | null;
  district_name?: string | null;
  province_name?: string | null;
  geocode?: string | null;
  address?: string | null;
  surcharge?: string;
}

export interface NCMCreateOrderParams {
  name: string; // customer name
  phone: string; // customer phone number
  phone2?: string; // customer secondary phone
  cod_charge: string; // cod amount including delivery
  address: string; // general address of customer
  fbranch: string; // From branch name
  branch: string; // Destination branch name
  package?: string; // Package name or type
  vref_id?: string; // Vendor reference id
  instruction?: string; // Delivery Instruction
  delivery_type?: "Door2Door" | "Branch2Door" | "Branch2Branch" | "Door2Branch";
  weight?: string; // Weight in kg
}

export interface NCMOrderResponse {
  Message: string;
  orderid: number;
  weight: number;
  delivery_charge: number;
  delivery_type: string;
}

export interface NCMErrorResponse {
  Error?: Record<string, string[]>;
  detail?: string;
  message?: string;
}

// ============================================
// NCM Order Tracking Types (GET endpoints)
// ============================================

/**
 * Response from GET /v1/order?id=ORDERID
 * Fetches order details including status and payment info
 */
export interface NCMOrderDetails {
  orderid: number;
  cod_charge: string;
  delivery_charge: string;
  last_delivery_status: string;
  payment_status: string;
}

/**
 * Single status entry from GET /v1/order/status?id=ORDERID
 * Represents one status change in the order's timeline
 */
export interface NCMOrderStatusItem {
  orderid: number;
  status: string;
  added_time: string; // ISO timestamp with timezone e.g., "2019-10-18T13:24:30.960365+05:45"
}

/**
 * Single comment entry from GET /v1/order/comment?id=ORDERID
 */
export interface NCMOrderComment {
  orderid: number;
  comments: string;
  addedBy: string; // "NCM Staff" or "Vendor"
  added_time: string; // ISO timestamp with timezone
}

/**
 * Response from POST /v1/orders/statuses (bulk status fetch)
 */
export interface NCMBulkStatusResponse {
  result: Record<string, string>; // { "4041": "Pickup Order Created", ... }
  errors: number[]; // Order IDs that weren't found
}

/**
 * Response from POST /v1/comment
 */
export interface NCMCommentResponse {
  message: string;
}

const parseNCMError = (error: AxiosError<NCMErrorResponse>): string => {
  const errorData = error.response?.data;
  if (errorData?.Error) {
    return Object.entries(errorData.Error)
      .map(([key, values]) =>
        `${key}: ${Array.isArray(values) ? values.join(", ") : values}`
      )
      .join("; ");
  }
  return errorData?.detail || errorData?.message || error.message;
};

/**
 * Fetch all NCM branches
 */
export const fetchNCMBranches = async () => {
  try {
    const { data } = await ncmApiWithBearer.get<NCMBranch[]>("/v2/branches");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching NCM branches:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch branches";
    return { success: false, error: message, data: [] };
  }
};

/**
 * Create an order in NCM system
 */
export const createNCMOrder = async (params: NCMCreateOrderParams) => {
  try {
    const token = getNCMToken();
    console.log("🔑 NCM Token (first 10 chars):", token?.slice(0, 10) || "NOT SET");
    console.log("📦 NCM Order Params:", JSON.stringify(params, null, 2));

    const { data } = await ncmApiWithToken.post<NCMOrderResponse>(
      "/v1/order/create",
      params
    );
    console.log("✅ Response from NCM create order:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error creating NCM order:", error);

    // Log detailed error info
    if (error instanceof AxiosError) {
      console.error("📍 Request URL:", error.config?.url);
      console.error("📍 Request Headers:", JSON.stringify(error.config?.headers, null, 2));
      console.error("📍 Response Status:", error.response?.status);
      console.error("📍 Response Data:", JSON.stringify(error.response?.data, null, 2));
    }

    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to create NCM order";
    return { success: false, error: message };
  }
};

/**
 * Get delivery charges between branches
 */
export const getNCMDeliveryCharges = async (
  creation: string,
  destination: string,
  type: "Door2Door" | "Branch2Door" | "Branch2Branch" | "Door2Branch" = "Door2Door"
) => {
  try {
    const { data } = await ncmApiWithToken.get("/v1/shipping-rate", {
      params: { creation, destination, type },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching delivery charges:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch delivery charges";
    return { success: false, error: message };
  }
};

// ============================================
// NCM Order Tracking Functions
// ============================================

/**
 * Get order details from NCM
 * Returns: orderid, cod_charge, delivery_charge, last_delivery_status, payment_status
 */
export const getNCMOrderDetails = async (ncmOrderId: number) => {
  try {
    const { data } = await ncmApiWithToken.get<NCMOrderDetails>("/v1/order", {
      params: { id: ncmOrderId },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching NCM order details:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch order details";
    return { success: false, error: message };
  }
};

/**
 * Get order status history from NCM
 * Returns array of status changes in descending order (newest first)
 */
export const getNCMOrderStatus = async (ncmOrderId: number) => {
  try {
    const { data } = await ncmApiWithToken.get<NCMOrderStatusItem[]>("/v1/order/status", {
      params: { id: ncmOrderId },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching NCM order status:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch order status";
    return { success: false, error: message };
  }
};

/**
 * Get order comments from NCM
 * Returns array of comments in descending order (newest first)
 */
export const getNCMOrderComments = async (ncmOrderId: number) => {
  try {
    const { data } = await ncmApiWithToken.get<NCMOrderComment[]>("/v1/order/comment", {
      params: { id: ncmOrderId },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching NCM order comments:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch order comments";
    return { success: false, error: message };
  }
};

/**
 * Create a comment on an NCM order
 */
export const createNCMComment = async (ncmOrderId: number, comment: string) => {
  try {
    const { data } = await ncmApiWithToken.post<NCMCommentResponse>("/v1/comment", {
      orderid: String(ncmOrderId),
      comments: comment,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error creating NCM comment:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to create comment";
    return { success: false, error: message };
  }
};

/**
 * Get statuses for multiple orders at once
 * Useful for syncing order list without making individual API calls
 */
export const getNCMBulkOrderStatuses = async (ncmOrderIds: number[]) => {
  try {
    const { data } = await ncmApiWithToken.post<NCMBulkStatusResponse>(
      "/v1/orders/statuses",
      { orders: ncmOrderIds }
    );
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching bulk NCM statuses:", error);
    const message =
      error instanceof AxiosError
        ? parseNCMError(error)
        : "Failed to fetch bulk statuses";
    return { success: false, error: message };
  }
};
