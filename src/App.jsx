import React, { useState } from 'react';
import HUD from './components/UI/HUD.jsx';
import DesignPanel from './components/UI/DesignPanel.jsx';
import Scene from './components/Game/Scene.jsx';
import Menu from './components/UI/Menu.jsx';
import ValidationModal from './components/UI/ValidationModal.jsx';
import PathAnalysisPanel from './components/UI/PathAnalysisPanel.jsx';
import { useGameState } from './hooks/useGameState.js';
import { useHabitatDesign } from './hooks/useHabitatDesign.js';
import { validateMissionLayout } from './utils/missionValidation.js';
import './styles/index.css';

const App = () => {
  const { gameState, startGame, endGame, updateScore } = useGameState();
  const { 
    habitatStructure, 
    modules, 
    updateHabitatStructure, 
    addModule,
    updateModulePosition,
    removeModule 
  } = useHabitatDesign();

  const [missionParams, setMissionParams] = useState({
    crewSize: 4,
    destination: 'lunar',
    duration: 'short'
  });

  const [validationResults, setValidationResults] = useState(null);
  const [pathAnalysisMode, setPathAnalysisMode] = useState(false);
  const [pathAnalysis, setPathAnalysis] = useState(null);
  const [pathModules, setPathModules] = useState({ start: null, end: null });

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
    const results = validateMissionLayout(modules, habitatStructure, missionParams);
    setValidationResults(results);
  };

  const handleCloseValidation = () => {
    setValidationResults(null);
  };

  const handleTogglePathAnalysis = () => {
    setPathAnalysisMode(prev => !prev);
    if (pathAnalysisMode) {
      // Clear when turning off
      setPathAnalysis(null);
      setPathModules({ start: null, end: null });
    }
  };

  const handlePathAnalysis = (analysis, startModule, endModule) => {
    setPathAnalysis(analysis);
    setPathModules({ start: startModule, end: endModule });
  };

  return (
    <div className="app">
      <HUD 
        score={gameState.score} 
        moduleCount={modules.length}
        onEndGame={endGame}
      />
      <div className="game-container">
        <div className="scene-wrapper">
          <Scene 
            habitatStructure={habitatStructure}
            modules={modules}
            onModulePositionUpdate={updateModulePosition}
            pathAnalysisMode={pathAnalysisMode}
            onPathAnalysis={handlePathAnalysis}
          />
          {pathAnalysisMode && (
            <div className="path-overlay-info">
              <p>🖱️ Click two modules to analyze the crew path</p>
            </div>
          )}
        </div>
        <div className="control-panels">
          <PathAnalysisPanel 
            pathAnalysisMode={pathAnalysisMode}
            onToggleMode={handleTogglePathAnalysis}
            pathAnalysis={pathAnalysis}
            startModule={pathModules.start}
            endModule={pathModules.end}
          />
          <DesignPanel 
            habitatStructure={habitatStructure}
            modules={modules}
            missionParams={missionParams}
            onUpdateStructure={updateHabitatStructure}
            onUpdateMissionParams={handleUpdateMissionParams}
            onAddModule={handleAddModule}
            onRemoveModule={removeModule}
            onValidate={handleValidate}
          />
        </div>
      </div>
      {validationResults && (
        <ValidationModal 
          results={validationResults}
          onClose={handleCloseValidation}
        />
      )}
    </div>
  );
};

export default App;