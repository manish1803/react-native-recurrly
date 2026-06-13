import {
	formatCurrency,
	formatStatusLabel,
	formatSubscriptionDateTime,
	hexToRGBA,
} from "@/lib/utils";
import { clsx } from "clsx";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ServiceIcon } from "@/components/ServiceIcon";
import { useSubscriptions } from "@/context/subscriptions";
import { router } from "expo-router";

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

const SubscriptionCard = ({
	id,
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
	onStatusTogglePress,
	onDeletePress,
	showDetailsButton,
}: SubscriptionCardProps) => {
	const { defaultCurrency } = useSubscriptions();
	return (
		<Pressable
			onPress={onPress}
			className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
			style={color ? { backgroundColor: hexToRGBA(color, expanded ? 0.24 : 0.12) } : undefined}
		>
			<View className="sub-head">
				<View className="sub-main">
					{/*
					 * If the subscription has no brand icon, render a coloured initial-avatar
					 * View (first letter of the service name on a deterministic bg color).
					 * Otherwise render the brand icon via expo-image.
					 */}
					<View className="sub-icon">
						<ServiceIcon
							source={icon}
							name={name}
							iconInitial={iconInitial}
							size={styles.iconImage.width}
						/>
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
					<Text className="sub-price">{formatCurrency(price, defaultCurrency)}</Text>
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

					{(showDetailsButton || onStatusTogglePress || onDeletePress) && (
						<View
							className="flex-row gap-3 mt-4 border-t pt-4"
							style={{ borderTopColor: "rgba(0, 0, 0, 0.08)" }}
						>
							{showDetailsButton && (
								<Pressable
									className="flex-1 items-center justify-center rounded-xl border border-primary/20 bg-black/5 py-3"
									style={({ pressed }) => pressed && { opacity: 0.8 }}
									onPress={(e) => {
										e.stopPropagation();
										router.push(`/subscriptions/${id}`);
									}}
								>
									<Text className="text-sm font-sans-bold text-primary">Details</Text>
								</Pressable>
							)}
							{onStatusTogglePress && (
								<Pressable
									className="flex-1 items-center justify-center rounded-xl border border-primary/20 bg-black/5 py-3"
									style={({ pressed }) => pressed && { opacity: 0.8 }}
									onPress={(e) => {
										e.stopPropagation();
										onStatusTogglePress();
									}}
								>
									<Text className="text-sm font-sans-bold text-primary">
										{status === "paused" ? "Resume" : "Pause"}
									</Text>
								</Pressable>
							)}
							{onDeletePress && (
								<Pressable
									className="flex-1 items-center justify-center rounded-xl bg-destructive py-3"
									style={({ pressed }) => pressed && { opacity: 0.8 }}
									onPress={(e) => {
										e.stopPropagation();
										onDeletePress();
									}}
								>
									<Text className="text-sm font-sans-bold text-white">Cancel</Text>
								</Pressable>
							)}
						</View>
					)}
				</View>
			)}
		</Pressable>
	);
};

export default SubscriptionCard;
