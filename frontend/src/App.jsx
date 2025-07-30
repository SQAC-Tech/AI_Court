import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FileDispute from './pages/FileDispute';
import AISuggestions from './pages/AISuggestions';
import Mediation from './pages/Mediation';
import Documents from './pages/Documents';
import CaseHistory from './pages/CaseHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/file-dispute" element={<FileDispute />} />
            <Route path="/ai-suggestions" element={<AISuggestions />} />
            <Route path="/mediation" element={<Mediation />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/case-history" element={<CaseHistory />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
