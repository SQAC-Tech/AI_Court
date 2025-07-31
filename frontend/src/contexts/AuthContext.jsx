import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

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

  // Firebase Google Sign In (using redirect instead of popup)
  const signInWithGoogle = async () => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // The redirect will happen, and the result will be handled in useEffect
    } catch (error) {
      console.error('Google sign in error:', error);
      const errorMessage = error.message || 'Failed to sign in with Google';
      setError(errorMessage);
      throw { error: errorMessage };
    }
  };

  // Handle Firebase redirect result
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Firebase redirect result received:', result.user.email);
        
        // Get user info from Firebase
        const { user: firebaseUser } = result;
        
        // Create or get user from backend
        const userData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          firebaseUid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
          provider: 'google'
        };

        console.log('Attempting to login with Firebase UID:', firebaseUser.uid);

        // Try to login with Firebase UID, if not exists, create account
        try {
          const response = await axios.post('/api/auth/firebase-login', userData);
          const { user, token } = response.data;
          
          console.log('Firebase login successful, user role:', user.role);
          
          setCurrentUser(user);
          setUserRole(user.role);
          setAuthToken(token);
          
          // Navigate to appropriate dashboard
          if (user.role === 'user') {
            console.log('Redirecting to user dashboard...');
            window.location.href = '/user/dashboard';
          } else {
            console.log('Redirecting to court dashboard...');
            window.location.href = '/court/dashboard';
          }
          
          return { user, token };
        } catch (error) {
          console.log('Firebase login failed, attempting signup...');
          
          // If user doesn't exist, create account
          if (error.response?.status === 404) {
            const signupResponse = await axios.post('/api/auth/firebase-signup', userData);
            const { user, token } = signupResponse.data;
            
            console.log('Firebase signup successful, user role:', user.role);
            
            setCurrentUser(user);
            setUserRole(user.role);
            setAuthToken(token);
            
            // Navigate to appropriate dashboard
            if (user.role === 'user') {
              console.log('Redirecting to user dashboard...');
              window.location.href = '/user/dashboard';
            } else {
              console.log('Redirecting to court dashboard...');
              window.location.href = '/court/dashboard';
            }
            
            return { user, token };
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Redirect result error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
    }
  };

  // Firebase Email/Password Sign In
  const signInWithFirebase = async (email, password) => {
    try {
      clearError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user info from Firebase
      const { user: firebaseUser } = result;
      
      // Login with backend
      const userData = {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        provider: 'email'
      };

      const response = await axios.post('/api/auth/firebase-login', userData);
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Firebase sign in error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Firebase Email/Password Sign Up
  const signUpWithFirebase = async (userData) => {
    try {
      clearError();
      
      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Get user info from Firebase
      const { user: firebaseUser } = result;
      
      // Create user in backend
      const backendUserData = {
        ...userData,
        firebaseUid: firebaseUser.uid,
        provider: 'email'
      };

      const response = await axios.post('/api/auth/firebase-signup', backendUserData);
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setUserRole(user.role);
      setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      console.error('Firebase sign up error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setError(errorMessage);
      throw error.response?.data || { error: errorMessage };
    }
  };

  // Sign up function (existing backend method)
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

  // Sign in function (existing backend method)
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
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
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
        // Handle redirect result first
        await handleRedirectResult();
        
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in with Firebase
            try {
              const userData = {
                email: firebaseUser.email,
                firebaseUid: firebaseUser.uid,
                provider: 'firebase'
              };
              
              const response = await axios.post('/api/auth/firebase-login', userData);
              const { user, token } = response.data;
              
              setCurrentUser(user);
              setUserRole(user.role);
              setAuthToken(token);
              
              // Navigate to appropriate dashboard if not already on a dashboard page
              const currentPath = window.location.pathname;
              if (!currentPath.includes('/user/dashboard') && !currentPath.includes('/court/dashboard')) {
                if (user.role === 'user') {
                  window.location.href = '/user/dashboard';
                } else {
                  window.location.href = '/court/dashboard';
                }
              }
            } catch (error) {
              console.error('Firebase auth state change error:', error);
            }
          } else {
            // User is signed out from Firebase, check JWT token
            await verifyToken();
          }
        });

        // Cleanup subscription
        return () => unsubscribe();
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
    signInWithGoogle,
    signInWithFirebase,
    signUpWithFirebase,
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