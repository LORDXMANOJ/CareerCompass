import { OnboardingState } from "@/types";
import { MENTOR_PERSONAS } from "@/constants";

export interface MentorStepAdvice {
  title: string;
  speech: string;
  actionPrompt: string;
  focusBadge: string;
  audioQuote?: string;
  statsHighlight?: { label: string; value: string };
}

/**
 * Step-by-step personalized coach engine.
 * Delivers dynamic commentary in the authentic voice and personality of the selected mentor.
 */
export function getMentorCoachAdvice(
  mentorId: string,
  step: number,
  state: OnboardingState
): MentorStepAdvice {
  const mentor = MENTOR_PERSONAS.find((m) => m.id === mentorId) || MENTOR_PERSONAS[0];
  const role = state.targetRole || "Software Engineer";
  const companiesCount = state.targetCompanies.length;
  const companiesStr = state.targetCompanies.slice(0, 2).join(" & ") || "your target firms";
  const sem = state.education.graduationYear
    ? Math.min(8, Math.max(1, 8 - (parseInt(state.education.graduationYear, 10) - new Date().getFullYear()) * 2))
    : 6;

  switch (step) {
    case 3: // Dream Role
      switch (mentor.id) {
        case "athena":
          return {
            title: `Academic Foundation for ${role}`,
            speech: `Focusing on ${role} provides clarity to your curriculum. We'll map standard course prerequisites directly to this path so your coursework counts toward placement readiness.`,
            actionPrompt: "Confirm the career track that aligns best with your interests.",
            focusBadge: "Syllabus Alignment",
            statsHighlight: { label: "Target Path", value: role },
          };
        case "nova":
          return {
            title: `Proof of Work for ${role}`,
            speech: `Love the choice of ${role}! Top startups care about what you build, not just what's on paper. We're going to build and deploy 2 kick-ass projects that recruiters can actually test.`,
            actionPrompt: "Pick the role you're excited to ship code for.",
            focusBadge: "Shipped Projects",
            statsHighlight: { label: "Focus Track", value: role },
          };
        case "atlas":
          return {
            title: `FAANG Benchmark for ${role}`,
            speech: `${role} roles at Tier-1 companies test fundamentals ruthlessly. We will calibrate your preparation bar against actual engineering standards at Google, Meta and Amazon.`,
            actionPrompt: "Lock in your target role to benchmark against global hiring bars.",
            focusBadge: "High-Performance Bar",
            statsHighlight: { label: "Benchmark", value: role },
          };
        case "byte":
          return {
            title: `Let's Code for ${role}!`,
            speech: `Sweet pick! As a ${role}, you'll be writing real code, catching elusive bugs, and drinking lots of coffee. Let's make sure your syntax is bulletproof and your Git graph is green.`,
            actionPrompt: "Select your role and let's get into the terminal.",
            focusBadge: "Terminal Ready",
            statsHighlight: { label: "Dev Role", value: role },
          };
        case "sage":
          return {
            title: `Market Opportunity: ${role}`,
            speech: `Targeting ${role} is an optimal strategic move. Industry hiring telemetry shows consistent demand for strong foundational problem solvers in this track.`,
            actionPrompt: "Confirm your career trajectory for market alignment.",
            focusBadge: "Market Telemetry",
            statsHighlight: { label: "Trajectory", value: role },
          };
        case "raven":
          return {
            title: `No Fluff: ${role} Standard`,
            speech: `You picked ${role}. Good. Now understand this: thousands of graduates apply for the exact same title. Only real competency separates you from the rejection pile. Let's get to work.`,
            actionPrompt: "Lock in your choice and prepare to back it up with results.",
            focusBadge: "Zero Fluff",
            statsHighlight: { label: "Standard", value: role },
          };
        default:
          return {
            title: `Target Role: ${role}`,
            speech: `We've calibrated your roadmap toward ${role}. Let's make every preparation step count.`,
            actionPrompt: "Select your dream career path.",
            focusBadge: "Target Selected",
          };
      }

    case 4: // Dream Companies
      switch (mentor.id) {
        case "athena":
          return {
            title: `Target Alignment: ${companiesCount} Companies`,
            speech:
              companiesCount > 0
                ? `You've shortlisted ${companiesStr}. We'll examine their past hiring question patterns and structure your weekly schedule systematically.`
                : "Select 2–5 companies that represent your ambition. Each company tests specific core subjects.",
            actionPrompt: "Add target companies from our verified intelligence directory.",
            focusBadge: "Pattern Analysis",
            statsHighlight: { label: "Target List", value: `${companiesCount} Companies` },
          };
        case "nova":
          return {
            title: `Ecosystem Mapping: ${companiesStr}`,
            speech:
              companiesCount > 0
                ? `Targeting ${companiesStr}? Awesome. Notice how you can type tech stacks like 'React' or 'VS Code' and our intelligence engine maps to the mothership? Build what they use!`
                : "Pick your dream companies. Even search ecosystems like AWS, Flutter, or PyTorch.",
            actionPrompt: "Search by company name, tool, or tech ecosystem.",
            focusBadge: "Tech Ecosystem",
            statsHighlight: { label: "Locked In", value: `${companiesCount} Targets` },
          };
        case "atlas":
          return {
            title: `Hiring Standards: ${companiesStr}`,
            speech:
              companiesCount > 0
                ? `These organizations have demanding technical screening rounds. We will benchmark your problem-solving speed and algorithmic complexity against their rubric.`
                : "Select companies known for rigorous engineering bars.",
            actionPrompt: "Lock in 3 or more companies to calibrate your readiness threshold.",
            focusBadge: "Interview Rubric",
            statsHighlight: { label: "Benchmark Pool", value: `${companiesCount} Companies` },
          };
        case "byte":
          return {
            title: `Targeting ${companiesStr}`,
            speech:
              companiesCount > 0
                ? `Nice lineup! Getting into ${companiesStr} means passing coding tests without breaking a sweat. We'll make sure segfaults and off-by-one errors don't stand in your way.`
                : "Search any company or even tools like Docker, Git, or Android to find the parent company!",
            actionPrompt: "Pick your dream team and let's conquer their coding rounds.",
            focusBadge: "Coding Bar",
            statsHighlight: { label: "Target Set", value: `${companiesCount} Selected` },
          };
        case "sage":
          return {
            title: `Strategic Target Portfolio`,
            speech:
              companiesCount >= 3
                ? `A well-balanced target portfolio (${companiesCount} selected). Mixing hyper-growth product firms with established tech leaders maximizes your interview hit rate.`
                : "We recommend shortlisting at least 3 companies to build a robust placement pipeline.",
            actionPrompt: "Maintain a balanced mix of dream and competitive companies.",
            focusBadge: "Portfolio Balance",
            statsHighlight: { label: "Portfolio Size", value: `${companiesCount} Companies` },
          };
        case "raven":
          return {
            title: `Calibrate to ${companiesStr}`,
            speech:
              companiesCount > 0
                ? `${companiesStr} don't hand out offers for participation trophies. Their acceptance rate is under 2%. If you want a seat, your execution has to be flawless.`
                : "Add the companies you genuinely want to work for. Then prepare to earn it.",
            actionPrompt: "Set your target companies. Don't lower your standards.",
            focusBadge: "Strict Standards",
            statsHighlight: { label: "Target", value: `${companiesCount} Companies` },
          };
        default:
          return {
            title: `Target Companies`,
            speech: `You've targeted ${companiesCount} companies. We will prepare you specifically for their hiring standards.`,
            actionPrompt: "Choose your dream companies.",
            focusBadge: "Target Pool",
          };
      }

    case 5: // Education & Academic Intelligence
      switch (mentor.id) {
        case "athena":
          return {
            title: "Academic Runway & Syllabus Integration",
            speech: `With your current academic progress, we can seamlessly interleave college exams with placement topics. The timeline shows your optimal preparation window.`,
            actionPrompt: "Verify your graduation year and semester details.",
            focusBadge: "Academic Runway",
            statsHighlight: { label: "Timeline", value: `Semester ${sem}` },
          };
        case "nova":
          return {
            title: "Turn College Time into Proof of Work",
            speech: `Don't just collect attendance. Use your remaining college semesters to build real projects, publish code, and stand out from thousands of identical resumes!`,
            actionPrompt: "Check your academic timeline and roadmap milestones.",
            focusBadge: "Proof of Work",
            statsHighlight: { label: "Runway", value: "Active" },
          };
        case "atlas":
          return {
            title: "Engineering Calendar Optimization",
            speech: `We align your prep to placement season drives. The timeline marks exactly when your first technical assessments will open. Precision timing is everything.`,
            actionPrompt: "Inspect the graduation timeline and readiness estimation.",
            focusBadge: "Placement Schedule",
            statsHighlight: { label: "Readiness", value: "Calibrated" },
          };
        case "byte":
          return {
            title: "Semester Sprint Mode",
            speech: `Semester ${sem} is prime time! You know enough theory to be dangerous; now let's turn that into clean, working code that lands you an offer.`,
            actionPrompt: "Review your academic card and click any roadmap stage for details.",
            focusBadge: "Sprint Active",
            statsHighlight: { label: "Current Sem", value: `Sem ${sem}` },
          };
        case "sage":
          return {
            title: "Deterministic Academic Analysis",
            speech: `Your timeline compounds into a distinct preparation advantage. We've mapped out the exact weeks required for DSA, projects, and interview loops.`,
            actionPrompt: "Examine the readiness calculation and career risk analysis.",
            focusBadge: "Compounding Growth",
            statsHighlight: { label: "Trajectory", value: "Optimal" },
          };
        case "raven":
          return {
            title: "Runway Is Fixed. Execute.",
            speech: `Your college isn't going to get you placed on its name alone. Your graduation date is locked. You either put in the work now or scramble later. Let's make every week count.`,
            actionPrompt: "Check your verified timeline and prepare for the skills assessment.",
            focusBadge: "Accountability",
            statsHighlight: { label: "Discipline", value: "100%" },
          };
        default:
          return {
            title: "Academic Intelligence",
            speech: "Your academic background forms the anchor for your personalized roadmap.",
            actionPrompt: "Verify academic profile.",
            focusBadge: "Profile Active",
          };
      }

    case 6: // Skills Assessment
      return {
        title: `${mentor.name}'s Skills Strategy`,
        speech:
          mentor.id === "nova"
            ? "Show me your real stack! A student who knows React + Node + built 5 projects beats a student who just watched tutorials all day."
            : mentor.id === "raven"
            ? "Be completely honest with your skills. Self-delusion gets exposed in minute 5 of a live coding interview."
            : `Select the programming languages and frameworks you can write code in today. We will build your learning curve from here.`,
        actionPrompt: "Catalog your active languages, frameworks and AI tools.",
        focusBadge: "Skill Graph",
        statsHighlight: { label: "Category", value: "Technical Stack" },
      };

    case 7: // Experience & Projects
      return {
        title: `${mentor.name}'s Proof of Work Check`,
        speech:
          mentor.id === "nova"
            ? "This is where the magic happens! Projects are your unfair advantage. Let's see what you've shipped and your Git habits."
            : mentor.id === "atlas"
            ? "Production-grade code and solid DSA consistency are non-negotiable for premier engineering roles."
            : "Tell us about your project volume, Git workflow, and algorithmic problem-solving level.",
        actionPrompt: "Record your hands-on experience and DSA problem-solving depth.",
        focusBadge: "Proof of Work",
        statsHighlight: { label: "Evaluation", value: "Practical Skills" },
      };

    case 8: // Connected Accounts
      return {
        title: `${mentor.name}'s Verification Hub`,
        speech:
          mentor.id === "byte"
            ? "Link that GitHub profile! A vibrant commit history and a few LeetCode badges give recruiters instant validation."
            : mentor.id === "athena"
            ? "Connecting your coding profiles enables CareerCompass to pull automated telemetry and verify your strengths."
            : "Connect your GitHub, LeetCode, or upload a resume to unlock your deep synthesis report.",
        actionPrompt: "Verify your public coding platforms or skip to report generation.",
        focusBadge: "Verification",
        statsHighlight: { label: "Profiles", value: "Coding Links" },
      };

    case 9: // Synthesis Report
      return {
        title: `${mentor.name}'s Launch Briefing`,
        speech: `Diagnostic report generated! I have synthesized your targets, academic timeline, technical baseline, and roadmap into an actionable blueprint. Let's take the first step together!`,
        actionPrompt: "Review your comprehensive diagnostic and enter your dashboard.",
        focusBadge: "Synthesis Complete",
        statsHighlight: { label: "Readiness", value: "Generated" },
      };

    default:
      return {
        title: `${mentor.name} is Ready`,
        speech: `Welcome to CareerCompass. I will be your companion throughout your preparation journey.`,
        actionPrompt: "Continue to setup your career path.",
        focusBadge: "Career Compass",
      };
  }
}
