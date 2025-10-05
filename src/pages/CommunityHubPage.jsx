// src/pages/CommunityHubPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllDesigns } from '../utils/firestoreHelpers';
import '../styles/index.css';

/**
 * CommunityHubPage - Community Design Gallery
 * 
 * Displays all publicly shared habitat designs from Firestore (or mock database).
 * Users can browse designs with thumbnails and mission information.
 */
const CommunityHubPage = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        const fetchedDesigns = await fetchAllDesigns();
        setDesigns(fetchedDesigns);
        setError(null);
      } catch (err) {
        console.error('Error loading designs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom, #0a0e1a 0%, #1a1f3a 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #4a9eff, #7b2cbf)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Community Hub
        </h1>
        
        <Link to="/designer">
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Back to Designer
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '1200px',
        flex: 1
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh'
          }}>
            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Loading designs...</p>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            color: '#ff6b6b'
          }}>
            <p style={{ fontSize: '1.5rem' }}>Error: {error}</p>
          </div>
        ) : designs.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>No community designs yet!</p>
            <p style={{ fontSize: '1rem', opacity: 0.5 }}>
              Be the first to share your habitat design with the community.
            </p>
            <Link to="/designer">
              <button style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Create Your First Design
              </button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            padding: '1rem'
          }}>
            {designs.map((design) => (
              <div key={design.id} style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                {/* Thumbnail */}
                {design.thumbnail && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={design.thumbnail} 
                      alt={design.designName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Design Name */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    margin: '0 0 0.5rem 0',
                    color: '#ffffff'
                  }}>
                    {design.designName}
                  </h3>
                  
                  {/* Creator */}
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: '0 0 1rem 0'
                  }}>
                    by <span style={{ color: '#4a9eff' }}>{design.creatorName}</span>
                  </p>
                  
                  {/* Mission Info */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(74, 158, 255, 0.2)',
                      border: '1px solid rgba(74, 158, 255, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#4a9eff',
                      textTransform: 'capitalize'
                    }}>
                      🌍 {design.missionParams?.destination || 'Unknown'}
                    </span>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#a78bfa'
                    }}>
                      👥 {design.missionParams?.crewSize || 0} Crew
                    </span>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: '#60a5fa'
                    }}>
                      🏗️ {design.modules?.length || 0} Modules
                    </span>
                  </div>
                  
                  {/* Date */}
                  {design.createdAt && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      margin: 0
                    }}>
                      {new Date(design.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        opacity: 0.6,
        fontSize: '0.9rem'
      }}>
        <p>Community Hub - Phase 1 Foundation</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Gallery features coming in Phase 2
        </p>
      </footer>
    </div>
  );
};

export default CommunityHubPage;
