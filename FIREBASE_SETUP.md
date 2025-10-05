# Firebase Setup Guide - Community Platform Phase 1

## Overview
This guide will walk you through setting up Firebase Firestore for the Space Habitat Game community platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name (e.g., "space-habitat-community")
   - Accept terms and click Continue
   - (Optional) Enable Google Analytics
   - Click "Create Project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Register the app:
   - App nickname: "Space Habitat Game"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
3. **Copy the Firebase configuration object** - you'll need this!

## Step 3: Update Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Choose a location closest to your users
4. Start in **Test Mode** for development (we'll update rules next)
5. Click "Enable"

## Step 5: Configure Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all published designs
    match /public_designs/{designId} {
      allow read: if true;
      allow write: if true; // DEVELOPMENT ONLY - see production rules below
    }
  }
}
```

3. Click **Publish**

### Production Rules (For Future Use)
When you implement authentication, update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /public_designs/{designId} {
      allow read: if true; // Anyone can view published designs
      allow create: if request.auth != null; // Only authenticated users can create
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.creatorId;
    }
  }
}
```

## Firestore Data Structure

### Collection: `public_designs`

Each document in this collection represents a published habitat design.

#### Document Schema:

```javascript
{
  // Design Identification
  "designName": "String - User-provided name (e.g., 'Ares I Lunar Outpost')",
  "creatorName": "String - Designer's display name (e.g., 'Commander Alex')",
  
  // Visual Preview
  "thumbnail": "String - Base64 encoded JPEG image for gallery preview",
  
  // Mission Parameters
  "missionParams": {
    "crewSize": "Number - Number of crew members (e.g., 4)",
    "destination": "String - 'lunar', 'mars', or 'orbit'",
    "duration": "String - 'short', 'medium', or 'long'",
    "constructionType": "String - 'rigid', 'inflatable', or 'isru'"
  },
  
  // Habitat Structure
  "modules": [
    {
      "type": "String - Module type (e.g., 'living', 'lab', 'storage', 'airlock')",
      "position": {
        "x": "Number - X coordinate in 3D space",
        "y": "Number - Y coordinate (floor level)",
        "z": "Number - Z coordinate in 3D space"
      }
    }
    // ... more modules
  ],
  
  // Metadata
  "createdAt": "Timestamp - Firestore server timestamp"
}
```

#### Example Document:

```javascript
{
  "designName": "Lunar Research Station Alpha",
  "creatorName": "Commander Sarah",
  "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "missionParams": {
    "crewSize": 6,
    "destination": "lunar",
    "duration": "long",
    "constructionType": "rigid"
  },
  "modules": [
    {
      "type": "living",
      "position": { "x": 0, "y": 0, "z": 0 }
    },
    {
      "type": "lab",
      "position": { "x": 3, "y": 0, "z": 0 }
    },
    {
      "type": "airlock",
      "position": { "x": 6, "y": 0, "z": 0 }
    }
  ],
  "createdAt": Timestamp(2025, 10, 5, 14, 30, 0)
}
```

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the following URLs:
   - `http://localhost:5173/` - Landing page
   - `http://localhost:5173/designer` - Habitat designer
   - `http://localhost:5173/hub` - Community hub

3. Check browser console for any Firebase errors

## Common Issues

### "Firebase: Error (auth/api-key-not-valid)"
- Double-check that you copied the entire API key correctly
- Ensure there are no extra spaces in the configuration

### "Missing or insufficient permissions"
- Verify that you published the security rules in Firestore
- Check that rules are in "Test Mode" for development

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- This means Firebase is being initialized multiple times
- Make sure you're only importing `db` from `src/firebase.js`

## Next Steps

Once Firebase is configured:
1. ✅ Phase 1 complete - Foundation is ready!
2. 📋 Phase 2 - Implement "Publish to Community" feature
3. 🖼️ Phase 3 - Build the design gallery UI
4. 🔍 Phase 4 - Add filtering and search capabilities

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries Guide](https://firebase.google.com/docs/firestore/query-data/queries)
- [Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
