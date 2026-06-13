import "@/global.css";
import { posthog } from "@/src/config/posthog";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import {
	Stack,
	useGlobalSearchParams,
	usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import AnimatedSplashScreen from "../components/AnimatedSplashScreen";
import { SubscriptionsProvider } from "@/context/subscriptions";

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error(
		"Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — add it to your .env file",
	);
}

 function RootLayoutContent() {
	const {isLoaded: authLoaded} = useAuth();
	const pathname = usePathname();
	const params = useGlobalSearchParams();
	const previousPathname = useRef<string | undefined>(undefined);
	const [showSplash, setShowSplash] = useState(true);

	const [fontsLoaded ] = useFonts({
		"sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
		"sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
		"sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
		"sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
		"sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
		"sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
	});

	useEffect(() => {
		if (fontsLoaded && authLoaded) {
			// expo-splash-screen v0.31+ (Expo SDK 54) changed the native API: the
			// view controller that owns the splash screen may already be gone by the
			// time this runs (e.g. on a fast second render). Wrapping in try/catch
			// is the Expo-recommended approach to silence the unregistered-vc error.
			SplashScreen.hideAsync().catch(() => {});
		}
	}, [fontsLoaded, authLoaded]);

	// Manual screen tracking for Expo Router
	useEffect(() => {
		if (previousPathname.current !== pathname) {
			posthog.screen(pathname, {
				previous_screen: previousPathname.current ?? null,
				...params,
			});
			previousPathname.current = pathname;
		}
	}, [pathname, params]);

	if (!fontsLoaded || !authLoaded) return null;

	return (
		<SubscriptionsProvider>
			<View style={{ flex: 1 }}>
				<Stack screenOptions={{ headerShown: false }} />
				{showSplash && (
					<AnimatedSplashScreen onAnimationComplete={() => setShowSplash(false)} />
				)}
			</View>
		</SubscriptionsProvider>
	);
}

export default function RootLayout() {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<PostHogProvider
				client={posthog}
				autocapture={{
					captureScreens: false,
					captureTouches: true,
					propsToCapture: ["testID"],
					maxElementsCaptured: 20,
				}}
			>
				<RootLayoutContent />
			</PostHogProvider>
		</ClerkProvider>
	)
}
