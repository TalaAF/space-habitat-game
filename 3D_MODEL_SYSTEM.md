# 3D Model System Documentation

## Overview

This document describes the detailed 3D model system for the NASA Space Habitat Designer. The system transforms simple colored boxes into instantly recognizable, NASA-inspired symbolic geometries while preserving all engineering functionality (collision detection, pathfinding, mission analysis).

## Architecture

### Core Components

1. **`src/utils/modelCreators.js`** (573 lines)
   - Factory system for creating detailed 3D models
   - 7 NASA-inspired model creator functions
   - Registry pattern with fallback system
   - Automatic bounding box calculation
   - Shadow casting/receiving setup

2. **`src/components/Game/Scene.jsx`** (474 lines)
   - Integrates model creators into 3D scene
   - Handles module lifecycle (create, update, remove)
   - Manages drag controls and collision detection
   - Proper disposal of Group objects and textures

3. **`src/utils/missionValidation.js`** (665 lines)
   - Enhanced MODULE_SPECS with engineering data
   - Mission readiness analysis engine
   - Reads userData from models for validation

## Model Specifications

### 1. Living Quarters (Sleep Pod)

**Type:** `living`

**Dimensions:** 1.2m × 2.0m × 1.1m (W × L × H)

**Components (11 total):**
- Pod walls (rectangular frame)
- Sleeping bag (cylinder, teal)
- 2 restraint straps (cross pattern)
- Air vent (small cylinder, dark gray)
- Interior light (emissive yellow sphere)

**Materials:**
- Pod wall: `#b0bec5` (blue-gray), metalness: 0.2, roughness: 0.7
- Sleeping bag: `#00acc1` (teal), metalness: 0.1, roughness: 0.8
- Straps: `#37474f` (dark blue-gray), metalness: 0.3, roughness: 0.6
- Light: `#ffeb3b` (yellow), emissive, intensity: 0.5

**Engineering Data:**
- Mass: 2.5 tons
- Power: -0.8 kW (consumption)
- Life Support: 0 (neutral)
- Tags: `private`, `quiet`, `clean`

**Visual Purpose:** Instantly recognizable as sleeping quarters with visible sleeping bag and straps

---

### 2. Science Lab (Workbench)

**Type:** `lab`

**Dimensions:** 1.5m × 0.9m × 0.8m (W × H × D)

**Components (8 total):**
- Tabletop (rectangular box)
- 4 legs (cylinders at corners)
- Toolbox (small box with handle)
- Screwdriver (shaft + handle)
- Diagnostic screen (canvas texture: 512×256)

**Materials:**
- Tabletop: `#78909c` (gray), metalness: 0.3, roughness: 0.5
- Legs: `#455a64` (dark gray), metalness: 0.6, roughness: 0.4
- Toolbox: `#ffb74d` (orange), metalness: 0.2, roughness: 0.7
- Screen: `#1e88e5` (blue) background, emissive red `#e53935`, intensity: 0.3

**Screen Display:**
```
RESEARCH DATA
Experiment: MARS-001
Status: Active
```

**Engineering Data:**
- Mass: 3.0 tons
- Power: -1.5 kW
- Life Support: 0
- Tags: `work`, `noisy`, `clean`

**Visual Purpose:** Workbench with tools and diagnostic equipment for scientific experiments

---

### 3. Power Module (Battery Unit)

**Type:** `power`

**Dimensions:** 0.8m × 1.0m × 0.6m (W × H × D)

**Components (4 total):**
- Central battery unit (box)
- 2 folded solar panels (thin boxes at 45° angle)
- Status light (small sphere, emissive)

**Materials:**
- Battery: `#ffeb3b` (yellow), metalness: 0.8, roughness: 0.3
- Solar panels: `#1976d2` (blue), metalness: 0.5, roughness: 0.2
- Light: `#4caf50` (green), emissive, intensity: 0.8

**Engineering Data:**
- Mass: 2.0 tons
- Power: +4.0 kW (generation)
- Life Support: 0
- Tags: `utility`, `noisy`

**Visual Purpose:** Recognizable power source with solar panels and status indicator

---

### 4. Greenhouse (Growing Racks)

**Type:** `greenhouse`

**Dimensions:** 1.2m × 1.5m × 0.6m (W × H × D)

**Components (19 total):**
- Rack frame (rectangular outline)
- 3 growing trays (one per level)
- 12 plant cones (4 per level, green)
- 3 LED grow lights (emissive pink)

**Materials:**
- Frame: `#8d6e63` (brown), metalness: 0.2, roughness: 0.8
- Trays: `#3e2723` (dark brown), metalness: 0.1, roughness: 0.9
- Plants: `#66bb6a` (green), metalness: 0.1, roughness: 0.9
- Lights: `#ec407a` (pink), emissive, intensity: 0.6

**Plant Layout:**
- Level 1 (y=0.3): 4 plants at x = -0.45, -0.15, +0.15, +0.45
- Level 2 (y=0.8): 4 plants at same x positions
- Level 3 (y=1.3): 4 plants at same x positions

**Engineering Data:**
- Mass: 1.5 tons
- Power: -2.0 kW
- Life Support: +1.5 (oxygen production)
- Tags: `lifesupport`, `clean`, `quiet`

**Visual Purpose:** Multi-level growing system with visible plants and pink grow lights

---

### 5. Medical Bay (Console + Bed)

**Type:** `medical`

**Dimensions:** 1.2m × 0.8m × 2.0m total (Console + Bed)

**Components (3 main):**
- Medical console: 1.2m × 0.8m × 0.6m (box)
- Examination bed: 1.0m × 0.2m × 1.8m (long box)
- Vital signs monitor (canvas texture: 512×256)

**Materials:**
- Console: `#ffffff` (white), metalness: 0.1, roughness: 0.5
- Bed: `#e0e0e0` (light gray), metalness: 0.2, roughness: 0.6
- Monitor: `#212121` (dark gray) background, emissive red screen

**Monitor Display:**
```
VITAL SIGNS
HR: 72 bpm
BP: 120/80
SpO₂: 98%
```

**Engineering Data:**
- Mass: 2.0 tons
- Power: -1.0 kW
- Life Support: 0
- Tags: `medical`, `clean`, `private`

**Visual Purpose:** Medical facility with examination bed and vital signs monitoring

---

### 6. Airlock (Cylindrical Chamber)

**Type:** `airlock`

**Dimensions:** Ø1.6m × 2.0m (Diameter × Height)

**Components (6 total):**
- Cylindrical chamber (main structure)
- Circular hatch (top, dark)
- Yellow caution frame (torus ring)
- 2 EVA suits (torso + helmet)

**Materials:**
- Chamber: `#90a4ae` (blue-gray), metalness: 0.7, roughness: 0.3
- Hatch: `#37474f` (dark gray), metalness: 0.8, roughness: 0.2
- Frame: `#ffeb3b` (yellow), metalness: 0.5, roughness: 0.4
- Suits: `#fafafa` (white), metalness: 0.3, roughness: 0.6
- Helmets: transparent: true, opacity: 0.8

**Suit Positions:**
- Suit 1: x = -0.5
- Suit 2: x = +0.5

**Engineering Data:**
- Mass: 3.5 tons
- Power: -0.5 kW
- Life Support: 0
- Tags: `utility`, `dirty`, `noisy`

**Visual Purpose:** Recognizable airlock with yellow caution ring and visible EVA suits

---

### 7. Storage (Cargo Rack)

**Type:** `storage`

**Dimensions:** 1.2m × 1.8m × 0.6m (W × H × D)

**Components (10 total):**
- Rack frame (box outline)
- 9 cargo bags (3×3 grid, cylinders)

**Materials:**
- Frame: `#546e7a` (blue-gray), metalness: 0.4, roughness: 0.6
- Bags: `#8d6e63` (brown), metalness: 0.1, roughness: 0.9

**Cargo Layout (3 rows × 3 columns):**
- Row 1 (y=0.3): 3 bags
- Row 2 (y=0.9): 3 bags
- Row 3 (y=1.5): 3 bags
- X positions: -0.35, 0, +0.35

**Engineering Data:**
- Mass: 1.0 ton
- Power: 0 kW
- Life Support: 0
- Tags: `utility`

**Visual Purpose:** Organized storage rack with visible cargo bags

---

## Usage Guide

### Creating a Module

```javascript
import { createModuleModel } from './utils/modelCreators';

// Create a module with engineering data
const moduleGroup = createModuleModel('living', {
  id: 'module-001',
  type: 'living',
  moduleId: 'module-001',
  size: 1.5,
  mass: 2.5,
  power: -0.8,
  lifeSupport: 0,
  tags: ['private', 'quiet', 'clean']
});

// Position the module
moduleGroup.position.set(x, y, z);

// Scale if needed (models are 1:1 scale by default)
const scale = 1.2;
moduleGroup.scale.set(scale, scale, scale);

// Add to scene
scene.add(moduleGroup);
```

### Accessing Engineering Data

```javascript
// All engineering data is stored in userData
const userData = moduleGroup.userData;

console.log('Module Type:', userData.type);
console.log('Mass:', userData.mass);
console.log('Power:', userData.power);
console.log('Bounding Box:', userData.boundingBox);
```

### Collision Detection

```javascript
// Bounding box is automatically calculated
const bbox = moduleGroup.userData.boundingBox;

// Check if point is inside bounding box
const point = new THREE.Vector3(x, y, z);
const isInside = bbox.containsPoint(point);

// Expand bounding box for clearance checking
const expandedBox = bbox.clone().expandByScalar(1.0);
```

## Factory Pattern

### MODEL_CREATORS Registry

```javascript
export const MODEL_CREATORS = {
  living: createLivingQuarters,
  lab: createLab,
  power: createPowerModule,
  greenhouse: createGreenhouse,
  medical: createMedical,
  airlock: createAirlock,
  storage: createStorage
};
```

### Main Factory Function

```javascript
export function createModuleModel(type, userData = {}) {
  const creator = MODEL_CREATORS[type];
  
  if (!creator) {
    console.warn(`No model creator found for type: ${type}`);
    // Return fallback red box
    const fallback = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    fallback.add(box);
    fallback.userData = userData;
    return fallback;
  }
  
  const model = creator();
  model.userData = {
    ...userData,
    type,
    boundingBox: new THREE.Box3().setFromObject(model)
  };
  
  // Enable shadows
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  return model;
}
```

## Adding New Models

To add a new module type:

1. **Create the model function** in `modelCreators.js`:

```javascript
function createMyNewModule() {
  const group = new THREE.Group();
  
  // Add your geometries
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.5
    })
  );
  group.add(body);
  
  return group;
}
```

2. **Register in MODEL_CREATORS**:

```javascript
export const MODEL_CREATORS = {
  // ... existing creators
  myNewModule: createMyNewModule
};
```

3. **Add to MODULE_SPECS** in `missionValidation.js`:

```javascript
export const MODULE_SPECS = {
  // ... existing specs
  myNewModule: {
    name: 'My New Module',
    mass: 1.5,
    volume: 8,
    power: -1.0,
    lifeSupport: 0,
    tags: ['utility']
  }
};
```

## Testing Checklist

### Visual Testing
- [ ] All 7 module types render correctly
- [ ] Models have appropriate scale and proportions
- [ ] Colors match NASA-inspired palette
- [ ] Emissive materials (lights, screens) are visible
- [ ] Canvas textures (screens) display correctly
- [ ] Shadows cast and receive properly

### Functional Testing
- [ ] Modules can be dragged and dropped
- [ ] Collision detection works with detailed geometries
- [ ] Bounding boxes calculated correctly
- [ ] Path analysis avoids module obstacles
- [ ] Mission validation reads userData correctly
- [ ] Modules stay within habitat boundaries
- [ ] Proper disposal (no memory leaks)

### Engineering Testing
- [ ] Mass budget calculations correct
- [ ] Power balance calculations correct
- [ ] Life support calculations correct
- [ ] Zoning checks work (noise, hygiene, privacy)
- [ ] Distance calculations accurate
- [ ] Mission readiness score accurate

### Performance Testing
- [ ] Scene loads quickly with 10+ modules
- [ ] Drag and drop remains smooth
- [ ] No frame rate drops during rotation
- [ ] Memory usage stable over time
- [ ] Proper cleanup on module deletion

## Customization

### Changing Colors

Edit the material colors in `modelCreators.js`:

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000, // Change this hex value
  metalness: 0.5,
  roughness: 0.5
});
```

### Adjusting Dimensions

Modify geometry parameters:

```javascript
const box = new THREE.BoxGeometry(
  1.5, // width
  2.0, // height
  1.2  // depth
);
```

### Adding Components

Add more meshes to the group:

```javascript
const newPart = new THREE.Mesh(geometry, material);
newPart.position.set(x, y, z);
group.add(newPart);
```

### Canvas Textures

Customize screen displays:

```javascript
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 256;

// Draw custom content
context.fillStyle = '#000000';
context.fillRect(0, 0, canvas.width, canvas.height);
context.font = 'Bold 32px Arial';
context.fillStyle = '#ffffff';
context.fillText('Custom Text', 256, 128);

const texture = new THREE.CanvasTexture(canvas);
const material = new THREE.MeshStandardMaterial({ map: texture });
```

## Technical Details

### Three.js Geometries Used

- **BoxGeometry**: Walls, tabletops, cargo bags, batteries
- **CylinderGeometry**: Sleeping bags, legs, lights, chambers, suits
- **SphereGeometry**: Lights, helmet visors
- **TorusGeometry**: Caution frames
- **ConeGeometry**: Plants

### Material Properties

- **metalness**: 0.1 (organic) to 1.0 (metal)
- **roughness**: 0.1 (smooth) to 0.9 (rough)
- **emissive**: Self-illuminating surfaces (lights, screens)
- **emissiveIntensity**: 0.2 to 0.8 brightness
- **transparent**: true for visors/windows
- **opacity**: 0.8 for transparent materials

### Shadow System

All meshes automatically configured for shadows:

```javascript
model.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
```

### Bounding Box Calculation

```javascript
const boundingBox = new THREE.Box3().setFromObject(model);
```

This automatically calculates the axis-aligned bounding box for the entire group, including all children.

## Troubleshooting

### Models Not Appearing

1. Check console for errors
2. Verify module type matches registry key
3. Ensure position is within habitat boundaries
4. Check camera position and angle

### Collision Detection Not Working

1. Verify boundingBox exists in userData
2. Check if bounding box is calculated after positioning
3. Ensure obstacles array includes module groups

### Performance Issues

1. Reduce number of geometry segments
2. Use simpler materials (lower metalness/roughness)
3. Disable shadows if needed
4. Optimize canvas texture resolution

### Memory Leaks

1. Ensure proper disposal in cleanup functions
2. Dispose of canvas textures: `material.map.dispose()`
3. Traverse and dispose all children
4. Remove event listeners

## Future Enhancements

### Potential Additions

1. **Animation**: Rotating solar panels, blinking lights
2. **Interactivity**: Click modules to show detailed info
3. **LOD (Level of Detail)**: Simpler models when zoomed out
4. **Particle Effects**: Steam from life support, sparks from tools
5. **Sound Effects**: Ambient sounds per module type
6. **Day/Night Cycle**: Adjust emissive intensity
7. **Damage States**: Visual indicators for system failures
8. **Construction Animation**: Assembly sequence
9. **Customization UI**: User-selectable colors/variants
10. **Export**: 3D model export for external viewers

## References

- **NASA Habitat Designs**: Based on actual ISS and Gateway modules
- **Three.js Documentation**: https://threejs.org/docs/
- **NASA Systems Engineering**: Mass, power, life support specs
- **Human Factors**: Zoning requirements (noise, hygiene, privacy)

## Version History

- **v1.0.0** (Current): Initial release with 7 NASA-inspired models
  - Living Quarters, Science Lab, Power Module
  - Greenhouse, Medical Bay, Airlock, Storage
  - Factory pattern with fallback system
  - Automatic bounding box and shadow setup
  - Canvas textures for screens

---

**Last Updated**: 2024
**Maintainer**: Space Habitat Game Development Team
