import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ onStart }) => {
  return (
    <div className="menu-screen">
      {/* Simple Navigation */}
      <nav style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '1rem',
        fontSize: '0.9rem'
      }}>
        <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
        <Link to="/designer" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Designer</Link>
        <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
        <Link to="/hub" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Hub</Link>
      </nav>

      <div className="menu-content">
        <h1 className="game-title">🚀 Space Habitat Builder</h1>
        <p className="game-subtitle">Design and build your orbital space station</p>
        <div className="menu-buttons">
          <button className="btn-start" onClick={onStart}>
            Start Building
          </button>
        </div>
        <div className="game-info">
          <h3>How to Play:</h3>
          <ul>
            <li>Select modules from the builder panel</li>
            <li>Add them to create your space habitat</li>
            <li>Watch your station grow in 3D</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;