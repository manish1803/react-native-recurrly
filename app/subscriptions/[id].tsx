import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/context/subscriptions";
import { formatCurrency, formatSubscriptionDateTime, formatStatusLabel } from "@/lib/utils";
import { ServiceIcon } from "@/components/ServiceIcon";

const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionDetails = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const posthog = usePostHog();
	const { subscriptions, updateSubscription, deleteSubscription, defaultCurrency } = useSubscriptions();

	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const sub = subscriptions.find((s) => s.id === id);

	useEffect(() => {
		if (id) {
			posthog.capture("subscription_details_viewed", {
				subscription_id: id,
			});
		}
	}, [id, posthog]);

	if (!sub) {
		return (
			<SafeAreaView className="flex-1 bg-background justify-center items-center p-5">
				<ActivityIndicator size="large" color="#ea7a53" />
				<Text className="mt-4 text-primary font-sans-medium">Loading subscription details...</Text>
			</SafeAreaView>
		);
	}

	const handleToggleStatus = async () => {
		const newStatus = sub.status === "paused" ? "active" : "paused";
		setIsUpdating(true);
		try {
			await updateSubscription(sub.id, { status: newStatus });
			posthog.capture("subscription_status_toggled", {
				subscription_id: sub.id,
				new_status: newStatus,
			});
			Alert.alert("Success", `Subscription is now ${newStatus}`);
		} catch {
			Alert.alert("Error", "Failed to update subscription status");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = () => {
		Alert.alert(
			"Cancel Subscription",
			`Are you sure you want to cancel and delete ${sub.name}?`,
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes, Cancel",
					style: "destructive",
					onPress: async () => {
						setIsDeleting(true);
						try {
							await deleteSubscription(sub.id);
							posthog.capture("subscription_deleted", {
								subscription_id: sub.id,
								subscription_name: sub.name,
							});
							router.replace("/(tabs)");
						} catch {
							Alert.alert("Error", "Failed to delete subscription");
							setIsDeleting(false);
						}
					},
				},
			]
		);
	};

	const accentBg = sub.color && sub.color.startsWith("#") ? `${sub.color}15` : "rgba(0, 0, 0, 0.04)";
	const accentBorder = sub.color && sub.color.startsWith("#") ? `${sub.color}25` : "rgba(0, 0, 0, 0.08)";

	return (
		<SafeAreaView className="flex-1 bg-background p-5">
			<View className="mb-6 mt-2 flex-row items-center justify-between">
				<Pressable
					className="size-11 rounded-full border border-border items-center justify-center bg-card"
					onPress={() => router.back()}
					hitSlop={8}
					style={({ pressed }) => pressed && { opacity: 0.7 }}
				>
					<Image source={icons.back} className="size-4 tint-primary" resizeMode="contain" />
				</Pressable>
				<Text className="text-xl font-sans-bold text-primary">Subscription details</Text>
				<View className="size-11" />
			</View>

			<View
				className="rounded-3xl border border-border p-6 mb-6 bg-card"
				style={styles.cardShadow}
			>
				<View className="items-center mb-6">
					<View
						className="size-20 rounded-2xl items-center justify-center p-3 mb-4 border"
						style={{ backgroundColor: accentBg, borderColor: accentBorder }}
					>
						<ServiceIcon
							source={sub.icon}
							name={sub.name}
							iconInitial={sub.iconInitial}
							size={56}
						/>
					</View>
					<Text className="text-2xl font-sans-bold text-primary text-center mb-2">{sub.name}</Text>
					
					{/* Colored category badge */}
					<View
						style={{ backgroundColor: accentBg, borderColor: accentBorder }}
						className="px-4 py-1 rounded-full border"
					>
						<Text style={{ color: sub.color || "#081126" }} className="text-xs font-sans-bold">
							{sub.category || "Other"}
						</Text>
					</View>
				</View>

				{/* Price Section */}
				<View className="items-center py-6 border-t border-b border-black/5 mb-6">
					<Text className="text-4xl font-sans-extrabold text-primary">{formatCurrency(sub.price, defaultCurrency)}</Text>
					<Text className="text-sm font-sans-medium text-muted-foreground mt-1">Billed {sub.billing}</Text>
				</View>

				{/* Details list */}
				<View className="sub-details">
					<View className="sub-row">
						<View className="sub-row-copy">
							<Text className="sub-label">Payment Method</Text>
							<Text className="sub-value text-right">{sub.paymentMethod || "Not provided"}</Text>
						</View>
					</View>
					<View className="sub-row">
						<View className="sub-row-copy">
							<Text className="sub-label">Started Date</Text>
							<Text className="sub-value text-right">{formatSubscriptionDateTime(sub.startDate)}</Text>
						</View>
					</View>
					<View className="sub-row">
						<View className="sub-row-copy">
							<Text className="sub-label">Next Renewal</Text>
							<Text className="sub-value text-right">{formatSubscriptionDateTime(sub.renewalDate)}</Text>
						</View>
					</View>
					<View className="sub-row">
						<View className="sub-row-copy">
							<Text className="sub-label">Status</Text>
							<Text className="sub-value text-right">{formatStatusLabel(sub.status)}</Text>
						</View>
					</View>
				</View>
			</View>

			<View className="gap-3 mt-auto mb-6">
				<Pressable
					className="items-center rounded-2xl bg-primary py-4"
					onPress={handleToggleStatus}
					disabled={isUpdating}
					style={({ pressed }) => pressed && { opacity: 0.9 }}
				>
					{isUpdating ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<Text className="text-base font-sans-bold text-white">
							{sub.status === "paused" ? "Resume Subscription" : "Pause Subscription"}
						</Text>
					)}
				</Pressable>

				<Pressable
					className="items-center rounded-2xl bg-transparent py-4 border border-destructive/20"
					onPress={handleDelete}
					disabled={isDeleting}
					style={({ pressed }) => pressed && { opacity: 0.7 }}
				>
					{isDeleting ? (
						<ActivityIndicator size="small" color="#dc2626" />
					) : (
						<Text className="text-base font-sans-bold text-destructive">Cancel Subscription</Text>
					)}
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	cardShadow: {
		shadowColor: "#081126",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.04,
		shadowRadius: 16,
		elevation: 3,
	},
});

export default SubscriptionDetails;
