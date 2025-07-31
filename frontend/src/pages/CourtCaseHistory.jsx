import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Download,
  MessageSquare,
  User,
  Building2,
  ArrowRight,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CourtCaseHistory = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock court cases data
  const mockCases = [
    {
      id: 'CASE001',
      title: 'Property Dispute - Apartment 4B',
      petitioner: 'John Doe',
      respondent: 'Jane Smith',
      type: 'Property',
      status: 'Under Review',
      priority: 'High',
      filedDate: '2024-01-15',
      nextHearing: '2024-02-20',
      lastActivity: '2024-01-25',
      description: 'Dispute over apartment ownership and maintenance charges',
      documents: 5,
      hearings: 2,
      mediator: 'Dr. Sarah Wilson'
    },
    {
      id: 'CASE002',
      title: 'Loan Recovery - Personal Loan',
      petitioner: 'ABC Bank',
      respondent: 'Mike Johnson',
      type: 'Financial',
      status: 'Scheduled',
      priority: 'Medium',
      filedDate: '2024-01-10',
      nextHearing: '2024-02-15',
      lastActivity: '2024-01-20',
      description: 'Recovery of personal loan amount with interest',
      documents: 3,
      hearings: 1,
      mediator: 'Dr. Robert Chen'
    },
    {
      id: 'CASE003',
      title: 'Family Property Division',
      petitioner: 'Sarah Wilson',
      respondent: 'David Wilson',
      type: 'Family',
      status: 'Mediation',
      priority: 'Low',
      filedDate: '2023-12-01',
      nextHearing: '2024-02-10',
      lastActivity: '2024-01-30',
      description: 'Division of ancestral property among siblings',
      documents: 8,
      hearings: 3,
      mediator: 'Dr. Emily Brown'
    },
    {
      id: 'CASE004',
      title: 'Business Contract Breach',
      petitioner: 'TechCorp Solutions',
      respondent: 'InnovateSoft Ltd',
      type: 'Commercial',
      status: 'Completed',
      priority: 'High',
      filedDate: '2023-11-15',
      nextHearing: null,
      lastActivity: '2024-01-15',
      description: 'Breach of software development contract',
      documents: 12,
      hearings: 5,
      mediator: 'Dr. James Anderson'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Mediation':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.petitioner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.respondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.filedDate);
        bValue = new Date(b.filedDate);
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case history...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Court Case History
              </h1>
              <p className="text-gray-600">
                Manage and review all court cases and their proceedings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/court/documents"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Upload Documents</span>
              </Link>
              <Link
                to="/court/legal-documents"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Generate Documents</span>
              </Link>
            </div>
          </div>
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
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
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
                  {cases.filter(c => c.status === 'Under Review').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'Scheduled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Under Review">Under Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Mediation">Mediation</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </motion.div>

        {/* Cases List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cases ({sortedCases.length})
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {sortedCases.map((caseItem) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {caseItem.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <User className="h-4 w-4 inline mr-1" />
                            Petitioner: <span className="font-medium">{caseItem.petitioner}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <Building2 className="h-4 w-4 inline mr-1" />
                            Respondent: <span className="font-medium">{caseItem.respondent}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Filed: <span className="font-medium">{caseItem.filedDate}</span>
                          </p>
                          {caseItem.nextHearing && (
                            <p className="text-sm text-gray-600">
                              <Clock className="h-4 w-4 inline mr-1" />
                              Next Hearing: <span className="font-medium">{caseItem.nextHearing}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{caseItem.description}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Documents: {caseItem.documents}</span>
                        <span>Hearings: {caseItem.hearings}</span>
                        <span>Mediator: {caseItem.mediator}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/court/case/${caseItem.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/court/case/${caseItem.id}/edit`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Case"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download Documents"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/court/chatbot/${caseItem.id}`}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="AI Assistant"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {sortedCases.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No cases found matching your criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourtCaseHistory; 