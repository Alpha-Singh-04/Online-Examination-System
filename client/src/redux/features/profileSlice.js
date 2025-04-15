import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../server/config/axios'; // Adjust the import path as necessary
import { createSelector } from 'reselect';

// Async action to fetch profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
    updateProfilePicture: (state, action) => {
      console.log('Updating profile picture in Redux:', action.payload);
      if (state.data) {
        state.data.profile.profilePicture = action.payload;
      }
    },
    updateProfileName: (state, action) => {
      if (state.data) {
        state.data.name = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfile, updateProfilePicture, updateProfileName } = profileSlice.actions;


export default profileSlice.reducer;
// Memoized selector to optimize re-renders

export const selectProfile = (state) => state.profile;

export const selectProfileData = createSelector(
  [selectProfile],
  (profile) => profile.data
);

export const selectProfileLoading = createSelector(
  [selectProfile],
  (profile) => profile.loading
);

export const selectProfileError = createSelector(
  [selectProfile],
  (profile) => profile.error
);