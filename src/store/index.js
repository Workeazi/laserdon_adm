import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';

// Placeholder reducers
const rootReducer = {
  auth: (state = { isAuthenticated: false }) => state,
  vendor: vendorReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});
