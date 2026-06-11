import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

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

	if (!fontsLoaded || !authLoaded) return null;

	return <Stack screenOptions={{ headerShown: false }} />

}

export default function RootLayout() {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<RootLayoutContent />
		</ClerkProvider>
	)
}

