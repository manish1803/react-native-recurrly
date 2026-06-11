import { useState } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
} from "react-native";
import { colors } from "@/constants/theme";

interface AuthFieldProps extends TextInputProps {
	label: string;
	error?: string;
	isPassword?: boolean;
}

/**
 * AuthField — reusable labeled input field.
 * Uses StyleSheet.create for the TextInput to ensure reliable layout on both
 * iOS and Android — NativeWind className on TextInput is unreliable in v5 preview.
 */
const AuthField = ({
	label,
	error,
	isPassword = false,
	...inputProps
}: AuthFieldProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const secureEntry = isPassword ? !isVisible : false;

	return (
		<View className="auth-field">
			<Text className="auth-label">{label}</Text>

			<View style={styles.wrapper}>
				<TextInput
					style={[styles.input, error ? styles.inputError : null]}
					placeholderTextColor="rgba(0,0,0,0.35)"
					secureTextEntry={secureEntry}
					autoCorrect={false}
					autoCapitalize="none"
					// Center text on Android (iOS centers automatically)
					textAlignVertical="center"
					{...inputProps}
				/>
				{isPassword && (
					<Pressable
						onPress={() => setIsVisible((v) => !v)}
						style={styles.eyeButton}
						hitSlop={8}
					>
						<Text style={styles.eyeText}>
							{isVisible ? "Hide" : "Show"}
						</Text>
					</Pressable>
				)}
			</View>

			{!!error && <Text className="auth-error">{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: "relative",
	},
	input: {
		height: 52,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
		fontSize: 16,
		fontFamily: "sans-medium",
		color: colors.primary,
	},
	inputError: {
		borderColor: colors.destructive,
	},
	eyeButton: {
		position: "absolute",
		right: 16,
		top: 0,
		bottom: 0,
		justifyContent: "center",
	},
	eyeText: {
		fontSize: 14,
		fontFamily: "sans-semibold",
		color: colors.mutedForeground,
	},
});

export default AuthField;
