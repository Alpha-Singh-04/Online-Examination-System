import { createSlice } from '@reduxjs/toolkit';
import { setToken, getToken, removeToken, getUser } from '../../utils/auth'; // Import updated functions

const storedToken = getToken(); // Get token from sessionStorage
const storedUser = getUser(); // Get user info from sessionStorage

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedToken, // True if token exists
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;

      setToken(action.payload.token, action.payload); // Store token & user info
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      removeToken(); // Clear session data
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
