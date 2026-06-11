import { Text, View } from "react-native";

interface InfoRowProps {
	label: string;
	value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
	<View className="flex-row items-center justify-between gap-3 px-4 py-3">
		<Text className="sub-label shrink-0">{label}</Text>
		<Text
			className="sub-value flex-1 text-right"
			numberOfLines={1}
			ellipsizeMode="tail"
		>
			{value}
		</Text>
	</View>
);

export default InfoRow;
