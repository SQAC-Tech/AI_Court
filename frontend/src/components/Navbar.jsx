import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, User, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { currentUser, userRole, signout } = useAuth();

  // Navigation items based on user role
  const getNavItems = () => {
    if (!currentUser) return [];
    
    if (userRole === 'user') {
      return [
        { name: 'Dashboard', path: '/user/dashboard' },
        { name: 'File Dispute', path: '/user/file-dispute' },
        { name: 'AI Suggestions', path: '/user/ai-suggestions' },
        { name: 'Mediation', path: '/user/mediation' },
        { name: 'Documents', path: '/user/documents' },
        { name: 'Case History', path: '/user/case-history' },
      ];
    } else if (userRole === 'court') {
      return [
        { name: 'Dashboard', path: '/court/dashboard' },
        { name: 'Case History', path: '/court/case-history' },
        { name: 'Documents', path: '/court/documents' },
        { name: 'Legal Documents', path: '/court/legal-documents' },
        { name: 'AI Assistant', path: '/court/chatbot' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI-Court</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* User Menu */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <User className="h-5 w-5" />
                  <span>{currentUser.displayName || currentUser.email}</span>
                </button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{currentUser.displayName || 'User'}</p>
                      <p className="text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {userRole === 'user' ? 'Citizen/User' : 'Court Official'}
                      </p>
                    </div>
                    <Link
                      to={userRole === 'user' ? '/user/profile' : '/court/profile'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={signout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {currentUser && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    <p className="font-medium">{currentUser.displayName || 'User'}</p>
                    <p className="text-xs">{currentUser.email}</p>
                    <p className="text-xs mt-1">
                      {userRole === 'user' ? 'Citizen/User' : 'Court Official'}
                    </p>
                  </div>
                  <Link
                    to={userRole === 'user' ? '/user/profile' : '/court/profile'}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      signout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar; 