// src/components/UI/PublishModal.jsx
import React, { useState } from 'react';
import '../../styles/ui.css';

/**
 * PublishModal - Modal for publishing habitat designs to the community
 * 
 * Collects design name and creator name before publishing to Firestore
 */
const PublishModal = ({ isOpen, onClose, onPublish, isLoading }) => {
  const [designName, setDesignName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [errors, setErrors] = useState({ designName: '', creatorName: '' });

  if (!isOpen) return null;

  const validateInputs = () => {
    const newErrors = { designName: '', creatorName: '' };
    let isValid = true;

    if (!designName.trim()) {
      newErrors.designName = 'Design name is required';
      isValid = false;
    } else if (designName.length > 50) {
      newErrors.designName = 'Design name must be 50 characters or less';
      isValid = false;
    }

    if (!creatorName.trim()) {
      newErrors.creatorName = 'Creator name is required';
      isValid = false;
    } else if (creatorName.length > 30) {
      newErrors.creatorName = 'Creator name must be 30 characters or less';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateInputs()) {
      onPublish(designName.trim(), creatorName.trim());
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setDesignName('');
      setCreatorName('');
      setErrors({ designName: '', creatorName: '' });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="publish-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)',
          border: '2px solid rgba(74, 158, 255, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #4a9eff, #7b2cbf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 0.5rem 0'
          }}>
            Publish to Community
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.95rem',
            margin: 0
          }}>
            Share your habitat design with the community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Design Name Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Design Name *
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g., Lunar Research Station Alpha"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: errors.designName 
                  ? '1px solid #ff6b6b' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                if (!errors.designName) {
                  e.target.style.borderColor = 'rgba(74, 158, 255, 0.5)';
                }
              }}
              onBlur={(e) => {
                if (!errors.designName) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            />
            {errors.designName && (
              <p style={{
                color: '#ff6b6b',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                marginBottom: 0
              }}>
                {errors.designName}
              </p>
            )}
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem',
              marginTop: '0.25rem',
              marginBottom: 0
            }}>
              {designName.length}/50 characters
            </p>
          </div>

          {/* Creator Name Input */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Your Name *
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g., Commander Sarah"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: errors.creatorName 
                  ? '1px solid #ff6b6b' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                if (!errors.creatorName) {
                  e.target.style.borderColor = 'rgba(74, 158, 255, 0.5)';
                }
              }}
              onBlur={(e) => {
                if (!errors.creatorName) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            />
            {errors.creatorName && (
              <p style={{
                color: '#ff6b6b',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                marginBottom: 0
              }}>
                {errors.creatorName}
              </p>
            )}
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8rem',
              marginTop: '0.25rem',
              marginBottom: 0
            }}>
              {creatorName.length}/30 characters
            </p>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: isLoading 
                  ? 'rgba(102, 126, 234, 0.5)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isLoading 
                  ? 'none' 
                  : '0 4px 15px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {isLoading && (
                <span className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }}></span>
              )}
              {isLoading ? 'Publishing...' : 'Confirm & Publish'}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <p style={{
              color: 'white',
              fontSize: '1rem',
              margin: 0
            }}>
              Publishing your design...
            </p>
          </div>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default PublishModal;
