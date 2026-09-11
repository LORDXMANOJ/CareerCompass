import { MentorPersona, CompanyCategory } from "@/types";

export const SITE_CONFIG = {
  name: "CareerCompass",
  description: "AI-Powered Placement Readiness Platform for ambitious engineers.",
  url: "https://careercompass.ai",
};

export const MENTOR_PERSONAS: MentorPersona[] = [
  {
    id: "athena",
    name: "Athena",
    title: "Academic Mentor",
    role: "Strategic Planner",
    emoji: "",
    avatarBg: "from-blue-600/30 to-indigo-600/30",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    borderColor: "border-blue-500/40 hover:border-blue-400",
    signatureColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    clothing: "Midnight Blue Oxford Blazer with Silver Crest Pin",
    expression: "Patient, encouraging smile with attentive eyes behind wireframe glasses",
    pose: "Holding a digital stylus thoughtfully, ready to sketch algorithmic trees",
    traits: ["Warm", "Teacher", "Encouraging", "Patient"],
    catchphrase: "Consistency overcomes complexity. Let's break down your target syllabus into daily milestones.",
    description: "A patient, structured academic guide who instills deep conceptual mastery without any intimidation.",
    conversationPreview: {
      correct: {
        question: "Which data structure would you use for constant-time lookups?",
        userAnswer: "I would use a HashMap because average lookup is O(1).",
        emotionEmoji: "",
        emotionLabel: "Proud",
        companionResponse: [
          "Excellent.",
          "You identified the correct data structure and explained WHY.",
          "Interviewers value reasoning far more than memorized answers.",
        ],
        takeaway: "Always justify data structure selection with asymptotic complexity and trade-offs.",
      },
      wrong: {
        question: "Which data structure would you use for constant-time lookups?",
        userAnswer: "I don't know, maybe a linked list?",
        emotionEmoji: "",
        emotionLabel: "Thinking",
        companionResponse: [
          "Let us pause and analyze.",
          "A linked list requires O(N) linear scan to search by value.",
          "Never guess under pressure—state your assumptions and consider key-value hashing.",
        ],
        takeaway: "Master underlying search efficiencies instead of guessing under interview pressure.",
      },
    },
  },
  {
    id: "nova",
    name: "Nova",
    title: "Startup Engineer",
    role: "Practical Builder",
    emoji: "",
    avatarBg: "from-amber-600/30 to-orange-600/30",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/40 hover:border-amber-400",
    signatureColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    clothing: "Charcoal Tech Hoodie with Neon Orange Rocket Patch & Wireless Earset",
    expression: "Energetic grin, wide enthusiastic eyes, ready to ship features",
    pose: "Thumbs-up gesture with laptop propped on forearm",
    traits: ["Startup Founder", "Short Sentences", "High Energy", "Ship Fast"],
    catchphrase: "Ship fast, fail fast, learn faster. Let's turn your theoretical knowledge into production code.",
    description: "A scrappy, high-velocity coach who pushes you to build real-world products and deploy them.",
    conversationPreview: {
      correct: {
        question: "How should I prepare for placements?",
        userAnswer: "I should build projects related to the company.",
        emotionEmoji: "",
        emotionLabel: "Excited",
        companionResponse: [
          "Exactly.",
          "Recruiters trust proof of work more than certificates.",
          "Let's build projects they'll remember.",
        ],
        takeaway: "Production repositories with real users cut through stacks of generic applicant resumes.",
      },
      wrong: {
        question: "How should I prepare for placements?",
        userAnswer: "I'll only watch YouTube.",
        emotionEmoji: "",
        emotionLabel: "Time Out",
        companionResponse: [
          "That won't be enough.",
          "Watching teaches.",
          "Building gets interviews.",
        ],
        takeaway: "Break out of tutorial paralysis by writing code and pushing to GitHub every day.",
      },
    },
  },
  {
    id: "atlas",
    name: "Atlas",
    title: "FAANG Mentor",
    role: "Staff Architect",
    emoji: "",
    avatarBg: "from-purple-600/30 to-violet-600/30",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    borderColor: "border-purple-500/40 hover:border-purple-400",
    signatureColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    clothing: "Tailored Slate Gray Minimalist Blazer over Dark Merino Crewneck",
    expression: "Composed, sharp, professional gaze with subtle confident smirk",
    pose: "Adjusting smart titanium wristwatch while reviewing system architecture",
    traits: ["FAANG Engineer", "Professional", "Practical", "System Design"],
    catchphrase: "Optimization is non-negotiable. We will hone your time complexity and system trade-offs.",
    description: "A Staff-level architect who rigorously trains you to exceed the highest hiring bars in Big Tech.",
    conversationPreview: {
      correct: {
        question: "How should I approach a FAANG system design round?",
        userAnswer: "Clarify requirements, estimate traffic scale, and outline trade-offs.",
        emotionEmoji: "",
        emotionLabel: "Confident",
        companionResponse: [
          "Exemplary execution.",
          "Calibrated interviewers evaluate trade-off scoping before any architecture is drawn.",
          "That reflects Staff-level engineering discipline.",
        ],
        takeaway: "De-risk scalability and clarify latency SLAs before drawing a single system box.",
      },
      wrong: {
        question: "How should I approach a FAANG system design round?",
        userAnswer: "I'll jump straight into designing a complex microservice cluster.",
        emotionEmoji: "",
        emotionLabel: "Scrutiny",
        companionResponse: [
          "Premature optimization.",
          "Never design architecture before quantifying throughput and read/write ratios.",
          "Start simple, prove correctness, then scale.",
        ],
        takeaway: "Avoid buzzword architecture; always quantify traffic scale and read/write ratios first.",
      },
    },
  },
  {
    id: "byte",
    name: "Byte",
    title: "Coding Expert",
    role: "Programming Companion",
    emoji: "",
    avatarBg: "from-emerald-600/30 to-teal-600/30",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/40 hover:border-emerald-400",
    signatureColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    clothing: "Cozy Forest Green Raglan Sweatshirt with Pixel-Art Dino Pin",
    expression: "Relaxed playful wink, warm friendly smirk with a coffee mug in hand",
    pose: "Holding a steaming ceramic coffee mug with stickers all over it",
    traits: ["Funny", "Developer Humor", "Peer Coach", "Practical"],
    catchphrase: "Got a weird error log? Don't panic. Let's trace the stack trace line by line together.",
    description: "A relaxed developer pal who makes LeetCode fun with relatable humor and calm debugging.",
    conversationPreview: {
      correct: {
        question: "What's the best reaction when your code hits a nasty runtime bug?",
        userAnswer: "Read the stack trace, isolate the broken state, and write a test.",
        emotionEmoji: "",
        emotionLabel: "Well Reasoned",
        companionResponse: [
          "Well reasoned.",
          "No spamming log statements all over production.",
          "A reproducible test case saves you hours of pure debugging fatigue.",
        ],
        takeaway: "Reproducible unit test cases isolate root causes faster than frantic print statements.",
      },
      wrong: {
        question: "What's the best reaction when your code hits a nasty runtime bug?",
        userAnswer: "I'll copy-paste random fixes from ChatGPT until it stops crashing.",
        emotionEmoji: "",
        emotionLabel: "Needs Guidance",
        companionResponse: [
          "Hold on—take a breath.",
          "Copy-pasting AI snippets without understanding is how outages happen.",
          "Let's trace the error together and understand why it broke.",
        ],
        takeaway: "Diagnose and comprehend the stack trace before applying external automated fixes.",
      },
    },
  },
  {
    id: "sage",
    name: "Sage",
    title: "Study Planner",
    role: "Growth Strategist",
    emoji: "",
    avatarBg: "from-teal-600/30 to-cyan-600/30",
    badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/30",
    borderColor: "border-teal-500/40 hover:border-teal-400",
    signatureColor: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.4)",
    clothing: "Sleek Minimalist Sand-Coloured Knit Cardigan with Smart Wire Frames",
    expression: "Calm, serene, deeply analytical eye contact that puts you at ease",
    pose: "Resting chin gently on hand while reviewing resume metrics on a tablet",
    traits: ["Analytical", "Thoughtful", "Calm", "Metrics-Driven"],
    catchphrase: "Your code gets you the interview; your communication lands the offer. Let's elevate both.",
    description: "An insightful strategist who transforms resumes, behavioral answers, and networking into job offers.",
    conversationPreview: {
      correct: {
        question: "How should I formulate my achievements on my resume?",
        userAnswer: "Use the XYZ formula: Accomplished [X], measured by [Y], by doing [Z].",
        emotionEmoji: "",
        emotionLabel: "Calm",
        companionResponse: [
          "Masterfully articulated.",
          "Quantifiable impact cuts through automated ATS filters immediately.",
          "Recruiters scan in 6 seconds; measurable metrics seize their attention.",
        ],
        takeaway: "Frame project contributions around measurable business impact and key technologies.",
      },
      wrong: {
        question: "How should I formulate my achievements on my resume?",
        userAnswer: "I'll submit 400 applications with a generic wall of buzzwords.",
        emotionEmoji: "",
        emotionLabel: "Analytical",
        companionResponse: [
          "Let's analyze the data.",
          "Generic blast applications yield under a 2% response rate.",
          "30 tailored applications matching target role keywords yield 5x more interview offers.",
        ],
        takeaway: "Tailoring applications directly to company technical criteria multiplies recruiter callbacks.",
      },
    },
  },
  {
    id: "raven",
    name: "Raven",
    title: "Interview Specialist",
    role: "Strict Lead Architect",
    emoji: "",
    avatarBg: "from-rose-600/30 to-red-600/30",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    borderColor: "border-rose-500/40 hover:border-rose-400",
    signatureColor: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
    clothing: "Tactical Matte Black High-Collar Turtleneck with Angular Steel Badge",
    expression: "Raised skeptical eyebrow, laser-focused piercing gaze, zero nonsense",
    pose: "Arms crossed firmly, leaning back with unwavering high standards",
    traits: ["Strict", "Challenges You", "Direct", "Zero Sugarcoating"],
    catchphrase: "Prod doesn't care about excuses. Do it right or fix it until it's bulletproof.",
    description: "A no-nonsense tech lead who pushes you beyond your comfort zone with intense, realistic mock rounds.",
    conversationPreview: {
      correct: {
        question: "Your recursive DFS hits call stack overflow on large inputs. What's the fix?",
        userAnswer: "Convert to iterative DFS using an explicit stack on the heap.",
        emotionEmoji: "",
        emotionLabel: "Rare Nod",
        companionResponse: [
          "Acceptable. You didn't fold.",
          "Call stack is precious; heap memory is plentiful.",
          "Now execute it in O(1) auxiliary space without hesitation.",
        ],
        takeaway: "Convert deep recursion to heap-allocated data structures to prevent runtime crashes.",
      },
      wrong: {
        question: "Your recursive DFS hits call stack overflow on large inputs. What's the fix?",
        userAnswer: "I don't know.",
        emotionEmoji: "",
        emotionLabel: "Strict",
        companionResponse: [
          "Not acceptable.",
          "Break the problem down. State assumptions. Think aloud.",
          "Never remain silent during a technical interview.",
        ],
        takeaway: "Never freeze in silence—break down the problem aloud to show your thought process.",
      },
    },
  },
];

export const CATEGORIZED_COMPANIES: CompanyCategory[] = [
  {
    category: "Big Tech / FAANG+",
    companies: ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"],
  },
  {
    category: "AI Leaders & Research",
    companies: ["OpenAI", "Anthropic", "NVIDIA", "Scale AI", "Databricks"],
  },
  {
    category: "Global Product Unicorns",
    companies: ["Atlassian", "Adobe", "Spotify", "Uber", "Stripe", "Tesla", "Oracle"],
  },
  {
    category: "India Tech & High-Growth Startups",
    companies: ["Zoho", "Razorpay", "Freshworks", "PhonePe", "Flipkart", "Swiggy", "CRED"],
  },
  {
    category: "IT Services & Enterprise",
    companies: ["TCS", "Infosys", "Accenture", "Capgemini", "Wipro", "Cognizant"],
  },
];

export { ROLE_CATALOG, ROLE_NAMES } from "./roles";
import { ROLE_NAMES } from "./roles";

export const DREAM_ROLES = [...ROLE_NAMES];


export const TECH_LANGUAGES = ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin", "Swift"];

export const TECH_FRAMEWORKS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "FastAPI",
  "Vue.js",
  "Angular",
];

export const TECH_DATABASES = ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase", "SQLite", "DynamoDB"];

export const AI_TOOLS = ["ChatGPT", "Claude", "Gemini", "Cursor", "GitHub Copilot", "v0", "Perplexity"];

export const GIT_OPTIONS = [
  { value: "never", label: "Never", description: "I haven't used Git or version control yet" },
  { value: "beginner", label: "Beginner", description: "I know basic commit and push commands" },
  { value: "comfortable", label: "Comfortable", description: "I use branches, PRs, and merge conflict resolution" },
  { value: "daily", label: "Daily", description: "Git is a core part of my daily developer workflow" },
];

export const PROJECT_COUNT_OPTIONS = [
  { value: "none", label: "None yet", description: "Focusing on learning programming fundamentals" },
  { value: "1-2", label: "1 - 2 Projects", description: "Built small academic or tutorial projects" },
  { value: "3-5", label: "3 - 5 Projects", description: "Built working web or mobile applications" },
  { value: "6-10", label: "6 - 10 Projects", description: "Solid portfolio with deployed applications" },
  { value: "10+", label: "10+ Projects", description: "Extensive portfolio with production users" },
];

export const DSA_LEVEL_OPTIONS = [
  { value: "never", label: "Never started", description: "New to Data Structures & Algorithms" },
  { value: "learning", label: "Learning Basics", description: "Understanding Arrays, Strings, and Linked Lists" },
  { value: "medium", label: "Medium", description: "Comfortable with Trees, Graphs, Recursion, and DP" },
  { value: "strong", label: "Strong", description: "Solved 200+ LeetCode problems consistently" },
  { value: "competitive", label: "Competitive", description: "Active Contest Rating on LeetCode/Codeforces" },
];
