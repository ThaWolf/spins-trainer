import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TrainingPage from './pages/TrainingPage';
import TrainingStarted from './pages/TrainingStarted';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />   {/* Default page */}
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training-started" element={<TrainingStarted />} />
      </Routes>
    </Router>
);
