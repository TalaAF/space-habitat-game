import * as THREE from 'three';

/**
 * Creates detailed 3D models for habitat modules based on NASA designs
 * Each function returns a THREE.Group with the complete model
 */

// Living Quarters - Sleep Pod inspired by ISS crew quarters
export function createLivingQuarters() {
  const pod = new THREE.Group();
  
  // Materials
  const podWallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xb0bec5, 
    metalness: 0.2, 
    roughness: 0.7 
  });
  const bagMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00acc1, 
    metalness: 0.1, 
    roughness: 0.8 
  });
  const ventMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x37474f, 
    metalness: 0.5, 
    roughness: 0.5 
  });
  
  // Pod structure (bunk bed style)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.0, 0.1), 
    podWallMaterial
  );
  backWall.position.set(0, 1.0, -0.55);
  
  const sideWall1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 2.0, 1.1), 
    podWallMaterial
  );
  sideWall1.position.set(-0.55, 1.0, 0);
  
  const sideWall2 = sideWall1.clone();
  sideWall2.position.x = 0.55;
  
  const podFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.1, 1.1), 
    podWallMaterial
  );
  podFloor.position.set(0, 0.05, 0);
  
  const podCeiling = podFloor.clone();
  podCeiling.position.y = 1.95;
  
  // Sleeping bag
  const sleepingBag = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.8, 0.15),
    bagMaterial
  );
  sleepingBag.position.set(0, 1.0, -0.5);
  
  // Restraint straps
  const strap1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.05), 
    ventMaterial
  );
  strap1.position.set(0, 1.4, -0.4);
  
  const strap2 = strap1.clone();
  strap2.position.y = 0.6;
  
  // Ventilation fan
  const vent = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), 
    ventMaterial
  );
  vent.position.set(0.35, 1.7, -0.5);
  vent.rotation.x = Math.PI / 2;
  
  // Reading light
  const lightFixture = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 8), 
    new THREE.MeshBasicMaterial({ color: 0xfffde7 })
  );
  lightFixture.position.set(0, 1.7, -0.4);
  
  pod.add(backWall, sideWall1, sideWall2, podFloor, podCeiling);
  pod.add(sleepingBag, strap1, strap2, vent, lightFixture);
  
  return pod;
}

// Science Lab - Workbench with tools and screen
export function createLab() {
  const lab = new THREE.Group();
  
  // Materials
  const benchMaterial = new THREE.MeshStandardMaterial({
    color: 0x90a4ae,
    metalness: 0.9,
    roughness: 0.5
  });
  const toolMaterial = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    metalness: 0.5,
    roughness: 0.6
  });
  const metalToolMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0bec5,
    metalness: 1.0,
    roughness: 0.3
  });
  
  const benchHeight = 0.9;
  const benchWidth = 1.5;
  const benchDepth = 0.8;
  
  // Tabletop
  const tabletop = new THREE.Mesh(
    new THREE.BoxGeometry(benchWidth, 0.1, benchDepth),
    benchMaterial
  );
  tabletop.position.y = benchHeight;
  
  // Legs
  const legGeo = new THREE.BoxGeometry(0.1, benchHeight, 0.1);
  const legPositions = [
    {x: -benchWidth/2 + 0.1, z: -benchDepth/2 + 0.1},
    {x: benchWidth/2 - 0.1, z: -benchDepth/2 + 0.1},
    {x: -benchWidth/2 + 0.1, z: benchDepth/2 - 0.1},
    {x: benchWidth/2 - 0.1, z: benchDepth/2 - 0.1},
  ];
  
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, benchMaterial);
    leg.position.set(pos.x, benchHeight / 2, pos.z);
    lab.add(leg);
  });
  
  // Toolbox
  const toolbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.25, 0.25),
    toolMaterial
  );
  toolbox.position.set(-0.4, benchHeight + 0.125, -0.2);
  
  // Screwdriver-like tool
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16),
    toolMaterial
  );
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.15, 16),
    metalToolMaterial
  );
  shaft.position.y = 0.125;
  handle.add(shaft);
  handle.position.set(0.3, benchHeight + 0.05, 0.1);
  handle.rotation.z = Math.PI / 2;
  handle.rotation.y = 0.5;
  
  // Diagnostic screen
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 256;
  context.fillStyle = '#0a0a1a';
  context.fillRect(0, 0, 512, 256);
  context.fillStyle = '#2196f3';
  context.font = 'bold 28px Arial';
  context.fillText('RESEARCH DATA', 20, 50);
  context.font = '22px Arial';
  context.fillStyle = '#ffffff';
  context.fillText('Sample Analysis: 87%', 20, 100);
  context.fillText('Exp Status: ACTIVE', 20, 130);
  const screenTexture = new THREE.CanvasTexture(canvas);
  const screenMaterial = new THREE.MeshStandardMaterial({ 
    map: screenTexture, 
    emissive: 0x2196f3, 
    emissiveIntensity: 0.3 
  });
  
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.5, 0.05), 
    screenMaterial
  );
  screen.position.set(0, benchHeight + 0.6, -0.35);
  
  lab.add(tabletop, toolbox, handle, screen);
  
  return lab;
}

// Power Module - Solar array or battery bank
export function createPowerModule() {
  const power = new THREE.Group();
  
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffeb3b,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0xffeb3b,
    emissiveIntensity: 0.2
  });
  
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a237e,
    metalness: 0.8,
    roughness: 0.3
  });
  
  // Central battery unit
  const battery = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.0, 0.6),
    metalMaterial
  );
  battery.position.y = 0.5;
  
  // Solar panels (folded)
  const panel1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.8, 0.6),
    panelMaterial
  );
  panel1.position.set(-0.45, 0.5, 0);
  
  const panel2 = panel1.clone();
  panel2.position.x = 0.45;
  
  // Warning lights
  const light1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 8),
    new THREE.MeshStandardMaterial({ 
      color: 0x00ff00, 
      emissive: 0x00ff00, 
      emissiveIntensity: 0.8 
    })
  );
  light1.position.set(0, 1.05, 0.35);
  
  power.add(battery, panel1, panel2, light1);
  
  return power;
}

// Greenhouse - Plant growing system
export function createGreenhouse() {
  const greenhouse = new THREE.Group();
  
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x78909c,
    metalness: 0.7,
    roughness: 0.5
  });
  
  const plantMaterial = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    metalness: 0.0,
    roughness: 0.9
  });
  
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff80ab,
    emissive: 0xff80ab,
    emissiveIntensity: 0.5
  });
  
  // Growing racks
  const rack = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.5, 0.6),
    frameMaterial
  );
  rack.position.y = 0.75;
  
  // Plant trays (3 levels)
  for (let i = 0; i < 3; i++) {
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.1, 0.5),
      frameMaterial
    );
    tray.position.set(0, 0.3 + i * 0.5, 0);
    greenhouse.add(tray);
    
    // Plants on tray
    for (let j = 0; j < 4; j++) {
      const plant = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.15, 8),
        plantMaterial
      );
      plant.position.set(-0.4 + j * 0.25, 0.35 + i * 0.5, 0);
      greenhouse.add(plant);
    }
    
    // Grow light above each level
    const growLight = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.05, 0.4),
      lightMaterial
    );
    growLight.position.set(0, 0.5 + i * 0.5, 0);
    greenhouse.add(growLight);
  }
  
  greenhouse.add(rack);
  
  return greenhouse;
}

// Medical Bay - Treatment station
export function createMedical() {
  const medical = new THREE.Group();
  
  const consoleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.7,
    roughness: 0.3
  });
  
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0xe53935,
    emissive: 0xe53935,
    emissiveIntensity: 0.4
  });
  
  // Medical console
  const console = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.6),
    consoleMaterial
  );
  console.position.y = 0.4;
  
  // Examination bed
  const bed = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.2, 1.8),
    consoleMaterial
  );
  bed.position.set(0, 0.5, 0.6);
  
  // Vital signs monitor
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 256;
  context.fillStyle = '#1a1a1a';
  context.fillRect(0, 0, 512, 256);
  context.fillStyle = '#e53935';
  context.font = 'bold 30px Arial';
  context.fillText('VITAL SIGNS', 20, 50);
  context.fillStyle = '#00ff00';
  context.font = '24px Arial';
  context.fillText('HR: 72 bpm', 20, 100);
  context.fillText('BP: 120/80', 20, 130);
  context.fillText('SpO₂: 98%', 20, 160);
  const texture = new THREE.CanvasTexture(canvas);
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.4, 0.05),
    new THREE.MeshStandardMaterial({ map: texture, emissive: 0xe53935, emissiveIntensity: 0.3 })
  );
  screen.position.set(0, 0.9, -0.25);
  
  medical.add(console, bed, screen);
  
  return medical;
}

// Airlock - EVA access
export function createAirlock() {
  const airlock = new THREE.Group();
  
  const hatchMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0bec5,
    metalness: 0.9,
    roughness: 0.3
  });
  
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    metalness: 0.5,
    roughness: 0.5
  });
  
  const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.5
  });
  
  // Airlock chamber (cylinder)
  const chamber = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 2.0, 16),
    hatchMaterial
  );
  chamber.position.y = 1.0;
  
  // Outer hatch
  const hatch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32),
    hatchMaterial
  );
  hatch.position.set(0, 1.0, 0.85);
  hatch.rotation.x = Math.PI / 2;
  
  // Hatch frame (yellow caution stripe)
  const hatchFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.75, 0.05, 16, 32),
    frameMaterial
  );
  hatchFrame.position.set(0, 1.0, 0.9);
  hatchFrame.rotation.x = Math.PI / 2;
  
  // EVA suits (2)
  for (let i = 0; i < 2; i++) {
    const suit = new THREE.Group();
    
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16),
      suitMaterial
    );
    
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x80deea,
        transparent: true,
        opacity: 0.8,
        metalness: 0.5,
        roughness: 0.1
      })
    );
    helmet.position.y = 0.4;
    
    suit.add(torso, helmet);
    suit.position.set(i === 0 ? -0.5 : 0.5, 1.2, -0.5);
    airlock.add(suit);
  }
  
  airlock.add(chamber, hatch, hatchFrame);
  
  return airlock;
}

// Storage - Cargo racks
export function createStorage() {
  const storage = new THREE.Group();
  
  const rackMaterial = new THREE.MeshStandardMaterial({
    color: 0x546e7a,
    metalness: 0.8,
    roughness: 0.4
  });
  
  const cargoBagMaterial = new THREE.MeshStandardMaterial({
    color: 0x8d6e63,
    metalness: 0.1,
    roughness: 0.9
  });
  
  // Rack frame
  const rackFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.8, 0.6),
    rackMaterial
  );
  rackFrame.position.y = 0.9;
  
  // Cargo bags (3x3 grid)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.5, 0.5),
        cargoBagMaterial
      );
      bag.position.set(
        -0.4 + col * 0.4,
        0.3 + row * 0.6,
        0
      );
      storage.add(bag);
    }
  }
  
  storage.add(rackFrame);
  
  return storage;
}

/**
 * 8. Galley (Kitchen/Dining)
 * - Counter with sink and microwave
 * - Food storage lockers
 * - Dining table
 */
function createGalley() {
  const galley = new THREE.Group();
  
  // Kitchen counter (1.5m wide × 0.9m high × 0.6m deep)
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.9, 0.6),
    new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.2, roughness: 0.6 })
  );
  counter.position.set(0, 0.45, -0.6);
  galley.add(counter);
  
  // Sink (small box)
  const sink = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.15, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.8, roughness: 0.2 })
  );
  sink.position.set(-0.4, 0.93, -0.6);
  galley.add(sink);
  
  // Microwave (box with window)
  const microwave = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.3, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.3, roughness: 0.5 })
  );
  microwave.position.set(0.4, 1.05, -0.6);
  galley.add(microwave);
  
  // Microwave window
  const window = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x1976d2, emissive: 0x1976d2, emissiveIntensity: 0.3 })
  );
  window.position.set(0.4, 1.05, -0.38);
  galley.add(window);
  
  // Food storage lockers (3 vertical units)
  for (let i = 0; i < 3; i++) {
    const locker = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffa726, metalness: 0.2, roughness: 0.7 })
    );
    locker.position.set(-0.5 + i * 0.5, 0.25 + i * 0.6, 0.5);
    galley.add(locker);
  }
  
  // Dining table (rectangular)
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x8d6e63, metalness: 0.1, roughness: 0.8 })
  );
  table.position.set(0, 0.7, 0.2);
  galley.add(table);
  
  // Table leg
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x616161, metalness: 0.5, roughness: 0.5 })
  );
  leg.position.set(0, 0.35, 0.2);
  galley.add(leg);
  
  return galley;
}

/**
 * 9. Exercise Module
 * - Treadmill/running platform
 * - Resistance equipment
 * - Handrails
 */
function createExercise() {
  const exercise = new THREE.Group();
  
  // Treadmill base (1.8m long × 0.8m wide)
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.4, roughness: 0.5 })
  );
  base.position.set(0, 0.1, 0);
  exercise.add(base);
  
  // Running belt (red)
  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.05, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xe53935, metalness: 0.2, roughness: 0.7 })
  );
  belt.position.set(0, 0.225, 0);
  exercise.add(belt);
  
  // Handrails (2 vertical posts + horizontal rails)
  for (let side = -1; side <= 1; side += 2) {
    // Vertical posts
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xbdbdbd, metalness: 0.7, roughness: 0.3 })
    );
    post.position.set(side * 0.4, 0.8, 0.6);
    exercise.add(post);
    
    // Horizontal rail
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xbdbdbd, metalness: 0.7, roughness: 0.3 })
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set(side * 0.4, 1.3, 0);
    exercise.add(rail);
  }
  
  // Display console
  const console = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.5, roughness: 0.4 })
  );
  console.position.set(0, 1.4, 0.65);
  exercise.add(console);
  
  // Screen (green display)
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.15, 0.02),
    new THREE.MeshStandardMaterial({ 
      color: 0x4caf50, 
      emissive: 0x4caf50, 
      emissiveIntensity: 0.4 
    })
  );
  screen.position.set(0, 1.4, 0.68);
  exercise.add(screen);
  
  // Resistance bands attachment points (small cylinders)
  for (let i = 0; i < 4; i++) {
    const attachment = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0xffeb3b, metalness: 0.6, roughness: 0.4 })
    );
    attachment.rotation.x = Math.PI / 2;
    attachment.position.set(
      (i % 2 === 0 ? -0.35 : 0.35),
      0.4,
      (i < 2 ? -0.8 : 0.8)
    );
    exercise.add(attachment);
  }
  
  return exercise;
}

/**
 * 10. Command Center
 * - Control console with multiple screens
 * - Communication antenna
 * - Operator chair
 */
function createCommand() {
  const command = new THREE.Group();
  
  // Main console (curved desk)
  const console = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.8, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.4, roughness: 0.5 })
  );
  console.position.set(0, 0.4, -0.4);
  command.add(console);
  
  // Three monitors with canvas textures
  for (let i = 0; i < 3; i++) {
    // Monitor frame
    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.5, roughness: 0.4 })
    );
    monitor.position.set(-0.5 + i * 0.5, 1.0, -0.35);
    command.add(monitor);
    
    // Screen with data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 192;
    
    // Background
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.font = 'Bold 20px Arial';
    ctx.fillStyle = '#00e676';
    const titles = ['SYSTEMS', 'NAV DATA', 'COMMS'];
    ctx.fillText(titles[i], 20, 30);
    
    // Status lines
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ffffff';
    const statuses = [
      ['PWR: 94%', 'O2: 98%', 'H2O: 87%'],
      ['LAT: 24.5°N', 'LON: 45.3°W', 'ALT: 2.4km'],
      ['UPLINK: OK', 'DNLINK: OK', 'DELAY: 8m']
    ];
    statuses[i].forEach((line, idx) => {
      ctx.fillText(line, 20, 60 + idx * 25);
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.26),
      new THREE.MeshStandardMaterial({ 
        map: texture,
        emissive: 0x1a237e, 
        emissiveIntensity: 0.3 
      })
    );
    screenMesh.position.set(-0.5 + i * 0.5, 1.0, -0.32);
    command.add(screenMesh);
  }
  
  // Keyboard/control panel
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.3, roughness: 0.6 })
  );
  keyboard.position.set(0, 0.825, -0.2);
  keyboard.rotation.x = -Math.PI / 12;
  command.add(keyboard);
  
  // Communication antenna (small dish)
  const dish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.1, 0.1, 16),
    new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.6, roughness: 0.3 })
  );
  dish.position.set(0.7, 1.5, 0.3);
  command.add(dish);
  
  // Antenna mast
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x9e9e9e, metalness: 0.7, roughness: 0.3 })
  );
  mast.position.set(0.7, 1.2, 0.3);
  command.add(mast);
  
  // Operator chair (simplified)
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.1, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1976d2, metalness: 0.1, roughness: 0.8 })
  );
  seat.position.set(0, 0.5, 0.4);
  command.add(seat);
  
  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1976d2, metalness: 0.1, roughness: 0.8 })
  );
  backrest.position.set(0, 0.8, 0.6);
  command.add(backrest);
  
  return command;
}

/**
 * 11. Workshop
 * - Tool bench with vise
 * - Tool pegboard
 * - Parts bins
 * - Welding equipment
 */
function createWorkshop() {
  const workshop = new THREE.Group();
  
  // Workbench (similar to lab but more industrial)
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x5d4037, metalness: 0.2, roughness: 0.9 })
  );
  bench.position.set(0, 0.9, 0);
  workshop.add(bench);
  
  // Bench legs (4 corners)
  for (let x = -0.7; x <= 0.7; x += 1.4) {
    for (let z = -0.35; z <= 0.35; z += 0.7) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.9, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.5, roughness: 0.5 })
      );
      leg.position.set(x, 0.45, z);
      workshop.add(leg);
    }
  }
  
  // Vise (mounted on bench)
  const viseBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.15, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x616161, metalness: 0.8, roughness: 0.3 })
  );
  viseBase.position.set(-0.5, 1.0, 0);
  workshop.add(viseBase);
  
  const viseJaw = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x757575, metalness: 0.7, roughness: 0.3 })
  );
  viseJaw.position.set(-0.5, 1.1, 0.15);
  workshop.add(viseJaw);
  
  // Tool pegboard (vertical board with tools)
  const pegboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xffa726, metalness: 0.1, roughness: 0.8 })
  );
  pegboard.position.set(0, 1.2, -0.45);
  workshop.add(pegboard);
  
  // Tools hanging on pegboard (simplified)
  const toolPositions = [
    [-0.5, 1.5, -0.42], // Wrench
    [-0.2, 1.5, -0.42], // Hammer
    [0.1, 1.5, -0.42],  // Screwdriver
    [0.4, 1.5, -0.42],  // Pliers
  ];
  
  toolPositions.forEach((pos, idx) => {
    const tool = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.3, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xbdbdbd, metalness: 0.7, roughness: 0.3 })
    );
    tool.position.set(pos[0], pos[1], pos[2]);
    workshop.add(tool);
  });
  
  // Parts bins (3 stacked boxes)
  for (let i = 0; i < 3; i++) {
    const bin = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.25, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x388e3c, metalness: 0.2, roughness: 0.7 })
    );
    bin.position.set(0.6, 0.3 + i * 0.3, 0.4);
    workshop.add(bin);
  }
  
  // Welding torch (cylinder + cone tip)
  const torchBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x1976d2, metalness: 0.6, roughness: 0.4 })
  );
  torchBody.rotation.z = Math.PI / 4;
  torchBody.position.set(0.3, 0.95, 0.2);
  workshop.add(torchBody);
  
  const torchTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.02, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6f00, metalness: 0.8, roughness: 0.2 })
  );
  torchTip.rotation.z = Math.PI / 4 - Math.PI / 2;
  torchTip.position.set(0.5, 1.1, 0.2);
  workshop.add(torchTip);
  
  return workshop;
}

// Model creation registry
export const MODEL_CREATORS = {
  living: createLivingQuarters,
  lab: createLab,
  power: createPowerModule,
  greenhouse: createGreenhouse,
  medical: createMedical,
  airlock: createAirlock,
  storage: createStorage,
  galley: createGalley,
  exercise: createExercise,
  command: createCommand,
  workshop: createWorkshop
};

/**
 * Creates a detailed 3D model for a given module type
 * @param {string} type - Module type (living, lab, power, etc.)
 * @param {object} userData - User data to attach to the model
 * @returns {THREE.Group} - Complete 3D model with userData
 */
export function createModuleModel(type, userData = {}) {
  const creator = MODEL_CREATORS[type];
  
  if (!creator) {
    console.warn(`No model creator found for type: ${type}`);
    // Fallback to simple box
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
  
  // Attach all userData
  model.userData = {
    ...userData,
    type,
    // Store original bounding box for collision detection
    boundingBox: new THREE.Box3().setFromObject(model)
  };
  
  // Make model castShadow and receiveShadow
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  // Mark the parent group as the draggable object
  model.userData.isDraggable = true;
  
  return model;
}
