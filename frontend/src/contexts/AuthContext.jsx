import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults globally
axios.defaults.baseURL = API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add request interceptor for authentication
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        setCurrentUser(null);
        setUserRole(null);
        setError('Session expired. Please login again.');
      }
      return Promise.reject(error);
    }
  );

  // Add token to requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Sign up function
  const signup = async (userData) => {
    try {
      clearError();
      const response = await axios.post('/api/auth/signup', userData);
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      clearError();
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Sign out function
  const signout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setUserRole(null);
      setAuthToken(null);
      setError(null);
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      const user = response.data.user;
      setCurrentUser(user);
      setUserRole(user.role);
      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      clearError();
      const response = await axios.put('/api/auth/profile', profileData);
      const updatedUser = response.data.user;
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      clearError();
      const response = await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Verify token
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      setAuthToken(token);
      const response = await axios.post('/api/auth/verify');
      const { user } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setError(null);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      setAuthToken(null);
      setCurrentUser(null);
      setUserRole(null);
      setError('Session expired. Please login again.');
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        await verifyToken();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    signin,
    signout,
    getUserProfile,
    updateProfile,
    changePassword,
    verifyToken,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 