import { Text, View } from "react-native";

const InfoRow = ({ label, value, showArrow, icon }: InfoRowProps) => (
	<View className="flex-row items-center justify-between gap-3 px-4 py-3">
		<View className="flex-row items-center gap-2.5 flex-1">
			{icon}
			<Text className="sub-label" numberOfLines={1} ellipsizeMode="tail">{label}</Text>
		</View>
		<View className="flex-row items-center gap-2 flex-1 justify-end">
			<Text
				className="sub-value text-right"
				numberOfLines={1}
				ellipsizeMode="tail"
			>
				{value}
			</Text>
			{showArrow && (
				<Text className="text-muted-foreground text-lg font-sans-semibold -mt-0.5">›</Text>
			)}
		</View>
	</View>
);

export default InfoRow;
