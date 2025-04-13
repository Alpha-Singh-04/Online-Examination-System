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
      console.log("Redux loginSuccess - Received payload:", action.payload);
      const userData = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role
      };
      console.log("Redux loginSuccess - Processed userData:", userData);
      
      state.loading = false;
      state.isAuthenticated = true;
      state.user = userData;
      state.error = null;

      // Store token and user data in sessionStorage
      setToken(action.payload.token, userData);
    },
    loginFailure: (state, action) => {
      console.log("Redux loginFailure:", action.payload);
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      removeToken(); // Clear any existing token
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      removeToken();
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
