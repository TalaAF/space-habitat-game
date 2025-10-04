import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/knowledgeTest.css';

const KnowledgeTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [draggedZone, setDraggedZone] = useState(null);

  // Question Type 1: Engineering Trade-Off (Multiple Choice)
  const tradeOffQuestions = [
    {
      type: 'trade-off',
      id: 'to1',
      title: 'Power Budget Challenge',
      briefing: 'Your lunar habitat needs 20 kW continuous power. Choose the optimal solution.',
      options: [
        {
          id: 'A',
          label: 'Solar Arrays Only',
          description: 'Large panels, but no power during 14-day lunar night',
          specs: 'Mass: 2.0 tons | Day: 25 kW | Night: 0 kW'
        },
        {
          id: 'B',
          label: 'Nuclear Fission Reactor',
          description: 'Kilopower reactor provides constant baseline power',
          specs: 'Mass: 3.5 tons | 24/7: 20 kW | Reliable: 10+ years'
        },
        {
          id: 'C',
          label: 'Solar + Battery',
          description: 'Solar charges batteries during day for night coverage',
          specs: 'Mass: 5.0 tons | Storage: 280 kWh | Night: 14 days'
        }
      ],
      correctAnswer: 'B',
      feedback: {
        correct: 'Excellent! For the Moon\'s 14-day nights, nuclear fission (Kilopower) is optimal. It provides constant 20 kW baseline power 24/7 with minimal maintenance. While heavier than solar alone, it\'s more mass-efficient than massive battery banks needed for 2-week nights.',
        incorrect: 'Consider the lunar night cycle. Option A fails for 14 days straight—catastrophic. Option C works but requires enormous battery banks (5+ tons) to store 2 weeks of power. Option B (nuclear) provides continuous 20 kW at 3.5 tons—the most efficient solution for lunar conditions.'
      }
    },
    {
      type: 'trade-off',
      id: 'to2',
      title: 'Radiation Shielding Decision',
      briefing: 'Deep space radiation requires shielding. You have 6 tons budget. Choose wisely.',
      options: [
        {
          id: 'A',
          label: 'Water Walls',
          description: 'Water-filled bladders around crew quarters',
          specs: 'Protection: 85% | Dual-use: Emergency water | Mass: 6.0 tons'
        },
        {
          id: 'B',
          label: 'Lead Plates',
          description: 'Traditional heavy metal shielding',
          specs: 'Protection: 70% | Single-use only | Mass: 6.0 tons'
        },
        {
          id: 'C',
          label: 'Polyethylene Foam',
          description: 'Hydrogen-rich polymer composite',
          specs: 'Protection: 90% | Lightweight | Mass: 3.5 tons'
        }
      ],
      correctAnswer: 'A',
      feedback: {
        correct: 'Perfect! Water walls are NASA\'s preferred deep space radiation shield. At 85% protection, they block cosmic rays and solar particles. Critical advantage: dual-use as emergency water supply (3+ months for crew of 4). This redundancy is essential for long missions.',
        incorrect: 'Analyze the trade-offs. Option B (lead) is least effective (70%) with no secondary benefit. Option C (polyethylene) has best shielding (90%) but uses only 3.5 tons—wasting 2.5 tons of capacity. Option A uses full 6-ton budget for dual purposes: shielding + emergency water reserves.'
      }
    }
  ];

  // Question Type 2: True/False Rapid Fire
  const trueFalseQuestions = [
    {
      type: 'true-false',
      id: 'tf1',
      question: 'The ISS orbits Earth at approximately 400 km altitude.',
      correctAnswer: true,
      feedback: {
        correct: 'Correct! The ISS orbits at approximately 408 km (253 miles) above Earth\'s surface in Low Earth Orbit (LEO). This altitude balances atmospheric drag (requiring periodic boosts) with accessibility for crew/cargo launches.',
        incorrect: 'Actually, TRUE. The ISS maintains an orbit around 408 km altitude. This LEO orbit is low enough to reach easily from Earth but high enough to minimize atmospheric drag over months between reboosts.'
      }
    },
    {
      type: 'true-false',
      id: 'tf2',
      question: 'Inflatable habitats provide more volume per kilogram than rigid modules.',
      correctAnswer: true,
      feedback: {
        correct: 'Correct! Inflatable modules like Bigelow BEAM launch compact (0.7× mass multiplier) then expand to 3× larger volume in space. They\'re more volume-efficient than rigid metal structures, though they require careful deployment and puncture protection.',
        incorrect: 'Actually, TRUE. Inflatable habitats are significantly more volume-efficient. They compress during launch then expand in orbit, providing up to 3× more living space per kilogram compared to traditional rigid aluminum/composite modules.'
      }
    },
    {
      type: 'true-false',
      id: 'tf3',
      question: 'Mars has a thicker atmosphere than Earth.',
      correctAnswer: false,
      feedback: {
        correct: 'Correct! Mars\' atmosphere is only ~1% the density of Earth\'s (0.6 kPa vs 101 kPa). This thin CO₂ atmosphere provides minimal protection from radiation and makes aerodynamic landing challenging—requiring heat shields, parachutes, AND rockets.',
        incorrect: 'Actually, FALSE. Mars has an extremely thin atmosphere—only 1% of Earth\'s pressure. While it contains 95% CO₂ (useful for ISRU), it\'s too thin for radiation protection or easy landing, requiring complex EDL (Entry, Descent, Landing) systems.'
      }
    }
  ];

  // Question Type 3: Fill-in-the-Blank (Numerical)
  const fillInBlankQuestions = [
    {
      type: 'fill-blank',
      id: 'fib1',
      question: 'NASA\'s standard airlock transition time is ___ minutes to prevent decompression sickness.',
      unit: 'minutes',
      correctAnswer: 15,
      tolerance: 5,
      feedback: {
        correct: 'Correct! NASA uses 15-minute (±5 min) airlock transitions for EVA prep. This "pre-breathe" time at reduced pressure purges nitrogen from the bloodstream, preventing decompression sickness ("the bends"). Longer pre-breathe = safer spacewalks.',
        incorrect: 'The standard is 15 minutes (acceptable range: 10-20 min). This pre-breathe time at reduced pressure allows nitrogen to leave the bloodstream gradually, preventing dangerous bubble formation. Rushing this process risks crew health during EVA.'
      }
    },
    {
      type: 'fill-blank',
      id: 'fib2',
      question: 'Each crew member requires approximately ___ kg of supplies per day (food, water, oxygen).',
      unit: 'kg',
      correctAnswer: 5,
      tolerance: 1,
      feedback: {
        correct: 'Correct! NASA budget: ~5 kg per person per day (±1 kg). This includes 1 kg food, 3.5 kg water, and 0.84 kg oxygen. For a 4-person crew on a 500-day Mars mission, that\'s 10 metric tons of consumables—unless you recycle!',
        incorrect: 'The NASA standard is ~5 kg per person per day. Breakdown: 1 kg food, 3.5 kg water, 0.84 kg oxygen. Without recycling, this adds up fast—a 4-person Mars mission (500 days) needs 10 tons of supplies. This is why ECLSS (life support recycling) is critical.'
      }
    },
    {
      type: 'fill-blank',
      id: 'fib3',
      question: 'The Moon\'s surface gravity is ___% of Earth\'s gravity.',
      unit: '%',
      correctAnswer: 16.5,
      tolerance: 1.5,
      feedback: {
        correct: 'Spot on! Lunar gravity is 16.5% (or 1/6th) of Earth\'s. This means a 90 kg astronaut weighs only 15 kg on the Moon. Low gravity affects everything: walking style, dust behavior, module anchoring, and long-term health (bone/muscle loss without countermeasures).',
        incorrect: 'The correct value is 16.5% (about 1/6th Earth gravity). Moon\'s gravity (1.62 m/s²) vs Earth (9.81 m/s²) = 16.5%. This impacts habitat design: lighter structures, different airlock seals, unique dust mitigation, and crew health protocols for extended stays.'
      }
    }
  ];

  // Question Type 4: Layout Puzzle (Clickable Zones)
  const layoutQuestions = [
    {
      type: 'layout',
      id: 'lay1',
      title: 'Contamination Control',
      briefing: 'Place the Hygiene Module [🚿] to prevent contamination from the Galley [🍽️].',
      diagram: {
        width: 350,
        height: 250,
        fixedModules: [
          { symbol: '🍽️', label: 'Galley', x: 60, y: 80, zone: 'fixed' }
        ],
        dropZones: [
          { 
            id: 'zone1', 
            label: 'Adjacent', 
            x: 150, 
            y: 80,
            correct: false,
            feedback: 'Contamination risk! Hygiene next to food prep violates NASA health protocols.'
          },
          { 
            id: 'zone2', 
            label: 'Opposite Wall', 
            x: 260, 
            y: 80,
            correct: true,
            feedback: 'Perfect! Maximum separation between "wet" and "clean" zones prevents cross-contamination.'
          },
          { 
            id: 'zone3', 
            label: 'Corner', 
            x: 280, 
            y: 180,
            correct: false,
            feedback: 'Better than adjacent, but not optimal. NASA guidelines prefer direct opposite placement.'
          }
        ]
      }
    },
    {
      type: 'layout',
      id: 'lay2',
      title: 'Emergency Egress Path',
      briefing: 'Place the Sleeping Quarters [🛏️] where crew can reach the Emergency Airlock [🚪] fastest.',
      diagram: {
        width: 350,
        height: 250,
        fixedModules: [
          { symbol: '🚪', label: 'Emergency Airlock', x: 270, y: 40, zone: 'fixed' }
        ],
        dropZones: [
          { 
            id: 'zone1', 
            label: 'Far End', 
            x: 50, 
            y: 180,
            correct: false,
            feedback: 'Too far! In a depressurization emergency, crew need <60 seconds to reach the airlock.'
          },
          { 
            id: 'zone2', 
            label: 'Central', 
            x: 160, 
            y: 120,
            correct: false,
            feedback: 'Acceptable but not optimal. Central locations work for common areas, not sleeping quarters.'
          },
          { 
            id: 'zone3', 
            label: 'Adjacent to Airlock', 
            x: 240, 
            y: 120,
            correct: true,
            feedback: 'Excellent! Sleeping quarters adjacent to emergency airlock ensures fastest egress time (<30 sec). NASA human factors: minimize distance from rest areas to emergency exits.'
          }
        ]
      }
    }
  ];

  // Question Type 5: Ranking/Prioritization
  const rankingQuestions = [
    {
      type: 'ranking',
      id: 'rank1',
      title: 'Mission Priority Ranking',
      briefing: 'Rank these habitat failures by SEVERITY (1 = most critical, 4 = least critical).',
      items: [
        { 
          id: 'item1', 
          text: 'Life Support Failure (ECLSS)', 
          correctRank: 1,
          explanation: '1st: ECLSS failure = immediate crew death (oxygen depletion in minutes).'
        },
        { 
          id: 'item2', 
          text: 'Power System Failure', 
          correctRank: 2,
          explanation: '2nd: No power = life support stops, heating fails (hours to critical).'
        },
        { 
          id: 'item3', 
          text: 'Communications Loss', 
          correctRank: 3,
          explanation: '3rd: Isolated but alive. Crew can survive days on emergency protocols.'
        },
        { 
          id: 'item4', 
          text: 'Science Module Damage', 
          correctRank: 4,
          explanation: '4th: Mission impact but not life-threatening. Crew safety intact.'
        }
      ],
      feedback: {
        correct: 'Perfect prioritization! You understand mission-critical systems hierarchy. Life support > Power > Comms > Science. This is the NASA standard for failure mode analysis and redundancy planning.',
        incorrect: 'Review the hierarchy: (1) ECLSS = immediate death, (2) Power = hours to critical, (3) Comms = isolated but safe, (4) Science = mission impact only. Always prioritize crew survival over mission objectives.'
      }
    }
  ];

  // Question Type 6: Scenario Analysis (Multiple Choice with Context)
  const scenarioQuestions = [
    {
      type: 'scenario',
      id: 'scen1',
      title: 'Micrometeorite Strike',
      scenario: `⚠️ EMERGENCY ALERT ⚠️

Time: 03:42 Mission Day 87
Event: 2cm micrometeorite punctures Crew Module B wall
Status: 
- Pressure dropping: 101 kPa → 95 kPa (30 sec)
- Hole size: ~5mm diameter
- Crew: 4 members, 2 in Module B, 2 in Module A
- Air reserve: 6 hours at current leak rate

What is your IMMEDIATE action?`,
      options: [
        {
          id: 'A',
          label: 'Evacuate Module B, seal hatch',
          description: 'Close Module B, pressurize Module A'
        },
        {
          id: 'B',
          label: 'Apply emergency patch',
          description: 'Use repair kit to seal hole immediately'
        },
        {
          id: 'C',
          label: 'Begin EVA repair',
          description: 'Prep spacesuit for external hull repair'
        }
      ],
      correctAnswer: 'B',
      feedback: {
        correct: 'Correct! With 6 hours of air, immediate patching is safest. NASA protocol: PATCH FIRST if leak is slow (>1 hour reserve). Emergency sealant can stop a 5mm hole in <2 minutes. Evacuation is for rapid decompression only. EVA takes 30+ min prep—too slow.',
        incorrect: 'Wrong priority. Option A (evacuation) loses Module B entirely—unnecessary for a slow leak. Option C (EVA) takes 30+ minutes to prep—too slow. Option B (immediate patch) follows NASA protocol: with 6 hours reserve, patch the hole NOW using emergency sealant. 2-minute fix saves the module.'
      }
    },
    {
      type: 'scenario',
      id: 'scen2',
      title: 'Solar Storm Warning',
      scenario: `⚠️ RADIATION ALERT ⚠️

Time: 12:15 Mission Day 134
Event: Class X Solar Flare detected
Status:
- Solar Particle Event (SPE) incoming
- ETA: 18 minutes
- Radiation level: 500 mSv/hr (lethal in 2 hours)
- Crew: 4 members scattered across habitat
- Storm shelter: 10 cm water walls, capacity: 4

What is your IMMEDIATE action?`,
      options: [
        {
          id: 'A',
          label: 'Continue normal operations',
          description: 'Monitor radiation levels, shelter only if needed'
        },
        {
          id: 'B',
          label: 'All crew to storm shelter NOW',
          description: 'Immediate evacuation to shielded area'
        },
        {
          id: 'C',
          label: 'Activate electromagnetic shield',
          description: 'Power up magnetic deflection system'
        }
      ],
      correctAnswer: 'B',
      feedback: {
        correct: 'Correct! With 18 minutes warning, immediate shelter is critical. Class X flares deliver lethal radiation doses (500+ mSv/hr). NASA protocol: crew to storm shelter IMMEDIATELY. The 10 cm water walls reduce exposure by ~85%. Every minute outside shelter = dangerous dose accumulation.',
        incorrect: 'Time is critical! Option A (wait) is deadly—500 mSv/hr radiation will incapacitate crew in 2 hours. Option C (electromagnetic shield) doesn\'t exist with current tech. Option B is NASA protocol: IMMEDIATE retreat to storm shelter. The 18-minute warning is barely enough to secure the habitat and take cover.'
      }
    }
  ];

  // Question Type 7: Systems Check (Diagram Analysis)
  const systemsCheckQuestions = [
    {
      type: 'systems-check',
      id: 'sys1',
      title: 'ECLSS Flow Diagram',
      briefing: 'Analyze this life support loop. What is the MISSING critical component?',
      diagram: `
╔═══════════════════════════════════════╗
║   ENVIRONMENTAL CONTROL & LIFE SUPPORT SYSTEM   ║
╚═══════════════════════════════════════╝

    CREW CABIN                    [🧑‍🚀 Crew]
         │                             │
         │ exhales CO₂                 │ inhales O₂
         ▼                             ▲
   ┌──────────┐                  ┌──────────┐
   │ CO₂ OUT  │                  │  O₂ IN   │
   └────┬─────┘                  └─────▲────┘
        │                              │
        │                              │
        ▼                              │
   ┌─────────────┐              ┌──────────────┐
   │  [MISSING]  │─────────────▶│ O₂ Generator │
   │      ?      │   H₂ + O₂    │  (Electrolysis)│
   └─────────────┘              └──────┬───────┘
        ▲                              │
        │                              │ H₂O
        │                              │
        └──────────────────────────────┘
                    Water Loop

Missing Component: ___________`,
      options: [
        { id: 'A', label: 'Air Filter' },
        { id: 'B', label: 'CO₂ Scrubber' },
        { id: 'C', label: 'Heat Exchanger' },
        { id: 'D', label: 'Humidity Controller' }
      ],
      correctAnswer: 'B',
      feedback: {
        correct: 'Perfect! The CO₂ Scrubber (Sabatier Reactor on ISS) removes CO₂ from cabin air and converts it to water (CO₂ + H₂ → H₂O + CH₄). This water feeds the O₂ Generator (electrolysis: H₂O → H₂ + O₂). Complete loop: crew exhales CO₂ → scrubber → water → O₂ → crew inhales.',
        incorrect: 'The missing component is CO₂ Scrubber. Without it, exhaled CO₂ accumulates to lethal levels (>1% in minutes). The scrubber (Sabatier Reactor) converts CO₂ + H₂ into water, which feeds the electrolysis unit. This closes the loop: CO₂ → H₂O → O₂ → crew → CO₂.'
      }
    }
  ];

  // Combine all question types
  const allQuestions = [
    ...tradeOffQuestions,
    ...trueFalseQuestions,
    ...fillInBlankQuestions,
    ...layoutQuestions,
    ...rankingQuestions,
    ...scenarioQuestions,
    ...systemsCheckQuestions
  ];

  // Randomize 7 questions on mount
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 7);
    setSelectedQuestions(selected);
  }, []);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer && !textInput && currentQuestion.type !== 'ranking') return;

    let isCorrect = false;
    const question = currentQuestion;

    // Check answer based on question type
    switch (question.type) {
      case 'trade-off':
      case 'scenario':
      case 'systems-check':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      case 'true-false':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      case 'fill-blank':
        const numValue = parseFloat(textInput);
        isCorrect = Math.abs(numValue - question.correctAnswer) <= question.tolerance;
        break;
      case 'layout':
        const selectedZone = question.diagram.dropZones.find(z => z.id === userAnswer);
        isCorrect = selectedZone?.correct || false;
        break;
      case 'ranking':
        // Check if user's ranking matches correct ranking
        isCorrect = userAnswer && JSON.stringify(userAnswer) === JSON.stringify(
          question.items.map(item => item.id).sort((a, b) => {
            const rankA = question.items.find(i => i.id === a).correctRank;
            const rankB = question.items.find(i => i.id === b).correctRank;
            return rankA - rankB;
          })
        );
        break;
    }

    setResults([...results, { questionId: question.id, correct: isCorrect, userAnswer, question }]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
      setTextInput('');
      setShowFeedback(false);
    } else {
      setTestComplete(true);
    }
  };

  const handleRestartTest = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 7);
    setSelectedQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswer(null);
    setTextInput('');
    setShowFeedback(false);
    setTestComplete(false);
    setResults([]);
  };

  const calculateScore = () => {
    return results.filter(r => r.correct).length;
  };

  if (selectedQuestions.length === 0) {
    return (
      <div className="knowledge-test-loading">
        <div className="loading-spinner"></div>
        <p>Initializing Knowledge Assessment...</p>
      </div>
    );
  }

  if (testComplete) {
    const score = calculateScore();
    const percentage = Math.round((score / 7) * 100);

    return (
      <div className="knowledge-test-complete">
        <div className="mission-badge-kt">ASSESSMENT COMPLETE</div>
        <h2 className="complete-title-kt">Mission Readiness: {percentage}%</h2>
        
        <div className="score-display-kt">
          <div className="score-circle-kt">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="rgba(0, 255, 255, 0.2)" 
                strokeWidth="12"
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke={percentage >= 70 ? '#00ff88' : percentage >= 50 ? '#ffaa00' : '#ff4444'}
                strokeWidth="12"
                strokeDasharray={`${(percentage / 100) * 502.4} 502.4`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <text 
                x="100" 
                y="100" 
                textAnchor="middle" 
                dy="0.3em" 
                fontSize="48" 
                fill="#00ffff"
                fontWeight="bold"
              >
                {score}/7
              </text>
            </svg>
          </div>

          <div className="score-message-kt">
            {percentage >= 85 && (
              <>
                <h3>🚀 MISSION READY</h3>
                <p>Outstanding performance! You have the knowledge to design safe, efficient space habitats. Ready for deployment!</p>
              </>
            )}
            {percentage >= 70 && percentage < 85 && (
              <>
                <h3>⭐ STRONG FOUNDATION</h3>
                <p>Solid understanding of space habitat systems. Review the feedback and you'll be mission-ready!</p>
              </>
            )}
            {percentage >= 50 && percentage < 70 && (
              <>
                <h3>📚 LEARNING PROGRESS</h3>
                <p>Good start! Study the NASA references and try again. Every astronaut needs training!</p>
              </>
            )}
            {percentage < 50 && (
              <>
                <h3>🎓 TRAINING NEEDED</h3>
                <p>Keep exploring! Space engineering is complex. Review the materials and retake the assessment.</p>
              </>
            )}
          </div>
        </div>

        <div className="results-breakdown-kt">
          <h3>Question Results</h3>
          {results.map((result, index) => (
            <div key={index} className={`result-item-kt ${result.correct ? 'correct' : 'incorrect'}`}>
              <span className="result-number-kt">Q{index + 1}</span>
              <span className="result-type-kt">{result.question.type}</span>
              <span className="result-status-kt">{result.correct ? '✓ Correct' : '✗ Incorrect'}</span>
            </div>
          ))}
        </div>

        <div className="complete-actions-kt">
          <button className="btn-restart-kt" onClick={handleRestartTest}>
            <span className="btn-icon-kt">🔄</span>
            Retake Assessment
          </button>
          <Link to="/designer" className="btn-designer-kt">
            <span className="btn-icon-kt">🚀</span>
            Launch Design Lab
          </Link>
        </div>
      </div>
    );
  }

  // Render current question
  return (
    <div className="knowledge-test-container">
      <div className="test-header-kt">
        <div className="mission-badge-kt">KNOWLEDGE ASSESSMENT</div>
        <div className="progress-bar-kt">
          <div className="progress-fill-kt" style={{ width: `${((currentQuestionIndex + 1) / 7) * 100}%` }}></div>
        </div>
        <div className="progress-text-kt">Question {currentQuestionIndex + 1} of 7</div>
      </div>

      {currentQuestion && (
        <>
          {/* Trade-Off Questions */}
          {currentQuestion.type === 'trade-off' && (
            <div className="question-container-kt trade-off-question-kt">
              <h2 className="question-title-kt">{currentQuestion.title}</h2>
              <p className="question-briefing-kt">{currentQuestion.briefing}</p>
              
              <div className="trade-options-kt">
                {currentQuestion.options.map(option => (
                  <div 
                    key={option.id}
                    className={`trade-option-kt ${userAnswer === option.id ? 'selected' : ''} ${showFeedback ? (option.id === currentQuestion.correctAnswer ? 'correct' : userAnswer === option.id ? 'incorrect' : '') : ''}`}
                    onClick={() => !showFeedback && handleAnswer(option.id)}
                  >
                    <div className="option-header-kt">
                      <span className="option-id-kt">{option.id}</span>
                      <span className="option-label-kt">{option.label}</span>
                    </div>
                    <p className="option-description-kt">{option.description}</p>
                    <div className="option-specs-kt">{option.specs}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* True/False Questions */}
          {currentQuestion.type === 'true-false' && (
            <div className="question-container-kt true-false-question-kt">
              <h2 className="question-title-kt">True or False?</h2>
              <p className="question-text-kt">{currentQuestion.question}</p>
              
              <div className="true-false-buttons-kt">
                <button 
                  className={`tf-button-kt ${userAnswer === true ? 'selected' : ''} ${showFeedback ? (currentQuestion.correctAnswer === true ? 'correct' : userAnswer === true ? 'incorrect' : '') : ''}`}
                  onClick={() => !showFeedback && handleAnswer(true)}
                  disabled={showFeedback}
                >
                  TRUE
                </button>
                <button 
                  className={`tf-button-kt ${userAnswer === false ? 'selected' : ''} ${showFeedback ? (currentQuestion.correctAnswer === false ? 'correct' : userAnswer === false ? 'incorrect' : '') : ''}`}
                  onClick={() => !showFeedback && handleAnswer(false)}
                  disabled={showFeedback}
                >
                  FALSE
                </button>
              </div>
            </div>
          )}

          {/* Fill-in-the-Blank Questions */}
          {currentQuestion.type === 'fill-blank' && (
            <div className="question-container-kt fill-blank-question-kt">
              <h2 className="question-title-kt">Systems Knowledge Check</h2>
              <p className="question-text-kt">{currentQuestion.question}</p>
              
              <div className="fill-blank-input-kt">
                <input 
                  type="number"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter value"
                  disabled={showFeedback}
                  className={showFeedback ? (Math.abs(parseFloat(textInput) - currentQuestion.correctAnswer) <= currentQuestion.tolerance ? 'correct' : 'incorrect') : ''}
                />
                <span className="unit-label-kt">{currentQuestion.unit}</span>
              </div>
            </div>
          )}

          {/* Layout Puzzle Questions */}
          {currentQuestion.type === 'layout' && (
            <div className="question-container-kt layout-question-kt">
              <h2 className="question-title-kt">{currentQuestion.title}</h2>
              <p className="question-briefing-kt">{currentQuestion.briefing}</p>
              
              <svg className="layout-diagram-kt" width={currentQuestion.diagram.width} height={currentQuestion.diagram.height} viewBox={`0 0 ${currentQuestion.diagram.width} ${currentQuestion.diagram.height}`}>
                {/* Fixed modules */}
                {currentQuestion.diagram.fixedModules.map((module, idx) => (
                  <g key={`fixed-${idx}`}>
                    <circle cx={module.x} cy={module.y} r="30" fill="rgba(0, 100, 200, 0.3)" stroke="#0088ff" strokeWidth="2" />
                    <text x={module.x} y={module.y} textAnchor="middle" dy="0.3em" fontSize="24">{module.symbol}</text>
                    <text x={module.x} y={module.y + 45} textAnchor="middle" fontSize="11" fill="#aaa">{module.label}</text>
                  </g>
                ))}
                
                {/* Drop zones */}
                {currentQuestion.diagram.dropZones.map((zone, idx) => (
                  <g 
                    key={zone.id}
                    onClick={() => !showFeedback && handleAnswer(zone.id)}
                    style={{ cursor: showFeedback ? 'default' : 'pointer' }}
                  >
                    <circle 
                      cx={zone.x} 
                      cy={zone.y} 
                      r="30" 
                      fill={showFeedback ? (zone.correct ? 'rgba(0, 255, 100, 0.3)' : userAnswer === zone.id ? 'rgba(255, 50, 50, 0.3)' : 'rgba(100, 100, 100, 0.2)') : (userAnswer === zone.id ? 'rgba(0, 255, 255, 0.4)' : 'rgba(100, 100, 100, 0.2)')}
                      stroke={showFeedback ? (zone.correct ? '#00ff88' : userAnswer === zone.id ? '#ff4444' : '#666') : (userAnswer === zone.id ? '#00ffff' : '#666')}
                      strokeWidth="2"
                      strokeDasharray={userAnswer === zone.id ? '' : '5,5'}
                    />
                    {userAnswer === zone.id && <text x={zone.x} y={zone.y} textAnchor="middle" dy="0.3em" fontSize="24">🚿</text>}
                    <text x={zone.x} y={zone.y + 45} textAnchor="middle" fontSize="10" fill="#aaa">{zone.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          {/* Ranking Questions */}
          {currentQuestion.type === 'ranking' && (
            <div className="question-container-kt ranking-question-kt">
              <h2 className="question-title-kt">{currentQuestion.title}</h2>
              <p className="question-briefing-kt">{currentQuestion.briefing}</p>
              
              <div className="ranking-items-kt">
                {currentQuestion.items.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`ranking-item-kt ${showFeedback ? (item.correctRank === index + 1 ? 'correct' : 'incorrect') : ''}`}
                  >
                    <span className="ranking-number-kt">{index + 1}</span>
                    <span className="ranking-text-kt">{item.text}</span>
                    {showFeedback && <span className="ranking-explain-kt">{item.explanation}</span>}
                  </div>
                ))}
              </div>
              <p className="ranking-hint-kt">Items are already in suggested order. Click Submit to check your answer.</p>
              <button 
                className="btn-submit-ranking-kt"
                onClick={() => {
                  handleAnswer(currentQuestion.items.map(i => i.id));
                  handleSubmitAnswer();
                }}
                disabled={showFeedback}
              >
                Submit Ranking
              </button>
            </div>
          )}

          {/* Scenario Questions */}
          {currentQuestion.type === 'scenario' && (
            <div className="question-container-kt scenario-question-kt">
              <h2 className="question-title-kt">{currentQuestion.title}</h2>
              <pre className="scenario-text-kt">{currentQuestion.scenario}</pre>
              
              <div className="scenario-options-kt">
                {currentQuestion.options.map(option => (
                  <div 
                    key={option.id}
                    className={`scenario-option-kt ${userAnswer === option.id ? 'selected' : ''} ${showFeedback ? (option.id === currentQuestion.correctAnswer ? 'correct' : userAnswer === option.id ? 'incorrect' : '') : ''}`}
                    onClick={() => !showFeedback && handleAnswer(option.id)}
                  >
                    <div className="option-header-kt">
                      <span className="option-id-kt">{option.id}</span>
                      <span className="option-label-kt">{option.label}</span>
                    </div>
                    <p className="option-description-kt">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems Check Questions */}
          {currentQuestion.type === 'systems-check' && (
            <div className="question-container-kt systems-check-question-kt">
              <h2 className="question-title-kt">{currentQuestion.title}</h2>
              <p className="question-briefing-kt">{currentQuestion.briefing}</p>
              
              <pre className="systems-diagram-kt">{currentQuestion.diagram}</pre>
              
              <div className="systems-options-kt">
                {currentQuestion.options.map(option => (
                  <button 
                    key={option.id}
                    className={`systems-option-kt ${userAnswer === option.id ? 'selected' : ''} ${showFeedback ? (option.id === currentQuestion.correctAnswer ? 'correct' : userAnswer === option.id ? 'incorrect' : '') : ''}`}
                    onClick={() => !showFeedback && handleAnswer(option.id)}
                    disabled={showFeedback}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {showFeedback && (
            <div className={`feedback-container-kt ${results[results.length - 1].correct ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon-kt">
                {results[results.length - 1].correct ? '✓' : '✗'}
              </div>
              <div className="feedback-content-kt">
                <h3>{results[results.length - 1].correct ? 'Correct!' : 'Not Quite'}</h3>
                <p>
                  {currentQuestion.type === 'layout' 
                    ? currentQuestion.diagram.dropZones.find(z => z.id === userAnswer)?.feedback 
                    : results[results.length - 1].correct 
                      ? currentQuestion.feedback.correct 
                      : currentQuestion.feedback.incorrect}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="question-nav-kt">
            {!showFeedback ? (
              <button 
                className="btn-submit-kt"
                onClick={handleSubmitAnswer}
                disabled={!userAnswer && !textInput}
              >
                Submit Answer
              </button>
            ) : (
              <button className="btn-next-kt" onClick={handleNextQuestion}>
                {currentQuestionIndex < 6 ? 'Next Question →' : 'View Results'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeTest;
