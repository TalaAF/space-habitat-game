import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.jsx';
import Navigation from '../components/UI/Navigation';
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
import AIAssistant from '../components/UI/AIAssistant.jsx';
import { useGameState } from '../hooks/useGameState.js';
import { useHabitatDesign } from '../hooks/useHabitatDesign.js';
import { validateMissionLayout, analyzeMissionReadiness } from '../utils/missionValidation.js';
import { publishDesign, validateDesignData, generateThumbnail } from '../utils/firestoreHelpers.js';
import '../styles/index.css';

const DesignerPage = () => {
  const navigate = useNavigate();
  const { designToLoad, clearDesignToLoad } = useAppContext();
  const { gameState, startGame, endGame, updateScore } = useGameState();
  const { 
    habitatStructure, 
    modules,
    setModules,
    currentFloor,
    setCurrentFloor,
    updateHabitatStructure,
    updateFloorShape,
    addModule,
    updateModulePosition,
    removeModule,
    clearModules 
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
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const sceneRef = useRef(null);
  const hasLoadedDesign = useRef(false); // Track if we've loaded a cloned design

  /**
   * Clone & Explore Feature - Load Design from Community Hub
   * 
   * This effect runs when a user clicks "Clone & Explore" on a design
   * in the Community Hub. It performs a complete state reset and loads
   * the cloned design into the editor.
   */
  useEffect(() => {
    if (designToLoad && !hasLoadedDesign.current) {
      console.log('🎨 Loading cloned design:', designToLoad.designName);
      console.log('📦 Design data:', designToLoad);
      
      // Mark that we're loading to prevent double-execution
      hasLoadedDesign.current = true;

      try {
        // Step 0: Ensure game is started so designer UI is visible
        if (!gameState.isRunning) {
          console.log('🎮 Starting game state for cloned design...');
          startGame();
        }

        // Step 1: Clear existing state
        console.log('🧹 Clearing current design state...');
        clearModules();
        setValidationResults(null);
        setMissionReport(null);
        setPathAnalysis(null);
        setPathAnalysisMode(false);

        // Step 2: Load mission parameters
        if (designToLoad.missionParams) {
          console.log('🎯 Loading mission parameters:', designToLoad.missionParams);
          setMissionParams({
            crewSize: designToLoad.missionParams.crewSize || 4,
            destination: designToLoad.missionParams.destination || 'lunar',
            duration: designToLoad.missionParams.duration || 'short',
            constructionType: designToLoad.missionParams.constructionType || 'rigid'
          });
        }

        // Step 3: Load modules with new unique IDs
        if (designToLoad.modules && Array.isArray(designToLoad.modules)) {
          console.log(`📦 Loading ${designToLoad.modules.length} modules...`);
          console.log('📦 Raw module data from design:', designToLoad.modules);
          
          // Create new modules with fresh unique IDs but preserve all other data
          const loadedModules = designToLoad.modules.map((moduleData, index) => {
            const newModule = {
              ...moduleData,
              id: Date.now() + Math.random() + index, // Generate new unique ID
              type: moduleData.type,
              position: moduleData.position || { x: 0, y: 0, z: 0 },
              rotation: moduleData.rotation || { x: 0, y: 0, z: 0 },
              scale: moduleData.scale || 1,
              floor: moduleData.floor || 0
            };
            console.log(`  ✅ Module ${index + 1}: ${newModule.type} at position:`, newModule.position, `(floor ${newModule.floor})`);
            return newModule;
          });

          // Set all modules at once
          setModules(loadedModules);

          console.log('✅ Design loaded successfully!');
          console.log(`📊 Total modules loaded: ${loadedModules.length}`);
        }

        // Step 4: Clear the designToLoad state to prevent re-loading
        clearDesignToLoad();

      } catch (error) {
        console.error('❌ Error loading cloned design:', error);
        alert('Failed to load design. Please try again.');
        clearDesignToLoad();
        hasLoadedDesign.current = false; // Reset on error
      }
    } else if (!designToLoad && hasLoadedDesign.current) {
      // Reset the flag when designToLoad is cleared (for next clone)
      hasLoadedDesign.current = false;
    }
  }, [designToLoad, clearDesignToLoad, clearModules, setModules, gameState.isRunning, startGame]);

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

  const handleEndGame = () => {
    endGame();
    navigate('/');
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
      console.log('📦 Current modules before publishing:', modules);
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
        // Complete modules array - all data needed for cloning
        modules: modules.map(module => {
          console.log(`  📍 Publishing module ${module.type} at position:`, module.position);
          return {
            type: module.type,
            position: {
              x: module.position.x,
              y: module.position.y,
              z: module.position.z
            },
            rotation: module.rotation || { x: 0, y: 0, z: 0 },
            scale: module.scale || 1,
            floor: module.floor || 0
          };
        })
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
        onEndGame={handleEndGame}
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
      {gameState.isRunning && !aiAssistantOpen && (
        <button
          className="ai-assistant-fab"
          onClick={() => setAiAssistantOpen(true)}
          title="AI Assistant - Ask me anything about space habitats!"
        >
          🤖
        </button>
      )}
      {aiAssistantOpen && (
        <AIAssistant onClose={() => setAiAssistantOpen(false)} />
      )}
    </div>
  );
};

export default DesignerPage;
