import { supabase } from "@/lib/supabase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SubmitReportIssuePayload {
  user_id: string;
  category: string;
  description: string;
  screenshot_urls: string[];
  user_email: string;
}

interface ReportIssueState {
  loading: boolean;
  error: string | null;
}

const initialState: ReportIssueState = {
  loading: false,
  error: null,
};

export const submitReportIssue = createAsyncThunk(
  "reportIssue/submit",
  async (payload: SubmitReportIssuePayload, { rejectWithValue }) => {
    const { error } = await supabase.from("issue_reports").insert([
      {
        user_id: payload.user_id,
        category: payload.category,
        description: payload.description,
        screenshot_urls: payload.screenshot_urls,
        user_email: payload.user_email,
        status: "pending",
      },
    ]);

    if (error) return rejectWithValue(error.message);
    return true;
  }
);

const reportIssueSlice = createSlice({
  name: "reportIssue",
  initialState,
  reducers: {
    clearReportIssueError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReportIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReportIssue.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitReportIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReportIssueError } = reportIssueSlice.actions;
export default reportIssueSlice.reducer;
