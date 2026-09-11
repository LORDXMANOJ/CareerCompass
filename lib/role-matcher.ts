import { ROLE_CATALOG } from "@/constants/roles";
import {
  CAREER_INTELLIGENCE_DATA,
  StandardRole,
} from "@/constants/career-intelligence-data";
import { RoleDetails } from "@/types";

export interface RoleMatchResult {
  role: StandardRole;
  roleDetails: RoleDetails;
  confidence: number;
  isBestMatch: boolean;
  matchedChips: string[];
  explanation: string;
}

// ---------------------------------------------------------------------------
// String Normalization & Cleaning Helpers
// ---------------------------------------------------------------------------
export function normalizeQuery(input: string): string {
  let cleaned = input.trim().toLowerCase();

  // Protect special technology names that have dots or hashes
  // like ".net", "c#", "c++"
  if (cleaned.startsWith(".net") || cleaned === ".net" || cleaned.includes(".net core")) {
    cleaned = cleaned.replace(/\s+/g, " ");
    return cleaned;
  }

  // Remove common punctuation except +, #, .
  cleaned = cleaned.replace(/[^\w\s+#.]/g, " ");

  // Normalization mappings for common abbreviations and spaced phrases
  const replacements: [RegExp, string][] = [
    [/\bfront[\s-]end\b/g, "frontend"],
    [/\bback[\s-]end\b/g, "backend"],
    [/\bfull[\s-]stack\b/g, "fullstack"],
    [/\bui[\s\/-]ux\b/g, "ui/ux"],
    [/\bdev[\s-]ops\b/g, "devops"],
    [/\bcyber[\s-]security\b/g, "cybersecurity"],
    [/\bgame[\s-]dev\b/g, "game development"],
    [/\bml\b/g, "machine learning"],
    [/\bai\b/g, "ai"],
    [/\bgen[\s-]ai\b/g, "generative ai"],
    [/\bllm\b/g, "llm"],
    [/\bk8s\b/g, "kubernetes"],
    [/\bcicd\b/g, "ci/cd"],
    [/\bswe\b/g, "software engineer"],
    [/\bsde\b/g, "software engineer"],
    [/\bsde[\s-]?1\b/g, "software engineer"],
    [/\bsde[\s-]?2\b/g, "software engineer"],
    [/\bpenetration[\s-]testing\b/g, "penetration testing"],
    [/\bpentest\b/g, "penetration testing"],
    [/\bpen[\s-]testing\b/g, "penetration testing"],
  ];

  for (const [pattern, repl] of replacements) {
    cleaned = cleaned.replace(pattern, repl);
  }

  return cleaned.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Damerau-Levenshtein Typo Distance Calculation
// ---------------------------------------------------------------------------
function computeLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ---------------------------------------------------------------------------
// Role Details Lookup by Standardized Role Name
// ---------------------------------------------------------------------------
function getRoleDetails(roleName: StandardRole): RoleDetails {
  const found = ROLE_CATALOG.find((r) => r.name === roleName);
  if (found) return found;

  // Fallback
  return ROLE_CATALOG[0];
}

// ---------------------------------------------------------------------------
// Intelligent Role Matcher Core Function
// ---------------------------------------------------------------------------
export function matchCareerRoles(rawQuery: string): RoleMatchResult[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return [];

  const roleScores = new Map<
    StandardRole,
    {
      confidence: number;
      chips: Set<string>;
      explanation: string;
      mappingPriority: number;
    }
  >();

  function recordScore(
    role: StandardRole,
    conf: number,
    chips: string[],
    explanation: string,
    priority: number
  ) {
    const existing = roleScores.get(role);
    if (!existing || conf > existing.confidence) {
      const mergedChips = new Set<string>(chips);
      if (existing) {
        existing.chips.forEach((c) => mergedChips.add(c));
      }
      roleScores.set(role, {
        confidence: conf,
        chips: mergedChips,
        explanation,
        mappingPriority: priority,
      });
    } else if (existing) {
      chips.forEach((c) => existing.chips.add(c));
    }
  }

  // 1. Direct standard role matching (e.g. user typed "Frontend", "Backend Developer", "DevOps")
  ROLE_CATALOG.forEach((role) => {
    const rNameLower = role.name.toLowerCase();
    const cleanRoleName = normalizeQuery(role.name);

    if (query === rNameLower || query === cleanRoleName) {
      recordScore(
        role.name as StandardRole,
        99,
        [role.name, ...role.topSkills.slice(0, 3)],
        `We recommend ${role.name} because your search directly matches this standard career track.`,
        10
      );
      return;
    }

    if (rNameLower.includes(query) || query.includes(rNameLower)) {
      recordScore(
        role.name as StandardRole,
        96,
        [role.name, ...role.topSkills.slice(0, 2)],
        `We recommend ${role.name} based on your interest in ${role.name} career benchmarks.`,
        8
      );
      return;
    }

    // Fuzzy check on role name (e.g. "fronend", "back-end", "gamedeveloper")
    const dist = computeLevenshtein(query, cleanRoleName);
    if (dist <= 2 && cleanRoleName.length > 5) {
      recordScore(
        role.name as StandardRole,
        Math.max(88, 97 - dist * 3),
        [role.name],
        `We recommend ${role.name} (matched closely to your search term).`,
        7
      );
    }
  });

  // 2. Comprehensive Knowledge Dataset Matching
  for (const mapping of CAREER_INTELLIGENCE_DATA) {
    let bestMatchScore = 0;

    for (const kw of mapping.keywords) {
      const normKw = normalizeQuery(kw);

      // Exact match
      if (query === kw || query === normKw) {
        if (mapping.baseConfidence > bestMatchScore) {
          bestMatchScore = mapping.baseConfidence;
        }
        continue;
      }

      // Exact phrase contained in query or query contained in kw
      // Example: User types ".net developer", kw is ".net" -> includes match!
      if (
        (query.length >= 3 && kw.includes(query)) ||
        (kw.length >= 3 && query.includes(kw))
      ) {
        const score = Math.max(85, mapping.baseConfidence - 2);
        if (score > bestMatchScore) {
          bestMatchScore = score;
        }
        continue;
      }

      // Word boundary match inside multi-word query (e.g. "expert in spring boot")
      const queryWords = query.split(/\s+/);
      if (queryWords.some((w) => w === kw || w === normKw)) {
        const score = Math.max(88, mapping.baseConfidence - 1);
        if (score > bestMatchScore) {
          bestMatchScore = score;
        }
        continue;
      }

      // Fuzzy check for typos (e.g. "fronend" -> "frontend", "dockr" -> "docker", "kubernets" -> "kubernetes")
      if (query.length >= 4 && normKw.length >= 4) {
        const maxAllowedDist = query.length <= 5 ? 1 : 2;
        const dist = computeLevenshtein(query, normKw);
        if (dist <= maxAllowedDist) {
          const score = Math.max(85, mapping.baseConfidence - dist * 4);
          if (score > bestMatchScore) {
            bestMatchScore = score;
          }
        }
      }
    }

    if (bestMatchScore > 0) {
      // Record primary role
      recordScore(
        mapping.primaryRole,
        bestMatchScore,
        mapping.matchedChips,
        mapping.explanation,
        9
      );

      // Record secondary roles if present
      if (mapping.secondaryRoles && mapping.secondaryRoles.length > 0) {
        for (const sec of mapping.secondaryRoles) {
          const secondaryScore = Math.round(bestMatchScore * sec.weight);
          recordScore(
            sec.role,
            secondaryScore,
            mapping.matchedChips,
            mapping.explanation,
            5
          );
        }
      }
    }
  }

  // Convert map to sorted array
  const results: RoleMatchResult[] = Array.from(roleScores.entries())
    .map(([roleName, data]) => ({
      role: roleName,
      roleDetails: getRoleDetails(roleName),
      confidence: data.confidence,
      isBestMatch: false,
      matchedChips: Array.from(data.chips).slice(0, 4),
      explanation: data.explanation,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  if (results.length > 0) {
    results[0].isBestMatch = true;
  }

  return results;
}
