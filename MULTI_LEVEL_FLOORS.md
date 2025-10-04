# Multi-Level Floor System

## Overview
The habitat now supports multiple floors (levels), allowing vertical construction of up to 5 floors. Each floor is independently accessible and can contain its own set of modules.

## Features

### 1. Floor Configuration
- **Number of Floors**: 1-5 floors (configurable via slider in Habitat Structure panel)
- **Floor Height**: 2.5-5.0 meters per floor (adjustable)
- **Total Height**: Automatically calculated as `floors × floorHeight`

### 2. Floor Selection UI
A new **Floor Selector** panel appears when you have multiple floors:
- Located at **top-right** of the screen (next to Design Panel)
- Shows numbered buttons for each floor (1, 2, 3, etc.)
- Displays current floor indicator
- Only visible when `floors > 1`

### 3. Visual Feedback
When switching floors:
- **Active Floor**: Full opacity (100%), grid visible, bright floor color
- **Inactive Floors**: Dimmed opacity (30%), grid hidden
- **Modules on Active Floor**: Full visibility (100%)
- **Modules on Other Floors**: Semi-transparent (20%) for context

### 4. Floor Labels
Each floor displays a labeled sprite showing:
- "Floor 1", "Floor 2", etc.
- Positioned at the edge of the habitat (radius - 1m)
- Blue badge with white text

## Usage

### Building on Multiple Floors

1. **Set Number of Floors**:
   - Open the Design Panel (right side)
   - Use "Number of Floors" slider (1-5)
   - Adjust "Floor Height" if needed (2.5-5m)
   - Total height updates automatically

2. **Select Active Floor**:
   - Click on the Floor Selector button (top-right)
   - Choose the floor you want to build on
   - Current floor highlights in blue

3. **Add Modules**:
   - Select a module from the Module Bar (bottom)
   - Click to place it on the currently selected floor
   - Module automatically positions at correct Y-height
   - Module remembers its floor assignment

4. **Switch Between Floors**:
   - Click different floor buttons to navigate levels
   - Inactive floors become semi-transparent
   - You can still see all floors for context

### Module Management

**Rotation & Deletion**: Works the same on all floors
- Select module (shows green pulsing box)
- Rotate with Q/W/E/A/S/D or arrow keys
- Delete with Delete/Backspace keys

**Drag & Drop**: Modules stay on their assigned floor
- Drag modules horizontally (X/Z plane)
- Y-position locked to floor level
- Cannot drag between floors (must delete and re-add)

## Technical Details

### Data Structure

**Module Object**:
```javascript
{
  id: 123456789,
  type: 'living',
  position: { x: 2, y: 3.5, z: -1 },  // Y based on floor
  floor: 1,  // Floor index (0-based)
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1
}
```

**Habitat Structure**:
```javascript
{
  shape: 'cylinder',
  radius: 5,
  height: 12,      // Total height (calculated)
  floors: 4,       // Number of floors
  floorHeight: 3   // Height per floor in meters
}
```

### Floor Height Calculation
```
Floor 0 (Ground): y = 0.5m
Floor 1: y = 3.5m  (1 × 3 + 0.5)
Floor 2: y = 6.5m  (2 × 3 + 0.5)
Floor 3: y = 9.5m  (3 × 3 + 0.5)
```

### Scene Rendering
- Each floor gets its own CircleGeometry mesh
- Each floor gets its own GridHelper
- Floor materials adjust opacity based on `currentFloor`
- Module opacity updates via traverse() in useEffect

## Design Considerations

### NASA Standards
- **Minimum Floor Height**: 2.5m (allows 2.13m clearance + equipment)
- **Maximum Floor Height**: 5.0m (allows tall equipment and open spaces)
- **Typical Floor Height**: 3.0m (standard ISS module height)

### Vertical Circulation
Future enhancements could include:
- Ladder modules connecting floors
- Elevator shafts for cargo
- Vertical clearance validation
- Inter-floor pathfinding

## User Experience

### Visual Clarity
- **Active floor** is always fully visible
- **Other floors** remain visible at 30% opacity for spatial awareness
- **Grids** only show on active floor to reduce clutter
- **Floor labels** always visible for navigation

### Module Placement
- Modules automatically placed at correct floor height
- No need to manually adjust Y-coordinate
- Floor assignment persists with module
- Cannot accidentally place module on wrong floor

### Performance
- All floors render simultaneously (no culling)
- Opacity changes handled by Three.js material system
- Efficient traverse() operations for batch updates
- Grid visibility toggle reduces draw calls

## Future Enhancements

1. **Floor Templates**: Pre-designed floor layouts
2. **Floor Copying**: Duplicate entire floor layout
3. **Vertical Modules**: Multi-floor modules (airlocks, shafts)
4. **Floor Groups**: Name and color-code floors
5. **Vertical Path Analysis**: Check clearance between floors
6. **Cross-Floor View**: See multiple floors simultaneously with transparency slider

## Keyboard Shortcuts

- **Floor Navigation**: Use Floor Selector UI (no keyboard shortcuts yet)
- **Module Operations**: Same as before (Q/W/E/A/S/D for rotation, Delete/Backspace for deletion)

## Troubleshooting

**Problem**: Modules not appearing
- **Solution**: Check you're on the correct floor (use Floor Selector)

**Problem**: Can't see other floor modules
- **Solution**: They're at 20% opacity - increase if you look carefully

**Problem**: Grid not showing
- **Solution**: Grids only visible on active floor

**Problem**: Module won't delete
- **Solution**: Must be on same floor as module to select and delete it

**Problem**: Total height too tall
- **Solution**: Reduce number of floors or floor height in Habitat Structure panel
