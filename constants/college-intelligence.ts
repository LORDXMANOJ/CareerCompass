/**
 * College Intelligence dataset used by the Education & Academic Intelligence step.
 *
 * Small, static list of recognized institutions. When a student's college is not
 * found here we gracefully fall back to "Institution not recognized" and still
 * build a personalized roadmap.
 */

export interface VerifiedInstitutionStats {
  avgPackage?: string;
  highestPackage?: string;
  topRecruiters?: string[];
  reportYear?: string;
  source?: string;
}

export interface InstitutionProfile {
  name: string;
  keywords: string[];
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  naac: string | null;
  campusPlacements: boolean;
  verifiedStats?: VerifiedInstitutionStats | null;
}

export const INSTITUTION_PROFILES: InstitutionProfile[] = [
  // ----- Indian Institutes of Technology -----
  {
    name: "IIT Madras",
    keywords: ["iit madras", "iitm", "indian institute of technology madras"],
    tier: "Tier 1",
    naac: "NAAC A++",
    campusPlacements: true,
    verifiedStats: {
      avgPackage: "₹21.48 LPA",
      highestPackage: "₹1.31 CPA",
      topRecruiters: ["Microsoft", "Google", "Goldman Sachs", "Qualcomm", "Texas Instruments"],
      reportYear: "2023-24",
      source: "Official Placement Report / NIRF",
    },
  },
  {
    name: "IIT Bombay",
    keywords: ["iit bombay", "iitb", "indian institute of technology bombay"],
    tier: "Tier 1",
    naac: "NAAC A++",
    campusPlacements: true,
    verifiedStats: {
      avgPackage: "₹23.50 LPA",
      highestPackage: "₹1.68 CPA",
      topRecruiters: ["Uber", "Google", "Microsoft", "Jane Street", "Rubrik"],
      reportYear: "2023-24",
      source: "Official Placement Report / NIRF",
    },
  },
  {
    name: "IIT Delhi",
    keywords: ["iit delhi", "iitd", "indian institute of technology delhi"],
    tier: "Tier 1",
    naac: "NAAC A++",
    campusPlacements: true,
    verifiedStats: {
      avgPackage: "₹22.70 LPA",
      highestPackage: "₹2.00 CPA",
      topRecruiters: ["Microsoft", "Google", "Apple", "Oracle", "Bain & Company"],
      reportYear: "2023-24",
      source: "Official Placement Report / NIRF",
    },
  },
  { name: "IIT Kanpur", keywords: ["iit kanpur", "iitk", "indian institute of technology kanpur"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Kharagpur", keywords: ["iit kharagpur", "iit kgp", "indian institute of technology kharagpur"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Roorkee", keywords: ["iit roorkee", "indian institute of technology roorkee"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Guwahati", keywords: ["iit guwahati", "iitg", "indian institute of technology guwahati"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIT Hyderabad", keywords: ["iit hyderabad", "iith", "indian institute of technology hyderabad"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT (BHU) Varanasi", keywords: ["iit bhu", "iit varanasi", "bhu iit"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT (ISM) Dhanbad", keywords: ["iit dhanbad", "iit ism", "ism dhanbad"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Gandhinagar", keywords: ["iit gandhinagar"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Indore", keywords: ["iit indore"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Ropar", keywords: ["iit ropar"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "IIT Jodhpur", keywords: ["iit jodhpur"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Patna", keywords: ["iit patna"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIT Mandi", keywords: ["iit mandi"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIT Bhubaneswar", keywords: ["iit bhubaneswar"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIT Tirupati", keywords: ["iit tirupati"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIT Palakkad", keywords: ["iit palakkad"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIT (Indian Institute of Technology)", keywords: ["indian institute of technology", "iit "], tier: "Tier 1", naac: null, campusPlacements: true },

  // ----- National Institutes of Technology -----
  {
    name: "NIT Trichy",
    keywords: ["nit trichy", "national institute of technology trichy"],
    tier: "Tier 1",
    naac: "NAAC A++",
    campusPlacements: true,
    verifiedStats: {
      avgPackage: "₹15.70 LPA",
      highestPackage: "₹52.89 LPA",
      topRecruiters: ["Microsoft", "Amazon", "Oracle", "Goldman Sachs", "Morgan Stanley"],
      reportYear: "2023-24",
      source: "Official Placement Cell Report",
    },
  },
  { name: "NIT Surathkal", keywords: ["nit surathkal", "nitk"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "NIT Warangal", keywords: ["nit warangal", "nitw"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "NIT Calicut", keywords: ["nit calicut", "nitc"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "NIT Rourkela", keywords: ["nit rourkela", "nitr"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "NIT Durgapur", keywords: ["nit durgapur"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "MNNIT Allahabad", keywords: ["mnnit", "nit allahabad"], tier: "Tier 2", naac: "NAAC A+", campusPlacements: true },
  { name: "NIT Kurukshetra", keywords: ["nit kurukshetra"], tier: "Tier 2", naac: "NAAC A+", campusPlacements: true },
  { name: "NIT Jaipur", keywords: ["nit jaipur", "nit jaypee"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "VNIT Nagpur", keywords: ["nit nagpur", "vnit"], tier: "Tier 2", naac: "NAAC A+", campusPlacements: true },
  { name: "NIT Patna", keywords: ["nit patna"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Delhi", keywords: ["nit delhi"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Hamirpur", keywords: ["nit hamirpur"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Srinagar", keywords: ["nit srinagar"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Raipur", keywords: ["nit raipur"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Silchar", keywords: ["nit silchar"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "NIT Agartala", keywords: ["nit agartala"], tier: "Tier 3", naac: "NAAC A", campusPlacements: true },
  { name: "NIT (National Institute of Technology)", keywords: ["national institute of technology", "nit "], tier: "Tier 2", naac: null, campusPlacements: true },
  { name: "IIIT Hyderabad", keywords: ["iiit hyderabad", "iiith"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIIT Delhi", keywords: ["iiit delhi", "iiitd"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "IIIT-B Bangalore", keywords: ["iiit bangalore", "iiit-b", "iiitb"], tier: "Tier 1", naac: null, campusPlacements: true },
  { name: "IIIT Allahabad", keywords: ["iiit allahabad", "iiita"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIIT Gwalior", keywords: ["iiit gwalior", "abv-iiitm"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIIT Sri City", keywords: ["iiit sri city", "iiits"], tier: "Tier 1", naac: "NAAC A", campusPlacements: true },
  { name: "IIIT Bhubaneswar", keywords: ["iiit bhubaneswar"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "IIIT Jabalpur", keywords: ["iiit jabalpur", "iiitdmj"], tier: "Tier 2", naac: "NAAC A", campusPlacements: true },
  { name: "IIIT (Indian Institute of Information Technology)", keywords: ["indian institute of information technology", "iiit"], tier: "Tier 2", naac: null, campusPlacements: true },

  // ----- BITS / Private Deemed Universities -----
  {
    name: "BITS Pilani",
    keywords: ["bits pilani", "birla institute of technology and science"],
    tier: "Tier 1",
    naac: "NAAC A+",
    campusPlacements: true,
    verifiedStats: {
      avgPackage: "₹20.74 LPA",
      highestPackage: "₹60.75 LPA",
      topRecruiters: ["Google", "Microsoft", "Amazon", "Cisco", "Qualcomm"],
      reportYear: "2023-24",
      source: "Official BITS Placement Statistics",
    },
  },
  { name: "BITS Hyderabad", keywords: ["bits hyderabad"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "BITS Goa", keywords: ["bits goa"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "VIT Vellore", keywords: ["vit vellore", "vellore institute of technology"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "VIT Chennai", keywords: ["vit chennai"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "VIT-AP", keywords: ["vit ap", "vit amaravati"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "SRM Institute of Science and Technology", keywords: ["srm institute", "srm university", "srm ist"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "Manipal Institute of Technology", keywords: ["manipal institute of technology", "mit manipal"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "Thapar Institute of Engineering & Technology", keywords: ["thapar"], tier: "Tier 2", naac: "NAAC A+", campusPlacements: true },
  { name: "Amrita Vishwa Vidyapeetham", keywords: ["amrita"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "BIT Mesra", keywords: ["bit mesra", "birla institute of technology mesra"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "PSG College of Technology", keywords: ["psg college of technology", "psg tech"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "Anna University", keywords: ["anna university"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "College of Engineering, Guindy", keywords: ["college of engineering guindy", "ceg"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "College of Engineering, Pune (COEP)", keywords: ["college of engineering pune", "coep"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "Veermata Jijabai Technological Institute (VJTI)", keywords: ["vjti"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "Delhi Technological University (DTU)", keywords: ["delhi technological university", "dtu"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "NSUT Delhi", keywords: ["nsut", "netaji subhas university of technology"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "PES University", keywords: ["pes university", "pesit"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "RV College of Engineering", keywords: ["rv college of engineering"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "BMS College of Engineering", keywords: ["bms college of engineering"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "DA-IICT Gandhinagar", keywords: ["daiict"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "LNM Institute of Information Technology", keywords: ["lnmiit"], tier: "Tier 1", naac: "NAAC A+", campusPlacements: true },
  { name: "Jadavpur University", keywords: ["jadavpur university"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "Institute of Chemical Technology (ICT Mumbai)", keywords: ["ict mumbai", "institute of chemical technology", "udct"], tier: "Tier 1", naac: "NAAC A++", campusPlacements: true },
  { name: "Nirma University", keywords: ["nirma university"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "Symbiosis Institute of Technology", keywords: ["symbiosis institute of technology", "sit pune"], tier: "Tier 2", naac: "NAAC A+", campusPlacements: true },
  { name: "Savitribai Phule Pune University", keywords: ["savitribai phule", "pune university", "sppu"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "University of Mumbai", keywords: ["university of mumbai"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "KIIT Bhubaneswar", keywords: ["kiit", "kalinga institute of industrial technology"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
  { name: "Lovely Professional University", keywords: ["lovely professional university", "lpu"], tier: "Tier 3", naac: "NAAC A++", campusPlacements: true },
  { name: "Chandigarh University", keywords: ["chandigarh university"], tier: "Tier 3", naac: "NAAC A++", campusPlacements: true },
  { name: "NITTE Meenakshi Institute of Technology", keywords: ["nitte meenakshi", "nmit bangalore"], tier: "Tier 2", naac: "NAAC A++", campusPlacements: true },
];

/**
 * Match a free-form college name against the known institution dataset.
 * Returns `null` when we cannot confidently recognize the institution.
 */
export function recognizeInstitution(collegeName: string): InstitutionProfile | null {
  const normalized = (collegeName || "").trim().toLowerCase();
  if (!normalized) return null;

  for (const profile of INSTITUTION_PROFILES) {
    for (const keyword of profile.keywords) {
      if (normalized.includes(keyword)) return profile;
    }
  }

  return null;
}