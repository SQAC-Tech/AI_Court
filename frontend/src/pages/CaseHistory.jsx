import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Calendar, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

const CaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const cases = [
    {
      id: 1,
      caseNumber: 'CR-2024-001',
      title: 'Property Dispute with Neighbor',
      type: 'Property',
      status: 'In Progress',
      dateFiled: '2024-07-25',
      lastUpdated: '2024-07-30',
      summary: 'Dispute regarding boundary encroachment and unauthorized construction on shared property line.',
      resolution: null,
      documents: 5,
      mediationScheduled: '2024-08-03'
    },
    {
      id: 2,
      caseNumber: 'CR-2024-002',
      title: 'Loan Default Case',
      type: 'Financial',
      status: 'Resolved',
      dateFiled: '2024-07-20',
      lastUpdated: '2024-07-28',
      summary: 'Case involving default on personal loan agreement with bank.',
      resolution: 'Settlement reached through mediation. Payment plan agreed upon.',
      documents: 8,
      mediationScheduled: null
    },
    {
      id: 3,
      caseNumber: 'CR-2024-003',
      title: 'Employment Contract Dispute',
      type: 'Employment',
      status: 'Scheduled for Mediation',
      dateFiled: '2024-07-15',
      lastUpdated: '2024-07-29',
      summary: 'Dispute over terms of employment contract and wrongful termination.',
      resolution: null,
      documents: 6,
      mediationScheduled: '2024-08-05'
    },
    {
      id: 4,
      caseNumber: 'CR-2024-004',
      title: 'Business Partnership Dispute',
      type: 'Commercial',
      status: 'Under Review',
      dateFiled: '2024-07-10',
      lastUpdated: '2024-07-27',
      summary: 'Dispute between business partners regarding profit sharing and management decisions.',
      resolution: null,
      documents: 12,
      mediationScheduled: null
    },
    {
      id: 5,
      caseNumber: 'CR-2024-005',
      title: 'Tenant-Landlord Dispute',
      type: 'Property',
      status: 'Resolved',
      dateFiled: '2024-07-05',
      lastUpdated: '2024-07-25',
      summary: 'Dispute over security deposit and property damage claims.',
      resolution: 'Mediation successful. Partial refund agreed upon.',
      documents: 4,
      mediationScheduled: null
    }
  ];

  const caseTypes = ['all', 'Property', 'Financial', 'Employment', 'Commercial'];
  const statuses = ['all', 'In Progress', 'Resolved', 'Scheduled for Mediation', 'Under Review'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled for Mediation':
        return 'bg-purple-100 text-purple-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Property':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Financial':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Employment':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Commercial':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || caseItem.type === selectedFilter || caseItem.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Case History</h1>
          </div>
          <p className="text-gray-600">Track all your disputes and their resolution status</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cases List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              {/* Search and Filter */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {caseTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? 'All Types' : type}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'all' ? 'All Status' : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cases List */}
              <div className="space-y-4">
                {filteredCases.map((caseItem) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleCaseClick(caseItem)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-gray-900 mr-3">{caseItem.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{caseItem.summary}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="font-medium">{caseItem.caseNumber}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(caseItem.type)}`}>
                            {caseItem.type}
                          </span>
                          <span>Filed: {caseItem.dateFiled}</span>
                          <span>Documents: {caseItem.documents}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500">Last Updated</div>
                        <div className="text-sm font-medium text-gray-900">{caseItem.lastUpdated}</div>
                      </div>
                    </div>

                    {caseItem.mediationScheduled && (
                      <div className="flex items-center text-sm text-purple-600 bg-purple-50 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 mr-1" />
                        Mediation scheduled for {caseItem.mediationScheduled}
                      </div>
                    )}

                    {caseItem.resolution && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-sm text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <strong>Resolution:</strong>
                        </div>
                        <p className="text-sm text-green-700 mt-1">{caseItem.resolution}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {filteredCases.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No cases found matching your search criteria.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Case Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedCase ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Case Details</h3>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedCase.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedCase.caseNumber}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                        {selectedCase.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedCase.type)}`}>
                        {selectedCase.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date Filed</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCase.dateFiled}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCase.documents}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                    <p className="text-sm text-gray-600">{selectedCase.summary}</p>
                  </div>

                  {selectedCase.mediationScheduled && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center text-sm text-purple-800">
                        <Calendar className="h-4 w-4 mr-1" />
                        <strong>Mediation Scheduled</strong>
                      </div>
                      <p className="text-sm text-purple-700 mt-1">{selectedCase.mediationScheduled}</p>
                    </div>
                  )}

                  {selectedCase.resolution && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-sm text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <strong>Resolution</strong>
                      </div>
                      <p className="text-sm text-green-700 mt-1">{selectedCase.resolution}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      View Full Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Details</h3>
                  <p className="text-sm text-gray-500">Select a case from the list to view detailed information.</p>
                </div>
              </motion.div>
            )}

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Cases</span>
                  <span className="text-sm font-medium text-gray-900">{cases.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="text-sm font-medium text-green-600">
                    {cases.filter(c => c.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {cases.filter(c => c.status === 'In Progress').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scheduled for Mediation</span>
                  <span className="text-sm font-medium text-purple-600">
                    {cases.filter(c => c.status === 'Scheduled for Mediation').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseHistory; 