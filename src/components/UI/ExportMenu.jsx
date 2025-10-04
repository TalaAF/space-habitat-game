import React, { useState } from 'react';
import { exportDesignAsJSON, exportDesignAsText, exportScreenshot } from '../../utils/designExport';

const ExportMenu = ({ habitatStructure, modules, sceneRef, isOpen, onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExportJSON = () => {
    setExporting(true);
    setExportMessage('');
    try {
      const success = exportDesignAsJSON(habitatStructure, modules);
      if (success) {
        setExportMessage('✅ JSON exported successfully!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportMessage('❌ Export failed');
    }
    setTimeout(() => {
      setExporting(false);
      setExportMessage('');
    }, 2000);
  };

  const handleExportText = () => {
    setExporting(true);
    setExportMessage('');
    try {
      const success = exportDesignAsText(habitatStructure, modules);
      if (success) {
        setExportMessage('✅ Text summary exported successfully!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportMessage('❌ Export failed');
    }
    setTimeout(() => {
      setExporting(false);
      setExportMessage('');
    }, 2000);
  };

  const handleExportScreenshot = () => {
    setExporting(true);
    setExportMessage('');
    try {
      if (sceneRef.current) {
        const { renderer, scene, camera } = sceneRef.current;
        const success = exportScreenshot(renderer, scene, camera);
        if (success) {
          setExportMessage('✅ Screenshot captured successfully!');
        } else {
          setExportMessage('❌ Screenshot failed');
        }
      } else {
        setExportMessage('❌ Scene not ready');
      }
    } catch (error) {
      console.error('Screenshot failed:', error);
      setExportMessage('❌ Screenshot failed');
    }
    setTimeout(() => {
      setExporting(false);
      setExportMessage('');
    }, 2000);
  };

  if (!isOpen) return null;

  const hasModules = modules && modules.length > 0;

  return (
    <>
      <div className="export-menu-overlay" onClick={onClose} />
      <div className="export-menu">
        <div className="export-menu-header">
          <h3>📥 Export Design</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="export-menu-content">
          <p className="export-description">
            Save your habitat design in multiple formats
          </p>
          
          <div className="export-options">
            <button 
              className="export-option-btn"
              onClick={handleExportJSON}
              disabled={exporting || !hasModules}
            >
              <span className="export-icon">📄</span>
              <div className="export-text">
                <strong>JSON Data</strong>
                <small>Complete design data (can be re-imported)</small>
              </div>
            </button>
            
            <button 
              className="export-option-btn"
              onClick={handleExportText}
              disabled={exporting || !hasModules}
            >
              <span className="export-icon">📝</span>
              <div className="export-text">
                <strong>Text Summary</strong>
                <small>Human-readable specifications</small>
              </div>
            </button>
            
            <button 
              className="export-option-btn"
              onClick={handleExportScreenshot}
              disabled={exporting}
            >
              <span className="export-icon">📸</span>
              <div className="export-text">
                <strong>Screenshot</strong>
                <small>PNG image of your 3D habitat</small>
              </div>
            </button>
          </div>
          
          {exportMessage && (
            <div className={`export-status ${exportMessage.includes('❌') ? 'error' : 'success'}`}>
              {exportMessage}
            </div>
          )}
          
          {!hasModules && (
            <div className="export-warning">
              ⚠️ Add some modules to your habitat before exporting
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExportMenu;
