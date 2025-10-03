// NASA Crew Path & Access Analysis Tool
// Based on NASA habitat evaluation criteria for minimum translation path width

// NASA Standard: Minimum clear width for crew passage 1.0m (39.4 inches)
// Reference: "Internal Layout of a Lunar Surface Habitat"
export const MIN_PATH_WIDTH = 1.0;
export const GRID_SIZE = 0.5; // Path grid resolution

class PathNode {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.g = 0; // Cost from start
    this.h = 0; // Heuristic cost to end
    this.f = 0; // Total cost
    this.parent = null;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}

// Calculate Euclidean distance
function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2) +
    Math.pow(a.z - b.z, 2)
  );
}

// Check if a point is occupied by a module
function isOccupied(point, modules, tolerance = 0.7) {
  for (const module of modules) {
    const dx = Math.abs(point.x - module.position.x);
    const dy = Math.abs(point.y - module.position.y);
    const dz = Math.abs(point.z - module.position.z);
    
    if (dx < tolerance && dy < tolerance && dz < tolerance) {
      return true;
    }
  }
  return false;
}

// Check if a path segment has minimum clear width
function checkPathWidth(start, end, modules, habitatStructure) {
  const MIN_WIDTH = MIN_PATH_WIDTH;
  const checks = 5; // Number of points to check along the segment
  
  for (let i = 0; i <= checks; i++) {
    const t = i / checks;
    const checkPoint = {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      z: start.z + (end.z - start.z) * t
    };
    
    // Check perpendicular clearance (simplified 2D check on XZ plane)
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    
    if (length === 0) continue;
    
    // Perpendicular direction
    const perpX = -dz / length;
    const perpZ = dx / length;
    
    // Check both sides
    for (let side = -1; side <= 1; side += 2) {
      const checkX = checkPoint.x + perpX * MIN_WIDTH * side * 0.5;
      const checkZ = checkPoint.z + perpZ * MIN_WIDTH * side * 0.5;
      
      // Check if this point is inside habitat bounds
      const distFromCenter = Math.sqrt(checkX * checkX + checkZ * checkZ);
      if (habitatStructure.shape === 'cylinder') {
        if (distFromCenter > habitatStructure.radius - 0.3) {
          return false; // Too close to wall
        }
      } else if (habitatStructure.shape === 'dome') {
        if (distFromCenter > habitatStructure.radius - 0.3) {
          return false;
        }
      }
      
      // Check if blocked by module
      if (isOccupied({ x: checkX, y: checkPoint.y, z: checkZ }, modules, 0.5)) {
        return false;
      }
    }
  }
  
  return true;
}

// A* Pathfinding Algorithm
export function findPath(startPos, endPos, modules, habitatStructure) {
  const start = new PathNode(
    Math.round(startPos.x / GRID_SIZE) * GRID_SIZE,
    Math.round(startPos.y / GRID_SIZE) * GRID_SIZE,
    Math.round(startPos.z / GRID_SIZE) * GRID_SIZE
  );
  
  const end = new PathNode(
    Math.round(endPos.x / GRID_SIZE) * GRID_SIZE,
    Math.round(endPos.y / GRID_SIZE) * GRID_SIZE,
    Math.round(endPos.z / GRID_SIZE) * GRID_SIZE
  );

  const openSet = [start];
  const closedSet = [];
  const maxIterations = 1000;
  let iterations = 0;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find node with lowest f score
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIndex].f) {
        currentIndex = i;
      }
    }
    
    const current = openSet[currentIndex];
    
    // Check if we reached the goal
    if (current.equals(end)) {
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift({ x: temp.x, y: temp.y, z: temp.z });
        temp = temp.parent;
      }
      return path;
    }
    
    // Move current from open to closed
    openSet.splice(currentIndex, 1);
    closedSet.push(current);
    
    // Generate neighbors (8 directions on XZ plane, same Y level)
    const neighbors = [
      new PathNode(current.x + GRID_SIZE, current.y, current.z),
      new PathNode(current.x - GRID_SIZE, current.y, current.z),
      new PathNode(current.x, current.y, current.z + GRID_SIZE),
      new PathNode(current.x, current.y, current.z - GRID_SIZE),
      new PathNode(current.x + GRID_SIZE, current.y, current.z + GRID_SIZE),
      new PathNode(current.x - GRID_SIZE, current.y, current.z + GRID_SIZE),
      new PathNode(current.x + GRID_SIZE, current.y, current.z - GRID_SIZE),
      new PathNode(current.x - GRID_SIZE, current.y, current.z - GRID_SIZE)
    ];
    
    for (const neighbor of neighbors) {
      // Check if neighbor is in closed set
      if (closedSet.some(node => node.equals(neighbor))) {
        continue;
      }
      
      // Check if neighbor is valid (not occupied and within bounds)
      const distFromCenter = Math.sqrt(neighbor.x * neighbor.x + neighbor.z * neighbor.z);
      if (habitatStructure.shape === 'cylinder') {
        if (distFromCenter > habitatStructure.radius - 0.5) {
          continue;
        }
      } else if (habitatStructure.shape === 'dome') {
        if (distFromCenter > habitatStructure.radius - 0.5) {
          continue;
        }
      }
      
      if (isOccupied(neighbor, modules.filter(m => 
        m.position.x !== startPos.x || m.position.z !== startPos.z
      ), 0.6)) {
        continue;
      }
      
      // Calculate costs
      const gScore = current.g + distance(current, neighbor);
      
      // Check if neighbor is already in open set
      const existingIndex = openSet.findIndex(node => node.equals(neighbor));
      
      if (existingIndex === -1) {
        // Not in open set, add it
        neighbor.g = gScore;
        neighbor.h = distance(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        openSet.push(neighbor);
      } else if (gScore < openSet[existingIndex].g) {
        // Found a better path to this neighbor
        openSet[existingIndex].g = gScore;
        openSet[existingIndex].f = gScore + openSet[existingIndex].h;
        openSet[existingIndex].parent = current;
      }
    }
  }
  
  // No path found, return null
  return null;
}

// Analyze path for width constraints
export function analyzePath(path, modules, habitatStructure) {
  if (!path || path.length < 2) {
    return {
      totalDistance: 0,
      totalSegments: 0,
      clearSegments: 0,
      narrowSegments: 0,
      minWidth: MIN_PATH_WIDTH,
      passes: false,
      clearanceValidation: {
        segments: []
      }
    };
  }

  const segments = [];
  let totalDistance = 0;
  let clearCount = 0;
  let narrowCount = 0;
  let minWidth = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const segmentDistance = distance(start, end);
    const hasClearance = checkPathWidth(start, end, modules, habitatStructure);
    
    // For visualization, assume minimum width if clear
    const segmentWidth = hasClearance ? MIN_PATH_WIDTH : MIN_PATH_WIDTH * 0.5;
    if (segmentWidth < minWidth) {
      minWidth = segmentWidth;
    }
    
    segments.push({
      start,
      end,
      distance: segmentDistance,
      passed: hasClearance,
      clearance: segmentWidth
    });
    
    totalDistance += segmentDistance;
    if (hasClearance) {
      clearCount++;
    } else {
      narrowCount++;
    }
  }

  return {
    totalDistance,
    totalSegments: segments.length,
    clearSegments: clearCount,
    narrowSegments: narrowCount,
    minWidth: minWidth === Infinity ? 0 : minWidth,
    passes: narrowCount === 0,
    clearanceValidation: {
      segments
    }
  };
}

// Generate path analysis report
export function generatePathReport(analysis, startModule, endModule) {
  const passRate = analysis.segments.length > 0 
    ? (analysis.clearSegments / analysis.segments.length * 100).toFixed(1)
    : 0;

  return {
    startModule: startModule?.name || 'Unknown',
    endModule: endModule?.name || 'Unknown',
    totalDistance: analysis.totalDistance.toFixed(2),
    totalSegments: analysis.segments.length,
    clearSegments: analysis.clearSegments,
    obstructedSegments: analysis.obstructedSegments,
    passRate,
    isFullyClear: analysis.isFullyClear,
    status: analysis.isFullyClear ? 'PASS' : 'FAIL',
    minWidth: MIN_PATH_WIDTH,
    recommendation: analysis.isFullyClear 
      ? 'Path meets NASA minimum translation width requirements.'
      : `Path has ${analysis.obstructedSegments} obstructed segment(s). Rearrange modules to provide ${MIN_PATH_WIDTH}m clear width.`
  };
}
