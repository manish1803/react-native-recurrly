import type { ReactNode } from "react";
import type { ImageSourcePropType, TextInputProps } from "react-native";
import type { SharedValue } from "react-native-reanimated";

declare global {
	// --- Existing Layout & Domain Types ---
	interface AppTab {
		name: string;
		title: string;
		icon: ImageSourcePropType;
	}

	interface TabIconProps {
		focused: boolean;
		icon: ImageSourcePropType;
	}

	interface Subscription {
		id: string;
		icon: ImageSourcePropType;
		/**
		 * When the subscription doesn't have a matching brand icon, this carries
		 * the first letter of the service name and a deterministic background color.
		 * SubscriptionCard renders an initial-avatar View instead of an Image when
		 * this field is present.
		 */
		iconInitial?: { letter: string; bgColor: string };
		name: string;
		plan?: string;
		category?: string;
		paymentMethod?: string;
		status?: string;
		startDate?: string;
		price: number;
		currency?: string;
		billing: string;
		renewalDate?: string;
		color?: string;
		serviceKey?: string;
	}

	interface SubscriptionCardProps extends Subscription {
		expanded: boolean;
		onPress: () => void;
		onCancelPress?: () => void;
		isCancelling?: boolean;
		onStatusTogglePress?: () => void;
		onDeletePress?: () => void;
		showDetailsButton?: boolean;
	}

	interface UpcomingSubscription {
		id: string;
		icon: ImageSourcePropType;
		name: string;
		price: number;
		currency?: string;
		daysLeft: number;
	}

	interface UpcomingSubscriptionCardProps extends Omit<
		UpcomingSubscription,
		"id"
	> {}

	interface ListHeadingProps {
		title: string;
	}

	// --- Centralized Service Types ---
	interface ServiceEntry {
		key: string;
		label: string;
		logoSource: ImageSourcePropType;
		localSource?: ImageSourcePropType;
		keywords: string[];
	}

	interface PopularServiceData {
		key: string;
		label: string;
		keywords: string[];
		logoQuery?: string;
		simpleIconSlug?: string;
		localIconKey?: string;
	}

	type Category =
		| "Entertainment"
		| "AI Tools"
		| "Developer Tools"
		| "Design"
		| "Productivity"
		| "Cloud"
		| "Music"
		| "Other";

	type Frequency = "Monthly" | "Yearly";

	// --- Centralized Component Props ---
	interface AnimatedSplashScreenProps {
		onAnimationComplete: () => void;
	}

	interface GoogleIconProps {
		size?: number;
	}

	interface ServiceIconProps {
		/** ImageSourcePropType from serviceLogos.ts or icons constants */
		source: ImageSourcePropType;
		/** Display size in pixels (used for both width and height) */
		size?: number;
		/**
		 * Tint colour for Simple Icons SVGs (which are monochrome by default).
		 * Defaults to "#111111" — near-black that works on all card backgrounds.
		 */
		color?: string;
		/** Name of the service to construct dynamic initial-letter avatar on failure */
		name?: string;
		/** Optional pre-computed initial avatar object */
		iconInitial?: { letter: string; bgColor: string };
	}

	interface SearchBarProps {
		value: string;
		onChangeText: (text: string) => void;
		placeholder?: string;
	}

	interface AuthCardProps {
		children: ReactNode;
	}

	interface AuthButtonProps {
		label: string;
		onPress: () => void;
		disabled?: boolean;
		loading?: boolean;
		variant?: "primary" | "secondary";
	}

	interface AuthFieldProps extends TextInputProps {
		label: string;
		error?: string;
		isPassword?: boolean;
	}

	interface AuthScreenProps {
		children: ReactNode;
	}

	interface CreateSubscriptionModalProps {
		visible: boolean;
		onClose: () => void;
		onSubmit: (subscription: Subscription) => void;
	}

	interface IconPickerGridProps {
		selected: ServiceEntry;
		onSelect: (entry: ServiceEntry) => void;
	}

	interface SectionLabelProps {
		title: string;
	}

	interface InfoRowProps {
		label: string;
		value: string;
		showArrow?: boolean;
		icon?: ReactNode;
	}

	interface CurrencyPickerModalProps {
		visible: boolean;
		onClose: () => void;
		selected: string;
		onSelect: (currency: string) => void;
	}

	interface AnimatedDonutSegmentProps {
		cx: string | number;
		cy: string | number;
		r: number;
		stroke: string;
		strokeWidth: number;
		length: number;
		offset: number;
		circumference: number;
		progress: SharedValue<number>;
	}

	interface SubscriptionsContextValue {
		subscriptions: Subscription[];
		upcoming: UpcomingSubscription[];
		insights: {
			totalMonthlySpend: number;
			chartData: Array<{ label: string; value: number }>;
			history: any[];
		} | null;
		loading: boolean;
		error: string | null;
		defaultCurrency: string;
		setDefaultCurrency: (currency: string) => Promise<void>;
		fetchSubscriptions: () => Promise<void>;
		fetchUpcoming: () => Promise<void>;
		fetchInsights: () => Promise<void>;
		addSubscription: (sub: {
			name: string;
			price: number;
			billing: string;
			category: string;
			paymentMethod?: string;
			startDate?: string;
			color?: string;
			serviceKey?: string;
			currency?: string;
		}) => Promise<void>;
		updateSubscription: (id: string, data: any) => Promise<void>;
		deleteSubscription: (id: string) => Promise<void>;
		clearAllSubscriptions: () => Promise<void>;
	}
}

export {};
