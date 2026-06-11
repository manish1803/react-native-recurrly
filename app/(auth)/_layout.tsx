import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/constants/theme";

/**
 * Auth route group layout.
 * Shows a loading screen while Clerk initializes.
 * Redirects already signed-in users to the main app.
 */
export default function AuthLayout() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator size="large" color={colors.accent} />
			</View>
		);
	}

	if (isSignedIn) {
		return <Redirect href="/(tabs)" />;
	}

	return <Stack screenOptions={{ headerShown: false }} />;
}
