# CareerCompass — Technology Stack

## Frontend
- **Framework**: Next.js 16 (App Router, Server Components & Client Components)
- **UI Library**: React 19
- **Type System**: TypeScript 5 (Strict static typing across entire codebase)
- **Styling**: Tailwind CSS 3.4 + Custom CSS Token System (Theme V2)
- **Animations**: Framer Motion 13 (Micro-interactions, modals, and accordion transitions)
- **Icons**: Lucide React
- **Primitive Components**: Radix UI (Slot, Dropdown Menu, Checkbox, Label)
- **Class Utilities**: clsx, tailwind-merge, class-variance-authority

## Backend
- **Server Architecture**: Next.js Server Actions & Route Handlers (`app/auth/actions.ts`, `app/dashboard/actions.ts`, `app/api/verify-github/route.ts`)
- **Database / BaaS**: Supabase (PostgreSQL with Row Level Security)
- **SDK**: `@supabase/ssr` and `@supabase/supabase-js`
- **Data Access Patterns**: Server-side profile resolution with automatic fallback normalizers in `lib/user-profile-server.ts`

## Intelligence Layer
- **Dashboard Intelligence (`lib/dashboard-intelligence.ts`)**: 6-factor deterministic placement readiness index, dynamic mission generator, career insights, and Next Best Action selector.
- **Roadmap Intelligence (`lib/roadmap-intelligence.ts`)**: 6-phase engineering curriculum progression engine, status mapping, and milestone capstone calculators.
- **Skills Intelligence (`lib/skills-intelligence.ts`)**: Categorized technical inventory evaluator, hiring gap matrix, and priority gap ranking.
- **Career Role Intelligence (`constants/career-intelligence-data.ts`, `constants/roles.ts`)**: 500+ technology trigger parser mapping candidates to 14 standard industry roles.
- **Company Intelligence (`lib/company-matcher.ts`, `constants/companies-data.ts`)**: Tier-1 employer hiring difficulty analyzer, stack overlap matching, and preparation requirements.
- **Academic Intelligence (`lib/academic-intelligence.ts`, `constants/college-intelligence.ts`)**: College tier calibration, graduation runway calculator, and placement season forecasting.
- **Practical Experience Assessment (`lib/practical-experience.ts`)**: 7-dimension engineering evidence scorer (Git, Projects, Cloud/Deployment, APIs, Databases, Team Workflow, DSA).
- **Skill Verification Engine (`constants/skill-verification.ts`)**: Single-concept unambiguous baseline verification questions across 30+ core languages, frameworks, and databases.

## Authentication
- **Provider**: Supabase Auth
- **Mechanisms**: 
  - Email + Password (Sign up, login, confirm callback, password reset)
  - Google OAuth (`auth/login`, `auth/callback`)
  - Test Account Mode for Staff Review & Demo (`test@careercompass.ai`)

## Database
- **Tables Implemented**:
  - `public.profiles`: Stores authenticated user identity, target role, target companies, education, skills, experience, connected accounts, and companion preference.
  - `public.user_activity`: Stores completed daily mission IDs, individual task completion IDs, weekly missions counter, and DSA count.
- **Security**: Row Level Security (RLS) enabled on all tables with tenant isolation policies (`auth.uid() = id`).

## UI / Design System
- **Layout Shell**: `AppPageShell` with sticky header, contextual page actions, and breadcrumb badges.
- **Sidebar**: `DashboardSidebar` (Collapsible desktop sidebar with responsive mobile navigation and route tracking via `usePathname()`).
- **Companion System**: 6 Distinct Mentors (Athena, Nova, Atlas, Byte, Sage, Raven) with dedicated personality labels, thematic color palettes, atmospheric backlights, and tone presets.
- **Theme Infrastructure**: Companion Theme Context V2 supporting multi-hue Dark and Light modes (`--cc-bg`, `--cc-surface`, `--cc-text`, `--cc-primary`).

## Current Major Features
| Feature | Technology / System | Status |
| :--- | :--- | :--- |
| **Authentication** | Supabase Auth (Email + Google OAuth + Test Mode) | IMPLEMENTED |
| **9-Step Onboarding Flow** | React State + Local Storage + Supabase Persistence | IMPLEMENTED |
| **Companion Selection** | 6 Mentor Archetypes with Dynamic SVG / PNG Avatars | IMPLEMENTED |
| **Career Role Intelligence** | Deterministic Fuzzy Keyword Matcher (500+ techs) | IMPLEMENTED |
| **Company Intelligence** | Verified Dataset of 40+ Tech Companies & Hiring Bars | IMPLEMENTED |
| **Education Intelligence** | Indian / Global College & Semester Runway Calculator | IMPLEMENTED |
| **Skill Verification** | Micro-Concept Diagnostic Modal with Live Scoring | IMPLEMENTED |
| **Practical Experience** | 7-Dimension Proof-of-Work Diagnostic Breakdown | IMPLEMENTED |
| **Dashboard Command Center** | Multi-card Career Operating Center with Route Linking | IMPLEMENTED |
| **Interactive Career Roadmap** | 6-Phase Expandable Curriculum with Task Detail Modals | IMPLEMENTED |
| **Skills Intelligence Workspace** | Full Inventory, Verification Flow & Hiring Gap Matrix | IMPLEMENTED |
| **Target Companies View** | Company Prep Gauges & Stage Breakdown Previews | IMPLEMENTED |
| **Practical Experience View** | Proof-of-Work Metrics & Git / Project Evidence Status | IMPLEMENTED |
| **Career Insights View** | Strategic Drivers, Timelines & Risk Mitigation Matrix | IMPLEMENTED |
| **Settings & Preferences** | Theme Engine V2, Companion Switcher & Sign Out | IMPLEMENTED |

## Future Planned Integrations (PLANNED / NOT IMPLEMENTED)
- **LeetCode / Coding Platform Integration**: Official public profile sync and normalized problem recommendation engine.
- **Codeforces / HackerRank Providers**: Multi-platform problem solving telemetry and competitive rating ingest.
- **GitHub Deep Telemetry**: Webhook commit ingestion, repo language analyzer, and PR review verification.
- **Curated Industry & Company News**: Contextual news feed filtered by dream companies and target role.
- **LLM Career Doubt & Coaching System**: Context-aware AI coach powered by actual profile evidence.
- **Resume Intelligence & Variants Engine**: Automated generation of ATS-optimized role-specific resumes.
- **Comprehensive Mock Assessment Engine**: Multi-domain technical & behavioral timed evaluation rounds.
