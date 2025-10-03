import React from 'react';

const MissionReportModal = ({ report, onClose }) => {
  if (!report) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      default: return '⏸️';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return '#44ff88';
      case 'warning': return '#ffaa44';
      case 'critical': return '#ff4444';
      default: return '#888';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mission-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-header">
          <h2>🚀 Mission Readiness Report</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Overall Status */}
        <div className="report-overall" style={{ borderColor: getStatusColor(report.overall.status) }}>
          <div className="overall-status">
            <span className="status-icon" style={{ fontSize: '3rem' }}>
              {getStatusIcon(report.overall.status)}
            </span>
            <div className="overall-info">
              <h3>Mission Readiness Score</h3>
              <div className="readiness-score" style={{ color: getStatusColor(report.overall.status) }}>
                {report.overall.readinessScore}%
              </div>
              <p className="status-text">
                {report.overall.status === 'ready' && 'Habitat Ready for Deployment'}
                {report.overall.status === 'warning' && 'Habitat Functional with Concerns'}
                {report.overall.status === 'critical' && 'Critical Issues Detected'}
              </p>
            </div>
          </div>
        </div>

        {/* Mass Budget Section */}
        <div className="report-section">
          <div className="section-header">
            <h3>
              {getStatusIcon(report.sections.massBudget.status)} Mass Budget
            </h3>
          </div>
          <div className="section-content">
            <div className="metric-row">
              <span className="metric-label">Total Mass:</span>
              <span className="metric-value">
                {report.sections.massBudget.totalMass} / {report.sections.massBudget.massLimit} t
              </span>
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill" 
                style={{ 
                  width: `${Math.min(report.sections.massBudget.utilization, 100)}%`,
                  backgroundColor: getStatusColor(report.sections.massBudget.status)
                }}
              />
            </div>
            <div className="metric-detail">
              Utilization: {report.sections.massBudget.utilization}%
            </div>
          </div>
        </div>

        {/* Power & Life Support Section */}
        <div className="report-section">
          <div className="section-header">
            <h3>
              {getStatusIcon(report.sections.powerAndLifeSupport.power.passed && report.sections.powerAndLifeSupport.lifeSupport.passed ? 'ready' : 'critical')} 
              {' '}Power & Life Support
            </h3>
          </div>
          <div className="section-content">
            <div className="metric-row">
              <span className="metric-label">Power Status:</span>
              <span className="metric-value" style={{ 
                color: report.sections.powerAndLifeSupport.power.passed ? '#44ff88' : '#ff4444' 
              }}>
                {report.sections.powerAndLifeSupport.power.statusText}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Life Support:</span>
              <span className="metric-value" style={{ 
                color: report.sections.powerAndLifeSupport.lifeSupport.passed ? '#44ff88' : '#ff4444' 
              }}>
                {report.sections.powerAndLifeSupport.lifeSupport.statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Habitation & Zoning Section */}
        <div className="report-section">
          <div className="section-header">
            <h3>
              {getStatusIcon(
                report.sections.habitationAndZoning.completeness.passed &&
                report.sections.habitationAndZoning.noiseSeparation.passed &&
                report.sections.habitationAndZoning.hygieneSeparation.passed &&
                report.sections.habitationAndZoning.privacy.passed ? 'ready' : 'warning'
              )} 
              {' '}Layout & Zoning
            </h3>
          </div>
          <div className="section-content">
            <div className="zoning-checks">
              <div className={`zoning-item ${report.sections.habitationAndZoning.completeness.passed ? 'passed' : 'failed'}`}>
                <span className="check-icon">
                  {report.sections.habitationAndZoning.completeness.passed ? '✓' : '✗'}
                </span>
                <span>Module Completeness</span>
              </div>
              <div className={`zoning-item ${report.sections.habitationAndZoning.noiseSeparation.passed ? 'passed' : 'failed'}`}>
                <span className="check-icon">
                  {report.sections.habitationAndZoning.noiseSeparation.passed ? '✓' : '✗'}
                </span>
                <span>Noise Separation</span>
              </div>
              <div className={`zoning-item ${report.sections.habitationAndZoning.hygieneSeparation.passed ? 'passed' : 'failed'}`}>
                <span className="check-icon">
                  {report.sections.habitationAndZoning.hygieneSeparation.passed ? '✓' : '✗'}
                </span>
                <span>Hygiene Separation</span>
              </div>
              <div className={`zoning-item ${report.sections.habitationAndZoning.privacy.passed ? 'passed' : 'failed'}`}>
                <span className="check-icon">
                  {report.sections.habitationAndZoning.privacy.passed ? '✓' : '✗'}
                </span>
                <span>Privacy Standards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="report-section recommendations">
            <div className="section-header">
              <h3>📋 Action Items</h3>
            </div>
            <div className="section-content">
              <ul className="recommendation-list">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className={`recommendation-item severity-${rec.severity}`}>
                    <span className="severity-icon">{getSeverityIcon(rec.severity)}</span>
                    <span className="recommendation-text">{rec.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="report-footer">
          <button className="btn-primary" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionReportModal;
