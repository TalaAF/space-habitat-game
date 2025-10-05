// src/pages/CommunityHubPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.jsx';
import { fetchAllDesigns } from '../utils/firestoreHelpers';
import Navigation from '../components/UI/Navigation';
import DesignCard from '../components/UI/DesignCard';
import '../styles/index.css';

/**
 * CommunityHubPage - Community Design Gallery
 * 
 * Displays all publicly shared habitat designs from Firestore (or mock database).
 * Users can browse designs with thumbnails and mission information.
 */
const CommunityHubPage = () => {
  const navigate = useNavigate();
  const { setDesignToLoad } = useAppContext();
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

  // Handle "Clone & Explore" button click
  const handleCloneExplore = (design) => {
    console.log('🚀 Cloning design:', design.designName);
    
    // Set the design in global context for DesignerPage to pick up
    setDesignToLoad(design);
    
    // Navigate to designer page
    navigate('/designer');
  };

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
      <Navigation />
      
      {/* Header */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #6b9dff, #4d7fcc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 1rem 0'
        }}>
          🚀 The Interplanetary Architectural Guild
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          maxWidth: '700px',
          margin: '0 auto 2rem'
        }}>
          Explore, learn, and get inspired by habitat designs from architects around the world
        </p>
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
            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Loading Community Blueprints...</p>
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
            <p style={{ fontSize: '1.8rem', opacity: 0.8 }}>🌟 The Frontier is Yours to Design!</p>
            <p style={{ fontSize: '1rem', opacity: 0.6 }}>
              Be the first to publish a blueprint to the community
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
            padding: '1rem'
          }}>
            {designs.map((design) => (
              <DesignCard 
                key={design.id}
                design={design}
                onCloneExplore={handleCloneExplore}
              />
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
