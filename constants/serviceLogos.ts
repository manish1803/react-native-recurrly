import type { ImageSourcePropType } from "react-native";
import { icons } from "./icons";

const SIMPLEICONS_CDN_BASE =
	"https://cdn.jsdelivr.net/npm/simple-icons/icons";

export const SIMPLEICONS_CDN_PREFIX = SIMPLEICONS_CDN_BASE;

export function simpleIconUri(slug: string): ImageSourcePropType {
	return { uri: `${SIMPLEICONS_CDN_BASE}/${slug}.svg` }
}

//  Service → Simple Icons slug map 
// Keys are lowercase-normalised (no spaces / punctuation).
// Values are the exact Simple Icons slug (see https://simpleicons.org).

const SERVICE_SLUG_MAP: Record<string, string> = {
	// Streaming / Video 
	netflix:          "netflix",
	disneyplus:       "disneyplus",
	disney:           "disneyplus",
	hbomax:           "hbo",
	hbo:              "hbo",
	max:              "hbo",
	hulu:             "hulu",
	primevideo:       "primevideo",
	amazonprime:      "primevideo",
	amazon:           "amazon",
	appletv:          "appletv",
	peacock:          "peacock",
	paramountplus:    "paramount",
	crunchyroll:      "crunchyroll",
	twitch:           "twitch",
	youtube:          "youtube",
	youtubepremium:   "youtube",
	vimeo:            "vimeo",
	plex:             "plex",

	// Music / Audio 
	spotify:          "spotify",
	applemusic:       "applemusic",
	tidal:            "tidal",
	deezer:           "deezer",
	soundcloud:       "soundcloud",
	amazonmusic:      "amazonmusic",
	youtubemusic:     "youtubemusic",
	audible:          "audible",
	pandora:          "pandora",

	// AI / LLM 
	chatgpt:          "openai",
	openai:           "openai",
	claude:           "anthropic",
	anthropic:        "anthropic",
	gemini:           "googlegemini",
	googlegem:        "googlegemini",
	midjourney:       "midjourney",
	perplexity:       "perplexity",
	githubcopilot:    "githubcopilot",
	copilot:          "githubcopilot",
	grammarly:        "grammarly",
	jasper:           "jasper",
	elevenlabs:       "elevenlabs",
	cursor:           "cursor",
	grok:             "xai",

	// ── Developer Tools 
	github:           "github",
	gitlab:           "gitlab",
	bitbucket:        "bitbucket",
	jira:             "jira",
	confluence:       "confluence",
	atlassian:        "atlassian",
	linear:           "linear",
	vercel:           "vercel",
	netlify:          "netlify",
	heroku:           "heroku",
	digitalocean:     "digitalocean",
	render:           "render",
	sentry:           "sentry",
	datadog:          "datadog",
	postman:          "postman",
	supabase:         "supabase",
	planetscale:      "planetscale",

	// Cloud / Storage 	
	aws:              "amazonwebservices",
	googlecloud:      "googlecloud",
	gcp:              "googlecloud",
	azure:            "microsoftazure",
	microsoft:        "microsoft",
	office365:        "microsoftoffice",
	microsoftoffice:  "microsoftoffice",
	dropbox:          "dropbox",
	googledrive:      "googledrive",
	icloud:           "icloud",
	onedrive:         "microsoftonedrive",
	box:              "box",

	// Design / Creative
	figma:            "figma",
	sketch:           "sketch",
	adobe:            "adobe",
	adobecc:          "adobecreativecloud",
	creativecloud:    "adobecreativecloud",
	canva:            "canva",
	framer:           "framer",
	invision:         "invision",
	lottiefiles:      "lottiefiles",

	// Productivity / Notes 
	notion:           "notion",
	evernote:         "evernote",
	obsidian:         "obsidian",
	todoist:          "todoist",
	asana:            "asana",
	trello:           "trello",
	monday:           "monday",
	clickup:          "clickup",
	airtable:         "airtable",
	slack:            "slack",
	discord:          "discord",
	zoom:             "zoom",
	miro:             "miro",
	loom:             "loom",
	calendly:         "calendly",
	webex:            "ciscowebex",
	microsoftteams:   "microsoftteams",
	teams:            "microsoftteams",

	// Social / Writing 
	twitter:          "x",
	x:                "x",
	instagram:        "instagram",
	facebook:         "facebook",
	linkedin:         "linkedin",
	snapchat:         "snapchat",
	telegram:         "telegram",
	whatsapp:         "whatsapp",
	signal:           "signal",
	substack:         "substack",
	medium:           "medium",
	ghost:            "ghost",

	// Finance / Payments
	stripe:           "stripe",
	paypal:           "paypal",
	shopify:          "shopify",
	quickbooks:       "quickbooks",
	xero:             "xero",

	// Security / VPN / Privacy
	onepassword:      "1password",
	lastpass:         "lastpass",
	dashlane:         "dashlane",
	bitwarden:        "bitwarden",
	nordvpn:          "nordvpn",
	expressvpn:       "expressvpn",
	mullvad:          "mullvad",
	protonvpn:        "protonvpn",
	protonmail:       "proton",
	proton:           "proton",

	// Learning / Education
	coursera:         "coursera",
	udemy:            "udemy",
	pluralsight:      "pluralsight",
	skillshare:       "skillshare",
	duolingo:         "duolingo",
	brilliant:        "brilliant",
	readwise:         "readwise",
	leetcode:         "leetcode",

	// Analytics / Marketing 	
	posthog:          "posthog",
	mixpanel:         "mixpanel",
	hotjar:           "hotjar",
	mailchimp:        "mailchimp",
	hubspot:          "hubspot",
	intercom:         "intercom",
	zendesk:          "zendesk",

	// Health / Fitness
	strava:           "strava",
	peloton:          "peloton",
	headspace:        "headspace",
	calm:             "calm",

	// Gaming
	steam:            "steam",
	xbox:             "xbox",
	playstation:      "playstation",
	nintendo:         "nintendo",
	epicgames:        "epicgames",

	// Other SaaS 
	zapier:           "zapier",
	webflow:          "webflow",
	typeform:         "typeform",
	algolia:          "algolia",
	twilio:           "twilio",
	sendgrid:         "twilio",       // sendgrid is owned by twilio
} as const;

// Matching
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function resolveServiceLogo(name: string): ImageSourcePropType | null {
	if (!name.trim()) return null;

	const key = normalise(name);

	if (SERVICE_SLUG_MAP[key]) return simpleIconUri(SERVICE_SLUG_MAP[key]);

	for (const [k, slug] of Object.entries(SERVICE_SLUG_MAP)) {
		if (key.startsWith(k) || k.startsWith(key)) return simpleIconUri(slug);
	}

	for (const [k, slug] of Object.entries(SERVICE_SLUG_MAP)) {
		if (key.includes(k) || k.includes(key)) return simpleIconUri(slug);
	}

	return null;
}

// Fallback local asset — used when no logo is resolved
export const fallbackIcon = icons.wallet;

// Popular services for the icon picker grid
// 31 entries. Every entry has a Simple Icons CDN URI (logoSource).
// Services that also have a local PNG asset carry localSource for instant
// offline display — ServiceIcon prefers local when available.

export interface ServiceEntry {
	key: string;
	label: string;
	/** Simple Icons CDN URI — always populated, no API key needed */
	logoSource: ImageSourcePropType;
	/** Local require() asset for services bundled in assets/icons/ */
	localSource?: ImageSourcePropType;
	keywords: string[];
}

export const POPULAR_SERVICES: ServiceEntry[] = [
	{ key: "netflix",    label: "Netflix",      logoSource: simpleIconUri("netflix"),           keywords: ["netflix"] },
	{ key: "youtube",    label: "YouTube",       logoSource: simpleIconUri("youtube"),           keywords: ["youtube", "yt", "youtube premium"] },
	{ key: "spotify",    label: "Spotify",       logoSource: simpleIconUri("spotify"),           localSource: icons.spotify,  keywords: ["spotify"] },
	{ key: "disney",     label: "Disney+",       logoSource: simpleIconUri("disneyplus"),        keywords: ["disney", "disneyplus"] },
	{ key: "hbo",        label: "Max / HBO",     logoSource: simpleIconUri("hbo"),               keywords: ["hbo", "max", "hbomax"] },
	{ key: "hulu",       label: "Hulu",          logoSource: simpleIconUri("hulu"),              keywords: ["hulu"] },
	{ key: "appletv",    label: "Apple TV+",     logoSource: simpleIconUri("appletv"),           keywords: ["appletv", "apple tv"] },
	{ key: "primevideo", label: "Prime Video",   logoSource: simpleIconUri("amazonprimevideo"),  keywords: ["prime", "primevideo", "amazon prime"] },
	{ key: "chatgpt",    label: "ChatGPT",       logoSource: simpleIconUri("openai"),            localSource: icons.openai,   keywords: ["openai", "chatgpt", "gpt"] },
	{ key: "claude",     label: "Claude",        logoSource: simpleIconUri("anthropic"),         localSource: icons.claude,   keywords: ["claude", "anthropic"] },
	{ key: "gemini",     label: "Gemini",        logoSource: simpleIconUri("googlegemini"),      keywords: ["gemini", "google ai"] },
	{ key: "midjourney", label: "Midjourney",    logoSource: simpleIconUri("midjourney"),        keywords: ["midjourney", "mj"] },
	{ key: "cursor",     label: "Cursor",        logoSource: simpleIconUri("cursor"),            keywords: ["cursor"] },
	{ key: "perplexity", label: "Perplexity",    logoSource: simpleIconUri("perplexity"),        keywords: ["perplexity"] },
	{ key: "github",     label: "GitHub",        logoSource: simpleIconUri("github"),            localSource: icons.github,   keywords: ["github", "copilot", "gh"] },
	{ key: "notion",     label: "Notion",        logoSource: simpleIconUri("notion"),            localSource: icons.notion,   keywords: ["notion"] },
	{ key: "figma",      label: "Figma",         logoSource: simpleIconUri("figma"),             localSource: icons.figma,    keywords: ["figma"] },
	{ key: "adobe",      label: "Adobe CC",      logoSource: simpleIconUri("adobecreativecloud"), localSource: icons.adobe,   keywords: ["adobe", "creative cloud", "photoshop", "illustrator"] },
	{ key: "canva",      label: "Canva",         logoSource: simpleIconUri("canva"),             localSource: icons.canva,    keywords: ["canva"] },
	{ key: "slack",      label: "Slack",         logoSource: simpleIconUri("slack"),             keywords: ["slack"] },
	{ key: "discord",    label: "Discord",       logoSource: simpleIconUri("discord"),           keywords: ["discord"] },
	{ key: "zoom",       label: "Zoom",          logoSource: simpleIconUri("zoom"),              keywords: ["zoom"] },
	{ key: "linear",     label: "Linear",        logoSource: simpleIconUri("linear"),            keywords: ["linear"] },
	{ key: "vercel",     label: "Vercel",        logoSource: simpleIconUri("vercel"),            keywords: ["vercel"] },
	{ key: "dropbox",    label: "Dropbox",       logoSource: simpleIconUri("dropbox"),           localSource: icons.dropbox,  keywords: ["dropbox"] },
	{ key: "nordvpn",    label: "NordVPN",       logoSource: simpleIconUri("nordvpn"),           keywords: ["nordvpn", "vpn", "nord"] },
	{ key: "1password",  label: "1Password",     logoSource: simpleIconUri("1password"),         keywords: ["1password", "onepassword"] },
	{ key: "duolingo",   label: "Duolingo",      logoSource: simpleIconUri("duolingo"),          keywords: ["duolingo"] },
	{ key: "medium",     label: "Medium",        logoSource: simpleIconUri("medium"),            localSource: icons.medium,   keywords: ["medium", "substack"] },
	{ key: "strava",     label: "Strava",        logoSource: simpleIconUri("strava"),            keywords: ["strava"] },
	{ key: "other",      label: "Other",         logoSource: simpleIconUri("helpdesk"),          localSource: icons.wallet,   keywords: [] },
];
