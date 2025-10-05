// Enhanced AI Response Engine for Space Habitat Assistant
// This file contains advanced natural language processing and intelligent response generation

export const enhancedAIEngine = {
  
  // Conversation patterns for natural language understanding
  patterns: {
    greeting: /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|what's up|yo)/i,
    gratitude: /(thank|thanks|thx|appreciate|grateful|kudos)/i,
    goodbye: /(bye|goodbye|see you|later|farewell|gotta go)/i,
    identity: /(who are you|what are you|your name|introduce yourself|tell me about you)/i,
    capability: /(what can you|what do you do|help me|your abilities|features|can you help)/i,
    affirmation: /^(yes|yeah|yep|sure|ok|okay|correct|right|exactly)/i,
    negation: /^(no|nope|nah|not really|incorrect|wrong)/i,
    how: /^how (do|does|can|to|should|would|will)/i,
    why: /^why (do|does|is|are|should|would)/i,
    what: /^what (is|are|does|do|about|makes)/i,
    where: /^where (is|are|should|can|do)/i,
    when: /^when (do|does|should|can|will)/i,
    comparison: /(compare|difference|versus|vs|better|worse|prefer|choice between)/i,
    recommendation: /(recommend|suggest|best|should i|which one|advise|opinion)/i,
    calculation: /(calculate|how much|how many|size|weight|volume|dimensions)/i,
    explanation: /(explain|describe|tell me about|what does|meaning of)/i,
    problem: /(problem|issue|error|fix|solve|troubleshoot|wrong|broken)/i,
    example: /(example|show me|demonstrate|for instance)/i,
  },

  // Expanded knowledge base with contextual information
  knowledgeBase: {
    // Module-specific information
    'noise': {
      keywords: ['noise', 'sound', 'loud', 'quiet', 'acoustic', 'decibel', 'db'],
      content: 'NASA requires noise separation between noisy modules (like Exercise, Workshop) and quiet zones (Crew Quarters, Medical). Minimum 3 meters distance is recommended to maintain crew comfort and sleep quality.',
      related: ['exercise', 'crew quarters', 'medical', 'zoning'],
    },
    
    'contamination': {
      keywords: ['contamination', 'dirty', 'clean', 'hygiene', 'sterile', 'sanitation'],
      content: 'Contamination control is critical. Dirty modules (Waste Management, Greenhouse) must be at least 5 meters from clean areas (Food Storage, Medical Bay) to prevent biological hazards and maintain hygiene standards.',
      related: ['waste', 'medical', 'food', 'zoning'],
    },
    
    'radiation': {
      keywords: ['radiation', 'rad', 'shielding', 'protection', 'solar', 'cosmic'],
      content: 'Radiation protection is achieved through:\n• Strategic module placement (storage modules as shields)\n• Water walls surrounding crew quarters\n• Storm shelters for solar events\n• Minimum required shielding: 10-20 g/cm² for LEO, 20-30 g/cm² for deep space\n• Crew quarters should be in the center with other modules forming protective layers',
      related: ['crew quarters', 'lunar', 'mars', 'safety'],
    },
    
    'life support': {
      keywords: ['life support', 'oxygen', 'o2', 'co2', 'air', 'breathe', 'atmosphere'],
      content: 'Life support systems include:\n• Oxygen generation (electrolysis from water)\n• CO2 removal (scrubbers and chemical processes)\n• Water recycling (93-98% efficiency)\n• Temperature and humidity control\n• Air circulation and filtration\n\n**Requirements per crew member:**\n• Oxygen: ~0.84 kg/day\n• Water: ~11.4 kg/day\n• Food: ~1.8 kg/day\n• Power: ~2-3 kW continuous',
      related: ['water', 'power', 'crew size'],
    },

    'crew quarters': {
      keywords: ['crew quarters', 'bedroom', 'sleep', 'personal space', 'cabin'],
      content: 'NASA crew quarter requirements:\n• Minimum 2m × 2m × 2m personal space\n• Acoustic isolation for sleep (<50 dB)\n• Adjustable lighting (circadian rhythm support)\n• Privacy partitions\n• Distance from noisy modules (>3m)\n• Personal storage (0.15 m³ per crew)\n• Communication equipment\n• Temperature control (20-25°C)',
      related: ['noise', 'crew size', 'zoning'],
    },

    'exercise': {
      keywords: ['exercise', 'workout', 'gym', 'fitness', 'treadmill'],
      content: 'Exercise modules are critical for:\n• Muscle atrophy prevention (2+ hours/day required)\n• Bone density maintenance\n• Cardiovascular health\n• Mental wellbeing\n\n**Considerations:**\n• Generates 70-85 dB noise\n• Requires isolation from crew quarters\n• Needs 10-15 m² space\n• Vibration damping systems required\n• Equipment: Treadmill, cycle ergometer, resistance devices',
      related: ['noise', 'crew quarters', 'health'],
    },

    'greenhouse': {
      keywords: ['greenhouse', 'farm', 'agriculture', 'plants', 'food production', 'crops'],
      content: 'Space greenhouses provide:\n• Fresh food production (supplements stored food)\n• Psychological benefits (green environment)\n• CO2 to O2 conversion (partial life support)\n• Water recycling through transpiration\n\n**Requirements:**\n• High water capacity\n• Contamination control\n• LED grow lights (specific wavelengths)\n• 5-10 m² per crew member for significant yield\n• Temperature: 18-28°C\n• Humidity: 60-80%',
      related: ['life support', 'water', 'contamination'],
    },

    'medical': {
      keywords: ['medical', 'health', 'clinic', 'doctor', 'sick bay', 'infirmary', 'first aid'],
      content: 'Medical bay requirements:\n• Clean environment (low contamination risk)\n• Privacy and quiet (<45 dB)\n• Emergency access from all modules\n• Diagnostic equipment storage\n• Minimum 2.5m × 2.5m × 2.5m space\n• Isolation capability (quarantine)\n• Surgical capability for long missions\n• Telemedicine setup\n• Medical supplies (1 kg per crew per month)',
      related: ['contamination', 'crew quarters', 'emergency'],
    },

    'airlock': {
      keywords: ['airlock', 'eva', 'spacewalk', 'exit', 'entry', 'decompression'],
      content: 'Airlock design considerations:\n• Minimum 2 crew members capacity\n• EVA suit storage (2-4 suits)\n• Decompression time: 30-90 minutes\n• Recompression time: 10-15 minutes\n• Contamination prevention (dust removal)\n• Emergency backup systems\n• Pre-breathe capability\n• Tool and equipment storage\n• Size: minimum 2m × 2m × 2m',
      related: ['emergency', 'safety', 'eva'],
    },

    'power': {
      keywords: ['power', 'energy', 'electricity', 'solar', 'nuclear', 'battery'],
      content: 'Power systems for habitats:\n\n**Solar Power (LEO/Lunar):**\n• Peak: 120-140 W/m² panel\n• Battery backup for eclipse periods\n• 30-50% capacity loss over 15 years\n\n**Nuclear (Mars/Deep Space):**\n• Kilopower reactors: 1-10 kW\n• RTGs for small systems\n• Fission reactors for large bases (100+ kW)\n\n**Requirements:**\n• Minimum: 2-3 kW per crew member\n• Total for 6 crew: 15-20 kW\n• Critical systems on redundant power\n• Energy storage: 24-48 hours backup',
      related: ['solar', 'mars', 'systems'],
    },

    'water': {
      keywords: ['water', 'h2o', 'hydration', 'drinking', 'recycling'],
      content: 'Water management systems:\n\n**Usage per crew/day:**\n• Drinking: 2-3 kg\n• Food preparation: 1-2 kg\n• Hygiene: 3-4 kg\n• Other: 2-3 kg\n• **Total: ~11 kg/person/day**\n\n**Recycling:**\n• ISS system: 93-98% recovery\n• From urine: 85% recovery\n• From humidity: 100% recovery\n• Storage: 50-100 kg reserve per crew\n• Backup reserves: 30+ days',
      related: ['life support', 'systems'],
    },

    'waste': {
      keywords: ['waste', 'trash', 'garbage', 'toilet', 'sewage'],
      content: 'Waste management strategies:\n\n**Solid Waste:**\n• Compaction and storage\n• ~1.8 kg per crew per day\n• Long missions: incineration or processing\n\n**Liquid Waste:**\n• Urine recycling into potable water\n• Wastewater treatment\n\n**Requirements:**\n• Isolation from food/medical areas (>5m)\n• Odor control systems\n• Hygiene and sanitation critical\n• Vacuum systems in microgravity',
      related: ['contamination', 'water', 'hygiene'],
    },

    'lunar': {
      keywords: ['lunar', 'moon', 'selene'],
      content: 'Lunar habitat considerations:\n\n**Environment:**\n• Gravity: 1/6 Earth (1.62 m/s²)\n• Day/night cycle: 14 Earth days each\n• Temperature: -173°C (night) to +127°C (day)\n• No atmosphere\n• Radiation: ~200-300 mSv/year surface\n\n**Design Factors:**\n• Regolith radiation shielding (2-3m thick)\n• ISRU: use lunar materials\n• Micrometeorite protection\n• Thermal management critical\n• Solar power + batteries\n• Communication delay: 1.3 seconds',
      related: ['radiation', 'isru', 'temperature'],
    },

    'mars': {
      keywords: ['mars', 'martian', 'red planet'],
      content: 'Mars habitat design:\n\n**Environment:**\n• Gravity: 38% Earth (3.71 m/s²)\n• Atmosphere: 0.6% Earth pressure (95% CO2)\n• Temperature: Average -60°C (-80°C to +20°C)\n• Day length: 24h 37min\n• Radiation: ~300 mSv/year surface\n\n**Design Requirements:**\n• Pressure vessel: 50-100 kPa internal\n• Dust storm protection\n• Radiation shielding (regolith/water)\n• ISRU for water, oxygen, fuel\n• Communication delay: 4-24 minutes\n• Long-duration life support\n• Psychological considerations (isolation)',
      related: ['radiation', 'isru', 'life support'],
    },

    'iss': {
      keywords: ['iss', 'international space station', 'station'],
      content: 'International Space Station design:\n\n**Specifications:**\n• Size: 109m × 73m × 20m\n• Pressurized volume: 931 m³\n• Crew: 6-7 permanent\n• Modules: 15 pressurized\n• Orbit: LEO ~400 km\n• Speed: 7.66 km/s\n\n**Environment:**\n• Microgravity (10⁻⁶ g)\n• Radiation: 150-200 mSv/year\n• Orbital period: 92 minutes\n• Modular construction\n• Continuous human presence since 2000',
      related: ['leo', 'modules', 'microgravity'],
    },

    'rigid': {
      keywords: ['rigid', 'aluminum', 'metal', 'solid', 'traditional'],
      content: 'Rigid construction modules:\n\n**Advantages:**\n• Pre-fabricated on Earth\n• Proven technology\n• High structural integrity\n• Easier environmental control\n• Better radiation protection\n\n**Disadvantages:**\n• Launch volume limited\n• Higher launch costs\n• Limited interior space\n\n**Materials:**\n• Aluminum alloys (primary)\n• Composite structures\n• Steel (structural)\n\n**Examples:** ISS modules, Skylab, most current designs',
      related: ['iss', 'construction', 'materials'],
    },

    'inflatable': {
      keywords: ['inflatable', 'expandable', 'beam', 'bigelow', 'fabric'],
      content: 'Inflatable habitat modules:\n\n**Advantages:**\n• Compact launch (5-6x expansion)\n• Lower launch costs\n• Larger living volume\n• Lighter weight\n\n**Technology:**\n• Multi-layer fabric (Kevlar, Vectran)\n• Radiation shielding integrated\n• Micrometeorite protection (equal to rigid)\n• Self-healing capabilities\n\n**Example:** Bigelow Aerospace BEAM on ISS\n• Launched: 2016\n• Compressed: 2.1m × 2.4m\n• Expanded: 3.2m × 4m\n• Performance: Exceeds expectations',
      related: ['rigid', 'construction', 'innovation'],
    },

    'isru': {
      keywords: ['isru', 'in-situ', 'local', 'resources', 'utilization'],
      content: 'ISRU (In-Situ Resource Utilization):\n\n**Lunar ISRU:**\n• Regolith for radiation shielding\n• Regolith for construction (3D printing)\n• Water ice at poles\n• Oxygen from regolith (ilmenite)\n• Metals extraction\n\n**Mars ISRU:**\n• Water from subsurface ice\n• Oxygen from CO2 atmosphere\n• Fuel (methane) from CO2 + water\n• Building materials from regolith\n• Propellant production\n\n**Benefits:**\n• Reduces Earth launch mass (80-90%)\n• Enables sustainable exploration\n• Lower costs',
      related: ['lunar', 'mars', 'construction'],
    },

    'mission duration': {
      keywords: ['duration', 'how long', 'time', 'length'],
      content: 'Mission duration impacts:\n\n**Short Duration (30-90 days):**\n• Minimal facilities needed\n• Stored consumables\n• Basic recycling\n• Smaller crew quarters\n\n**Medium Duration (6-12 months):**\n• ISS-like systems\n• Water/air recycling essential\n• Exercise requirements critical\n• Psychological support\n\n**Long Duration (2+ years):**\n• Full life support recycling\n• Food production capability\n• Extensive psychological support\n• High redundancy requirements\n• Crew rotation challenges\n\n**Mars Mission:** 500-900 days total\n• Transit: 6-9 months each way\n• Surface stay: 300-500 days',
      related: ['mars', 'life support', 'crew'],
    },

    'crew size': {
      keywords: ['crew', 'people', 'astronauts', 'team', 'how many'],
      content: 'Crew size considerations:\n\n**4 Crew Members:**\n• Minimum for skill diversity\n• Limited redundancy\n• Smaller habitat (60-80 m³)\n• Lower resource needs\n\n**6 Crew Members:**\n• ISS standard\n• Good balance\n• Proven sustainable\n• Social dynamics stable\n• Habitat size: 90-120 m³\n\n**10+ Crew Members:**\n• Large habitat required (150+ m³)\n• Complex social dynamics\n• Higher self-sufficiency\n• More specialized roles\n\n**General Rule:**\n• 10-15 m³ pressurized volume per person\n• 2-3 kW power per person\n• 11-12 kg consumables per person per day',
      related: ['habitat', 'life support', 'volume'],
    },

    'zoning': {
      keywords: ['zoning', 'layout', 'arrangement', 'organization', 'design'],
      content: 'Habitat zoning principles:\n\n**Noise Zones:**\n• Noisy areas: Exercise, workshop, machinery\n• Quiet zones: Crew quarters, medical\n• Minimum separation: 3 meters\n\n**Contamination Zones:**\n• Clean: Medical, food preparation\n• Dirty: Waste management, greenhouse\n• Minimum separation: 5 meters\n\n**Functional Zones:**\n• Work areas: Labs, workshops, control\n• Rest areas: Crew quarters, recreation\n• Support: Life support, storage, utilities\n\n**Safety Requirements:**\n• Emergency egress paths\n• Logical workflow patterns\n• Privacy considerations\n• Accessibility standards',
      related: ['noise', 'contamination', 'safety'],
    },

    'pathfinding': {
      keywords: ['path', 'corridor', 'hallway', 'passage', 'route', 'navigation'],
      content: 'Crew path requirements:\n\n**NASA Standards:**\n• Minimum clearance width: 1.0m\n• Preferred width: 1.2m\n• Height clearance: 2.0m minimum\n\n**Microgravity:**\n• No sharp corners (safety)\n• Handrails every 0.6m\n• Color-coded navigation\n• Foot restraints at work stations\n\n**Emergency:**\n• Multiple egress routes\n• Maximum travel distance to airlock: 15m\n• Clear path markings\n• Emergency lighting\n\n**Design:**\n• Straight paths preferred\n• Wide turns (radius > 1m)\n• Avoid dead ends',
      related: ['safety', 'emergency', 'design'],
    },
  },

  // Conversational responses
  responses: {
    greeting: [
      "Hello! 👋 I'm your Space Habitat AI Assistant. I'm here to help you design amazing space habitats! What would you like to know?",
      "Hey there! 🚀 Ready to explore space habitat design? Ask me anything!",
      "Greetings! I specialize in space habitat engineering. How can I assist you today?",
    ],
    gratitude: [
      "You're very welcome! 😊 Feel free to ask if you have more questions about space habitat design.",
      "Happy to help! 🚀 Let me know if you need anything else!",
      "My pleasure! Don't hesitate to ask more questions!",
    ],
    goodbye: [
      "Goodbye! 👋 Feel free to come back anytime you need help with space habitat design!",
      "See you later! 🚀 Good luck with your habitat design!",
      "Farewell! May your habitats be safe and your missions successful! 🌟",
    ],
    identity: [
      "I'm an AI assistant specialized in space habitat design! 🤖 I can help you with:\n• Module specifications and compatibility\n• NASA safety standards\n• Life support systems\n• Mission planning\n• Construction methods\n• And much more!\n\nWhat would you like to know?",
    ],
    capability: [
      "I can help you with a wide range of space habitat topics! 🚀\n\n📐 **Design & Architecture:**\n• Module types and specifications\n• Habitat layout and zoning\n• Construction methods (rigid, inflatable, ISRU)\n\n🔧 **Systems & Engineering:**\n• Life support (oxygen, water, waste)\n• Power systems (solar, nuclear)\n• Radiation protection\n• Thermal management\n\n🚀 **Mission Planning:**\n• Crew requirements\n• Duration considerations\n• Destination-specific design (Lunar, Mars, ISS)\n\n📏 **Standards & Safety:**\n• NASA requirements\n• Clearances and pathfinding\n• Emergency procedures\n\nJust ask me anything!",
    ],
    affirmation: [
      "Great! What else would you like to know?",
      "Excellent! Do you have any other questions?",
      "Glad I could help! Anything else?",
    ],
    unknown: [
      "I'm not quite sure about that specific topic, but I can help with:\n• Module design and specifications\n• Life support systems\n• Mission planning\n• Safety standards\n• Construction methods\n\nCould you rephrase your question or ask about one of these areas?",
    ],
  },

  // Enhanced response generation
  generateIntelligentResponse(userInput, conversationHistory = []) {
    const input = userInput.toLowerCase().trim();
    
    // Check conversational patterns first
    if (this.patterns.greeting.test(input)) {
      return this.getRandomResponse('greeting');
    }
    if (this.patterns.gratitude.test(input)) {
      return this.getRandomResponse('gratitude');
    }
    if (this.patterns.goodbye.test(input)) {
      return this.getRandomResponse('goodbye');
    }
    if (this.patterns.identity.test(input)) {
      return this.getRandomResponse('identity');
    }
    if (this.patterns.capability.test(input)) {
      return this.getRandomResponse('capability');
    }
    if (this.patterns.affirmation.test(input)) {
      return this.getRandomResponse('affirmation');
    }

    // Search knowledge base with enhanced matching
    const matches = this.searchKnowledge(input);
    
    if (matches.length > 0) {
      // Generate contextual response based on question type
      let response = '';
      
      // Add contextual intro based on question type
      if (this.patterns.how.test(userInput)) {
        response += "Here's how that works:\n\n";
      } else if (this.patterns.why.test(userInput)) {
        response += "Great question! Here's why:\n\n";
      } else if (this.patterns.what.test(userInput)) {
        response += "Let me explain:\n\n";
      } else if (this.patterns.comparison.test(input)) {
        response += "Here's a comparison:\n\n";
      }
      
      // Add matched knowledge
      response += matches.map(m => m.content).join('\n\n---\n\n');
      
      // Add related topics suggestion
      const related = this.getRelatedTopics(matches);
      if (related.length > 0) {
        response += `\n\n💡 **Related topics you might find interesting:**\n${related.map(r => `• ${r}`).join('\n')}`;
      }
      
      return response;
    }
    
    // Handle specific query types even without exact matches
    if (this.patterns.recommendation.test(input)) {
      return "I'd be happy to recommend a solution! To give you the best advice, could you tell me more about:\n• Your mission destination (Lunar, Mars, LEO?)\n• Crew size\n• Mission duration\n• Any specific constraints or requirements?\n\nThis will help me provide tailored recommendations!";
    }
    
    if (this.patterns.calculation.test(input)) {
      return "I can help with calculations! For accurate results, please specify:\n• What are you calculating? (volume, mass, power, etc.)\n• Mission parameters (crew size, duration, destination)\n• Any known values or constraints\n\nThen I can provide detailed calculations!";
    }
    
    if (this.patterns.problem.test(input)) {
      return "I'm here to help troubleshoot! To assist you better:\n• What specific issue are you encountering?\n• Which module or system is affected?\n• What are the symptoms or error messages?\n\nDescribe the problem and I'll help you solve it!";
    }
    
    if (this.patterns.example.test(input)) {
      return "I'd love to show you examples! What would you like to see examples of?\n• A specific module type?\n• A complete habitat design?\n• A system configuration?\n• A mission scenario?\n\nLet me know and I'll provide detailed examples!";
    }
    
    // Fallback with smart suggestions
    return this.generateSmartFallback(input);
  },

  // Search knowledge base with fuzzy matching
  searchKnowledge(query) {
    const matches = [];
    const query_lower = query.toLowerCase();
    
    for (const [topic, data] of Object.entries(this.knowledgeBase)) {
      // Check direct topic match
      if (query_lower.includes(topic.toLowerCase())) {
        matches.push({ topic, ...data });
        continue;
      }
      
      // Check keyword matches
      for (const keyword of data.keywords) {
        if (query_lower.includes(keyword.toLowerCase())) {
          matches.push({ topic, ...data });
          break;
        }
      }
    }
    
    return matches;
  },

  // Get related topics
  getRelatedTopics(matches) {
    const related = new Set();
    matches.forEach(match => {
      if (match.related) {
        match.related.forEach(r => related.add(r));
      }
    });
    // Remove topics that were already matched
    const matchedTopics = new Set(matches.map(m => m.topic));
    return Array.from(related).filter(r => !matchedTopics.has(r)).slice(0, 3);
  },

  // Generate smart fallback response
  generateSmartFallback(query) {
    // Extract potential keywords
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const suggestions = [];
    
    // Find partial matches
    for (const word of words) {
      for (const [topic, data] of Object.entries(this.knowledgeBase)) {
        if (topic.includes(word) || data.keywords.some(k => k.includes(word))) {
          suggestions.push(topic);
          if (suggestions.length >= 5) break;
        }
      }
      if (suggestions.length >= 5) break;
    }
    
    let response = `I understand you're asking about "${query}".\n\n`;
    
    if (suggestions.length > 0) {
      response += `I found some related topics that might help:\n${suggestions.map(s => `• ${s}`).join('\n')}\n\n`;
      response += "Try asking about one of these specifically!";
    } else {
      response += "I can help you with:\n\n";
      response += "📐 **Module Design:** Types, specifications, compatibility\n";
      response += "🔧 **Systems:** Life support, power, water, waste\n";
      response += "🚀 **Missions:** Lunar, Mars, ISS planning\n";
      response += "📏 **Standards:** NASA requirements, safety, zoning\n";
      response += "🏗️ **Construction:** Rigid, inflatable, ISRU methods\n\n";
      response += "Could you rephrase your question or ask about one of these areas?";
    }
    
    return response;
  },

  // Get random response from array
  getRandomResponse(type) {
    const responses = this.responses[type] || this.responses.unknown;
    return responses[Math.floor(Math.random() * responses.length)];
  },
};
