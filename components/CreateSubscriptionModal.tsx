import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
	ImageSourcePropType,
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

import { icons } from "@/constants/icons";
import { POPULAR_SERVICES, type ServiceEntry } from "@/constants/serviceLogos";
import { ServiceIcon } from "@/components/ServiceIcon";
import { getIconInitial } from "@/lib/utils";
import { colors } from "@/constants/theme";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

/** The generic fallback entry ("Other") */
const DEFAULT_ENTRY: ServiceEntry = POPULAR_SERVICES[POPULAR_SERVICES.length - 1];

/**
 * Best image source for a service entry.
 * Prefers local bundled PNG (instant, offline) when available,
 * then Simple Icons CDN SVG (always set, free, no API key).
 */
function entrySource(entry: ServiceEntry): ImageSourcePropType {
	return entry.localSource ?? entry.logoSource;
}

/** Auto-match a ServiceEntry from the typed name using keywords */
function autoMatchEntry(name: string): ServiceEntry | null {
	if (!name.trim()) return null;
	const q = name.toLowerCase().trim();
	for (const svc of POPULAR_SERVICES) {
		if (svc.key === "other") continue;
		if (svc.keywords.some((kw) => q.includes(kw) || kw.includes(q))) {
			return svc;
		}
	}
	return null;
}

// ─── Category & frequency config ─────────────────────────────────────────────

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

type Category = (typeof CATEGORIES)[number];
type Frequency = "Monthly" | "Yearly";

const CATEGORY_COLORS: Record<string, string> = {
	Entertainment: "#b8d4e3",
	"AI Tools":    "#e8def8",
	"Developer Tools": "#e8def8",
	Design:        "#b8e8d0",
	Productivity:  "#fff9c4",
	Cloud:         "#c8e6c9",
	Music:         "#f5c542",
	Other:         "#f6eecf",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateSubscriptionModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (subscription: Subscription) => void;
}

// ─── Icon picker grid ─────────────────────────────────────────────────────────

interface IconPickerGridProps {
	selected: ServiceEntry;
	onSelect: (entry: ServiceEntry) => void;
}

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

// ─── Main component ───────────────────────────────────────────────────────────

const CreateSubscriptionModal = ({
	visible,
	onClose,
	onSubmit,
}: CreateSubscriptionModalProps) => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [frequency, setFrequency] = useState<Frequency>("Monthly");
	const [category, setCategory] = useState<Category | "">("");
	const [selectedEntry, setSelectedEntry] = useState<ServiceEntry>(DEFAULT_ENTRY);
	const [showIconPicker, setShowIconPicker] = useState(false);
	const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

	// ── Helpers ────────────────────────────────────────────────────────────────

	const handleNameChange = (text: string) => {
		setName(text);
		if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
		// Auto-suggest icon when name matches a known service
		const match = autoMatchEntry(text);
		if (match) setSelectedEntry(match);
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
		if (!validate()) return;
		const now = dayjs();
		const cat: string = category || "Other";

		// If no brand logo is available (Other entry selected), generate an initial
		// avatar so the card always shows something meaningful.
		const resolvedSource = entrySource(selectedEntry);
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
			currency: "USD",
			billing: frequency,
			category: cat,
			status: "active",
			startDate: now.toISOString(),
			renewalDate: (frequency === "Monthly"
				? now.add(1, "month")
				: now.add(1, "year")
			).toISOString(),
			color: CATEGORY_COLORS[cat] ?? "#f6eecf",
		};

		onSubmit(subscription);
		resetForm();
		onClose();
	};

	const isSubmittable = name.trim().length > 0 && price.trim().length > 0;

	// ── Render ─────────────────────────────────────────────────────────────────

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
										{/* Show brand icon (SVG or local PNG) via ServiceIcon */}
										{(() => {
											const src = entrySource(selectedEntry);
											return (
												<ServiceIcon
													source={src}
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
								<Text className="auth-label">Price (USD)</Text>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

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
