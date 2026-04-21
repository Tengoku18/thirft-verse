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

// Export notifications slice
export {
  clearNotifications,
  fetchNotifications,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
} from "./notificationsSlice";

// Export initialization thunk
export { initializeApp } from "./initializationThunk";
