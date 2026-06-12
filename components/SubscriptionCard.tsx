import {
	formatCurrency,
	formatStatusLabel,
	formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ServiceIcon } from "@/components/ServiceIcon";

// ─── Styles defined BEFORE the component (avoids "styles doesn't exist" TDZ crash) ─

const styles = StyleSheet.create({
	/**
	 * sub-icon View: size-16 = 64px, p-2 = 8px padding → inner content area 48px.
	 * Using 44×44 gives a slight visual margin from the border.
	 */
	iconImage: {
		width: 44,
		height: 44,
	},
	/**
	 * Initial avatar — fills the same 44×44 slot as the brand icon.
	 * Rounded corners + white bold letter centred inside.
	 */
	initialAvatar: {
		width: 44,
		height: 44,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	initialLetter: {
		color: "#ffffff",
		fontSize: 20,
		fontWeight: "700",
		lineHeight: 24,
	},
});

// ─── Component ────────────────────────────────────────────────────────────────

const SubscriptionCard = ({
	name,
	price,
	currency,
	icon,
	iconInitial,
	billing,
	paymentMethod,
	color,
	category,
	plan,
	renewalDate,
	expanded,
	onPress,
	startDate,
	status,
}: SubscriptionCardProps) => {
	return (
		<Pressable
			onPress={onPress}
			className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
			style={!expanded && color ? { backgroundColor: color } : undefined}
		>
			<View className="sub-head">
				<View className="sub-main">
					{/*
					 * If the subscription has no brand icon, render a coloured initial-avatar
					 * View (first letter of the service name on a deterministic bg color).
					 * Otherwise render the brand icon via expo-image.
					 */}
					<View className="sub-icon">
						{iconInitial ? (
							<View
								style={[
									styles.initialAvatar,
									{ backgroundColor: iconInitial.bgColor },
								]}
							>
								<Text style={styles.initialLetter}>
									{iconInitial.letter}
								</Text>
							</View>
						) : (
							<ServiceIcon
								source={icon}
								size={styles.iconImage.width}
							/>
						)}
					</View>

					<View className="sub-copy">
						<Text numberOfLines={1} className="sub-title">
							{name}
						</Text>
						<Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
							{category?.trim() ||
								plan?.trim() ||
								(renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
						</Text>
					</View>
				</View>

				<View className="sub-price-box">
					<Text className="sub-price">{formatCurrency(price, currency)}</Text>
					<Text className="sub-billing">{billing}</Text>
				</View>
			</View>

			{expanded && (
				<View className="sub-body">
					<View className="sub-details">
						<View className="sub-row">
							<View className="sub-row-copy">
								<Text className="sub-label">Payment:</Text>
								<Text
									className="sub-value"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{paymentMethod?.trim() ?? "Not provided"}
								</Text>
							</View>
						</View>

						<View className="sub-row">
							<View className="sub-row-copy">
								<Text className="sub-label">Category:</Text>
								<Text
									className="sub-value"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{(category?.trim() || plan?.trim()) ?? "Not provided"}
								</Text>
							</View>
						</View>

						<View className="sub-row">
							<View className="sub-row-copy">
								<Text className="sub-label">Started:</Text>
								<Text
									className="sub-value"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{startDate
										? formatSubscriptionDateTime(startDate)
										: "Not provided"}
								</Text>
							</View>
						</View>

						<View className="sub-row">
							<View className="sub-row-copy">
								<Text className="sub-label">Renewal date:</Text>
								<Text
									className="sub-value"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{renewalDate
										? formatSubscriptionDateTime(renewalDate)
										: "Not provided"}
								</Text>
							</View>
						</View>

						<View className="sub-row">
							<View className="sub-row-copy">
								<Text className="sub-label">Status:</Text>
								<Text
									className="sub-value"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{status ? formatStatusLabel(status) : ""}
								</Text>
							</View>
						</View>
					</View>
				</View>
			)}
		</Pressable>
	);
};

export default SubscriptionCard;
