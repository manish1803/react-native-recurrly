import { clsx } from "clsx";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const CURRENCIES = [
	{ code: "USD", name: "United States Dollar ($)" },
	{ code: "EUR", name: "Euro (€)" },
	{ code: "GBP", name: "British Pound (£)" },
	{ code: "INR", name: "Indian Rupee (₹)" },
	{ code: "CAD", name: "Canadian Dollar (C$)" },
	{ code: "AUD", name: "Australian Dollar (A$)" },
	{ code: "JPY", name: "Japanese Yen (¥)" },
];

export default function CurrencyPickerModal({
	visible,
	onClose,
	selected,
	onSelect,
}: CurrencyPickerModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
			statusBarTranslucent
		>
			<View style={styles.overlay}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<View className="modal-container">
					<View className="modal-header">
						<Text className="modal-title">Select Currency</Text>
						<Pressable className="modal-close" onPress={onClose} hitSlop={8}>
							<Text className="modal-close-text">✕</Text>
						</Pressable>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="modal-body gap-2">
							{CURRENCIES.map((item) => {
								const isSelected = item.code === selected;
								return (
									<Pressable
										key={item.code}
										className={clsx(
											"flex-row items-center justify-between rounded-2xl border border-border p-4",
											isSelected ? "border-accent bg-accent/10" : "bg-card"
										)}
										onPress={() => {
											onSelect(item.code);
											onClose();
										}}
									>
										<Text className={clsx(
											"text-base font-sans-medium",
											isSelected ? "text-accent font-sans-bold" : "text-primary"
										)}>
											{item.name}
										</Text>
										{isSelected && (
											<Text className="text-accent font-sans-bold">✓</Text>
										)}
									</Pressable>
								);
							})}
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
});
