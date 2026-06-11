<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Expo / React Native subscription manager app. Here's a summary of every change made:

**Infrastructure**
- Installed `posthog-react-native` and its Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`).
- Converted `app.json` → `app.config.js` so PostHog credentials can be read from environment variables at build time via `extra.posthogProjectToken` / `extra.posthogHost`.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env` (gitignored).
- Created `src/config/posthog.ts` — a singleton PostHog client using `expo-constants` to read credentials; gracefully disabled when the token is missing; debug mode enabled in dev.

**Provider & screen tracking**
- Wrapped the root layout (`app/_layout.tsx`) with `PostHogProvider` (inside `ClerkProvider`) with autocapture for touch events and manual screen tracking via `usePathname` / `useGlobalSearchParams`.

**Event capture & user identification**
- `app/(auth)/sign-in.tsx` — `posthog.identify()` + `user_signed_in` after `finalizeSignIn()` succeeds.
- `app/(auth)/sign-up.tsx` — `posthog.identify()` + `user_signed_up` after `signUp.finalize()` succeeds.
- `app/(tabs)/settings.tsx` — `user_signed_out` + `posthog.reset()` before `signOut()`.
- `app/(tabs)/index.tsx` — `subscription_expanded` (with `subscription_id` / `subscription_name`) when a card is toggled open.
- `app/subscriptions/[id].tsx` — `subscription_details_viewed` on mount via `useEffect`.
- `app/onboarding.tsx` — `onboarding_viewed` on mount via `useEffect`.

---

## Event tracking table

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes sign-up and email verification | `app/(auth)/sign-up.tsx` |
| `user_signed_in` | User successfully authenticates (password or MFA) | `app/(auth)/sign-in.tsx` |
| `user_signed_out` | User explicitly signs out from the Settings screen | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User taps a subscription card to expand its details | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User navigates to the subscription detail page | `app/subscriptions/[id].tsx` |
| `onboarding_viewed` | User lands on the onboarding screen | `app/onboarding.tsx` |

---

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/459039/dashboard/1700624)
- [New sign-ups over time](https://us.posthog.com/project/459039/insights/chTqLjah)
- [Active users (sign-ins)](https://us.posthog.com/project/459039/insights/yx44RxKi)
- [Subscription engagement](https://us.posthog.com/project/459039/insights/nEE40UzA)
- [Sign-out / churn events](https://us.posthog.com/project/459039/insights/iE9CwQvu)
- [Onboarding → sign-up funnel](https://us.posthog.com/project/459039/insights/VOva5Ze9)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
