const fallbackSiteUrl = "https://vebaev.github.io/CV/";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(
  configuredSiteUrl || fallbackSiteUrl,
).toString();

export const PROFILE_IMAGE_URL = new URL(
  "Vesselin-Baev-Tokyo-2026.jpg",
  SITE_URL,
).toString();

export const SOCIAL_IMAGE_URL = new URL("og.png", SITE_URL).toString();
