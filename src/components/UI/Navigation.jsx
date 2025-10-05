// src/components/UI/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Component
 * 
 * Styled navigation buttons that appear on all pages
 */
const Navigation = () => {
  const location = useLocation();
  
  const navStyle = {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 1000,
    display: 'flex',
    gap: '8px',
    background: 'rgba(26, 42, 78, 0.4)',
    backdropFilter: 'blur(10px)',
    padding: '6px',
    borderRadius: '8px',
    border: '1px solid rgba(107, 157, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  };

  const getButtonStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    background: isActive 
      ? 'linear-gradient(135deg, #6b9dff 0%, #4d7fcc 100%)'
      : 'rgba(77, 127, 204, 0.3)',
    border: isActive 
      ? '1.5px solid rgba(107, 157, 255, 0.6)'
      : '1.5px solid rgba(107, 157, 255, 0.2)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isActive 
      ? '0 0 15px rgba(107, 157, 255, 0.4)'
      : '0 2px 6px rgba(0, 0, 0, 0.2)',
    display: 'inline-block',
    textAlign: 'center',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  });

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(107, 157, 255, 0.5)',
    background: 'linear-gradient(135deg, #7badff 0%, #5d8fdc 100%)',
    borderColor: 'rgba(107, 157, 255, 0.8)',
  };

  return (
    <nav style={navStyle}>
      <Link 
        to="/" 
        style={getButtonStyle(location.pathname === '/')}
        onMouseEnter={(e) => {
          e.target.style.transform = buttonHoverStyle.transform;
          e.target.style.boxShadow = buttonHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }}
      >
        Home
      </Link>
      
      <Link 
        to="/designer" 
        style={getButtonStyle(location.pathname === '/designer')}
        onMouseEnter={(e) => {
          e.target.style.transform = buttonHoverStyle.transform;
          e.target.style.boxShadow = buttonHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }}
      >
        Designer
      </Link>
      
      <Link 
        to="/hub" 
        style={getButtonStyle(location.pathname === '/hub')}
        onMouseEnter={(e) => {
          e.target.style.transform = buttonHoverStyle.transform;
          e.target.style.boxShadow = buttonHoverStyle.boxShadow;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }}
      >
        Hub
      </Link>
    </nav>
  );
};

export default Navigation;
