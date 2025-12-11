import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGNUP_STORAGE_KEY = '@thriftverse_signup_state';

export interface SignupFormData {
  name: string;
  email: string;
  username: string;
  address: string;
  password: string;
  profileImage: string | null;
}

export interface SignupPaymentData {
  paymentUsername: string;
  paymentQRImage: string | null;
}

interface SignupState {
  currentStep: 1 | 2 | 3 | 4; // 4 means completed
  formData: SignupFormData;
  paymentData: SignupPaymentData;
  isSignupInProgress: boolean;
  loading: boolean;
  error: string | null;
}

const initialFormData: SignupFormData = {
  name: '',
  email: '',
  username: '',
  address: '',
  password: '',
  profileImage: null,
};

const initialPaymentData: SignupPaymentData = {
  paymentUsername: '',
  paymentQRImage: null,
};

const initialState: SignupState = {
  currentStep: 1,
  formData: initialFormData,
  paymentData: initialPaymentData,
  isSignupInProgress: false,
  loading: false,
  error: null,
};

// Load persisted signup state from AsyncStorage
export const loadSignupState = createAsyncThunk(
  'signup/loadState',
  async (_, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem(SIGNUP_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Failed to load signup state:', error);
      return rejectWithValue('Failed to load signup state');
    }
  }
);

// Persist signup state to AsyncStorage
export const persistSignupState = createAsyncThunk(
  'signup/persistState',
  async (state: Partial<SignupState>, { getState, rejectWithValue }) => {
    try {
      const currentState = (getState() as any).signup as SignupState;
      const stateToSave = {
        currentStep: state.currentStep ?? currentState.currentStep,
        formData: state.formData ?? currentState.formData,
        paymentData: state.paymentData ?? currentState.paymentData,
        isSignupInProgress: state.isSignupInProgress ?? currentState.isSignupInProgress,
      };
      await AsyncStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(stateToSave));
      return stateToSave;
    } catch (error) {
      console.error('Failed to persist signup state:', error);
      return rejectWithValue('Failed to persist signup state');
    }
  }
);

// Clear persisted signup state
export const clearPersistedSignupState = createAsyncThunk(
  'signup/clearPersistedState',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem(SIGNUP_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear signup state:', error);
      return rejectWithValue('Failed to clear signup state');
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<1 | 2 | 3 | 4>) => {
      state.currentStep = action.payload;
    },
    setFormData: (state, action: PayloadAction<Partial<SignupFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setPaymentData: (state, action: PayloadAction<Partial<SignupPaymentData>>) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    startSignup: (state) => {
      state.isSignupInProgress = true;
      state.currentStep = 1;
    },
    completeSignup: (state) => {
      state.isSignupInProgress = false;
      state.currentStep = 4;
      state.formData = initialFormData;
      state.paymentData = initialPaymentData;
    },
    resetSignup: (state) => {
      state.currentStep = 1;
      state.formData = initialFormData;
      state.paymentData = initialPaymentData;
      state.isSignupInProgress = false;
      state.error = null;
    },
    setSignupError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSignupState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadSignupState.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.currentStep = action.payload.currentStep || 1;
        state.formData = action.payload.formData || initialFormData;
        state.paymentData = action.payload.paymentData || initialPaymentData;
        state.isSignupInProgress = action.payload.isSignupInProgress || false;
      }
    });
    builder.addCase(loadSignupState.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(persistSignupState.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentStep = action.payload.currentStep;
        state.formData = action.payload.formData;
        state.paymentData = action.payload.paymentData;
        state.isSignupInProgress = action.payload.isSignupInProgress;
      }
    });
    builder.addCase(clearPersistedSignupState.fulfilled, (state) => {
      state.currentStep = 1;
      state.formData = initialFormData;
      state.paymentData = initialPaymentData;
      state.isSignupInProgress = false;
      state.error = null;
    });
  },
});

export const {
  setCurrentStep,
  setFormData,
  setPaymentData,
  startSignup,
  completeSignup,
  resetSignup,
  setSignupError,
} = signupSlice.actions;

export default signupSlice.reducer;
