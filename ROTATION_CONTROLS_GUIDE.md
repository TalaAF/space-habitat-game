# Module Rotation System - User Guide

## Overview

The NASA Space Habitat Designer now features a comprehensive **360-degree rotation system** that allows you to freely rotate any module around all three axes (X, Y, Z). This enables precise orientation of modules for optimal habitat layout and functionality.

## How to Use

### 1. **Select a Module**

**Method 1: Drag to Select**
- Click and start dragging any module
- The module will be automatically selected
- A **green glowing box** will appear around the selected module

**Method 2: Click to Select** (when not in path analysis mode)
- Click directly on any module
- The module becomes selected with a green highlight

### 2. **Rotate the Module**

Once a module is selected, use keyboard controls to rotate it:

#### **Y-Axis Rotation (Spin/Turn)**
Most common rotation - turns the module left or right like a spinning top

- <kbd>Q</kbd> or <kbd>←</kbd> (Left Arrow): Rotate counter-clockwise (left)
- <kbd>E</kbd> or <kbd>→</kbd> (Right Arrow): Rotate clockwise (right)

**Use Case**: Orient airlocks, labs, or command centers to face specific directions

#### **X-Axis Rotation (Tilt)**
Tilts the module forward or backward

- <kbd>W</kbd> or <kbd>↑</kbd> (Up Arrow): Tilt forward
- <kbd>S</kbd> or <kbd>↓</kbd> (Down Arrow): Tilt backward

**Use Case**: Angle solar panels, adjust greenhouse orientation for optimal light

#### **Z-Axis Rotation (Roll)**
Rolls the module like an airplane banking

- <kbd>A</kbd>: Roll left
- <kbd>D</kbd>: Roll right

**Use Case**: Fine-tune module orientation, artistic layouts

### 3. **Deselect the Module**

- Press <kbd>ESC</kbd> key, OR
- Click on empty space (floor or walls)

The green selection highlight will disappear.

---

## Rotation Details

### Rotation Increment
- Each key press rotates the module by **15 degrees**
- 24 presses = full 360° rotation
- Precise enough for detailed positioning
- Fast enough for quick adjustments

### Rotation Axes Explained

```
        Y-Axis (Up/Down)
             ↑
             |
             |
    Z-Axis --+-- X-Axis
   (Depth)   |   (Width)
             |
```

- **Y-Axis** (Vertical): Spinning like a top - most useful
- **X-Axis** (Horizontal Width): Tilting forward/backward
- **Z-Axis** (Horizontal Depth): Rolling side to side

### Visual Feedback

**Selected Module:**
- Green glowing bounding box
- Pulsing effect (opacity varies)
- Always visible even behind other objects

**Rotation Controls Panel:**
- Appears in top-right when module is selected
- Shows all keyboard controls
- Green border indicates active rotation mode
- Automatically disappears when module is deselected

---

## Step-by-Step Examples

### Example 1: Rotating an Airlock to Face Outward

1. Add an airlock module to your habitat
2. Drag it to the edge of the habitat (it's selected automatically)
3. Press <kbd>Q</kbd> or <kbd>E</kbd> multiple times to spin it around
4. Position the EVA suit access facing the habitat exterior
5. Press <kbd>ESC</kbd> when done

### Example 2: Tilting Solar Panels on Power Module

1. Select your power module (click on it)
2. Press <kbd>W</kbd> several times to tilt it forward
3. Optimize the solar panel angle for sunlight exposure
4. Press <kbd>ESC</kbd> to deselect

### Example 3: Creating a Visually Interesting Layout

1. Select a greenhouse module
2. Press <kbd>E</kbd> 6 times (90° turn)
3. Select a lab module
4. Press <kbd>Q</kbd> 6 times (90° opposite turn)
5. Create symmetrical or asymmetrical designs

### Example 4: Orienting Command Center Monitors

1. Select the command center module
2. Use <kbd>Q</kbd>/<kbd>E</kbd> to face monitors toward crew quarters
3. Ensure operators have clear sight lines
4. Fine-tune with <kbd>A</kbd>/<kbd>D</kbd> roll adjustments

---

## Advanced Features

### Combining Rotations

You can rotate around multiple axes:

```
1. Press E (4x) → Rotate 60° right on Y-axis
2. Press W (2x) → Tilt 30° forward on X-axis
3. Press D (1x) → Roll 15° right on Z-axis
Result: Complex 3D orientation
```

### Rotation Persistence

- Rotations are **saved** with the module
- Moving the module preserves its rotation
- Mission validation uses rotated orientations
- Pathfinding accounts for rotated bounding boxes

### Selection During Drag

- Dragging a module **automatically selects** it
- You can rotate immediately after placing
- No need to click again

### Multi-Module Rotation

To rotate multiple modules:
1. Rotate first module → Deselect
2. Select second module → Rotate
3. Repeat for each module
4. Each module remembers its unique rotation

---

## UI Elements

### Rotation Controls Panel

Located: **Top-right corner**

**Contents:**
```
🔄 Rotate Module

Y-Axis (Spin):
Q or ← Left | E or → Right

X-Axis (Tilt):
W or ↑ Forward | S or ↓ Back

Z-Axis (Roll):
A Left | D Right

Deselect:
ESC or click elsewhere
```

**Appearance:**
- Dark blue background with blur effect
- Green glowing border
- Slides in from right when module selected
- Clear keyboard shortcuts in boxes

### Selection Highlight

- **Color**: Bright green (#00ff00)
- **Effect**: Pulsing opacity (0.3 to 0.5)
- **Shape**: Box matching module dimensions
- **Visibility**: Shows through walls and other modules

---

## Keyboard Controls Summary

| Key | Action | Axis | Degrees |
|-----|--------|------|---------|
| <kbd>Q</kbd> / <kbd>←</kbd> | Rotate Left | Y | -15° |
| <kbd>E</kbd> / <kbd>→</kbd> | Rotate Right | Y | +15° |
| <kbd>W</kbd> / <kbd>↑</kbd> | Tilt Forward | X | -15° |
| <kbd>S</kbd> / <kbd>↓</kbd> | Tilt Back | X | +15° |
| <kbd>A</kbd> | Roll Left | Z | -15° |
| <kbd>D</kbd> | Roll Right | Z | +15° |
| <kbd>ESC</kbd> | Deselect | - | - |

**Note**: Arrow keys provide alternative controls for Y and X axes only. Use WASD for full 3-axis control.

---

## Design Considerations

### Functional Rotations

**Airlocks:**
- Rotate to face exterior for EVA access
- Ensure door doesn't block pathways
- Point suits toward outer wall

**Power Modules:**
- Orient solar panels toward light source
- Angle battery access for maintenance

**Greenhouses:**
- Align racks for optimal grow light distribution
- Orient toward windows or light sources

**Command Centers:**
- Face monitors toward crew areas
- Optimize visibility from living quarters

**Labs:**
- Orient workbenches for workflow
- Position equipment for easy access

### Aesthetic Rotations

- Create visually interesting patterns
- Break up monotonous grid layouts
- Add organic feel to mechanical habitat
- Showcase 3D model details from different angles

---

## Technical Details

### Rotation System

- **Rotation Type**: Euler angles (X, Y, Z order)
- **Increment**: π/12 radians (15 degrees)
- **Range**: Full 360° on all axes
- **Smoothness**: Instant rotation per key press
- **Persistence**: Rotation values stored in module data

### Selection System

- **Method**: Raycasting against invisible bounding boxes
- **Priority**: Drag-to-select > Click-to-select
- **Highlight**: Pulsing green bounding box overlay
- **Deselection**: ESC key or click empty space

### Performance

- **Rendering**: Green highlight updated every frame
- **Impact**: Minimal (~0.1ms per frame)
- **Optimization**: Only selected module gets highlight
- **Compatibility**: Works with all 11 module types

---

## Troubleshooting

### Module Won't Rotate

**Problem**: Pressing keys doesn't rotate
**Solution**: 
- Ensure module is selected (green glow visible)
- Check rotation controls panel is showing
- Try clicking module again to re-select

### Can't Deselect Module

**Problem**: Green glow won't go away
**Solution**:
- Press <kbd>ESC</kbd> key
- Click on habitat floor
- Click on habitat walls
- Refresh browser if stuck

### Rotation Controls Not Showing

**Problem**: No UI panel appears
**Solution**:
- Ensure you're not in Path Analysis mode
- Check that module is truly selected
- Try deselecting and re-selecting

### Module Rotates Too Fast/Slow

**Current**: 15° per key press
**To Change**: Edit `rotationStep` in Scene.jsx:
```javascript
const rotationStep = Math.PI / 12; // 15 degrees
// Change to Math.PI / 24 for 7.5° (slower)
// Change to Math.PI / 8 for 22.5° (faster)
```

---

## Best Practices

### 1. Start with Y-Axis Rotation
- Most intuitive and commonly used
- Use Q/E or arrow keys
- Orient modules like spinning a compass

### 2. Add Tilt for Realism
- Use X-axis sparingly
- Slight tilts (15-30°) look natural
- Too much tilt can look unstable

### 3. Avoid Excessive Z-Axis Roll
- Roll is the least intuitive
- Use only for artistic effects
- Most modules look best level

### 4. Select → Rotate → Deselect → Move On
- Keep workflow clean
- Don't leave modules selected
- Prevents accidental rotation

### 5. Save Often
- Rotations are saved with habitat design
- Export/save after major rotation changes
- Test mission validation after rotating

---

## Future Enhancements

Potential additions:
- **Numerical input**: Type exact rotation degrees
- **Rotation presets**: 45°, 90°, 180° quick buttons
- **Snap to angles**: Lock to 0°, 90°, 180°, 270°
- **Mouse rotation**: Click and drag to rotate
- **Rotation history**: Undo/redo rotations
- **Multi-select**: Rotate multiple modules together
- **Copy rotation**: Apply one module's rotation to others
- **Reset rotation**: Return to default 0° orientation

---

## Summary

The rotation system provides:
✅ Full 360° rotation on all 3 axes
✅ Precise 15° increments
✅ Visual selection feedback
✅ Clear keyboard controls
✅ Intuitive UI panel
✅ Works with all 11 module types
✅ Preserves rotations when moving
✅ Compatible with pathfinding and validation

**Key Shortcuts:**
- **Q/E**: Spin left/right (most common)
- **W/S**: Tilt forward/back
- **A/D**: Roll left/right
- **ESC**: Deselect

Enjoy creating uniquely oriented habitat designs! 🚀

---

**Last Updated**: October 2024
**Feature**: Module 360° Rotation System
**Keyboard**: QWEASD + Arrow Keys + ESC
