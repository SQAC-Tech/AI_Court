import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, FileSignature, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Documents = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const documents = [
    {
      id: 1,
      name: 'Settlement Agreement',
      type: 'Legal Document',
      status: 'Generated',
      date: '2024-07-30',
      size: '2.3 MB',
      description: 'Comprehensive settlement agreement between parties in the property dispute case.',
      signed: false,
      generated: true
    },
    {
      id: 2,
      name: 'Legal Notice',
      type: 'Legal Document',
      status: 'Pending',
      date: '2024-07-30',
      size: '1.8 MB',
      description: 'Formal legal notice to be served to the opposing party.',
      signed: false,
      generated: false
    },
    {
      id: 3,
      name: 'Affidavit of Evidence',
      type: 'Legal Document',
      status: 'Generated',
      date: '2024-07-29',
      size: '3.1 MB',
      description: 'Sworn statement of facts and evidence in support of the case.',
      signed: true,
      generated: true
    },
    {
      id: 4,
      name: 'Mediation Agreement',
      type: 'Legal Document',
      status: 'Pending',
      date: '2024-07-30',
      size: '1.5 MB',
      description: 'Agreement outlining terms and conditions for mediation process.',
      signed: false,
      generated: false
    },
    {
      id: 5,
      name: 'Power of Attorney',
      type: 'Legal Document',
      status: 'Generated',
      date: '2024-07-28',
      size: '2.7 MB',
      description: 'Authorization document for legal representation.',
      signed: false,
      generated: true
    }
  ];

  const handleGenerate = (documentId) => {
    setIsGenerating(true);
    // Simulate document generation
    setTimeout(() => {
      const updatedDocs = documents.map(doc => 
        doc.id === documentId ? { ...doc, generated: true, status: 'Generated' } : doc
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleSign = (documentId) => {
    setIsSigning(true);
    // Simulate DocuSign process
    setTimeout(() => {
      const updatedDocs = documents.map(doc => 
        doc.id === documentId ? { ...doc, signed: true } : doc
      );
      setIsSigning(false);
    }, 3000);
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
  };

  const getStatusColor = (status, signed) => {
    if (signed) return 'bg-green-100 text-green-800';
    if (status === 'Generated') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status, signed) => {
    if (signed) return 'Signed';
    if (status === 'Generated') return 'Generated';
    return 'Pending';
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
            <h1 className="text-3xl font-bold text-gray-900">Documents & E-Sign</h1>
          </div>
          <p className="text-gray-600">Generate and electronically sign legal documents</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Legal Documents</h2>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>{doc.date}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status, doc.signed)}`}>
                          {getStatusText(doc.status, doc.signed)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {!doc.generated ? (
                        <button
                          onClick={() => handleGenerate(doc.id)}
                          disabled={isGenerating}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {isGenerating ? (
                            <>
                              <Clock className="h-4 w-4 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-1" />
                              Generate
                            </>
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePreview(doc)}
                            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </button>
                          <button className="flex items-center px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                          {!doc.signed && (
                            <button
                              onClick={() => handleSign(doc.id)}
                              disabled={isSigning}
                              className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              {isSigning ? (
                                <>
                                  <Clock className="h-4 w-4 mr-1 animate-spin" />
                                  Signing...
                                </>
                              ) : (
                                <>
                                  <FileSignature className="h-4 w-4 mr-1" />
                                  E-Sign
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-1 space-y-6">
            {selectedDocument && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedDocument.name}</h4>
                    <p className="text-sm text-gray-600">{selectedDocument.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">PDF Preview</p>
                      <p className="text-xs text-gray-400">Document content would appear here</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Size: {selectedDocument.size}</span>
                    <span className="text-gray-500">Date: {selectedDocument.date}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DocuSign Integration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FileSignature className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">DocuSign Integration</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Connected</p>
                    <p className="text-xs text-green-600">DocuSign account linked</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Features:</strong></p>
                  <ul className="space-y-1 text-xs">
                    <li>• Secure electronic signatures</li>
                    <li>• Legally binding documents</li>
                    <li>• Audit trail and compliance</li>
                    <li>• Multi-party signing</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Document Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Generated</span>
                  <span className="text-sm font-medium text-blue-600">
                    {documents.filter(d => d.generated).length}/{documents.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Signed</span>
                  <span className="text-sm font-medium text-green-600">
                    {documents.filter(d => d.signed).length}/{documents.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {documents.filter(d => !d.generated).length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-semibold mb-2">Important Notes</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• All documents are legally binding</li>
                    <li>• E-signatures are court-admissible</li>
                    <li>• Keep copies for your records</li>
                    <li>• Contact support for questions</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents; 