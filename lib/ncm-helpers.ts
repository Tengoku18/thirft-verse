// NCM (Nepal Can Move) API Integration
// API Documentation: https://demo.nepalcanmove.com/api/v2/

import axios, { AxiosError } from "axios";

const NCM_API_BASE_URL = "https://demo.nepalcanmove.com/api";
const NCM_API_TOKEN = process.env.EXPO_PUBLIC_NCM_API_TOKEN;

// Create axios instance with default config
const ncmApi = axios.create({
  baseURL: NCM_API_BASE_URL,
  headers: {
    Authorization: `Token ${NCM_API_TOKEN}`,
  },
});

const ncmApiForBranches = axios.create({
  baseURL: NCM_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${NCM_API_TOKEN}`,
  },
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
    const { data } = await ncmApiForBranches.get<NCMBranch[]>("/v2/branches");
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
    const { data } = await ncmApi.post<NCMOrderResponse>(
      "/v1/order/create",
      params
    );
    console.log("Response from NCM create order:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating NCM order:", error);
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
    const { data } = await ncmApi.get("/v1/shipping-rate", {
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
