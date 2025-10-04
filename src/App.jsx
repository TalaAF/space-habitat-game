import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DesignerPage from './pages/DesignerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/designer" element={<DesignerPage />} />
      </Routes>
    </Router>
  );
}

export default App;