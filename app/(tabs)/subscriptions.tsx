import { clsx } from "clsx";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useMemo, useState } from "react";
import {
	Alert,
	FlatList,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import { useSubscriptions } from "@/context/subscriptions";
import SubscriptionCard from "@/components/SubscriptionCard";
import SearchBar from "@/components/subscriptions/SearchBar";

const SafeAreaView = styled(RNSafeAreaView);

const ALL = "All";

const Subscriptions = () => {
	const { subscriptions, updateSubscription, deleteSubscription } = useSubscriptions();
	const posthog = usePostHog();

	const handleToggleStatus = async (subId: string, currentStatus?: string) => {
		const newStatus = currentStatus === "paused" ? "active" : "paused";
		try {
			await updateSubscription(subId, { status: newStatus });
			posthog?.capture("subscription_status_toggled", {
				subscription_id: subId,
				new_status: newStatus,
			});
		} catch (err) {
			console.error("Failed to toggle status:", err);
		}
	};

	const handleDelete = (subId: string, name: string) => {
		Alert.alert(
			"Cancel Subscription",
			`Are you sure you want to cancel and delete ${name}?`,
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes, Cancel",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteSubscription(subId);
							posthog?.capture("subscription_deleted", {
								subscription_id: subId,
								subscription_name: name,
							});
						} catch (err) {
							console.error("Failed to delete subscription:", err);
						}
					},
				},
			]
		);
	};
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState(ALL);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	// Derive categories from the live list — updates automatically when new
	// subscriptions with new categories are added
	const categories = useMemo(
		() => [
			ALL,
			...Array.from(
				new Set(
					subscriptions
						.map((s) => s.category?.trim() ?? s.plan?.trim() ?? "")
						.filter(Boolean),
				),
			),
		],
		[subscriptions],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return subscriptions.filter((sub) => {
			const matchesQuery =
				!q ||
				sub.name.toLowerCase().includes(q) ||
				(sub.category ?? "").toLowerCase().includes(q) ||
				(sub.plan ?? "").toLowerCase().includes(q);
			const matchesCategory =
				activeCategory === ALL ||
				sub.category === activeCategory ||
				sub.plan === activeCategory;
			return matchesQuery && matchesCategory;
		});
	}, [query, activeCategory, subscriptions]);

	return (
		<SafeAreaView className="flex-1 bg-background p-5">
			<FlatList
				data={filtered}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				extraData={expandedId}
				// contentContainerClassName unsupported in NativeWind v5 preview
				contentContainerStyle={{ paddingBottom: 120 }}
				ListHeaderComponent={
					<>
						{/* ── Title row ── */}
						<View className="mb-5 mt-2 flex-row items-center justify-between">
							<Text className="list-title">My Subscriptions</Text>
							<Text className="text-sm font-sans-medium text-muted-foreground">
								{filtered.length} total
							</Text>
						</View>

						{/* ── Search bar ── */}
						<SearchBar
							value={query}
							onChangeText={setQuery}
							placeholder="Search subscriptions…"
						/>

						{/* ── Category filter chips ── */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="mb-5"
							contentContainerStyle={{ gap: 8 }}
						>
							{categories.map((cat) => (
								<Pressable
									key={cat}
									className={clsx(
										"category-chip",
										cat === activeCategory && "category-chip-active",
									)}
									onPress={() => {
										setActiveCategory(cat);
										// Collapse any expanded card when filter changes
										setExpandedId(null);
									}}
								>
									<Text
										className={clsx(
											"category-chip-text",
											cat === activeCategory && "category-chip-text-active",
										)}
									>
										{cat}
									</Text>
								</Pressable>
							))}
						</ScrollView>
					</>
				}
				renderItem={({ item, index }) => (
					<Animated.View 
						entering={FadeInDown.delay(index * 60).duration(400).springify()}
						layout={LinearTransition.springify()}
					>
						<SubscriptionCard
							{...item}
							expanded={expandedId === item.id}
							onPress={() =>
								setExpandedId((id) => (id === item.id ? null : item.id))
							}
							onStatusTogglePress={() => handleToggleStatus(item.id, item.status)}
							onDeletePress={() => handleDelete(item.id, item.name)}
							showDetailsButton={true}
						/>
					</Animated.View>
				)}
				ItemSeparatorComponent={() => <View className="h-4" />}
				ListEmptyComponent={
					<View className="mt-10 items-center">
						<Text className="home-empty-state text-center">
							{query.trim()
								? `No subscriptions matching "${query.trim()}"`
								: "No subscriptions yet."}
						</Text>
					</View>
				}
			/>
		</SafeAreaView>
	);
};

export default Subscriptions;
