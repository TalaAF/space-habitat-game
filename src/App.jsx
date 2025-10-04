// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DesignerPage from './pages/DesignerPage';

function App() {
  return (
    <BrowserRouter basename="/space-habitat-game">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/designer" element={<DesignerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
