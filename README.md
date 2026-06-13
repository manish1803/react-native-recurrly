# Recurrly Mobile App

Vibrant, premium, glassmorphic React Native mobile application built on Expo SDK 54, integrated with Clerk for authentication and PostHog for real-time engagement analytics. The app connects to the Recurrly Node.js REST backend.

---

## Features

- **Dashboard / Spend Overview**: Beautiful metallic shimmer credit card interface summarizing total monthly spend and active subscription count.
- **Service Auto-Discovery**: Smart modal matching popular brands (Netflix, Spotify, GitHub, Claude, etc.) to their official brand logos via CDN logos or local bundled icons.
- **Detailed Insights**: High-performance SVG Donut Charts visually aggregating monthly spends by categories.
- **Subscriptions List & Filtering**: Clean, responsive layout to search and sort subscriptions by categories.
- **Detailed Settings**: Manage multi-tenant profiles, configure default currencies, rate the app, or delete all subscription data.

---

## Tech Stack & Design System

- **Framework**: [Expo SDK 54](https://expo.dev/) (React Native) with file-based routing via `expo-router`.
- **Styling**: Vanilla Tailwind CSS integrated via [NativeWind v4](https://www.nativewind.dev/).
- **Animations**: Fluid layouts, split grids, and metallic shimmer reflection effects built with [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/).
- **Auth Layer**: [Clerk Expo SDK](https://clerk.com/docs/references/expo/overview) supporting Google OAuth and password/MFA email verification.
- **Analytics**: [PostHog React Native SDK](https://posthog.com/docs/libraries/react-native) tracking screens, button interactions, subscription creation, status toggles, and deletion events.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (or yarn/pnpm)
- **Expo Go** app installed on your physical device (iOS or Android), or an active simulator.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize your local configuration file (`.env`):
   Create a `.env` file in the root of the `recurrly_app` directory:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   EXPO_PUBLIC_API_URL="http://localhost:3000"
   POSTHOG_PROJECT_TOKEN="phc_..."
   POSTHOG_HOST="https://us.i.posthog.com"
   EXPO_PUBLIC_LOGO_DEV_TOKEN="pk_..."
   ```

3. Launch Metro Bundler:
   ```bash
   npx expo start
   ```

4. Press `i` to launch iOS Simulator, `a` for Android Emulator, or scan the QR code using your phone's camera (iOS) or the Expo Go app (Android).
