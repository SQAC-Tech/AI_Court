import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import CourtDashboard from './pages/CourtDashboard';
import CourtCaseHistory from './pages/CourtCaseHistory';
import CourtDocuments from './pages/CourtDocuments';
import CourtLegalDocuments from './pages/CourtLegalDocuments';
import CourtChatbot from './pages/CourtChatbot';
import Home from './pages/Home';
import FileDispute from './pages/FileDispute';
import AISuggestions from './pages/AISuggestions';
import Mediation from './pages/Mediation';
import Documents from './pages/Documents';
import CaseHistory from './pages/CaseHistory';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const { currentUser, userRole } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Only show navbar for authenticated routes */}
      {currentUser && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/file-dispute" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <FileDispute />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/ai-suggestions" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AISuggestions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/mediation" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Mediation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/documents" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Documents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/case-history" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <CaseHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Court Routes */}
          <Route 
            path="/court/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['court']}>
                <CourtDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/court/case-history" 
            element={
              <ProtectedRoute allowedRoles={['court']}>
                <CourtCaseHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/court/documents" 
            element={
              <ProtectedRoute allowedRoles={['court']}>
                <CourtDocuments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/court/legal-documents" 
            element={
              <ProtectedRoute allowedRoles={['court']}>
                <CourtLegalDocuments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/court/chatbot/:caseId?" 
            element={
              <ProtectedRoute allowedRoles={['court']}>
                <CourtChatbot />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy Routes - Redirect to appropriate user routes */}
          <Route path="/file-dispute" element={<Navigate to="/user/file-dispute" replace />} />
          <Route path="/ai-suggestions" element={<Navigate to="/user/ai-suggestions" replace />} />
          <Route path="/mediation" element={<Navigate to="/user/mediation" replace />} />
          <Route path="/documents" element={<Navigate to="/user/documents" replace />} />
          <Route path="/case-history" element={<Navigate to="/user/case-history" replace />} />
          
          {/* Default redirect based on user role */}
          <Route 
            path="/home" 
            element={
              currentUser ? (
                userRole === 'user' ? (
                  <Navigate to="/user/dashboard" replace />
                ) : (
                  <Navigate to="/court/dashboard" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
