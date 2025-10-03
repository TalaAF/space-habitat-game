import React from 'react';
import { generatePathReport, MIN_PATH_WIDTH } from '../../utils/pathAnalysis';

const PathAnalysisPanel = ({ 
  pathAnalysisMode, 
  onToggleMode, 
  pathAnalysis, 
  startModule, 
  endModule 
}) => {
  const report = pathAnalysis && startModule && endModule 
    ? generatePathReport(pathAnalysis, startModule, endModule)
    : null;

  return (
    <div className="path-analysis-panel">
      <div className="path-header">
        <h3>🛤️ Crew Path Analysis</h3>
        <button 
          className={`btn-path-mode ${pathAnalysisMode ? 'active' : ''}`}
          onClick={onToggleMode}
        >
          {pathAnalysisMode ? '✓ Analysis Active' : 'Activate Analysis'}
        </button>
      </div>

      {pathAnalysisMode && (
        <div className="path-instructions">
          <p className="instruction-text">
            📍 Click on two modules to analyze the crew translation path between them.
          </p>
          <div className="path-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#44ff88' }}></div>
              <span>Clear Path (≥{MIN_PATH_WIDTH}m width)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ff4444' }}></div>
              <span>Obstructed/Narrow</span>
            </div>
          </div>
        </div>
      )}

      {report && (
        <div className={`path-report ${report.status === 'PASS' ? 'report-pass' : 'report-fail'}`}>
          <div className="report-header">
            <span className="report-status-icon">
              {report.status === 'PASS' ? '✅' : '⚠️'}
            </span>
            <span className="report-status">{report.status}</span>
          </div>

          <div className="report-route">
            <div className="route-item">
              <span className="route-label">From:</span>
              <span className="route-value">{report.startModule}</span>
            </div>
            <div className="route-arrow">→</div>
            <div className="route-item">
              <span className="route-label">To:</span>
              <span className="route-value">{report.endModule}</span>
            </div>
          </div>

          <div className="report-metrics">
            <div className="metric-item">
              <span className="metric-label">Total Distance:</span>
              <span className="metric-value">{report.totalDistance}m</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Path Segments:</span>
              <span className="metric-value">{report.totalSegments}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Clear Segments:</span>
              <span className="metric-value pass">{report.clearSegments}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Obstructed:</span>
              <span className="metric-value fail">{report.obstructedSegments}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Pass Rate:</span>
              <span className={`metric-value ${report.isFullyClear ? 'pass' : 'fail'}`}>
                {report.passRate}%
              </span>
            </div>
          </div>

          <div className="report-details">
            <h4>NASA Compliance</h4>
            <p className="nasa-requirement">
              <strong>Min. Translation Width:</strong> {report.minWidth}m (34 inches)
            </p>
            <p className={`recommendation ${report.isFullyClear ? 'pass-text' : 'fail-text'}`}>
              {report.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathAnalysisPanel;
