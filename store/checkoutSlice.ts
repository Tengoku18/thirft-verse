import type { AppliedCheckoutOffer } from "@/lib/database-helpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Shared state for the multi-screen checkout flow (checkout/step1..3).
 * Mirrors the signup slice pattern: each step screen reads what it needs and
 * dispatches its slice of data before navigating to the next screen.
 */
export interface CheckoutFormData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  street: string;
  city: string;
  district: string;
  // "" = not yet chosen (kept as a plain string so the slice stays serializable)
  shipping: "" | "home" | "branch";
  payment: "" | "cod" | "esewa" | "fonepay";
  buyerNotes: string;
}

interface CheckoutState {
  formData: CheckoutFormData;
  quantity: number;
  offerInput: string;
  appliedOffer: AppliedCheckoutOffer | null;
}

const initialFormData: CheckoutFormData = {
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  street: "",
  city: "",
  district: "",
  shipping: "",
  payment: "",
  buyerNotes: "",
};

const initialState: CheckoutState = {
  formData: initialFormData,
  quantity: 1,
  offerInput: "",
  appliedOffer: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (
      state,
      action: PayloadAction<Partial<CheckoutFormData>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCheckoutQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setCheckoutOfferInput: (state, action: PayloadAction<string>) => {
      state.offerInput = action.payload;
    },
    setAppliedOffer: (
      state,
      action: PayloadAction<AppliedCheckoutOffer | null>,
    ) => {
      state.appliedOffer = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setCheckoutData,
  setCheckoutQuantity,
  setCheckoutOfferInput,
  setAppliedOffer,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
