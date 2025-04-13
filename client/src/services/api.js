import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Profile management
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfilePicture = async (base64Image) => {
  try {
    const response = await api.put('/auth/profile/picture', { image: base64Image });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export default api; 