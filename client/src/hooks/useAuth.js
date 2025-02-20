import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../redux/features/authSlice';
import { setToken, removeToken } from '../utils/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = async (credentials) => {
    dispatch(loginStart());
    try {
      // API call will be added later
      const mockResponse = {
        user: { id: 1, name: 'Test User', email: credentials.email },
        token: 'mock-token'
      };
      setToken(mockResponse.token);
      dispatch(loginSuccess(mockResponse.user));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const logoutUser = () => {
    removeToken();
    dispatch(logout());
  };

  return {
    ...auth,
    login,
    logout: logoutUser
  };
};