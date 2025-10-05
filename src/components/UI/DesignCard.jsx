// src/components/UI/DesignCard.jsx
import React from 'react';

/**
 * DesignCard - Reusable component for displaying a single habitat design
 * 
 * Displays design thumbnail, name, creator info, and mission parameters
 * in a beautiful, interactive card format.
 */
const DesignCard = ({ design, onCloneExplore }) => {
  // Get destination emoji
  const getDestinationEmoji = (destination) => {
    const emojis = {
      lunar: '🌙',
      mars: '🔴',
      orbit: '🛰️'
    };
    return emojis[destination?.toLowerCase()] || '🌍';
  };

  // Format date nicely
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="design-card"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(20, 35, 65, 0.9) 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(77, 127, 204, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(77, 127, 204, 0.4)';
        e.currentTarget.style.borderColor = 'rgba(107, 157, 255, 0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(77, 127, 204, 0.3)';
      }}
    >
      {/* Thumbnail Header */}
      <div style={{
        width: '100%',
        height: '220px',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        borderBottom: '2px solid rgba(77, 127, 204, 0.4)'
      }}>
        {design.thumbnail ? (
          <>
            <img 
              src={design.thumbnail} 
              alt={design.designName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
            {/* Overlay gradient for better text visibility */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
            }} />
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            opacity: 0.3
          }}>
            🏗️
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Design Name */}
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 'bold',
          margin: '0 0 0.5rem 0',
          color: '#ffffff',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.6rem'
        }}>
          {design.designName}
        </h3>

        {/* Creator */}
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: '0 0 1.25rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ opacity: 0.7 }}>by</span>
          <span style={{ 
            color: '#6b9dff',
            fontWeight: '600'
          }}>
            {design.creatorName}
          </span>
        </p>

        {/* Mission Parameters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Destination */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>
              {getDestinationEmoji(design.missionParams?.destination)}
            </span>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Destination
              </div>
              <div style={{
                fontSize: '0.95rem',
                color: '#ffffff',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {design.missionParams?.destination || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Crew Size */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.25rem'
              }}>
                👥 Crew
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#a78bfa',
                fontWeight: 'bold'
              }}>
                {design.missionParams?.crewSize || 0}
              </div>
            </div>

            {/* Modules */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.25rem'
              }}>
                🏗️ Modules
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#60a5fa',
                fontWeight: 'bold'
              }}>
                {design.modules?.length || 0}
              </div>
            </div>

            {/* Duration */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.25rem'
              }}>
                ⏱️ Duration
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#4ade80',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {design.missionParams?.duration || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Clone & Explore Button */}
        <button
          onClick={() => onCloneExplore && onCloneExplore(design)}
          style={{
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(135deg, #4d7fcc 0%, #6b9dff 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(77, 127, 204, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 20px rgba(77, 127, 204, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(77, 127, 204, 0.3)';
          }}
        >
          <span>🔍</span>
          Clone & Explore
        </button>

        {/* Publication Date */}
        {design.createdAt && (
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.4)',
            margin: '0.75rem 0 0 0',
            textAlign: 'center'
          }}>
            Published {formatDate(design.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignCard;
