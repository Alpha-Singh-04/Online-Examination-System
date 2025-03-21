const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Token management functions
export const setToken = (token, user) => {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user)); // Store user info
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUser = () => {
  try {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const isAuthenticated = () => {
  return getToken() !== null;
};

