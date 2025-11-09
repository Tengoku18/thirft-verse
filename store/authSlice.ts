import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';
import { getCurrentUser, getCurrentSession } from '@/lib/database-helpers';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const result = await getCurrentUser();
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const fetchCurrentSession = createAsyncThunk(
  'auth/fetchCurrentSession',
  async (_, { rejectWithValue }) => {
    const result = await getCurrentSession();
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return rejectWithValue(error);
    }

    return { user: data.user, session: data.session };
  }
);

export const signUpWithOtp = createAsyncThunk(
  'auth/signUpWithOtp',
  async (
    { email, name, username, profileImage }: { email: string; name: string; username: string; profileImage?: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          name,
          username,
          profile_image: profileImage,
        },
      },
    });

    if (error) {
      return rejectWithValue(error);
    }

    return data;
  }
);

export const verifyOtpAndSetPassword = createAsyncThunk(
  'auth/verifyOtpAndSetPassword',
  async (
    { email, token, password, metadata }: { email: string; token: string; password: string; metadata: any },
    { rejectWithValue }
  ) => {
    // Verify OTP
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (verifyError) {
      return rejectWithValue(verifyError);
    }

    // Update user with password and metadata
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password,
      data: metadata,
    });

    if (updateError) {
      return rejectWithValue(updateError);
    }

    return { user: updateData.user, session: verifyData.session };
  }
);

export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return rejectWithValue(error);
    }

    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload || null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to fetch user';
    });

    // Fetch current session
    builder.addCase(fetchCurrentSession.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentSession.fulfilled, (state, action) => {
      state.loading = false;
      state.session = action.payload || null;
      state.user = action.payload?.user || null;
    });
    builder.addCase(fetchCurrentSession.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to fetch session';
    });

    // Sign in with password
    builder.addCase(signInWithPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signInWithPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
    });
    builder.addCase(signInWithPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to sign in';
    });

    // Sign up with OTP
    builder.addCase(signUpWithOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUpWithOtp.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signUpWithOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to sign up';
    });

    // Verify OTP and set password
    builder.addCase(verifyOtpAndSetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtpAndSetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
    });
    builder.addCase(verifyOtpAndSetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to verify OTP';
    });

    // Sign out
    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.session = null;
    });
    builder.addCase(signOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to sign out';
    });
  },
});

export const { setUser, setSession, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;
