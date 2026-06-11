import { Text, View } from "react-native";

/**
 * LogoBrand — brand identity block for auth screens.
 * Renders the "R" logomark, "Recurly" wordmark, and "SMART BILLING" tagline.
 */
const LogoBrand = () => {
	return (
		<View className="auth-brand-block">
			<View className="auth-logo-wrap">
				<View className="auth-logo-mark">
					<Text className="auth-logo-mark-text">R</Text>
				</View>
				<View>
					<Text className="auth-wordmark">Recurrly</Text>
					<Text className="auth-wordmark-sub">Smart Billing</Text>
				</View>
			</View>
		</View>
	);
};

export default LogoBrand;
