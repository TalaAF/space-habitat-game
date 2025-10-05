// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DesignerPage from './pages/DesignerPage';
import CommunityHubPage from './pages/CommunityHubPage';

// Navigation component - only shows on certain pages
function Navigation() {
  const location = useLocation();
  
  // Don't show nav on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      display: 'flex',
      gap: '1rem',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.75rem 1.25rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Link 
        to="/" 
        style={{
          color: location.pathname === '/' ? '#4a9eff' : '#ffffff',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'color 0.2s',
          fontSize: '0.95rem'
        }}
        onMouseOver={(e) => e.target.style.color = '#4a9eff'}
        onMouseOut={(e) => e.target.style.color = location.pathname === '/' ? '#4a9eff' : '#ffffff'}
      >
        Home
      </Link>
      <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
      <Link 
        to="/designer" 
        style={{
          color: location.pathname === '/designer' ? '#4a9eff' : '#ffffff',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'color 0.2s',
          fontSize: '0.95rem'
        }}
        onMouseOver={(e) => e.target.style.color = '#4a9eff'}
        onMouseOut={(e) => e.target.style.color = location.pathname === '/designer' ? '#4a9eff' : '#ffffff'}
      >
        Designer
      </Link>
      <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
      <Link 
        to="/hub" 
        style={{
          color: location.pathname === '/hub' ? '#4a9eff' : '#ffffff',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'color 0.2s',
          fontSize: '0.95rem'
        }}
        onMouseOver={(e) => e.target.style.color = '#4a9eff'}
        onMouseOut={(e) => e.target.style.color = location.pathname === '/hub' ? '#4a9eff' : '#ffffff'}
      >
        Community Hub
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter basename="/space-habitat-game">
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/designer" element={<DesignerPage />} />
        <Route path="/hub" element={<CommunityHubPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
