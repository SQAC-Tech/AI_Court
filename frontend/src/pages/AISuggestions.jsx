import { motion } from 'framer-motion';
import { Brain, BookOpen, Gavel, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AISuggestions = () => {
  const ipcSections = [
    {
      section: 'IPC Section 420',
      title: 'Cheating and dishonestly inducing delivery of property',
      description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person...',
      relevance: 95,
      penalty: 'Imprisonment up to 7 years and fine'
    },
    {
      section: 'IPC Section 406',
      title: 'Criminal breach of trust',
      description: 'Whoever commits criminal breach of trust shall be punished with imprisonment...',
      relevance: 87,
      penalty: 'Imprisonment up to 3 years and fine'
    },
    {
      section: 'IPC Section 415',
      title: 'Cheating',
      description: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived...',
      relevance: 82,
      penalty: 'Imprisonment up to 1 year and fine'
    }
  ];

  const caseJudgments = [
    {
      caseName: 'State of Maharashtra v. Ramesh Kumar',
      year: '2023',
      outcome: 'Conviction upheld',
      confidence: 89,
      summary: 'Similar property dispute case where the accused was found guilty of criminal breach of trust.',
      citation: '2023 SCC Online SC 1234'
    },
    {
      caseName: 'Kumar v. State of Karnataka',
      year: '2022',
      outcome: 'Acquittal',
      confidence: 76,
      summary: 'Case involving similar circumstances but with different evidence presentation.',
      citation: '2022 SCC Online Kar 567'
    },
    {
      caseName: 'Rajesh v. State of Delhi',
      year: '2023',
      outcome: 'Conviction upheld',
      confidence: 71,
      summary: 'Property fraud case with comparable legal arguments and evidence.',
      citation: '2023 SCC Online Del 890'
    }
  ];

  const bailPrediction = {
    likelihood: 70,
    factors: [
      'First-time offender',
      'No previous criminal record',
      'Cooperative with investigation',
      'Strong community ties',
      'Financial stability'
    ],
    recommendations: [
      'Submit personal bond',
      'Provide surety',
      'Regular court attendance',
      'No contact with witnesses'
    ]
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
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Legal Suggestions</h1>
          </div>
          <p className="text-gray-600">AI-powered analysis of your case with relevant legal sections and precedents</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* IPC/CrPC Sections */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Relevant Legal Sections</h2>
              </div>

              <div className="space-y-4">
                {ipcSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-blue-600">{section.section}</h3>
                        <h4 className="font-medium text-gray-900 mt-1">{section.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Relevance</div>
                        <div className="text-lg font-bold text-green-600">{section.relevance}%</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{section.description}</p>
                    <div className="flex items-center text-sm">
                      <Gavel className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600 font-medium">{section.penalty}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bail Prediction */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Bail Prediction</h2>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">{bailPrediction.likelihood}%</div>
                <div className="text-gray-600">Likelihood of Bail</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${bailPrediction.likelihood}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Positive Factors</h3>
                <div className="space-y-2">
                  {bailPrediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {bailPrediction.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Case Judgments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <Gavel className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Similar Case Judgments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseJudgments.map((judgment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{judgment.caseName}</h3>
                    <p className="text-xs text-gray-500">{judgment.citation}</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-sm text-gray-500">Confidence</div>
                    <div className="text-lg font-bold text-purple-600">{judgment.confidence}%</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    judgment.outcome === 'Conviction upheld' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {judgment.outcome}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({judgment.year})</span>
                </div>
                
                <p className="text-sm text-gray-600">{judgment.summary}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> These AI-generated suggestions are for informational purposes only and should not be considered as legal advice. Please consult with a qualified legal professional for specific legal guidance.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AISuggestions; 