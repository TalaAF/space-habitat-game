# Quick Reference: Extending the AI Assistant Knowledge Base

## Adding New Topics

### Step 1: Edit AIAssistant.jsx

Find the `knowledgeBase` object in the `generateResponse` function (around line 47):

```javascript
const knowledgeBase = {
  'existing-keyword': 'existing response...',
  
  // ADD YOUR NEW TOPIC HERE:
  'your-keyword': 'Your detailed response here. Can include:\n• Bullet points\n• Multiple lines\n• Technical details\n• NASA standards',
}
```

### Step 2: Use Descriptive Keywords

Choose keywords that users are likely to type:

**Good Keywords:**
- `'solar panels'` - Specific and clear
- `'communication'` - Common term
- `'emergency'` - User intent

**Bad Keywords:**
- `'sp'` - Too short, will match many words
- `'solar_panels_system'` - Users won't type underscores
- `'COMM-SYS'` - Too technical/abbreviated

### Step 3: Format Responses Well

Use line breaks (`\n`) and bullet points for readability:

```javascript
'thermal control': 'Space habitats require active thermal management:\n\n' +
  '**Challenges:**\n' +
  '• Solar heating (up to +120°C in sunlight)\n' +
  '• Deep cold in shadow (-150°C or colder)\n' +
  '• No atmosphere for convection\n\n' +
  '**Solutions:**\n' +
  '• Radiators to reject heat\n' +
  '• Multi-layer insulation (MLI)\n' +
  '• Heat pipes and pumps\n' +
  '• Thermal coatings on exterior'
```

## Example: Adding New Module Type

Let's add information about a "Communications Module":

```javascript
'communication': 'Communications Module requirements:\n\n' +
  '**Functions:**\n' +
  '• Earth communications (S-band, Ka-band)\n' +
  '• EVA suit comms (UHF)\n' +
  '• Inter-module networking\n' +
  '• Emergency beacons\n\n' +
  '**Key Requirements:**\n' +
  '• Redundant systems (backup transponders)\n' +
  '• Line-of-sight to Earth or relay satellites\n' +
  '• Power: 2-5 kW continuous\n' +
  '• Cooling for electronics\n' +
  '• Antenna deployment mechanisms\n\n' +
  '**Placement:**\n' +
  '• External antennas (outside pressure hull)\n' +
  '• Electronics bay with thermal management\n' +
  '• Access for maintenance\n\n' +
  '**Data Rates:**\n' +
  '• Low Earth Orbit: 300+ Mbps\n' +
  '• Lunar distance: 10-50 Mbps\n' +
  '• Mars distance: 0.5-4 Mbps (delay: 4-24 min)',
```

## Example: Adding Mission Scenario

Let's add "Europa mission" information:

```javascript
'europa': 'Europa (Jupiter moon) habitat considerations:\n\n' +
  '**Extreme Environment:**\n' +
  '• Distance: 780 million km from Earth\n' +
  '• Temperature: -160°C surface average\n' +
  '• Radiation: Intense (Jupiter magnetosphere)\n' +
  '• Gravity: 13% of Earth\n\n' +
  '**Design Requirements:**\n' +
  '• Heavy radiation shielding (water walls + lead)\n' +
  '• Nuclear power (RTGs or fission reactor)\n' +
  '• Subsurface deployment (ice drilling)\n' +
  '• Extreme insulation systems\n' +
  '• Communication relays (no direct Earth line)\n\n' +
  '**Mission Duration:**\n' +
  '• Transit: 6-8 years\n' +
  '• Surface operations: 2+ years\n' +
  '• Total: 10+ years\n\n' +
  '**Challenges:**\n' +
  '• Psychological isolation (45+ min communication delay)\n' +
  '• Limited resupply options\n' +
  '• Equipment reliability critical\n' +
  '• Contamination prevention (protect Europa ocean)',
```

## Tips for Great Responses

### 1. Structure Information Clearly
Use headers, bullet points, and spacing:
```
**Category:**
• Point 1
• Point 2

**Another Category:**
• Different point
```

### 2. Include Numbers and Specifications
Users love specific data:
- ✅ "Minimum 1.0m clearance width"
- ❌ "Wide enough for crew to pass"

### 3. Explain "Why"
Don't just list requirements, explain reasoning:
- ✅ "Noise separation (>3m) ensures crew sleep quality and reduces stress"
- ❌ "Keep 3m apart"

### 4. Add Context
Compare to familiar concepts:
- "Mars gravity is 38% of Earth - like walking with a heavy backpack removed"
- "ISS volume (388 m³) = interior of a 747 airplane"

### 5. Cross-Reference Topics
Link related concepts:
- "See also: life support systems, power requirements, radiation protection"

## Quick Copy-Paste Templates

### Module Template
```javascript
'module-name': 'Module Name requirements:\n\n' +
  '**Functions:**\n' +
  '• Function 1\n' +
  '• Function 2\n\n' +
  '**Requirements:**\n' +
  '• Size: X m × Y m × Z m\n' +
  '• Power: X kW\n' +
  '• Crew capacity: X people\n\n' +
  '**Placement Considerations:**\n' +
  '• Consideration 1\n' +
  '• Consideration 2',
```

### System Template
```javascript
'system-name': 'System Name overview:\n\n' +
  '**Purpose:**\n' +
  'What it does and why it matters\n\n' +
  '**Components:**\n' +
  '• Component 1\n' +
  '• Component 2\n\n' +
  '**Key Specifications:**\n' +
  '• Spec 1: Value\n' +
  '• Spec 2: Value\n\n' +
  '**Maintenance:**\n' +
  'How often serviced, what to check',
```

### Destination Template
```javascript
'destination-name': 'Destination Name habitat design:\n\n' +
  '**Environment:**\n' +
  '• Gravity: X% of Earth\n' +
  '• Temperature: X°C\n' +
  '• Atmosphere: X\n' +
  '• Radiation: X\n\n' +
  '**Design Priorities:**\n' +
  '• Priority 1\n' +
  '• Priority 2\n\n' +
  '**Unique Challenges:**\n' +
  '• Challenge 1\n' +
  '• Challenge 2',
```

## Testing Your Additions

1. **Save the file** - HMR will reload the component
2. **Open the AI Assistant** in your browser
3. **Type your keyword** in a question
4. **Check the response** appears correctly
5. **Test variations** of the keyword:
   - "tell me about [keyword]"
   - "what is [keyword]"
   - "explain [keyword]"

## Common Mistakes to Avoid

❌ **Forgetting comma after entry:**
```javascript
'keyword': 'response'  // Missing comma!
'next-keyword': 'next response'
```

❌ **Using quotes inside strings without escaping:**
```javascript
'bad': 'This is a "quoted" word'  // Breaks!
'good': 'This is a \'quoted\' word'  // Escaped
'better': "This is a 'quoted' word"  // Use double quotes
```

❌ **Super long responses (hard to read):**
Break into paragraphs and use bullet points

❌ **Too technical:**
Remember: users are learning, not experts yet

❌ **Contradicting existing information:**
Check knowledge base for consistency

## Pro Tips

### Multiple Keywords for Same Topic
If users might search different ways:

```javascript
'oxygen': 'Life support systems include:\n• Oxygen generation...',
'o2': 'Life support systems include:\n• Oxygen generation...',  // Same response
'life support': 'Life support systems include:\n• Oxygen generation...',
```

Or use the keyword matching to combine:
```javascript
// User asks: "oxygen and water"
// System finds both 'oxygen' and 'water' keywords
// Combines both responses automatically!
```

### Emoji Usage
Add visual interest:
- 🚀 Missions and launch
- 🔧 Systems and engineering
- ⚠️ Warnings and cautions
- ✅ Requirements met
- 📊 Statistics and data
- 🌍 Earth
- 🌙 Moon
- 🔴 Mars

### Update Regularly
As game features expand, add matching AI assistance!

---

**Now you can expand the AI Assistant with unlimited knowledge! 🎓**
