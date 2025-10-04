// NASA Moon to Mars Architecture - Mission Constraints

export const MODULE_SPECS = {
  living: {
    name: 'Sleep Pod',
    emoji: '🛏',
    mass: 2.5, // metric tons
    volume: 12, // cubic meters
    category: 'crew',
    power: -0.8, // kW consumption
    lifeSupport: 0,
    tags: ['private', 'quiet', 'clean'],
    qualities: {
      privacy: { required: true, description: 'Acoustic and visual separation from rest of habitat' },
      lighting: { required: true, description: 'Adjustable circadian lighting for sleep cycle regulation' },
      ventilation: { required: true, description: 'Personal ventilation to prevent CO2 buildup' },
      storage: { required: true, description: 'Dedicated personal stowage space' }
    },
    adjacencyPrefs: {
      avoid: ['exercise', 'workshop', 'galley'],
      prefer: ['medical']
    }
  },
  lab: {
    name: 'Laboratory',
    emoji: '🔬',
    mass: 3.2,
    volume: 15,
    category: 'science',
    power: -2.5, // High power consumption for equipment
    lifeSupport: 0,
    tags: ['public', 'work', 'clean'],
    qualities: {
      versatility: { required: true, description: 'Durable workbench with multiple configurations' },
      powerData: { required: true, description: 'Multiple power and data ports for equipment' },
      lighting: { required: true, description: 'High-quality lighting for detailed work' },
      containment: { required: true, description: 'Glovebox for handling experiments and preventing contamination' }
    },
    adjacencyPrefs: {
      prefer: ['command', 'storage'],
      avoid: ['exercise', 'workshop']
    }
  },
  power: {
    name: 'Power System',
    emoji: '🔋',
    mass: 1.8,
    volume: 8,
    category: 'essential',
    power: 5.0, // kW generation (solar/nuclear)
    lifeSupport: 0,
    tags: ['utility', 'noisy'],
    qualities: {
      reliability: { required: true, description: 'Robust system with built-in redundancy' },
      accessibility: { required: true, description: 'Components accessible for maintenance without EVA' },
      batteryAccess: { required: true, description: 'Battery systems easily reachable for servicing' },
      converterAccess: { required: true, description: 'Power converters accessible for repair' }
    },
    adjacencyPrefs: {
      avoid: ['living', 'medical'],
      prefer: ['workshop', 'storage']
    }
  },
  greenhouse: {
    name: 'Greenhouse',
    emoji: '🌱',
    mass: 2.0,
    volume: 20,
    category: 'life-support',
    power: -1.2, // kW for lighting and climate
    lifeSupport: 2, // Supports 2 crew with O2/food
    tags: ['public', 'clean', 'humid'],
    qualities: {
      lighting: { required: true, description: 'Full-spectrum lighting for plant growth' },
      environmentControl: { required: true, description: 'Precise temperature and humidity control' },
      atmosphereControl: { required: true, description: 'Controlled atmospheric composition' },
      waterIntegration: { required: true, description: 'Integration with water recycling system' }
    },
    adjacencyPrefs: {
      prefer: ['galley', 'storage'],
      avoid: ['workshop', 'airlock']
    }
  },
  medical: {
    name: 'Medical Bay',
    emoji: '⚕',
    mass: 2.8,
    volume: 14,
    category: 'essential',
    power: -1.8,
    lifeSupport: 0,
    tags: ['private', 'clean', 'quiet'],
    qualities: {
      accessibility: { required: true, description: 'Easy transport access for injured crew members' },
      sterility: { required: true, description: 'Surfaces easy to clean and sterilize' },
      supplyAccess: { required: true, description: 'Medical supplies securely stowed but quickly accessible' },
      diagnosticSpace: { required: true, description: 'Space for diagnostic equipment operation' }
    },
    adjacencyPrefs: {
      prefer: ['living', 'command'],
      avoid: ['workshop', 'airlock', 'exercise']
    }
  },
  airlock: {
    name: 'Airlock',
    emoji: '🚪',
    mass: 1.2,
    volume: 6,
    category: 'essential',
    power: -0.5,
    lifeSupport: 0,
    tags: ['utility', 'dirty', 'noisy'],
    qualities: {
      volume: { required: true, description: 'Large enough for two fully suited astronauts' },
      controls: { required: true, description: 'Clear, intuitive controls and interfaces' },
      restraints: { required: true, description: 'Well-placed restraints and handholds' },
      suitService: { required: true, description: 'Dedicated space for EVA suit servicing and checking' }
    },
    adjacencyPrefs: {
      prefer: ['workshop', 'storage'],
      avoid: ['living', 'medical', 'galley']
    }
  },
  storage: {
    name: 'Stowage',
    emoji: '📦',
    mass: 1.5,
    volume: 10,
    category: 'utility',
    power: -0.3,
    lifeSupport: 0,
    tags: ['utility', 'clean'],
    qualities: {
      organization: { required: true, description: 'Labeled, dedicated compartments and racks' },
      accessibility: { required: true, description: 'High-use items at waist-to-eye level (prime real estate)' },
      longTermStorage: { required: true, description: 'Less accessible areas for long-term storage' },
      avoidLooseBags: { required: true, description: 'Structured storage systems instead of loose bags' }
    },
    adjacencyPrefs: {
      prefer: ['airlock', 'workshop', 'galley'],
      neutral: ['lab', 'greenhouse']
    }
  },
  galley: {
    name: 'Kitchen & Dining',
    emoji: '🍽',
    mass: 2.2,
    volume: 12,
    category: 'crew',
    power: -1.5, // Heating, refrigeration, water
    lifeSupport: 0,
    tags: ['public', 'noisy', 'social'],
    qualities: {
      hygiene: { required: true, description: 'Surfaces easy to clean to prevent food contamination' },
      preparation: { required: true, description: 'Dedicated areas for rehydrating and heating food' },
      communalTable: { required: true, description: 'Social hub with communal table for meals and meetings' },
      waterAccess: { required: true, description: 'Integration with water supply and waste systems' }
    },
    adjacencyPrefs: {
      mustAdjoin: ['storage'], // Galley must be adjacent to storage (wardroom)
      prefer: ['greenhouse'],
      avoid: ['living', 'medical']
    }
  },
  exercise: {
    name: 'Fitness',
    emoji: '🏋',
    mass: 1.8,
    volume: 10,
    category: 'crew',
    power: -0.6,
    lifeSupport: 0,
    tags: ['public', 'noisy', 'clean'],
    qualities: {
      vibrationIsolation: { required: true, description: 'Structural isolation to prevent interference with experiments' },
      ventilation: { required: true, description: 'Enhanced ventilation for heat and CO2 from exercising crew' },
      restraintSystems: { required: true, description: 'Proper restraint systems for microgravity exercise' },
      equipmentSecuring: { required: true, description: 'Secure mounting for exercise equipment' }
    },
    adjacencyPrefs: {
      avoid: ['living', 'medical', 'lab'],
      prefer: ['workshop', 'storage']
    }
  },
  command: {
    name: 'Control Center',
    emoji: '🖥',
    mass: 2.5,
    volume: 14,
    category: 'essential',
    power: -2.0, // Computers, communications
    lifeSupport: 0,
    tags: ['public', 'work', 'clean'],
    qualities: {
      ergonomics: { required: true, description: 'Controls reachable from restrained position' },
      displayClarity: { required: true, description: 'Critical system displays clear and visible' },
      collaboration: { required: true, description: 'Layout allows multiple crew members to collaborate' },
      systemVisibility: { required: true, description: 'Line of sight to critical operations' }
    },
    adjacencyPrefs: {
      prefer: ['lab', 'medical'],
      sightLine: ['airlock'], // Should have sight line to airlock operations
      avoid: ['exercise', 'workshop']
    }
  },
  workshop: {
    name: 'Workshop',
    emoji: '🔧',
    mass: 2.0,
    volume: 12,
    category: 'utility',
    power: -1.0, // Power tools
    lifeSupport: 0,
    tags: ['utility', 'noisy', 'dirty'],
    qualities: {
      containment: { required: true, description: 'Debris collection to prevent floating particles' },
      workSurfaces: { required: true, description: 'Robust work surfaces and equipment restraints' },
      ventilation: { required: true, description: 'Excellent ventilation for debris and fumes' },
      powerData: { required: true, description: 'Ample power and data connections for tools' }
    },
    adjacencyPrefs: {
      prefer: ['airlock', 'storage', 'power'],
      avoid: ['living', 'medical', 'galley', 'lab']
    }
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
      moduleQualities: null,
      habitatLayout: null,
      habitationAndZoning: null // Keep for backward compatibility
    },
    recommendations: [],
    detailedIssues: {
      critical: [],
      warnings: [],
      info: []
    }
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

  // ========== C. MODULE QUALITIES VALIDATION ==========
  const moduleQualityResults = validateModuleQualities(modules, habitatStructure);
  report.sections.moduleQualities = moduleQualityResults;

  // ========== D. HABITAT LAYOUT VALIDATION ==========
  const layoutResults = validateHabitatLayout(modules, habitatStructure);
  report.sections.habitatLayout = layoutResults;

  // ========== E. LEGACY HABITATION & ZONING CHECK (for backward compatibility) ==========
  const zoningResults = {
    completeness: { passed: true, issues: [] },
    noiseSeparation: { passed: true, violations: [] },
    hygieneSeparation: { passed: true, violations: [] },
    privacy: { passed: true, issues: [] }
  };

  // E1. Completeness Check
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

  report.sections.habitationAndZoning = zoningResults;

  // Collect all issues from new validation systems
  report.detailedIssues.critical = [
    ...moduleQualityResults.criticalIssues,
    ...layoutResults.criticalIssues,
    ...zoningResults.completeness.issues.filter(() => !zoningResults.completeness.passed)
  ];

  report.detailedIssues.warnings = [
    ...moduleQualityResults.warnings,
    ...layoutResults.warnings
  ];

  // Add all issues to recommendations for backward compatibility
  report.detailedIssues.critical.forEach(issue => {
    report.recommendations.push({ severity: 'critical', message: issue });
  });

  report.detailedIssues.warnings.forEach(issue => {
    report.recommendations.push({ severity: 'warning', message: issue });
  });

  // Calculate overall readiness score using weighted system
  let score = 0;
  const weights = {
    massBudget: 0.20,           // 20% - Critical for mission feasibility
    powerAndLifeSupport: 0.25,  // 25% - Essential for crew survival
    moduleQualities: 0.30,      // 30% - Module functionality and safety
    habitatLayout: 0.25         // 25% - Layout efficiency and crew wellbeing
  };

  // Calculate weighted score
  const massBudgetScore = report.sections.massBudget.passed ? 100 : 0;
  const powerScore = (report.sections.powerAndLifeSupport.power.passed ? 50 : 0) + 
                     (report.sections.powerAndLifeSupport.lifeSupport.passed ? 50 : 0);
  const qualityScore = moduleQualityResults.overall.score;
  const layoutScore = layoutResults.overall.score;

  score = (massBudgetScore * weights.massBudget) +
          (powerScore * weights.powerAndLifeSupport) +
          (qualityScore * weights.moduleQualities) +
          (layoutScore * weights.habitatLayout);

  report.overall.readinessScore = Math.round(score);
  
  // Determine overall status based on critical issues and score
  if (report.detailedIssues.critical.length > 0) {
    report.overall.status = 'critical';
  } else if (score >= 85) {
    report.overall.status = 'ready';
  } else if (score >= 60) {
    report.overall.status = 'warning';
  } else {
    report.overall.status = 'critical';
  }

  return report;
};

// ============================================================================
// HABITAT LAYOUT PRINCIPLES
// Based on NASA space habitat design guidelines
// ============================================================================

export const LAYOUT_PRINCIPLES = {
  // Zoning: Separate incompatible activities
  zoning: {
    quietZone: ['living', 'medical'], // Private crew quarters and medical
    noisyZone: ['galley', 'exercise', 'workshop'], // Noisy activities grouped together
    cleanZone: ['galley', 'medical', 'living'], // Areas requiring cleanliness
    dirtyZone: ['airlock', 'workshop'], // Potentially contaminating areas
    workZone: ['lab', 'command', 'workshop'], // Work-focused areas
    socialZone: ['galley'] // Community gathering areas
  },
  
  // Adjacency: Modules that must/should be next to each other
  adjacency: {
    required: [
      ['galley', 'storage'], // Kitchen must be adjacent to dining/storage
    ],
    preferred: [
      ['airlock', 'workshop'], // EVA prep near maintenance area
      ['airlock', 'storage'], // EVA equipment access
      ['command', 'lab'], // Operations oversight
      ['greenhouse', 'galley'], // Food production near preparation
      ['medical', 'living'], // Medical access to crew quarters
    ],
    avoided: [
      ['exercise', 'living'], // Noise/vibration issues
      ['exercise', 'medical'], // Noise/vibration issues
      ['exercise', 'lab'], // Vibration interferes with experiments
      ['workshop', 'medical'], // Contamination concerns
      ['workshop', 'galley'], // Debris contamination
      ['airlock', 'galley'], // Dust contamination from EVA
    ]
  },
  
  // Distance requirements (in meters)
  distances: {
    noiseSeparation: 3.0, // Noisy modules from quiet modules
    contamination: 2.5, // Dirty modules from clean modules
    privacy: 2.0, // Private modules from high-traffic areas
    emergency: 8.0, // Maximum distance for emergency access
    collaboration: 4.0 // Maximum distance for frequent collaboration
  },
  
  // Translation paths: Emergency and daily movement
  translationPaths: {
    minWidth: 1.2, // Minimum corridor width (meters)
    emergencyAccess: 8.0, // Maximum distance to critical modules
    centralHub: true, // Should have central gathering area
    deadEnds: 'minimize' // Avoid dead-end configurations
  }
};

// ============================================================================
// ENHANCED MODULE QUALITY VALIDATION
// Detailed checks for each module's specific requirements
// ============================================================================

export const validateModuleQualities = (modules, habitatStructure) => {
  const qualityResults = {
    overall: { passed: true, score: 100 },
    moduleChecks: {},
    criticalIssues: [],
    warnings: [],
    recommendations: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  modules.forEach(module => {
    const moduleSpec = MODULE_SPECS[module.type];
    if (!moduleSpec || !moduleSpec.qualities) return;

    const moduleResult = {
      passed: true,
      qualities: {},
      issues: []
    };

    // Check each quality requirement for this module
    Object.entries(moduleSpec.qualities).forEach(([qualityName, qualitySpec]) => {
      totalChecks++;
      
      const qualityCheck = validateSpecificQuality(module, qualityName, qualitySpec, modules, habitatStructure);
      moduleResult.qualities[qualityName] = qualityCheck;
      
      if (qualityCheck.passed) {
        passedChecks++;
      } else {
        moduleResult.passed = false;
        moduleResult.issues.push(qualityCheck.issue);
        
        if (qualityCheck.severity === 'critical') {
          qualityResults.criticalIssues.push(`${moduleSpec.name}: ${qualityCheck.issue}`);
        } else {
          qualityResults.warnings.push(`${moduleSpec.name}: ${qualityCheck.issue}`);
        }
      }
    });

    qualityResults.moduleChecks[module.id || module.type] = moduleResult;
  });

  qualityResults.overall.passed = qualityResults.criticalIssues.length === 0;
  qualityResults.overall.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

  return qualityResults;
};

const validateSpecificQuality = (module, qualityName, qualitySpec, allModules, habitatStructure) => {
  const moduleSpec = MODULE_SPECS[module.type];
  
  // Default quality check - most qualities require specific implementation
  const baseCheck = {
    passed: true,
    issue: '',
    severity: 'warning',
    description: qualitySpec.description
  };

  // Module-specific quality validations
  switch (module.type) {
    case 'living':
      return validateLivingQualities(module, qualityName, qualitySpec, allModules);
    case 'lab':
      return validateLabQualities(module, qualityName, qualitySpec, allModules);
    case 'power':
      return validatePowerQualities(module, qualityName, qualitySpec, allModules);
    case 'greenhouse':
      return validateGreenhouseQualities(module, qualityName, qualitySpec, allModules);
    case 'medical':
      return validateMedicalQualities(module, qualityName, qualitySpec, allModules);
    case 'airlock':
      return validateAirlockQualities(module, qualityName, qualitySpec, allModules);
    case 'storage':
      return validateStorageQualities(module, qualityName, qualitySpec, allModules);
    case 'galley':
      return validateGalleyQualities(module, qualityName, qualitySpec, allModules);
    case 'exercise':
      return validateExerciseQualities(module, qualityName, qualitySpec, allModules);
    case 'command':
      return validateCommandQualities(module, qualityName, qualitySpec, allModules);
    case 'workshop':
      return validateWorkshopQualities(module, qualityName, qualitySpec, allModules);
    default:
      return baseCheck;
  }
};

// Specific quality validation functions for each module type
const validateLivingQualities = (module, qualityName, qualitySpec, allModules) => {
  switch (qualityName) {
    case 'privacy':
      const nearbyNoisyModules = allModules.filter(m => 
        m.id !== module.id && 
        MODULE_SPECS[m.type]?.tags?.includes('noisy') &&
        calculateDistance(module.position, m.position) < LAYOUT_PRINCIPLES.distances.privacy
      );
      return {
        passed: nearbyNoisyModules.length === 0,
        issue: nearbyNoisyModules.length > 0 ? 
          `Privacy compromised by nearby noisy modules: ${nearbyNoisyModules.map(m => MODULE_SPECS[m.type].name).join(', ')}` : '',
        severity: 'critical',
        description: qualitySpec.description
      };
    
    case 'ventilation':
      // Check if living module is not surrounded by other modules (needs air circulation)
      const surroundingModules = allModules.filter(m => 
        m.id !== module.id && 
        calculateDistance(module.position, m.position) < 2.0
      );
      return {
        passed: surroundingModules.length < 4, // Not completely surrounded
        issue: surroundingModules.length >= 4 ? 
          'Living quarters completely surrounded - inadequate ventilation circulation' : '',
        severity: 'warning',
        description: qualitySpec.description
      };
    
    default:
      return { passed: true, issue: '', severity: 'info', description: qualitySpec.description };
  }
};

const validateLabQualities = (module, qualityName, qualitySpec, allModules) => {
  switch (qualityName) {
    case 'containment':
      const nearbyDirtyModules = allModules.filter(m =>
        m.id !== module.id &&
        MODULE_SPECS[m.type]?.tags?.includes('dirty') &&
        calculateDistance(module.position, m.position) < LAYOUT_PRINCIPLES.distances.contamination
      );
      return {
        passed: nearbyDirtyModules.length === 0,
        issue: nearbyDirtyModules.length > 0 ?
          `Lab contamination risk from nearby dirty modules: ${nearbyDirtyModules.map(m => MODULE_SPECS[m.type].name).join(', ')}` : '',
        severity: 'critical',
        description: qualitySpec.description
      };
    
    default:
      return { passed: true, issue: '', severity: 'info', description: qualitySpec.description };
  }
};

const validateExerciseQualities = (module, qualityName, qualitySpec, allModules) => {
  switch (qualityName) {
    case 'vibrationIsolation':
      const sensitiveDist = LAYOUT_PRINCIPLES.distances.noiseSeparation;
      const nearbyLabModules = allModules.filter(m =>
        m.id !== module.id &&
        m.type === 'lab' &&
        calculateDistance(module.position, m.position) < sensitiveDist
      );
      
      const nearbyLivingModules = allModules.filter(m =>
        m.id !== module.id &&
        m.type === 'living' &&
        calculateDistance(module.position, m.position) < sensitiveDist
      );
      
      const affectedModules = [...nearbyLabModules, ...nearbyLivingModules];
      
      return {
        passed: affectedModules.length === 0,
        issue: affectedModules.length > 0 ?
          `Exercise vibrations will interfere with: ${affectedModules.map(m => MODULE_SPECS[m.type].name).join(', ')}` : '',
        severity: 'critical',
        description: qualitySpec.description
      };
    
    default:
      return { passed: true, issue: '', severity: 'info', description: qualitySpec.description };
  }
};

const validateAirlockQualities = (module, qualityName, qualitySpec, allModules) => {
  switch (qualityName) {
    case 'suitService':
      const nearbyWorkshop = allModules.find(m =>
        m.type === 'workshop' &&
        calculateDistance(module.position, m.position) < LAYOUT_PRINCIPLES.distances.collaboration
      );
      
      const nearbyStorage = allModules.find(m =>
        m.type === 'storage' &&
        calculateDistance(module.position, m.position) < LAYOUT_PRINCIPLES.distances.collaboration
      );
      
      return {
        passed: nearbyWorkshop && nearbyStorage,
        issue: !nearbyWorkshop || !nearbyStorage ?
          `Airlock needs nearby Workshop and Storage for EVA suit servicing` : '',
        severity: 'warning',
        description: qualitySpec.description
      };
    
    default:
      return { passed: true, issue: '', severity: 'info', description: qualitySpec.description };
  }
};

const validateGalleyQualities = (module, qualityName, qualitySpec, allModules) => {
  switch (qualityName) {
    case 'communalTable':
      const adjacentStorage = allModules.find(m =>
        m.type === 'storage' &&
        calculateDistance(module.position, m.position) < 2.0 // Must be adjacent
      );
      
      return {
        passed: !!adjacentStorage,
        issue: !adjacentStorage ?
          'Galley must be adjacent to Storage to create functional wardroom/dining area' : '',
        severity: 'critical',
        description: qualitySpec.description
      };
    
    default:
      return { passed: true, issue: '', severity: 'info', description: qualitySpec.description };
  }
};

// Add default implementations for other module types
const validatePowerQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

const validateGreenhouseQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

const validateMedicalQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

const validateStorageQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

const validateCommandQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

const validateWorkshopQualities = (module, qualityName, qualitySpec) => 
  ({ passed: true, issue: '', severity: 'info', description: qualitySpec.description });

// ============================================================================
// HABITAT LAYOUT VALIDATION
// Checks zoning, adjacency, and translation path requirements
// ============================================================================

export const validateHabitatLayout = (modules, habitatStructure) => {
  const layoutResults = {
    overall: { passed: true, score: 100 },
    zoning: validateZoning(modules),
    adjacency: validateAdjacency(modules),
    translationPaths: validateTranslationPaths(modules, habitatStructure),
    criticalIssues: [],
    warnings: [],
    recommendations: []
  };

  // Collect issues from all validation areas
  const allChecks = [
    ...Object.values(layoutResults.zoning),
    ...Object.values(layoutResults.adjacency),
    ...Object.values(layoutResults.translationPaths)
  ];

  allChecks.forEach(check => {
    if (!check.passed) {
      if (check.severity === 'critical') {
        layoutResults.criticalIssues.push(check.issue);
      } else {
        layoutResults.warnings.push(check.issue);
      }
    }
  });

  layoutResults.overall.passed = layoutResults.criticalIssues.length === 0;
  
  const totalChecks = allChecks.length;
  const passedChecks = allChecks.filter(c => c.passed).length;
  layoutResults.overall.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

  return layoutResults;
};

const validateZoning = (modules) => {
  const results = {
    noiseSeparation: { passed: true, issues: [] },
    contaminationControl: { passed: true, issues: [] },
    privacyProtection: { passed: true, issues: [] }
  };

  // Check noise separation
  const quietModules = modules.filter(m => LAYOUT_PRINCIPLES.zoning.quietZone.includes(m.type));
  const noisyModules = modules.filter(m => LAYOUT_PRINCIPLES.zoning.noisyZone.includes(m.type));

  quietModules.forEach(quiet => {
    noisyModules.forEach(noisy => {
      const distance = calculateDistance(quiet.position, noisy.position);
      if (distance < LAYOUT_PRINCIPLES.distances.noiseSeparation) {
        results.noiseSeparation.passed = false;
        results.noiseSeparation.issues.push({
          issue: `${MODULE_SPECS[noisy.type].name} too close to ${MODULE_SPECS[quiet.type].name} (${distance.toFixed(1)}m < ${LAYOUT_PRINCIPLES.distances.noiseSeparation}m)`,
          severity: 'warning'
        });
      }
    });
  });

  // Check contamination control
  const cleanModules = modules.filter(m => LAYOUT_PRINCIPLES.zoning.cleanZone.includes(m.type));
  const dirtyModules = modules.filter(m => LAYOUT_PRINCIPLES.zoning.dirtyZone.includes(m.type));

  cleanModules.forEach(clean => {
    dirtyModules.forEach(dirty => {
      const distance = calculateDistance(clean.position, dirty.position);
      if (distance < LAYOUT_PRINCIPLES.distances.contamination) {
        results.contaminationControl.passed = false;
        results.contaminationControl.issues.push({
          issue: `${MODULE_SPECS[dirty.type].name} contamination risk to ${MODULE_SPECS[clean.type].name} (${distance.toFixed(1)}m)`,
          severity: 'critical'
        });
      }
    });
  });

  return results;
};

const validateAdjacency = (modules) => {
  const results = {
    requiredAdjacencies: { passed: true, issues: [] },
    preferredAdjacencies: { passed: true, issues: [] },
    avoidedAdjacencies: { passed: true, issues: [] }
  };

  // Check required adjacencies
  LAYOUT_PRINCIPLES.adjacency.required.forEach(([type1, type2]) => {
    const modules1 = modules.filter(m => m.type === type1);
    const modules2 = modules.filter(m => m.type === type2);

    if (modules1.length > 0 && modules2.length > 0) {
      let foundAdjacent = false;
      modules1.forEach(m1 => {
        modules2.forEach(m2 => {
          if (calculateDistance(m1.position, m2.position) < 2.0) {
            foundAdjacent = true;
          }
        });
      });

      if (!foundAdjacent) {
        results.requiredAdjacencies.passed = false;
        results.requiredAdjacencies.issues.push({
          issue: `${MODULE_SPECS[type1].name} must be adjacent to ${MODULE_SPECS[type2].name}`,
          severity: 'critical'
        });
      }
    }
  });

  // Check avoided adjacencies
  LAYOUT_PRINCIPLES.adjacency.avoided.forEach(([type1, type2]) => {
    const modules1 = modules.filter(m => m.type === type1);
    const modules2 = modules.filter(m => m.type === type2);

    modules1.forEach(m1 => {
      modules2.forEach(m2 => {
        const distance = calculateDistance(m1.position, m2.position);
        if (distance < 2.0) {
          results.avoidedAdjacencies.passed = false;
          results.avoidedAdjacencies.issues.push({
            issue: `${MODULE_SPECS[type1].name} should not be adjacent to ${MODULE_SPECS[type2].name}`,
            severity: 'warning'
          });
        }
      });
    });
  });

  return results;
};

const validateTranslationPaths = (modules, habitatStructure) => {
  const results = {
    emergencyAccess: { passed: true, issues: [] },
    centralHub: { passed: true, issues: [] },
    pathClearance: { passed: true, issues: [] }
  };

  // Check emergency access - critical modules should be within emergency distance
  const criticalModules = modules.filter(m => MODULE_SPECS[m.type].category === 'essential');
  const livingModules = modules.filter(m => m.type === 'living');

  criticalModules.forEach(critical => {
    let hasNearbyAccess = false;
    livingModules.forEach(living => {
      if (calculateDistance(critical.position, living.position) <= LAYOUT_PRINCIPLES.distances.emergency) {
        hasNearbyAccess = true;
      }
    });

    if (!hasNearbyAccess) {
      results.emergencyAccess.passed = false;
      results.emergencyAccess.issues.push({
        issue: `${MODULE_SPECS[critical.type].name} too far from crew quarters for emergency access`,
        severity: 'critical'
      });
    }
  });

  // Check for central gathering area (galley should be reasonably central)
  const galleyModules = modules.filter(m => m.type === 'galley');
  if (galleyModules.length > 0) {
    const galley = galleyModules[0];
    const averageDistanceToGalley = modules
      .filter(m => m.id !== galley.id)
      .reduce((sum, m) => sum + calculateDistance(galley.position, m.position), 0) / (modules.length - 1);

    if (averageDistanceToGalley > 6.0) {
      results.centralHub.passed = false;
      results.centralHub.issues.push({
        issue: 'Galley (social hub) is not centrally located for easy crew access',
        severity: 'warning'
      });
    }
  }

  return results;
};

// Helper function to calculate distance between two positions
const calculateDistance = (pos1, pos2) => {
  if (!pos1 || !pos2) return Infinity;
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
