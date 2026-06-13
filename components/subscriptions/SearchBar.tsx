import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/constants/theme";

/**
 * SearchBar — reusable search input with a clear button.
 * Uses StyleSheet for TextInput (NativeWind v5 preview doesn't reliably
 * apply className height/font on TextInput — see AuthField pattern).
 */
const SearchBar = ({
	value,
	onChangeText,
	placeholder = "Search…",
}: SearchBarProps) => (
	<View className="mb-4 flex-row items-center rounded-2xl border border-border bg-card">
		<TextInput
			style={styles.input}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor="rgba(0,0,0,0.35)"
			textAlignVertical="center"
			autoCorrect={false}
			autoCapitalize="none"
			returnKeyType="search"
		/>
		{value.length > 0 && (
			<Pressable
				onPress={() => onChangeText("")}
				hitSlop={8}
				className="pr-4"
			>
				<Text className="text-base font-sans-bold text-muted-foreground">
					✕
				</Text>
			</Pressable>
		)}
	</View>
);

const styles = StyleSheet.create({
	input: {
		flex: 1,
		height: 52,
		paddingHorizontal: 16,
		fontSize: 15,
		fontFamily: "sans-medium",
		color: colors.primary,
	},
});

export default SearchBar;
