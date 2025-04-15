import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { logout } from '../redux/features/authSlice';

export const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data || {});
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  return { profile, loading, error, refreshProfile: fetchProfile };
};


export default useProfile;