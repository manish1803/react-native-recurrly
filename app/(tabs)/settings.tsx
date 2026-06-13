import { useClerk, useUser } from "@clerk/expo";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { styled } from "nativewind";
import { Image, Pressable, ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import dayjs from "dayjs";

import { useSubscriptions } from "@/context/subscriptions";
import Divider from "@/components/settings/Divider";
import InfoRow from "@/components/settings/InfoRow";
import SectionLabel from "@/components/settings/SectionLabel";
import CurrencyPickerModal from "@/components/settings/CurrencyPickerModal";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const posthog = usePostHog();
	const { defaultCurrency, setDefaultCurrency, clearAllSubscriptions } = useSubscriptions();

	const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

	const handleClearAllData = () => {
		Alert.alert(
			"Clear All Data",
			"Are you sure you want to permanently delete all your subscriptions? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete All",
					style: "destructive",
					onPress: async () => {
						try {
							await clearAllSubscriptions();
							Alert.alert("Success", "All subscriptions have been deleted.");
						} catch {
							Alert.alert("Error", "Failed to delete subscriptions. Please try again.");
						}
					},
				},
			]
		);
	};

	const handleReportBug = () => {
		Alert.alert(
			"Report a Bug",
			"Thank you for helping us improve Recurrly! You can report issues directly to our support team.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Email Support",
					onPress: () => {
						posthog?.capture("report_bug_clicked");
						Alert.alert("Report Logged", "Thanks — we've recorded your report. If you need help, please email support@recurrly.com.");
					},
				},
			]
		);
	};

	const handleRateApp = () => {
		Alert.alert(
			"Rate Recurrly",
			"Are you enjoying Recurrly? Let us know what you think by leaving a review on the App Store!",
			[
				{ text: "Not Now", style: "cancel" },
				{
					text: "Rate Now",
					onPress: () => {
						posthog?.capture("rate_app_clicked");
						Alert.alert("Thank you!", "Thank you for rating our app! We appreciate your support.");
					},
				},
			]
		);
	};

	const initials =
		[user?.firstName, user?.lastName]
			.filter(Boolean)
			.map((n) => n![0].toUpperCase())
			.join("") ||
		user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
		"?";

	const displayName =
		user?.fullName?.trim() ||
		user?.firstName?.trim() ||
		user?.emailAddresses[0]?.emailAddress ||
		"Account";

	const email = user?.emailAddresses[0]?.emailAddress ?? "—";
	const memberSince = user?.createdAt
		? dayjs(user.createdAt).format("MMMM D, YYYY")
		: "—";
	const userId = user?.id ? `…${user.id.slice(-8)}` : "—";
	const emailVerified =
		user?.emailAddresses[0]?.verification?.status === "verified";

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView
				style={{ flex: 1 }}
				// contentContainerClassName unsupported in NativeWind v5 preview
				contentContainerStyle={{
					paddingHorizontal: 20,
					paddingBottom: 120,
					paddingTop: 8,
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* ── Header ── */}
				<Text className="mb-5 text-3xl font-sans-extrabold text-primary">
					Settings
				</Text>

				{/* ── Profile card ── */}
				<View className="mb-6 flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4">
					{/* Avatar — profile image or initials fallback */}
					{user?.imageUrl ? (
						<Image
							source={{ uri: user.imageUrl }}
							className="size-16 rounded-full"
						/>
					) : (
						<View className="size-16 items-center justify-center rounded-full bg-accent">
							<Text className="text-2xl font-sans-extrabold text-white">
								{initials}
							</Text>
						</View>
					)}

					{/* Name / email / badge */}
					<View className="flex-1 gap-1">
						<Text className="text-lg font-sans-bold text-primary">
							{displayName}
						</Text>
						<Text
							className="text-sm font-sans-medium text-muted-foreground"
							numberOfLines={1}
						>
							{email}
						</Text>
						<View className="mt-1 flex-row">
							<View
								className={clsx(
									"rounded-full px-3 py-1",
									emailVerified ? "bg-success/10" : "bg-muted",
								)}
							>
								<Text
									className={clsx(
										"text-[11px] font-sans-semibold",
										emailVerified ? "text-success" : "text-muted-foreground",
									)}
								>
									{emailVerified ? "Verified" : "Unverified"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* ── Account details ── */}
				<SectionLabel title="Account" />
				<View className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
					<InfoRow label="Full name" value={displayName} />
					<Divider />
					<InfoRow label="Email" value={email} />
					<Divider />
					<InfoRow label="Member since" value={memberSince} />
					<Divider />
					<InfoRow label="User ID" value={userId} />
				</View>

				{/* ── Preferences ── */}
				<SectionLabel title="Preferences" />
				<View className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
					<Pressable
						onPress={() => setShowCurrencyPicker(true)}
						style={({ pressed }) => pressed && { backgroundColor: "rgba(0,0,0,0.05)" }}
					>
						<InfoRow label="Currency" value={defaultCurrency} showArrow />
					</Pressable>
					<Divider />
					<InfoRow label="Notifications" value="Enabled" />
					<Divider />
					<InfoRow label="App version" value="1.0.0" />
				</View>

				{/* ── Support & Feedback ── */}
				<SectionLabel title="Support & Feedback" />
				<View className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
					<Pressable
						onPress={handleReportBug}
						style={({ pressed }) => pressed && { backgroundColor: "rgba(0,0,0,0.05)" }}
					>
						<InfoRow label="Report a bug" value="" showArrow />
					</Pressable>
					<Divider />
					<Pressable
						onPress={handleRateApp}
						style={({ pressed }) => pressed && { backgroundColor: "rgba(0,0,0,0.05)" }}
					>
						<InfoRow label="Rate this app" value="" showArrow />
					</Pressable>
				</View>

				{/* ── Sign out ── */}
				<SectionLabel title="Account actions" />
				<Pressable
					className="items-center rounded-2xl border border-destructive bg-card py-4 mb-4"
					style={({ pressed }) => pressed && { opacity: 0.7 }}
					onPress={handleClearAllData}
				>
					<Text className="text-base font-sans-bold text-destructive">
						Clear all subscriptions
					</Text>
				</Pressable>

				<Pressable
					className="items-center rounded-2xl bg-accent py-4"
					style={({ pressed }) => pressed && { opacity: 0.7 }}
					onPress={() => {
						posthog.capture("user_signed_out");
						posthog.reset();
						signOut();
					}}
				>
					<Text className="text-base font-sans-bold text-primary">
						Sign out
					</Text>
				</Pressable>
			</ScrollView>

			<CurrencyPickerModal
				visible={showCurrencyPicker}
				onClose={() => setShowCurrencyPicker(false)}
				selected={defaultCurrency}
				onSelect={setDefaultCurrency}
			/>
		</SafeAreaView>
	);
};

export default Settings;
