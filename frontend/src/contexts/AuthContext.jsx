import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  // Backend API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Configure axios defaults
  axios.defaults.baseURL = API_BASE_URL;

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

  // Sign up function
  const signup = async (userData) => {
    try {
      const response = await axios.post('/auth/signup', userData);
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Signup error:', error);
      throw error.response?.data || error.message;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  };

  // Sign out function
  const signout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setAuthToken(null);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      const updatedUser = response.data.user;
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || error.message;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error.response?.data || error.message;
    }
  };

  // Verify token
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      setAuthToken(token);
      const response = await axios.post('/auth/verify');
      const { user } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      setAuthToken(null);
      setCurrentUser(null);
      setUserRole(null);
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 