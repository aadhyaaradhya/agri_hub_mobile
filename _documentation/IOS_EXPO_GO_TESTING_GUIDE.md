# Agri Hub — Instant iPhone (iOS) Testing Guide via Expo Go 🍏⚡

This step-by-step guide explains how to run and test the **Agri Hub** mobile application on any **iPhone or iPad** completely free using **Expo Go**.

---

## Prerequisites

| Requirement | Description |
| :--- | :--- |
| **Target Device** | Any iPhone or iPad running iOS 13.0 or later |
| **Developer Laptop** | Windows / Mac running Agri Hub project |
| **Network** | Any Internet connection (Wi-Fi or Mobile 4G/5G data) |

---

## Step 1: Install Tunnel Tool on Developer Laptop

Tunnel mode creates a secure global URL that allows your iPhone to connect to the app from **any network in the world** (even if the laptop and iPhone are on different Wi-Fi networks or mobile data).

Open your computer's terminal and run:
```bash
npm install -g @expo/ngrok
```

---

## Step 2: Start Expo Dev Server in Tunnel Mode

In your project directory (`agro_react_native`), run:
```bash
npx expo start --tunnel
```

After a few seconds, the terminal will display a **large QR Code** and a tunnel URL:
```text
Tunnel ready.
Logs for your project will appear below.

Scan the QR code below with Expo Go (Android) or the Camera app (iOS)

  exp://u.expo.dev/2d25ce86-ea1c-470a-bb59-980f8725d288?channel-name=main
```

---

## Step 3: Install Expo Go App on iPhone

1. On the iPhone, open the **Apple App Store**.
2. Search for **"Expo Go"**.
3. Tap **Get / Download** (Free, developed by 650 Industries).

---

## Step 4: Scan & Open Agri Hub on iPhone

1. Open the standard **iOS Camera app** on the iPhone.
2. Point the iPhone camera at the QR Code displayed in your computer terminal.
3. A notification banner will pop up at the top of the iPhone screen:
   👉 **`Open in "Expo Go"`**
4. Tap the notification banner!

---

## Step 5: Enjoy Testing Agri Hub on iPhone! 🎉

* **Agri Hub** will bundle assets and launch live on the iPhone screen in ~5 seconds.
* **Live Reloading:** Any code edits saved on your laptop will automatically update on the iPhone screen in real-time!
* **Developer Menu:** Shake the iPhone to open the Expo Developer Menu (reload, toggle performance monitor, debug mode).

---

## 🛠️ Frequently Asked Questions & Troubleshooting

### Q1: The iPhone says "Could not connect to server"?
* **Fix:** Ensure you ran `npx expo start --tunnel` (not plain `npx expo start`). Tunnel mode ensures connectivity across different networks.

### Q2: Camera app doesn't show the "Open in Expo Go" banner?
* **Fix:** Go to iPhone **Settings → Camera → Scan QR Codes** and make sure it is turned ON. Alternatively, open Expo Go directly, log in to your free Expo account, and tap the project under *Recently Opened*.

### Q3: Does the iPhone user need a developer account?
* **No!** Any user can test for free with just the Expo Go app.
