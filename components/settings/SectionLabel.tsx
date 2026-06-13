import { Text } from "react-native";

const SectionLabel = ({ title }: SectionLabelProps) => (
	<Text className="mb-2 text-xs font-sans-semibold uppercase tracking-[0.8px] text-muted-foreground">
		{title}
	</Text>
);

export default SectionLabel;
