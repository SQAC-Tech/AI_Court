import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Save, 
  Edit, 
  Eye, 
  Search,
  Plus,
  Calendar,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Copy,
  Printer,
  Brain,
  Sparkles,
  FileSignature,
  Scale
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CourtLegalDocuments = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Mock legal documents data
  const mockDocuments = [
    {
      id: 'DOC001',
      title: 'Interim Order - Property Dispute',
      type: 'Court Order',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      generatedBy: 'Hon. Judge Smith',
      generatedDate: '2024-01-30',
      status: 'Issued',
      description: 'Interim order for property maintenance and access',
      content: 'This court hereby orders...',
      template: 'interim-order'
    },
    {
      id: 'DOC002',
      title: 'Summons - Loan Recovery Case',
      type: 'Summons',
      caseId: 'CASE002',
      caseTitle: 'Loan Recovery - Personal Loan',
      generatedBy: 'Hon. Judge Smith',
      generatedDate: '2024-01-25',
      status: 'Draft',
      description: 'Summons to appear before the court',
      content: 'You are hereby summoned...',
      template: 'summons'
    },
    {
      id: 'DOC003',
      title: 'Mediation Agreement - Family Property',
      type: 'Mediation Agreement',
      caseId: 'CASE003',
      caseTitle: 'Family Property Division',
      generatedBy: 'Hon. Judge Smith',
      generatedDate: '2024-01-20',
      status: 'Issued',
      description: 'Agreement for mediation proceedings',
      content: 'Both parties agree to...',
      template: 'mediation-agreement'
    },
    {
      id: 'DOC004',
      title: 'Final Judgment - Business Contract',
      type: 'Final Judgment',
      caseId: 'CASE004',
      caseTitle: 'Business Contract Breach',
      generatedBy: 'Hon. Judge Smith',
      generatedDate: '2024-01-15',
      status: 'Issued',
      description: 'Final judgment in the matter',
      content: 'This court finds that...',
      template: 'final-judgment'
    }
  ];

  const documentTemplates = [
    {
      id: 'court-order',
      name: 'Court Order',
      description: 'Generate interim or final court orders',
      icon: <Scale className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'summons',
      name: 'Summons',
      description: 'Create summons to appear before court',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'mediation-agreement',
      name: 'Mediation Agreement',
      description: 'Generate mediation agreements',
      icon: <User className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'final-judgment',
      name: 'Final Judgment',
      description: 'Create final judgments and decrees',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'notice',
      name: 'Legal Notice',
      description: 'Generate legal notices and warnings',
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'settlement',
      name: 'Settlement Agreement',
      description: 'Create settlement agreements',
      icon: <FileSignature className="h-6 w-6" />,
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Court Order':
        return 'bg-blue-100 text-blue-800';
      case 'Summons':
        return 'bg-red-100 text-red-800';
      case 'Mediation Agreement':
        return 'bg-green-100 text-green-800';
      case 'Final Judgment':
        return 'bg-purple-100 text-purple-800';
      case 'Legal Notice':
        return 'bg-orange-100 text-orange-800';
      case 'Settlement Agreement':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;
    
    setGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      const newDocument = {
        id: `DOC${String(Date.now()).slice(-6)}`,
        title: `Generated ${documentTemplates.find(t => t.id === selectedTemplate)?.name}`,
        type: documentTemplates.find(t => t.id === selectedTemplate)?.name,
        caseId: 'CASE001',
        caseTitle: 'Property Dispute - Apartment 4B',
        generatedBy: currentUser?.displayName || 'Hon. Judge Smith',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        description: 'AI-generated legal document',
        content: 'This is a sample generated document content...',
        template: selectedTemplate
      };
      
      setDocuments([newDocument, ...documents]);
      setSelectedTemplate('');
      setShowGenerator(false);
      setGenerating(false);
    }, 3000);
  };

  const filteredDocuments = documents.filter(doc => {
    return doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.caseTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading legal documents...</p>
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
                Legal Document Generator
              </h1>
              <p className="text-gray-600">
                Create and issue legal documents with AI assistance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/court/case-history"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>View Cases</span>
              </Link>
              <button
                onClick={() => setShowGenerator(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Generate Document</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Document Generator Modal */}
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowGenerator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate Legal Document</h2>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Template</h3>
                  <div className="space-y-3">
                    {documentTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${template.color} text-white`}>
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Case</option>
                        <option value="CASE001">CASE001 - Property Dispute</option>
                        <option value="CASE002">CASE002 - Loan Recovery</option>
                        <option value="CASE003">CASE003 - Family Property</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter document title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Enter document description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ai-assist"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="ai-assist" className="text-sm text-gray-700">
                        Use AI assistance for content generation
                      </label>
                    </div>

                    <div className="flex items-center space-x-4 pt-4">
                      <button
                        onClick={handleGenerateDocument}
                        disabled={!selectedTemplate || generating}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate Document</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowGenerator(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Generated Documents ({filteredDocuments.length})
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doc.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                          {doc.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <User className="h-4 w-4 inline mr-1" />
                            Generated by: <span className="font-medium">{doc.generatedBy}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Date: <span className="font-medium">{doc.generatedDate}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <FileText className="h-4 w-4 inline mr-1" />
                            Case: <span className="font-medium">{doc.caseId}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <Building2 className="h-4 w-4 inline mr-1" />
                            Case Title: <span className="font-medium">{doc.caseTitle}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{doc.description}</p>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 font-medium mb-2">Document Preview:</p>
                        <p className="text-sm text-gray-600 italic">
                          {doc.content.length > 150 ? `${doc.content.substring(0, 150)}...` : doc.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Document"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Print"
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Send"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No documents found matching your criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourtLegalDocuments; 