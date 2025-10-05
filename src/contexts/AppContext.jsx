// src/contexts/AppContext.js
import React, { createContext, useState, useContext } from 'react';

/**
 * AppContext - Global application state management
 * 
 * Provides shared state across the entire application, enabling data flow
 * between different pages (e.g., Community Hub → Designer).
 * 
 * Primary Use Case: "Clone & Explore" functionality
 * When a user clicks "Clone & Explore" on a community design, this context
 * carries the complete design data from the gallery page to the designer page.
 */

// Create the context
const AppContext = createContext();

/**
 * AppContextProvider - Wrapper component that provides global state
 * 
 * Usage:
 * Wrap your main App component with this provider to enable
 * context access throughout the component tree.
 * 
 * @example
 * <AppContextProvider>
 *   <App />
 * </AppContextProvider>
 */
export const AppContextProvider = ({ children }) => {
  // State to hold the design that should be loaded into the designer
  const [designToLoad, setDesignToLoadState] = useState(null);

  /**
   * Set a design to be loaded into the designer
   * Called from CommunityHubPage when user clicks "Clone & Explore"
   * 
   * @param {Object} design - Complete design object from Firestore
   * @param {string} design.id - Unique design ID
   * @param {string} design.designName - Name of the design
   * @param {string} design.creatorName - Original creator
   * @param {Object} design.missionParams - Mission configuration
   * @param {Array} design.modules - Array of module objects
   * @param {string} design.thumbnail - Base64 thumbnail image
   */
  const setDesignToLoad = (design) => {
    console.log('🎯 AppContext: Design queued for loading:', design?.designName);
    setDesignToLoadState(design);
  };

  /**
   * Clear the designToLoad state
   * Called from DesignerPage after successfully loading the design
   * This prevents re-loading the same design on subsequent renders
   */
  const clearDesignToLoad = () => {
    console.log('🧹 AppContext: Cleared designToLoad state');
    setDesignToLoadState(null);
  };

  // Context value object - these are accessible to all consuming components
  const contextValue = {
    designToLoad,
    setDesignToLoad,
    clearDesignToLoad
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * useAppContext - Custom hook to consume the AppContext
 * 
 * This is a convenience hook that provides easy access to the context.
 * Use this in any component that needs to read or modify the global state.
 * 
 * @returns {Object} Context value with { designToLoad, setDesignToLoad, clearDesignToLoad }
 * 
 * @example
 * const { designToLoad, setDesignToLoad, clearDesignToLoad } = useAppContext();
 * 
 * // In CommunityHubPage:
 * const handleClone = (design) => {
 *   setDesignToLoad(design);
 *   navigate('/designer');
 * };
 * 
 * // In DesignerPage:
 * useEffect(() => {
 *   if (designToLoad) {
 *     // Load the design into state
 *     loadDesignIntoEditor(designToLoad);
 *     // Clean up
 *     clearDesignToLoad();
 *   }
 * }, [designToLoad]);
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  
  return context;
};

export default AppContext;
