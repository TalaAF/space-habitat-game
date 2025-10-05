// src/components/UI/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation Component
 * 
 * Simple navigation bar that appears on all pages
 */
const Navigation = () => {
  const navStyle = {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem'
  };

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none'
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
      <Link to="/designer" style={linkStyle}>Designer</Link>
      <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
      <Link to="/hub" style={linkStyle}>Hub</Link>
    </nav>
  );
};

export default Navigation;
