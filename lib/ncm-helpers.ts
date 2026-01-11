// NCM (Nepal Can Move) API Integration
// API Documentation: https://demo.nepalcanmove.com/api/v2/

const NCM_API_BASE_URL = "https://demo.nepalcanmove.com/api";
const NCM_API_TOKEN = process.env.EXPO_PUBLIC_NCM_API_TOKEN || "009d25035b2da1b4533b0f2cbfe1877d510aaa7e";

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
}

/**
 * Fetch all NCM branches
 */
export const fetchNCMBranches = async () => {
  try {
    const response = await fetch(`${NCM_API_BASE_URL}/v2/branches`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${NCM_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data as NCMBranch[] };
  } catch (error) {
    console.error("Error fetching NCM branches:", error);
    return { success: false, error, data: [] };
  }
};

/**
 * Create an order in NCM system
 */
export const createNCMOrder = async (params: NCMCreateOrderParams) => {
  try {
    const response = await fetch(`${NCM_API_BASE_URL}/v1/order/create`, {
      method: "POST",
      headers: {
        Authorization: `Token ${NCM_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 400 && data.Error) {
        const errors = Object.entries(data.Error)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        throw new Error(errors);
      }
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }

    return { success: true, data: data as NCMOrderResponse };
  } catch (error) {
    console.error("Error creating NCM order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create NCM order",
    };
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
    const response = await fetch(
      `${NCM_API_BASE_URL}/v1/shipping-rate?creation=${creation}&destination=${destination}&type=${type}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${NCM_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching delivery charges:", error);
    return { success: false, error };
  }
};
