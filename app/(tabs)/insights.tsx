import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { router } from "expo-router";

import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { simpleIconUri } from "@/constants/serviceLogos";
import { ServiceIcon } from "@/components/ServiceIcon";
import ListHeading from "@/components/ListHeading";
import { formatCurrency } from "@/lib/utils";

const SafeAreaView = styled(RNSafeAreaView);

interface HistoryItem {
	id: string;
	name: string;
	icon: any;
	price: number;
	date: string;
	color: string;
}

const HISTORY_ITEMS: HistoryItem[] = [
	{
		id: "history-1",
		name: "Claude",
		icon: icons.claude,
		price: 9.84,
		date: "June 25, 12:00",
		color: "#f5c542", // Yellow
	},
	{
		id: "history-2",
		name: "Canva",
		icon: icons.canva,
		price: 43.89,
		date: "June 30, 16:00",
		color: "#8fd1bd", // Teal/Green
	},
	{
		id: "history-3",
		name: "Grammarly",
		icon: simpleIconUri("grammarly"),
		price: 15.00,
		date: "June 24, 10:00",
		color: "#fff8e7", // Cream/Beige
	},
];

const CHART_DATA = [
	{ day: "Mon", value: 36 },
	{ day: "Tue", value: 31 },
	{ day: "Wed", value: 23 },
	{ day: "Thr", value: 40, highlight: true },
	{ day: "Fri", value: 35 },
	{ day: "Sat", value: 21 },
	{ day: "Sun", value: 24 },
];

const GRID_LINES = [45, 35, 25, 5, 0];
const MAX_CHART_VALUE = 45;
const CHART_AREA_HEIGHT = 160;

const Insights = () => {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
			>
				{/* ── Header ── */}
				<View style={styles.header}>
					<Pressable
						style={styles.headerButton}
						onPress={() => router.push("/(tabs)")}
						hitSlop={8}
					>
						<Image
							source={icons.back}
							style={styles.headerIcon}
							resizeMode="contain"
						/>
					</Pressable>
					<Text style={styles.headerTitle}>Monthly Insights</Text>
					<Pressable
						style={styles.headerButton}
						onPress={() => {}}
						hitSlop={8}
					>
						<Text style={styles.moreText}>•••</Text>
					</Pressable>
				</View>

				{/* ── Upcoming Title ── */}
				<ListHeading title="Upcoming" />

				{/* ── Chart Card ── */}
				<View style={styles.chartCard}>
					<View style={styles.chartWrapper}>
						{/* Y-Axis Labels */}
						<View style={styles.yAxis}>
							{GRID_LINES.map((val, idx) => {
								const top = (1 - val / MAX_CHART_VALUE) * CHART_AREA_HEIGHT;
								return (
									<Text
										key={idx}
										style={[styles.yLabel, { top: top - 7 }]}
									>
										{val}
									</Text>
								);
							})}
						</View>

						{/* Chart Area */}
						<View style={styles.chartArea}>
							{/* Grid Lines */}
							<View style={StyleSheet.absoluteFill}>
								{GRID_LINES.map((val, idx) => {
									const top = (1 - val / MAX_CHART_VALUE) * CHART_AREA_HEIGHT;
									return (
										<View
											key={idx}
											style={[
												styles.gridLine,
												{ top },
												val === 0 && { borderStyle: "solid", borderBottomColor: "rgba(0,0,0,0.15)" },
											]}
										/>
									);
								})}
							</View>

							{/* Bars */}
							{CHART_DATA.map((item, idx) => {
								const barHeight = (item.value / MAX_CHART_VALUE) * CHART_AREA_HEIGHT;
								return (
									<View key={idx} style={styles.barColumn}>
										{item.highlight && (
											<View style={[styles.tooltipContainer, { bottom: barHeight + 6 }]}>
												<View style={styles.tooltipBox}>
													<Text style={styles.tooltipText}>${item.value}</Text>
												</View>
												<View style={styles.tooltipArrow} />
											</View>
										)}
										<View
											style={[
												styles.bar,
												{
													height: barHeight,
													backgroundColor: item.highlight ? colors.accent : colors.primary,
												},
											]}
										/>
										<Text style={styles.barLabel}>{item.day}</Text>
									</View>
								);
							})}
						</View>
					</View>
				</View>

				{/* ── Expenses Summary Card ── */}
				<View style={styles.expensesCard}>
					<View>
						<Text style={styles.expensesTitle}>Expenses</Text>
						<Text style={styles.expensesSubtext}>March 2026</Text>
					</View>
					<View style={styles.expensesRight}>
						<Text style={styles.expensesAmount}>-$424.63</Text>
						<Text style={styles.expensesChange}>+12%</Text>
					</View>
				</View>

				{/* ── History Title ── */}
				<ListHeading title="History" />

				{/* ── History List ── */}
				{HISTORY_ITEMS.map((item) => (
					<View
						key={item.id}
						className="sub-card mb-4"
						style={{ backgroundColor: item.color }}
					>
						<View className="sub-head">
							<View className="sub-main">
								<View className="sub-icon">
									<ServiceIcon source={item.icon} size={44} />
								</View>
								<View className="sub-copy">
									<Text numberOfLines={1} className="sub-title">
										{item.name}
									</Text>
									<Text numberOfLines={1} className="sub-meta">
										{item.date}
									</Text>
								</View>
							</View>
							<View className="sub-price-box">
								<Text className="sub-price">{formatCurrency(item.price)}</Text>
								<Text className="sub-billing">per month</Text>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
		marginTop: 8,
	},
	headerButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.1)",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
	},
	headerIcon: {
		width: 16,
		height: 16,
		tintColor: "#081126",
	},
	headerTitle: {
		fontSize: 20,
		fontFamily: "sans-bold",
		color: "#081126",
		textAlign: "center",
	},
	moreText: {
		fontSize: 16,
		fontFamily: "sans-bold",
		color: "#081126",
		lineHeight: 16,
		marginTop: -4,
	},
	chartCard: {
		backgroundColor: "#fff8e7",
		borderRadius: 24,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.1)",
		paddingTop: 24,
		paddingBottom: 16,
		paddingHorizontal: 16,
		marginBottom: 20,
	},
	chartWrapper: {
		flexDirection: "row",
		height: 190,
	},
	yAxis: {
		width: 24,
		height: CHART_AREA_HEIGHT,
		position: "relative",
	},
	yLabel: {
		position: "absolute",
		right: 6,
		fontSize: 12,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.4)",
	},
	chartArea: {
		flex: 1,
		height: CHART_AREA_HEIGHT,
		position: "relative",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	gridLine: {
		position: "absolute",
		left: 0,
		right: 0,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0, 0, 0, 0.05)",
		borderStyle: "dashed",
	},
	barColumn: {
		alignItems: "center",
		justifyContent: "flex-end",
		height: CHART_AREA_HEIGHT,
		flex: 1,
	},
	bar: {
		width: 10,
		borderRadius: 5,
	},
	barLabel: {
		marginTop: 8,
		fontSize: 12,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.5)",
	},
	tooltipContainer: {
		position: "absolute",
		alignItems: "center",
		zIndex: 10,
	},
	tooltipBox: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.05)",
	},
	tooltipText: {
		color: "#ea7a53",
		fontSize: 12,
		fontFamily: "sans-bold",
	},
	tooltipArrow: {
		width: 0,
		height: 0,
		backgroundColor: "transparent",
		borderStyle: "solid",
		borderLeftWidth: 4,
		borderRightWidth: 4,
		borderTopWidth: 4,
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		borderTopColor: "#ffffff",
	},
	expensesCard: {
		backgroundColor: "#fff8e7",
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.1)",
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	expensesTitle: {
		fontSize: 20,
		fontFamily: "sans-bold",
		color: "#081126",
		marginBottom: 4,
	},
	expensesSubtext: {
		fontSize: 14,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.4)",
	},
	expensesRight: {
		alignItems: "flex-end",
	},
	expensesAmount: {
		fontSize: 20,
		fontFamily: "sans-bold",
		color: "#081126",
		marginBottom: 4,
	},
	expensesChange: {
		fontSize: 14,
		fontFamily: "sans-semibold",
		color: "#16a34a", // Green to represent change or growth positively/neutrally
	},
});

export default Insights;
