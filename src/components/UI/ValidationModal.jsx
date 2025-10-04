import React, { useState } from 'react';
import { MODULE_SPECS } from '../../utils/missionValidation.js';

const ValidationModal = ({ results, missionReport, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!results && !missionReport) return null;

  // Use new mission report if available, otherwise fall back to legacy results
  const useNewReport = missionReport && missionReport.overall;
  const overallPassed = useNewReport ? 
    missionReport.overall.status === 'ready' : 
    results?.passed;
  const readinessScore = useNewReport ? 
    missionReport.overall.readinessScore : 
    Math.round((results?.passedCount / results?.totalChecks) * 100) || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mission-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚀 Mission Readiness Assessment</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Overall Status */}
          <div className={`readiness-status ${overallPassed ? 'passed' : 'failed'}`}>
            <div className="status-icon">
              {overallPassed ? '✅' : '⚠️'}
            </div>
            <div className="status-text">
              <h3>{overallPassed ? 'Mission Ready!' : 'Mission Not Ready'}</h3>
              <p>Readiness Score: {readinessScore}%</p>
              {useNewReport && (
                <div className="status-details">
                  <span className={`status-badge status-${missionReport.overall.status}`}>
                    {missionReport.overall.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs for detailed view */}
          {useNewReport && (
            <div className="validation-tabs">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'qualities' ? 'active' : ''}`}
                onClick={() => setActiveTab('qualities')}
              >
                Module Qualities
              </button>
              <button 
                className={`tab-button ${activeTab === 'layout' ? 'active' : ''}`}
                onClick={() => setActiveTab('layout')}
              >
                Habitat Layout
              </button>
              <button 
                className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Requirements
              </button>
            </div>
          )}

          <div className="validation-results">
            {/* Overview Tab */}
            {activeTab === 'overview' && useNewReport && (
              <div className="overview-tab">
                {/* Critical Issues */}
                {missionReport.detailedIssues.critical.length > 0 && (
                  <div className="issue-section critical-issues">
                    <h4>🚨 Critical Issues</h4>
                    <p className="section-description">These issues must be resolved before mission launch:</p>
                    <ul>
                      {missionReport.detailedIssues.critical.map((issue, index) => (
                        <li key={index} className="critical-issue">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {missionReport.detailedIssues.warnings.length > 0 && (
                  <div className="issue-section warning-issues">
                    <h4>⚠️ Warnings</h4>
                    <p className="section-description">These issues may impact crew comfort and efficiency:</p>
                    <ul>
                      {missionReport.detailedIssues.warnings.map((issue, index) => (
                        <li key={index} className="warning-issue">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Score Breakdown */}
                <div className="score-breakdown">
                  <h4>📊 Assessment Breakdown</h4>
                  <div className="score-grid">
                    <div className="score-item">
                      <span className="score-label">Mass Budget:</span>
                      <span className={`score-value ${missionReport.sections.massBudget.passed ? 'pass' : 'fail'}`}>
                        {missionReport.sections.massBudget.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Power & Life Support:</span>
                      <span className={`score-value ${missionReport.sections.powerAndLifeSupport.power.passed && missionReport.sections.powerAndLifeSupport.lifeSupport.passed ? 'pass' : 'fail'}`}>
                        {missionReport.sections.powerAndLifeSupport.power.passed && missionReport.sections.powerAndLifeSupport.lifeSupport.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Module Qualities:</span>
                      <span className={`score-value ${missionReport.sections.moduleQualities.overall.score >= 70 ? 'pass' : 'fail'}`}>
                        {missionReport.sections.moduleQualities.overall.score}%
                      </span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Habitat Layout:</span>
                      <span className={`score-value ${missionReport.sections.habitatLayout.overall.score >= 70 ? 'pass' : 'fail'}`}>
                        {missionReport.sections.habitatLayout.overall.score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Module Qualities Tab */}
            {activeTab === 'qualities' && useNewReport && (
              <div className="qualities-tab">
                <h4>🏗️ Module Quality Assessment</h4>
                <p className="section-description">Each module has specific qualities required for space operations:</p>
                
                {Object.entries(missionReport.sections.moduleQualities.moduleChecks).map(([moduleId, moduleResult]) => {
                  const moduleType = moduleId.includes('-') ? moduleId.split('-')[0] : moduleId;
                  const moduleSpec = missionReport.sections.moduleQualities.moduleChecks[moduleId];
                  
                  return (
                    <div key={moduleId} className={`module-quality-check ${moduleResult.passed ? 'passed' : 'failed'}`}>
                      <div className="module-header">
                        <span className="module-name">
                          {MODULE_SPECS[moduleType]?.emoji || '🏗'} {MODULE_SPECS[moduleType]?.name || `${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} Module`}
                        </span>
                        <span className={`module-status ${moduleResult.passed ? 'pass' : 'fail'}`}>
                          {moduleResult.passed ? '✓ PASS' : '✗ ISSUES'}
                        </span>
                      </div>
                      
                      {moduleResult.issues.length > 0 && (
                        <ul className="quality-issues">
                          {moduleResult.issues.map((issue, index) => (
                            <li key={index} className="quality-issue">{issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && useNewReport && (
              <div className="layout-tab">
                <h4>🏛️ Habitat Layout Assessment</h4>
                <p className="section-description">Layout principles for safe and efficient space habitats:</p>
                
                <div className="layout-sections">
                  {/* Zoning Results */}
                  <div className="layout-section">
                    <h5>🎯 Zoning</h5>
                    <div className="layout-checks">
                      <div className={`layout-check ${missionReport.sections.habitatLayout.zoning.noiseSeparation.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Noise Separation</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.zoning.noiseSeparation.passed ? '✓' : '✗'}</span>
                      </div>
                      <div className={`layout-check ${missionReport.sections.habitatLayout.zoning.contaminationControl.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Contamination Control</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.zoning.contaminationControl.passed ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Adjacency Results */}
                  <div className="layout-section">
                    <h5>📐 Adjacency</h5>
                    <div className="layout-checks">
                      <div className={`layout-check ${missionReport.sections.habitatLayout.adjacency.requiredAdjacencies.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Required Adjacencies</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.adjacency.requiredAdjacencies.passed ? '✓' : '✗'}</span>
                      </div>
                      <div className={`layout-check ${missionReport.sections.habitatLayout.adjacency.avoidedAdjacencies.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Avoided Adjacencies</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.adjacency.avoidedAdjacencies.passed ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Translation Paths */}
                  <div className="layout-section">
                    <h5>🚶 Translation Paths</h5>
                    <div className="layout-checks">
                      <div className={`layout-check ${missionReport.sections.habitatLayout.translationPaths.emergencyAccess.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Emergency Access</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.translationPaths.emergencyAccess.passed ? '✓' : '✗'}</span>
                      </div>
                      <div className={`layout-check ${missionReport.sections.habitatLayout.translationPaths.centralHub.passed ? 'passed' : 'failed'}`}>
                        <span className="check-name">Central Hub</span>
                        <span className="check-status">{missionReport.sections.habitatLayout.translationPaths.centralHub.passed ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Requirements Tab (Legacy) */}
            {(activeTab === 'basic' || !useNewReport) && results && (
              <div className="basic-tab">
                <h4>📋 Basic Requirements</h4>
                {results.checks.map((check, index) => (
                  <div key={index} className={`check-item ${check.passed ? 'check-passed' : 'check-failed'}`}>
                    <div className="check-header">
                      <span className="check-icon">
                        {check.passed ? '✓' : '✗'}
                      </span>
                      <span className="check-name">{check.name}</span>
                      <span className={`check-badge ${check.passed ? 'badge-pass' : 'badge-fail'}`}>
                        {check.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    
                    <p className="check-description">{check.description}</p>
                    
                    <div className="check-values">
                      <div className="value-item">
                        <span className="value-label">Current:</span>
                        <span className="value-number">
                          {check.current} {check.unit}
                        </span>
                      </div>
                      <div className="value-item">
                        <span className="value-label">Required:</span>
                        <span className="value-number">
                          {check.required} {check.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {((useNewReport && missionReport.recommendations.length > 0) || 
            (!useNewReport && results && !results.passed)) && (
            <div className="recommendations">
              <h4>� Recommendations</h4>
              {useNewReport ? (
                <ul>
                  {missionReport.recommendations.map((rec, index) => (
                    <li key={index} className={`recommendation ${rec.severity}`}>
                      <span className="severity-badge">{rec.severity.toUpperCase()}</span>
                      {rec.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {results.checks.filter(c => !c.passed).map((check, index) => (
                    <li key={index}>
                      Add {check.required - check.current} more {check.name} module(s)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            {overallPassed ? 'Launch Mission! 🚀' : 'Continue Building'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
