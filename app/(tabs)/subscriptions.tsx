import clsx from "clsx";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
	FlatList,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import SubscriptionCard from "@/components/SubscriptionCard";
import SearchBar from "@/components/subscriptions/SearchBar";
import { useSubscriptions } from "@/context/subscriptions";

const SafeAreaView = styled(RNSafeAreaView);


const ALL = "All";

const Subscriptions = () => {
	const { subscriptions } = useSubscriptions();
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
				renderItem={({ item }) => (
					<SubscriptionCard
						{...item}
						expanded={expandedId === item.id}
						onPress={() =>
							setExpandedId((id) => (id === item.id ? null : item.id))
						}
					/>
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
