import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendorService';

// Async thunks
export const fetchVendorDetails = createAsyncThunk(
  'vendor/fetchVendorDetails',
  async (vendorId, { rejectWithValue }) => {
    try {
      const data = await vendorService.getVendorById(vendorId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVendorAnalytics = createAsyncThunk(
  'vendor/fetchVendorAnalytics',
  async ({ vendorId, isSuperAdmin }, { rejectWithValue }) => {
    try {
      const data = await vendorService.fetchRealVendorAnalytics(vendorId, isSuperAdmin);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentVendor: null,
  analytics: null,
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearVendorData: (state) => {
      state.currentVendor = null;
      state.analytics = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Details
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.currentVendor = action.payload;
        // Keep loading true if we are still waiting for analytics? 
        // We can manage loading per-request or globally. For now, we will manage globally.
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analytics
      .addCase(fetchVendorAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
        state.loading = false; // Analytics is the final piece
      })
      .addCase(fetchVendorAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVendorData } = vendorSlice.actions;

export default vendorSlice.reducer;
