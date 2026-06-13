import { View } from "react-native";

/**
 * AuthCard — rounded card container that wraps form elements on auth screens.
 */
const AuthCard = ({ children }: AuthCardProps) => {
	return <View className="auth-card">{children}</View>;
};

export default AuthCard;
