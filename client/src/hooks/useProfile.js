import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../server/config/axios';
import { logout } from '../redux/features/authSlice';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        // If token is invalid or expired, logout
        if (err.response && err.response.status === 401) {
          dispatch(logout());
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  return { profile, loading, error };
};