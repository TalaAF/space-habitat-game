import React from 'react';

const MissionParameters = ({ missionParams, onUpdateParams, onValidate }) => {
  const handleChange = (field, value) => {
    onUpdateParams({ [field]: value });
  };

  return (
    <div className="mission-parameters">
      <h3>🚀 NASA Mission Parameters</h3>
      
      <div className="param-group">
        <label htmlFor="crewSize">
          <span className="param-label">👨‍🚀 Crew Size</span>
          <select 
            id="crewSize"
            value={missionParams.crewSize}
            onChange={(e) => handleChange('crewSize', parseInt(e.target.value))}
            className="param-select"
          >
            <option value={2}>2 Astronauts</option>
            <option value={4}>4 Astronauts</option>
          </select>
        </label>
      </div>

      <div className="param-group">
        <label htmlFor="destination">
          <span className="param-label">🌍 Destination</span>
          <select 
            id="destination"
            value={missionParams.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className="param-select"
          >
            <option value="lunar">Lunar Surface</option>
            <option value="mars">Mars Transit</option>
          </select>
        </label>
      </div>

      <div className="param-group">
        <label htmlFor="duration">
          <span className="param-label">⏱️ Mission Duration</span>
          <select 
            id="duration"
            value={missionParams.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="param-select"
          >
            <option value="short">Short-Duration (30 days)</option>
            <option value="mid">Mid-Duration (90-180 days)</option>
            <option value="extended">Extended-Duration (365+ days)</option>
          </select>
        </label>
      </div>

      <button 
        className="btn-validate"
        onClick={onValidate}
      >
        🔍 Assess Mission Readiness
      </button>

      <div className="mission-summary">
        <h4>Current Mission</h4>
        <div className="summary-item">
          <span>Crew:</span>
          <span>{missionParams.crewSize} astronauts</span>
        </div>
        <div className="summary-item">
          <span>Location:</span>
          <span>{missionParams.destination === 'lunar' ? 'Lunar Surface' : 'Mars Transit'}</span>
        </div>
        <div className="summary-item">
          <span>Duration:</span>
          <span>
            {missionParams.duration === 'short' && '30 days'}
            {missionParams.duration === 'mid' && '90-180 days'}
            {missionParams.duration === 'extended' && '365+ days'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MissionParameters;
