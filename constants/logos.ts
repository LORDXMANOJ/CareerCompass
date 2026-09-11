/**
 * Local official company logo assets.
 *
 * Every logo is stored locally under `/public/logos/` — nothing is hotlinked.
 * Assets are official SVG vectors (Wikimedia Commons / Simple Icons CC0 brand marks)
 * with the brand's original colors preserved (dark-theme variants used where the
 * official mark is inherently dark, e.g. Apple, Uber).
 *
 * Whenever a company has no logo asset in this map, consumers SHOULD fall back to
 * the dataset placeholder icon (`VerifiedCompany.logo`).
 */
export const LOGO_ASSETS: Readonly<Record<string, string>> = {
  amazon: "/logos/amazon.svg",
  anthropic: "/logos/anthropic.svg",
  apple: "/logos/apple.svg",
  atlassian: "/logos/atlassian.svg",
  crowdstrike: "/logos/crowdstrike.svg",
  "epic-games": "/logos/epic-games.svg",
  freshworks: "/logos/freshworks.svg",
  google: "/logos/google.svg",
  meta: "/logos/meta.svg",
  microsoft: "/logos/microsoft.svg",
  netflix: "/logos/netflix.svg",
  nvidia: "/logos/nvidia.svg",
  openai: "/logos/openai.svg",
  "palo-alto-networks": "/logos/palo-alto-networks.svg",
  postman: "/logos/postman.svg",
  razorpay: "/logos/razorpay.svg",
  "riot-games": "/logos/riot-games.svg",
  stripe: "/logos/stripe.svg",
  uber: "/logos/uber.svg",
  zoho: "/logos/zoho.svg",
};

/** Look up the local logo path for a company id, or `undefined` (use placeholder). */
export function getCompanyLogoPath(companyId: string): string | undefined {
  return LOGO_ASSETS[companyId];
}