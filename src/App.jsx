// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './contexts/AppContext.jsx';
import LandingPage from './pages/LandingPage';
import DesignerPage from './pages/DesignerPage';
import CommunityHubPage from './pages/CommunityHubPage';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter basename="/space-habitat-game">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/designer" element={<DesignerPage />} />
          <Route path="/hub" element={<CommunityHubPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
