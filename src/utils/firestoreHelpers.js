// src/utils/firestoreHelpers.js
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured, USE_MOCK_DB } from '../firebase';

/**
 * Firestore Helper Functions for Community Platform
 * 
 * These functions handle all interactions with the Firestore database
 * for the public_designs collection.
 * 
 * In development mode (without Firebase), uses an in-memory mock database.
 */

// Mock database - stored in browser memory
let mockDesigns = [];
let mockIdCounter = 1;

// Helper to generate mock document ID
function generateMockId() {
  return `mock_design_${mockIdCounter++}`;
}

// Helper to create mock timestamp
function createMockTimestamp() {
  return new Date().toISOString();
}

/**
 * Publishes a habitat design to the community
 * 
 * @param {Object} designData - The design data to publish
 * @param {string} designData.designName - Name of the habitat design
 * @param {string} designData.creatorName - Name of the designer
 * @param {string} designData.thumbnail - Base64 encoded JPEG thumbnail
 * @param {Object} designData.missionParams - Mission parameters object
 * @param {Array} designData.modules - Array of module objects with type and position
 * @returns {Promise<string>} - The ID of the created document
 * 
 * @example
 * const designId = await publishDesign({
 *   designName: "Lunar Research Station",
 *   creatorName: "Commander Alex",
 *   thumbnail: "data:image/jpeg;base64,...",
 *   missionParams: {
 *     crewSize: 4,
 *     destination: "lunar",
 *     duration: "long",
 *     constructionType: "rigid"
 *   },
 *   modules: [
 *     { type: "living", position: { x: 0, y: 0, z: 0 } },
 *     { type: "lab", position: { x: 3, y: 0, z: 0 } }
 *   ]
 * });
 */
export async function publishDesign(designData) {
  try {
    // Validate required fields
    if (!designData.designName || !designData.creatorName) {
      throw new Error('Design name and creator name are required');
    }
    
    if (!designData.modules || designData.modules.length === 0) {
      throw new Error('At least one module is required');
    }

    // Create the document
    const designDoc = {
      designName: designData.designName,
      creatorName: designData.creatorName,
      thumbnail: designData.thumbnail || '',
      missionParams: {
        crewSize: designData.missionParams?.crewSize || 4,
        destination: designData.missionParams?.destination || 'lunar',
        duration: designData.missionParams?.duration || 'short',
        constructionType: designData.missionParams?.constructionType || 'rigid'
      },
      modules: designData.modules.map(module => ({
        type: module.type,
        position: {
          x: module.position.x,
          y: module.position.y,
          z: module.position.z
        }
      }))
    };

    // Use mock database or real Firestore
    if (USE_MOCK_DB) {
      // Mock database - store in memory
      const mockId = generateMockId();
      const mockDoc = {
        id: mockId,
        ...designDoc,
        createdAt: createMockTimestamp()
      };
      
      mockDesigns.unshift(mockDoc); // Add to beginning (newest first)
      console.log('✅ Design published to MOCK database with ID:', mockId);
      console.log('📊 Total designs in mock database:', mockDesigns.length);
      console.log('🔍 View all designs at /hub');
      return mockId;
    } else {
      // Real Firestore
      designDoc.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, 'public_designs'), designDoc);
      console.log('✅ Design published to Firestore with ID:', docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error('❌ Error publishing design:', error);
    throw error;
  }
}

/**
 * Fetches all published designs from the community
 * Sorted by creation date (newest first)
 * 
 * @returns {Promise<Array>} - Array of design objects with IDs
 * 
 * @example
 * const designs = await fetchAllDesigns();
 * designs.forEach(design => {
 *   console.log(design.id, design.designName, design.creatorName);
 * });
 */
export async function fetchAllDesigns() {
  try {
    // Use mock database or real Firestore
    if (USE_MOCK_DB) {
      // Mock database - return from memory
      console.log(`📊 Fetched ${mockDesigns.length} designs from MOCK database`);
      
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [...mockDesigns]; // Return a copy
    } else {
      // Real Firestore
      const designsQuery = query(
        collection(db, 'public_designs'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(designsQuery);
      const designs = [];
      
      querySnapshot.forEach((doc) => {
        designs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Fetched ${designs.length} designs from Firestore`);
      return designs;
    }
  } catch (error) {
    console.error('❌ Error fetching designs:', error);
    throw error;
  }
}

/**
 * Fetches designs filtered by destination
 * 
 * @param {string} destination - 'lunar', 'mars', or 'orbit'
 * @returns {Promise<Array>} - Array of filtered design objects
 * 
 * @example
 * const lunarDesigns = await fetchDesignsByDestination('lunar');
 */
export async function fetchDesignsByDestination(destination) {
  try {
    const designs = await fetchAllDesigns();
    const filtered = designs.filter(design => 
      design.missionParams?.destination === destination
    );
    console.log(`🔍 Filtered to ${filtered.length} ${destination} designs`);
    return filtered;
  } catch (error) {
    console.error('❌ Error fetching designs by destination:', error);
    throw error;
  }
}

/**
 * Clear all mock designs (for testing purposes)
 * Only works with mock database
 */
export function clearMockDesigns() {
  if (USE_MOCK_DB) {
    mockDesigns = [];
    mockIdCounter = 1;
    console.log('🗑️ Mock database cleared');
  }
}

/**
 * Get mock designs count (for testing purposes)
 * Only works with mock database
 */
export function getMockDesignsCount() {
  if (USE_MOCK_DB) {
    return mockDesigns.length;
  }
  return 0;
}

/**
 * Generates a thumbnail from the current 3D scene
 * Captures the current canvas view and converts it to a Base64 JPEG
 * 
 * @param {Object} renderer - Three.js WebGLRenderer instance
 * @returns {string} - Base64 encoded JPEG (quality 0.5 for optimal size)
 * 
 * @example
 * const thumbnail = generateThumbnail(rendererRef.current);
 */
export function generateThumbnail(renderer) {
  try {
    if (!renderer || !renderer.domElement) {
      console.warn('No valid renderer provided for thumbnail generation');
      return '';
    }

    // Capture the current canvas as a Base64 JPEG
    // Quality 0.5 provides good balance between image quality and file size
    const dataURL = renderer.domElement.toDataURL('image/jpeg', 0.5);
    
    console.log('Thumbnail generated successfully');
    return dataURL;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    console.error('Make sure renderer was initialized with { preserveDrawingBuffer: true }');
    return '';
  }
}

/**
 * Validates design data before publishing
 * 
 * @param {Object} designData - Design data to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 * 
 * @example
 * const validation = validateDesignData(myDesign);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 */
export function validateDesignData(designData) {
  const errors = [];
  
  if (!designData.designName || designData.designName.trim().length === 0) {
    errors.push('Design name is required');
  }
  
  if (!designData.creatorName || designData.creatorName.trim().length === 0) {
    errors.push('Creator name is required');
  }
  
  if (!designData.modules || designData.modules.length === 0) {
    errors.push('At least one module is required');
  }
  
  if (designData.modules) {
    designData.modules.forEach((module, index) => {
      if (!module.type) {
        errors.push(`Module ${index + 1} is missing type`);
      }
      if (!module.position || 
          typeof module.position.x !== 'number' ||
          typeof module.position.y !== 'number' ||
          typeof module.position.z !== 'number') {
        errors.push(`Module ${index + 1} has invalid position`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
