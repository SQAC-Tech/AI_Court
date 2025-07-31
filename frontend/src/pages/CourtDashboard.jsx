import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Search,
  Filter,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Gavel,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CourtDashboard = () => {
  const { currentUser, getUserProfile } = useAuth();
  const [courtProfile, setCourtProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setCourtProfile(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getUserProfile]);

  // Mock data for court cases
  const mockCourtCases = [
    {
      id: 1,
      title: 'Property Dispute - Case #123',
      status: 'under-review',
      date: '2024-01-15',
      type: 'Property',
      priority: 'high',
      parties: ['John Doe', 'Jane Smith'],
      nextHearing: '2024-01-25'
    },
    {
      id: 2,
      title: 'Loan Recovery - Case #124',
      status: 'scheduled',
      date: '2024-01-10',
      type: 'Financial',
      priority: 'medium',
      parties: ['ABC Bank', 'XYZ Company'],
      nextHearing: '2024-01-22'
    },
    {
      id: 3,
      title: 'Family Matter - Case #125',
      status: 'mediation-scheduled',
      date: '2024-01-05',
      type: 'Family',
      priority: 'low',
      parties: ['Robert Johnson', 'Sarah Johnson'],
      nextHearing: '2024-01-20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'under-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'mediation-scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const courtActions = [
    {
      title: 'Review Cases',
      description: 'Review pending case submissions',
      icon: <FileText className="h-6 w-6" />,
      link: '/court/review-cases',
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule Hearings',
      description: 'Schedule court hearings and mediations',
      icon: <Calendar className="h-6 w-6" />,
      link: '/court/schedule',
      color: 'bg-green-500'
    },
    {
      title: 'Generate Documents',
      description: 'Create legal documents and orders',
      icon: <Gavel className="h-6 w-6" />,
      link: '/court/documents',
      color: 'bg-purple-500'
    },
    {
      title: 'Court Calendar',
      description: 'Manage court calendar and proceedings',
      icon: <CalendarDays className="h-6 w-6" />,
      link: '/court/calendar',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading court dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Court Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, {courtProfile?.name || currentUser?.displayName || 'Court Official'}. Manage cases and proceedings.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{mockCourtCases.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCourtCases.filter(c => c.status === 'under-review').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCourtCases.filter(c => c.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mediation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCourtCases.filter(c => c.status === 'mediation-scheduled').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Court Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Court Actions</h2>
              <div className="space-y-3">
                {courtActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Court Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Court Cases</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search cases..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {mockCourtCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {caseItem.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Filed: {caseItem.date}</span>
                            <span>Type: {caseItem.type}</span>
                            <span>Parties: {caseItem.parties.join(' vs ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                            {caseItem.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Next Hearing: {caseItem.nextHearing}</span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Review
                          </button>
                          <button className="text-green-600 hover:text-green-700 font-medium">
                            Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/court/all-cases"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View all cases →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourtDashboard; 