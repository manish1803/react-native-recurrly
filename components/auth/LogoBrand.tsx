import { Image, Text, View } from "react-native";

/**
 * LogoBrand — brand identity block for auth screens.
 * Renders the brand logo, "Recurrly" wordmark, and "Smart Billing" tagline.
 */
const LogoBrand = () => {
	return (
		<View className="auth-brand-block">
			<View className="auth-logo-wrap">
				<Image
					source={require("../../assets/icons/logo.png")}
					style={{ width: 44, height: 44, borderRadius: 10 }}
					resizeMode="contain"
				/>
				<View>
					<Text className="auth-wordmark">Recurrly</Text>
					<Text className="auth-wordmark-sub">Smart Billing</Text>
				</View>
			</View>
		</View>
	);
};

export default LogoBrand;
