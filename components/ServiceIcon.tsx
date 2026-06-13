/**
 * ServiceIcon — unified icon renderer for subscription services.
 *
 * Handles two source types transparently:
 *  1. Simple Icons via jsDelivr CDN  (.svg files)
 *     → Rendered via react-native-svg's <SvgUri>
 *     → Falls back to a coloured initial-letter avatar on any fetch error
 *
 *  2. Local / remote raster image  (require() or { uri: "..." })
 *     → Rendered via expo-image <Image> with contentFit="contain"
 *
 * Usage:
 *   <ServiceIcon source={entry.logoSource} size={44} />
 *   <ServiceIcon source={icons.spotify}    size={32} color="#1DB954" />
 */

import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SvgUri } from "react-native-svg";

import { SIMPLEICONS_CDN_PREFIX, fallbackIcon } from "@/constants/serviceLogos";
import type { ImageSourcePropType } from "react-native";
import { getIconInitial } from "@/lib/utils";

// Helper
/** Returns the URI string if it points to a Simple Icons SVG, otherwise null */
function getSimpleIconsUri(source: ImageSourcePropType): string | null {
	if (
		typeof source === "object" &&
		source !== null &&
		!Array.isArray(source) &&
		"uri" in source &&
		typeof (source as { uri?: unknown }).uri === "string"
	) {
		const uri = (source as { uri: string }).uri;
		return uri.startsWith(SIMPLEICONS_CDN_PREFIX) ? uri : null;
	}
	return null;
}

// Component 
export function ServiceIcon({
	source,
	size = 44,
	color = "#111111",
	name,
	iconInitial,
}: ServiceIconProps) {
	const [loadError, setLoadError] = useState(false);
	const [svgError, setSvgError] = useState(false);

	const initial = iconInitial || (name ? getIconInitial(name) : null);

	// Check if this is a logo.dev + fallback source
	const isCompound =
		typeof source === "object" &&
		source !== null &&
		!Array.isArray(source) &&
		"fallbackUri" in (source as any);

	const mainUri = isCompound ? (source as any).uri : null;
	const fallbackUri = isCompound ? (source as any).fallbackUri : null;

	const renderInitialAvatar = () => {
		if (!initial) {
			return (
				<Image
					source={fallbackIcon}
					style={{ width: size, height: size }}
					contentFit="contain"
				/>
			);
		}

		return (
			<View
				style={[
					styles.initialAvatar,
					{
						width: size,
						height: size,
						borderRadius: size / 2,
						backgroundColor: initial.bgColor,
					},
				]}
			>
				<Text style={[styles.initialLetter, { fontSize: size * 0.45 }]}>
					{initial.letter}
				</Text>
			</View>
		);
	};

	// 1. If it's a compound source and hasn't failed to load, try main image (logo.dev)
	if (isCompound && mainUri && !loadError) {
		return (
			<Image
				source={{ uri: mainUri }}
				style={{ width: size, height: size }}
				contentFit="contain"
				onError={() => setLoadError(true)}
			/>
		);
	}

	// 2. Select fallback source if compound has errored
	const activeSource = isCompound
		? (loadError && fallbackUri ? { uri: fallbackUri } : null)
		: source;

	// If no active source, render initial avatar
	if (!activeSource) {
		return renderInitialAvatar();
	}

	// 3. Render Simple Icons SVG
	const svgUri = getSimpleIconsUri(activeSource);

	if (svgUri && !svgError) {
		// Simple Icons SVG path — rendered via react-native-svg
		return (
			<SvgUri
				uri={svgUri}
				width={size}
				height={size}
				color={color}
				onError={() => setSvgError(true)}
			/>
		);
	}

	if (svgUri && svgError) {
		// SVG failed to load — render initial avatar
		return renderInitialAvatar();
	}

	// 4. Local require() or non-SVG remote URI — check if it's the generic plus/wallet icon
	const isGenericIcon =
		source === fallbackIcon ||
		(typeof source === "object" &&
			source !== null &&
			"uri" in source &&
			(source as any).uri === "plus");

	if (isGenericIcon && initial) {
		return renderInitialAvatar();
	}

	// Render local require() or other image source
	return (
		<Image
			source={activeSource}
			style={{ width: size, height: size }}
			contentFit="contain"
		/>
	);
}

const styles = StyleSheet.create({
	initialAvatar: {
		alignItems: "center",
		justifyContent: "center",
	},
	initialLetter: {
		fontWeight: "bold",
		color: "#FFFFFF",
	},
});

export default ServiceIcon;
