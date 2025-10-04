# Module Icons & 3D Models Reference Guide

This document shows the relationship between the UI icons and the actual 3D models that appear in the habitat.

## Module Types (11 Total)

### 1. 🛏️ Living Quarters (Sleep Pod)
- **Icon**: 🛏️ Bed emoji
- **3D Model**: Sleep pod (1.2×2.0×1.1m)
  - Rectangular pod walls (blue-gray)
  - Teal sleeping bag (cylinder)
  - 2 restraint straps (cross pattern)
  - Air vent (small dark cylinder)
  - Interior light (emissive yellow sphere)
- **Color**: #ff6644 (coral red)
- **Mass**: 2.5 tons | **Power**: -0.8 kW | **Volume**: 12 m³
- **Tags**: private, quiet, clean

---

### 2. 🔬 Science Lab (Workbench)
- **Icon**: 🔬 Microscope emoji
- **3D Model**: Workbench (1.5×0.9×0.8m)
  - Gray tabletop with 4 legs
  - Orange toolbox
  - Screwdriver (shaft + handle)
  - Diagnostic screen with "RESEARCH DATA" display
- **Color**: #44ff88 (bright green)
- **Mass**: 3.2 tons | **Power**: -2.5 kW | **Volume**: 15 m³
- **Tags**: public, work, clean

---

### 3. 🔌 Power Module (Battery + Solar)
- **Icon**: 🔌 Electric plug emoji
- **3D Model**: Battery unit (0.8×1.0×0.6m)
  - Yellow central battery box
  - 2 blue solar panels (folded at 45°)
  - Green status light (emissive)
- **Color**: #ffff44 (bright yellow)
- **Mass**: 1.8 tons | **Power**: +5.0 kW (generation) | **Volume**: 8 m³
- **Tags**: utility, noisy

---

### 4. 🌿 Greenhouse (Growing Racks)
- **Icon**: 🌿 Herb emoji
- **3D Model**: 3-level racks (1.2×1.5×0.6m)
  - Brown rack frame
  - 3 dark brown growing trays
  - 12 green cone plants (4 per level)
  - 3 pink LED grow lights (emissive)
- **Color**: #44ff44 (lime green)
- **Mass**: 2.0 tons | **Power**: -1.2 kW | **Volume**: 20 m³
- **Tags**: public, clean, humid

---

### 5. ⚕️ Medical Bay (Console + Bed)
- **Icon**: ⚕️ Medical symbol
- **3D Model**: Medical station (1.2×0.8×2.0m)
  - White medical console
  - Light gray examination bed
  - Vital signs monitor with HR/BP/SpO₂ data
- **Color**: #ff4488 (hot pink)
- **Mass**: 2.8 tons | **Power**: -1.8 kW | **Volume**: 14 m³
- **Tags**: private, clean, quiet

---

### 6. 🚪 Airlock (EVA Chamber)
- **Icon**: 🚪 Door emoji
- **3D Model**: Cylindrical chamber (Ø1.6×2.0m)
  - Blue-gray cylinder
  - Dark gray circular hatch
  - Yellow caution ring (torus)
  - 2 white EVA suits with transparent helmets
- **Color**: #4444ff (blue)
- **Mass**: 1.2 tons | **Power**: -0.5 kW | **Volume**: 6 m³
- **Tags**: utility, dirty, noisy

---

### 7. 📦 Storage (Cargo Rack)
- **Icon**: 📦 Package emoji
- **3D Model**: Rack system (1.2×1.8×0.6m)
  - Blue-gray metal frame
  - 9 brown cargo bags (3×3 grid)
  - Cylinders representing supply containers
- **Color**: #8844ff (purple)
- **Mass**: 1.5 tons | **Power**: -0.3 kW | **Volume**: 10 m³
- **Tags**: utility, clean

---

### 8. 🍽️ Galley (Kitchen/Dining)
- **Icon**: 🍽️ Fork and knife with plate emoji
- **3D Model**: Kitchen area (1.5×1.2×1.2m)
  - Light gray counter with sink
  - Dark gray microwave with blue window
  - 3 orange food storage lockers
  - Brown dining table with metal leg
- **Color**: #ff9944 (orange)
- **Mass**: 2.2 tons | **Power**: -1.5 kW | **Volume**: 12 m³
- **Tags**: public, noisy, humid

---

### 9. 🏋️ Exercise Module (Fitness)
- **Icon**: 🏋️ Weight lifter emoji
- **3D Model**: Treadmill (1.8m long)
  - Dark gray base platform
  - Red running belt
  - Silver handrails with vertical posts
  - Display console with green screen
  - 4 yellow resistance band attachment points
- **Color**: #44ffff (cyan)
- **Mass**: 1.8 tons | **Power**: -0.6 kW | **Volume**: 10 m³
- **Tags**: public, noisy, clean

---

### 10. 🖥️ Command Center (Control Station)
- **Icon**: 🖥️ Desktop computer emoji
- **3D Model**: Control console (1.6m wide)
  - Dark gray curved console desk
  - 3 monitors showing "SYSTEMS", "NAV DATA", "COMMS"
  - Black keyboard/control panel
  - White communication dish antenna
  - Blue operator chair with backrest
- **Color**: #ff44ff (magenta)
- **Mass**: 2.5 tons | **Power**: -2.0 kW | **Volume**: 14 m³
- **Tags**: public, work, clean

---

### 11. 🔧 Workshop (Repair Station)
- **Icon**: 🔧 Wrench emoji
- **3D Model**: Work area (1.6×1.2×0.8m)
  - Brown workbench with 4 black legs
  - Gray vise mounted on bench
  - Orange tool pegboard with 4 hanging tools
  - 3 green parts bins
  - Blue welding torch with orange tip
- **Color**: #ffaa44 (amber)
- **Mass**: 2.0 tons | **Power**: -1.0 kW | **Volume**: 12 m³
- **Tags**: utility, noisy, dirty

---

## Icon Design Philosophy

Each icon was chosen to:
1. **Instantly convey the module's function** (bed = sleeping, microscope = science)
2. **Match the 3D model's appearance** (🍽️ for dining area, 🔬 for lab equipment)
3. **Use universally recognized symbols** (medical cross, wrench for tools)
4. **Stand out visually** in the horizontal Module Builder bar

## Color Coding System

Colors are assigned based on module category:
- **Red/Pink tones** (#ff6644, #ff4488): Crew comfort (living, medical)
- **Green tones** (#44ff88, #44ff44): Life support & science (lab, greenhouse)
- **Yellow tones** (#ffff44, #ffaa44): Power & utilities (power, workshop)
- **Blue/Purple** (#4444ff, #8844ff): Infrastructure (airlock, storage)
- **Orange/Cyan** (#ff9944, #44ffff): Activity areas (galley, exercise)
- **Magenta** (#ff44ff): Mission critical (command center)

## 3D Model Details

All models are constructed using Three.js primitives:
- **BoxGeometry**: Walls, tables, boxes, consoles
- **CylinderGeometry**: Pipes, legs, tools, chambers
- **SphereGeometry**: Lights, helmet visors
- **TorusGeometry**: Rings, frames
- **ConeGeometry**: Plants, torch tips
- **PlaneGeometry**: Screens with canvas textures

### Material Properties
- **Metalness**: 0.1 (organic) to 0.8 (metal)
- **Roughness**: 0.2 (polished) to 0.9 (rough)
- **Emissive**: Used for lights, screens, indicators
- **Transparency**: Used for helmet visors, windows

### Interactive Features
- Each model has an **invisible bounding box** for drag detection
- Models move as **single rigid units** when dragged
- **Shadow casting/receiving** enabled for realistic lighting
- **Canvas textures** used for dynamic displays (vital signs, command screens)

## Engineering Integration

Each module contains engineering metadata:
- **Mass**: For launch vehicle capacity calculations
- **Power**: Generation (+) or consumption (-)
- **Life Support**: Oxygen/food production capacity
- **Volume**: Habitable space in cubic meters
- **Tags**: For zoning validation (noise, hygiene, privacy)

This data is used by the Mission Readiness Engine to validate habitat designs against NASA constraints.

---

## Usage in Game

1. **Module Builder Bar** (bottom of screen): Shows all 11 icons horizontally
2. **Click to Add**: Click any icon to add that module to the habitat
3. **Drag to Position**: Click and drag the 3D model to position it
4. **Collision Detection**: Models can't overlap or be placed outside habitat
5. **Mission Validation**: Run analysis to check if design meets NASA requirements

## Future Expansions

Potential additional modules:
- **🚿 Hygiene Module**: Shower/bathroom facilities
- **🛠️ 3D Printer**: Manufacturing and fabrication
- **🔭 Observatory**: Scientific instruments and viewing
- **📡 Communications**: Deep space antenna array
- **🧪 Chemistry Lab**: Sample analysis and experiments
- **🌐 Centrifuge**: Artificial gravity research
- **🔥 Furnace**: Metal processing and refining
- **📚 Library**: Data storage and education
- **🎮 Recreation**: Entertainment and morale

Each new module would follow the same pattern: descriptive icon → detailed 3D model → engineering specs.

---

**Last Updated**: October 2024
**Total Modules**: 11 types
**Total Components**: ~150 individual 3D objects across all models
