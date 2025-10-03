# Mission Readiness Analysis Engine - Implementation Guide

## Overview

The Mission Readiness Analysis Engine is a comprehensive data-driven system that evaluates habitat designs against real-world NASA engineering constraints derived from official documents (ASCEND.pdf, paper.pdf, IEEE_TH-Design, NASA-CP-97-206241-Cohen.pdf).

## Architecture

### 1. Enhanced Module Specifications

Every module now includes critical engineering data:

```javascript
{
  mass: 2.5,           // metric tons
  volume: 12,          // cubic meters  
  power: -0.8,         // kW (negative = consumption, positive = generation)
  lifeSupport: 0,      // Number of crew members supported
  tags: ['private', 'quiet', 'clean']  // Zoning classifications
}
```

### Tag System

**Privacy Tags:**
- `private`: Living quarters, medical bay
- `public`: Labs, greenhouses, common areas

**Noise Tags:**
- `noisy`: Power modules, airlocks, exercise areas
- `quiet`: Living quarters, medical facilities

**Hygiene Tags:**
- `clean`: Living areas, labs, medical
- `dirty`: Airlocks (suitports), workshops
- `humid`: Greenhouses

## Analysis Sections

### A. Mass Budget Check

**NASA Reference:** ASCEND.pdf, IEEE_TH-Design

**Constraints:**
- Lunar Surface: ≤ 12,000 kg (12 metric tons)
- Mars Transit: ≤ 26,400 kg (26.4 metric tons)  
- Mars Surface: ≤ 18,000 kg (18 metric tons)

**Implementation:**
```javascript
const baseMass = modules.reduce((sum, m) => sum + MODULE_SPECS[m.type].mass, 0);
const totalMass = baseMass * constructionMultiplier.mass;
const passed = totalMass <= massLimit;
```

**Status Levels:**
- ✅ **Ready**: Mass ≤ 90% of limit
- ⚠️ **Warning**: Mass 90-100% of limit
- ❌ **Critical**: Mass > 100% of limit

**User Feedback:**
- Mass exceeded: "Mass budget exceeded by X.Xt. Remove modules or switch to lighter construction type."
- High utilization: "Mass utilization at X.X%. Consider margin for safety."

### B. Power & Life Support Check

**NASA Reference:** paper.pdf Section 3.2 (Power Systems), Section 4.1 (ECLSS)

**Power Budget:**
```javascript
totalPower = Σ(module.power)
// Must be ≥ 0 (surplus or balanced)
```

**Life Support Capacity:**
```javascript
totalLifeSupport = Σ(module.lifeSupport)  
// Must be ≥ crewSize
```

**Module Power Values:**
- Power Module: +5.0 kW (generation)
- Lab: -2.5 kW (high equipment usage)
- Greenhouse: -1.2 kW (lighting/climate)
- Living: -0.8 kW (personal systems)
- Medical: -1.8 kW (equipment)
- Airlock: -0.5 kW (pressurization)
- Storage: -0.3 kW (minimal)

**Life Support Values:**
- Greenhouse: +2 crew (O₂ generation + food)
- Other modules: 0 (consume only)

**Status Display:**
- Power Surplus: "+X.XX kW (Surplus)" ✅
- Power Deficit: "-X.XX kW (Deficit)" ❌
- Life Support: "X / Y Crew Supported"

**User Feedback:**
- Power deficit: "Power deficit of X.XX kW. Add more Power Modules or reduce power-hungry equipment."
- Life support shortage: "Life support insufficient. Add X more Greenhouse modules to support crew."

### C. Habitation & Zoning Check

**NASA Reference:** paper.pdf Section 5 (Habitation Quality), Appendix B (Zoning Guidelines)

#### C1. Completeness Check

Verifies all essential modules are present based on mission profile.

**Essential Modules by Mission:**

**Lunar Short:**
- Power Module (×1+)
- Airlock (×1+)
- Living Quarters (×crewSize)

**Lunar Extended:**
- Power Module (×2+)
- Airlock (×1+)
- Greenhouse (×1+)
- Medical Bay (×1+)
- Living Quarters (×crewSize)

**Mars Transit Extended:**
- Power Module (×2+)
- Medical Bay (×1+)
- Greenhouse (×1+)
- Storage (×2+ for radiation shielding)
- Living Quarters (×crewSize)

**Mars Surface Extended:**
- Power Module (×2+)
- Airlock (×1+)
- Greenhouse (×2+ for ISRU)
- Lab (×1+ for science)
- Medical Bay (×1+)
- Living Quarters (×crewSize)

**User Feedback:**
- Missing module: "Missing critical module: [Module Name]"
- Insufficient quarters: "Need X more Crew Quarters"

#### C2. Noise Separation Check

**NASA Reference:** paper.pdf Section 5.2 (Acoustic Environment)

**Constraint:** Minimum 3.0m separation between noisy and quiet modules

**Implementation:**
```javascript
const MIN_NOISE_DISTANCE = 3.0; // meters
noisyModules.forEach(noisy => {
  quietModules.forEach(quiet => {
    const distance = calculateDistance(noisy.position, quiet.position);
    if (distance < MIN_NOISE_DISTANCE) {
      violations.push(...);
    }
  });
});
```

**User Feedback:**
"Noise Violation: [Noisy Module] too close to [Quiet Module] (X.Xm < 3.0m)"

**Recommendations:**
- Move noisy modules (Power, Airlock) to separate level/zone
- Place buffer modules (Storage) between noisy and quiet areas
- Use habitat geometry to create physical separation

#### C3. Hygiene Separation Check

**NASA Reference:** paper.pdf Section 5.3 (Contamination Control)

**Constraint:** Minimum 2.5m separation between dirty and clean modules

**Implementation:**
```javascript
const MIN_HYGIENE_DISTANCE = 2.5; // meters
dirtyModules.forEach(dirty => {
  cleanModules.forEach(clean => {
    const distance = calculateDistance(dirty.position, clean.position);
    if (distance < MIN_HYGIENE_DISTANCE) {
      violations.push(...);
    }
  });
});
```

**User Feedback:**
"Hygiene Issue: [Dirty Module] too close to [Clean Module] (X.Xm)"

**Recommendations:**
- Isolate Airlocks (suitports) from living/medical areas
- Create dedicated "dirty" zone for EVA operations
- Position Storage modules as buffers

#### C4. Privacy Check

**NASA Reference:** paper.pdf Section 5.4 (Crew Quarters Design)

**Constraint:** Private modules should not be surrounded by high-traffic public areas

**Implementation:**
```javascript
const MIN_PRIVACY_DISTANCE = 2.0; // meters
privateModules.forEach(privateModule => {
  const nearbyPublic = publicModules.filter(pub => {
    return calculateDistance(privateModule.position, pub.position) < MIN_PRIVACY_DISTANCE;
  });
  
  if (nearbyPublic.length >= 2) {
    issues.push("Module surrounded by high-traffic areas");
  }
});
```

**User Feedback:**
"Privacy Concern: [Private Module] surrounded by high-traffic areas"

**Recommendations:**
- Position Living Quarters away from Labs and Greenhouses
- Use dead-end layouts for private areas
- Create dedicated "quiet zone" for crew rest

## Readiness Score Calculation

```javascript
const checks = [
  massBudget.passed,
  power.passed,
  lifeSupport.passed,
  completeness.passed,
  noiseSeparation.passed,
  hygieneSeparation.passed,
  privacy.passed
];

readinessScore = (checksPass ed / totalChecks) * 100;
```

**Overall Status:**
- **Ready** (100%): All checks passed ✅
- **Warning** (70-99%): Functional with concerns ⚠️
- **Critical** (<70%): Major issues detected ❌

## Mission Report UI

### Report Structure

```
┌─────────────────────────────────────────┐
│ 🚀 Mission Readiness Report             │
├─────────────────────────────────────────┤
│ [Status Icon] Mission Readiness Score   │
│              85%                         │
│    Habitat Functional with Concerns     │
├─────────────────────────────────────────┤
│ ✅ Mass Budget                          │
│    11.5 / 12.0 t  [████████░░] 95.8%   │
├─────────────────────────────────────────┤
│ ✅ Power & Life Support                 │
│    Power Status: +1.5 kW (Surplus)      │
│    Life Support: 4 / 4 Crew Supported   │
├─────────────────────────────────────────┤
│ ⚠️ Layout & Zoning                      │
│    ✓ Module Completeness                │
│    ✗ Noise Separation                   │
│    ✓ Hygiene Separation                 │
│    ✓ Privacy Standards                  │
├─────────────────────────────────────────┤
│ 📋 Action Items                         │
│ 🚨 Power deficit of 1.2 kW...          │
│ ⚠️ Noise Violation: Power Module...    │
│ ℹ️ Privacy Concern: Living Quarters... │
└─────────────────────────────────────────┘
```

### Color Coding

- **Green** (`#44ff88`): Passed / Ready
- **Orange** (`#ffaa44`): Warning / Caution
- **Red** (`#ff4444`): Critical / Failed
- **Blue** (`#4488ff`): Info / Suggestion

## Testing Scenarios

### Scenario 1: Minimal Lunar Base (Should Pass)
**Mission:** Lunar Surface, Short Duration, 2 Crew, Rigid Construction

**Modules:**
- Living Quarters (×2)
- Power Module (×1)
- Airlock (×1)
- Storage (×1)

**Expected Results:**
- Mass: ~8.2t / 12t ✅
- Power: +5.0 - 2.1 = +2.9 kW ✅
- Life Support: 0 / 2 ❌ (needs Greenhouse)
- Completeness: ✅

### Scenario 2: Mars Transit Habitat (Should Warn)
**Mission:** Mars Transit, Extended Duration, 4 Crew, Inflatable Construction

**Modules:**
- Living Quarters (×4)
- Power Module (×2)
- Medical Bay (×1)
- Greenhouse (×2)
- Storage (×2)
- Lab (×1)

**Expected Results:**
- Mass: (10.0 + 3.6 + 2.8 + 4.0 + 3.0 + 3.2) × 0.6 = 15.96t / 26.4t ✅
- Power: +10.0 - 7.6 = +2.4 kW ✅
- Life Support: 4 / 4 ✅
- Zoning: Check distances ⚠️

### Scenario 3: Overloaded Lunar Base (Should Fail)
**Mission:** Lunar Surface, Extended Duration, 6 Crew, Rigid Construction

**Modules:**
- Living Quarters (×6)
- Power Module (×3)
- Lab (×2)
- Greenhouse (×2)
- Medical Bay (×2)

**Expected Results:**
- Mass: 15.0 + 5.4 + 6.4 + 4.0 + 5.6 = 36.4t / 12t ❌
- Power: +15.0 - 13.2 = +1.8 kW ✅
- Life Support: 4 / 6 ❌

## Usage Example

```javascript
import { analyzeMissionReadiness } from './utils/missionValidation';

const handleValidate = () => {
  const report = analyzeMissionReadiness(modules, habitatStructure, missionParams);
  
  console.log('Readiness Score:', report.overall.readinessScore);
  console.log('Status:', report.overall.status);
  console.log('Mass:', report.sections.massBudget);
  console.log('Recommendations:', report.recommendations);
  
  setMissionReport(report);
};
```

## Future Enhancements

1. **Pathfinding Integration**: Check if private modules are on primary crew paths
2. **Thermal Analysis**: Module placement for thermal efficiency
3. **Radiation Mapping**: 3D radiation dose visualization
4. **Launch Vehicle Packing**: Verify modules fit in payload fairing
5. **Construction Sequence**: Validate assembly order feasibility
6. **Maintenance Access**: Ensure all modules are reachable for repairs

## References

- NASA ASCEND Study: Lunar mass delivery constraints
- IEEE TH-Design: Mars Transit habitat specifications
- NASA-CP-97-206241-Cohen.pdf: ISRU construction multipliers
- paper.pdf: Habitation quality metrics and zoning guidelines
