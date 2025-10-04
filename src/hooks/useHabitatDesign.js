import { useState } from 'react';

export const useHabitatDesign = () => {
  const [habitatStructure, setHabitatStructure] = useState({
    shape: 'cylinder', // 'cylinder' or 'dome' (legacy - for overall shape)
    radius: 5,
    height: 8,
    floors: 1, // Number of floors
    floorHeight: 3, // Height per floor in meters
    floorShapes: ['cylinder'] // Array of shapes for each floor
  });

  const [currentFloor, setCurrentFloor] = useState(0);

  // Helper to update floor shapes array when floors count changes
  const updateFloorShapes = (numFloors, currentShapes) => {
    const newShapes = [...currentShapes];
    while (newShapes.length < numFloors) {
      newShapes.push('cylinder'); // Default new floors to cylinder
    }
    return newShapes.slice(0, numFloors); // Trim if reduced
  };

  const [modules, setModules] = useState([]);

  const updateHabitatStructure = (updates) => {
    setHabitatStructure(prev => {
      const newStructure = { ...prev, ...updates };
      
      // If floors count changed, update floorShapes array
      if (updates.floors !== undefined && updates.floors !== prev.floors) {
        newStructure.floorShapes = updateFloorShapes(updates.floors, prev.floorShapes);
      }
      
      return newStructure;
    });
  };

  const updateFloorShape = (floorIndex, shape) => {
    setHabitatStructure(prev => {
      const newShapes = [...prev.floorShapes];
      newShapes[floorIndex] = shape;
      return {
        ...prev,
        floorShapes: newShapes
      };
    });
  };

  const addModule = (moduleType) => {
    const floorY = currentFloor * habitatStructure.floorHeight + 0.5;
    const newModule = {
      id: Date.now(),
      type: moduleType,
      position: { x: 0, y: floorY, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
      floor: currentFloor, // Track which floor this module is on
    };
    console.log('Creating module in useHabitatDesign:', newModule);
    setModules(prev => {
      const updated = [...prev, newModule];
      console.log('Updated modules:', updated);
      return updated;
    });
    return newModule;
  };

  const updateModulePosition = (moduleId, position) => {
    // If position is null, delete the module
    if (position === null) {
      setModules(prev => prev.filter(module => module.id !== moduleId));
      console.log('Module deleted:', moduleId);
      return;
    }
    
    // Otherwise, update the position
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, position }
        : module
    ));
  };

  const removeModule = (moduleId) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const clearModules = () => {
    setModules([]);
  };

  const isPositionValid = (position) => {
    const { shape, radius, height } = habitatStructure;
    const { x, y, z } = position;
    
    if (shape === 'cylinder') {
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      return distanceFromCenter <= radius - 0.5 && y >= 0 && y <= height - 1;
    } else if (shape === 'dome') {
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const maxHeightAtPosition = Math.sqrt(Math.max(0, radius * radius - distanceFromCenter * distanceFromCenter));
      return distanceFromCenter <= radius - 0.5 && y >= 0 && y <= maxHeightAtPosition - 0.5;
    }
    return false;
  };

  return {
    habitatStructure,
    modules,
    currentFloor,
    setCurrentFloor,
    updateHabitatStructure,
    updateFloorShape,
    addModule,
    updateModulePosition,
    removeModule,
    clearModules,
    isPositionValid,
  };
};