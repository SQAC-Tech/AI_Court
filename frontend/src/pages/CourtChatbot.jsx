import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Download, 
  Trash2, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Brain,
  Sparkles,
  User,
  Bot,
  Clock,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CourtChatbot = () => {
  const { currentUser } = useAuth();
  const { caseId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Mock conversations data
  const mockConversations = [
    {
      id: 'CONV001',
      caseId: 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      date: '2024-01-30',
      duration: '15:30',
      messages: 8,
      summary: 'Discussion about property maintenance orders and interim relief',
      status: 'Completed'
    },
    {
      id: 'CONV002',
      caseId: 'CASE002',
      caseTitle: 'Loan Recovery - Personal Loan',
      date: '2024-01-29',
      duration: '22:15',
      messages: 12,
      summary: 'Analysis of loan agreement terms and recovery procedures',
      status: 'In Progress'
    },
    {
      id: 'CONV003',
      caseId: 'CASE003',
      caseTitle: 'Family Property Division',
      date: '2024-01-28',
      duration: '18:45',
      messages: 15,
      summary: 'Mediation agreement drafting and family law consultation',
      status: 'Completed'
    }
  ];

  // Mock initial messages
  const mockMessages = [
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI legal assistant. I can help you with case analysis, document generation, legal research, and more. How can I assist you today?',
      timestamp: new Date().toISOString(),
      audioUrl: null
    },
    {
      id: 2,
      type: 'user',
      content: 'I need help analyzing the property dispute case CASE001. What are the key legal issues?',
      timestamp: new Date().toISOString(),
      audioUrl: '/audio/user-message-1.mp3'
    },
    {
      id: 3,
      type: 'bot',
      content: 'I\'ll analyze CASE001 for you. Based on the case documents, the key legal issues are:\n\n1. **Property Rights**: Dispute over apartment ownership and maintenance responsibilities\n2. **Contractual Obligations**: Breach of maintenance agreement\n3. **Damages**: Property damage claims and compensation\n4. **Injunctive Relief**: Need for interim orders to prevent further damage\n\nWould you like me to generate a detailed legal analysis or help draft specific documents?',
      timestamp: new Date().toISOString(),
      audioUrl: null
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setConversations(mockConversations);
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      audioUrl: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString(),
        audioUrl: null
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput) => {
    const responses = [
      'I understand your query. Let me analyze the legal aspects and provide you with relevant information.',
      'Based on the case documents, I can help you with the following legal considerations...',
      'For this type of legal matter, I recommend considering the following precedents and statutes...',
      'I can assist you in drafting the necessary legal documents for this case.',
      'Let me provide you with a comprehensive analysis of the legal issues involved.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate speech-to-text processing
      setTimeout(() => {
        const transcribedText = 'This is a simulated transcription of the recorded speech.';
        setInputMessage(transcribedText);
      }, 1000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const saveConversation = () => {
    const conversation = {
      id: `CONV${Date.now()}`,
      caseId: caseId || 'CASE001',
      caseTitle: 'Property Dispute - Apartment 4B',
      date: new Date().toISOString().split('T')[0],
      duration: '00:00',
      messages: messages.length,
      summary: 'AI-assisted legal consultation',
      status: 'Completed'
    };

    setConversations(prev => [conversation, ...prev]);
  };

  const downloadTranscript = () => {
    const transcript = messages.map(msg => 
      `${msg.type === 'user' ? 'Court Official' : 'AI Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI assistant...</p>
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
                AI Legal Assistant
              </h1>
              <p className="text-gray-600">
                Interactive AI chatbot with speech-to-text for legal consultation
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
                onClick={saveConversation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Conversation</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conversations Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
              
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{conv.caseId}</span>
                      <span className="text-xs text-gray-500">{conv.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conv.caseTitle}</p>
                    <p className="text-xs text-gray-500">{conv.date}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{conv.messages} messages</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        conv.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {conv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Legal Assistant</h3>
                      <p className="text-sm text-gray-600">Case: {caseId || 'CASE001'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className={`p-2 rounded-lg transition-colors ${
                        isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={downloadTranscript}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[70%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <div className="animate-bounce">●</div>
                          <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
                          <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message or use voice input..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-lg transition-colors ${
                      isRecording 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-700">Recording... Click microphone to stop</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourtChatbot; 