import { VERIFIED_COMPANIES, VerifiedCompany } from "@/constants/companies-data";
import { SkillsSelection } from "@/types";

export interface CompanyMatchResult {
  company: VerifiedCompany;
  matchScore: number;
  isDirectMatch: boolean;
  matchedTrigger: string;
  triggerType: "name" | "typo" | "alias" | "ecosystem" | "subsidiary" | "natural_language" | "technology";
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  whyPoints: string[];
}

// ---------------------------------------------------------------------------
// String Normalization & Cleaning Helpers
// ---------------------------------------------------------------------------
function cleanText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s+#.]/g, " ").replace(/\s+/g, " ");
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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ---------------------------------------------------------------------------
// Comprehensive Ecosystem & Subsidiary Knowledge Base
// ---------------------------------------------------------------------------
interface EcosystemMapping {
  triggers: string[];
  companyId: string;
  recognizedEntity: string;
  relationType: "ecosystem" | "subsidiary" | "technology";
  explanation: string;
}

const ECOSYSTEM_MAPPINGS: EcosystemMapping[] = [
  // MICROSOFT
  {
    triggers: ["vs code", "vscode", "visual studio code", "visual studio"],
    companyId: "microsoft",
    recognizedEntity: "VS Code",
    relationType: "ecosystem",
    explanation: "VS Code is developed and maintained by Microsoft. Engineers worldwide rely on it for daily development.",
  },
  {
    triggers: ["copilot", "github copilot", "msft copilot", "microsoft copilot"],
    companyId: "microsoft",
    recognizedEntity: "GitHub Copilot",
    relationType: "ecosystem",
    explanation: "Copilot is Microsoft's flagship AI pair programming tool developed with OpenAI.",
  },
  {
    triggers: ["github"],
    companyId: "microsoft",
    recognizedEntity: "GitHub",
    relationType: "subsidiary",
    explanation: "GitHub is a subsidiary of Microsoft. CareerCompass benchmarks you against Microsoft's unified engineering hiring standards.",
  },
  {
    triggers: ["azure devops", "azure", "microsoft azure"],
    companyId: "microsoft",
    recognizedEntity: "Microsoft Azure",
    relationType: "technology",
    explanation: "Azure is Microsoft's enterprise cloud infrastructure platform powering millions of backend services.",
  },
  {
    triggers: ["teams", "microsoft teams"],
    companyId: "microsoft",
    recognizedEntity: "Microsoft Teams",
    relationType: "ecosystem",
    explanation: "Teams is Microsoft's flagship collaboration product handling hundreds of millions of daily active users.",
  },
  {
    triggers: [".net", "dotnet", "c#", "csharp", "asp.net"],
    companyId: "microsoft",
    recognizedEntity: ".NET / C#",
    relationType: "technology",
    explanation: ".NET and C# form the foundational backend and enterprise language ecosystem engineered by Microsoft.",
  },
  {
    triggers: ["typescript"],
    companyId: "microsoft",
    recognizedEntity: "TypeScript",
    relationType: "technology",
    explanation: "TypeScript was created and is actively maintained by Microsoft for enterprise-scale JavaScript development.",
  },
  {
    triggers: ["linkedin"],
    companyId: "microsoft",
    recognizedEntity: "LinkedIn",
    relationType: "subsidiary",
    explanation: "LinkedIn is an operating subsidiary of Microsoft with world-class distributed systems infrastructure.",
  },
  {
    triggers: ["xbox"],
    companyId: "microsoft",
    recognizedEntity: "Xbox Gaming",
    relationType: "ecosystem",
    explanation: "Xbox is Microsoft's global gaming brand delivering high-scale multiplayer cloud architectures.",
  },

  // GOOGLE
  {
    triggers: ["deepmind", "google deepmind"],
    companyId: "google",
    recognizedEntity: "Google DeepMind",
    relationType: "subsidiary",
    explanation: "DeepMind is Google's world-leading AI research laboratory creating Gemini, AlphaFold, and frontier models.",
  },
  {
    triggers: ["youtube"],
    companyId: "google",
    recognizedEntity: "YouTube",
    relationType: "subsidiary",
    explanation: "YouTube is an operating subsidiary of Google handling exabytes of global video streaming and recommendations.",
  },
  {
    triggers: ["flutter"],
    companyId: "google",
    recognizedEntity: "Flutter",
    relationType: "technology",
    explanation: "Flutter is Google's open-source multiplatform UI framework for Android, iOS, and web.",
  },
  {
    triggers: ["firebase"],
    companyId: "google",
    recognizedEntity: "Firebase",
    relationType: "ecosystem",
    explanation: "Firebase is Google's app development platform providing real-time NoSQL databases, auth, and cloud functions.",
  },
  {
    triggers: ["android"],
    companyId: "google",
    recognizedEntity: "Android OS",
    relationType: "ecosystem",
    explanation: "Android is Google's mobile operating system powering billions of devices globally.",
  },
  {
    triggers: ["tensorflow", "keras"],
    companyId: "google",
    recognizedEntity: "TensorFlow",
    relationType: "technology",
    explanation: "TensorFlow is Google's foundational open-source machine learning and deep learning framework.",
  },
  {
    triggers: ["gemini", "google gemini"],
    companyId: "google",
    recognizedEntity: "Google Gemini",
    relationType: "ecosystem",
    explanation: "Gemini is Google's premier multimodal foundation AI model series.",
  },
  {
    triggers: ["chrome", "chromium"],
    companyId: "google",
    recognizedEntity: "Google Chrome",
    relationType: "ecosystem",
    explanation: "Google Chrome and the Chromium engine define modern web standards and V8 JavaScript execution.",
  },
  {
    triggers: ["angular"],
    companyId: "google",
    recognizedEntity: "Angular",
    relationType: "technology",
    explanation: "Angular is Google's enterprise TypeScript web application framework.",
  },
  {
    triggers: ["go", "golang"],
    companyId: "google",
    recognizedEntity: "Go (Golang)",
    relationType: "technology",
    explanation: "Go was engineered at Google to power high-scale concurrent network and distributed cloud systems.",
  },
  {
    triggers: ["google cloud", "gcp"],
    companyId: "google",
    recognizedEntity: "Google Cloud Platform",
    relationType: "technology",
    explanation: "Google Cloud (GCP) delivers managed Kubernetes (GKE), BigQuery, and global enterprise infrastructure.",
  },
  {
    triggers: ["maps api", "google maps"],
    companyId: "google",
    recognizedEntity: "Google Maps Platform",
    relationType: "ecosystem",
    explanation: "Google Maps provides planetary-scale geospatial routing and location APIs.",
  },
  {
    triggers: ["kubernetes", "k8s"],
    companyId: "google",
    recognizedEntity: "Kubernetes (Original Creator)",
    relationType: "technology",
    explanation: "Kubernetes was originally engineered at Google based on internal Borg cluster architecture.",
  },

  // META
  {
    triggers: ["react", "react.js", "react native"],
    companyId: "meta",
    recognizedEntity: "React",
    relationType: "technology",
    explanation: "React was created and open-sourced by Meta and is the world's most widely adopted client UI framework.",
  },
  {
    triggers: ["pytorch"],
    companyId: "meta",
    recognizedEntity: "PyTorch",
    relationType: "technology",
    explanation: "PyTorch was developed by Meta AI Research and has become the industry standard framework for deep learning and LLMs.",
  },
  {
    triggers: ["whatsapp"],
    companyId: "meta",
    recognizedEntity: "WhatsApp",
    relationType: "subsidiary",
    explanation: "WhatsApp is a Meta subsidiary running Erlang-based high-concurrency messaging for 2+ billion people.",
  },
  {
    triggers: ["instagram"],
    companyId: "meta",
    recognizedEntity: "Instagram",
    relationType: "subsidiary",
    explanation: "Instagram is a Meta subsidiary powering global photo/video delivery and AI recommendation algorithms.",
  },
  {
    triggers: ["threads"],
    companyId: "meta",
    recognizedEntity: "Threads",
    relationType: "ecosystem",
    explanation: "Threads is Meta's fast-growing conversational network built on scalable distributed architecture.",
  },
  {
    triggers: ["llama", "llama 3", "llama 2"],
    companyId: "meta",
    recognizedEntity: "Llama Open Weights AI",
    relationType: "ecosystem",
    explanation: "Llama is Meta's family of industry-defining open-weights foundation large language models.",
  },
  {
    triggers: ["oculus", "meta quest"],
    companyId: "meta",
    recognizedEntity: "Oculus / Meta Quest",
    relationType: "subsidiary",
    explanation: "Meta Quest is Meta's flagship spatial computing and virtual reality hardware platform.",
  },
  {
    triggers: ["graphql"],
    companyId: "meta",
    recognizedEntity: "GraphQL",
    relationType: "technology",
    explanation: "GraphQL was created and open-sourced by Meta to solve complex client-server data fetching at scale.",
  },

  // AMAZON
  {
    triggers: ["aws", "amazon web services", "s3", "ec2", "lambda"],
    companyId: "amazon",
    recognizedEntity: "Amazon Web Services (AWS)",
    relationType: "technology",
    explanation: "AWS is Amazon's market-leading cloud platform providing compute, storage, and serverless backends.",
  },
  {
    triggers: ["prime video", "amazon prime"],
    companyId: "amazon",
    recognizedEntity: "Prime Video",
    relationType: "ecosystem",
    explanation: "Prime Video is Amazon's global entertainment streaming infrastructure.",
  },
  {
    triggers: ["alexa", "echo"],
    companyId: "amazon",
    recognizedEntity: "Amazon Alexa",
    relationType: "ecosystem",
    explanation: "Alexa is Amazon's voice AI assistant and IoT ecosystem.",
  },
  {
    triggers: ["audible"],
    companyId: "amazon",
    recognizedEntity: "Audible",
    relationType: "subsidiary",
    explanation: "Audible is an operating subsidiary of Amazon delivering audiobooks and spoken-word entertainment.",
  },
  {
    triggers: ["twitch"],
    companyId: "amazon",
    recognizedEntity: "Twitch",
    relationType: "subsidiary",
    explanation: "Twitch is an Amazon subsidiary delivering live interactive video streaming for millions of concurrent viewers.",
  },

  // APPLE
  {
    triggers: ["swift", "swiftui"],
    companyId: "apple",
    recognizedEntity: "Swift & SwiftUI",
    relationType: "technology",
    explanation: "Swift and SwiftUI are Apple's official programming languages and declarative frameworks for Apple platforms.",
  },
  {
    triggers: ["xcode"],
    companyId: "apple",
    recognizedEntity: "Xcode IDE",
    relationType: "ecosystem",
    explanation: "Xcode is Apple's integrated development suite for crafting iOS, macOS, and visionOS applications.",
  },
  {
    triggers: ["vision pro", "visionos"],
    companyId: "apple",
    recognizedEntity: "Apple Vision Pro",
    relationType: "ecosystem",
    explanation: "Vision Pro is Apple's spatial computing platform running ultra-low latency visionOS.",
  },
  {
    triggers: ["ios", "macos", "watchos", "ipados"],
    companyId: "apple",
    recognizedEntity: "Apple Operating Systems",
    relationType: "ecosystem",
    explanation: "iOS and macOS are Apple's proprietary UNIX-based client operating system architectures.",
  },
  {
    triggers: ["metal"],
    companyId: "apple",
    recognizedEntity: "Apple Metal Graphics API",
    relationType: "technology",
    explanation: "Metal provides hardware-accelerated 3D graphics and compute on Apple Silicon.",
  },

  // NVIDIA
  {
    triggers: ["cuda"],
    companyId: "nvidia",
    recognizedEntity: "NVIDIA CUDA",
    relationType: "technology",
    explanation: "CUDA is NVIDIA's parallel computing platform and programming model that powers the global AI boom.",
  },
  {
    triggers: ["geforce", "rtx", "omniverse", "tensorrt"],
    companyId: "nvidia",
    recognizedEntity: "NVIDIA Ecosystem",
    relationType: "ecosystem",
    explanation: "NVIDIA RTX and TensorRT provide GPU acceleration for real-time ray tracing and deep learning inference.",
  },

  // OPENAI
  {
    triggers: ["chatgpt", "gpt-4", "gpt", "dall-e", "sora", "whisper"],
    companyId: "openai",
    recognizedEntity: "OpenAI Foundation Models",
    relationType: "ecosystem",
    explanation: "ChatGPT and GPT-4 are OpenAI's frontier AI models driving generative intelligence globally.",
  },

  // GAMING
  {
    triggers: ["unreal engine", "unreal", "ue5", "fortnite"],
    companyId: "epic-games",
    recognizedEntity: "Unreal Engine 5",
    relationType: "technology",
    explanation: "Unreal Engine 5 is Epic Games' world-leading 3D game and virtual production engine.",
  },
  {
    triggers: ["valorant", "league of legends", "lol"],
    companyId: "riot-games",
    recognizedEntity: "Riot Competitive Gaming",
    relationType: "ecosystem",
    explanation: "Valorant and League of Legends are flagship competitive titles developed by Riot Games.",
  },

  // SAAS & DEVELOPER TOOLS
  {
    triggers: ["jira", "confluence", "bitbucket", "trello"],
    companyId: "atlassian",
    recognizedEntity: "Atlassian Collaboration Suite",
    relationType: "ecosystem",
    explanation: "Jira and Confluence are Atlassian's global standard project and documentation platforms.",
  },
  {
    triggers: ["newman", "postman"],
    companyId: "postman",
    recognizedEntity: "Postman API Platform",
    relationType: "ecosystem",
    explanation: "Postman is the world's leading collaborative API development and testing platform.",
  },
  {
    triggers: ["freshdesk", "freshservice"],
    companyId: "freshworks",
    recognizedEntity: "Freshworks SaaS",
    relationType: "subsidiary",
    explanation: "Freshdesk and Freshservice are flagship customer and IT service applications from Freshworks.",
  },
  {
    triggers: ["manageengine", "zoho crm", "zoho books"],
    companyId: "zoho",
    recognizedEntity: "Zoho Enterprise Cloud",
    relationType: "ecosystem",
    explanation: "Zoho CRM and ManageEngine power enterprise operations for millions of global organizations.",
  },
  {
    triggers: ["cortex", "cortex xdr", "prisma cloud"],
    companyId: "palo-alto-networks",
    recognizedEntity: "Palo Alto Prisma & Cortex",
    relationType: "ecosystem",
    explanation: "Prisma Cloud and Cortex XDR provide autonomous enterprise threat detection and cloud security.",
  },
  {
    triggers: ["falcon", "falcon sensor"],
    companyId: "crowdstrike",
    recognizedEntity: "CrowdStrike Falcon",
    relationType: "ecosystem",
    explanation: "Falcon is CrowdStrike's cloud-native agent processing trillions of endpoint events daily.",
  },
];

// ---------------------------------------------------------------------------
// Natural Language Search Intents
// ---------------------------------------------------------------------------
const NATURAL_LANGUAGE_INTENTS: { patterns: RegExp[]; companyIds: string[]; topic: string }[] = [
  {
    patterns: [/\b(cloud|cloud computing|serverless|infrastructure|devops)\b/i],
    companyIds: ["amazon", "microsoft", "google"],
    topic: "Cloud Infrastructure & DevOps",
  },
  {
    patterns: [/\b(gaming|games|game dev|gameplay|unreal|3d)\b/i],
    companyIds: ["epic-games", "riot-games", "nvidia"],
    topic: "Game Development & Graphics",
  },
  {
    patterns: [/\b(ai|artificial intelligence|llm|llms|generative ai|genai|gpt|machine learning)\b/i],
    companyIds: ["openai", "anthropic", "google", "nvidia", "meta"],
    topic: "Frontier AI & LLM Research",
  },
  {
    patterns: [/\b(fintech|payments|banking|financial)\b/i],
    companyIds: ["stripe", "razorpay"],
    topic: "FinTech & Payment Infrastructure",
  },
  {
    patterns: [/\b(security|cyber|cybersecurity|ethical hacking|penetration)\b/i],
    companyIds: ["palo-alto-networks", "crowdstrike"],
    topic: "Cybersecurity & Cloud Defense",
  },
  {
    patterns: [/\b(india|indian startups|indian unicorn|bengaluru|chennai)\b/i],
    companyIds: ["zoho", "razorpay", "freshworks", "postman"],
    topic: "Indian Product Unicorns",
  },
  {
    patterns: [/\b(social|social media|metaverse|messaging)\b/i],
    companyIds: ["meta"],
    topic: "Social Networks & Connected Communities",
  },
  {
    patterns: [/\b(apple|ios|macos|iphone|swift)\b/i],
    companyIds: ["apple"],
    topic: "Apple Ecosystem",
  },
];

// ---------------------------------------------------------------------------
// Deterministic Match Scoring Engine
// ---------------------------------------------------------------------------
export function calculateDeterministicCompanyScore(
  company: VerifiedCompany,
  targetRole?: string,
  userSkills?: SkillsSelection
): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  whyPoints: string[];
} {
  let score = 65; // baseline
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const whyPoints: string[] = [];

  const candidateSkills = [
    ...(userSkills?.languages || []),
    ...(userSkills?.frameworks || []),
    ...(userSkills?.databases || []),
    ...(userSkills?.aiTools || []),
  ].map((s) => s.toLowerCase());

  // 1. Role Alignment (+15 to +20)
  if (targetRole) {
    const isTargetRole = company.typicalRoles.some(
      (r) => r.toLowerCase() === targetRole.toLowerCase()
    );
    if (isTargetRole) {
      score += 15;
      whyPoints.push(`Since you selected ${targetRole}, ${company.name} is a high-volume hirer for this track.`);
    } else {
      score += 5;
    }
  }

  // 2. Technology & Skills Overlap (+15 max)
  company.primaryTechnologies.forEach((tech) => {
    const techLower = tech.toLowerCase();
    const hasSkill = candidateSkills.some(
      (cs) => cs.includes(techLower) || techLower.includes(cs)
    );
    if (hasSkill) {
      matchedSkills.push(tech);
    } else {
      missingSkills.push(tech);
    }
  });

  const overlapRatio = company.primaryTechnologies.length > 0
    ? matchedSkills.length / company.primaryTechnologies.length
    : 0;

  score += Math.round(overlapRatio * 15);

  if (matchedSkills.length > 0) {
    whyPoints.push(`Your tech stack overlaps with ${company.name}'s ecosystem: ${matchedSkills.slice(0, 3).join(", ")}.`);
  }

  // 3. Compensation & Tier Caliber
  if (company.category === "Big Tech / FAANG+" || company.category === "AI Leaders & Research") {
    score += 4;
    whyPoints.push(`${company.name} offers top-of-market compensation and elite engineering credentials.`);
  }

  // Cap between 68 and 98 for realistic SaaS experience
  score = Math.min(98, Math.max(68, score));

  // Default points if sparse
  if (whyPoints.length === 0) {
    whyPoints.push(`${company.name} is a benchmark target for top software engineering cohorts.`);
  }

  return {
    score,
    matchedSkills: matchedSkills.slice(0, 5),
    missingSkills: missingSkills.slice(0, 3),
    whyPoints,
  };
}

// ---------------------------------------------------------------------------
// Role-Based Company Prioritization
// ---------------------------------------------------------------------------
export function getRoleRecommendedCompanies(
  targetRole?: string,
  userSkills?: SkillsSelection
): VerifiedCompany[] {
  if (!targetRole) return VERIFIED_COMPANIES;

  const roleLower = targetRole.toLowerCase();

  return [...VERIFIED_COMPANIES].sort((a, b) => {
    const aMatch = a.typicalRoles.some((r) => r.toLowerCase() === roleLower);
    const bMatch = b.typicalRoles.some((r) => r.toLowerCase() === roleLower);

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;

    // Secondary sort by deterministic score
    const aScore = calculateDeterministicCompanyScore(a, targetRole, userSkills).score;
    const bScore = calculateDeterministicCompanyScore(b, targetRole, userSkills).score;
    return bScore - aScore;
  });
}

// ---------------------------------------------------------------------------
// Main Company Search & Intelligence Engine
// ---------------------------------------------------------------------------
export function matchCompanies(
  rawQuery: string,
  targetRole?: string,
  userSkills?: SkillsSelection
): CompanyMatchResult[] {
  const query = cleanText(rawQuery);
  if (!query) return [];

  const resultsMap = new Map<string, CompanyMatchResult>();

  function addResult(
    company: VerifiedCompany,
    trigger: string,
    type: CompanyMatchResult["triggerType"],
    explanation: string,
    bonusScore = 0
  ) {
    if (resultsMap.has(company.id)) return;

    const { score, matchedSkills, missingSkills, whyPoints } =
      calculateDeterministicCompanyScore(company, targetRole, userSkills);

    resultsMap.set(company.id, {
      company,
      matchScore: Math.min(99, score + bonusScore),
      isDirectMatch: type === "name" || type === "subsidiary",
      matchedTrigger: trigger,
      triggerType: type,
      explanation,
      matchedSkills,
      missingSkills,
      whyPoints,
    });
  }

  // 1. Check Ecosystem & Subsidiary Knowledge Base
  for (const item of ECOSYSTEM_MAPPINGS) {
    const isMatch = item.triggers.some(
      (t) => t === query || query.includes(t) || t.includes(query)
    );

    if (isMatch) {
      const comp = VERIFIED_COMPANIES.find((c) => c.id === item.companyId);
      if (comp) {
        addResult(comp, item.recognizedEntity, item.relationType, item.explanation, 6);
      }
    }
  }

  // 2. Direct Name & Alias Match
  for (const company of VERIFIED_COMPANIES) {
    const compNameLower = company.name.toLowerCase();

    if (compNameLower === query || query === company.id) {
      addResult(
        company,
        company.name,
        "name",
        `Direct match for ${company.name} verified profile in our company intelligence directory.`,
        8
      );
      continue;
    }

    if (compNameLower.includes(query) || query.includes(compNameLower)) {
      addResult(
        company,
        company.name,
        "name",
        `Matched ${company.name} based on your search query.`,
        5
      );
      continue;
    }

    // Alias matches
    for (const alias of company.aliases) {
      const aliasLower = alias.toLowerCase();
      if (aliasLower === query || query.includes(aliasLower) || aliasLower.includes(query)) {
        addResult(
          company,
          alias,
          "alias",
          `Matched via alias "${alias}". ${company.name} is the verified parent organization.`,
          4
        );
        break;
      }
    }
  }

  // 3. Typo Tolerance with Levenshtein Distance
  if (resultsMap.size === 0 && query.length >= 4) {
    for (const company of VERIFIED_COMPANIES) {
      // Check company name typo
      const dist = computeLevenshtein(query, company.name.toLowerCase());
      const maxAllowed = query.length <= 5 ? 1 : 2;

      if (dist <= maxAllowed) {
        addResult(
          company,
          company.name,
          "typo",
          `Auto-corrected typo "${rawQuery}" → ${company.name} verified profile.`,
          3
        );
        continue;
      }

      // Check common misspellings list
      const matchedMisspelling = company.misspellings.find((m) =>
        m.toLowerCase() === query || computeLevenshtein(query, m.toLowerCase()) <= 1
      );
      if (matchedMisspelling) {
        addResult(
          company,
          company.name,
          "typo",
          `Identified common misspelling "${rawQuery}" → resolved to ${company.name}.`,
          3
        );
      }
    }
  }

  // 4. Natural Language Intent Recognition
  if (resultsMap.size === 0) {
    for (const intent of NATURAL_LANGUAGE_INTENTS) {
      const isIntentMatch = intent.patterns.some((pattern) => pattern.test(query));
      if (isIntentMatch) {
        for (const cId of intent.companyIds) {
          const comp = VERIFIED_COMPANIES.find((c) => c.id === cId);
          if (comp) {
            addResult(
              comp,
              intent.topic,
              "natural_language",
              `Matched based on your interest in ${intent.topic}. ${comp.name} is an industry leader in this sector.`,
              2
            );
          }
        }
        break;
      }
    }
  }

  // 5. Technology Stack Mapping
  if (resultsMap.size === 0) {
    for (const company of VERIFIED_COMPANIES) {
      const matchedTech = company.primaryTechnologies.find(
        (t) => t.toLowerCase() === query || query.includes(t.toLowerCase())
      );
      if (matchedTech) {
        addResult(
          company,
          matchedTech,
          "technology",
          `${company.name} heavily utilizes and recruits for ${matchedTech} in production.`,
          2
        );
      }
    }
  }

  return Array.from(resultsMap.values()).sort((a, b) => b.matchScore - a.matchScore);
}
