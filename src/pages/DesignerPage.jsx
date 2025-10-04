import React, { useState, useRef } from 'react';
import HUD from '../components/UI/HUD.jsx';
import DesignPanel from '../components/UI/DesignPanel.jsx';
import ModuleBar from '../components/UI/ModuleBar.jsx';
import FloorSelector from '../components/UI/FloorSelector.jsx';
import Scene from '../components/Game/Scene.jsx';
import Menu from '../components/UI/Menu.jsx';
import ValidationModal from '../components/UI/ValidationModal.jsx';
import MissionReportModal from '../components/UI/MissionReportModal.jsx';
import PathAnalysisPanel from '../components/UI/PathAnalysisPanel.jsx';
import ExportMenu from '../components/UI/ExportMenu.jsx';
import { useGameState } from '../hooks/useGameState.js';
import { useHabitatDesign } from '../hooks/useHabitatDesign.js';
import { validateMissionLayout, analyzeMissionReadiness } from '../utils/missionValidation.js';
import '../styles/index.css';

const DesignerPage = () => {
  const { gameState, startGame, endGame, updateScore } = useGameState();
  const { 
    habitatStructure, 
    modules,
    currentFloor,
    setCurrentFloor,
    updateHabitatStructure,
    updateFloorShape,
    addModule,
    updateModulePosition,
    removeModule 
  } = useHabitatDesign();

  const [missionParams, setMissionParams] = useState({
    crewSize: 4,
    destination: 'lunar',
    duration: 'short',
    constructionType: 'rigid' // rigid, inflatable, or isru
  });

  const [validationResults, setValidationResults] = useState(null);
  const [missionReport, setMissionReport] = useState(null);
  const [pathAnalysisMode, setPathAnalysisMode] = useState(false);
  const [pathAnalysis, setPathAnalysis] = useState(null);
  const [pathModules, setPathModules] = useState({ start: null, end: null });
  const [isModuleSelected, setIsModuleSelected] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const sceneRef = useRef(null);

  if (!gameState.isRunning) {
    return <Menu onStart={startGame} />;
  }

  const handleAddModule = (moduleData) => {
    console.log('Adding module:', moduleData);
    const module = addModule(moduleData.type);
    console.log('Module created:', module);
    // Add score for each module
    updateScore(10);
  };

  const handleUpdateMissionParams = (updates) => {
    setMissionParams(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleValidate = () => {
    // Use the new comprehensive Mission Readiness Analysis
    const report = analyzeMissionReadiness(modules, habitatStructure, missionParams);
    setMissionReport(report);
    
    // Keep old validation for backward compatibility if needed
    const results = validateMissionLayout(modules, habitatStructure, missionParams);
    setValidationResults(results);
  };

  const handleCloseValidation = () => {
    setValidationResults(null);
  };

  const handleCloseMissionReport = () => {
    setMissionReport(null);
  };

  const handleTogglePathAnalysis = () => {
    setPathAnalysisMode(prev => !prev);
    if (pathAnalysisMode) {
      // Clear when turning off
      setPathAnalysis(null);
    }
  };

  const handlePathAnalysisComplete = (result) => {
    setPathAnalysis(result);
  };

  return (
    <div className="app">
      <HUD 
        moduleCount={modules.length}
        onEndGame={endGame}
        onExport={() => setExportMenuOpen(true)}
      />
      <div className="game-container">
        <div className="scene-wrapper">
          <Scene 
            ref={sceneRef}
            habitatStructure={habitatStructure}
            modules={modules}
            currentFloor={currentFloor}
            onModulePositionUpdate={updateModulePosition}
            pathAnalysisMode={pathAnalysisMode}
            onPathAnalysis={handlePathAnalysisComplete}
            onModuleSelected={setIsModuleSelected}
          />
          {pathAnalysisMode && (
            <div className="path-overlay-info">
              <p>🖱️ Click two points on the habitat floor to analyze the crew path</p>
            </div>
          )}
          {pathAnalysis && !pathAnalysis.passes && (
            <div className="path-warning-message">
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">
                WARNING: Path violates NASA 1.0m minimum clearance requirement!
              </span>
            </div>
          )}
          <FloorSelector 
            currentFloor={currentFloor}
            totalFloors={habitatStructure.floors}
            floorShapes={habitatStructure.floorShapes}
            onFloorChange={setCurrentFloor}
            onFloorShapeChange={updateFloorShape}
            isHidden={isModuleSelected}
          />
          <ModuleBar 
            modules={modules}
            onAddModule={handleAddModule}
          />
        </div>
        <div className="control-panels">
          <PathAnalysisPanel 
            pathAnalysisMode={pathAnalysisMode}
            onToggleMode={handleTogglePathAnalysis}
            pathResult={pathAnalysis}
          />
          <DesignPanel 
            habitatStructure={habitatStructure}
            modules={modules}
            missionParams={missionParams}
            onUpdateStructure={updateHabitatStructure}
            onUpdateMissionParams={handleUpdateMissionParams}
            onValidate={handleValidate}
          />
        </div>
      </div>
      {missionReport && (
        <MissionReportModal 
          report={missionReport}
          onClose={handleCloseMissionReport}
        />
      )}
      {validationResults && (
        <ValidationModal 
          results={validationResults}
          missionReport={missionReport}
          onClose={handleCloseValidation}
        />
      )}
      <ExportMenu
        habitatStructure={habitatStructure}
        modules={modules}
        sceneRef={sceneRef}
        isOpen={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
      />
    </div>
  );
};

export default DesignerPage;
