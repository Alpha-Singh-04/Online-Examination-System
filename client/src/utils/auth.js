const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Token management functions
export const setToken = (token, user) => {
  try {
    console.log("Setting token and user in sessionStorage:", { token, user });

    if(token && user) {
      try {
        console.log('Setting token and user in sessionStorage:', { token, user });
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user)); // Store user info
      }catch(error){
        console.error('Error storing user info in sessionStorage:', error);
      }
    }else {
      console.log('Token or user is null, not setting in sessionStorage');
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getToken = () => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log("Getting token from sessionStorage:", token);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUser = () => {
  try {
    const user = sessionStorage.getItem(USER_KEY);
    const parsedUser = user ? JSON.parse(user) : null;
    console.log("Getting user from sessionStorage:", parsedUser);
    return parsedUser;
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

