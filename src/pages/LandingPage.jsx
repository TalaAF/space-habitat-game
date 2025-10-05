import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/UI/Navigation';
import KnowledgeTest from '../components/UI/KnowledgeTest';
import AIAssistant from '../components/UI/AIAssistant';
import { useState } from 'react';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const moonRef = useRef(null);
  const haloRef = useRef(null);
  const engineGlowRef = useRef(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - Start far away for dramatic entrance
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      20000
    );
    camera.position.set(0, 200, 800);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // === EPIC STARFIELD SKYBOX ===
    // Multi-layered starfield for depth
    const createStarfield = (count, distance, size, color) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = distance + (Math.random() * distance * 0.3);
        
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });
      return new THREE.Points(geometry, material);
    };

    // Multiple star layers for depth
    scene.add(createStarfield(15000, 3000, 1.5, 0xffffff)); // Distant stars
    scene.add(createStarfield(8000, 2000, 1.0, 0xaaccff));  // Mid stars (blue tint)
    scene.add(createStarfield(5000, 1500, 0.8, 0xffffaa));  // Close stars (yellow tint)

    // === DRAMATIC CINEMATIC LIGHTING ===
    // Harsh sun light (like real space)
    const sunLight = new THREE.DirectionalLight(0xfff8e1, 4);
    sunLight.position.set(500, 300, 400);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 2000;
    sunLight.shadow.camera.left = -500;
    sunLight.shadow.camera.right = 500;
    sunLight.shadow.camera.top = 500;
    sunLight.shadow.camera.bottom = -500;
    scene.add(sunLight);

    // Very subtle ambient (space is dark!)
    const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.3);
    scene.add(ambientLight);

    // Rim light for dramatic silhouettes
    const rimLight = new THREE.DirectionalLight(0x4466ff, 1.5);
    rimLight.position.set(-300, 100, -400);
    scene.add(rimLight);

    // === LOAD 3D MODELS (MASSIVE SCALE) ===
    const loader = new GLTFLoader();

    // Load Moon model - EPIC MASSIVE SCALE
    loader.load(
      '/月球+三维+模型.glb',
      (gltf) => {
        const moon = gltf.scene;
        moon.position.set(-150, -100, -300); // Closer to camera
        moon.scale.set(250, 250, 250); // HUGE - dominates the view
        moon.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        moonRef.current = moon;
        scene.add(moon);
      },
      undefined,
      (error) => {
        console.log('Moon model not found, creating epic placeholder');
        // Epic fallback moon with craters
        const moonGeometry = new THREE.SphereGeometry(200, 128, 128); // MASSIVE radius
        
        // Add crater displacement
        const positions = moonGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i);
          const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(z * 0.1) * 5;
          const length = Math.sqrt(x * x + y * y + z * z);
          positions.setXYZ(i, x + (x / length) * noise, y + (y / length) * noise, z + (z / length) * noise);
        }
        moonGeometry.computeVertexNormals();
        
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0x9a9a9a,
          roughness: 0.95,
          metalness: 0.05,
          bumpScale: 8
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(-150, -100, -300); // Closer to camera
        moon.castShadow = true;
        moon.receiveShadow = true;
        moonRef.current = moon;
        scene.add(moon);
      }
    );

    // Load HALO module - EPIC SCALE
    loader.load(
      '/halo+habitat+module+3d+model.glb',
      (gltf) => {
        const halo = gltf.scene;
        halo.position.set(0, 20, -50); // Much closer to camera
        halo.scale.set(25, 25, 25); // MASSIVE scale
        halo.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        haloRef.current = halo;
        scene.add(halo);
        
        // Add engine glow for landing sequence
        const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0
        });
        const engineGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        engineGlow.position.set(0, -10, 0);
        halo.add(engineGlow);
        engineGlowRef.current = engineGlow;
      },
      undefined,
      (error) => {
        console.log('HALO model not found, creating epic placeholder');
        const haloGroup = new THREE.Group();
        
        // Main cylindrical habitat - MUCH LARGER
        const cylinderGeometry = new THREE.CylinderGeometry(20, 20, 60, 32); // Doubled size
        const cylinderMaterial = new THREE.MeshStandardMaterial({
          color: 0xdddddd,
          metalness: 0.8,
          roughness: 0.25,
          emissive: 0x222222,
          emissiveIntensity: 0.2
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.rotation.z = Math.PI / 2;
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        haloGroup.add(cylinder);

        // Add windows - larger and more visible
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const windowGeometry = new THREE.BoxGeometry(5, 3.5, 0.8); // Bigger windows
          const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            emissive: 0x88ccff,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1
          });
          const window = new THREE.Mesh(windowGeometry, windowMaterial);
          window.position.set(
            Math.cos(angle) * 21, // Adjusted for larger cylinder
            0,
            Math.sin(angle) * 21
          );
          window.lookAt(0, 0, 0);
          haloGroup.add(window);
        }

        // Solar panels - MASSIVE
        const panelGeometry = new THREE.BoxGeometry(70, 1.2, 25); // Much bigger
        const panelMaterial = new THREE.MeshStandardMaterial({
          color: 0x1a3d7c,
          metalness: 0.9,
          roughness: 0.1,
          emissive: 0x0a1d3c,
          emissiveIntensity: 0.3
        });
        const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel1.position.set(0, 25, 0); // Further out
        panel1.castShadow = true;
        const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel2.position.set(0, -25, 0); // Further out
        panel2.castShadow = true;
        haloGroup.add(panel1, panel2);

        // Docking ports - larger
        const dockGeometry = new THREE.CylinderGeometry(5, 3.5, 8, 16); // Bigger
        const dockMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          metalness: 0.7,
          roughness: 0.3
        });
        const dock = new THREE.Mesh(dockGeometry, dockMaterial);
        dock.position.set(35, 0, 0); // Adjusted for larger module
        dock.rotation.z = Math.PI / 2;
        haloGroup.add(dock);

        haloGroup.position.set(0, 20, -50); // Much closer
        haloRef.current = haloGroup;
        scene.add(haloGroup);
        
        // Engine glow - larger
        const glowGeometry = new THREE.SphereGeometry(8, 16, 16); // Bigger glow
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0
        });
        const engineGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        engineGlow.position.set(-35, 0, 0); // Adjusted for larger module
        haloGroup.add(engineGlow);
        engineGlowRef.current = engineGlow;
      }
    );

    // Animation loop with dynamic rendering
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Subtle rotation for realism
      if (moonRef.current) {
        moonRef.current.rotation.y += 0.0002;
      }

      renderer.render(scene, camera);
    };
    animate();

    // === EPIC SCROLLYTELLING ANIMATION SEQUENCE ===
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.landing-page',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2, // Smoother scrubbing
        anticipatePin: 1,
      }
    });

    // ===== PHASE 1: THE DRAMATIC APPROACH =====
    // (Scroll progress: 0% - 25%)
    masterTimeline
      .to(camera.position, {
        x: -50,
        y: 100,
        z: 400,
        duration: 3,
        ease: 'power2.inOut'
      }, 0)
      .to(camera.rotation, {
        x: -0.2,
        duration: 3,
        ease: 'power2.inOut'
      }, 0)
      // Moon sweeps past dramatically
      .to(moonRef.current ? moonRef.current.position : {}, {
        x: -100,
        y: -200,
        z: -200,
        duration: 3,
        ease: 'power1.out'
      }, 0);

    // ===== PHASE 2: FLY-IN TO HALO =====
    // (Scroll progress: 25% - 50%)
    masterTimeline
      .to(camera.position, {
        x: 80,
        y: 50,
        z: 80,
        duration: 3,
        ease: 'power2.inOut'
      }, 3)
      .to(camera.rotation, {
        x: -0.3,
        y: 0.2,
        duration: 3
      }, 3);

    // ===== PHASE 3: 360° ORBITAL INSPECTION =====
    // (Scroll progress: 50% - 70%)
    const orbitRadius = 60;
    const orbitSteps = 5;
    
    for (let i = 0; i <= orbitSteps; i++) {
      const angle = (i / orbitSteps) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      
      masterTimeline.to(camera.position, {
        x: x,
        y: 40 + Math.sin(angle * 2) * 10, // Slight bobbing
        z: z,
        duration: 1,
        ease: 'sine.inOut',
        onUpdate: () => {
          if (haloRef.current) {
            camera.lookAt(haloRef.current.position);
          }
        }
      }, 6 + i);
    }

    // ===== PHASE 4: THE LUNAR LANDING SEQUENCE =====
    // (Scroll progress: 70% - 100%)
    
    // 4a: De-orbit burn preparation
    masterTimeline
      .to(camera.position, {
        x: -40,
        y: 60,
        z: 40,
        duration: 2,
        ease: 'power1.in'
      }, 11)
      // HALO rotates for de-orbit
      .to(haloRef.current ? haloRef.current.rotation : {}, {
        y: Math.PI / 4,
        z: -Math.PI / 6,
        duration: 2,
        ease: 'power2.inOut'
      }, 11)
      // Engine glow activates
      .to(engineGlowRef.current ? engineGlowRef.current.material : {}, {
        opacity: 0.8,
        duration: 1.5,
        ease: 'power2.in'
      }, 11.5);

    // 4b: Descent arc towards lunar surface
    masterTimeline
      .to(haloRef.current ? haloRef.current.position : {}, {
        x: -120,
        y: -80,
        z: -250,
        duration: 4,
        ease: 'power1.inOut'
      }, 13)
      .to(camera.position, {
        x: -80,
        y: -20,
        z: -150,
        duration: 4,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (haloRef.current) {
            camera.lookAt(haloRef.current.position);
          }
        }
      }, 13)
      // Engine glow pulses
      .to(engineGlowRef.current ? engineGlowRef.current.material : {}, {
        opacity: 1,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2
      }, 13);

    // 4c: Final approach - Hull transparency reveal
    masterTimeline
      .to(camera.position, {
        x: -100,
        y: -60,
        z: -200,
        duration: 2,
        ease: 'power2.out'
      }, 17)
      .to({}, {
        duration: 1,
        onStart: () => {
          // Make HALO hull transparent to reveal interior
          if (haloRef.current) {
            haloRef.current.traverse((child) => {
              if (child.isMesh && child.material) {
                const originalMaterial = child.material;
                if (!originalMaterial.transparent) {
                  originalMaterial.transparent = true;
                  originalMaterial.opacity = 1;
                }
                gsap.to(originalMaterial, {
                  opacity: 0.25,
                  duration: 2,
                  ease: 'power2.inOut'
                });
              }
            });
          }
        }
      }, 18);

    // Sync content sections with camera views
    ScrollTrigger.create({
      trigger: '.section-education',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => console.log('Viewing construction types'),
    });

    ScrollTrigger.create({
      trigger: '.section-examples',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => console.log('Inspecting HALO details'),
    });

    ScrollTrigger.create({
      trigger: '.section-final-cta',
      start: 'top center',
      onEnter: () => console.log('Landing sequence initiated'),
    });

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      renderer.dispose();
    };
  }, []);

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = {
      q1: 'B',
      q2: 'C',
      q3: 'A'
    };
    const score = Object.keys(correctAnswers).filter(
      key => quizAnswers[key] === correctAnswers[key]
    ).length;
    setQuizScore(score);
  };

  return (
    <div className="landing-page">
      {/* Fixed 3D Background */}
      <canvas ref={canvasRef} className="landing-canvas" />

      {/* Scrollable Content */}
      <div className="landing-content">
        {/* Hero Section - THE MISSION */}
        <section className="section section-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Home Beyond the End
            </h1>
            <p className="hero-subtitle">
              Create visual layouts for space habitats that will support crews on the Moon, 
              in transit to Mars, and on the Martian surface. Balance structure, function, 
              and crew needs to enable humanity's sustained presence in deep space.
            </p>
            <div className="hero-scroll-hint">
              <span>Begin Mission Briefing</span>
              <span className="scroll-arrow">↓</span>
            </div>
          </div>
        </section>

        {/* Transition Section - THE CHALLENGE */}
        <section className="section section-approach">
          <div className="approach-content">
            <h2 className="approach-title">The Artemis Vision</h2>
            <p className="approach-text">
              Through the Artemis campaign, NASA is returning humans to the Moon to establish 
              a sustained presence. Space habitats are critical "homes in space" that must support 
              waste management, thermal control, life support, communications, power, food preparation, 
              medical care, sleep, and exercise. Your challenge: create and assess habitat layouts 
              that enable crews to thrive in the harshest environments in our solar system.
            </p>
          </div>
        </section>

        {/* Educational Section - THE BUILDING BLOCKS */}
        <section className="section section-education">
          <div className="content-wrapper">
            <h2 className="section-title">The Building Blocks of Deep Space</h2>
            <p className="section-intro">
              Three fundamental construction approaches, each with critical engineering trade-offs. 
              Your choice determines launch mass, deployment complexity, and mission feasibility.
            </p>
            <div className="education-grid">
              <div className="education-card">
                <div className="card-type-badge">TYPE 01</div>
                <h3>Rigid Construction</h3>
                <p>
                  <strong>The proven workhorse.</strong> Launched fully assembled, these metallic 
                  habitats offer the highest reliability and protection. Think ISS modules and 
                  the HALO unit—mission-ready on arrival.
                </p>
                <div className="card-stats">
                  <span>✓ Mission-ready on arrival</span>
                  <span>✗ Heavy, limited by fairing size</span>
                  <span>Mass Multiplier: 1.0×</span>
                </div>
              </div>
              <div className="education-card">
                <div className="card-type-badge">TYPE 02</div>
                <h3>Inflatable Habitats</h3>
                <p>
                  <strong>The smart solution for volume.</strong> Launched in a compressed state, 
                  these habitats expand in space to create massive living areas. Best volume-to-mass 
                  ratio—3× more space for the same launch weight.
                </p>
                <div className="card-stats">
                  <span>✓ Massive volume, low mass</span>
                  <span>✗ Complex deployment</span>
                  <span>Mass Multiplier: 0.7×</span>
                </div>
              </div>
              <div className="education-card">
                <div className="card-type-badge">TYPE 03</div>
                <h3>ISRU Construction</h3>
                <p>
                  <strong>Living off the land.</strong> This advanced method uses robotic systems 
                  to build habitats from local resources like lunar regolith or Martian soil. 
                  Drastically reduces launch mass.
                </p>
                <div className="card-stats">
                  <span>✓ Minimal launch mass</span>
                  <span>✗ Requires construction equipment</span>
                  <span>Mass Multiplier: 0.4×</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NASA Examples Section - INSPIRATION FROM NASA'S DRAWING BOARD */}
        <section className="section section-examples">
          <div className="content-wrapper">
            <h2 className="section-title">Inspiration from NASA's Drawing Board</h2>
            <p className="section-intro">
              You're building upon a legacy of incredible achievements. These historic and future 
              missions prove that humans can thrive in space—and show what's possible when we dare to dream big.
            </p>
            <div className="examples-carousel">
              <div className="example-card">
                <div className="example-card-inner">
                  <div className="example-card-front">
                    <div className="example-image skylab-image">
                      <div className="example-label">1973-1974</div>
                      <div className="example-title-overlay">
  <img src="public/skylab.jpeg" alt="Skylab" className="title-image" />
</div>
                    </div>
                  </div>
                  <div className="example-card-back">
                    <div className="example-content">
                      <h3>Skylab: America's First Home in Space</h3>
                      <p>
                        A triumph of engineering, Skylab was built from the repurposed upper stage 
                        of a Saturn V rocket. From 1973-1974, it proved humans could live and work 
                        in space for months at a time, paving the way for all future stations.
                      </p>
                      <ul className="example-specs">
                        <li><span className="spec-label">Crew:</span> 3 astronauts</li>
                        <li><span className="spec-label">Record:</span> 84 days continuous</li>
                        <li><span className="spec-label">Volume:</span> 361 m³ pressurized</li>
                        <li><span className="spec-label">Legacy:</span> First US space station</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-card">
                <div className="example-card-inner">
                  <div className="example-card-front">
                    <div className="example-image iss-image">
                      <div className="example-label">1998-Present</div>
                      <div className="example-title-overlay"><img src="public/iss.jpeg" alt="International Space Station" className="title-image" /></div>
                    </div>
                  </div>
                  <div className="example-card-back">
                    <div className="example-content">
                      <h3>International Space Station: A City in Orbit</h3>
                      <p>
                        The ultimate example of modular design and international collaboration. 
                        For over two decades, the ISS has been a continuously inhabited laboratory, 
                        pushing the boundaries of science and long-duration spaceflight.
                      </p>
                      <ul className="example-specs">
                        <li><span className="spec-label">Crew:</span> Up to 7 people</li>
                        <li><span className="spec-label">Power:</span> 120 kW solar arrays</li>
                        <li><span className="spec-label">Volume:</span> 388 m³ habitable</li>
                        <li><span className="spec-label">Legacy:</span> 20+ years occupied</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            <div className="example-card">
              <div className="example-card-inner">
                <div className="example-card-front">
                  <div className="example-image iss-image">
                    <div className="example-label">2020s-Future</div>
                    <div className="example-title-overlay"><img src="public/Lunar.jpeg" alt="Lunar Gateway" className="title-image" /></div>
                  </div>
                </div>
                <div className="example-card-back">
                  <div className="example-content">
                    <h3>Lunar Gateway: Humanity's Staging Point to the Moon</h3>
                    <p>
                      The future of exploration. The Gateway, with the HALO module at its heart, 
                      will be the first space station in lunar orbit, serving as a command center 
                      and home for Artemis astronauts venturing to the lunar surface.
                    </p>
                    <ul className="example-specs">
                      <li> Crew: Up to 4 astronauts</li>
                      <li> Location: Lunar orbit (NRHO)</li>
                      <li> Modules: HALO, PPE, I-HAB</li>
                      <li> Mission: Gateway to Mars</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 

        {/* Knowledge Test Section */}
        <section className="section section-quiz">
          <div className="content-wrapper">
            <KnowledgeTest />
          </div>
        </section>

        {/* Final CTA Section - YOUR MISSION AWAITS */}
        <section className="section section-final-cta">
          <div className="content-wrapper">
            <h2 className="final-cta-title">Mission Control: You Are Go for Design</h2>
            <p className="final-cta-subtitle">
              You've learned the fundamentals—now it's time to put them into practice. 
              Enter the Habitat Design Lab and create your own space habitat layout using 
              real NASA modules, engineering constraints, and mission parameters. Define shapes, 
              partition volumes, and optimize layouts for crew health and mission success.
            </p>
            <Link to="/designer" className="btn-cta btn-cta-large btn-cta-pulse">
              Launch the Design Lab
              <span className="btn-subtitle">Start Building Your Habitat</span>
            </Link>
          </div>
        </section>
      </div>
      
      <Navigation />
      
      {!aiAssistantOpen && (
        <button
          className="ai-assistant-fab"
          onClick={() => setAiAssistantOpen(true)}
          title="AI Assistant - Ask me anything about space habitats!"
        >
          🤖
        </button>
      )}
      {aiAssistantOpen && (
        <AIAssistant onClose={() => setAiAssistantOpen(false)} />
      )}
    </div>
  );
};

export default LandingPage;
