import { clsx } from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
	ImageSourcePropType,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { ServiceIcon } from "@/components/ServiceIcon";
import { icons } from "@/constants/icons";
import { POPULAR_SERVICES, resolveServiceLogo } from "@/constants/serviceLogos";
import { colors } from "@/constants/theme";
import { getIconInitial } from "@/lib/utils";

import { useSubscriptions } from "@/context/subscriptions";

/** The generic fallback entry ("Other") */
const DEFAULT_ENTRY: ServiceEntry = POPULAR_SERVICES[POPULAR_SERVICES.length - 1];

/**
 * Best image source for a service entry.
 * Prefers local bundled PNG (instant, offline) when available,
 * then Simple Icons CDN SVG (always set, free, no API key).
 */
function entrySource(entry: ServiceEntry, name = ""): ImageSourcePropType {
	if (entry.key === "other" && name.trim()) {
		const resolved = resolveServiceLogo(name);
		if (resolved) return resolved;
	}
	return entry.localSource ?? entry.logoSource;
}

/** Auto-match a ServiceEntry from the typed name using keywords */
function autoMatchEntry(name: string): ServiceEntry | null {
	if (!name.trim()) return null;
	const q = name.toLowerCase().trim();
	// Exact match first
	for (const svc of POPULAR_SERVICES) {
		if (svc.key === "other") continue;
		if (svc.keywords.some((kw) => kw === q)) {
			return svc;
		}
	}
	// Prefix match next (min 2 chars to avoid single-letter hyper-matching)
	if (q.length >= 2) {
		for (const svc of POPULAR_SERVICES) {
			if (svc.key === "other") continue;
			if (svc.keywords.some((kw) => kw.startsWith(q) || q.startsWith(kw))) {
				return svc;
			}
		}
	}
	return null;
}

const CATEGORIES = [
	"Entertainment",
	"AI Tools",
	"Developer Tools",
	"Design",
	"Productivity",
	"Cloud",
	"Music",
	"Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
	Entertainment:    "#4f46e5", // Indigo
	"AI Tools":       "#a855f7", // Purple
	"Developer Tools": "#0ea5e9", // Sky Blue
	Design:           "#10b981", // Emerald Green
	Productivity:     "#f97316", // Bright Orange
	Cloud:            "#06b6d4", // Cyan
	Music:            "#eab308", // Golden Yellow
	Other:            "#64748b", // Slate Grey
};



const IconPickerGrid = ({ selected, onSelect }: IconPickerGridProps) => (
	<View style={styles.pickerGrid}>
		{POPULAR_SERVICES.map((svc) => {
			const isSelected = svc.key === selected.key;
			const src = entrySource(svc);
			return (
				<Pressable
					key={svc.key}
					style={[
						styles.pickerCell,
						isSelected && styles.pickerCellSelected,
					]}
					onPress={() => onSelect(svc)}
				>
					<View style={styles.pickerIconBox}>
						<ServiceIcon
							source={src}
							size={styles.pickerIconImage.width}
						/>
					</View>
					<Text style={[styles.pickerLabel, isSelected && styles.pickerLabelSelected]}>
						{svc.label}
					</Text>
				</Pressable>
			);
		})}
	</View>
);

const CreateSubscriptionModal = ({
	visible,
	onClose,
	onSubmit,
}: CreateSubscriptionModalProps) => {
	const { defaultCurrency } = useSubscriptions();
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [frequency, setFrequency] = useState<Frequency>("Monthly");
	const [category, setCategory] = useState<Category | "">("");
	const [selectedEntry, setSelectedEntry] = useState<ServiceEntry>(DEFAULT_ENTRY);
	const [showIconPicker, setShowIconPicker] = useState(false);
	const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

	const handleNameChange = (text: string) => {
		setName(text);
		if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
		// Auto-suggest icon when name matches a known service
		const match = autoMatchEntry(text);
		if (match) {
			setSelectedEntry(match);
		} else {
			setSelectedEntry(DEFAULT_ENTRY);
		}
	};

	const validate = (): boolean => {
		const next: { name?: string; price?: string } = {};
		if (!name.trim()) next.name = "Name is required";
		const num = parseFloat(price);
		if (!price.trim() || isNaN(num) || num <= 0)
			next.price = "Enter a valid price greater than 0";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const resetForm = () => {
		setName("");
		setPrice("");
		setFrequency("Monthly");
		setCategory("");
		setSelectedEntry(DEFAULT_ENTRY);
		setShowIconPicker(false);
		setErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = () => {
		Keyboard.dismiss();
		if (!validate()) return;
		const now = dayjs();
		const cat: string = category || "Other";

		// If no brand logo is available (Other entry selected), generate an initial
		// avatar so the card always shows something meaningful.
		const resolvedSource = entrySource(selectedEntry, name);
		const usesGenericEntry = selectedEntry.key === "other";
		const iconInitial = usesGenericEntry && name.trim()
			? getIconInitial(name.trim())
			: undefined;

		const subscription: Subscription = {
			id: `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
			icon: resolvedSource ?? icons.plus,
			iconInitial,
			name: name.trim(),
			price: parseFloat(parseFloat(price).toFixed(2)),
			currency: defaultCurrency,
			billing: frequency,
			category: cat,
			status: "active",
			startDate: now.toISOString(),
			renewalDate: (frequency === "Monthly"
				? now.add(1, "month")
				: now.add(1, "year")
			).toISOString(),
			color: CATEGORY_COLORS[cat] ?? "#f6eecf",
			serviceKey: selectedEntry.key,
		};
		onSubmit(subscription);

		resetForm();
		onClose();
	};

	const isSubmittable = name.trim().length > 0 && price.trim().length > 0;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={handleClose}
			statusBarTranslucent
		>
			<KeyboardAvoidingView
				style={styles.overlay}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />

				<View className="modal-container">
					{/* ── Header ── */}
					<View className="modal-header">
						<Text className="modal-title">New Subscription</Text>
						<Pressable className="modal-close" onPress={handleClose} hitSlop={8}>
							<Text className="modal-close-text">✕</Text>
						</Pressable>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<View className="modal-body">
							{/* ── Name + icon picker trigger ── */}
							<View className="auth-field">
								<Text className="auth-label">Name</Text>

								<View style={styles.nameRow}>
									<Pressable
										onPress={() => setShowIconPicker((v) => !v)}
										style={[
											styles.iconTrigger,
											showIconPicker && styles.iconTriggerActive,
										]}
										hitSlop={4}
									>
										{(() => {
											const src = entrySource(selectedEntry, name);
											return (
												<ServiceIcon
													source={src}
													name={name}
													size={styles.iconTriggerImage.width}
												/>
											);
										})()}
									</Pressable>

									<TextInput
										style={[
											styles.input,
											styles.inputFlex,
											!!errors.name && styles.inputError,
										]}
										placeholder="e.g. Netflix, Spotify…"
										placeholderTextColor="rgba(0,0,0,0.35)"
										value={name}
										onChangeText={handleNameChange}
										autoCapitalize="words"
										autoCorrect={false}
										textAlignVertical="center"
										returnKeyType="next"
									/>
								</View>

								{!!errors.name && (
									<Text className="auth-error">{errors.name}</Text>
								)}

								{/* ── Inline icon picker grid ── */}
								{showIconPicker && (
									<View style={styles.pickerContainer}>
										<Text style={styles.pickerHint}>
											Tap to select an icon
										</Text>
										<IconPickerGrid
											selected={selectedEntry}
											onSelect={(entry) => {
												setSelectedEntry(entry);
												setShowIconPicker(false);
											}}
										/>
									</View>
								)}
							</View>

							{/* ── Price ── */}
							<View className="auth-field">
								<Text className="auth-label">Price ({defaultCurrency})</Text>
								<TextInput
									style={[styles.input, !!errors.price && styles.inputError]}
									placeholder="0.00"
									placeholderTextColor="rgba(0,0,0,0.35)"
									value={price}
									onChangeText={(t) => {
										setPrice(t);
										if (errors.price)
											setErrors((e) => ({ ...e, price: undefined }));
									}}
									keyboardType="decimal-pad"
									textAlignVertical="center"
									returnKeyType="done"
								/>
								{!!errors.price && (
									<Text className="auth-error">{errors.price}</Text>
								)}
							</View>

							{/* ── Frequency toggle ── */}
							<View className="auth-field">
								<Text className="auth-label">Frequency</Text>
								<View className="picker-row">
									{(["Monthly", "Yearly"] as Frequency[]).map((f) => (
										<Pressable
											key={f}
											className={clsx(
												"picker-option",
												frequency === f && "picker-option-active",
											)}
											onPress={() => setFrequency(f)}
										>
											<Text
												className={clsx(
													"picker-option-text",
													frequency === f && "picker-option-text-active",
												)}
											>
												{f}
											</Text>
										</Pressable>
									))}
								</View>
							</View>

							{/* ── Category chips ── */}
							<View className="auth-field">
								<Text className="auth-label">Category</Text>
								<View className="category-scroll">
									{CATEGORIES.map((cat) => (
										<Pressable
											key={cat}
											className={clsx(
												"category-chip",
												category === cat && "category-chip-active",
											)}
											onPress={() =>
												setCategory((c) => (c === cat ? "" : cat))
											}
										>
											<Text
												className={clsx(
													"category-chip-text",
													category === cat && "category-chip-text-active",
												)}
											>
												{cat}
											</Text>
										</Pressable>
									))}
								</View>
							</View>

							{/* ── Submit ── */}
							<Pressable
								className={clsx(
									"auth-button",
									!isSubmittable && "auth-button-disabled",
								)}
								style={({ pressed }) => pressed && { opacity: 0.8 }}
								onPress={handleSubmit}
								disabled={!isSubmittable}
							>
								<Text className="auth-button-text">Add Subscription</Text>
							</Pressable>
						</View>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},

	// Name row
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},

	// Icon trigger button (the box you tap to open the picker)
	iconTrigger: {
		width: 52,
		height: 52,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.card,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		flexShrink: 0,
	},
	iconTriggerActive: {
		borderColor: colors.accent,
		backgroundColor: `${colors.accent}18`, // 10% accent tint
	},
	iconTriggerImage: {
		width: 36,
		height: 36,
	},

	// Text inputs
	input: {
		height: 52,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
		fontSize: 16,
		fontFamily: "sans-medium",
		color: colors.primary,
	},
	inputFlex: {
		flex: 1,
	},
	inputError: {
		borderColor: colors.destructive,
	},

	// Icon picker container
	pickerContainer: {
		marginTop: 8,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.card,
		padding: 12,
	},
	pickerHint: {
		fontSize: 11,
		fontFamily: "sans-semibold",
		color: colors.mutedForeground,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 10,
	},

	// Icon grid
	pickerGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	pickerCell: {
		width: 64,
		alignItems: "center",
		gap: 4,
		paddingVertical: 6,
		paddingHorizontal: 4,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "transparent",
	},
	pickerCellSelected: {
		borderColor: colors.accent,
		backgroundColor: `${colors.accent}18`,
	},
	pickerIconBox: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	pickerIconImage: {
		width: 32,
		height: 32,
	},
	pickerLabel: {
		fontSize: 10,
		fontFamily: "sans-medium",
		color: colors.mutedForeground,
		textAlign: "center",
	},
	pickerLabelSelected: {
		color: colors.accent,
		fontFamily: "sans-semibold",
	},

	// Initial avatar inside the icon trigger button
	triggerInitialAvatar: {
		width: 44,
		height: 44,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	triggerInitialLetter: {
		color: "#ffffff",
		fontSize: 20,
		fontWeight: "700",
		lineHeight: 24,
	},

	// Initial avatar inside picker grid cells (when no logo source available)
	pickerInitialAvatar: {
		width: 32,
		height: 32,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	pickerInitialLetter: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "700",
		lineHeight: 17,
	},
});

export default CreateSubscriptionModal;
