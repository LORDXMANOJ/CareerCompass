/**
 * Micro Skill Verification dataset for CareerCompass Step 6.
 *
 * Each question tests absolute baseline familiarity — not tricky edge cases,
 * not advanced algorithms, and not obscure internals.
 * Every question has exactly ONE unambiguous correct answer.
 */

export interface SkillQuestion {
  skillId: string;
  skillName: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const SKILL_QUESTIONS: Record<string, SkillQuestion> = {
  // -------------------------------------------------------------
  // Programming Languages
  // -------------------------------------------------------------
  c: {
    skillId: "c",
    skillName: "C",
    question: "Which function is commonly used to print formatted output to the console in C?",
    options: ["print()", "printf()", "console.log()", "System.out.println()"],
    correctAnswer: "printf()",
    explanation: "'printf()' (print formatted) is the standard C library function in <stdio.h> used for printing text.",
  },
  "c++": {
    skillId: "c++",
    skillName: "C++",
    question: "Which operator is used for scope resolution in C++?",
    options: ["::", "->", ".", "=>"],
    correctAnswer: "::",
    explanation: "The double colon '::' is the scope resolution operator used to access global variables, class members, or namespaces.",
  },
  java: {
    skillId: "java",
    skillName: "Java",
    question: "Which keyword is used to create an instance of an object in Java?",
    options: ["class", "new", "object", "create"],
    correctAnswer: "new",
    explanation: "The 'new' keyword allocates memory on the heap and creates a new object instance in Java.",
  },
  python: {
    skillId: "python",
    skillName: "Python",
    question: "Which symbol is used to start a single-line comment in Python?",
    options: ["//", "/*", "#", "--"],
    correctAnswer: "#",
    explanation: "In Python, the hash symbol '#' is used to write single-line comments.",
  },
  javascript: {
    skillId: "javascript",
    skillName: "JavaScript",
    question: "Which keyword is commonly used to declare a block-scoped variable that can be reassigned?",
    options: ["let", "const", "static", "define"],
    correctAnswer: "let",
    explanation: "'let' allows declaring block-scoped variables in modern JavaScript (ES6+) that can be reassigned.",
  },
  typescript: {
    skillId: "typescript",
    skillName: "TypeScript",
    question: "TypeScript is a statically typed superset of which language?",
    options: ["Java", "JavaScript", "Python", "C#"],
    correctAnswer: "JavaScript",
    explanation: "TypeScript builds directly on top of JavaScript by adding static type definitions that compile to plain JavaScript.",
  },
  go: {
    skillId: "go",
    skillName: "Go",
    question: "Which keyword is used to launch a concurrent goroutine in Go?",
    options: ["thread", "async", "go", "spawn"],
    correctAnswer: "go",
    explanation: "The 'go' keyword (e.g. 'go myFunction()') runs any function concurrently in a lightweight goroutine.",
  },
  rust: {
    skillId: "rust",
    skillName: "Rust",
    question: "By default, variables declared with 'let' in Rust are:",
    options: ["Mutable", "Immutable", "Global", "Undefined"],
    correctAnswer: "Immutable",
    explanation: "In Rust, variables are immutable by default for memory safety unless explicitly marked with 'mut'.",
  },
  kotlin: {
    skillId: "kotlin",
    skillName: "Kotlin",
    question: "Which keyword is used to declare a read-only (immutable) variable in Kotlin?",
    options: ["val", "var", "const", "let"],
    correctAnswer: "val",
    explanation: "Kotlin uses 'val' for read-only references and 'var' for mutable variables.",
  },
  swift: {
    skillId: "swift",
    skillName: "Swift",
    question: "Which keyword is used to declare a constant in Swift?",
    options: ["let", "var", "const", "final"],
    correctAnswer: "let",
    explanation: "In Swift, 'let' is used to declare constants whose values cannot change after initialization.",
  },

  // -------------------------------------------------------------
  // Frameworks & Libraries
  // -------------------------------------------------------------
  react: {
    skillId: "react",
    skillName: "React",
    question: "Which built-in hook is used to add local state to a functional React component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useState",
    explanation: "'useState' declares a state variable and a setter function inside functional React components.",
  },
  "next.js": {
    skillId: "next.js",
    skillName: "Next.js",
    question: "Next.js is a popular fullstack React framework that natively supports:",
    options: [
      "Server-side rendering (SSR)",
      "Only static desktop binaries",
      "Assembly code compilation",
      "Only client-side jQuery scripts",
    ],
    correctAnswer: "Server-side rendering (SSR)",
    explanation: "Next.js provides server-side rendering (SSR), static site generation (SSG), and API routes out of the box.",
  },
  "node.js": {
    skillId: "node.js",
    skillName: "Node.js",
    question: "Node.js allows JavaScript code to run outside of which environment?",
    options: ["Web browser", "Operating system", "Command line terminal", "Virtual machine"],
    correctAnswer: "Web browser",
    explanation: "Node.js is an open-source JavaScript runtime built on Chrome's V8 engine that runs JS directly on servers.",
  },
  express: {
    skillId: "express",
    skillName: "Express",
    question: "Express is a fast, unopinionated web framework primarily used with which runtime?",
    options: ["Python", "Node.js", "Java", "Ruby"],
    correctAnswer: "Node.js",
    explanation: "Express is the standard server routing and middleware framework built for the Node.js ecosystem.",
  },
  django: {
    skillId: "django",
    skillName: "Django",
    question: "Django is a high-level web framework written in which language?",
    options: ["Python", "PHP", "Java", "Ruby"],
    correctAnswer: "Python",
    explanation: "Django is a 'batteries-included' Python web framework designed for rapid and clean web development.",
  },
  flask: {
    skillId: "flask",
    skillName: "Flask",
    question: "Flask is commonly classified as what type of Python framework?",
    options: ["Microframework", "Enterprise monolithic suite", "Database engine", "CSS preprocessor"],
    correctAnswer: "Microframework",
    explanation: "Flask is a lightweight Python microframework that gives developers minimal tools to build APIs and web services.",
  },
  "spring boot": {
    skillId: "spring boot",
    skillName: "Spring Boot",
    question: "Spring Boot is primarily used to build production-ready applications in which language?",
    options: ["Java", "Python", "PHP", "Go"],
    correctAnswer: "Java",
    explanation: "Spring Boot provides opinionated defaults and auto-configuration to build standalone, production Java applications.",
  },
  fastapi: {
    skillId: "fastapi",
    skillName: "FastAPI",
    question: "FastAPI is a modern Python framework primarily designed for building:",
    options: [
      "High-performance REST APIs",
      "Desktop GUI installers",
      "Hardware drivers",
      "Video editing codecs",
    ],
    correctAnswer: "High-performance REST APIs",
    explanation: "FastAPI leverages Python type hints and ASGI to provide blazing-fast, automatically documented REST APIs.",
  },
  "vue.js": {
    skillId: "vue.js",
    skillName: "Vue.js",
    question: "In Vue templates, which directive is used for two-way data binding on form inputs?",
    options: ["v-model", "v-bind", "v-for", "v-if"],
    correctAnswer: "v-model",
    explanation: "'v-model' creates two-way data binding between form input elements and component reactive state in Vue.",
  },
  angular: {
    skillId: "angular",
    skillName: "Angular",
    question: "Angular applications are predominantly authored using which programming language?",
    options: ["TypeScript", "Python", "Go", "C#"],
    correctAnswer: "TypeScript",
    explanation: "Angular is developed by Google and is built entirely around TypeScript and component-based decorators.",
  },

  // -------------------------------------------------------------
  // Databases & Cloud Storage
  // -------------------------------------------------------------
  mysql: {
    skillId: "mysql",
    skillName: "MySQL",
    question: "MySQL is primarily which type of database system?",
    options: [
      "Relational database (RDBMS)",
      "Document NoSQL store",
      "Key-value cache",
      "Graph database",
    ],
    correctAnswer: "Relational database (RDBMS)",
    explanation: "MySQL organizes structured data into tables with rows, columns, and relational foreign keys using SQL.",
  },
  postgresql: {
    skillId: "postgresql",
    skillName: "PostgreSQL",
    question: "Which SQL clause is used to filter records in a SELECT query?",
    options: ["WHERE", "FILTER", "LIMIT", "MATCH"],
    correctAnswer: "WHERE",
    explanation: "The 'WHERE' clause filters rows according to specified logical conditions.",
  },
  mongodb: {
    skillId: "mongodb",
    skillName: "MongoDB",
    question: "MongoDB stores records primarily as flexible documents in which format?",
    options: ["BSON / JSON documents", "CSV text sheets", "Relational rows", "XML stylesheets"],
    correctAnswer: "BSON / JSON documents",
    explanation: "MongoDB is a NoSQL document database storing schema-free records in binary JSON (BSON).",
  },
  redis: {
    skillId: "redis",
    skillName: "Redis",
    question: "Redis is widely utilized in backend architectures as an in-memory:",
    options: [
      "Cache and key-value store",
      "Relational table join engine",
      "Static file CDN",
      "CSS style engine",
    ],
    correctAnswer: "Cache and key-value store",
    explanation: "Redis keeps data in RAM for sub-millisecond lookups, making it ideal for caching and session management.",
  },
  supabase: {
    skillId: "supabase",
    skillName: "Supabase",
    question: "Supabase is an open-source Firebase alternative built directly on top of which database?",
    options: ["PostgreSQL", "SQLite", "MongoDB", "MySQL"],
    correctAnswer: "PostgreSQL",
    explanation: "Supabase provides instant REST/GraphQL APIs, Auth, and Storage powered by a dedicated PostgreSQL database.",
  },
  firebase: {
    skillId: "firebase",
    skillName: "Firebase",
    question: "Firebase is a Backend-as-a-Service (BaaS) platform maintained by which company?",
    options: ["Google", "Amazon", "Microsoft", "Meta"],
    correctAnswer: "Google",
    explanation: "Firebase is Google's mobile and web application development platform offering real-time databases and hosting.",
  },
  sqlite: {
    skillId: "sqlite",
    skillName: "SQLite",
    question: "SQLite is distinguished because it operates as:",
    options: [
      "A serverless, file-based database engine",
      "A distributed cloud cluster with 50 nodes",
      "A graph database strictly in memory",
      "A web browser extension",
    ],
    correctAnswer: "A serverless, file-based database engine",
    explanation: "SQLite reads and writes directly to standard disk files without requiring a separate database server process.",
  },
  dynamodb: {
    skillId: "dynamodb",
    skillName: "DynamoDB",
    question: "Amazon DynamoDB is a fully managed cloud database designed for:",
    options: [
      "Fast, predictable NoSQL key-value & document workloads",
      "Traditional multi-table SQL join analytics",
      "Local desktop spreadsheet files",
      "Static image asset hosting",
    ],
    correctAnswer: "Fast, predictable NoSQL key-value & document workloads",
    explanation: "DynamoDB delivers single-digit millisecond performance at any scale as a managed AWS NoSQL database.",
  },

  // -------------------------------------------------------------
  // DevOps & Cloud
  // -------------------------------------------------------------
  git: {
    skillId: "git",
    skillName: "Git",
    question: "Which command is used to copy an existing remote Git repository to your local machine?",
    options: ["git clone", "git pull", "git fork", "git init"],
    correctAnswer: "git clone",
    explanation: "'git clone <url>' downloads the entire repository history and working files to your computer.",
  },
  docker: {
    skillId: "docker",
    skillName: "Docker",
    question: "What does a Docker container package together?",
    options: [
      "An application and all its required dependencies",
      "Only raw audio and video assets",
      "A physical hardware rack unit",
      "Only DNS routing records",
    ],
    correctAnswer: "An application and all its required dependencies",
    explanation: "Containers encapsulate code, runtime, system tools, and libraries to ensure consistent execution anywhere.",
  },
  aws: {
    skillId: "aws",
    skillName: "AWS",
    question: "Amazon Web Services (AWS) is primarily what kind of platform?",
    options: [
      "On-demand cloud computing platform",
      "Video game console",
      "Desktop operating system",
      "Relational table spreadsheet software",
    ],
    correctAnswer: "On-demand cloud computing platform",
    explanation: "AWS provides cloud infrastructure including compute (EC2), storage (S3), and managed services globally.",
  },
  azure: {
    skillId: "azure",
    skillName: "Azure",
    question: "Microsoft Azure is Microsoft's public platform for:",
    options: [
      "Cloud computing services & infrastructure",
      "Desktop office document templates",
      "Hardware motherboard manufacturing",
      "Video streaming subscriptions",
    ],
    correctAnswer: "Cloud computing services & infrastructure",
    explanation: "Microsoft Azure offers scalable virtual computing, databases, AI models, and networking services.",
  },
  "google cloud": {
    skillId: "google cloud",
    skillName: "Google Cloud",
    question: "Google Cloud Platform (GCP) provides cloud infrastructure that runs on:",
    options: [
      "The same infrastructure Google uses for Search and YouTube",
      "Only local Raspberry Pi servers",
      "Floppy disk backup drives",
      "Desktop browser caches",
    ],
    correctAnswer: "The same infrastructure Google uses for Search and YouTube",
    explanation: "Google Cloud delivers compute, storage, BigQuery analytics, and AI on Google's global data center infrastructure.",
  },

  // -------------------------------------------------------------
  // AI & ML Frameworks
  // -------------------------------------------------------------
  tensorflow: {
    skillId: "tensorflow",
    skillName: "TensorFlow",
    question: "TensorFlow is an open-source machine learning framework originally developed by:",
    options: ["Google", "Apple", "Oracle", "Spotify"],
    correctAnswer: "Google",
    explanation: "TensorFlow was created by the Google Brain team for numerical computation and deep learning models.",
  },
  pytorch: {
    skillId: "pytorch",
    skillName: "PyTorch",
    question: "PyTorch is a popular open-source deep learning framework primarily developed by:",
    options: ["Meta (Facebook AI Research)", "Adobe", "Twitter", "Amazon"],
    correctAnswer: "Meta (Facebook AI Research)",
    explanation: "PyTorch is known for its dynamic computation graphs and is widely used across AI research and production.",
  },

  // -------------------------------------------------------------
  // AI Assistants & IDE Tools
  // -------------------------------------------------------------
  chatgpt: {
    skillId: "chatgpt",
    skillName: "ChatGPT",
    question: "ChatGPT is a conversational generative AI system developed by:",
    options: ["OpenAI", "Meta", "Amazon", "IBM"],
    correctAnswer: "OpenAI",
    explanation: "ChatGPT is OpenAI's flagship conversational language model interface.",
  },
  claude: {
    skillId: "claude",
    skillName: "Claude",
    question: "Claude is a family of AI models and assistants developed by which AI lab?",
    options: ["Anthropic", "Google DeepMind", "Tesla", "NVIDIA"],
    correctAnswer: "Anthropic",
    explanation: "Anthropic created Claude with a focus on constitutional AI, safety, and helpful reasoning.",
  },
  gemini: {
    skillId: "gemini",
    skillName: "Gemini",
    question: "Gemini is the flagship multimodal AI model built by which company?",
    options: ["Google", "Microsoft", "Salesforce", "Intel"],
    correctAnswer: "Google",
    explanation: "Gemini is Google's frontier multimodal model designed to reason across text, code, audio, and images.",
  },
  cursor: {
    skillId: "cursor",
    skillName: "Cursor",
    question: "Cursor is an AI-first code editor built as a fork of which popular editor?",
    options: ["Visual Studio Code (VS Code)", "Sublime Text", "Vim", "Eclipse"],
    correctAnswer: "Visual Studio Code (VS Code)",
    explanation: "Cursor is built on top of VS Code with deeply integrated AI features for codebase indexing and inline editing.",
  },
  "github copilot": {
    skillId: "github copilot",
    skillName: "GitHub Copilot",
    question: "GitHub Copilot primarily assists software developers by providing:",
    options: [
      "AI-powered inline code completions and suggestions",
      "Automated tax filing services",
      "Graphic design 3D rendering",
      "Ethernet cable testing",
    ],
    correctAnswer: "AI-powered inline code completions and suggestions",
    explanation: "GitHub Copilot autocompletes code and answers technical questions directly inside IDE editors.",
  },
  v0: {
    skillId: "v0",
    skillName: "v0",
    question: "v0 by Vercel is a generative AI tool focused on creating:",
    options: [
      "React UI components & styled layouts from text prompts",
      "Network router firmware",
      "Video game audio soundtracks",
      "Physical circuit blueprints",
    ],
    correctAnswer: "React UI components & styled layouts from text prompts",
    explanation: "v0 generates production-ready React components using Tailwind CSS and shadcn/ui from natural language.",
  },
  perplexity: {
    skillId: "perplexity",
    skillName: "Perplexity",
    question: "Perplexity AI is primarily utilized as an AI-powered:",
    options: [
      "Conversational answer engine and research search tool",
      "Video editing software",
      "Code compiler for C++",
      "Database schema migration manager",
    ],
    correctAnswer: "Conversational answer engine and research search tool",
    explanation: "Perplexity combines real-time web search with language models to provide cited answers to complex queries.",
  },
};

/**
 * Normalizes any tech label (e.g. "Next.js" -> "next.js", "C++" -> "c++") and retrieves
 * its fundamental skill verification question.
 */
export function getSkillQuestion(skillName: string): SkillQuestion {
  const normalized = (skillName || "").trim().toLowerCase();

  if (SKILL_QUESTIONS[normalized]) {
    return SKILL_QUESTIONS[normalized];
  }

  // Graceful fallback for any technology not explicitly in dataset
  return {
    skillId: normalized,
    skillName: skillName,
    question: `What is the primary role of ${skillName} in modern software development?`,
    options: [
      `A tool/technology used to build software solutions`,
      `A physical hardware monitor cable`,
      `An operating system printer driver`,
      `A mechanical keyboard switch type`,
    ],
    correctAnswer: `A tool/technology used to build software solutions`,
    explanation: `${skillName} is part of your development toolkit for building modern applications.`,
  };
}

export interface CompanionToneFeedback {
  intro: string;
  correctMsg: string;
  wrongMsg: string;
}

/**
 * Returns mentor-specific commentary for the Micro Skill Verification modal.
 */
export function getCompanionSkillTone(mentorId: string): CompanionToneFeedback {
  switch (mentorId) {
    case "athena":
      return {
        intro: "Let's quickly check one fundamental concept.",
        correctMsg: "Excellent. You understand the foundational concept clearly.",
        wrongMsg: "Not quite, but reviewing fundamentals now builds lasting mastery.",
      };
    case "nova":
      return {
        intro: "Quick sanity check. You've got this!",
        correctMsg: "Boom! Clean foundation, ready to ship real code.",
        wrongMsg: "Close one! Even senior devs mix this up early on. Keep pushing!",
      };
    case "atlas":
      return {
        intro: "One fundamental. No tricks.",
        correctMsg: "Solid. Fundamentals are intact.",
        wrongMsg: "Incorrect, but that's what review is for. Calibrate and proceed.",
      };
    case "byte":
      return {
        intro: "Super quick one. Let's see how comfortable you are with this.",
        correctMsg: "Nice! You've got the basic idea in your toolkit.",
        wrongMsg: "Not this time. That's actually a super common beginner mix-up.",
      };
    case "sage":
      return {
        intro: "Let's verify one foundational concept before we continue.",
        correctMsg: "Accurate. Your technical baseline is confirmed.",
        wrongMsg: "Not quite. Flagging this for a quick review will strengthen your profile.",
      };
    case "raven":
      return {
        intro: "One basic question. Answer carefully.",
        correctMsg: "Correct. Baseline checked.",
        wrongMsg: "Missed. Note the right answer and don't make the same mistake twice.",
      };
    default:
      return {
        intro: "Quick foundational check. No stress.",
        correctMsg: "Nice! Basic familiarity verified.",
        wrongMsg: "Not quite, but we'll include a quick review in your roadmap.",
      };
  }
}
