import React from 'react';

const HabitatShapeSelector = ({ habitatStructure, onUpdateStructure }) => {
  const { shape, radius, height, floors, floorHeight } = habitatStructure;

  const handleShapeChange = (newShape) => {
    onUpdateStructure({ shape: newShape });
  };

  const handleRadiusChange = (e) => {
    onUpdateStructure({ radius: parseFloat(e.target.value) });
  };

  const handleHeightChange = (e) => {
    onUpdateStructure({ height: parseFloat(e.target.value) });
  };

  const handleFloorsChange = (e) => {
    const newFloors = parseInt(e.target.value);
    const newHeight = newFloors * floorHeight;
    onUpdateStructure({ floors: newFloors, height: newHeight });
  };

  const handleFloorHeightChange = (e) => {
    const newFloorHeight = parseFloat(e.target.value);
    const newHeight = floors * newFloorHeight;
    onUpdateStructure({ floorHeight: newFloorHeight, height: newHeight });
  };

  return (
    <div className="habitat-selector">
      <h3>🏗️ Habitat Structure</h3>
      
      <div className="shape-buttons">
        <button
          className={`shape-btn ${shape === 'cylinder' ? 'active' : ''}`}
          onClick={() => handleShapeChange('cylinder')}
        >
          <div className="shape-icon">⬛</div>
          <span>Cylinder</span>
        </button>
        <button
          className={`shape-btn ${shape === 'dome' ? 'active' : ''}`}
          onClick={() => handleShapeChange('dome')}
        >
          <div className="shape-icon">⬢</div>
          <span>Dome</span>
        </button>
      </div>

      <div className="dimension-controls">
        <div className="control-group">
          <label>
            <span>Radius: {radius.toFixed(1)}m</span>
            <input
              type="range"
              min="3"
              max="15"
              step="0.5"
              value={radius}
              onChange={handleRadiusChange}
              className="slider"
            />
          </label>
        </div>

        <div className="control-group">
          <label>
            <span>Number of Floors: {floors}</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={floors}
              onChange={handleFloorsChange}
              className="slider"
            />
          </label>
        </div>

        <div className="control-group">
          <label>
            <span>Floor Height: {floorHeight.toFixed(1)}m</span>
            <input
              type="range"
              min="2.5"
              max="5"
              step="0.5"
              value={floorHeight}
              onChange={handleFloorHeightChange}
              className="slider"
            />
          </label>
        </div>

        <div className="control-group">
          <label>
            <span>Total Height: {height.toFixed(1)}m</span>
            <div className="info-text" style={{fontSize: '0.85rem', color: '#888', marginTop: '4px'}}>
              ({floors} floors × {floorHeight.toFixed(1)}m each)
            </div>
          </label>
        </div>
      </div>

      <div className="habitat-stats">
        <div className="stat-item">
          <span className="stat-label">Shape:</span>
          <span className="stat-value">{shape.charAt(0).toUpperCase() + shape.slice(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Volume:</span>
          <span className="stat-value">
            {shape === 'cylinder' 
              ? (Math.PI * radius * radius * height).toFixed(1)
              : ((2/3) * Math.PI * Math.pow(radius, 3)).toFixed(1)
            } m³
          </span>
        </div>
      </div>
    </div>
  );
};

export default HabitatShapeSelector;
