import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/src/config/posthog";

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
			SplashScreen.hideAsync();
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

	return <Stack screenOptions={{ headerShown: false }} />

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
