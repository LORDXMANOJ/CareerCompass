export type StandardRole =
  | "Software Engineer"
  | "Backend Developer"
  | "Frontend Developer"
  | "Full Stack Engineer"
  | "AI Engineer"
  | "Machine Learning Engineer"
  | "Data Scientist"
  | "DevOps Engineer"
  | "Cloud Engineer"
  | "Cyber Security Analyst"
  | "Android Engineer"
  | "iOS Engineer"
  | "UI/UX Designer"
  | "Game Developer";

export interface SecondaryRoleMatch {
  role: StandardRole;
  weight: number; // e.g. 0.92 for 92% of base
}

export interface CareerTechMapping {
  keywords: string[]; // Normalized triggers (lowercased)
  primaryRole: StandardRole;
  secondaryRoles?: SecondaryRoleMatch[];
  category:
    | "framework"
    | "language"
    | "cloud"
    | "database"
    | "devops"
    | "ai"
    | "security"
    | "mobile"
    | "gamedev"
    | "design"
    | "testing"
    | "title"
    | "abbreviation"
    | "tool"
    | "concept";
  matchedChips: string[];
  explanation: string;
  baseConfidence: number;
}

// ---------------------------------------------------------------------------
// CAREER INTELLIGENCE DATASET (500+ technologies, frameworks, and tools)
// ---------------------------------------------------------------------------
export const CAREER_INTELLIGENCE_DATA: CareerTechMapping[] = [
  // =========================================================================
  // 1. .NET & MICROSOFT BACKEND ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      ".net",
      "dotnet",
      ".net core",
      ".net framework",
      ".net developer",
      "asp.net",
      "asp.net core",
      "aspnet",
      "aspnetcore",
      "c#",
      "csharp",
      "c #",
      "entity framework",
      "ef core",
      "dapper",
      "linq",
      "wcf",
      "wpf",
      "signalr",
      "web api",
      ".net web api",
      "blazor backend",
      "c# developer",
      "dotnet developer",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Software Engineer", weight: 0.92 }],
    category: "framework",
    matchedChips: [".NET", "ASP.NET", "C#", "MVC"],
    explanation:
      "We recommend Backend Developer because .NET is primarily used for APIs, enterprise services, microservices, and server-side development.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 2. JAVA & ENTERPRISE BACKEND ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "spring boot",
      "springboot",
      "spring",
      "spring framework",
      "spring mvc",
      "spring cloud",
      "spring security",
      "hibernate",
      "jpa",
      "maven",
      "gradle",
      "quarkus",
      "micronaut",
      "jakarta ee",
      "java ee",
      "servlets",
      "tomcat",
      "java backend",
      "java developer",
      "java api",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Software Engineer", weight: 0.94 }],
    category: "framework",
    matchedChips: ["Spring Boot", "Java", "Hibernate", "Microservices"],
    explanation:
      "We recommend Backend Developer because Spring Boot is the premier enterprise framework for scalable microservices and RESTful APIs.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 3. NODE.JS & TYPESCRIPT SERVER ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "node.js",
      "nodejs",
      "node",
      "express",
      "express.js",
      "expressjs",
      "nestjs",
      "nest.js",
      "nest",
      "fastify",
      "koa",
      "koa.js",
      "hono",
      "adonisjs",
      "adonis",
      "deno",
      "bun",
      "trpc backend",
      "apollo server",
      "graphql server",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.93 }],
    category: "framework",
    matchedChips: ["Node.js", "Express", "NestJS", "APIs"],
    explanation:
      "We recommend Backend Developer because Node.js and its frameworks power high-concurrency event-driven server backends and microservices.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 4. PYTHON BACKEND FRAMEWORKS
  // =========================================================================
  {
    keywords: [
      "django",
      "django rest framework",
      "drf",
      "fastapi",
      "flask",
      "celery",
      "sqlalchemy",
      "alembic",
      "pydantic",
      "tornado",
      "sanic",
      "uvicorn",
      "gunicorn",
      "python backend",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.9 }],
    category: "framework",
    matchedChips: ["FastAPI", "Django", "Python APIs", "SQLAlchemy"],
    explanation:
      "We recommend Backend Developer because FastAPI and Django are leading frameworks for robust backend APIs, data models, and server-side logic.",
    baseConfidence: 97,
  },

  // =========================================================================
  // 5. PHP & LARAVEL ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "laravel",
      "php",
      "symfony",
      "codeigniter",
      "lumen",
      "composer",
      "eloquent",
      "blade",
      "livewire",
      "cakephp",
      "php developer",
      "php backend",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.89 }],
    category: "framework",
    matchedChips: ["Laravel", "PHP", "Eloquent", "REST APIs"],
    explanation:
      "We recommend Backend Developer because Laravel is a premier server-side MVC framework for robust APIs, business logic, and enterprise web services.",
    baseConfidence: 97,
  },

  // =========================================================================
  // 6. GOLANG & RUST HIGH-PERFORMANCE BACKENDS
  // =========================================================================
  {
    keywords: [
      "golang",
      "go",
      "gin",
      "fiber",
      "echo go",
      "chi go",
      "gorm",
      "grpc go",
      "go backend",
      "rust backend",
      "actix",
      "actix-web",
      "axum",
      "tokio",
      "rocket rust",
      "diesel rust",
      "sqlx",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Software Engineer", weight: 0.93 }],
    category: "language",
    matchedChips: ["Go", "Gin", "gRPC", "High Concurrency"],
    explanation:
      "We recommend Backend Developer because Go and Rust excel at building ultra-low-latency distributed backend services and high-throughput APIs.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 7. RUBY ON RAILS ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "ruby on rails",
      "rails",
      "ruby",
      "active record",
      "activerecord",
      "sidekiq",
      "puma",
      "sinatra",
      "ruby developer",
      "rails developer",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.91 }],
    category: "framework",
    matchedChips: ["Ruby on Rails", "ActiveRecord", "Sidekiq"],
    explanation:
      "We recommend Backend Developer because Rails provides an industry-standard convention-over-configuration backend architecture.",
    baseConfidence: 96,
  },

  // =========================================================================
  // 8. FRONTEND REACT ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "react",
      "react.js",
      "reactjs",
      "react developer",
      "redux",
      "redux toolkit",
      "zustand",
      "react query",
      "tanstack query",
      "jotai",
      "recoil",
      "react router",
      "styled components",
      "emotion css",
      "react hooks",
      "jsx",
      "tsx",
    ],
    primaryRole: "Frontend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.91 }],
    category: "framework",
    matchedChips: ["React", "Redux", "Hooks", "SPA"],
    explanation:
      "We recommend Frontend Developer because React is the industry's premier library for reactive user interfaces and client-side web applications.",
    baseConfidence: 96,
  },

  // =========================================================================
  // 9. FRONTEND VUE ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "vue",
      "vue.js",
      "vuejs",
      "vue developer",
      "pinia",
      "vuex",
      "nuxt",
      "nuxtjs",
      "nuxt.js",
      "vue 3",
      "composition api",
      "vue router",
      "vuetify",
    ],
    primaryRole: "Frontend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.9 }],
    category: "framework",
    matchedChips: ["Vue.js", "Pinia", "Nuxt", "Single File Components"],
    explanation:
      "We recommend Frontend Developer because Vue is a leading progressive framework for crafting reactive client web applications.",
    baseConfidence: 96,
  },

  // =========================================================================
  // 10. FRONTEND ANGULAR ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "angular",
      "angular.js",
      "angularjs",
      "angular developer",
      "ngrx",
      "rxjs",
      "angular 17",
      "angular 18",
      "angular material",
      "angular signals",
      "typescript frontend",
    ],
    primaryRole: "Frontend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.9 }],
    category: "framework",
    matchedChips: ["Angular", "RxJS", "TypeScript", "Enterprise UI"],
    explanation:
      "We recommend Frontend Developer because Angular is Google's enterprise framework for robust, large-scale client-side applications.",
    baseConfidence: 96,
  },

  // =========================================================================
  // 11. NEXT.JS & HYBRID WEB FRAMEWORKS
  // =========================================================================
  {
    keywords: [
      "next.js",
      "nextjs",
      "next",
      "next js developer",
      "remix",
      "remix.run",
      "gatsby",
      "server components",
      "rsc",
      "app router",
      "ssr",
      "static site generation",
    ],
    primaryRole: "Frontend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.91 }],
    category: "framework",
    matchedChips: ["Next.js", "SSR", "Server Components", "React"],
    explanation:
      "We recommend Frontend Developer with strong Full Stack synergy because Next.js bridges server-rendered UI with full-stack React capabilities.",
    baseConfidence: 95,
  },

  // =========================================================================
  // 12. CLIENT STYLING & WEB STANDARDS
  // =========================================================================
  {
    keywords: [
      "html",
      "html5",
      "css",
      "css3",
      "tailwind",
      "tailwindcss",
      "tailwind css",
      "sass",
      "scss",
      "bootstrap",
      "chakra ui",
      "shadcn",
      "radix ui",
      "framer motion",
      "web components",
      "responsive design",
      "dom",
      "web performance",
      "vite",
      "webpack",
    ],
    primaryRole: "Frontend Developer",
    secondaryRoles: [{ role: "UI/UX Designer", weight: 0.86 }],
    category: "tool",
    matchedChips: ["Tailwind CSS", "HTML5", "CSS3", "Design Fidelity"],
    explanation:
      "We recommend Frontend Developer because modern web styling, design systems, and responsive layouts form the cornerstone of client engineering.",
    baseConfidence: 95,
  },

  // =========================================================================
  // 13. FULL STACK ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "full stack",
      "fullstack",
      "full-stack",
      "mern",
      "mern stack",
      "mean stack",
      "mevn stack",
      "t3 stack",
      "t3",
      "lamp stack",
      "jamstack",
      "web developer",
      "full stack engineer",
      "full stack developer",
      "fullstack developer",
      "fullstack engineer",
      "trpc",
      "supabase fullstack",
    ],
    primaryRole: "Full Stack Engineer",
    secondaryRoles: [{ role: "Software Engineer", weight: 0.9 }],
    category: "title",
    matchedChips: ["Full Stack", "MERN", "End-to-End", "APIs + UI"],
    explanation:
      "We recommend Full Stack Engineer because your search focuses on bridging end-to-end client applications with server-side microservices.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 14. MOBILE: FLUTTER & DART
  // =========================================================================
  {
    keywords: [
      "flutter",
      "dart",
      "flutter developer",
      "flutter engineer",
      "flutter mobile",
      "bloc flutter",
      "riverpod",
      "provider flutter",
      "flutter app",
    ],
    primaryRole: "Android Engineer",
    secondaryRoles: [{ role: "iOS Engineer", weight: 0.93 }],
    category: "mobile",
    matchedChips: ["Flutter", "Cross-Platform", "Dart", "Mobile SDK"],
    explanation:
      "We recommend Mobile Development (Android Engineer & iOS Engineer) because Flutter compiles natively to both Google and Apple mobile ecosystems.",
    baseConfidence: 93,
  },

  // =========================================================================
  // 15. MOBILE: REACT NATIVE & EXPO
  // =========================================================================
  {
    keywords: [
      "react native",
      "react-native",
      "reactnative",
      "expo",
      "react native developer",
      "react native engineer",
      "rn developer",
      "cross platform mobile",
      "mobile developer",
      "mobile app developer",
    ],
    primaryRole: "Android Engineer",
    secondaryRoles: [{ role: "iOS Engineer", weight: 0.93 }],
    category: "mobile",
    matchedChips: ["React Native", "Expo", "Cross-Platform", "Mobile Apps"],
    explanation:
      "We recommend Mobile Development (Android Engineer & iOS Engineer) because React Native targets both Android and iOS platforms using a unified codebase.",
    baseConfidence: 93,
  },

  // =========================================================================
  // 16. NATIVE ANDROID ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "android",
      "android developer",
      "android engineer",
      "kotlin",
      "jetpack compose",
      "jetpack",
      "android sdk",
      "android studio",
      "coroutines",
      "dagger hilt",
      "hilt",
      "retrofit",
      "room db",
      "mvvm android",
      "play store",
    ],
    primaryRole: "Android Engineer",
    category: "mobile",
    matchedChips: ["Kotlin", "Jetpack Compose", "Android SDK", "Coroutines"],
    explanation:
      "We recommend Android Engineer because Kotlin and Jetpack Compose are Google's modern standard for high-performance native Android apps.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 17. NATIVE IOS ECOSYSTEM
  // =========================================================================
  {
    keywords: [
      "ios",
      "ios developer",
      "ios engineer",
      "swift",
      "swiftui",
      "uikit",
      "xcode",
      "cocoapods",
      "combine swift",
      "coredata",
      "objective-c",
      "objective c",
      "apple developer",
      "testflight",
      "app store",
      "watchos",
      "visionos",
    ],
    primaryRole: "iOS Engineer",
    category: "mobile",
    matchedChips: ["Swift", "SwiftUI", "iOS SDK", "Apple Ecosystem"],
    explanation:
      "We recommend iOS Engineer because Swift and SwiftUI are Apple's official standard for crafting responsive iPhone, iPad, and Mac applications.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 18. GAME DEVELOPMENT: UNITY
  // =========================================================================
  {
    keywords: [
      "unity",
      "unity3d",
      "unity engine",
      "unity c#",
      "unity developer",
      "unity game",
      "c# unity",
      "monobehaviour",
      "unity asset store",
    ],
    primaryRole: "Game Developer",
    category: "gamedev",
    matchedChips: ["Unity", "C#", "Gameplay Physics", "Game Engine"],
    explanation:
      "We recommend Game Developer because Unity is the leading multiplatform engine for 2D, 3D, and interactive virtual world development.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 19. GAME DEVELOPMENT: UNREAL ENGINE
  // =========================================================================
  {
    keywords: [
      "unreal",
      "unreal engine",
      "unreal engine 5",
      "ue5",
      "ue4",
      "unreal developer",
      "blueprints unreal",
      "unreal c++",
      "epic games",
      "nanite",
      "lumen",
    ],
    primaryRole: "Game Developer",
    category: "gamedev",
    matchedChips: ["Unreal Engine", "C++", "Lumen & Nanite", "3D Graphics"],
    explanation:
      "We recommend Game Developer because Unreal Engine 5 is the industry gold-standard for photorealistic AAA gaming and virtual production.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 20. GAME DEV TOOLS & GRAPHICS APIS
  // =========================================================================
  {
    keywords: [
      "game developer",
      "game development",
      "game dev",
      "game programming",
      "godot",
      "godot engine",
      "gdscript",
      "blender",
      "blender 3d",
      "maya",
      "3d modeling",
      "shaders",
      "hlsl",
      "glsl",
      "opengl",
      "vulkan",
      "directx",
      "game physics",
      "gameplay programmer",
      "graphics programmer",
      "ray tracing",
    ],
    primaryRole: "Game Developer",
    category: "gamedev",
    matchedChips: ["Game Engines", "Shaders", "3D Graphics", "Interactive Simulation"],
    explanation:
      "We recommend Game Developer because tools like Blender, Godot, and graphics APIs form the foundation of modern game engineering.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 21. AI & LLM FRAMEWORKS (LangChain, LlamaIndex)
  // =========================================================================
  {
    keywords: [
      "langchain",
      "langchain python",
      "langchain js",
      "langgraph",
      "llamaindex",
      "llama-index",
      "haystack",
      "semantic kernel",
      "autogen",
      "crewai",
      "dspy",
      "rag",
      "retrieval augmented generation",
      "agentic ai",
      "ai agents",
      "ai agent",
    ],
    primaryRole: "AI Engineer",
    secondaryRoles: [{ role: "Machine Learning Engineer", weight: 0.88 }],
    category: "ai",
    matchedChips: ["LangChain", "Agentic Workflows", "RAG", "LLM Framework"],
    explanation:
      "We recommend AI Engineer because LangChain is one of the leading frameworks for building LLM-powered applications and autonomous agents.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 22. AI, LLMS & GENERATIVE AI TOOLS
  // =========================================================================
  {
    keywords: [
      "openai",
      "gpt",
      "gpt-4",
      "chatgpt",
      "anthropic",
      "claude",
      "gemini",
      "deepseek",
      "mistral",
      "llama",
      "huggingface",
      "hugging face",
      "vector db",
      "vector database",
      "pinecone",
      "chromadb",
      "weaviate",
      "qdrant",
      "milvus",
      "ollama",
      "vllm",
      "groq",
      "prompt engineering",
      "prompt engineer",
      "llm engineer",
      "generative ai",
      "genai",
      "ai developer",
      "ai engineer",
      "fine tuning",
      "lora",
    ],
    primaryRole: "AI Engineer",
    secondaryRoles: [{ role: "Machine Learning Engineer", weight: 0.9 }],
    category: "ai",
    matchedChips: ["Generative AI", "LLMs", "RAG Pipelines", "Vector DBs"],
    explanation:
      "We recommend AI Engineer because your search focuses on generative AI, foundation model integration, and agentic workflows.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 23. MACHINE LEARNING: TENSORFLOW & PYTORCH
  // =========================================================================
  {
    keywords: [
      "tensorflow",
      "pytorch",
      "keras",
      "scikit-learn",
      "sklearn",
      "xgboost",
      "lightgbm",
      "deep learning",
      "neural networks",
      "cnn",
      "rnn",
      "lstm",
      "transformers ml",
      "computer vision",
      "opencv",
      "yolo",
      "nlp",
      "natural language processing",
      "bert",
      "mlops",
      "mlflow",
      "kubeflow",
      "wandb",
      "weights and biases",
      "machine learning",
      "ml",
      "machine learning engineer",
      "ml engineer",
      "deep learning engineer",
    ],
    primaryRole: "Machine Learning Engineer",
    secondaryRoles: [{ role: "Data Scientist", weight: 0.91 }],
    category: "ai",
    matchedChips: ["PyTorch", "TensorFlow", "Deep Learning", "Model Training"],
    explanation:
      "We recommend Machine Learning Engineer because PyTorch and TensorFlow are foundational frameworks for training and productionizing neural network models.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 24. DATA SCIENCE & ANALYTICS
  // =========================================================================
  {
    keywords: [
      "data science",
      "data scientist",
      "pandas",
      "numpy",
      "scipy",
      "matplotlib",
      "seaborn",
      "statistics",
      "hypothesis testing",
      "econometrics",
      "tableau",
      "power bi",
      "powerbi",
      "jupyter",
      "jupyter notebook",
      "r programming",
      "r language",
      "data analyst",
      "data analysis",
      "business intelligence",
      "bi analyst",
      "feature engineering",
      "a/b testing",
    ],
    primaryRole: "Data Scientist",
    secondaryRoles: [{ role: "Machine Learning Engineer", weight: 0.89 }],
    category: "tool",
    matchedChips: ["Data Science", "Statistical Modeling", "Pandas", "BI Analytics"],
    explanation:
      "We recommend Data Scientist because your search centers on data exploration, statistical inference, predictive analytics, and business insights.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 25. DEVOPS: DOCKER & CONTAINERS
  // =========================================================================
  {
    keywords: [
      "docker",
      "docker compose",
      "dockerfile",
      "containerization",
      "containers",
      "podman",
      "containerd",
      "docker swarm",
    ],
    primaryRole: "DevOps Engineer",
    secondaryRoles: [{ role: "Cloud Engineer", weight: 0.92 }],
    category: "devops",
    matchedChips: ["Docker", "Containers", "OCI", "Microservices"],
    explanation:
      "We recommend DevOps Engineer because Docker is the universal standard for containerizing applications across CI/CD and production environments.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 26. DEVOPS: KUBERNETES & ORCHESTRATION
  // =========================================================================
  {
    keywords: [
      "kubernetes",
      "k8s",
      "helm",
      "helm charts",
      "argo cd",
      "argocd",
      "flux cd",
      "istio",
      "service mesh",
      "linkerd",
      "k8s cluster",
      "kubectl",
    ],
    primaryRole: "DevOps Engineer",
    secondaryRoles: [{ role: "Cloud Engineer", weight: 0.93 }],
    category: "devops",
    matchedChips: ["Kubernetes", "K8s", "Helm", "Orchestration"],
    explanation:
      "We recommend DevOps Engineer because Kubernetes is the industry benchmark for orchestrating container workloads, auto-scaling, and cluster reliability.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 27. DEVOPS: CI/CD & INFRASTRUCTURE AS CODE
  // =========================================================================
  {
    keywords: [
      "ci/cd",
      "cicd",
      "ci cd",
      "jenkins",
      "github actions",
      "gitlab ci",
      "circleci",
      "bitbucket pipelines",
      "terraform",
      "opentofu",
      "ansible",
      "puppet",
      "chef",
      "infrastructure as code",
      "iac",
      "prometheus",
      "grafana",
      "datadog",
      "new relic",
      "elk stack",
      "sre",
      "site reliability",
      "site reliability engineer",
      "devops",
      "devops engineer",
      "linux",
      "bash",
      "shell scripting",
    ],
    primaryRole: "DevOps Engineer",
    secondaryRoles: [{ role: "Cloud Engineer", weight: 0.91 }],
    category: "devops",
    matchedChips: ["CI/CD", "Terraform", "Monitoring", "Site Reliability"],
    explanation:
      "We recommend DevOps Engineer because continuous delivery pipelines, infrastructure as code, and observability are fundamental to modern DevOps practices.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 28. CLOUD: AWS (AMAZON WEB SERVICES)
  // =========================================================================
  {
    keywords: [
      "aws",
      "amazon web services",
      "ec2",
      "s3",
      "aws lambda",
      "lambda",
      "cloudformation",
      "dynamodb",
      "rds",
      "ecs",
      "eks",
      "fargate",
      "route 53",
      "sqs",
      "sns",
      "iam aws",
      "aws solutions architect",
      "aws cloud",
      "cloud engineer",
      "cloud architect",
      "cloud computing",
    ],
    primaryRole: "Cloud Engineer",
    secondaryRoles: [{ role: "DevOps Engineer", weight: 0.92 }],
    category: "cloud",
    matchedChips: ["AWS", "Cloud Architecture", "Serverless", "IAM"],
    explanation:
      "We recommend Cloud Engineer because AWS is the world's most widely adopted cloud platform powering modern enterprise infrastructure and serverless solutions.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 29. CLOUD: AZURE
  // =========================================================================
  {
    keywords: [
      "azure",
      "microsoft azure",
      "azure functions",
      "azure devops",
      "aks",
      "azure blob",
      "azure blob storage",
      "entra id",
      "active directory",
      "cosmos db",
      "azure solutions architect",
    ],
    primaryRole: "Cloud Engineer",
    secondaryRoles: [{ role: "DevOps Engineer", weight: 0.91 }],
    category: "cloud",
    matchedChips: ["Azure", "Cloud Solutions", "Entra ID", "Enterprise Cloud"],
    explanation:
      "We recommend Cloud Engineer because Azure provides leading cloud infrastructure, serverless runtimes, and enterprise identity management.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 30. CLOUD: GCP (GOOGLE CLOUD PLATFORM)
  // =========================================================================
  {
    keywords: [
      "gcp",
      "google cloud",
      "google cloud platform",
      "cloud run",
      "gke",
      "cloud functions",
      "bigquery",
      "pubsub",
      "cloud storage gcp",
      "anthos",
      "firebase",
    ],
    primaryRole: "Cloud Engineer",
    secondaryRoles: [{ role: "DevOps Engineer", weight: 0.91 }],
    category: "cloud",
    matchedChips: ["Google Cloud", "Cloud Run", "GKE", "Managed Cloud"],
    explanation:
      "We recommend Cloud Engineer because Google Cloud delivers industry-leading managed container platforms, global networking, and data infrastructure.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 31. CYBERSECURITY: PENETRATION TESTING & ETHICAL HACKING
  // =========================================================================
  {
    keywords: [
      "penetration testing",
      "pen testing",
      "pentest",
      "pentesting",
      "ethical hacking",
      "ethical hacker",
      "kali linux",
      "metasploit",
      "burp suite",
      "nmap",
      "wireshark",
      "owasp",
      "vulnerability assessment",
      "red teaming",
      "bug bounty",
      "tryhackme",
      "hackthebox",
      "ctf",
    ],
    primaryRole: "Cyber Security Analyst",
    category: "security",
    matchedChips: ["Penetration Testing", "Ethical Hacking", "Kali Linux", "Burp Suite"],
    explanation:
      "We recommend Cyber Security Analyst because penetration testing and ethical hacking simulate attacker tactics to uncover critical software defenses.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 32. CYBERSECURITY: DEFENSE, SIEM & INFOSEC
  // =========================================================================
  {
    keywords: [
      "cyber security",
      "cybersecurity",
      "cyber security analyst",
      "information security",
      "infosec",
      "security engineer",
      "siem",
      "splunk",
      "soc",
      "soc analyst",
      "cryptography",
      "reverse engineering",
      "malware analysis",
      "firewall",
      "network security",
      "zero trust",
      "cissp",
      "ceh",
      "comptia security+",
      "iam security",
    ],
    primaryRole: "Cyber Security Analyst",
    category: "security",
    matchedChips: ["SIEM", "SOC Analyst", "Network Security", "Zero Trust"],
    explanation:
      "We recommend Cyber Security Analyst because threat hunting, incident response, SIEM telemetry, and network security safeguard enterprise ecosystems.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 33. UI/UX & PRODUCT DESIGN: FIGMA
  // =========================================================================
  {
    keywords: [
      "figma",
      "figma design",
      "adobe xd",
      "sketch",
      "sketch app",
      "framer",
      "invision",
      "miro",
      "zeplin",
      "ui/ux",
      "ui ux",
      "ui/ux designer",
      "product designer",
      "product design",
      "ui designer",
      "ux designer",
      "interaction designer",
      "user research",
      "wireframing",
      "prototyping",
      "design system",
      "design systems",
      "usability testing",
      "information architecture",
      "visual design",
    ],
    primaryRole: "UI/UX Designer",
    category: "design",
    matchedChips: ["Figma", "Design Systems", "Wireframing", "User Research"],
    explanation:
      "We recommend UI/UX Designer because Figma is the industry standard for creating comprehensive design systems, high-fidelity prototypes, and user flows.",
    baseConfidence: 98,
  },

  // =========================================================================
  // 34. SOFTWARE ENGINEER & CORE CS FOUNDATIONS
  // =========================================================================
  {
    keywords: [
      "software engineer",
      "software developer",
      "swe",
      "sde",
      "sde 1",
      "sde 2",
      "sde-1",
      "sde-2",
      "sde i",
      "sde ii",
      "programmer",
      "coder",
      "computer science",
      "dsa",
      "data structures",
      "algorithms",
      "leetcode",
      "codeforces",
      "system design",
      "oop",
      "object oriented programming",
      "clean code",
      "c++",
      "c",
      "competitive programming",
      "core engineering",
    ],
    primaryRole: "Software Engineer",
    category: "title",
    matchedChips: ["Software Engineer", "DSA", "System Design", "OOP"],
    explanation:
      "We recommend Software Engineer because your search focuses on core computer science foundations, algorithms, system design, and product engineering.",
    baseConfidence: 99,
  },

  // =========================================================================
  // 35. DATABASES & DATA STORAGE
  // =========================================================================
  {
    keywords: [
      "sql",
      "postgresql",
      "postgres",
      "mysql",
      "sqlite",
      "mongodb",
      "redis",
      "cassandra",
      "couchdb",
      "neo4j",
      "prisma",
      "supabase",
      "firebase db",
      "dynamodb db",
      "database developer",
      "database administrator",
    ],
    primaryRole: "Backend Developer",
    secondaryRoles: [{ role: "Full Stack Engineer", weight: 0.91 }],
    category: "database",
    matchedChips: ["PostgreSQL", "SQL", "Redis", "Database Indexing"],
    explanation:
      "We recommend Backend Developer because database schema design, indexing, ACID consistency, and caching are critical server-side responsibilities.",
    baseConfidence: 96,
  },

  // =========================================================================
  // 36. SOFTWARE TESTING & SDET
  // =========================================================================
  {
    keywords: [
      "software tester",
      "software testing",
      "qa engineer",
      "qa",
      "sdet",
      "selenium",
      "playwright",
      "cypress",
      "jest",
      "mocha",
      "junit",
      "pytest",
      "automation testing",
      "test automation",
    ],
    primaryRole: "Software Engineer",
    secondaryRoles: [{ role: "Backend Developer", weight: 0.9 }],
    category: "testing",
    matchedChips: ["Automation Testing", "SDET", "Playwright", "CI Quality"],
    explanation:
      "We recommend Software Engineer (with SDET specialization) because automated testing frameworks and quality engineering guarantee reliable software delivery.",
    baseConfidence: 95,
  },
];
