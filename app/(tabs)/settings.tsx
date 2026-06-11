import { useClerk, useUser } from "@clerk/expo";
import clsx from "clsx";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import Divider from "@/components/settings/Divider";
import InfoRow from "@/components/settings/InfoRow";
import SectionLabel from "@/components/settings/SectionLabel";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
	const { signOut } = useClerk();
	const { user } = useUser();

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
					<InfoRow label="Currency" value="USD" />
					<Divider />
					<InfoRow label="Notifications" value="Enabled" />
					<Divider />
					<InfoRow label="App version" value="1.0.0" />
				</View>

				{/* ── Sign out ── */}
				<SectionLabel title="Account actions" />
				<Pressable
					className="items-center rounded-2xl bg-accent py-4"
					style={({ pressed }) => pressed && { opacity: 0.7 }}
					onPress={() => signOut()}
				>
					<Text className="text-base font-sans-bold text-primary">
						Sign out
					</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Settings;
