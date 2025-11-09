import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/lib/types/database';
import { getUserProfile, updateUserProfile, createUserProfile, CreateProfileData } from '@/lib/database-helpers';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    const result = await getUserProfile(userId);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    data: { userId: string; name?: string; bio?: string; profile_image?: string },
    { rejectWithValue }
  ) => {
    const result = await updateUserProfile(data);
    if (!result.success) {
      return rejectWithValue(result.error);
    }

    // Fetch updated profile
    const updatedProfile = await getUserProfile(data.userId);
    if (!updatedProfile.success) {
      return rejectWithValue(updatedProfile.error);
    }

    return updatedProfile.data;
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (data: CreateProfileData, { rejectWithValue }) => {
    const result = await createUserProfile(data);
    if (!result.success) {
      return rejectWithValue(result.error);
    }

    // Fetch created profile
    const createdProfile = await getUserProfile(data.userId);
    if (!createdProfile.success) {
      return rejectWithValue(createdProfile.error);
    }

    return createdProfile.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to fetch profile';
    });

    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to update profile';
    });

    // Create profile
    builder.addCase(createProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(createProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.message || 'Failed to create profile';
    });
  },
});

export const { setProfile, clearProfile, setError } = profileSlice.actions;
export default profileSlice.reducer;
