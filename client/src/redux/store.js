import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  // Add reducers here
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});