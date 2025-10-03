import React, { useState } from 'react';
import { MODULE_SPECS } from '../../utils/missionValidation';

const moduleTypes = [
  { id: 'living', name: '🏠', description: 'Crew living space', color: '#ff6644' },
  { id: 'lab', name: '🔬', description: 'Scientific research', color: '#44ff88' },
  { id: 'power', name: '⚡', description: 'Energy generation', color: '#ffff44' },
  { id: 'greenhouse', name: '🌱', description: 'Food & oxygen', color: '#44ff44' },
  { id: 'medical', name: '🏥', description: 'Health & treatment', color: '#ff4488' },
  { id: 'airlock', name: '🚪', description: 'EVA access', color: '#4444ff' },
  { id: 'storage', name: '📦', description: 'Resource storage', color: '#8844ff' },
];

const ModuleBar = ({ modules, onAddModule }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  const handleAddModule = (moduleType) => {
    const moduleData = {
      type: moduleType.id,
      name: moduleType.name,
      position: { x: 0, y: 0, z: 0 },
    };
    onAddModule(moduleData);
  };

  const getModuleCount = (type) => {
    return modules.filter(m => m.type === type).length;
  };

  return (
    <div className="module-bar">
      <div className="module-bar-label">🔧 Module Builder:</div>
      <div className="module-bar-items">
        {moduleTypes.map(module => {
          const specs = MODULE_SPECS[module.id];
          return (
            <button
              key={module.id} 
              className={`module-bar-item ${selectedModule?.id === module.id ? 'selected' : ''}`}
              onClick={() => handleAddModule(module)}
              onMouseEnter={() => setSelectedModule(module)}
              title={`${module.description}\nMass: ${specs?.mass}t | Volume: ${specs?.volume}m³`}
            >
              <span className="module-bar-icon">{module.name}</span>
              <span className="module-bar-count">×{getModuleCount(module.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleBar;
