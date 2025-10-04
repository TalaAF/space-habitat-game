# Per-Floor Shape Selection System

## Overview
Each floor in your habitat can now have its own unique shape! Mix and match cylinder, dome, and square floors to create innovative multi-level space habitat designs.

## Available Floor Shapes

### 1. **Cylinder** ⬛
- Classic cylindrical module design
- Uniform radius at all heights
- Best for: Standard living quarters, labs
- NASA Heritage: ISS modules, Skylab

### 2. **Dome** ⬢
- Hemispherical dome shape
- Curved ceiling provides more headroom at center
- Best for: Observation decks, gathering areas, greenhouses
- NASA Heritage: Lunar habitat concepts

### 3. **Square** ▢
- Rectangular box shape
- Flat walls and ceiling
- Best for: Storage, workshops, maximizing floor space
- NASA Heritage: Gateway modules, ISS cargo modules

## How to Use

### Setting Floor Shapes

1. **Add Multiple Floors**:
   - Open Design Panel (right side)
   - Set "Number of Floors" to 2 or more
   - Floor Selector appears on left side

2. **Select Floor to Edit**:
   - Click floor number button (1, 2, 3, etc.)
   - Current floor highlights in blue

3. **Choose Floor Shape**:
   - In Floor Selector, see "Floor X Shape:" section
   - Click shape button: Cylinder, Dome, or Square
   - Shape immediately updates in 3D view

4. **Repeat for Each Floor**:
   - Switch to different floor
   - Select different shape
   - Build unique multi-level design!

## Design Examples

### Example 1: Research Station
```
Floor 3: Dome (Observation deck)
Floor 2: Cylinder (Living quarters)
Floor 1: Square (Storage & workshops)
```

### Example 2: Lunar Outpost
```
Floor 4: Dome (Communications & observation)
Floor 3: Cylinder (Command center)
Floor 2: Cylinder (Crew quarters)
Floor 1: Square (Equipment & airlocks)
```

### Example 3: Mars Base
```
Floor 5: Dome (Greenhouse)
Floor 4: Cylinder (Medical & science labs)
Floor 3: Cylinder (Living quarters)
Floor 2: Square (Storage)
Floor 1: Square (Vehicle bay & airlocks)
```

## Visual Feedback

### Active Floor
- **Shell**: 30% opacity, colored blue
- **Floor mesh**: 100% opacity, dark gray
- **Grid**: Visible
- **Modules**: Full brightness (100%)

### Inactive Floors
- **Shell**: 10% opacity, barely visible
- **Floor mesh**: 30% opacity
- **Grid**: Hidden
- **Modules**: Dimmed (20%) for context

### Shape Indicators
- **Cylinder button**: ⬛ icon
- **Dome button**: ⬢ icon
- **Square button**: ▢ icon
- **Active shape**: Blue glow, highlighted border

## Technical Details

### Floor Shape Data Structure
```javascript
habitatStructure: {
  floors: 3,
  floorHeight: 3,
  floorShapes: ['square', 'cylinder', 'dome'],  // One per floor
  radius: 5,
  height: 9  // Total height (3 floors × 3m each)
}
```

### Individual Floor Shells
Each floor gets its own 3D shell geometry:
- **Cylinder**: `CylinderGeometry(radius, radius, floorHeight, 32)`
- **Dome**: `SphereGeometry(radius, 32, 16)` (hemisphere only)
- **Square**: `BoxGeometry(radius * 2, floorHeight, radius * 2)`

### Floor Mesh Geometry
- **Cylinder/Dome**: `CircleGeometry(radius, 32)`
- **Square**: `PlaneGeometry(radius * 2, radius * 2)`

### Module Placement
- Modules placed based on floor shape
- Cylinder/Dome: Radial constraint (distance from center)
- Square: Rectangular bounds constraint
- All shapes: Same Y-height per floor

## Design Considerations

### Structural Realism
- **Cylinder**: Optimal pressure vessel, uniform stress distribution
- **Dome**: Excellent pressure distribution, lighter weight
- **Square**: Less efficient pressurization, requires reinforcement

### Space Efficiency
- **Cylinder**: 78.5% floor area usage (πr²)
- **Dome**: 78.5% at base, decreasing at top
- **Square**: 100% floor area usage (4r²)

### Habitat Volume
Per floor with radius = 5m, height = 3m:
- **Cylinder**: 235.6 m³ (π × 5² × 3)
- **Dome**: 261.8 m³ (⅔ × π × 5³)
- **Square**: 300 m³ (10 × 10 × 3)

## Construction Types & Shapes

### Rigid Modules
- **Best with**: Cylinder (traditional pressure vessel)
- **Also works**: Square (ISS-style modules)
- **Challenging**: Dome (complex sealing)

### Inflatable Modules
- **Best with**: Cylinder, Dome (natural inflation shape)
- **Challenging**: Square (requires internal frames)

### ISRU (In-Situ Resource Utilization)
- **Best with**: Dome (regolith covering)
- **Also works**: Square (buried modules)
- **Less common**: Cylinder (harder to bury)

## User Interface

### Floor Selector Panel
- **Location**: Left side, below Rotation Controls
- **Shows**: Floor level buttons + Shape selector
- **Updates**: Real-time 3D preview

### Shape Selector Section
- **Title**: "Floor X Shape:"
- **3 Buttons**: Cylinder, Dome, Square
- **Active indicator**: Blue glow
- **Per-floor**: Changes with floor selection

## Performance Notes

- Each floor renders independently
- Shell opacity changes are efficient (material property)
- No geometry regeneration when switching floors
- Grid visibility toggle reduces draw calls

## Future Enhancements

1. **Custom Shapes**: Hexagonal, octagonal floors
2. **Tapered Shapes**: Cone-shaped levels
3. **Mixed Geometry**: Partial dome over cylinder
4. **Shape Presets**: Quick templates (ISS-style, Lunar base, etc.)
5. **Shape Constraints**: Require certain shapes for bottom/top floors
6. **Structural Analysis**: Pressure stress visualization per shape

## Troubleshooting

**Problem**: Shape button not responding
- **Solution**: Make sure you've selected the floor first (floor number button)

**Problem**: Shape looks wrong in 3D
- **Solution**: Switch to that floor to see it clearly (inactive floors are dimmed)

**Problem**: Can't place modules near edges on square floor
- **Solution**: Square floors use rectangular bounds, try closer to center

**Problem**: Dome floor has less space at edges
- **Solution**: Dome shape naturally has less headroom at edges - place tall modules near center

**Problem**: All floors have same shape
- **Solution**: Select each floor individually and change its shape separately

## Design Tips

1. **Bottom Heavy**: Use square floors at bottom for maximum storage/equipment space
2. **Top Light**: Use domes at top for observation and natural light
3. **Middle Standard**: Use cylinders in middle for efficient living quarters
4. **Mix Thoughtfully**: Consider crew movement between different shaped floors
5. **Visual Variety**: Different shapes make the habitat more interesting and functional
6. **Structural Logic**: Stack heavier/stronger shapes (cylinder) below lighter ones (dome)

## NASA-Inspired Design Patterns

### ISS-Style Stack
```
All floors: Cylinder
(Traditional modular station)
```

### Lunar Gateway-Style
```
Top: Dome (hab module)
Middle: Cylinder (logistics)
Bottom: Square (power/propulsion)
```

### Mars Direct Habitat
```
Top: Dome (greenhouse)
Middle: Cylinder (living)
Bottom: Square (equipment/ISRU)
```

### Deep Space Habitat
```
All floors: Cylinder with top Dome
(Spin gravity with observation)
```

Enjoy creating innovative multi-shaped habitats! 🏗️🚀
