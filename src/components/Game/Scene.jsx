import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { findPath, analyzePath } from '../../utils/pathAnalysis';
import { createModuleModel } from '../../utils/modelCreators';

const Scene = forwardRef(({ habitatStructure, modules, onModulePositionUpdate, pathAnalysisMode, onPathAnalysis, currentFloor = 0, onModuleSelected }, ref) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const dragControlsRef = useRef(null);
  const moduleMeshesRef = useRef(new Map());
  const animationFrameRef = useRef(null);
  const floorRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const pathVisualizationRef = useRef([]);
  const [clickPoints, setClickPoints] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [rotationMode, setRotationMode] = useState(false);
  const needsRenderRef = useRef(true); // Flag for on-demand rendering

  // Expose scene, renderer, and camera to parent via ref (for export functionality)
  useImperativeHandle(ref, () => ({
    renderer: rendererRef.current,
    scene: sceneRef.current,
    camera: cameraRef.current
  }));

  // Notify parent when module selection changes
  useEffect(() => {
    if (onModuleSelected) {
      onModuleSelected(selectedModule !== null);
    }
  }, [selectedModule, onModuleSelected]);

  useEffect(() => {
    if (!containerRef.current) return;
    console.log('Initializing scene...');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true // Required for screenshot capture
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Request a new render frame
    const requestRender = () => {
      needsRenderRef.current = true;
    };

    // Listen for control changes to trigger renders
    controls.addEventListener('change', requestRender);

    // On-demand rendering loop - only renders when needed
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Only update controls if damping is enabled
      const controlsUpdated = controls.update();
      
      // Check if we need to render (controls changed or render requested)
      if (controlsUpdated || needsRenderRef.current) {
        // Update selection highlight
        moduleMeshesRef.current.forEach((moduleGroup) => {
          const helper = moduleGroup.children.find(child => child.userData.isDragHelper);
          if (helper && helper.material) {
            if (moduleGroup === selectedModule) {
              // Highlight selected module with pulsing effect
              const pulse = Math.sin(Date.now() * 0.003) * 0.5 + 0.5;
              helper.material.visible = true;
              helper.material.opacity = 0.3 + pulse * 0.2;
              helper.material.color.setHex(0x00ff00);
              helper.material.transparent = true;
              // Keep rendering while module is selected for pulse animation
              if (selectedModule) {
                needsRenderRef.current = true;
              }
            } else {
              // Hide helper for non-selected modules
              helper.material.visible = false;
            }
          }
        });
        
        renderer.render(scene, camera);
        needsRenderRef.current = false; // Reset flag after rendering
      }
    };
    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (dragControlsRef.current) dragControlsRef.current.dispose();
      controls.dispose();
      moduleMeshesRef.current.forEach(moduleGroup => {
        // Properly dispose of Group objects and all children
        moduleGroup.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        });
      });
      if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Keyboard controls for module rotation and deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedModule) return;

      const rotationStep = Math.PI / 12; // 15 degrees per press
      let needsRender = false; // Track if we need to render

      switch (e.key.toLowerCase()) {
        case 'r':
          // Toggle rotation mode
          setRotationMode(prev => !prev);
          break;
        case 'q':
        case 'arrowleft':
          // Rotate left (counter-clockwise)
          selectedModule.rotation.y -= rotationStep;
          needsRender = true;
          break;
        case 'e':
        case 'arrowright':
          // Rotate right (clockwise)
          selectedModule.rotation.y += rotationStep;
          needsRender = true;
          break;
        case 'w':
        case 'arrowup':
          // Rotate forward
          selectedModule.rotation.x -= rotationStep;
          needsRender = true;
          break;
        case 's':
        case 'arrowdown':
          // Rotate backward
          selectedModule.rotation.x += rotationStep;
          needsRender = true;
          break;
        case 'a':
          // Roll left
          selectedModule.rotation.z -= rotationStep;
          needsRender = true;
          break;
        case 'd':
          // Roll right
          selectedModule.rotation.z += rotationStep;
          needsRender = true;
          break;
        case 'delete':
        case 'backspace':
          // Delete selected module
          if (selectedModule.userData.moduleId && onModulePositionUpdate) {
            // Remove from scene
            sceneRef.current.remove(selectedModule);
            
            // Dispose of resources
            selectedModule.traverse(child => {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
              }
            });
            
            // Remove from map
            moduleMeshesRef.current.delete(selectedModule.userData.moduleId);
            
            // Notify parent to remove from state (pass null position to signal deletion)
            onModulePositionUpdate(selectedModule.userData.moduleId, null);
            
            // Deselect
            setSelectedModule(null);
            console.log('Module deleted:', selectedModule.userData.moduleId);
            needsRender = true;
          }
          break;
        case 'escape':
          // Deselect module
          setSelectedModule(null);
          setRotationMode(false);
          needsRender = true;
          break;
        default:
          break;
      }
      
      // Trigger render if any action was performed
      if (needsRender && needsRenderRef.current !== undefined) {
        needsRenderRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModule, onModulePositionUpdate]);

  // Update habitat when structure changes
  useEffect(() => {
    if (!sceneRef.current) return;
    console.log('Building habitat:', habitatStructure);
    
    const scene = sceneRef.current;
    const oldHabitat = scene.getObjectByName('habitat');
    if (oldHabitat) {
      scene.remove(oldHabitat);
      oldHabitat.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    const habitat = new THREE.Group();
    habitat.name = 'habitat';

    const { shape, radius, height, floors = 1, floorHeight = 3, floorShapes = [] } = habitatStructure;

    // Create individual shells for each floor based on their shape
    for (let i = 0; i < floors; i++) {
      const floorY = i * floorHeight;
      const floorShape = floorShapes[i] || 'cylinder';
      let shellGeo;
      
      if (floorShape === 'cylinder') {
        shellGeo = new THREE.CylinderGeometry(radius, radius, floorHeight, 32, 1, true);
      } else if (floorShape === 'dome') {
        shellGeo = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      }
      
      const shell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({
        color: 0x2244aa,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        wireframe: false
      }));
      
      if (floorShape === 'cylinder') {
        shell.position.y = floorY + floorHeight / 2;
      } else if (floorShape === 'dome') {
        shell.position.y = floorY;
      }
      
      // Optimize shadows: shells receive but don't cast
      shell.castShadow = false;
      shell.receiveShadow = true;
      
      shell.userData.floorLevel = i;
      shell.userData.isShell = true;
      habitat.add(shell);
    }

    // Create multiple floors
    for (let i = 0; i < floors; i++) {
      const floorY = i * floorHeight;
      const floorShape = floorShapes[i] || 'cylinder';
      
      // Create floor mesh (always circular for both cylinder and dome)
      const floorGeo = new THREE.CircleGeometry(radius, 32);
      
      const floor = new THREE.Mesh(
        floorGeo,
        new THREE.MeshStandardMaterial({ 
          color: 0x2a2a3a,
          transparent: i > 0,
          opacity: i > 0 ? 0.7 : 1
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = floorY + 0.01;
      
      // Optimize shadows: floors receive but don't cast
      floor.castShadow = false;
      floor.receiveShadow = true;
      
      floor.userData.floorLevel = i;
      habitat.add(floor);
      
      // Store reference to ground floor for path analysis
      if (i === 0) {
        floorRef.current = floor;
      }

      // Create grid for each floor
      const grid = new THREE.GridHelper(radius * 2, 20, 0x4488ff, 0x223355);
      grid.position.y = floorY + 0.02;
      grid.userData.floorLevel = i;
      habitat.add(grid);

      // Add floor label
      if (floors > 1) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(68, 136, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(`Floor ${i + 1}`, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        sprite.position.set(radius - 1, floorY + 0.5, 0);
        sprite.scale.set(2, 0.5, 1);
        habitat.add(sprite);
      }
    }

    scene.add(habitat);
    console.log('Habitat built successfully with', floors, 'floors');
    
    // Trigger render after habitat creation
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }
  }, [habitatStructure]);

  // Update floor visibility based on current floor
  useEffect(() => {
    if (!sceneRef.current) return;
    const habitat = sceneRef.current.getObjectByName('habitat');
    if (!habitat) return;

    habitat.children.forEach(child => {
      if (child.userData.floorLevel !== undefined) {
        const isCurrentFloor = child.userData.floorLevel === currentFloor;
        
        // Update floor mesh opacity (CircleGeometry or PlaneGeometry)
        if (child.geometry && (child.geometry.type === 'CircleGeometry' || child.geometry.type === 'PlaneGeometry')) {
          child.material.opacity = isCurrentFloor ? 1.0 : 0.3;
          child.material.transparent = true;
        }
        
        // Update shell visibility
        if (child.userData.isShell) {
          child.material.opacity = isCurrentFloor ? 0.3 : 0.1;
          child.material.transparent = true;
        }
        
        // Update grid helper visibility
        if (child.type === 'GridHelper') {
          child.visible = isCurrentFloor;
        }
      }
    });

    // Update module opacity based on floor
    moduleMeshesRef.current.forEach((moduleGroup) => {
      const moduleFloor = moduleGroup.userData.floor || 0;
      const opacity = moduleFloor === currentFloor ? 1.0 : 0.2;
      
      moduleGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
    });
    
    // Trigger render after floor visibility change
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }

  }, [currentFloor]);

  // Update modules
  useEffect(() => {
    if (!sceneRef.current) return;
    console.log('Updating modules, count:', modules.length);

    const scene = sceneRef.current;
    const currentIds = new Set(modules.map(m => m.id));

    // Remove deleted modules
    moduleMeshesRef.current.forEach((moduleGroup, id) => {
      if (!currentIds.has(id)) {
        scene.remove(moduleGroup);
        // Properly dispose of Group and all children
        moduleGroup.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        });
        moduleMeshesRef.current.delete(id);
      }
    });

    // Add new modules
    modules.forEach(module => {
      if (!moduleMeshesRef.current.has(module.id)) {
        const moduleGroup = createModule(module);
        scene.add(moduleGroup);
        moduleMeshesRef.current.set(module.id, moduleGroup);
        console.log('Added module:', module.id, 'at', module.position);
      } else {
        const moduleGroup = moduleMeshesRef.current.get(module.id);
        moduleGroup.position.set(module.position.x, module.position.y, module.position.z);
      }
    });

    // Setup drag controls using invisible helper meshes
    if (dragControlsRef.current) dragControlsRef.current.dispose();
    
    // Get drag helper meshes from each module group
    const draggableHelpers = [];
    moduleMeshesRef.current.forEach((moduleGroup) => {
      const helper = moduleGroup.children.find(child => child.userData.isDragHelper);
      if (helper) {
        draggableHelpers.push(helper);
      }
    });
    
    if (draggableHelpers.length > 0 && cameraRef.current && rendererRef.current) {
      const drag = new DragControls(draggableHelpers, cameraRef.current, rendererRef.current.domElement);
      
      drag.addEventListener('dragstart', (e) => {
        if (controlsRef.current) controlsRef.current.enabled = false;
        // When dragging the helper, actually move the parent group
        const parentGroup = e.object.userData.parentGroup;
        if (parentGroup) {
          parentGroup.userData.isDragging = true;
          // Store the original Y position to preserve floor level during drag
          parentGroup.userData.originalY = parentGroup.position.y;
          // Select the module when starting to drag
          setSelectedModule(parentGroup);
          // Trigger render
          if (needsRenderRef.current !== undefined) {
            needsRenderRef.current = true;
          }
        }
      });
      
      drag.addEventListener('drag', (e) => {
        // Move the parent group, not just the helper
        const parentGroup = e.object.userData.parentGroup;
        if (parentGroup) {
          // Preserve the module's original Y position (floor level)
          const originalY = parentGroup.userData.originalY || parentGroup.position.y;
          parentGroup.position.x = e.object.position.x;
          parentGroup.position.y = originalY;
          parentGroup.position.z = e.object.position.z;
          // Reset helper's local position
          e.object.position.set(0, (parentGroup.userData.size || 1.5) / 2, 0);
          // Trigger render during drag
          if (needsRenderRef.current !== undefined) {
            needsRenderRef.current = true;
          }
        }
      });
      
      drag.addEventListener('dragend', (e) => {
        if (controlsRef.current) controlsRef.current.enabled = true;
        
        const parentGroup = e.object.userData.parentGroup;
        if (!parentGroup) return;
        
        parentGroup.userData.isDragging = false;
        
        let x = Math.round(parentGroup.position.x);
        let z = Math.round(parentGroup.position.z);
        const dist = Math.sqrt(x * x + z * z);
        const maxR = habitatStructure.radius - 1;
        
        if (dist > maxR) {
          const angle = Math.atan2(z, x);
          x = Math.round(Math.cos(angle) * maxR);
          z = Math.round(Math.sin(angle) * maxR);
        }
        
        // Preserve the module's floor level (Y position)
        const y = parentGroup.userData.originalY || parentGroup.position.y;
        const pos = { x, y, z };
        parentGroup.position.set(pos.x, pos.y, pos.z);
        
        if (onModulePositionUpdate) {
          onModulePositionUpdate(parentGroup.userData.moduleId, pos);
        }
        
        // Trigger render after drag end
        if (needsRenderRef.current !== undefined) {
          needsRenderRef.current = true;
        }
      });
      
      dragControlsRef.current = drag;
    }
    
    // Trigger render after module changes
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }
  }, [modules, habitatStructure, onModulePositionUpdate]);

  const createModule = (module) => {
    // Create detailed 3D model using NASA-inspired geometries
    const moduleGroup = createModuleModel(module.type, {
      id: module.id,
      type: module.type,
      moduleId: module.id,
      floor: module.floor || 0,
      size: module.size || 1.5,
      mass: module.mass,
      power: module.power,
      lifeSupport: module.lifeSupport,
      tags: module.tags
    });
    
    // Optimize shadows: modules cast shadows but don't receive them from each other
    moduleGroup.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false; // Biggest performance gain
      }
    });
    
    // Set position
    moduleGroup.position.set(module.position.x, module.position.y, module.position.z);
    
    // Apply scale if needed (models are designed at 1:1 scale)
    const scale = (module.size || 1.5) / 1.5;
    moduleGroup.scale.set(scale, scale, scale);
    
    // Add bounding box mesh for drag detection and selection highlight
    // This ensures DragControls can raycast and detect the entire model
    const size = module.size || 1.5;
    const dragHelper = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3,
        visible: false // Initially invisible, shown when selected
      })
    );
    dragHelper.position.y = size / 2; // Center at model height
    dragHelper.userData.isDragHelper = true;
    moduleGroup.add(dragHelper);
    
    // Store reference to parent group in drag helper
    dragHelper.userData.parentGroup = moduleGroup;
    
    return moduleGroup;
  };

  // Path Analysis Mode - Click handling
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const handleClick = (event) => {
      if (!pathAnalysisMode) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Find the current floor mesh to raycast against
      const habitat = sceneRef.current.getObjectByName('habitat');
      if (!habitat) return;
      
      const currentFloorMesh = habitat.children.find(child => 
        child.userData.floorLevel === currentFloor && 
        (child.geometry?.type === 'CircleGeometry' || child.geometry?.type === 'PlaneGeometry')
      );
      
      if (!currentFloorMesh) return;
      
      const intersects = raycasterRef.current.intersectObject(currentFloorMesh);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const distance = Math.sqrt(point.x ** 2 + point.z ** 2);
        
        if (distance > habitatStructure.radius - 0.5) {
          console.warn('Click outside habitat boundaries');
          return;
        }

        // Calculate Y position for current floor
        const floorHeight = habitatStructure.floorHeight || 3;
        const floorY = currentFloor * floorHeight;

        // Add marker at current floor level
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        marker.position.set(point.x, floorY + 0.2, point.z);
        marker.userData.isPathMarker = true;
        marker.userData.floorLevel = currentFloor;
        sceneRef.current.add(marker);
        
        // Trigger render after adding marker
        if (needsRenderRef.current !== undefined) {
          needsRenderRef.current = true;
        }

        setClickPoints(prev => {
          const newPoints = [...prev, { x: point.x, z: point.z, y: floorY, marker, floor: currentFloor }];
          
          if (newPoints.length === 2) {
            // Hide the overlay instruction after second click
            const overlay = document.querySelector('.path-overlay-info');
            if (overlay) overlay.style.display = 'none';
            
            calculatePath(newPoints[0], newPoints[1]);
            return [];
          }
          
          return newPoints;
        });
      }
    };

    const canvas = rendererRef.current.domElement;
    canvas.addEventListener('click', handleClick);
    canvas.style.cursor = pathAnalysisMode ? 'crosshair' : 'default';

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.style.cursor = 'default';
    };
  }, [pathAnalysisMode, habitatStructure, currentFloor]);

  // Calculate and visualize path
  const calculatePath = (start, end) => {
    console.log('Calculating path from', start, 'to', end, 'on floor', start.floor);

    // Check if both points are on the same floor
    if (start.floor !== end.floor) {
      console.warn('Path analysis only works within the same floor');
      setTimeout(() => {
        if (onPathAnalysis) {
          onPathAnalysis(null);
        }
      }, 0);
      return;
    }

    // Clear previous visualization
    clearPathVisualization();

    // Get module meshes as obstacles - only modules on the current floor
    const allModules = Array.from(moduleMeshesRef.current.values());
    const obstacles = allModules.filter(moduleGroup => {
      const moduleFloor = moduleGroup.userData.floor || 0;
      return moduleFloor === start.floor;
    });

    console.log(`Found ${obstacles.length} obstacles on floor ${start.floor}`);

    // Find path (returns array of points or null)
    const pathPoints = findPath(start, end, obstacles, habitatStructure);

    if (!pathPoints || pathPoints.length === 0) {
      console.warn('No valid path found');
      // Schedule state update for next render
      setTimeout(() => {
        if (onPathAnalysis) {
          onPathAnalysis(null);
        }
      }, 0);
      return;
    }

    // Analyze clearance
    const analysis = analyzePath(pathPoints, obstacles, habitatStructure);

    console.log('Path analysis complete:', analysis);

    // Visualize path
    visualizePath(pathPoints, analysis);
    
    // Trigger render after path visualization
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }

    // Report results (schedule for next render to avoid setState during render)
    setTimeout(() => {
      if (onPathAnalysis) {
        onPathAnalysis(analysis);
      }
    }, 0);

    // Auto-clear visualization after 5 seconds
    setTimeout(() => {
      clearPathVisualization();
    }, 5000);
  };

  // Visualize path with SEGMENTED TUBE approach
  const visualizePath = (pathPoints, analysis) => {
    if (!sceneRef.current) return;

    const pathGroup = new THREE.Group();
    let hasViolation = false;

    // Get floor height for path visualization
    const floorHeight = habitatStructure.floorHeight || 3;
    const pathFloor = clickPoints[0]?.floor || currentFloor || 0;
    const pathY = pathFloor * floorHeight + 0.3;

    // Create individual tube segments with color coding
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i];
      const end = pathPoints[i + 1];
      const segmentData = analysis.segments[i];

      // Create curve for TubeGeometry at current floor height
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(start.x, pathY, start.z),
        new THREE.Vector3(end.x, pathY, end.z)
      );

      // Create tube geometry
      const tubeGeometry = new THREE.TubeGeometry(curve, 2, 0.08, 8, false);
      
      // Color based on clearance
      const color = segmentData.passes ? 0x44ff44 : 0xff4444;
      if (!segmentData.passes) hasViolation = true;
      
      const material = new THREE.MeshStandardMaterial({ 
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        roughness: 0.5,
        metalness: 0.3
      });

      const tube = new THREE.Mesh(tubeGeometry, material);
      pathGroup.add(tube);
    }

    sceneRef.current.add(pathGroup);
    pathVisualizationRef.current.push(pathGroup);

    // Add 3D text label for total distance
    const midpoint = pathPoints[Math.floor(pathPoints.length / 2)];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Background
    context.fillStyle = 'rgba(0, 0, 0, 0.85)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    context.strokeStyle = analysis.passes ? '#44ff44' : '#ff4444';
    context.lineWidth = 4;
    context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    // Text
    context.font = 'Bold 32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(`Path: ${analysis.totalDistance.toFixed(2)}m`, 256, 50);
    
    context.font = '20px Arial';
    context.fillStyle = analysis.passes ? '#44ff44' : '#ff4444';
    context.fillText(
      analysis.passes ? '✓ NASA Compliant' : '✗ Clearance Violation',
      256,
      85
    );

    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    sprite.position.set(midpoint.x, 2.5, midpoint.z);
    sprite.scale.set(4, 1, 1);
    sceneRef.current.add(sprite);
    pathVisualizationRef.current.push(sprite);

    // Add warning message if violations exist
    if (hasViolation) {
      console.warn('⚠️ WARNING: Path violates 1.0m minimum clearance requirement');
    }
  };

  // Clear path visualization
  const clearPathVisualization = () => {
    if (!sceneRef.current) return;
    
    pathVisualizationRef.current.forEach(obj => {
      sceneRef.current.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    pathVisualizationRef.current = [];

    // Remove markers (yellow dots)
    clickPoints.forEach(point => {
      if (point.marker) {
        sceneRef.current.remove(point.marker);
        point.marker.geometry.dispose();
        point.marker.material.dispose();
      }
    });
    setClickPoints([]);
    
    // Also clear any orphaned markers from previous analyses
    const scene = sceneRef.current;
    const markersToRemove = [];
    scene.traverse((obj) => {
      if (obj.userData.isPathMarker) {
        markersToRemove.push(obj);
      }
    });
    markersToRemove.forEach(marker => {
      scene.remove(marker);
      if (marker.geometry) marker.geometry.dispose();
      if (marker.material) marker.material.dispose();
    });
    
    // Trigger render after clearing
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }
  };

  // Clear visualization when exiting path analysis mode
  useEffect(() => {
    const overlay = document.querySelector('.path-overlay-info');
    
    if (!pathAnalysisMode) {
      clearPathVisualization();
      if (overlay) overlay.style.display = 'none';
    } else {
      // Show overlay when entering path mode
      if (overlay) overlay.style.display = 'block';
    }
    
    // Trigger render on mode change
    if (needsRenderRef.current !== undefined) {
      needsRenderRef.current = true;
    }
  }, [pathAnalysisMode]);

  // Disable drag controls in path analysis mode
  useEffect(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.enabled = !pathAnalysisMode;
    }
  }, [pathAnalysisMode]);

  // Click to deselect module when clicking on empty space
  useEffect(() => {
    if (!rendererRef.current || pathAnalysisMode) return;

    const handleCanvasClick = (event) => {
      if (!selectedModule) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Check if clicking on a module
      const helpers = [];
      moduleMeshesRef.current.forEach((moduleGroup) => {
        const helper = moduleGroup.children.find(child => child.userData.isDragHelper);
        if (helper) helpers.push(helper);
      });
      
      const intersects = raycasterRef.current.intersectObjects(helpers);
      
      // If not clicking on any module, deselect
      if (intersects.length === 0) {
        setSelectedModule(null);
      }
    };

    const canvas = rendererRef.current.domElement;
    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedModule, pathAnalysisMode]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: '#0a0a1a' }}>
      {pathAnalysisMode && clickPoints.length === 1 && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(68, 200, 136, 0.9)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Click a second point to complete path analysis
        </div>
      )}
      
      {selectedModule && !pathAnalysisMode && (
        <div className="rotation-controls">
          <div className="rotation-controls-title">
            🔄 Rotate Module
          </div>
          <div className="rotation-controls-grid">
            <div className="rotation-control-group">
              <span className="rotation-label">Y-Axis (Spin):</span>
              <div className="rotation-buttons">
                <kbd>Q</kbd> or <kbd>←</kbd> Left | <kbd>E</kbd> or <kbd>→</kbd> Right
              </div>
            </div>
            <div className="rotation-control-group">
              <span className="rotation-label">X-Axis (Tilt):</span>
              <div className="rotation-buttons">
                <kbd>W</kbd> or <kbd>↑</kbd> Forward | <kbd>S</kbd> or <kbd>↓</kbd> Back
              </div>
            </div>
            <div className="rotation-control-group">
              <span className="rotation-label">Z-Axis (Roll):</span>
              <div className="rotation-buttons">
                <kbd>A</kbd> Left | <kbd>D</kbd> Right
              </div>
            </div>
            <div className="rotation-control-group">
              <span className="rotation-label">Delete Module:</span>
              <div className="rotation-buttons">
                <kbd>Delete</kbd> or <kbd>Backspace</kbd>
              </div>
            </div>
            <div className="rotation-control-group">
              <span className="rotation-label">Deselect:</span>
              <div className="rotation-buttons">
                <kbd>ESC</kbd> or click elsewhere
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Scene.displayName = 'Scene';

export default Scene;
