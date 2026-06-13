import React, { useEffect } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { usePostHog } from "posthog-react-native";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Onboarding = () => {
	const posthog = usePostHog();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		posthog.capture("onboarding_viewed");
	}, [posthog]);

	const handleGetStarted = () => {
		posthog.capture("onboarding_get_started_clicked");
		router.replace("/(auth)/sign-in");
	};

	return (
		<View style={styles.container}>
			{/* Top half: Geometric pattern image */}
			<View style={[styles.imageContainer, { paddingTop: insets.top + 20 }]}>
				<Image
					source={require("../assets/images/splash-pattern.png")}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>

			{/* Bottom half: Text & CTA Button */}
			<SafeAreaView edges={["bottom", "left", "right"]} style={styles.contentContainer}>
				<Text style={styles.title}>Gain Financial Clarity</Text>
				<Text style={styles.subtitle}>
					Track, analyze and cancel with ease
				</Text>

				<Pressable
					style={({ pressed }) => [
						styles.button,
						pressed && { opacity: 0.9 },
					]}
					onPress={handleGetStarted}
				>
					<Text style={styles.buttonText}>Get Started</Text>
				</Pressable>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ea7a53", // vibrant orange accent color
	},
	imageContainer: {
		flex: 1.4,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	contentContainer: {
		flex: 0.8,
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "flex-end",
		paddingBottom: 40,
	},
	title: {
		fontSize: 34,
		fontFamily: "sans-extrabold",
		color: "#ffffff",
		textAlign: "center",
		marginBottom: 12,
		lineHeight: 42,
	},
	subtitle: {
		fontSize: 16,
		fontFamily: "sans-semibold",
		color: "rgba(255, 255, 255, 0.85)",
		textAlign: "center",
		marginBottom: 36,
		lineHeight: 22,
	},
	button: {
		backgroundColor: "#ffffff",
		width: "100%",
		borderRadius: 30,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 4,
	},
	buttonText: {
		fontSize: 18,
		fontFamily: "sans-bold",
		color: "#081126",
	},
});

export default Onboarding;
