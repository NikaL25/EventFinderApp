# 📍 Event Finder App

Event Finder is a mobile application built with **React Native** and **Expo** that helps users discover upcoming events based on their location or interests. It integrates with the **Eventbrite API** to fetch real-time event data.

---

## ✨ Features

- 🔍 Search for events by keyword or location
- 📅 View event details (date, time, venue, etc.)
- 🧭 Navigate between screens using React Navigation
- 🚀 Supports live updates via [EAS Update](https://expo.dev/)

---

## 🚀 Live Demo

To preview the latest version of the app:

1. Download the **Expo Go** app:

   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Open this link on your device:  
   👉 [Live Preview via EAS](https://expo.dev/accounts/nikalomiashvili/projects/event-finder-app/updates/4cedcfee-80b7-45d9-a625-686ddf5c313d)

---

## 🛠️ Getting Started Locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/NikaL25/EventFinderApp.git
cd EventFinderApp
npm install
```

Start the Expo development server:

npx expo start

Scan the QR code from the terminal using Expo Go on your phone to launch the app.

☁️ Deploying with EAS

This app supports EAS Update
for publishing over-the-air updates.

To publish changes:
eas update --branch preview --message "Live Demo"

Make sure you’ve installed expo-updates:
npx expo install expo-updates
