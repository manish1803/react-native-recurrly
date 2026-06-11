import clsx from "clsx";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "@/constants/theme";

interface AuthButtonProps {
	label: string;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	variant?: "primary" | "secondary";
}

/**
 * AuthButton — primary and secondary CTA button for auth screens.
 * Handles loading state (spinner) and disabled opacity.
 */
const AuthButton = ({
	label,
	onPress,
	disabled = false,
	loading = false,
	variant = "primary",
}: AuthButtonProps) => {
	const isPrimary = variant === "primary";

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled || loading}
			className={clsx(
				isPrimary ? "auth-button" : "auth-secondary-button",
				(disabled || loading) && isPrimary && "auth-button-disabled",
			)}
		>
			{loading ? (
				<ActivityIndicator
					size="small"
					color={isPrimary ? colors.primary : colors.accent}
				/>
			) : (
				<Text
					className={
						isPrimary ? "auth-button-text" : "auth-secondary-button-text"
					}
				>
					{label}
				</Text>
			)}
		</Pressable>
	);
};

export default AuthButton;
