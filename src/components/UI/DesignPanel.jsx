import React from 'react';
import HabitatShapeSelector from './HabitatShapeSelector';
import MissionParameters from './MissionParameters';
import { MODULE_SPECS } from '../../utils/missionValidation';

const DesignPanel = ({ 
  habitatStructure, 
  modules, 
  missionParams,
  onUpdateStructure, 
  onUpdateMissionParams,
  onValidate 
}) => {

  const getTotalMass = () => {
    return modules.reduce((sum, module) => {
      return sum + (MODULE_SPECS[module.type]?.mass || 0);
    }, 0);
  };

  const getTotalVolume = () => {
    return modules.reduce((sum, module) => {
      return sum + (MODULE_SPECS[module.type]?.volume || 0);
    }, 0);
  };

  return (
    <div className="design-panel">
      <MissionParameters 
        missionParams={missionParams}
        onUpdateParams={onUpdateMissionParams}
        onValidate={onValidate}
      />

      <div className="divider"></div>

      <HabitatShapeSelector 
        habitatStructure={habitatStructure}
        onUpdateStructure={onUpdateStructure}
      />

      <div className="divider"></div>

      <div className="layout-info">
        <h3>📊 Habitat Statistics</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Total Modules:</span>
            <span className="info-value">{modules.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Mass:</span>
            <span className="info-value">{getTotalMass().toFixed(1)} t</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Volume:</span>
            <span className="info-value">{getTotalVolume().toFixed(1)} m³</span>
          </div>
          <div className="info-item">
            <span className="info-label">Habitat Shape:</span>
            <span className="info-value">{habitatStructure.shape}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPanel;