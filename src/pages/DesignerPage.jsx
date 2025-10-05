import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import PublishModal from '../components/UI/PublishModal.jsx';
import { useGameState } from '../hooks/useGameState.js';
import { useHabitatDesign } from '../hooks/useHabitatDesign.js';
import { validateMissionLayout, analyzeMissionReadiness } from '../utils/missionValidation.js';
import { publishDesign, validateDesignData, generateThumbnail } from '../utils/firestoreHelpers.js';
import '../styles/index.css';

const DesignerPage = () => {
  const navigate = useNavigate();
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
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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

  const handlePublishClick = () => {
    // Validate that there are modules before allowing publish
    if (modules.length === 0) {
      alert('❌ Cannot publish an empty design. Please add at least one module.');
      return;
    }
    setPublishModalOpen(true);
  };

  const handlePublish = async (designName, creatorName) => {
    setIsPublishing(true);

    try {
      // Step A: Capture Visual Thumbnail
      console.log('Capturing thumbnail from renderer...');
      const renderer = sceneRef.current?.renderer;
      
      if (!renderer) {
        throw new Error('Renderer not available. Please try again.');
      }

      const thumbnail = generateThumbnail(renderer);
      
      if (!thumbnail) {
        throw new Error('Failed to capture thumbnail. Please try again.');
      }

      // Step B: Package the Design Data
      console.log('Packaging design data...');
      const designData = {
        designName,
        creatorName,
        thumbnail,
        missionParams: {
          crewSize: missionParams.crewSize,
          destination: missionParams.destination,
          duration: missionParams.duration,
          constructionType: missionParams.constructionType
        },
        // Sanitized modules array - only essential data
        modules: modules.map(module => ({
          type: module.type,
          position: {
            x: module.position.x,
            y: module.position.y,
            z: module.position.z
          }
        }))
        // createdAt will be added automatically by publishDesign using serverTimestamp()
      };

      // Validate the data
      const validation = validateDesignData(designData);
      if (!validation.valid) {
        throw new Error(validation.errors.join('\n'));
      }

      // Step C: Write to Firestore
      console.log('Publishing to Firestore...');
      const designId = await publishDesign(designData);
      
      console.log('Design published successfully with ID:', designId);

      // Step D: Success Feedback
      setPublishModalOpen(false);
      setIsPublishing(false);
      
      // Show success message
      alert('✅ Your design has been successfully published to the Community Hub!');
      
      // Navigate to Community Hub
      navigate('/hub');
      
    } catch (error) {
      console.error('Error publishing design:', error);
      setIsPublishing(false);
      
      // User-friendly error message
      alert(`❌ Failed to publish design:\n\n${error.message}\n\nPlease check your internet connection and Firebase configuration, then try again.`);
    }
  };

  return (
    <div className="app">
      <HUD 
        moduleCount={modules.length}
        onEndGame={endGame}
        onExport={() => setExportMenuOpen(true)}
        onPublish={handlePublishClick}
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
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={handlePublish}
        isLoading={isPublishing}
      />
    </div>
  );
};

export default DesignerPage;
