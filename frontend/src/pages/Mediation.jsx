import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Upload, FileText, CheckCircle, AlertCircle, Users } from 'lucide-react';

const Mediation = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);

  const availableSlots = [
    { date: '2024-08-03', time: '10:00 AM', available: true },
    { date: '2024-08-03', time: '2:00 PM', available: true },
    { date: '2024-08-03', time: '3:00 PM', available: true },
    { date: '2024-08-05', time: '11:00 AM', available: true },
    { date: '2024-08-05', time: '4:00 PM', available: false },
    { date: '2024-08-07', time: '9:00 AM', available: true },
    { date: '2024-08-07', time: '1:00 PM', available: true },
  ];

  const mediators = [
    {
      id: 1,
      name: 'Adv. Priya Sharma',
      specialization: 'Property & Family Law',
      experience: '15 years',
      rating: 4.8,
      cases: 150
    },
    {
      id: 2,
      name: 'Adv. Rajesh Kumar',
      specialization: 'Commercial & Contract Law',
      experience: '12 years',
      rating: 4.6,
      cases: 120
    },
    {
      id: 3,
      name: 'Adv. Meera Patel',
      specialization: 'Employment & Labor Law',
      experience: '18 years',
      rating: 4.9,
      cases: 200
    }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      setIsScheduled(true);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Mediation Scheduling</h1>
          </div>
          <p className="text-gray-600">Schedule a mediation session with certified mediators</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scheduling Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Mediation</h2>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a time</option>
                    {availableSlots
                      .filter(slot => slot.date === selectedDate && slot.available)
                      .map((slot, index) => (
                        <option key={index} value={slot.time}>{slot.time}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Available Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Available Slots for {selectedDate}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSlots
                      .filter(slot => slot.date === selectedDate)
                      .map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            slot.available
                              ? selectedTime === slot.time
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload relevant documents for mediation</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule Button */}
              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Schedule Mediation
              </button>
            </motion.div>
          </div>

          {/* Status and Mediators */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status */}
            {isScheduled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">Mediation Scheduled</h3>
                </div>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Status:</strong> Confirmed</p>
                </div>
                <p className="text-xs text-green-600 mt-4">
                  You will receive a confirmation email with meeting details and mediator information.
                </p>
              </motion.div>
            )}

            {/* Available Mediators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Available Mediators</h3>
              </div>
              
              <div className="space-y-4">
                {mediators.map((mediator) => (
                  <div key={mediator.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{mediator.name}</h4>
                      <div className="flex items-center text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-600">{mediator.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mediator.specialization}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{mediator.experience} experience</span>
                      <span>{mediator.cases} cases</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-semibold mb-2">What to Expect</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• 60-minute mediation session</li>
                    <li>• Confidential and impartial process</li>
                    <li>• Online or in-person options</li>
                    <li>• Professional mediator guidance</li>
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

export default Mediation; 