// src/pages/CommunityHubPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';

/**
 * CommunityHubPage - Community Design Gallery
 * 
 * This page will display all publicly shared habitat designs from the Firestore database.
 * Users will be able to browse, filter, and view detailed information about community designs.
 * 
 * Future features to be implemented:
 * - Grid gallery of design thumbnails
 * - Filtering by mission parameters (destination, crew size, etc.)
 * - Design detail modal
 * - Like/favorite functionality
 * - Search capability
 */
const CommunityHubPage = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch designs from Firestore in the next phase
    // For now, just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setDesigns([]); // Empty array for now
    }, 500);

    return () => clearTimeout(timer);
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '1rem'
          }}>
            {designs.map((design) => (
              <div key={design.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {/* Design card content will be implemented in the next phase */}
                <p>{design.designName}</p>
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
