// Export store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Export auth slice
export {
  fetchCurrentUser,
  fetchCurrentSession,
  signInWithPassword,
  signUpWithOtp,
  verifyOtpAndSetPassword,
  signOutUser,
  setUser,
  setSession,
  clearAuth,
  setError as setAuthError,
} from './authSlice';

// Export profile slice
export {
  fetchUserProfile,
  updateProfile,
  createProfile,
  setProfile,
  clearProfile,
  setError as setProfileError,
} from './profileSlice';
