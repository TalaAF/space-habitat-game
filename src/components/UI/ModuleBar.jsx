import React, { useState } from 'react';
import { MODULE_SPECS } from '../../utils/missionValidation';

const moduleTypes = [
  { id: 'living', name: '🛏️', description: 'Sleep pod with restraints', color: '#ff6644' },
  { id: 'lab', name: '🔬', description: 'Workbench with tools', color: '#44ff88' },
  { id: 'power', name: '🔋', description: 'Battery + solar panels', color: '#ffff44' },
  { id: 'greenhouse', name: '�', description: 'Growing racks with plants', color: '#44ff44' },
  { id: 'medical', name: '⚕️', description: 'Medical console & bed', color: '#ff4488' },
  { id: 'airlock', name: '🚪', description: 'Chamber with EVA suits', color: '#4444ff' },
  { id: 'storage', name: '📦', description: 'Cargo rack with bags', color: '#8844ff' },
  { id: 'galley', name: '🍽️', description: 'Kitchen & dining area', color: '#ff9944' },
  { id: 'exercise', name: '🏋️', description: 'Fitness equipment', color: '#44ffff' },
  { id: 'command', name: '🖥️', description: 'Control center', color: '#ff44ff' },
  { id: 'workshop', name: '🔧', description: 'Repair & maintenance', color: '#ffaa44' },
];

const ModuleBar = ({ modules, onAddModule }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollContainerRef = React.useRef(null);

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

  const handleScroll = () => {
    setShowScrollHint(false);
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="module-bar">
      <div className="module-bar-label">🔧 Module Builder:</div>
      <div className="module-bar-items" ref={scrollContainerRef}>
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
      {showScrollHint && (
        <div className="scroll-hint">
          ← Scroll →
        </div>
      )}
    </div>
  );
};

export default ModuleBar;
