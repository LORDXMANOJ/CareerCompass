"use client";

/**
 * Official Company Logo renderer.
 *
 * Renders the locally-stored official logo for a company (see `constants/logos.ts`).
 * - Preserves original colors & aspect ratio (SVG, `object-contain`)
 * - Fixed visual size per context (`size` prop), centered in its badge
 * - Never stretches / overflows / blurs (crisp SVG)
 * - Lazy-loaded and non-draggable
 *
 * Falls back to the dataset placeholder emoji when no local logo asset exists,
 * so a missing asset never breaks the UI.
 */

import { getCompanyLogoPath } from "@/constants/logos";

export type CompanyLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CompanyLogoProps {
  /** Company whose logo should be rendered. */
  company: { id: string; name: string; logo: string };
  /** Visual size of the logo box. Defaults to `md` (24px). */
  size?: CompanyLogoSize;
  /** Additional classes merged onto the <img> element. */
  className?: string;
}

const SIZE_CLASSES: Record<CompanyLogoSize, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

export function CompanyLogo({ company, size = "md", className }: CompanyLogoProps) {
  const src = getCompanyLogoPath(company.id);

  if (!src) {
    // Fallback: clean monogram badge for companies without a dedicated logo asset
    return (
      <span className="flex items-center justify-center font-bold text-xs font-mono text-slate-300">
        {company.name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // SVGs are served unoptimized directly from /public — next/image does not
    // optimize SVG, so a plain (lazy) img element is the appropriate choice here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${company.name} logo`}
      width={24}
      height={24}
      draggable={false}
      loading="lazy"
      decoding="async"
      aria-hidden="false"
      className={`${SIZE_CLASSES[size]} object-contain object-center shrink-0 align-middle select-none ${
        className ?? ""
      }`}
    />
  );
}