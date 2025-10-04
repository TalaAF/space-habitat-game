import React from 'react';

const HUD = ({ moduleCount, onEndGame, onExport }) => {
  return (
    <div className="hud">
      <div className="hud-left">
        <h1>🚀 Space Habitat Builder</h1>
      </div>
      <div className="hud-center">
        <div className="hud-stats">
          <div className="stat-badge">
            <span className="stat-icon">🏗️</span>
            <span className="stat-text">Modules: {moduleCount || 0}</span>
          </div>
        </div>
      </div>
      <div className="hud-right">
        <button className="export-btn" onClick={onExport}>
          📥 Export Design
        </button>
        <button className="btn-secondary" onClick={onEndGame}>End Game</button>
      </div>
    </div>
  );
};

export default HUD;