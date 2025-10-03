import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const Scene = ({ habitatStructure, modules, onModulePositionUpdate }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const dragControlsRef = useRef(null);
  const moduleMeshesRef = useRef(new Map());
  const animationFrameRef = useRef(null);

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
      moduleMeshesRef.current.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
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
    habitat.add(floor);

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
    moduleMeshesRef.current.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
        moduleMeshesRef.current.delete(id);
      }
    });

    // Add new modules
    modules.forEach(module => {
      if (!moduleMeshesRef.current.has(module.id)) {
        const mesh = createModule(module);
        scene.add(mesh);
        moduleMeshesRef.current.set(module.id, mesh);
        console.log('Added module:', module.id, 'at', module.position);
      } else {
        const mesh = moduleMeshesRef.current.get(module.id);
        mesh.position.set(module.position.x, module.position.y, module.position.z);
      }
    });

    // Setup drag controls
    if (dragControlsRef.current) dragControlsRef.current.dispose();
    
    const objects = Array.from(moduleMeshesRef.current.values());
    if (objects.length > 0 && cameraRef.current && rendererRef.current) {
      const drag = new DragControls(objects, cameraRef.current, rendererRef.current.domElement);
      
      drag.addEventListener('dragstart', () => {
        if (controlsRef.current) controlsRef.current.enabled = false;
      });
      
      drag.addEventListener('drag', (e) => {
        e.object.position.y = 0.5;
      });
      
      drag.addEventListener('dragend', (e) => {
        if (controlsRef.current) controlsRef.current.enabled = true;
        
        let x = Math.round(e.object.position.x);
        let z = Math.round(e.object.position.z);
        const dist = Math.sqrt(x * x + z * z);
        const maxR = habitatStructure.radius - 1;
        
        if (dist > maxR) {
          const angle = Math.atan2(z, x);
          x = Math.round(Math.cos(angle) * maxR);
          z = Math.round(Math.sin(angle) * maxR);
        }
        
        const pos = { x, y: 0.5, z };
        e.object.position.set(pos.x, pos.y, pos.z);
        
        if (onModulePositionUpdate) {
          onModulePositionUpdate(e.object.userData.moduleId, pos);
        }
      });
      
      dragControlsRef.current = drag;
    }
  }, [modules, habitatStructure, onModulePositionUpdate]);

  const createModule = (module) => {
    const types = {
      living: { geo: new THREE.BoxGeometry(1, 1, 1), color: 0xff6644 },
      lab: { geo: new THREE.CylinderGeometry(0.5, 0.5, 1, 8), color: 0x44ff88 },
      power: { geo: new THREE.BoxGeometry(0.8, 1.2, 0.8), color: 0xffff44 },
      greenhouse: { geo: new THREE.SphereGeometry(0.6, 16, 16), color: 0x44ff44 },
      medical: { geo: new THREE.BoxGeometry(1.2, 1, 1.2), color: 0xff4488 },
      airlock: { geo: new THREE.CylinderGeometry(0.4, 0.4, 0.8, 6), color: 0x4444ff },
      storage: { geo: new THREE.BoxGeometry(1.2, 0.8, 1.2), color: 0x8844ff }
    };
    
    const spec = types[module.type] || { geo: new THREE.BoxGeometry(1, 1, 1), color: 0x888888 };
    const mesh = new THREE.Mesh(spec.geo, new THREE.MeshStandardMaterial({ color: spec.color }));
    mesh.position.set(module.position.x, module.position.y, module.position.z);
    mesh.userData.moduleId = module.id;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  return <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: '#0a0a1a' }} />;
};

export default Scene;
