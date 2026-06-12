import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import {
	HOME_BALANCE,
	HOME_SUBSCRIPTIONS,
	HOME_USER,
	UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
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
	const { subscriptions, addSubscription } = useSubscriptions();

	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
		string | null
	>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddSubscription = (sub: Subscription) => {
		addSubscription(sub);
		posthog?.capture("subscription_created", {
			subscription_name: sub.name,
			subscription_category: sub.category,
			billing: sub.billing,
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-background p-5">
			<FlatList
				ListHeaderComponent={() => (
					<>
						<View className="home-header">
							<View className="home-user">
								<Image source={images.avatar} className="home-avatar" />
								<Text className="home-user-name">{HOME_USER.name}</Text>
							</View>

							{/* Tapping "+" opens the Create Subscription modal */}
							<Pressable
								onPress={() => setIsModalOpen(true)}
								hitSlop={8}
							>
								<Image source={icons.add} className="home-add-icon" />
							</Pressable>
						</View>

						<View className="home-balance-card">
							<Text className="home-balance-label">Balance</Text>

							<View className="home-balance-row">
								<Text className="home-balance-amount">
									{formatCurrency(HOME_BALANCE.amount)}
								</Text>
								<Text className="home-balance-date">
									{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
								</Text>
							</View>
						</View>

						<View className="mb-5">
							<ListHeading title="Upcoming" />

							<FlatList
								data={UPCOMING_SUBSCRIPTIONS}
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
				)}
				data={subscriptions}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
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
