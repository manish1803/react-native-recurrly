import dayjs from "dayjs";

export const formatCurrency = (value: number, currency = "USD"): string => {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	} catch {
		return value.toFixed(2);
	}
};

export const formatSubscriptionDateTime = (value?: string): string => {
	if (!value) return "Not provided";
	const parsedDate = dayjs(value);
	return parsedDate.isValid()
		? parsedDate.format("MM/DD/YYYY")
		: "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
	if (!value) return "Unknown";
	return value.charAt(0).toUpperCase() + value.slice(1);
};

// ─── Initial avatar helper ────────────────────────────────────────────────────

/**
 * Curated palette — enough contrast against white text, visually distinct.
 * Used deterministically so the same service name always gets the same colour.
 */
const AVATAR_PALETTE = [
	"#E57373", // red
	"#F06292", // pink
	"#BA68C8", // purple
	"#7986CB", // indigo
	"#4FC3F7", // light blue
	"#4DB6AC", // teal
	"#81C784", // green
	"#FFD54F", // amber
	"#FF8A65", // deep orange
	"#A1887F", // brown
	"#90A4AE", // blue-grey
	"#26C6DA", // cyan
];

/**
 * Returns `{ letter, bgColor }` for a subscription name.
 * The background colour is derived from a simple djb2-style hash of the name
 * so the same name always produces the same colour across renders/sessions.
 */
export function getIconInitial(name: string): { letter: string; bgColor: string } {
	const letter = (name.trim()[0] ?? "?").toUpperCase();
	// djb2-style hash — fast, deterministic, no crypto needed
	let hash = 5381;
	for (let i = 0; i < name.length; i++) {
		hash = (hash * 33) ^ name.charCodeAt(i);
	}
	const bgColor = AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
	return { letter, bgColor };
}

