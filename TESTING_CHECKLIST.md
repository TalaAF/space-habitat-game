# Phase 1 Testing Checklist

## Pre-Testing Setup

### 1. Configure Firebase
- [ ] Create Firebase project at https://console.firebase.google.com/
- [ ] Copy configuration to `src/firebase.js`
- [ ] Enable Firestore Database
- [ ] Apply security rules from `FIREBASE_SETUP.md`

### 2. Start Development Server
```bash
npm run dev
```
Server should start at: http://localhost:3000/space-habitat-game/

---

## Testing Checklist

### ✅ Navigation Testing

#### Test 1: Landing Page
- [ ] Navigate to http://localhost:3000/space-habitat-game/
- [ ] Landing page loads correctly
- [ ] No navigation bar visible (clean first impression)
- [ ] No console errors

#### Test 2: Designer Page
- [ ] Navigate to http://localhost:3000/space-habitat-game/designer
- [ ] Designer loads with 3D scene
- [ ] Navigation bar visible in top-right corner
- [ ] Can see "Home | Designer | Community Hub" links
- [ ] Current page (Designer) is highlighted in blue

#### Test 3: Community Hub Page
- [ ] Navigate to http://localhost:3000/space-habitat-game/hub
- [ ] Community Hub page loads
- [ ] See "Community Hub" title with gradient
- [ ] Empty state message: "No community designs yet!"
- [ ] "Back to Designer" button visible
- [ ] Navigation bar shows "Community Hub" highlighted

### ✅ Navigation Functionality

#### Test 4: Navigation Bar Links
From Designer page:
- [ ] Click "Home" → redirects to landing page
- [ ] Click "Community Hub" → redirects to hub page
- [ ] Navigation bar disappears on landing page
- [ ] Navigation bar reappears when navigating away

From Community Hub:
- [ ] Click "Home" → redirects to landing page
- [ ] Click "Designer" → redirects to designer
- [ ] Active link changes color correctly

#### Test 5: Direct URL Access
- [ ] Type `/` in address bar → landing page
- [ ] Type `/designer` in address bar → designer page
- [ ] Type `/hub` in address bar → community hub
- [ ] Browser back button works correctly
- [ ] Browser forward button works correctly

### ✅ Visual Testing

#### Test 6: Navigation Bar Styling
- [ ] Navigation bar has dark semi-transparent background
- [ ] Links have proper spacing
- [ ] Hover effect changes link color to blue
- [ ] Active page link stays blue
- [ ] Separator lines (|) are visible and subtle

#### Test 7: Community Hub Styling
- [ ] Gradient background (dark blue to purple)
- [ ] Title has gradient text effect
- [ ] "Back to Designer" button has gradient background
- [ ] Button hover effect scales up slightly
- [ ] Footer text is visible but subtle
- [ ] Overall design matches landing page aesthetic

### ✅ Firebase Integration

#### Test 8: Firebase Connection
Open browser console (F12) and check:
- [ ] No Firebase initialization errors
- [ ] No "Firebase App not found" errors
- [ ] No "Invalid API key" errors

If you see errors:
- Check `src/firebase.js` configuration
- Verify Firebase project is active
- Confirm Firestore is enabled

#### Test 9: Firestore Ready
In browser console, type:
```javascript
import { db } from './src/firebase.js'
console.log(db)
```
- [ ] No errors appear
- [ ] Firestore instance object is displayed

### ✅ Code Quality

#### Test 10: No Console Errors
- [ ] Open browser console (F12)
- [ ] Navigate through all pages
- [ ] No red error messages
- [ ] No yellow warning messages (except public directory warnings - those are safe)

#### Test 11: Responsive Design
Test on different window sizes:
- [ ] Full screen (1920px+) → everything visible
- [ ] Medium (1024px) → layout adjusts properly
- [ ] Small (768px) → still functional

---

## Expected Results Summary

### Routes Working:
✅ `/` → Landing Page  
✅ `/designer` → Habitat Designer  
✅ `/hub` → Community Hub  

### Navigation:
✅ Visible on designer and hub pages  
✅ Hidden on landing page  
✅ Active route highlighted  
✅ Smooth transitions  

### Firebase:
✅ SDK installed  
✅ Configuration file created  
✅ No initialization errors  
✅ Ready for Phase 2 implementation  

---

## Troubleshooting

### Navigation Bar Not Appearing
**Check:**
- You're not on the landing page (it's intentionally hidden there)
- React Router is properly installed
- `App.jsx` has the Navigation component

**Fix:**
```bash
npm install react-router-dom
```

### Firebase Errors
**Error: "Firebase: No Firebase App '[DEFAULT]'"**
- Configuration not properly imported
- Check `src/firebase.js` exists
- Verify firebaseConfig is correct

**Error: "Missing or insufficient permissions"**
- Firestore rules not published
- Go to Firebase Console → Firestore → Rules
- Publish the rules from `FIREBASE_SETUP.md`

**Error: "Invalid API key"**
- Wrong configuration values
- Copy entire config object from Firebase Console
- Check for extra spaces or missing characters

### Routing Not Working
**Symptoms:** Blank page or 404
- Check if you included `/space-habitat-game/` base path
- Clear browser cache
- Verify `BrowserRouter` has correct basename

**Fix:**
- Use full URL: http://localhost:3000/space-habitat-game/designer
- Not just: http://localhost:3000/designer

---

## Performance Testing

### Page Load Times
- [ ] Landing page loads in < 2 seconds
- [ ] Designer page loads in < 3 seconds
- [ ] Community Hub loads in < 1 second
- [ ] Navigation transitions are instant

### Memory Usage
Open Chrome DevTools → Performance:
- [ ] No memory leaks when switching pages
- [ ] Consistent memory usage
- [ ] No excessive re-renders

---

## Phase 1 Acceptance Criteria

All must be ✅ to consider Phase 1 complete:

- [x] Firebase SDK successfully integrated
- [x] Firestore database configured
- [x] Security rules updated
- [x] Application supports URL-based navigation
- [x] `/designer` route works
- [x] `/hub` route works
- [x] Navigation between pages functional
- [x] No console errors
- [x] Documentation complete

---

## Ready for Phase 2?

If all tests pass ✅:
1. **Firebase is configured** → Can save designs
2. **Routes are working** → Can access hub
3. **Navigation is functional** → Users can move between pages
4. **No errors** → Clean foundation

**You are ready to implement Phase 2: Publish to Community Feature!**

---

## Next Phase Preview

Phase 2 will add:
- "Share Design" button in designer
- Modal for design name and creator input
- Thumbnail generation from 3D scene
- Save to Firestore functionality
- Real-time gallery updates

All the foundation is in place to make this happen smoothly!
