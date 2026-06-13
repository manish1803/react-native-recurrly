import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence,
	withDelay,
	Easing,
	runOnJS,
} from "react-native-reanimated";
import { colors } from "@/constants/theme";

export default function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
	const opacity = useSharedValue(1);
	const logoScale = useSharedValue(0.4);
	const logoOpacity = useSharedValue(0);

	useEffect(() => {
		// Play animation sequence:
		// 1. Logo fades in & scales up with a custom spring-like bounce
		// 2. Holds on screen for 1 second
		// 3. Logo zooms out dramatically and fades, while the background container fades to transparent
		logoScale.value = withSequence(
			withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.5)) }),
			withDelay(
				1000,
				withTiming(2.2, { duration: 500, easing: Easing.inOut(Easing.ease) })
			)
		);

		logoOpacity.value = withSequence(
			withTiming(1, { duration: 500 }),
			withDelay(
				1000,
				withTiming(0, { duration: 400 })
			)
		);

		opacity.value = withDelay(
			1300,
			withTiming(0, { duration: 450 }, (isFinished) => {
				if (isFinished) {
					runOnJS(onAnimationComplete)();
				}
			})
		);
	}, [logoOpacity, logoScale, onAnimationComplete, opacity]);

	const containerStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const logoStyle = useAnimatedStyle(() => ({
		transform: [{ scale: logoScale.value }],
		opacity: logoOpacity.value,
	}));

	return (
		<Animated.View style={[styles.container, containerStyle]}>
			<Animated.Image
				source={require("../assets/icons/logo.png")}
				style={[styles.logo, logoStyle]}
				resizeMode="contain"
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.background,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 9999,
	},
	logo: {
		width: 110,
		height: 110,
		borderRadius: 24,
	},
});
