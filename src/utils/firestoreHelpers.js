// src/utils/firestoreHelpers.js
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firestore Helper Functions for Community Platform
 * 
 * These functions handle all interactions with the Firestore database
 * for the public_designs collection.
 */

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

    // Create the document with server timestamp
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
      })),
      createdAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'public_designs'), designDoc);
    console.log('Design published successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error publishing design:', error);
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
    
    console.log(`Fetched ${designs.length} designs from community`);
    return designs;
  } catch (error) {
    console.error('Error fetching designs:', error);
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
    return designs.filter(design => 
      design.missionParams?.destination === destination
    );
  } catch (error) {
    console.error('Error fetching designs by destination:', error);
    throw error;
  }
}

/**
 * Generates a thumbnail from the current 3D scene
 * This is a placeholder - actual implementation will use Three.js renderer
 * 
 * @param {Object} renderer - Three.js WebGLRenderer
 * @returns {string} - Base64 encoded JPEG
 * 
 * @example
 * const thumbnail = generateThumbnail(sceneRef.current.renderer);
 */
export function generateThumbnail(renderer) {
  // TODO: Implement in Phase 2
  // This will capture the current frame from the Three.js renderer
  // and convert it to a Base64 JPEG string
  
  // Placeholder implementation
  return 'data:image/jpeg;base64,placeholder';
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
