import React from 'react';
import Navigation from './Navigation';

const Menu = ({ onStart }) => {
  return (
    <div className="menu-screen">
      <Navigation />

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