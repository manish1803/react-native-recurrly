import { useEffect } from "react";
import { router } from "expo-router";
import { styled } from "nativewind";
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import dayjs from "dayjs";

import { icons } from "@/constants/icons";
import { resolveServiceLogo, fallbackIcon } from "@/constants/serviceLogos";
import { formatCurrency, hexToRGBA } from "@/lib/utils";
import { useSubscriptions } from "@/context/subscriptions";
import { ServiceIcon } from "@/components/ServiceIcon";
import ListHeading from "@/components/ListHeading";

const SafeAreaView = styled(RNSafeAreaView);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CATEGORY_COLORS: Record<string, string> = {
	Entertainment:    "#4f46e5", // Indigo
	"AI Tools":       "#a855f7", // Purple
	"Developer Tools": "#0ea5e9", // Sky Blue
	"Dev Tools":      "#0ea5e9",
	Design:           "#10b981", // Emerald Green
	Productivity:     "#f97316", // Bright Orange
	Cloud:            "#06b6d4", // Cyan
	Music:            "#eab308", // Golden Yellow
	Other:            "#64748b", // Slate Grey
	Misc:             "#64748b",
};

// Helper to condense category names for premium small-screen presentation
const abbreviateCategory = (label: string): string => {
	switch (label) {
		case "Entertainment": return "Entertainment";
		case "AI Tools": return "AI Tools";
		case "Developer Tools": return "Dev Tools";
		case "Dev Tools": return "Dev Tools";
		case "Design": return "Design";
		case "Productivity": return "Productivity";
		case "Cloud": return "Cloud";
		case "Music": return "Music";
		case "Other": return "Other";
		default: return label;
	}
};


const AnimatedDonutSegment = ({
	cx,
	cy,
	r,
	stroke,
	strokeWidth,
	length,
	offset,
	circumference,
	progress,
}: AnimatedDonutSegmentProps) => {
	const animatedProps = useAnimatedProps(() => {
		const drawLength = length * progress.value;
		const drawOffset = offset * progress.value;
		return {
			strokeDasharray: `${drawLength} ${circumference}`,
			strokeDashoffset: drawOffset,
		};
	});

	return (
		<AnimatedCircle
			cx={cx}
			cy={cy}
			r={r}
			stroke={stroke}
			strokeWidth={strokeWidth}
			animatedProps={animatedProps}
			fill="transparent"
		/>
	);
};

const Insights = () => {
	const { insights, defaultCurrency } = useSubscriptions();

	const totalMonthlySpend = insights?.totalMonthlySpend || 0;
	const history = insights?.history || [];

	// Map raw chart data to donut segments
	const rawChartData = insights?.chartData || [];
	// Only process items that have positive spend
	const chartData = rawChartData.filter((item: any) => item.value > 0);

	const radius = 65;
	const strokeWidth = 18;
	const circumference = 2 * Math.PI * radius; // ~408.41

	// If totalMonthlySpend is 0, we treat it as no active spending
	const hasActiveSpend = totalMonthlySpend > 0 && chartData.length > 0;

	// Shared value for donut chart unfolding animation
	const chartProgress = useSharedValue(0);

	useEffect(() => {
		chartProgress.value = 0;
		chartProgress.value = withTiming(1, {
			duration: 1200,
			easing: Easing.out(Easing.cubic),
		});
	}, [totalMonthlySpend, chartProgress]);

	// Calculate segments with colors and offsets
	let accumulatedOffset = 0;
	const segments = chartData.map((item: any) => {
		const percentage = hasActiveSpend ? item.value / totalMonthlySpend : 0;
		const length = percentage * circumference;
		const offset = -accumulatedOffset;
		accumulatedOffset += length;
		const color = CATEGORY_COLORS[item.label] || CATEGORY_COLORS["Other"];

		return {
			...item,
			percentage,
			length,
			offset,
			color,
		};
	});

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
					<View style={styles.headerButton} />
				</View>

				{/* ── Category Breakdown Title ── */}
				<ListHeading title="Category Breakdown" />

				{/* ── Chart Card ── */}
				<View style={styles.chartCard}>
					<View style={styles.chartWrapper}>
						{/* Top: Donut SVG */}
						<View style={styles.donutContainer}>
							<Svg width={170} height={170} viewBox="0 0 170 170">
								<G transform="rotate(-90 85 85)">
									{/* Background Track Circle */}
									<Circle
										cx="85"
										cy="85"
										r={radius}
										stroke="rgba(0, 0, 0, 0.05)"
										strokeWidth={strokeWidth}
										fill="transparent"
									/>
									
									{hasActiveSpend ? (
										segments.map((seg: any, idx: number) => (
											<AnimatedDonutSegment
												key={idx}
												cx="85"
												cy="85"
												r={radius}
												stroke={seg.color}
												strokeWidth={strokeWidth}
												length={seg.length}
												offset={seg.offset}
												circumference={circumference}
												progress={chartProgress}
											/>
										))
									) : (
										/* Placeholder Circle when database has no active subscriptions */
										<Circle
											cx="85"
											cy="85"
											r={radius}
											stroke="#94a3b8"
											strokeWidth={strokeWidth}
											fill="transparent"
										/>
									)}
								</G>
							</Svg>
							
							{/* Center text inside donut */}
							<View style={styles.donutCenter}>
								<Text style={styles.donutCenterLabel}>Monthly</Text>
								<Text numberOfLines={1} adjustsFontSizeToFit style={styles.donutCenterValue}>
									{formatCurrency(totalMonthlySpend, defaultCurrency)}
								</Text>
							</View>
						</View>

						{/* Bottom: Category Legend */}
						<View style={styles.legendContainer}>
							{hasActiveSpend ? (
								<View style={styles.legendList}>
									{segments.map((seg: any, idx: number) => (
										<View key={idx} style={styles.legendRow}>
											<View style={styles.legendLeft}>
												<View style={[styles.legendDot, { backgroundColor: seg.color }]} />
												<Text numberOfLines={1} style={styles.legendName}>
													{abbreviateCategory(seg.label)}
												</Text>
											</View>
											<Text style={styles.legendValue}>
												{formatCurrency(seg.value, defaultCurrency)} ({Math.round(seg.percentage * 100)}%)
											</Text>
										</View>
									))}
								</View>
							) : (
								<View style={styles.noDataLegend}>
									<Text style={styles.noDataText}>No subscriptions</Text>
									<Text style={styles.noDataSubtext}>Add active subscriptions to view breakdown.</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				{/* ── Expenses Summary Card ── */}
				<View style={styles.expensesCard}>
					<View>
						<Text style={styles.expensesTitle}>Expenses</Text>
						<Text style={styles.expensesSubtext}>{dayjs().format("MMMM YYYY")}</Text>
					</View>
					<View style={styles.expensesRight}>
						<Text style={styles.expensesAmount}>-{formatCurrency(totalMonthlySpend, defaultCurrency)}</Text>
						<Text style={styles.expensesChange}>Live</Text>
					</View>
				</View>

				{/* ── History Title ── */}
				<ListHeading title="History" />

				{/* ── History List ── */}
				{history.length === 0 ? (
					<View className="items-center py-6 bg-card rounded-2xl border border-border">
						<Text className="home-empty-state text-center font-sans-medium">No subscription history available yet.</Text>
					</View>
				) : (
					history.map((item: any) => {
						const resolvedIcon = resolveServiceLogo(item.name) || fallbackIcon;
						return (
							<View
								key={item.id}
								className="sub-card mb-4"
								style={{ backgroundColor: item.color ? hexToRGBA(item.color, 0.12) : "#f6eecf" }}
							>
								<View className="sub-head">
									<View className="sub-main">
										<View className="sub-icon">
											<ServiceIcon source={resolvedIcon} size={44} />
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
										<Text className="sub-price">{formatCurrency(item.price, item.currency)}</Text>
										<Text className="sub-billing">per {item.billing === "Yearly" ? "year" : "month"}</Text>
									</View>
								</View>
							</View>
						);
					})
				)}
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
		paddingBottom: 24,
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	chartWrapper: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	donutContainer: {
		position: "relative",
		width: 170,
		height: 170,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
	},
	donutCenter: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		width: 110,
		height: 110,
	},
	donutCenterLabel: {
		fontSize: 10,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.4)",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	donutCenterValue: {
		fontSize: 18,
		fontFamily: "sans-extrabold",
		color: "#081126",
		textAlign: "center",
		marginTop: 2,
		maxWidth: 105,
	},
	legendContainer: {
		width: "100%",
		justifyContent: "center",
	},
	legendList: {
		width: "100%",
	},
	legendScroll: {
		flex: 1,
	},
	legendRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0, 0, 0, 0.05)",
	},
	legendLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	legendDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginRight: 10,
	},
	legendInfo: {
		flex: 1,
	},
	legendName: {
		fontSize: 14,
		fontFamily: "sans-bold",
		color: "#081126",
	},
	legendValue: {
		fontSize: 13,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.6)",
	},
	noDataLegend: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 10,
	},
	noDataText: {
		fontSize: 14,
		fontFamily: "sans-bold",
		color: "#081126",
		textAlign: "center",
	},
	noDataSubtext: {
		fontSize: 12,
		fontFamily: "sans-semibold",
		color: "rgba(0, 0, 0, 0.4)",
		marginTop: 4,
		textAlign: "center",
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
