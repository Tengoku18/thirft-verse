import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import checkoutReducer from './checkoutSlice';
import notificationsReducer from './notificationsSlice';
import productsReducer from './productsSlice';
import profileReducer from './profileSlice';
import reportIssueReducer from './reportIssueSlice';
import signupReducer from './signupSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    signup: signupReducer,
    checkout: checkoutReducer,
    products: productsReducer,
    notifications: notificationsReducer,
    reportIssue: reportIssueReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/fetchCurrentSession/fulfilled', 'auth/signInWithPassword/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.session', 'payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
