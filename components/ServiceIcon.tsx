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

import { SIMPLEICONS_CDN_PREFIX } from "@/constants/serviceLogos";
import type { ImageSourcePropType } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceIconProps {
	/** ImageSourcePropType from serviceLogos.ts or icons constants */
	source: ImageSourcePropType;
	/** Display size in pixels (used for both width and height) */
	size?: number;
	/**
	 * Tint colour for Simple Icons SVGs (which are monochrome by default).
	 * Defaults to "#111111" — near-black that works on all card backgrounds.
	 */
	color?: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function ServiceIcon({
	source,
	size = 44,
	color = "#111111",
}: ServiceIconProps) {
	const [svgError, setSvgError] = useState(false);

	const svgUri = getSimpleIconsUri(source);

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
		// SVG failed to load (wrong slug, CDN hiccup, etc.) — render nothing.
		// The parent <View> (sub-icon box) remains visible; caller can layer an
		// initial avatar behind this component if desired.
		return <View style={{ width: size, height: size }} />;
	}

	// Local require() or non-SVG remote URI — rendered via expo-image
	return (
		<Image
			source={source}
			style={[styles.image, { width: size, height: size }]}
			contentFit="contain"
		/>
	);
}

const styles = StyleSheet.create({
	image: {
		// width & height applied dynamically via size prop
	},
});

export default ServiceIcon;
