# Agri Hub — App Sharing & Deployment Guide

This guide details all methods to share **Agri Hub** with team members, clients, buyers, suppliers, or developers.

---

## Method 1: Share Standalone Android APK File (`.apk`) 📲
*(Best for sharing directly with non-developers to test on any Android phone)*

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Log in to your free Expo Account
```bash
eas login
```

### Step 3: Build a downloadable APK file
```bash
eas build -p android --profile preview
```
> **Result:** EAS will generate a direct download link for an `.apk` file. Anyone can download and install it on their Android phone!

---

## Method 2: Share Live QR Code via Expo Go ⚡
*(Best for instant live testing on anyone's physical phone)*

### Step 1: Start Expo server with tunnel mode
```bash
npx expo start --tunnel
```

### Step 2: Share QR Code / Link
1. Ask the other person to install **Expo Go** from the Google Play Store or Apple App Store.
2. Send them the generated QR code or Expo URL (`exp://...`).
3. Scanning the QR code opens **Agri Hub** live on their phone!

---

## Method 3: Share GitHub Repository 🐙
*(Best for developers, pair programming, or version control)*

Send them your GitHub repository URL:
👉 **[https://github.com/aadhyaaradhya/agri_hub_mobile](https://github.com/aadhyaaradhya/agri_hub_mobile)**

### Developer Setup Commands:
```bash
git clone https://github.com/aadhyaaradhya/agri_hub_mobile.git
cd agri_hub_mobile
npm install
npx expo start
```

---

## Method 4: Host as a Web Application 🌐
*(Best for opening in any desktop or mobile browser)*

### Step 1: Export Web Build
```bash
npx expo export:web
```

### Step 2: Deploy to Vercel or Netlify
Deploy the `web-build` directory to Vercel, Netlify, or GitHub Pages for a 1-click web URL!
