import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/constants/theme";

/**
 * Root entry point — redirects to the appropriate screen
 * based on the user's authentication state.
 * Shows a loading indicator while Clerk initializes.
 */
export default function RootIndex() {
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

	return <Redirect href="/(auth)/sign-in" />;
}
