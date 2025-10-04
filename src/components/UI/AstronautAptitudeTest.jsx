import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/aptitudeTest.css';

const AstronautAptitudeTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [textInput, setTextInput] = useState('');

  // Question Type 1: Engineering Trade-Off (Multiple Choice)
  const tradeOffQuestions = [
    {
      type: 'trade-off',
      id: 'to1',
      title: 'The Mass Budget Challenge',
      briefing: 'Your mission is to the Lunar Surface, where the mass limit is 12 metric tons. You have space for two more modules. Choose the combination that adds the most scientific and life support capability without exceeding the mass limit.',
      options: [
        {
          id: 'A',
          label: 'Maximum Science',
          diagram: `┌─────────────────────────┐
│    Laboratory Module    │
│     Mass: 3.2 tons     │
│  Volume: 40 m³         │
└─────────────────────────┘
         +
┌─────────────────────────┐
│    Medical Bay Module   │
│     Mass: 2.8 tons     │
│  Volume: 35 m³         │
└─────────────────────────┘
   TOTAL: 6.0 tons`,
        },
        {
          id: 'B',
          label: 'Utility Focus',
          diagram: `┌─────────────────────────┐
│   Greenhouse Module     │
│     Mass: 2.0 tons     │
│  Volume: 45 m³         │
└─────────────────────────┘
         +
┌─────────────────────────┐
│   Workshop Module       │
│     Mass: 2.0 tons     │
│  Volume: 30 m³         │
└─────────────────────────┘
   TOTAL: 4.0 tons`,
        },
        {
          id: 'C',
          label: 'Balanced Capability',
          diagram: `┌─────────────────────────┐
│    Laboratory Module    │
│     Mass: 3.2 tons     │
│  Volume: 40 m³         │
└─────────────────────────┘
         +
┌─────────────────────────┐
│   Greenhouse Module     │
│     Mass: 2.0 tons     │
│  Volume: 45 m³         │
└─────────────────────────┘
   TOTAL: 5.2 tons`,
        }
      ],
      correctAnswer: 'C',
      feedback: {
        correct: 'Excellent choice! Option C provides the optimal balance for lunar operations. The Laboratory (3.2t) enables advanced scientific research, while the Greenhouse (2.0t) provides critical life support through food production and air regeneration. At 5.2 tons total, you are well within the 12-ton lunar lander limit while maximizing mission capability.',
        incorrect: 'Not quite. While Option A offers strong scientific capability, at 6.0 tons it leaves less margin for other systems. Option B at 4.0 tons is conservative but lacks scientific research capacity. Option C (5.2 tons) strikes the perfect balance: Laboratory for research + Greenhouse for life support, both within the 12-ton budget.'
      }
    },
    {
      type: 'trade-off',
      id: 'to2',
      title: 'The Power Generation Dilemma',
      briefing: 'Your Mars habitat needs 15 kW of continuous power. Solar panels work during the day, but Mars nights last 12+ hours. Choose the optimal power solution.',
      options: [
        {
          id: 'A',
          label: 'Solar Only',
          diagram: `┌─────────────────────────┐
│  Large Solar Array      │
│   Peak: 25 kW (day)     │
│   Night: 0 kW           │
└─────────────────────────┘
    No backup power
    Mass: 2.5 tons`,
        },
        {
          id: 'B',
          label: 'Solar + Battery',
          diagram: `┌─────────────────────────┐
│  Solar Array (15 kW)    │
└─────────────────────────┘
         +
┌─────────────────────────┐
│  Battery Bank (180 kWh) │
│  12-hour night coverage │
└─────────────────────────┘
    Mass: 4.2 tons`,
        },
        {
          id: 'C',
          label: 'Nuclear Reactor',
          diagram: `┌─────────────────────────┐
│   Kilopower Reactor     │
│   24/7: 10 kW steady    │
│   + Small Solar: 5 kW   │
└─────────────────────────┘
    Continuous baseline
    Mass: 3.8 tons`,
        }
      ],
      correctAnswer: 'B',
      feedback: {
        correct: 'Correct! Solar + Battery is the proven solution for Mars. During the 12-hour day, solar panels charge batteries while powering the habitat. At night, batteries provide the full 15 kW. This system (4.2t) offers reliability and is based on NASA Mars mission architecture. The mass is justified by the 24/7 operational capability.',
        incorrect: 'Consider the day/night cycle. Option A fails during the 12-hour Martian night—catastrophic for life support. Option C seems appealing, but at 10 kW the reactor alone cannot meet the 15 kW requirement, and nuclear systems face regulatory challenges. Option B (Solar + Battery) is the NASA-validated solution for Mars surface power.'
      }
    },
    {
      type: 'trade-off',
      id: 'to3',
      title: 'The Radiation Protection Trade-Off',
      briefing: 'For a deep space mission, your crew needs protection from cosmic radiation. You have 8 metric tons available for shielding. Choose the most effective approach.',
      options: [
        {
          id: 'A',
          label: 'Water Walls',
          diagram: `┌─────────────────────────┐
│  Water-filled Bladders  │
│  Surrounding habitat    │
│  Effectiveness: 85%     │
└─────────────────────────┘
    Dual-use: Shielding
    + Emergency water supply
    Mass: 8.0 tons`,
        },
        {
          id: 'B',
          label: 'Lead Shielding',
          diagram: `┌─────────────────────────┐
│   Dense Lead Plates     │
│   Partial coverage      │
│   Effectiveness: 70%    │
└─────────────────────────┘
    Heavy, limited coverage
    Mass: 8.0 tons`,
        },
        {
          id: 'C',
          label: 'Polyethylene Foam',
          diagram: `┌─────────────────────────┐
│  Hydrogen-rich Polymer  │
│  Full habitat coverage  │
│  Effectiveness: 90%     │
└─────────────────────────┘
    Lightweight, full wrap
    Mass: 4.5 tons`,
        }
      ],
      correctAnswer: 'A',
      feedback: {
        correct: 'Outstanding! Water walls are NASA\'s preferred solution for deep space radiation protection. At 85% effectiveness, water shields against both cosmic rays and solar particle events. The critical advantage: it serves dual purposes as both shielding AND emergency water supply. This redundancy is essential for long-duration missions.',
        incorrect: 'Let\'s analyze the options. Option B (lead) is less effective (70%) and offers no secondary benefits. Option C (polyethylene) has the best shielding (90%) but uses only 4.5 tons—you\'re leaving 3.5 tons of capacity unused! Option A (water walls) optimally uses your full 8-ton budget while providing dual-use functionality: radiation protection + emergency water reserves.'
      }
    }
  ];

  // Question Type 2: Layout Puzzle (Clickable Zones)
  const layoutQuestions = [
    {
      type: 'layout',
      id: 'lay1',
      title: 'The Contamination Control Challenge',
      briefing: 'To maintain crew health, you must separate "clean" and "dirty" zones. Place the Hygiene Module [H] in the safest location.',
      fixedModules: [
        { id: 'galley', symbol: '🍽️', label: 'Galley', position: { x: 50, y: 50 }, zone: 'top' }
      ],
      dropZones: [
        { 
          id: 'zone1', 
          label: 'Adjacent to Galley', 
          position: { x: 150, y: 50 },
          correct: false,
          feedback: 'Hazard! Placing a hygiene unit next to a food preparation area is a major contamination risk. NASA human factors guidelines require spatial separation between "wet" facilities and food areas.'
        },
        { 
          id: 'zone2', 
          label: 'Opposite Side', 
          position: { x: 250, y: 150 },
          correct: false,
          feedback: 'Good spatial separation from the Galley, but not optimal. This location doesn\'t account for the airlock proximity principle—dirty facilities should cluster together.'
        },
        { 
          id: 'zone3', 
          label: 'Near Airlock', 
          position: { x: 50, y: 250 },
          correct: true,
          feedback: 'Optimal placement! Locating the "dirty" Hygiene module near the exterior Airlock, far from the "clean" Galley, is excellent design practice. This follows NASA\'s zoning principle: cluster contamination-prone areas together and isolate them from food preparation zones.'
        }
      ],
      airlock: { position: { x: 50, y: 300 }, symbol: '🚪', label: 'Airlock' }
    },
    {
      type: 'layout',
      id: 'lay2',
      title: 'The Noise Isolation Challenge',
      briefing: 'Crew sleep quality is critical for mission success. Place the Living Quarters [🛏️] in the location with the least noise disturbance.',
      fixedModules: [
        { id: 'exercise', symbol: '🏋️', label: 'Exercise', position: { x: 50, y: 50 }, zone: 'top' },
        { id: 'command', symbol: '🖥️', label: 'Command', position: { x: 250, y: 50 }, zone: 'right' }
      ],
      dropZones: [
        { 
          id: 'zone1', 
          label: 'Next to Exercise', 
          position: { x: 150, y: 50 },
          correct: false,
          feedback: 'Poor choice! Exercise equipment generates significant noise and vibration. Placing sleeping quarters adjacent would result in chronic sleep disruption and crew fatigue—a serious safety risk.'
        },
        { 
          id: 'zone2', 
          label: 'Between Both', 
          position: { x: 150, y: 150 },
          correct: false,
          feedback: 'Marginal placement. While you\'ve added some distance, this location is still exposed to noise from both the Exercise module and the 24/7 operations in Command. Crew rest requires maximum isolation.'
        },
        { 
          id: 'zone3', 
          label: 'Isolated Corner', 
          position: { x: 50, y: 250 },
          correct: true,
          feedback: 'Excellent! This location maximizes distance from both the noisy Exercise module and the always-active Command center. NASA human factors research shows that acoustic isolation is the #1 factor for crew sleep quality on long-duration missions. This placement follows ISS best practices.'
        }
      ]
    },
    {
      type: 'layout',
      id: 'lay3',
      title: 'The Emergency Egress Challenge',
      briefing: 'During emergencies, crew must reach the airlock quickly. Place the Living Quarters [🛏️] to ensure the fastest evacuation path.',
      fixedModules: [
        { id: 'lab', symbol: '🔬', label: 'Laboratory', position: { x: 150, y: 50 }, zone: 'top' },
        { id: 'storage', symbol: '📦', label: 'Storage', position: { x: 250, y: 150 }, zone: 'right' }
      ],
      dropZones: [
        { 
          id: 'zone1', 
          label: 'Far Corner', 
          position: { x: 250, y: 250 },
          correct: false,
          feedback: 'Hazardous placement! This location is the farthest from the airlock and requires navigating around multiple modules. In a decompression emergency, every second counts. NASA requires direct, unobstructed paths to emergency exits.'
        },
        { 
          id: 'zone2', 
          label: 'Mid-Section', 
          position: { x: 150, y: 150 },
          correct: false,
          feedback: 'Moderate placement. You\'ve reduced the distance, but the path to the airlock still requires maneuvering around the Laboratory. Emergency egress paths must be as direct as possible.'
        },
        { 
          id: 'zone3', 
          label: 'Adjacent to Airlock', 
          position: { x: 50, y: 200 },
          correct: true,
          feedback: 'Perfect! Positioning Living Quarters directly adjacent to the Airlock ensures the fastest possible emergency evacuation. This follows NASA\'s critical safety principle: sleeping crew should have immediate access to emergency egress routes. In microgravity, direct line-of-sight paths save precious seconds during decompression events.'
        }
      ],
      airlock: { position: { x: 50, y: 250 }, symbol: '🚪', label: 'Airlock' }
    }
  ];

  // Question Type 3: Systems Check (Fill-in-the-Blank)
  const systemsCheckQuestions = [
    {
      type: 'systems-check',
      id: 'sc1',
      title: 'Translation Path Clearance Standard',
      briefing: 'To ensure crew can move freely and safely, especially during an emergency, NASA mandates a minimum clear width for all primary translation paths.',
      question: 'All translation paths must have a minimum clearance of',
      unit: 'meters',
      correctAnswers: ['1.0', '1', '1.00'],
      tolerance: 0.05,
      feedback: {
        correct: 'Correct! The 1.0-meter minimum translation path width is a critical safety standard you must maintain in your designs. This width allows crew members to pass each other and accommodates equipment transport, even in bulky EVA suits.',
        incorrect: 'Incorrect. The required minimum clearance is 1.0 meters. This ensures enough space for crew and equipment passage, especially during emergencies when personnel may be wearing pressurized suits. This standard comes from NASA-STD-3001 Human Systems Integration Requirements.'
      }
    },
    {
      type: 'systems-check',
      id: 'sc2',
      title: 'Atmospheric Pressure Requirement',
      briefing: 'Maintaining proper cabin pressure is critical for crew health and safety. Too low and crew suffer hypoxia; too high creates fire risk and material stress.',
      question: 'The standard habitable cabin pressure for U.S. spacecraft is',
      unit: 'psi (pounds per square inch)',
      correctAnswers: ['14.7', '14.5', '14.6'],
      tolerance: 0.3,
      feedback: {
        correct: 'Correct! 14.7 psi (101.3 kPa) is Earth sea-level pressure and the standard for U.S. spacecraft habitable volumes. This pressure supports normal human respiration with a 21% oxygen atmosphere. Some vehicles use lower pressures (8-10 psi) for EVA preparation, but habitable areas maintain Earth-normal pressure.',
        incorrect: 'Incorrect. The standard is 14.7 psi (101.3 kPa), which matches Earth\'s sea-level atmospheric pressure. This value ensures crew comfort and normal physiological function without requiring acclimatization. It\'s a fundamental parameter in all NASA habitat designs.'
      }
    },
    {
      type: 'systems-check',
      id: 'sc3',
      title: 'Oxygen Concentration Limit',
      briefing: 'The atmosphere in your habitat must maintain precise oxygen levels. Too little causes hypoxia; too much dramatically increases fire risk.',
      question: 'The maximum safe oxygen concentration in a spacecraft cabin atmosphere is',
      unit: 'percent (%)',
      correctAnswers: ['23', '23.0', '23.5'],
      tolerance: 1,
      feedback: {
        correct: 'Correct! 23% oxygen is the maximum safe concentration for spacecraft atmospheres. Earth\'s atmosphere is 21% oxygen, and exceeding 23-25% creates severe fire hazards. The Apollo 1 tragedy (100% oxygen atmosphere) taught NASA this lesson at a terrible cost. Modern spacecraft maintain 19.5-23% oxygen.',
        incorrect: 'Incorrect. The maximum safe limit is approximately 23% oxygen. Above this concentration, fire risk increases exponentially. Earth\'s atmosphere is 21% oxygen, and spacecraft must stay within the safe range of 19.5-23%. This is a critical life support system parameter derived from decades of NASA safety analysis.'
      }
    },
    {
      type: 'systems-check',
      id: 'sc4',
      title: 'Crew Volume Requirement',
      briefing: 'Psychological health on long-duration missions requires adequate personal space. Cramped conditions lead to stress, conflict, and degraded performance.',
      question: 'NASA recommends a minimum habitable volume per crew member of',
      unit: 'cubic meters (m³)',
      correctAnswers: ['25', '25.0'],
      tolerance: 5,
      feedback: {
        correct: 'Correct! 25 m³ per crew member is NASA\'s guideline for long-duration missions (6+ months). This volume supports both functional tasks and psychological well-being. For comparison, ISS provides ~35 m³ per person, while lunar habitats may be constrained to 15-20 m³. Your designs should target 25+ m³ when possible.',
        incorrect: 'Incorrect. NASA\'s recommendation is approximately 25 m³ per crew member for long-duration missions. This volume has been validated through decades of ISS operations and psychological studies. Insufficient volume leads to crew stress, interpersonal conflict, and mission risk. This is a key parameter in all habitat sizing calculations.'
      }
    }
  ];

  // Randomly select one question of each type on component mount
  useEffect(() => {
    const randomTradeOff = tradeOffQuestions[Math.floor(Math.random() * tradeOffQuestions.length)];
    const randomLayout = layoutQuestions[Math.floor(Math.random() * layoutQuestions.length)];
    const randomSystemsCheck = systemsCheckQuestions[Math.floor(Math.random() * systemsCheckQuestions.length)];
    
    // Randomize the order of the three question types
    const questions = [randomTradeOff, randomLayout, randomSystemsCheck];
    const shuffled = questions.sort(() => Math.random() - 0.5);
    
    setSelectedQuestions(shuffled);
  }, []);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleTradeOffAnswer = (optionId) => {
    if (showFeedback) return;
    setUserAnswer(optionId);
    setShowFeedback(true);
    
    const isCorrect = optionId === currentQuestion.correctAnswer;
    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
      correct: isCorrect,
      userAnswer: optionId
    }]);
  };

  const handleLayoutAnswer = (zoneId) => {
    if (showFeedback) return;
    const zone = currentQuestion.dropZones.find(z => z.id === zoneId);
    setUserAnswer(zoneId);
    setShowFeedback(true);
    
    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
      correct: zone.correct,
      userAnswer: zoneId
    }]);
  };

  const handleSystemsCheckSubmit = () => {
    if (showFeedback || !textInput.trim()) return;
    
    const userValue = parseFloat(textInput.trim());
    const isCorrect = currentQuestion.correctAnswers.some(answer => {
      const correctValue = parseFloat(answer);
      return Math.abs(userValue - correctValue) <= currentQuestion.tolerance;
    });
    
    setUserAnswer(textInput);
    setShowFeedback(true);
    
    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
      correct: isCorrect,
      userAnswer: textInput
    }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer(null);
      setShowFeedback(false);
      setTextInput('');
    } else {
      setTestComplete(true);
    }
  };

  const calculateScore = () => {
    return results.filter(r => r.correct).length;
  };

  const getQuestionTypeLabel = (type) => {
    switch(type) {
      case 'trade-off': return 'Engineering Trade-Off';
      case 'layout': return 'Layout Puzzle';
      case 'systems-check': return 'Systems Check';
      default: return 'Question';
    }
  };

  if (selectedQuestions.length === 0) {
    return (
      <div className="aptitude-test-container">
        <div className="loading-test">Initializing Aptitude Test...</div>
      </div>
    );
  }

  if (testComplete) {
    const score = calculateScore();
    const percentage = (score / 3) * 100;
    
    return (
      <div className="aptitude-test-container">
        <div className="test-complete-screen">
          <div className="complete-badge-apt">ASSESSMENT COMPLETE</div>
          <h2 className="complete-title-apt">Astronaut Aptitude Test Results</h2>
          
          <div className="score-circle">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(107, 157, 255, 0.2)" strokeWidth="12"/>
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="none" 
                stroke={percentage === 100 ? '#00ff88' : percentage >= 66 ? '#00d4ff' : '#ffaa44'}
                strokeWidth="12"
                strokeDasharray={`${(percentage / 100) * 565} 565`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <text x="100" y="95" textAnchor="middle" fontSize="48" fontWeight="900" fill="#ffffff" fontFamily="'Courier New', monospace">
                {score}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="24" fill="#6b9dff" fontFamily="'Courier New', monospace">
                / 3
              </text>
            </svg>
          </div>

          <div className="aptitude-verdict">
            {score === 3 && (
              <p className="verdict-text-apt verdict-perfect">
                <span className="verdict-icon-apt">⭐</span>
                <strong>Exceptional Performance!</strong> You've demonstrated mastery across all three critical domains: strategic decision-making, spatial reasoning, and systems knowledge. You possess the cognitive flexibility required for habitat design operations. Cleared for mission.
              </p>
            )}
            {score === 2 && (
              <p className="verdict-text-apt verdict-good">
                <span className="verdict-icon-apt">✓</span>
                <strong>Strong Aptitude Confirmed.</strong> You've shown solid competency in most areas. With hands-on practice in the Design Lab, you'll refine these skills and develop the intuition needed for complex habitat engineering.
              </p>
            )}
            {score === 1 && (
              <p className="verdict-text-apt verdict-learning">
                <span className="verdict-icon-apt">→</span>
                <strong>Foundation Established.</strong> You're beginning to grasp the multi-dimensional nature of habitat design. The Design Lab will provide the practical experience needed to strengthen your decision-making across all domains.
              </p>
            )}
            {score === 0 && (
              <p className="verdict-text-apt verdict-beginner">
                <span className="verdict-icon-apt">🚀</span>
                <strong>Training Mode Recommended.</strong> Space engineering requires practice and iteration. The Design Lab is your training environment—experiment freely, make mistakes, and learn from immediate feedback.
              </p>
            )}
          </div>

          <div className="results-breakdown">
            <h3>Test Breakdown:</h3>
            {results.map((result, index) => {
              const question = selectedQuestions[index];
              return (
                <div key={index} className={`result-item ${result.correct ? 'result-correct' : 'result-incorrect'}`}>
                  <span className="result-type">{getQuestionTypeLabel(result.type)}</span>
                  <span className="result-question">{question.title}</span>
                  <span className={`result-status ${result.correct ? 'status-pass' : 'status-fail'}`}>
                    {result.correct ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
              );
            })}
          </div>

          <Link to="/designer" className="btn-launch-lab">
            <span className="btn-icon-lab">🚀</span>
            <span className="btn-text-lab">
              <span className="btn-main-lab">Launch the Design Lab</span>
              <span className="btn-sub-lab">Begin Mission Operations</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aptitude-test-container">
      <div className="test-header">
        <div className="test-badge">ASTRONAUT APTITUDE TEST</div>
        <h2 className="test-title">Comprehensive Skills Assessment</h2>
        <p className="test-subtitle">Testing: Strategic Decision-Making • Spatial Reasoning • Systems Knowledge</p>
        
        <div className="test-progress">
          <div className="progress-bar-apt">
            <div 
              className="progress-fill-apt" 
              style={{ width: `${((currentQuestionIndex + 1) / 3) * 100}%` }}
            />
          </div>
          <div className="progress-label">Question {currentQuestionIndex + 1} of 3</div>
        </div>
      </div>

      <div className="question-container">
        <div className="question-type-badge">{getQuestionTypeLabel(currentQuestion.type)}</div>
        <h3 className="question-title">{currentQuestion.title}</h3>
        <div className="question-briefing">{currentQuestion.briefing}</div>

        {/* Trade-Off Question */}
        {currentQuestion.type === 'trade-off' && (
          <div className="trade-off-question">
            <div className="trade-off-options">
              {currentQuestion.options.map(option => {
                const isSelected = userAnswer === option.id;
                const isCorrect = option.id === currentQuestion.correctAnswer;
                const showResult = showFeedback;
                
                return (
                  <div
                    key={option.id}
                    className={`trade-option ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${showResult && isSelected && !isCorrect ? 'incorrect' : ''}`}
                    onClick={() => handleTradeOffAnswer(option.id)}
                  >
                    <div className="option-header-apt">
                      <span className="option-id-apt">{option.id}</span>
                      <span className="option-label-apt">{option.label}</span>
                      {showResult && isCorrect && <span className="option-badge-apt badge-correct-apt">✓ OPTIMAL</span>}
                      {showResult && isSelected && !isCorrect && <span className="option-badge-apt badge-incorrect-apt">✗ SUB-OPTIMAL</span>}
                    </div>
                    <pre className="option-diagram-apt">{option.diagram}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Layout Question */}
        {currentQuestion.type === 'layout' && (
          <div className="layout-question">
            <div className="habitat-diagram">
              <svg width="350" height="350" viewBox="0 0 350 350">
                {/* Habitat outline */}
                <circle cx="175" cy="175" r="150" fill="rgba(20, 35, 60, 0.4)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="3"/>
                
                {/* Fixed modules */}
                {currentQuestion.fixedModules.map(module => (
                  <g key={module.id}>
                    <circle cx={module.position.x} cy={module.position.y} r="30" fill="rgba(107, 157, 255, 0.3)" stroke="#6b9dff" strokeWidth="2"/>
                    <text x={module.position.x} y={module.position.y + 5} textAnchor="middle" fontSize="24">
                      {module.symbol}
                    </text>
                    <text x={module.position.x} y={module.position.y + 50} textAnchor="middle" fontSize="12" fill="#6b9dff">
                      {module.label}
                    </text>
                  </g>
                ))}
                
                {/* Airlock (if present) */}
                {currentQuestion.airlock && (
                  <g>
                    <rect x={currentQuestion.airlock.position.x - 25} y={currentQuestion.airlock.position.y - 25} width="50" height="50" fill="rgba(68, 68, 255, 0.3)" stroke="#4444ff" strokeWidth="2" rx="5"/>
                    <text x={currentQuestion.airlock.position.x} y={currentQuestion.airlock.position.y + 8} textAnchor="middle" fontSize="24">
                      {currentQuestion.airlock.symbol}
                    </text>
                    <text x={currentQuestion.airlock.position.x} y={currentQuestion.airlock.position.y + 50} textAnchor="middle" fontSize="12" fill="#4444ff">
                      {currentQuestion.airlock.label}
                    </text>
                  </g>
                )}
                
                {/* Drop zones */}
                {currentQuestion.dropZones.map(zone => {
                  const isSelected = userAnswer === zone.id;
                  const showResult = showFeedback;
                  return (
                    <g key={zone.id} className="drop-zone-group" onClick={() => handleLayoutAnswer(zone.id)}>
                      <circle 
                        cx={zone.position.x} 
                        cy={zone.position.y} 
                        r="35" 
                        fill={showResult && zone.correct ? 'rgba(0, 255, 136, 0.2)' : showResult && isSelected ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
                        stroke={showResult && zone.correct ? '#00ff88' : showResult && isSelected ? '#ff4444' : '#00d4ff'}
                        strokeWidth={isSelected ? '4' : '2'}
                        strokeDasharray={showResult ? '0' : '5,5'}
                        className="drop-zone-circle"
                      />
                      {showResult && zone.correct && (
                        <text x={zone.position.x} y={zone.position.y + 8} textAnchor="middle" fontSize="32" fill="#00ff88" fontWeight="900">
                          ✓
                        </text>
                      )}
                      {showResult && isSelected && !zone.correct && (
                        <text x={zone.position.x} y={zone.position.y + 8} textAnchor="middle" fontSize="32" fill="#ff4444" fontWeight="900">
                          ✗
                        </text>
                      )}
                      {!showResult && (
                        <text x={zone.position.x} y={zone.position.y + 5} textAnchor="middle" fontSize="20" fill="#00d4ff" fontWeight="700">
                          {zone.id.replace('zone', '')}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              
              <div className="zone-labels">
                {currentQuestion.dropZones.map(zone => (
                  <div 
                    key={zone.id} 
                    className={`zone-label ${userAnswer === zone.id ? 'selected' : ''}`}
                    onClick={() => handleLayoutAnswer(zone.id)}
                  >
                    <span className="zone-number">{zone.id.replace('zone', '')}</span>
                    <span className="zone-text">{zone.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Systems Check Question */}
        {currentQuestion.type === 'systems-check' && (
          <div className="systems-check-question">
            <div className="systems-prompt">
              <p className="systems-question-text">{currentQuestion.question}</p>
              <div className="systems-input-group">
                <input
                  type="number"
                  step="0.1"
                  className="systems-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Enter value"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSystemsCheckSubmit();
                  }}
                />
                <span className="systems-unit">{currentQuestion.unit}</span>
              </div>
              {!showFeedback && (
                <button 
                  className="btn-submit-systems" 
                  onClick={handleSystemsCheckSubmit}
                  disabled={!textInput.trim()}
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && (
          <div className={`feedback-section ${results[results.length - 1].correct ? 'feedback-correct-apt' : 'feedback-incorrect-apt'}`}>
            <div className="feedback-header-apt">
              {results[results.length - 1].correct ? '✓ CORRECT' : '✗ INCORRECT'}
            </div>
            <p className="feedback-text-apt">
              {currentQuestion.type === 'trade-off' && (
                results[results.length - 1].correct ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect
              )}
              {currentQuestion.type === 'layout' && (
                currentQuestion.dropZones.find(z => z.id === userAnswer)?.feedback
              )}
              {currentQuestion.type === 'systems-check' && (
                results[results.length - 1].correct ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect
              )}
            </p>
            <button className="btn-next-apt" onClick={handleNext}>
              {currentQuestionIndex < selectedQuestions.length - 1 ? 'Next Question' : 'View Results'}
              <span className="btn-arrow-apt">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstronautAptitudeTest;
