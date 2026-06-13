import { formatCurrency } from "@/lib/utils";
import { ServiceIcon } from "@/components/ServiceIcon";
import { StyleSheet, Text, View } from "react-native";
import { useSubscriptions } from "@/context/subscriptions";

// StyleSheet before component — avoids TDZ crash
const styles = StyleSheet.create({
	// upcoming-icon View: size-12 = 48px, p-2 = 8px padding → inner 32px
	iconImage: {
		width: 32,
		height: 32,
	},
});

const UpcomingSubscriptionCard = ({
	name,
	price,
	daysLeft,
	icon,
	currency,
}: UpcomingSubscription) => {
	const { defaultCurrency } = useSubscriptions();
	return (
		<View className="upcoming-card">
			<View className="upcoming-row">
				{/* View carries upcoming-icon class; ServiceIcon handles SVG/raster */}
				<View className="upcoming-icon">
					<ServiceIcon
						source={icon}
						size={styles.iconImage.width}
					/>
				</View>
				<View>
					<Text className="upcoming-price">
						{formatCurrency(price, defaultCurrency)}
					</Text>
					<Text className="upcoming-meta" numberOfLines={1}>
						{daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
					</Text>
				</View>
			</View>

			<Text className="upcoming-name" numberOfLines={1}>
				{name}
			</Text>
		</View>
	);
};

export default UpcomingSubscriptionCard;
