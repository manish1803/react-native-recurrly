import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { useAuth } from "@clerk/expo";
import { api } from "@/lib/api";
import { resolveServiceLogo, fallbackIcon } from "@/constants/serviceLogos";
import { getIconInitial } from "@/lib/utils";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helpers
/**
 * Maps a raw backend subscription object to the frontend Subscription structure.
 * It dynamically resolves brand icons or computes initial avatars.
 */
export function mapBackendSubscription(sub: any): Subscription {
	const isOther = sub.serviceKey === "other";
	const icon = resolveServiceLogo(sub.name) || fallbackIcon;
	const iconInitial = isOther ? getIconInitial(sub.name) : undefined;

	return {
		id: sub.id,
		name: sub.name,
		price: sub.price,
		currency: sub.currency,
		billing: sub.billing,
		category: sub.category,
		paymentMethod: sub.paymentMethod || undefined,
		status: sub.status,
		startDate: sub.startDate,
		renewalDate: sub.renewalDate,
		color: sub.color || undefined,
		serviceKey: sub.serviceKey || undefined,
		icon,
		iconInitial,
	};
}


// Context
const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(
	null,
);

// Provider
export function SubscriptionsProvider({ children }: { children: ReactNode }) {
	const { getToken, isSignedIn } = useAuth();
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [upcoming, setUpcoming] = useState<UpcomingSubscription[]>([]);
	const [insights, setInsights] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [defaultCurrency, setDefaultCurrencyState] = useState("USD");

	// Load stored currency on startup
	useEffect(() => {
		const loadDefaultCurrency = async () => {
			try {
				const saved = await AsyncStorage.getItem("recurrly_default_currency");
				if (saved) {
					setDefaultCurrencyState(saved);
				} else {
					const detected = Localization.getLocales()?.[0]?.currencyCode || "USD";
					setDefaultCurrencyState(detected);
					await AsyncStorage.setItem("recurrly_default_currency", detected);
				}
			} catch (err) {
				console.error("Failed to load default currency:", err);
			}
		};
		loadDefaultCurrency();
	}, []);

	const setDefaultCurrency = async (currency: string) => {
		try {
			setDefaultCurrencyState(currency);
			await AsyncStorage.setItem("recurrly_default_currency", currency);
			// Refresh insights & subscriptions to map the new currency format if needed
			await refreshAllData();
		} catch (err) {
			console.error("Failed to save default currency:", err);
		}
	};

	// Load all data from API
	const fetchSubscriptions = async () => {
		if (!isSignedIn) return;
		setLoading(true);
		setError(null);
		try {
			const token = await getToken();
			const rawData = await api.get<any[]>("/api/subscriptions", token);
			const mapped = rawData.map(mapBackendSubscription);
			setSubscriptions(mapped);
		} catch (err: any) {
			console.error("Failed to fetch subscriptions:", err);
			setError(err.message || "Something went wrong fetching subscriptions");
		} finally {
			setLoading(false);
		}
	};

	const fetchUpcoming = async () => {
		if (!isSignedIn) return;
		try {
			const token = await getToken();
			const rawData = await api.get<any[]>("/api/subscriptions/upcoming", token);
			// Map database icons to frontend asset files
			const mapped = rawData.map((sub: any) => ({
				id: sub.id,
				name: sub.name,
				price: sub.price,
				currency: sub.currency,
				daysLeft: sub.daysLeft,
				icon: resolveServiceLogo(sub.name) || fallbackIcon,
			}));
			setUpcoming(mapped);
		} catch (err) {
			console.error("Failed to fetch upcoming renewals:", err);
		}
	};

	const fetchInsights = async () => {
		if (!isSignedIn) return;
		try {
			const token = await getToken();
			const rawData = await api.get<any>("/api/insights", token);
			setInsights(rawData);
		} catch (err) {
			console.error("Failed to fetch insights data:", err);
		}
	};

	// Refetches all data to sync client views
	const refreshAllData = async () => {
		await Promise.all([
			fetchSubscriptions(),
			fetchUpcoming(),
			fetchInsights(),
		]);
	};

	// Trigger load on auth sign-in state
	useEffect(() => {
		if (isSignedIn) {
			refreshAllData();
		} else {
			// Clear cached state on logout
			setSubscriptions([]);
			setUpcoming([]);
			setInsights(null);
		}
	}, [isSignedIn]);

	const addSubscription = async (sub: any) => {
		try {
			const token = await getToken();
			await api.post("/api/subscriptions", sub, token);
			// Refresh list & counts
			await refreshAllData();
		} catch (err: any) {
			console.error("Failed to create subscription:", err);
			throw err;
		}
	};

	const updateSubscription = async (id: string, data: any) => {
		try {
			const token = await getToken();
			await api.patch(`/api/subscriptions/${id}`, data, token);
			await refreshAllData();
		} catch (err: any) {
			console.error("Failed to update subscription:", err);
			throw err;
		}
	};

	const deleteSubscription = async (id: string) => {
		try {
			const token = await getToken();
			await api.delete(`/api/subscriptions/${id}`, token);
			await refreshAllData();
		} catch (err: any) {
			console.error("Failed to delete subscription:", err);
			throw err;
		}
	};

	const clearAllSubscriptions = async () => {
		try {
			const token = await getToken();
			await api.delete("/api/subscriptions", token);
			await refreshAllData();
		} catch (err: any) {
			console.error("Failed to clear subscriptions:", err);
			throw err;
		}
	};

	return (
		<SubscriptionsContext.Provider
			value={{
				subscriptions,
				upcoming,
				insights,
				loading,
				error,
				defaultCurrency,
				setDefaultCurrency,
				fetchSubscriptions,
				fetchUpcoming,
				fetchInsights,
				addSubscription,
				updateSubscription,
				deleteSubscription,
				clearAllSubscriptions,
			}}
		>
			{children}
		</SubscriptionsContext.Provider>
	);
}

// Hook 
export function useSubscriptions(): SubscriptionsContextValue {
	const ctx = useContext(SubscriptionsContext);
	if (!ctx) {
		throw new Error(
			"useSubscriptions must be used inside <SubscriptionsProvider>",
		);
	}
	return ctx;
}
