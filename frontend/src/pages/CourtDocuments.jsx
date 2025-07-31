import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  FolderOpen,
  FileImage,
  FileArchive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CourtDocuments = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Mock documents data
  const mockDocuments = [
    {
      id: 'DOC001',
      name: 'Complaint_Property_Dispute.pdf',
      category: 'Complaint',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      uploadedBy: 'John Doe',
      uploadedDate: '2024-01-15',
      fileSize: '2.4 MB',
      fileType: 'pdf',
      status: 'Verified',
      description: 'Initial complaint filed by petitioner'
    },
    {
      id: 'DOC002',
      name: 'Evidence_Property_Photos.zip',
      category: 'Evidence',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      uploadedBy: 'John Doe',
      uploadedDate: '2024-01-20',
      fileSize: '15.7 MB',
      fileType: 'zip',
      status: 'Pending',
      description: 'Photographic evidence of property damage'
    },
    {
      id: 'DOC003',
      name: 'Response_Property_Dispute.pdf',
      category: 'Response',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      uploadedBy: 'Jane Smith',
      uploadedDate: '2024-01-25',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      status: 'Verified',
      description: 'Respondent\'s response to the complaint'
    },
    {
      id: 'DOC004',
      name: 'Loan_Agreement.pdf',
      category: 'Contract',
      caseId: 'CASE002',
      caseTitle: 'Loan Recovery - Personal Loan',
      uploadedBy: 'ABC Bank',
      uploadedDate: '2024-01-10',
      fileSize: '3.2 MB',
      fileType: 'pdf',
      status: 'Verified',
      description: 'Original loan agreement document'
    },
    {
      id: 'DOC005',
      name: 'Court_Order_Property.pdf',
      category: 'Court Order',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      uploadedBy: 'Hon. Judge Smith',
      uploadedDate: '2024-01-30',
      fileSize: '1.5 MB',
      fileType: 'pdf',
      status: 'Verified',
      description: 'Interim court order for property maintenance'
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
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'zip':
        return <FileArchive className="h-6 w-6 text-purple-500" />;
      case 'jpg':
      case 'png':
        return <FileImage className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-blue-500" />;
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDocuments = selectedFiles.map((file, index) => ({
        id: `DOC${String(Date.now()).slice(-6)}${index}`,
        name: file.name,
        category: 'Uploaded',
        caseId: 'CASE001',
        caseTitle: 'Property Dispute - Apartment 4B',
        uploadedBy: currentUser?.displayName || 'Court Official',
        uploadedDate: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileType: file.name.split('.').pop().toLowerCase(),
        status: 'Pending',
        description: 'Recently uploaded document'
      }));
      
      setDocuments([...newDocuments, ...documents]);
      setSelectedFiles([]);
      setUploading(false);
    }, 2000);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
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
                Court Documents
              </h1>
              <p className="text-gray-600">
                Upload, manage, and review legal documents for all cases
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/court/case-history"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FolderOpen className="h-4 w-4" />
                <span>View Cases</span>
              </Link>
              <Link
                to="/court/legal-documents"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Generate Documents</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG, ZIP (Max 50MB per file)
            </p>
            
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Select Files
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h3 className="text-md font-medium text-gray-900 mb-3">Selected Files:</h3>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileTypeIcon(file.name.split('.').pop().toLowerCase())}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Case</option>
                  <option value="CASE001">CASE001 - Property Dispute</option>
                  <option value="CASE002">CASE002 - Loan Recovery</option>
                  <option value="CASE003">CASE003 - Family Property</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Response">Response</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Court Order">Court Order</option>
                  <option value="Contract">Contract</option>
                </select>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Files</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Complaint">Complaint</option>
              <option value="Response">Response</option>
              <option value="Evidence">Evidence</option>
              <option value="Court Order">Court Order</option>
              <option value="Contract">Contract</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Cases</option>
              <option value="CASE001">CASE001 - Property Dispute</option>
              <option value="CASE002">CASE002 - Loan Recovery</option>
              <option value="CASE003">CASE003 - Family Property</option>
            </select>
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileTypeIcon(doc.fileType)}
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Case: {doc.caseId}</span>
                          <span>Category: {doc.category}</span>
                          <span>Size: {doc.fileSize}</span>
                          <span>Uploaded: {doc.uploadedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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

export default CourtDocuments; 