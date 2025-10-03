// NASA Moon to Mars Architecture - Mission Constraints

export const MODULE_SPECS = {
  living: {
    name: 'Living Quarters',
    mass: 2.5, // metric tons
    volume: 12, // cubic meters
    category: 'crew',
    power: -0.8, // kW consumption
    lifeSupport: 0,
    tags: ['private', 'quiet', 'clean']
  },
  lab: {
    name: 'Research Lab',
    mass: 3.2,
    volume: 15,
    category: 'science',
    power: -2.5, // High power consumption for equipment
    lifeSupport: 0,
    tags: ['public', 'work', 'clean']
  },
  power: {
    name: 'Power Module',
    mass: 1.8,
    volume: 8,
    category: 'essential',
    power: 5.0, // kW generation (solar/nuclear)
    lifeSupport: 0,
    tags: ['utility', 'noisy']
  },
  greenhouse: {
    name: 'Greenhouse',
    mass: 2.0,
    volume: 20,
    category: 'life-support',
    power: -1.2, // kW for lighting and climate
    lifeSupport: 2, // Supports 2 crew with O2/food
    tags: ['public', 'clean', 'humid']
  },
  storage: {
    name: 'Storage',
    mass: 1.5,
    volume: 10,
    category: 'utility',
    power: -0.3,
    lifeSupport: 0,
    tags: ['utility', 'clean']
  },
  medical: {
    name: 'Medical Bay',
    mass: 2.8,
    volume: 14,
    category: 'essential',
    power: -1.8,
    lifeSupport: 0,
    tags: ['private', 'clean', 'quiet']
  },
  airlock: {
    name: 'Airlock',
    mass: 1.2,
    volume: 6,
    category: 'essential',
    power: -0.5,
    lifeSupport: 0,
    tags: ['utility', 'dirty', 'noisy'] // Suitport area
  }
};

// NASA Volume Requirements (cubic meters per crew member)
export const VOLUME_REQUIREMENTS = {
  short: 10, // 30 days - minimal space
  mid: 15, // 90-180 days - moderate space
  extended: 25 // 365+ days - extended comfort space
};

// NASA Mass Limits based on delivery systems
export const MASS_LIMITS = {
  lunar: 12, // metric tons - Lunar Lander capacity
  marsTransit: 26.4, // metric tons - Mars Transit Vehicle capacity
  marsSurface: 18 // metric tons - Mars Surface deployment
};

// Construction Type Multipliers (from NASA-CP-97-206241-Cohen.pdf)
export const CONSTRUCTION_MULTIPLIERS = {
  rigid: { mass: 1.0, volume: 1.0 },
  inflatable: { mass: 0.6, volume: 1.8 },
  isru: { mass: 0.3, volume: 2.0 }
};

// Required modules for mission types
export const MISSION_REQUIREMENTS = {
  lunar: {
    short: {
      essential: ['power', 'airlock'],
      crewQuarters: true,
      minPower: 1
    },
    mid: {
      essential: ['power', 'airlock', 'greenhouse'],
      crewQuarters: true,
      minPower: 1,
      minLifeSupport: 1
    },
    extended: {
      essential: ['power', 'airlock', 'greenhouse', 'medical'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 1
    }
  },
  marsTransit: {
    short: {
      essential: ['power', 'medical'],
      crewQuarters: true,
      minPower: 1,
      requiresRadiationShielding: true
    },
    mid: {
      essential: ['power', 'medical', 'storage'],
      crewQuarters: true,
      minPower: 2,
      requiresRadiationShielding: true
    },
    extended: {
      essential: ['power', 'medical', 'greenhouse', 'storage'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 1,
      requiresRadiationShielding: true,
      minStorage: 2
    }
  },
  marsSurface: {
    short: {
      essential: ['power', 'airlock', 'greenhouse'],
      crewQuarters: true,
      minPower: 1,
      minLifeSupport: 1
    },
    mid: {
      essential: ['power', 'airlock', 'greenhouse', 'lab'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 1,
      minScience: 1
    },
    extended: {
      essential: ['power', 'airlock', 'greenhouse', 'lab', 'medical'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 2,
      minScience: 1,
      encouragesISRU: true,
      minStorage: 1
    }
  }
};

export const validateMissionLayout = (modules, habitatStructure, missionParams) => {
  const { crewSize, destination, duration, constructionType } = missionParams;
  const results = {
    passed: false,
    checks: []
  };

  // Get construction type multipliers
  const constructionMultiplier = CONSTRUCTION_MULTIPLIERS[constructionType] || CONSTRUCTION_MULTIPLIERS.rigid;

  // 1. Calculate total mass with construction type multiplier
  const baseMass = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.mass || 0);
  }, 0);
  
  const totalMass = baseMass * constructionMultiplier.mass;

  const massLimit = MASS_LIMITS[destination];
  const massCheck = {
    name: 'Mass Limit',
    passed: totalMass <= massLimit,
    current: totalMass.toFixed(2),
    required: massLimit.toFixed(2),
    unit: 'metric tons',
    description: `Total habitat mass with ${constructionType} construction (${(constructionMultiplier.mass * 100).toFixed(0)}% of base)`
  };
  results.checks.push(massCheck);

  // 2. Calculate total pressurized volume with construction type multiplier
  const baseVolume = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.volume || 0);
  }, 0);
  
  const totalVolume = baseVolume * constructionMultiplier.volume;

  const requiredVolume = VOLUME_REQUIREMENTS[duration] * crewSize;
  const volumeCheck = {
    name: 'Habitation Volume',
    passed: totalVolume >= requiredVolume,
    current: totalVolume.toFixed(1),
    required: requiredVolume.toFixed(1),
    unit: 'm³',
    description: `Pressurized volume for ${crewSize} crew (${constructionType}: ${(constructionMultiplier.volume * 100).toFixed(0)}% efficiency)`
  };
  results.checks.push(volumeCheck);

  // 3. Check crew quarters
  const crewQuartersCount = modules.filter(m => m.type === 'living').length;
  const crewQuartersCheck = {
    name: 'Crew Quarters',
    passed: crewQuartersCount >= crewSize,
    current: crewQuartersCount,
    required: crewSize,
    unit: 'modules',
    description: 'Each crew member requires dedicated living quarters'
  };
  results.checks.push(crewQuartersCheck);

  // 4. Check essential modules based on mission profile
  const requirements = MISSION_REQUIREMENTS[destination][duration];
  
  // Power modules
  const powerCount = modules.filter(m => m.type === 'power').length;
  const powerCheck = {
    name: 'Power Generation',
    passed: powerCount >= (requirements.minPower || 1),
    current: powerCount,
    required: requirements.minPower || 1,
    unit: 'modules',
    description: 'Sufficient power modules for mission operations'
  };
  results.checks.push(powerCheck);

  // Life support (greenhouse)
  if (requirements.minLifeSupport) {
    const lifeSupportCount = modules.filter(m => m.type === 'greenhouse').length;
    const lifeSupportCheck = {
      name: 'Life Support Systems',
      passed: lifeSupportCount >= requirements.minLifeSupport,
      current: lifeSupportCount,
      required: requirements.minLifeSupport,
      unit: 'modules',
      description: 'Greenhouse modules for oxygen and food production'
    };
    results.checks.push(lifeSupportCheck);
  }

  // Medical bay
  if (requirements.essential.includes('medical')) {
    const medicalCount = modules.filter(m => m.type === 'medical').length;
    const medicalCheck = {
      name: 'Medical Facilities',
      passed: medicalCount >= 1,
      current: medicalCount,
      required: 1,
      unit: 'module',
      description: 'Medical bay required for long-duration missions'
    };
    results.checks.push(medicalCheck);
  }

  // Radiation Shielding (Mars Transit)
  if (requirements.requiresRadiationShielding) {
    const storageCount = modules.filter(m => m.type === 'storage').length;
    const radiationCheck = {
      name: 'Radiation Protection',
      passed: storageCount >= 2, // Storage modules can serve as shielding
      current: storageCount,
      required: 2,
      unit: 'modules',
      description: 'Storage modules provide radiation shielding for Mars transit'
    };
    results.checks.push(radiationCheck);
  }

  // Science Lab (Mars Surface)
  if (requirements.essential.includes('lab')) {
    const labCount = modules.filter(m => m.type === 'lab').length;
    const labCheck = {
      name: 'Science Laboratory',
      passed: labCount >= 1,
      current: labCount,
      required: 1,
      unit: 'module',
      description: 'Research laboratory for Mars surface operations'
    };
    results.checks.push(labCheck);
  }

  // ISRU Construction Requirement
  if (constructionType === 'isru') {
    const hasISRUModule = modules.some(m => m.type === 'lab' || m.type === 'storage');
    const isruCheck = {
      name: 'ISRU Construction',
      passed: hasISRUModule,
      current: hasISRUModule ? 1 : 0,
      required: 1,
      unit: 'module',
      description: 'ISRU construction requires Construction Rover or ISRU Plant (Lab/Storage)'
    };
    results.checks.push(isruCheck);
  }

  // Airlock
  if (requirements.essential.includes('airlock')) {
    const airlockCount = modules.filter(m => m.type === 'airlock').length;
    const airlockCheck = {
      name: 'EVA Access',
      passed: airlockCount >= 1,
      current: airlockCount,
      required: 1,
      unit: 'module',
      description: 'Airlock required for extravehicular activities'
    };
    results.checks.push(airlockCheck);
  }

  // Storage (for extended missions)
  if (requirements.minStorage) {
    const storageCount = modules.filter(m => m.type === 'storage').length;
    const storageCheck = {
      name: 'Storage Capacity',
      passed: storageCount >= requirements.minStorage,
      current: storageCount,
      required: requirements.minStorage,
      unit: 'modules',
      description: 'Storage modules for supplies and equipment'
    };
    results.checks.push(storageCheck);
  }

  // Science modules
  if (requirements.minScience) {
    const scienceCount = modules.filter(m => m.type === 'lab').length;
    const scienceCheck = {
      name: 'Research Capability',
      passed: scienceCount >= requirements.minScience,
      current: scienceCount,
      required: requirements.minScience,
      unit: 'modules',
      description: 'Laboratory modules for scientific research'
    };
    results.checks.push(scienceCheck);
  }

  // Radiation shielding (Mars missions)
  if (requirements.requiresShielding) {
    // For now, we'll check if habitat structure provides adequate volume for shielding
    const shieldingCheck = {
      name: 'Radiation Protection',
      passed: habitatStructure.shape === 'cylinder' && habitatStructure.height >= 8,
      current: habitatStructure.shape === 'cylinder' ? 'Adequate' : 'Insufficient',
      required: 'Cylinder ≥8m height',
      unit: '',
      description: 'Cylinder habitat with sufficient height provides better radiation shielding'
    };
    results.checks.push(shieldingCheck);
  }

  // Overall mission readiness
  results.passed = results.checks.every(check => check.passed);
  results.passedCount = results.checks.filter(check => check.passed).length;
  results.totalChecks = results.checks.length;

  return results;
};

// ============================================================================
// MISSION READINESS ANALYSIS ENGINE
// Comprehensive engineering analysis based on NASA documents
// ============================================================================

export const analyzeMissionReadiness = (modules, habitatStructure, missionParams) => {
  const { crewSize, destination, duration, constructionType } = missionParams;
  const constructionMultiplier = CONSTRUCTION_MULTIPLIERS[constructionType] || CONSTRUCTION_MULTIPLIERS.rigid;
  
  const report = {
    overall: {
      status: 'pending', // 'ready', 'warning', 'critical'
      readinessScore: 0
    },
    sections: {
      massBudget: null,
      powerAndLifeSupport: null,
      habitationAndZoning: null
    },
    recommendations: []
  };

  // ========== A. MASS BUDGET CHECK ==========
  const baseMass = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.mass || 0);
  }, 0);
  
  const totalMass = baseMass * constructionMultiplier.mass;
  const massLimit = MASS_LIMITS[destination];
  const massUtilization = (totalMass / massLimit) * 100;
  
  report.sections.massBudget = {
    passed: totalMass <= massLimit,
    totalMass: totalMass.toFixed(2),
    massLimit: massLimit.toFixed(2),
    utilization: massUtilization.toFixed(1),
    status: totalMass <= massLimit ? (massUtilization > 90 ? 'warning' : 'ready') : 'critical'
  };

  if (!report.sections.massBudget.passed) {
    report.recommendations.push({
      severity: 'critical',
      message: `Mass budget exceeded by ${(totalMass - massLimit).toFixed(2)}t. Remove modules or switch to lighter construction type.`
    });
  } else if (massUtilization > 90) {
    report.recommendations.push({
      severity: 'warning',
      message: `Mass utilization at ${massUtilization.toFixed(1)}%. Consider margin for safety.`
    });
  }

  // ========== B. POWER & LIFE SUPPORT CHECK ==========
  const totalPower = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.power || 0);
  }, 0);

  const totalLifeSupport = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.lifeSupport || 0);
  }, 0);

  const powerStatus = totalPower >= 0 ? 'surplus' : 'deficit';
  const lifeSupportStatus = totalLifeSupport >= crewSize ? 'adequate' : 'insufficient';

  report.sections.powerAndLifeSupport = {
    power: {
      passed: totalPower >= 0,
      total: totalPower.toFixed(2),
      status: powerStatus,
      statusText: powerStatus === 'surplus' ? `+${totalPower.toFixed(2)} kW (Surplus)` : `${totalPower.toFixed(2)} kW (Deficit)`
    },
    lifeSupport: {
      passed: totalLifeSupport >= crewSize,
      capacity: totalLifeSupport,
      required: crewSize,
      status: lifeSupportStatus,
      statusText: `${totalLifeSupport} / ${crewSize} Crew Supported`
    }
  };

  if (totalPower < 0) {
    report.recommendations.push({
      severity: 'critical',
      message: `Power deficit of ${Math.abs(totalPower).toFixed(2)} kW. Add more Power Modules or reduce power-hungry equipment.`
    });
  }

  if (totalLifeSupport < crewSize) {
    report.recommendations.push({
      severity: 'critical',
      message: `Life support insufficient. Add ${crewSize - totalLifeSupport} more Greenhouse modules to support crew.`
    });
  }

  // ========== C. HABITATION & ZONING CHECK ==========
  const zoningResults = {
    completeness: { passed: true, issues: [] },
    noiseSeparation: { passed: true, violations: [] },
    hygieneSeparation: { passed: true, violations: [] },
    privacy: { passed: true, issues: [] }
  };

  // C1. Completeness Check
  const requirements = MISSION_REQUIREMENTS[destination][duration];
  const essentialModules = requirements.essential || [];
  
  essentialModules.forEach(moduleType => {
    const count = modules.filter(m => m.type === moduleType).length;
    if (count === 0) {
      zoningResults.completeness.passed = false;
      zoningResults.completeness.issues.push(`Missing critical module: ${MODULE_SPECS[moduleType]?.name}`);
    }
  });

  // Check crew quarters
  const crewQuartersCount = modules.filter(m => m.type === 'living').length;
  if (crewQuartersCount < crewSize) {
    zoningResults.completeness.passed = false;
    zoningResults.completeness.issues.push(`Need ${crewSize - crewQuartersCount} more Crew Quarters`);
  }

  // C2. Noise Separation Check
  const noisyModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('noisy'));
  const quietModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('quiet'));
  
  const MIN_NOISE_DISTANCE = 3.0; // meters
  noisyModules.forEach(noisy => {
    quietModules.forEach(quiet => {
      const distance = calculateDistance(noisy.position, quiet.position);
      if (distance < MIN_NOISE_DISTANCE) {
        zoningResults.noiseSeparation.passed = false;
        zoningResults.noiseSeparation.violations.push(
          `${MODULE_SPECS[noisy.type].name} too close to ${MODULE_SPECS[quiet.type].name} (${distance.toFixed(1)}m < ${MIN_NOISE_DISTANCE}m)`
        );
      }
    });
  });

  // C3. Hygiene Separation Check
  const dirtyModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('dirty'));
  const cleanModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('clean') && m.type !== 'living');
  
  const MIN_HYGIENE_DISTANCE = 2.5; // meters
  dirtyModules.forEach(dirty => {
    cleanModules.forEach(clean => {
      const distance = calculateDistance(dirty.position, clean.position);
      if (distance < MIN_HYGIENE_DISTANCE) {
        zoningResults.hygieneSeparation.passed = false;
        zoningResults.hygieneSeparation.violations.push(
          `${MODULE_SPECS[dirty.type].name} too close to ${MODULE_SPECS[clean.type].name} (${distance.toFixed(1)}m)`
        );
      }
    });
  });

  // C4. Privacy Check (simplified - checks if private modules are isolated)
  const privateModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('private'));
  const publicModules = modules.filter(m => MODULE_SPECS[m.type]?.tags?.includes('public'));
  
  const MIN_PRIVACY_DISTANCE = 2.0; // meters
  if (privateModules.length > 0 && publicModules.length > 1) {
    privateModules.forEach(privateModule => {
      const nearbyPublic = publicModules.filter(pub => {
        const distance = calculateDistance(privateModule.position, pub.position);
        return distance < MIN_PRIVACY_DISTANCE;
      });
      
      if (nearbyPublic.length >= 2) {
        zoningResults.privacy.passed = false;
        zoningResults.privacy.issues.push(
          `${MODULE_SPECS[privateModule.type].name} surrounded by high-traffic areas`
        );
      }
    });
  }

  report.sections.habitationAndZoning = zoningResults;

  // Add recommendations for zoning issues
  if (!zoningResults.completeness.passed) {
    zoningResults.completeness.issues.forEach(issue => {
      report.recommendations.push({ severity: 'critical', message: issue });
    });
  }

  if (!zoningResults.noiseSeparation.passed) {
    zoningResults.noiseSeparation.violations.forEach(violation => {
      report.recommendations.push({ severity: 'warning', message: `Noise Violation: ${violation}` });
    });
  }

  if (!zoningResults.hygieneSeparation.passed) {
    zoningResults.hygieneSeparation.violations.forEach(violation => {
      report.recommendations.push({ severity: 'warning', message: `Hygiene Issue: ${violation}` });
    });
  }

  if (!zoningResults.privacy.passed) {
    zoningResults.privacy.issues.forEach(issue => {
      report.recommendations.push({ severity: 'info', message: `Privacy Concern: ${issue}` });
    });
  }

  // Calculate overall readiness score
  let score = 0;
  const checks = [
    report.sections.massBudget.passed,
    report.sections.powerAndLifeSupport.power.passed,
    report.sections.powerAndLifeSupport.lifeSupport.passed,
    zoningResults.completeness.passed,
    zoningResults.noiseSeparation.passed,
    zoningResults.hygieneSeparation.passed,
    zoningResults.privacy.passed
  ];
  
  score = (checks.filter(c => c).length / checks.length) * 100;
  report.overall.readinessScore = Math.round(score);
  
  if (score === 100) {
    report.overall.status = 'ready';
  } else if (score >= 70) {
    report.overall.status = 'warning';
  } else {
    report.overall.status = 'critical';
  }

  return report;
};

// Helper function to calculate distance between two positions
const calculateDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
