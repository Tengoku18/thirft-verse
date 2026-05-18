// Export store
export { store } from "./store";
export type { AppDispatch, RootState } from "./store";

// Export hooks
export { useAppDispatch, useAppSelector } from "./hooks";

// Export auth slice
export {
  clearAuth,
  fetchCurrentSession,
  fetchCurrentUser,
  setError as setAuthError,
  setSession,
  setUser,
  signInWithPassword,
  signOutUser,
  signUpWithOtp,
  verifyOtpAndSetPassword,
} from "./authSlice";

// Export profile slice
export {
  clearProfile,
  createProfile,
  fetchUserProfile,
  setProfile,
  setError as setProfileError,
  updateProfile,
} from "./profileSlice";

// Export signup slice
export {
  loadFromProfile,
  resetSignup,
  setFormData,
  setPaymentData,
} from "./signupSlice";

export type { SignupFormData, SignupPaymentData } from "./signupSlice";

// Export checkout slice
export {
  resetCheckout,
  setAppliedOffer,
  setCheckoutData,
  setCheckoutOfferInput,
  setCheckoutQuantity,
} from "./checkoutSlice";

export type { CheckoutFormData } from "./checkoutSlice";

// Export notifications slice
export {
  clearNotifications,
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
  markAsUnread,
} from "./notificationsSlice";

// Export initialization thunk
export { initializeApp } from "./initializationThunk";

// Export UI slice
export {
  hydrateHomeMode,
  setHomeMode,
  setHomeModeLocal,
} from "./uiSlice";
export type { HomeMode } from "./uiSlice";
