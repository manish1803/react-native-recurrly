import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useState, useEffect } from "react";
import { usePostHog } from "posthog-react-native";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, LinearTransition } from "react-native-reanimated";
import Svg, { Path, Circle } from "react-native-svg";

import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import { useSubscriptions } from "@/context/subscriptions";

import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
	const posthog = usePostHog();
	const { user } = useUser();
	const { subscriptions, upcoming, insights, addSubscription, defaultCurrency } = useSubscriptions();

	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
		string | null
	>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Shared value for the metallic shine/shimmer animation (0 to 1)
	const shimmerProgress = useSharedValue(0);

	useEffect(() => {
		shimmerProgress.value = withRepeat(
			withTiming(1, { duration: 3500, easing: Easing.linear }),
			-1,
			false
		);
	}, [shimmerProgress]);

	const shimmerStyle = useAnimatedStyle(() => {
		// During the first 60% of the 3.5s duration (2100ms), animate left from -150 to 450.
		// For the remaining 40% (1400ms), keep it at -150 to pause.
		let left = -150;
		if (shimmerProgress.value < 0.6) {
			const t = shimmerProgress.value / 0.6;
			const eased = t * (2 - t); // quadratic ease out
			left = -150 + eased * 600;
		}
		return {
			left,
		};
	});

	const handleAddSubscription = async (sub: Subscription) => {
		try {
			await addSubscription({
				name: sub.name,
				price: sub.price,
				billing: sub.billing,
				category: sub.category || "Other",
				paymentMethod: sub.paymentMethod,
				startDate: sub.startDate,
				color: sub.color,
				serviceKey: sub.serviceKey,
				currency: sub.currency,
			});
			posthog?.capture("subscription_created", {
				subscription_name: sub.name,
				subscription_price: sub.price,
				subscription_frequency: sub.billing,
				subscription_category: sub.category || "Other",
			});
		} catch (err) {
			console.error("Failed to save subscription:", err);
		}
	};

	const userName = user?.firstName || "Merlin";
	const userAvatar = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;
	const monthlySpend = insights?.totalMonthlySpend || 0;

	return (
		<SafeAreaView className="flex-1 bg-background p-5">
			<FlatList
				ListHeaderComponent={
					<>
						<View className="home-header">
							<View className="home-user">
								<Image source={userAvatar} className="home-avatar" />
								<Text className="home-user-name">{userName}</Text>
							</View>

							{/* Tapping "+" opens the Create Subscription modal */}
							<Pressable
								onPress={() => setIsModalOpen(true)}
								hitSlop={8}
							>
								<Image source={icons.add} className="home-add-icon" />
							</Pressable>
						</View>

						<Animated.View
							entering={FadeInDown.duration(600).springify()}
							className="home-balance-card relative overflow-hidden rounded-3xl p-5 my-2.5"
						>
							{/* Soft visual background circle highlights for credit card texture */}
							<View style={{ position: "absolute", right: -30, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.12)" }} />
							<View style={{ position: "absolute", left: -40, bottom: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(0,0,0,0.06)" }} />

							{/* Metallic shine reflection animation overlay */}
							<Animated.View
								style={[
									{
										position: "absolute",
										top: -100,
										bottom: -100,
										width: 80,
										backgroundColor: "rgba(255, 255, 255, 0.15)",
										transform: [{ rotate: "25deg" }],
									},
									shimmerStyle,
								]}
							/>

							{/* Card Top Row: Brand & Currency Badge */}
							<View className="flex-row items-center justify-between mb-4">
								<Text className="text-lg font-sans-bold text-white tracking-wider opacity-90">
									recurrly
								</Text>
								
								{/* Currency indicator tag */}
								<View className="bg-white/20 px-2.5 py-1 rounded-full border border-white/10">
									<Text className="text-[10px] font-sans-bold text-white uppercase tracking-widest">
										{defaultCurrency}
									</Text>
								</View>
							</View>

							{/* Card Middle Row: Gold Chip & Contactless wave */}
							<View className="flex-row items-center justify-between mb-6">
								{/* Detailed Gold Chip Graphic */}
								<View className="w-10 h-7 rounded bg-[#e5c158] border border-[#d4af37]/60 p-1 justify-between">
									<View className="flex-row justify-between h-[30%]">
										<View className="w-[30%] h-full border-r border-b border-black/10" />
										<View className="w-[30%] h-full border-l border-b border-black/10" />
									</View>
									<View className="h-[20%] border-t border-b border-black/10" />
									<View className="flex-row justify-between h-[30%]">
										<View className="w-[30%] h-full border-r border-t border-black/10" />
										<View className="w-[30%] h-full border-l border-t border-black/10" />
									</View>
								</View>

								{/* Contactless Wave SVG */}
								<Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
									<Path d="M6 18c2.2-2.2 2.2-5.8 0-8" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} strokeLinecap="round" />
									<Path d="M9 21c3.9-3.9 3.9-10.1 0-14" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} strokeLinecap="round" />
									<Path d="M12 24c5.5-5.5 5.5-14.5 0-20" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} strokeLinecap="round" />
									<Circle cx={3} cy={14} r={1.5} fill="rgba(255,255,255,0.7)" />
								</Svg>
							</View>

							{/* Card Bottom Row: Split Grid */}
							<View className="flex-row items-end justify-between mt-auto">
								<View className="flex-1">
									<Text className="text-[10px] font-sans-medium text-white/70 uppercase tracking-widest mb-1">
										Monthly Spend
									</Text>
									<Text className="text-3xl font-sans-extrabold text-white">
										{formatCurrency(monthlySpend, defaultCurrency)}
									</Text>
								</View>

								<View className="items-end">
									<Text className="text-[10px] font-sans-medium text-white/70 uppercase tracking-widest mb-1 text-right">
										Active Subscriptions
									</Text>
									<Text className="text-base font-sans-bold text-white text-right">
										{subscriptions.length} {subscriptions.length === 1 ? "Active" : "Active"}
									</Text>
								</View>
							</View>
						</Animated.View>

						<View className="mb-5">
							<ListHeading title="Upcoming" />

							<FlatList
								data={upcoming}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<UpcomingSubscriptionCard {...item} />
								)}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={
									<Text className="home-empty-state">
										No upcoming renewals yet.
									</Text>
								}
							/>
						</View>

						<ListHeading title="All Subscriptions" />
					</>
				}
				data={subscriptions}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<Animated.View 
						entering={FadeInDown.delay(index * 60).duration(400).springify()}
						layout={LinearTransition.springify()}
					>
						<SubscriptionCard
							{...item}
							expanded={expandedSubscriptionId === item.id}
							onPress={() => {
								const isExpanding = expandedSubscriptionId !== item.id;
								setExpandedSubscriptionId((currentId) =>
									currentId === item.id ? null : item.id,
								);
								if (isExpanding) {
									posthog?.capture("subscription_expanded", {
										subscription_id: item.id,
										subscription_name: item.name,
									});
								}
							}}
						/>
					</Animated.View>
				)}
				extraData={expandedSubscriptionId}
				ItemSeparatorComponent={() => <View className="h-4" />}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<Text className="home-empty-state"> No subscriptions yet.</Text>
				}
				contentContainerStyle={{ paddingBottom: 120 }}
			/>

			<CreateSubscriptionModal
				visible={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleAddSubscription}
			/>
		</SafeAreaView>
	);
}
