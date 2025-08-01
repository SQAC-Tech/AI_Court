import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, User, Bot, Clock, FileText, Scale, Gavel, FileText as DocumentText, ArrowLeft } from 'lucide-react';

const FileDispute = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState({
    common: [
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m here to help you with common legal queries. Please describe your question or concern, and I\'ll provide you with relevant information and guidance.',
        timestamp: '2:30 PM'
      }
    ],
    bail: [
      {
        id: 1,
        type: 'bot',
        content: 'Welcome to the Bail Summary Assistant! I can help you understand bail procedures, requirements, and provide guidance on bail-related matters. What would you like to know?',
        timestamp: '2:30 PM'
      }
    ],
    document: [
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your Document Summary Assistant. I can help you analyze legal documents, extract key information, and provide summaries. Please share the document or describe what you need help with.',
        timestamp: '2:30 PM'
      }
    ]
  });

  const handleSendMessage = async (section) => {
    if (message.trim()) {
      const newMessage = {
        id: conversations[section].length + 1,
        type: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => ({
        ...prev,
        [section]: [...prev[section], newMessage]
      }));
      setMessage('');

      // Handle different sections
      if (section === 'bail') {
        try {
          // Call the bail prediction API
          const response = await fetch('http://172.20.10.2:5000/predict_bail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              case_summary: message
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          const aiResponse = {
            id: conversations[section].length + 2,
            type: 'bot',
            content: data.analysis || data.response || data.message || 'I\'ve analyzed your case and provided a bail prediction. Please let me know if you need any clarification.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setConversations(prev => ({
            ...prev,
            [section]: [...prev[section], aiResponse]
          }));
        } catch (error) {
          console.error('Error calling bail prediction API:', error);
          const errorResponse = {
            id: conversations[section].length + 2,
            type: 'bot',
            content: 'I apologize, but I\'m having trouble connecting to the bail prediction service at the moment. Please try again later or contact support if the issue persists.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setConversations(prev => ({
            ...prev,
            [section]: [...prev[section], errorResponse]
          }));
        }
      } else if (section === 'common') {
        try {
          // Call the common legal queries API
          const response = await fetch('http://172.20.10.2:5000/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: message
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          const aiResponse = {
            id: conversations[section].length + 2,
            type: 'bot',
            content: data.answer || data.response || data.message || 'I\'ve provided you with information about your legal query. Please let me know if you need any clarification.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setConversations(prev => ({
            ...prev,
            [section]: [...prev[section], aiResponse]
          }));
        } catch (error) {
          console.error('Error calling common queries API:', error);
          const errorResponse = {
            id: conversations[section].length + 2,
            type: 'bot',
            content: 'I apologize, but I\'m having trouble connecting to the legal query service at the moment. Please try again later or contact support if the issue persists.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setConversations(prev => ({
            ...prev,
            [section]: [...prev[section], errorResponse]
          }));
        }
      } else {
        // For document section, keep the existing simulated responses for now
        setTimeout(() => {
          let aiResponse;
          switch(section) {
            case 'document':
              aiResponse = {
                id: conversations[section].length + 2,
                type: 'bot',
                content: 'I\'m processing your document request. I can help you understand the key points, legal implications, and provide a comprehensive summary. Please share the document or provide more specific details.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              break;
            default:
              aiResponse = {
                id: conversations[section].length + 2,
                type: 'bot',
                content: 'Thank you for your message. I\'m here to help you with your legal queries.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
          }
          
          setConversations(prev => ({
            ...prev,
            [section]: [...prev[section], aiResponse]
          }));
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(activeSection);
    }
  };

  const getSectionTitle = (section) => {
    switch(section) {
      case 'common': return 'Common Legal Queries';
      case 'bail': return 'Bail Summary Assistant';
      case 'document': return 'Document Summary Assistant';
      default: return 'Legal Assistant';
    }
  };

  const getSectionIcon = (section) => {
    switch(section) {
      case 'common': return <Scale className="h-8 w-8" />;
      case 'bail': return <Gavel className="h-8 w-8" />;
      case 'document': return <DocumentText className="h-8 w-8" />;
      default: return <MessageCircle className="h-8 w-8" />;
    }
  };

  const getSectionDescription = (section) => {
    switch(section) {
      case 'common': return 'Get answers to common legal questions and general guidance';
      case 'bail': return 'Understand bail procedures, requirements, and applications';
      case 'document': return 'Analyze legal documents and get comprehensive summaries';
      default: return 'AI-powered legal assistance';
    }
  };

  // Main selection screen
  if (!activeSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Legal Assistant</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the type of legal assistance you need. Our AI-powered system can help you with various legal queries and document analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Common Queries Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() => setActiveSection('common')}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Scale className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Legal Queries</h3>
                <p className="text-gray-600 mb-6">
                  Get answers to general legal questions, understand your rights, and receive guidance on common legal matters.
                </p>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  General Legal Help
                </div>
              </div>
            </motion.div>

            {/* Bail Summary Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setActiveSection('bail')}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-green-200"
            >
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Gavel className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Bail Summary Assistant</h3>
                <p className="text-gray-600 mb-6">
                  Understand bail procedures, eligibility criteria, application processes, and get guidance on bail-related matters.
                </p>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Bail & Release
                </div>
              </div>
            </motion.div>

            {/* Document Summary Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setActiveSection('document')}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
            >
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <DocumentText className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Document Summary Assistant</h3>
                <p className="text-gray-600 mb-6">
                  Upload legal documents for analysis, get key information extraction, and receive comprehensive summaries.
                </p>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  Document Analysis
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Chatbot interface
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <button
              onClick={() => setActiveSection(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Selection
            </button>
          </div>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              {getSectionIcon(activeSection)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
              <p className="text-gray-600">{getSectionDescription(activeSection)}</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col"
        >
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{getSectionTitle(activeSection)}</h3>
                <p className="text-sm text-gray-500">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {conversations[activeSection].map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-xs lg:max-w-md ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-2 rounded-full mr-3 ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-2 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask about ${activeSection === 'common' ? 'legal queries' : activeSection === 'bail' ? 'bail matters' : 'document analysis'}...`}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <button
                onClick={() => handleSendMessage(activeSection)}
                disabled={!message.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileDispute; 