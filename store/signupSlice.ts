import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignupFormData {
  name: string;
  email: string;
  username: string;
  address: string;
  password: string;
  profileImage: string | null;
  sellerType: "store" | "closet" | "";
  bio: string;
  district: string;
  instagramHandle: string;
  storeName: string;
  referralCode: string;
}

export interface SignupPaymentData {
  paymentUsername: string;
  paymentQRImage: string | null;
}

interface SignupState {
  formData: SignupFormData;
  paymentData: SignupPaymentData;
}

const initialFormData: SignupFormData = {
  name: "",
  email: "",
  username: "",
  address: "",
  password: "",
  profileImage: null,
  sellerType: "",
  bio: "",
  district: "",
  instagramHandle: "",
  storeName: "",
  referralCode: "",
};

const initialPaymentData: SignupPaymentData = {
  paymentUsername: "",
  paymentQRImage: null,
};

const initialState: SignupState = {
  formData: initialFormData,
  paymentData: initialPaymentData,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<SignupFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setPaymentData: (
      state,
      action: PayloadAction<Partial<SignupPaymentData>>,
    ) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    // Load form data from database profile (for back navigation after app restart)
    loadFromProfile: (state, action: PayloadAction<any>) => {
      const profile = action.payload;
      if (profile) {
        // Update direct profile fields
        state.formData = {
          ...state.formData,
          name: profile.name || state.formData.name,
          username: profile.store_username || state.formData.username,
          bio: profile.bio || state.formData.bio,
          address: profile.address || state.formData.address,
          sellerType: profile.seller_type || state.formData.sellerType,
          referralCode: profile.referral_code || state.formData.referralCode,
        };

        // Parse seller_data JSONB if it exists - reads seller fields from seller_data
        if (profile.seller_data && typeof profile.seller_data === "object") {
          const sellerData = profile.seller_data;
          if (sellerData.district) {
            state.formData.district = sellerData.district;
          }
          if (sellerData.instagram_handle) {
            state.formData.instagramHandle = sellerData.instagram_handle;
          }
          if (sellerData.store_name) {
            state.formData.storeName = sellerData.store_name;
          }
        }

        // Load payment data from profile
        if (profile.payment_username) {
          state.paymentData.paymentUsername = profile.payment_username;
        }
        if (profile.payment_qr_image) {
          state.paymentData.paymentQRImage = profile.payment_qr_image;
        }

        // NOTE: DO NOT load email/password - these are from auth table, handled separately
        // email and password are transient and should not be restored
      }
    },
    resetSignup: (state) => {
      state.formData = initialFormData;
      state.paymentData = initialPaymentData;
    },
  },
});

export const { setFormData, setPaymentData, resetSignup, loadFromProfile } =
  signupSlice.actions;
export default signupSlice.reducer;
