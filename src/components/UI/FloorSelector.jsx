import React from 'react';

const FloorSelector = ({ currentFloor, totalFloors, floorShapes = [], onFloorChange, onFloorShapeChange, isHidden = false }) => {
  if (totalFloors <= 1) return null; // Don't show if only one floor

  const getShapeIcon = (shape) => {
    switch (shape) {
      case 'cylinder': return '⬛';
      case 'dome': return '⬢';
      default: return '⬛';
    }
  };

  const currentFloorShape = floorShapes[currentFloor] || 'cylinder';

  return (
    <div className={`floor-selector ${isHidden ? 'hidden' : ''}`}>
      <div className="floor-selector-title">🏢 Floor Level</div>
      <div className="floor-buttons">
        {Array.from({ length: totalFloors }, (_, i) => (
          <button
            key={i}
            className={`floor-btn ${currentFloor === i ? 'active' : ''}`}
            onClick={() => onFloorChange(i)}
            title={`Switch to Floor ${i + 1}`}
          >
            <span className="floor-number">{i + 1}</span>
            <span className="floor-label">Floor</span>
          </button>
        ))}
      </div>
      <div className="floor-info">
        Current: Floor {currentFloor + 1} of {totalFloors}
      </div>
      
      {/* Shape selector for current floor */}
      <div className="floor-shape-selector">
        <div className="floor-shape-title">Floor {currentFloor + 1} Shape:</div>
        <div className="floor-shape-buttons">
          <button
            className={`floor-shape-btn ${currentFloorShape === 'cylinder' ? 'active' : ''}`}
            onClick={() => onFloorShapeChange(currentFloor, 'cylinder')}
            title="Cylinder"
          >
            <span className="shape-icon">⬛</span>
            <span className="shape-name">Cylinder</span>
          </button>
          <button
            className={`floor-shape-btn ${currentFloorShape === 'dome' ? 'active' : ''}`}
            onClick={() => onFloorShapeChange(currentFloor, 'dome')}
            title="Dome"
          >
            <span className="shape-icon">⬢</span>
            <span className="shape-name">Dome</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloorSelector;
