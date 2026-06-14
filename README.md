# Recurrly Mobile App

![Recurrly App Thumbnail](./assets/images/thumbnail.png)

A vibrant, premium, and glassmorphic React Native mobile application built on Expo SDK 56. Recurrly helps users track, manage, and analyze recurring subscriptions with fluid micro-animations, unified brand iconography, and Clerk-managed multi-factor authentication.

---

## Key Features

- **Spend Overview Dashboard**: Features a premium, credit-card styled metallic shimmer interface detailing total monthly spends and active subscription counts.
- **Dynamic Brand Logo Engine**: Unified icon renderer (`ServiceIcon`) utilizing a logo.dev API with automatic CDN fallbacks (Simple Icons jsDelivr) and deterministic, colored initial-letter avatars.
- **Detailed Insights Page**: Leverages custom animated SVG donut charts to visually categorize monthly spends, accompanied by case-insensitive subscription billing intervals.
- **Adaptive Details Page**: Clean subscription profiles with custom loading screens and detailed NotFound/404 views.
- **Multi-Currency Selection**: Custom CurrencyPickerModal supporting regional preferences including USD ($), EUR (€), GBP (£), INR (₹), CAD (C$), AUD (A$), and JPY (¥).
- **Onboarding Experience**: Smooth onboarding layout that logs initial user engagement exactly once on landing.
- **Robust API Client**: Pre-configured HTTP module featuring request abort-timeout handlers (10s) and safe JSON parsing for 204/empty response bodies.

---

## Tech Stack & Architecture

- **Framework**: [Expo SDK 56](https://expo.dev/) (React Native) with file-based routing via `expo-router`.
- **Styling**: Vanilla Tailwind CSS integrated via [NativeWind v5](https://www.nativewind.dev/) (css-in-js styling paradigm).
- **Animations**: Timed splash scaling, opacity animations, and metallic reflections built with [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/).
- **Authentication**: [Clerk Expo SDK](https://clerk.com/docs/references/expo/overview) supporting Google OAuth SSO and secure password/MFA email verification.
- **Analytics**: [PostHog React Native SDK](https://posthog.com/docs/libraries/react-native) tracking user navigation, subscription CRUD logs, status toggles, and detail views without distinct ID fragmentation.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm
- **Expo Go** app installed on your physical device, or an active simulator.

### Installation

1. Install application dependencies:
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

3. Validate the environment and compile code:
   Ensure all TypeScript declarations and styling parameters are properly compiled:
   ```bash
   # Run type-checking
   npx tsc --noEmit

   # Run ESLint validation
   npm run lint
   ```

4. Launch the Application:
   Depending on your target emulator/device, execute one of the following commands:
   ```bash
   # Run on iOS Simulator/Device
   npm run ios

   # Run on Android Emulator/Device
   npm run android
   ```
