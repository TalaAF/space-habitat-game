// NASA Moon to Mars Architecture - Mission Constraints

export const MODULE_SPECS = {
  living: {
    name: 'Living Quarters',
    mass: 2.5, // metric tons
    volume: 12, // cubic meters
    category: 'crew'
  },
  lab: {
    name: 'Research Lab',
    mass: 3.2,
    volume: 15,
    category: 'science'
  },
  power: {
    name: 'Power Module',
    mass: 1.8,
    volume: 8,
    category: 'essential'
  },
  greenhouse: {
    name: 'Greenhouse',
    mass: 2.0,
    volume: 20,
    category: 'life-support'
  },
  storage: {
    name: 'Storage',
    mass: 1.5,
    volume: 10,
    category: 'utility'
  },
  medical: {
    name: 'Medical Bay',
    mass: 2.8,
    volume: 14,
    category: 'essential'
  },
  airlock: {
    name: 'Airlock',
    mass: 1.2,
    volume: 6,
    category: 'essential'
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
  mars: 26.4 // metric tons - Mars Transit Vehicle capacity
};

// Required modules for mission types
export const MISSION_REQUIREMENTS = {
  lunar: {
    short: {
      essential: ['power', 'airlock'],
      crewQuarters: true, // 1 per crew member
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
  mars: {
    short: {
      essential: ['power', 'airlock', 'medical'],
      crewQuarters: true,
      minPower: 1,
      requiresShielding: true
    },
    mid: {
      essential: ['power', 'airlock', 'medical', 'greenhouse'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 1,
      requiresShielding: true
    },
    extended: {
      essential: ['power', 'airlock', 'medical', 'greenhouse'],
      crewQuarters: true,
      minPower: 2,
      minLifeSupport: 2,
      minScience: 1,
      requiresShielding: true,
      minStorage: 2
    }
  }
};

export const validateMissionLayout = (modules, habitatStructure, missionParams) => {
  const { crewSize, destination, duration } = missionParams;
  const results = {
    passed: false,
    checks: []
  };

  // 1. Calculate total mass
  const totalMass = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.mass || 0);
  }, 0);

  const massLimit = MASS_LIMITS[destination];
  const massCheck = {
    name: 'Mass Limit',
    passed: totalMass <= massLimit,
    current: totalMass.toFixed(2),
    required: massLimit.toFixed(2),
    unit: 'metric tons',
    description: `Total habitat mass must not exceed ${destination === 'lunar' ? 'Lunar Lander' : 'Mars Transit Vehicle'} capacity`
  };
  results.checks.push(massCheck);

  // 2. Calculate total pressurized volume
  const totalVolume = modules.reduce((sum, module) => {
    return sum + (MODULE_SPECS[module.type]?.volume || 0);
  }, 0);

  const requiredVolume = VOLUME_REQUIREMENTS[duration] * crewSize;
  const volumeCheck = {
    name: 'Habitation Volume',
    passed: totalVolume >= requiredVolume,
    current: totalVolume.toFixed(1),
    required: requiredVolume.toFixed(1),
    unit: 'm³',
    description: `Pressurized volume for ${crewSize} crew over ${duration} duration`
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

  // Medical bay (required for Mars)
  if (requirements.essential.includes('medical')) {
    const medicalCount = modules.filter(m => m.type === 'medical').length;
    const medicalCheck = {
      name: 'Medical Facilities',
      passed: medicalCount >= 1,
      current: medicalCount,
      required: 1,
      unit: 'module',
      description: 'Medical bay required for Mars missions'
    };
    results.checks.push(medicalCheck);
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
