import * as THREE from 'three';

/**
 * Generate human-readable text summary
 */
function generateTextSummary(habitatStructure, modules) {
  const totalMass = modules.reduce((sum, m) => sum + (m.mass || 0), 0);
  const totalPower = modules.reduce((sum, m) => sum + (m.power || 0), 0);
  const totalLifeSupport = modules.reduce((sum, m) => sum + (m.lifeSupport || 0), 0);
  
  const modulesByType = modules.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});
  
  const modulesByFloor = modules.reduce((acc, m) => {
    const floor = m.floor || 0;
    acc[floor] = (acc[floor] || 0) + 1;
    return acc;
  }, {});

  let text = '═══════════════════════════════════════════════════\n';
  text += '    NASA SPACE HABITAT DESIGN SUMMARY\n';
  text += '═══════════════════════════════════════════════════\n\n';
  
  text += `Export Date: ${new Date().toLocaleString()}\n\n`;
  
  text += '───────────────────────────────────────────────────\n';
  text += 'HABITAT STRUCTURE\n';
  text += '───────────────────────────────────────────────────\n';
  text += `Shape: ${habitatStructure.shape || 'cylinder'}\n`;
  text += `Radius: ${habitatStructure.radius?.toFixed(1) || 5} meters\n`;
  text += `Total Height: ${habitatStructure.height?.toFixed(1) || 8} meters\n`;
  text += `Number of Floors: ${habitatStructure.floors || 1}\n`;
  text += `Floor Height: ${habitatStructure.floorHeight?.toFixed(1) || 3} meters\n\n`;
  
  if (habitatStructure.floorShapes && habitatStructure.floorShapes.length > 0) {
    text += 'Floor Shapes:\n';
    habitatStructure.floorShapes.forEach((shape, i) => {
      text += `  Floor ${i + 1}: ${shape}\n`;
    });
    text += '\n';
  }
  
  text += '───────────────────────────────────────────────────\n';
  text += 'ENGINEERING SUMMARY\n';
  text += '───────────────────────────────────────────────────\n';
  text += `Total Modules: ${modules.length}\n`;
  text += `Total Mass: ${totalMass.toFixed(2)} metric tons\n`;
  text += `Net Power: ${totalPower.toFixed(2)} kW ${totalPower >= 0 ? '(Surplus)' : '(Deficit)'}\n`;
  text += `Life Support Capacity: ${totalLifeSupport} crew members\n\n`;
  
  text += '───────────────────────────────────────────────────\n';
  text += 'MODULES BY TYPE\n';
  text += '───────────────────────────────────────────────────\n';
  Object.entries(modulesByType).forEach(([type, count]) => {
    text += `${type.padEnd(20)}: ${count}\n`;
  });
  text += '\n';
  
  text += '───────────────────────────────────────────────────\n';
  text += 'MODULES BY FLOOR\n';
  text += '───────────────────────────────────────────────────\n';
  Object.entries(modulesByFloor).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([floor, count]) => {
    text += `Floor ${Number(floor) + 1}: ${count} modules\n`;
  });
  text += '\n';
  
  text += '───────────────────────────────────────────────────\n';
  text += 'DETAILED MODULE LIST\n';
  text += '───────────────────────────────────────────────────\n\n';
  
  const floors = habitatStructure.floors || 1;
  for (let f = 0; f < floors; f++) {
    const floorModules = modules.filter(m => (m.floor || 0) === f);
    if (floorModules.length > 0) {
      text += `FLOOR ${f + 1}:\n`;
      floorModules.forEach((module, i) => {
        text += `  ${i + 1}. ${module.type}\n`;
        text += `     Position: (${module.position.x.toFixed(1)}, ${module.position.y.toFixed(1)}, ${module.position.z.toFixed(1)})\n`;
        text += `     Mass: ${(module.mass || 0).toFixed(2)} tons | Power: ${(module.power || 0).toFixed(2)} kW | Life Support: ${module.lifeSupport || 0}\n`;
      });
      text += '\n';
    }
  }
  
  text += '═══════════════════════════════════════════════════\n';
  text += 'End of Summary\n';
  text += '═══════════════════════════════════════════════════\n';
  
  return text;
}

/**
 * Export habitat design as human-readable text summary
 */
export function exportDesignAsText(habitatStructure, modules) {
  const summary = generateTextSummary(habitatStructure, modules);
  
  const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habitat-summary-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('✅ Design exported as Text');
  return true;
}

/**
 * Capture screenshot of 3D scene
 */
export function exportScreenshot(renderer, scene, camera) {
  if (!renderer || !scene || !camera) {
    console.error('❌ Missing renderer, scene, or camera for screenshot');
    return false;
  }

  try {
    // Render the scene one more time to ensure it's up to date
    renderer.render(scene, camera);
    
    // Get image data from canvas
    const canvas = renderer.domElement;
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `habitat-screenshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Screenshot captured');
    }, 'image/png', 1.0);
    
    return true;
  } catch (error) {
    console.error('❌ Screenshot failed:', error);
    return false;
  }
}

/**
 * Export habitat design as JSON file
 */
export function exportDesignAsJSON(habitatStructure, modules) {
  const designData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    habitat: {
      shape: habitatStructure.shape || 'cylinder',
      radius: habitatStructure.radius || 5,
      height: habitatStructure.height || 8,
      floors: habitatStructure.floors || 1,
      floorHeight: habitatStructure.floorHeight || 3,
      floorShapes: habitatStructure.floorShapes || []
    },
    modules: modules.map(module => ({
      id: module.id,
      type: module.type,
      position: {
        x: module.position.x,
        y: module.position.y,
        z: module.position.z
      },
      rotation: module.rotation ? {
        x: module.rotation.x,
        y: module.rotation.y,
        z: module.rotation.z
      } : { x: 0, y: 0, z: 0 },
      floor: module.floor || 0,
      size: module.size,
      mass: module.mass,
      power: module.power,
      lifeSupport: module.lifeSupport,
      tags: module.tags
    })),
    summary: {
      totalModules: modules.length,
      totalMass: modules.reduce((sum, m) => sum + (m.mass || 0), 0),
      totalPower: modules.reduce((sum, m) => sum + (m.power || 0), 0),
      totalLifeSupport: modules.reduce((sum, m) => sum + (m.lifeSupport || 0), 0),
      modulesByType: modules.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {})
    }
  };

  const jsonString = JSON.stringify(designData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habitat-design-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('✅ Design exported as JSON');
  return true;
}
