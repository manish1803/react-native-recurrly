import { Link } from "expo-router";
import { Text } from "react-native";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
	return (
		<SafeAreaView className="flex-1 bg-background p-5">
			<Text className="font-sans-extrabold text-7xl">Home</Text>

			<Link
				href="/onboarding"
				className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
			>
				Go to Onboarding
			</Link>

			<Link
				href="/(auth)/sign-in"
				className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
			>
				Go to Sign In
			</Link>
			<Link
				href="/(auth)/sign-up"
				className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
			>
				Go to Sign Up
			</Link>
		</SafeAreaView>
	);
}
