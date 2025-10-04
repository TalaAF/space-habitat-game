import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { findPath, analyzePath } from '../../utils/pathAnalysis';
import { createModuleModel } from '../../utils/modelCreators';

const Scene = ({ habitatStructure, modules, onModulePositionUpdate, pathAnalysisMode, onPathAnalysis }) => {
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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
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

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
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

    const { shape, radius, height } = habitatStructure;

    // Create shell
    let shellGeo;
    if (shape === 'cylinder') {
      shellGeo = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
    } else {
      shellGeo = new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    }
    
    const shell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({
      color: 0x2244aa,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    }));
    if (shape === 'cylinder') shell.position.y = height / 2;
    habitat.add(shell);

    // Create floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a2a3a })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    floor.receiveShadow = true;
    habitat.add(floor);
    floorRef.current = floor;

    // Create grid
    const grid = new THREE.GridHelper(radius * 2, 20, 0x4488ff, 0x223355);
    grid.position.y = 0.02;
    habitat.add(grid);

    scene.add(habitat);
    console.log('Habitat built successfully');
  }, [habitatStructure]);

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
        }
      });
      
      drag.addEventListener('drag', (e) => {
        // Move the parent group, not just the helper
        const parentGroup = e.object.userData.parentGroup;
        if (parentGroup) {
          parentGroup.position.x = e.object.position.x;
          parentGroup.position.y = 0.5;
          parentGroup.position.z = e.object.position.z;
          // Reset helper's local position
          e.object.position.set(0, (parentGroup.userData.size || 1.5) / 2, 0);
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
        
        const pos = { x, y: 0.5, z };
        parentGroup.position.set(pos.x, pos.y, pos.z);
        
        if (onModulePositionUpdate) {
          onModulePositionUpdate(parentGroup.userData.moduleId, pos);
        }
      });
      
      dragControlsRef.current = drag;
    }
  }, [modules, habitatStructure, onModulePositionUpdate]);

  const createModule = (module) => {
    // Create detailed 3D model using NASA-inspired geometries
    const moduleGroup = createModuleModel(module.type, {
      id: module.id,
      type: module.type,
      moduleId: module.id,
      size: module.size || 1.5,
      mass: module.mass,
      power: module.power,
      lifeSupport: module.lifeSupport,
      tags: module.tags
    });
    
    // Set position
    moduleGroup.position.set(module.position.x, module.position.y, module.position.z);
    
    // Apply scale if needed (models are designed at 1:1 scale)
    const scale = (module.size || 1.5) / 1.5;
    moduleGroup.scale.set(scale, scale, scale);
    
    // Add invisible bounding box mesh for drag detection
    // This ensures DragControls can raycast and detect the entire model
    const size = module.size || 1.5;
    const dragHelper = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshBasicMaterial({ 
        visible: false // Invisible but still detectable by raycaster
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
      if (!pathAnalysisMode || !floorRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObject(floorRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const distance = Math.sqrt(point.x ** 2 + point.z ** 2);
        
        if (distance > habitatStructure.radius - 0.5) {
          console.warn('Click outside habitat boundaries');
          return;
        }

        // Add marker
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        marker.position.set(point.x, 0.1, point.z);
        marker.userData.isPathMarker = true;
        sceneRef.current.add(marker);

        setClickPoints(prev => {
          const newPoints = [...prev, { x: point.x, z: point.z, marker }];
          
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
  }, [pathAnalysisMode, habitatStructure]);

  // Calculate and visualize path
  const calculatePath = (start, end) => {
    console.log('Calculating path from', start, 'to', end);

    // Clear previous visualization
    clearPathVisualization();

    // Get module meshes as obstacles
    const obstacles = Array.from(moduleMeshesRef.current.values());

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

    // Report results (schedule for next render to avoid setState during render)
    setTimeout(() => {
      if (onPathAnalysis) {
        onPathAnalysis(analysis);
      }
    }, 0);
  };

  // Visualize path with SEGMENTED TUBE approach
  const visualizePath = (pathPoints, analysis) => {
    if (!sceneRef.current) return;

    const pathGroup = new THREE.Group();
    let hasViolation = false;

    // Create individual tube segments with color coding
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i];
      const end = pathPoints[i + 1];
      const segmentData = analysis.segments[i];

      // Create curve for TubeGeometry
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(start.x, 0.3, start.z),
        new THREE.Vector3(end.x, 0.3, end.z)
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

    // Remove markers
    clickPoints.forEach(point => {
      if (point.marker) {
        sceneRef.current.remove(point.marker);
        point.marker.geometry.dispose();
        point.marker.material.dispose();
      }
    });
    setClickPoints([]);
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
  }, [pathAnalysisMode]);

  // Disable drag controls in path analysis mode
  useEffect(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.enabled = !pathAnalysisMode;
    }
  }, [pathAnalysisMode]);

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
    </div>
  );
};

export default Scene;
