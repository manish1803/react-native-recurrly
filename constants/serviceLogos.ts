import type { ImageSourcePropType } from "react-native";
import { icons } from "./icons";
import { SERVICE_SLUG_MAP, SERVICE_DOMAIN_MAP, POPULAR_SERVICES_DATA } from "./serviceLogoMaps";

const SIMPLEICONS_CDN_BASE =
	"https://cdn.jsdelivr.net/npm/simple-icons/icons";

export const SIMPLEICONS_CDN_PREFIX = SIMPLEICONS_CDN_BASE;

export function simpleIconUri(slug: string): ImageSourcePropType {
	return { uri: `${SIMPLEICONS_CDN_BASE}/${slug}.svg` }
}

// Matching
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function getDomain(name: string): string {
	const key = normalise(name);
	if (SERVICE_DOMAIN_MAP[key]) return SERVICE_DOMAIN_MAP[key];

	for (const [k, domain] of Object.entries(SERVICE_DOMAIN_MAP)) {
		if (key.startsWith(k) || k.startsWith(key)) return domain;
	}

	for (const [k, domain] of Object.entries(SERVICE_DOMAIN_MAP)) {
		if (key.includes(k) || k.includes(key)) return domain;
	}

	return `${key}.com`;
}

export function resolveServiceLogo(name: string): ImageSourcePropType | null {
	if (!name.trim()) return null;

	const domain = getDomain(name);
	const key = normalise(name);

	let simpleIconSlug = SERVICE_SLUG_MAP[key];
	if (!simpleIconSlug) {
		for (const [k, slug] of Object.entries(SERVICE_SLUG_MAP)) {
			if (key.startsWith(k) || k.startsWith(key)) {
				simpleIconSlug = slug;
				break;
			}
		}
	}
	if (!simpleIconSlug) {
		for (const [k, slug] of Object.entries(SERVICE_SLUG_MAP)) {
			if (key.includes(k) || k.includes(key)) {
				simpleIconSlug = slug;
				break;
			}
		}
	}

	const logoDevUrl = `https://img.logo.dev/${domain}?token=${process.env.EXPO_PUBLIC_LOGO_DEV_TOKEN || ""}`;
	
	if (simpleIconSlug) {
		const fallbackUrl = `${SIMPLEICONS_CDN_BASE}/${simpleIconSlug}.svg`;
		return {
			uri: logoDevUrl,
			fallbackUri: fallbackUrl,
		} as any;
	}

	return {
		uri: logoDevUrl,
	} as any;
}

// Fallback local asset — used when no logo is resolved
export const fallbackIcon = icons.plus;

export const POPULAR_SERVICES: ServiceEntry[] = POPULAR_SERVICES_DATA.map((svc) => {
	let logoSource: ImageSourcePropType;
	if (svc.logoQuery) {
		logoSource = resolveServiceLogo(svc.logoQuery)!;
	} else if (svc.simpleIconSlug) {
		logoSource = simpleIconUri(svc.simpleIconSlug);
	} else {
		logoSource = fallbackIcon;
	}

	return {
		key: svc.key,
		label: svc.label,
		logoSource,
		localSource: svc.localIconKey ? (icons as any)[svc.localIconKey] : undefined,
		keywords: svc.keywords,
	};
});
