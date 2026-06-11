import { ReactNode } from "react";
import { View } from "react-native";

interface AuthCardProps {
	children: ReactNode;
}

/**
 * AuthCard — rounded card container that wraps form elements on auth screens.
 */
const AuthCard = ({ children }: AuthCardProps) => {
	return <View className="auth-card">{children}</View>;
};

export default AuthCard;
