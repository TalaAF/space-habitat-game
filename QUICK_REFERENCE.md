# Quick Reference - Publishing Feature

## 🚀 How to Test the Feature

### Prerequisites
1. **Configure Firebase** (if not done yet):
   - Follow `FIREBASE_SETUP.md`
   - Update `src/firebase.js` with your config
   - Set up Firestore security rules

2. **Start the app**:
   ```bash
   npm run dev
   ```
   Navigate to: http://localhost:3000/space-habitat-game/designer

### Test Steps
1. **Build a habitat**:
   - Add at least one module (living, lab, storage, etc.)
   - Configure mission parameters if desired
   - Position camera for a good view

2. **Click "🌐 Publish to Community"** button (top-right)

3. **Fill in the modal**:
   - Design name: e.g., "Lunar Base Alpha"
   - Creator name: e.g., "Astronaut Mike"
   - Click "Confirm & Publish"

4. **Wait for upload**:
   - Loading spinner appears
   - Takes 1-3 seconds

5. **Success!**:
   - Alert: "✅ Your design has been successfully published..."
   - Automatically redirected to Community Hub

6. **Verify in Firebase Console**:
   - Go to: https://console.firebase.google.com
   - Firestore Database → public_designs
   - See your new design document

---

## 📂 Key Files

### Created:
- `src/components/UI/PublishModal.jsx` - Modal UI component

### Modified:
- `src/components/Game/Scene.jsx` - Added `preserveDrawingBuffer: true`
- `src/components/UI/HUD.jsx` - Added publish button
- `src/pages/DesignerPage.jsx` - Complete publishing logic
- `src/utils/firestoreHelpers.js` - Thumbnail capture
- `src/styles/index.css` - Publish button styles

---

## 🔍 Code Locations

### Where is the Publish Button?
**File**: `src/components/UI/HUD.jsx`
**Line**: ~17
```jsx
<button className="publish-btn" onClick={onPublish}>
  🌐 Publish to Community
</button>
```

### Where is the Publishing Logic?
**File**: `src/pages/DesignerPage.jsx`
**Function**: `handlePublish(designName, creatorName)`
**Line**: ~115-180

### Where is Thumbnail Captured?
**File**: `src/utils/firestoreHelpers.js`
**Function**: `generateThumbnail(renderer)`
**Uses**: `renderer.domElement.toDataURL('image/jpeg', 0.5)`

### Where is Data Validated?
**File**: `src/utils/firestoreHelpers.js`
**Function**: `validateDesignData(designData)`
**Checks**: Name, creator, modules, positions

### Where is Data Saved?
**File**: `src/utils/firestoreHelpers.js`
**Function**: `publishDesign(designData)`
**Collection**: `public_designs`

---

## 🎯 Data Flow

```
User clicks "Publish" 
  ↓
handlePublishClick() validates modules exist
  ↓
PublishModal opens
  ↓
User enters names, clicks "Confirm & Publish"
  ↓
handlePublish() called with (designName, creatorName)
  ↓
generateThumbnail(renderer) captures canvas
  ↓
designData object created with:
  - designName
  - creatorName
  - thumbnail (Base64 JPEG)
  - missionParams (copy)
  - modules (sanitized array)
  ↓
validateDesignData() checks structure
  ↓
publishDesign() writes to Firestore
  - Uses addDoc()
  - Adds serverTimestamp()
  - Returns document ID
  ↓
Success alert shown
  ↓
navigate('/hub') redirects to Community Hub
```

---

## ⚠️ Common Issues

### Issue: "Failed to capture thumbnail"
**Fix**: Restart dev server after adding `preserveDrawingBuffer: true`

### Issue: "Permission denied"
**Fix**: Update Firestore security rules (see FIREBASE_SETUP.md)

### Issue: Button doesn't appear
**Fix**: Check HUD.jsx has `onPublish` prop passed

### Issue: Modal doesn't open
**Fix**: Check console for errors, verify PublishModal imported

### Issue: No navigation after publish
**Fix**: Verify `useNavigate` is imported from react-router-dom

---

## 📊 Firestore Document Structure

```javascript
{
  designName: "Lunar Base Alpha",        // String, user input
  creatorName: "Astronaut Mike",         // String, user input
  thumbnail: "data:image/jpeg;base64,/9j...", // Base64 JPEG (quality 0.5)
  missionParams: {                       // Object, from state
    crewSize: 4,                         // Number
    destination: "lunar",                // String
    duration: "short",                   // String
    constructionType: "rigid"            // String
  },
  modules: [                             // Array of objects
    {
      type: "living",                    // String
      position: { x: 0, y: 0, z: 0 }     // Object with numbers
    }
    // ... more modules
  ],
  createdAt: Timestamp(...)              // Firestore server timestamp
}
```

---

## 🔧 Customization Points

### Change Thumbnail Quality
**File**: `src/utils/firestoreHelpers.js`
**Line**: ~20
```javascript
// Change 0.5 to 0.8 for higher quality (larger file)
const dataURL = renderer.domElement.toDataURL('image/jpeg', 0.5);
```

### Change Validation Rules
**File**: `src/utils/firestoreHelpers.js`
**Function**: `validateDesignData()`
**Modify**: Character limits, required fields

### Change Success Message
**File**: `src/pages/DesignerPage.jsx`
**Line**: ~170
```javascript
alert('✅ Your design has been successfully published to the Community Hub!');
```

### Change Navigation Destination
**File**: `src/pages/DesignerPage.jsx`
**Line**: ~173
```javascript
navigate('/hub'); // Change to any route
```

---

## 📝 Testing Checklist

- [ ] Button appears in designer HUD
- [ ] Clicking with no modules shows error
- [ ] Modal opens when button clicked
- [ ] Can type in design name field
- [ ] Can type in creator name field
- [ ] Character counters update
- [ ] Empty fields show validation errors
- [ ] Long names (50+) show validation errors
- [ ] Loading spinner appears on publish
- [ ] Inputs disabled during upload
- [ ] Success alert appears
- [ ] Automatically navigate to /hub
- [ ] Document appears in Firestore
- [ ] Thumbnail is valid Base64 JPEG
- [ ] All fields match input data

---

## 🚀 What's Next?

### Phase 3: Display Gallery
- Fetch designs from Firestore
- Create DesignCard component
- Grid layout in CommunityHubPage
- Show thumbnails and info

### Phase 4: Filtering & Search
- Filter by destination
- Filter by crew size
- Sort by date
- Search by name

---

## 📞 Need Help?

Check these files:
- `PHASE2_COMPLETE.md` - Full implementation details
- `FIREBASE_SETUP.md` - Firebase configuration
- `TESTING_CHECKLIST.md` - Comprehensive tests

**Server URL**: http://localhost:3000/space-habitat-game/designer

**Firebase Console**: https://console.firebase.google.com

---

**Feature Status**: ✅ Complete and ready to use!
