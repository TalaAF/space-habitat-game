import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const moonRef = useRef(null);
  const haloRef = useRef(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 50, 150);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;

    // Starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 2000;
      starPositions[i + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(100, 50, 50);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x6699ff, 0.5);
    fillLight.position.set(-50, 20, -50);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(0, 30, -100);
    scene.add(rimLight);

    // Load 3D Models
    const loader = new GLTFLoader();

    // Load Moon model
    loader.load(
      '/月球+三维+模型.glb',
      (gltf) => {
        const moon = gltf.scene;
        moon.position.set(-80, -30, -100);
        moon.scale.set(40, 40, 40);
        moonRef.current = moon;
        scene.add(moon);
      },
      undefined,
      (error) => {
        console.log('Moon model not found, creating placeholder');
        // Fallback: Create a moon sphere
        const moonGeometry = new THREE.SphereGeometry(30, 64, 64);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          roughness: 0.9,
          metalness: 0.1
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(-80, -30, -100);
        moonRef.current = moon;
        scene.add(moon);
      }
    );

    // Load HALO module
    loader.load(
      '/halo+habitat+module+3d+model.glb',
      (gltf) => {
        const halo = gltf.scene;
        halo.position.set(0, 0, 0);
        halo.scale.set(5, 5, 5);
        haloRef.current = halo;
        scene.add(halo);
      },
      undefined,
      (error) => {
        console.log('HALO model not found, creating placeholder');
        // Fallback: Create a cylindrical habitat
        const haloGroup = new THREE.Group();
        
        const cylinderGeometry = new THREE.CylinderGeometry(8, 8, 20, 32);
        const cylinderMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          metalness: 0.7,
          roughness: 0.3
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.rotation.x = Math.PI / 2;
        haloGroup.add(cylinder);

        // Add solar panels
        const panelGeometry = new THREE.BoxGeometry(20, 0.5, 8);
        const panelMaterial = new THREE.MeshStandardMaterial({
          color: 0x1a3d7c,
          metalness: 0.8,
          roughness: 0.2
        });
        const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel1.position.set(0, 10, 0);
        const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel2.position.set(0, -10, 0);
        haloGroup.add(panel1, panel2);

        haloRef.current = haloGroup;
        scene.add(haloGroup);
      }
    );

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Gentle rotation for visual interest
      if (haloRef.current) {
        haloRef.current.rotation.y += 0.001;
      }
      if (moonRef.current) {
        moonRef.current.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // GSAP ScrollTrigger animations
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.landing-page',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // Animation sequence
    timeline
      // Start: Wide shot
      .to(camera.position, {
        x: 20,
        y: 40,
        z: 120,
        duration: 1
      }, 0)
      // Mid: Orbit around HALO
      .to(camera.position, {
        x: 50,
        y: 20,
        z: 50,
        duration: 1
      }, 1)
      // Approach HALO
      .to(camera.position, {
        x: 25,
        y: 5,
        z: 25,
        duration: 1
      }, 2)
      // Close-up and reveal interior
      .to(camera.position, {
        x: 15,
        y: 0,
        z: 15,
        duration: 1
      }, 3);

    // HALO transparency reveal
    gsap.to({}, {
      scrollTrigger: {
        trigger: '.section-quiz',
        start: 'top center',
        onEnter: () => {
          if (haloRef.current) {
            haloRef.current.traverse((child) => {
              if (child.isMesh) {
                child.material.transparent = true;
                gsap.to(child.material, {
                  opacity: 0.3,
                  duration: 1.5
                });
              }
            });
          }
        },
        onLeaveBack: () => {
          if (haloRef.current) {
            haloRef.current.traverse((child) => {
              if (child.isMesh && child.material.transparent) {
                gsap.to(child.material, {
                  opacity: 1,
                  duration: 1.5
                });
              }
            });
          }
        }
      }
    });

    // Camera always looks at HALO
    const updateCameraTarget = () => {
      camera.lookAt(0, 0, 0);
    };
    timeline.eventCallback('onUpdate', updateCameraTarget);

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
        {/* Hero Section */}
        <section className="section section-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Become a Deep Space Architect
            </h1>
            <p className="hero-subtitle">
              Design life-sustaining habitats for humanity's journey beyond Earth
            </p>
            <Link to="/designer" className="btn-cta">
              <span className="btn-icon">🚀</span>
              Launch the Design Lab
            </Link>
            <div className="hero-scroll-hint">
              <span>Scroll to explore</span>
              <span className="scroll-arrow">↓</span>
            </div>
          </div>
        </section>

        {/* Educational Section */}
        <section className="section section-education">
          <div className="content-wrapper">
            <h2 className="section-title">What is a Space Habitat?</h2>
            <div className="education-grid">
              <div className="education-card">
                <div className="card-icon">🏗️</div>
                <h3>Rigid Structures</h3>
                <p>
                  Traditional metal and composite modules like the ISS. These offer maximum
                  protection and durability but are heavy and expensive to launch.
                </p>
                <div className="card-stats">
                  <span>Mass Multiplier: 1.0×</span>
                  <span>Launch Complexity: High</span>
                </div>
              </div>
              <div className="education-card">
                <div className="card-icon">🎈</div>
                <h3>Inflatable Modules</h3>
                <p>
                  Expandable habitats like Bigelow's BEAM that launch compact and inflate
                  in space. Lighter and more spacious, but require careful deployment.
                </p>
                <div className="card-stats">
                  <span>Mass Multiplier: 0.7×</span>
                  <span>Volume: 3× larger</span>
                </div>
              </div>
              <div className="education-card">
                <div className="card-icon">🌙</div>
                <h3>ISRU Construction</h3>
                <p>
                  In-Situ Resource Utilization: Build using local materials like lunar
                  regolith or Martian soil. Minimal launch mass, but requires setup time.
                </p>
                <div className="card-stats">
                  <span>Mass Multiplier: 0.4×</span>
                  <span>Setup: Complex</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NASA Examples Section */}
        <section className="section section-examples">
          <div className="content-wrapper">
            <h2 className="section-title">Inspired by NASA's Legacy</h2>
            <div className="examples-carousel">
              <div className="example-card">
                <div className="example-image iss-image">
                  <div className="example-label">1998-Present</div>
                </div>
                <div className="example-content">
                  <h3>International Space Station</h3>
                  <p>
                    The largest human-made structure in low Earth orbit. A marvel of
                    international cooperation, hosting continuous human presence since 2000.
                  </p>
                  <ul className="example-specs">
                    <li>🏠 Crew: Up to 7</li>
                    <li>⚡ Power: 120 kW solar arrays</li>
                    <li>📏 Volume: 388 m³ pressurized</li>
                  </ul>
                </div>
              </div>
              <div className="example-card">
                <div className="example-image gateway-image">
                  <div className="example-label">2020s</div>
                </div>
                <div className="example-content">
                  <h3>Lunar Gateway</h3>
                  <p>
                    NASA's planned space station in lunar orbit. Will serve as a staging
                    point for Moon missions and a testbed for deep space technologies.
                  </p>
                  <ul className="example-specs">
                    <li>🏠 Crew: Up to 4</li>
                    <li>🌙 Orbit: Near-Rectilinear Halo</li>
                    <li>🔬 Modules: HALO, PPE, I-HAB</li>
                  </ul>
                </div>
              </div>
              <div className="example-card">
                <div className="example-image skylab-image">
                  <div className="example-label">1973-1979</div>
                </div>
                <div className="example-content">
                  <h3>Skylab</h3>
                  <p>
                    America's first space station. Pioneered long-duration spaceflight
                    research and proved humans could live and work in space for months.
                  </p>
                  <ul className="example-specs">
                    <li>🏠 Crew: 3</li>
                    <li>⏱️ Longest mission: 84 days</li>
                    <li>📏 Volume: 361 m³</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Quiz Section */}
        <section className="section section-quiz">
          <div className="content-wrapper">
            <h2 className="section-title">Test Your Knowledge</h2>
            <div className="quiz-container">
              <div className="quiz-question">
                <h3>1. What is the primary advantage of inflatable habitats?</h3>
                <div className="quiz-options">
                  <button
                    className={`quiz-option ${quizAnswers.q1 === 'A' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q1', 'A')}
                  >
                    A. They are cheaper to manufacture
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q1 === 'B' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q1', 'B')}
                  >
                    B. They provide more volume for less launch mass
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q1 === 'C' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q1', 'C')}
                  >
                    C. They are more durable than metal
                  </button>
                </div>
              </div>

              <div className="quiz-question">
                <h3>2. How many people can the ISS accommodate?</h3>
                <div className="quiz-options">
                  <button
                    className={`quiz-option ${quizAnswers.q2 === 'A' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q2', 'A')}
                  >
                    A. Up to 3
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q2 === 'B' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q2', 'B')}
                  >
                    B. Up to 5
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q2 === 'C' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q2', 'C')}
                  >
                    C. Up to 7
                  </button>
                </div>
              </div>

              <div className="quiz-question">
                <h3>3. What does ISRU stand for?</h3>
                <div className="quiz-options">
                  <button
                    className={`quiz-option ${quizAnswers.q3 === 'A' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q3', 'A')}
                  >
                    A. In-Situ Resource Utilization
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q3 === 'B' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q3', 'B')}
                  >
                    B. International Space Research Unit
                  </button>
                  <button
                    className={`quiz-option ${quizAnswers.q3 === 'C' ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer('q3', 'C')}
                  >
                    C. Integrated Systems for Rocket Upgrades
                  </button>
                </div>
              </div>

              <button className="btn-submit-quiz" onClick={handleSubmitQuiz}>
                Submit Answers
              </button>

              {quizScore !== null && (
                <div className="quiz-result">
                  <h3>Your Score: {quizScore}/3</h3>
                  <p>
                    {quizScore === 3 && "Perfect! You're ready to be a space architect! 🌟"}
                    {quizScore === 2 && "Great job! You have strong knowledge of space habitats! 🚀"}
                    {quizScore === 1 && "Good start! Keep learning about space exploration! 🌙"}
                    {quizScore === 0 && "Keep exploring! The design lab will teach you more! 🛸"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section section-final-cta">
          <div className="content-wrapper">
            <h2 className="final-cta-title">Ready to Build the Future?</h2>
            <p className="final-cta-subtitle">
              Design your own space habitat using NASA-inspired modules and real engineering constraints.
              Balance power, life support, crew comfort, and mission requirements.
            </p>
            <Link to="/designer" className="btn-cta btn-cta-large">
              <span className="btn-icon">🚀</span>
              Launch the Design Lab
            </Link>
            <div className="final-cta-features">
              <div className="feature-item">
                <span className="feature-icon">🏗️</span>
                <span>11 Module Types</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Real NASA Specs</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Mission Validation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛤️</span>
                <span>Path Analysis</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
