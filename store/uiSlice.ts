import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type HomeMode = "buyer" | "seller";

const HOME_MODE_STORAGE_KEY = "@thriftverse/homeMode";

interface UiState {
  homeMode: HomeMode;
  hydrated: boolean;
}

const initialState: UiState = {
  homeMode: "seller",
  hydrated: false,
};

export const hydrateHomeMode = createAsyncThunk<HomeMode>(
  "ui/hydrateHomeMode",
  async () => {
    const stored = await AsyncStorage.getItem(HOME_MODE_STORAGE_KEY);
    return stored === "buyer" ? "buyer" : "seller";
  },
);

export const setHomeMode = createAsyncThunk<HomeMode, HomeMode>(
  "ui/setHomeMode",
  async (mode) => {
    await AsyncStorage.setItem(HOME_MODE_STORAGE_KEY, mode);
    return mode;
  },
);

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHomeModeLocal: (state, action: PayloadAction<HomeMode>) => {
      state.homeMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateHomeMode.fulfilled, (state, action) => {
      state.homeMode = action.payload;
      state.hydrated = true;
    });
    builder.addCase(hydrateHomeMode.rejected, (state) => {
      state.hydrated = true;
    });
    builder.addCase(setHomeMode.pending, (state, action) => {
      state.homeMode = action.meta.arg;
    });
    builder.addCase(setHomeMode.fulfilled, (state, action) => {
      state.homeMode = action.payload;
    });
  },
});

export const { setHomeModeLocal } = uiSlice.actions;
export default uiSlice.reducer;
