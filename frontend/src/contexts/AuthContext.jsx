import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
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
  const API_BASE_URL = 'http://localhost:5000/api';

  // Check if Firebase is properly configured
  const isFirebaseConfigured = auth && typeof auth.onAuthStateChanged === 'function';

  // Sign up function
  const signup = async (email, password, role) => {
    try {
      if (!isFirebaseConfigured) {
        // Demo mode - simulate successful signup
        const demoUser = { uid: 'demo-user-id', email };
        setCurrentUser(demoUser);
        localStorage.setItem('userRole', role);
        setUserRole(role);
        return demoUser;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set user role in local storage
      localStorage.setItem('userRole', role);
      setUserRole(role);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password, role) => {
    try {
      if (!isFirebaseConfigured) {
        // Demo mode - simulate successful signin
        const demoUser = { uid: 'demo-user-id', email };
        setCurrentUser(demoUser);
        localStorage.setItem('userRole', role);
        setUserRole(role);
        return demoUser;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set user role in local storage
      localStorage.setItem('userRole', role);
      setUserRole(role);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Google sign in
  const signInWithGoogle = async (role) => {
    try {
      if (!isFirebaseConfigured) {
        // Demo mode - simulate successful Google signin
        const demoUser = { uid: 'demo-google-user-id', email: 'demo@example.com' };
        setCurrentUser(demoUser);
        localStorage.setItem('userRole', role);
        setUserRole(role);
        return demoUser;
      }
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Set user role in local storage
      localStorage.setItem('userRole', role);
      setUserRole(role);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const signout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
    setCurrentUser(null);
    
    if (isFirebaseConfigured) {
      return signOut(auth);
    }
    return Promise.resolve();
  };

  // Get user profile from backend
  const getUserProfile = async () => {
    try {
      if (!isFirebaseConfigured) {
        return { name: 'Demo User', email: 'demo@example.com' };
      }
      
      const token = await currentUser?.getIdToken();
      const role = localStorage.getItem('userRole');
      
      if (!token || !role) return null;

      const response = await axios.get(`${API_BASE_URL}/${role}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Verify token with backend
  const verifyToken = async () => {
    try {
      if (!isFirebaseConfigured) {
        return { valid: true, role: localStorage.getItem('userRole') };
      }
      
      const token = await currentUser?.getIdToken();
      if (!token) return false;

      const response = await axios.post(`${API_BASE_URL}/auth/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Demo mode - set loading to false immediately
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user role from localStorage
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        
        // Verify token with backend
        await verifyToken();
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    signin,
    signInWithGoogle,
    signout,
    getUserProfile,
    verifyToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 