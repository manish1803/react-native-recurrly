import { styled } from "nativewind";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

// Must use styled() for third-party components (react-native-safe-area-context)
// to allow NativeWind className — same pattern as (tabs)/index.tsx
const SafeAreaView = styled(RNSafeAreaView);

interface AuthScreenProps {
	children: ReactNode;
}

/**
 * AuthScreen — full-screen wrapper for auth screens.
 * Provides SafeAreaView + KeyboardAvoidingView + ScrollView with consistent padding.
 */
const AuthScreen = ({ children }: AuthScreenProps) => {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
			>
				<ScrollView
					style={{ flex: 1 }}
					// contentContainerClassName is not supported in NativeWind v5 preview;
					// use contentContainerStyle with explicit values from auth-content class
					contentContainerStyle={{
						flexGrow: 1,
						paddingHorizontal: 20,
						paddingBottom: 40,
						paddingTop: 32,
					}}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					{children}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default AuthScreen;
