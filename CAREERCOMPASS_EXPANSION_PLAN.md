# CareerCompass — Master Product Expansion & Implementation Plan

> **Document Type**: Architecture & Engineering Specification  
> **Status**: Approved Planning & Architectural Blueprint  
> **Target System**: Next.js 16 / TypeScript 5 / Supabase / Multi-Provider Career OS  

---

## Executive Summary & System Philosophy

CareerCompass is evolving from an onboarding and diagnostics SaaS into a **Continuous Career Operating System**. The platform unifies candidate self-evaluations, conceptual micro-verifications, external coding telemetry, project repositories, target employer hiring benchmarks, and structured engineering roadmaps into a continuous feedback loop.

### Core Operating Principles:
1. **Zero Fabrication**: No simulated achievements, fake LeetCode numbers, or synthetic placement guarantees. Readiness is always calibrated as a deterministic preparation estimate.
2. **Explicit Verification Tiers**: Every competency and piece of evidence is labeled as either `Self-Reported`, `Verified (Micro-assessment)`, or `Evidence-Backed (Repository/Platform link)`.
3. **Deterministic Core + Layered AI**: Core evaluations, gap matrices, and progression logic remain deterministic, transparent, and reproducible. AI is utilized solely for context-aware explanation, query coaching, and news distillation.

---

## Part 1 — Comprehensive Codebase Audit & Architectural State

```
+----------------------------------------------------------------------------------------------------+
|                                    CareerCompass Current Architecture                              |
+----------------------------------------------------------------------------------------------------+
|  [Presentation Layer]                                                                              |
|    - AppPageShell / DashboardSidebar (Collapsible SaaS Shell, Theme V2, usePathname active state)  |
|    - Routes: /dashboard, /roadmap, /skills, /companies, /experience, /insights, /settings          |
|    - Modals: SkillCheckModal, SkillDetailModal, TaskDetailModal                                    |
|                                                                                                    |
|  [Deterministic Intelligence Layer]                                                                |
|    - lib/dashboard-intelligence.ts  -> Placement Readiness Index (6 Pillars), Daily Missions       |
|    - lib/roadmap-intelligence.ts    -> 6-Phase Milestone Curriculum & Task Progression             |
|    - lib/skills-intelligence.ts     -> Skill Inventory, Micro-assessments & Hiring Gap Matrix      |
|    - lib/company-matcher.ts         -> Verified Employer Benchmark Calibration (40+ Companies)     |
|    - lib/academic-intelligence.ts   -> Graduation Runway & Placement Season Timing                 |
|    - lib/practical-experience.ts    -> 7-Dimension Proof-of-Work Profiler                          |
|                                                                                                    |
|  [Data & Auth Foundation]                                                                          |
|    - Supabase Auth (Email/Password, Google OAuth, Test Account mode)                               |
|    - Tables: public.profiles, public.user_activity                                                 |
|    - Server Loader: lib/user-profile-server.ts (Server-side profile resolution & safe fallback)    |
+----------------------------------------------------------------------------------------------------+
```

### Component Status Matrix:
- **Authentication**: `IMPLEMENTED` (Supabase Auth, SSR middleware, session validation).
- **Onboarding Flow (9 Steps)**: `IMPLEMENTED` (Multi-step wizard with local + cloud persistence).
- **Dashboard Command Center**: `IMPLEMENTED` (Real routing to all dedicated pages, zero fake streaks).
- **Interactive Career Roadmap**: `IMPLEMENTED` (Expandable 6-phase curriculum, task detail sheets).
- **Skills Intelligence Workspace**: `IMPLEMENTED` (Categorized inventory, in-situ verification, gap matrix).
- **Companies View**: `PARTIAL` (Displaying calibrations; OA simulator and curated question banks are planned).
- **Experience View**: `PARTIAL` (Displaying 7 dimensions; GitHub commit parser and OAuth hooks are planned).
- **Insights View**: `PARTIAL` (Displaying strategic drivers; market salary feeds are planned).
- **Settings View**: `IMPLEMENTED` (Theme V2 engine, mentor switcher, session controls).

---

## Part 2 — Detailed Subsystem Architecture for Expanded Vision

```
                               +-----------------------------+
                               |     Authenticated User      |
                               +--------------+--------------+
                                              |
                                              v
                               +-----------------------------+
                               |   Master Profile Identity   |
                               | (Role, Companies, Evidence) |
                               +--------------+--------------+
                                              |
                                              v
                               +-----------------------------+
                               |   Deterministic Readiness   |
                               |    & Gap Detection Loop     |
                               +--------------+--------------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
                     v                        v                        v
        +-------------------------+  +------------------+  +----------------------+
        | Problem Recommendation  |  | Career Roadmap   |  | Live News & Insights |
        | Engine (LeetCode, etc.) |  | Execution Engine |  | (Company & Skill)    |
        +------------+------------+  +--------+---------+  +----------+-----------+
                     |                        |                       |
                     +------------------------+-----------------------+
                                              |
                                              v
                               +-----------------------------+
                               |    Global Notifications     |
                               |     & Next Best Action      |
                               +-----------------------------+
```

### A & B. Coding Platform & Multi-Platform Problem Intelligence
- **External Data Availability Audit**:
  - *LeetCode*: No official public REST API exists. Public profile endpoints (GraphQL at `https://leetcode.com/graphql`) expose public problem counts (Easy/Medium/Hard) and recent public submission timestamps. User-specific accepted code requires session cookies (which violates LeetCode ToS and is insecure).
  - *Architecture Solution*:
    1. A **Curated Normalized Problem Catalog** stored in Supabase with metadata (ID, title, slug, platform, difficulty, topic tags, role relevance, company tags).
    2. **Self-Verification & Problem Logging Workflow**: Students mark problems as attempted/completed with self-reported confidence and time spent.
    3. **Public Profile Telemetry**: Sync public problem solve count from LeetCode / Codeforces public handles via server-side read-only queries (with strict caching to avoid rate-limiting).
- **Supported Providers**: LeetCode, Codeforces, HackerRank, GeeksforGeeks.

### C & D. Personalized Problem Recommendation & Post-Problem Feedback
- **Recommendation Scoring Formula**:
  $$\text{ProblemScore} = w_{\text{gap}} \cdot \text{SkillGapWeight} + w_{\text{role}} \cdot \text{RoleRelevance} + w_{\text{comp}} \cdot \text{CompanyTagMatch} - \text{Penalty}_{\text{Solved}}$$
- **Feedback Dimensionality**:
  - *Confidence Level*: `Couldn't start` | `Understood idea` | `Needed hints` | `Solved with help` | `Solved independently`
  - *Perceived Difficulty*: `Too easy` | `Right level` | `Hard` | `Very hard`
  - *Primary Friction*: `Concept misunderstanding` | `Approach failure` | `Coding error` | `Complexity issue` | `Edge cases`
- **Feedback Ingestion**: If friction is `Concept misunderstanding`, future recommendations prioritize foundational easy problems and concept reviews before suggesting medium application problems.

### E. Doubt / Query / Career Coach System ("Ask CareerCompass")
- **Architecture**: A context-aware query engine designed with a modular abstraction layer (`interface AICoachProvider`).
- **Context Payload**: Automatically injects current problem details, target role, roadmap milestone, target companies, and recent assessment scores into the prompt template.
- **Privacy & Safety**: Strips PII before forwarding context; stores session dialogues securely in PostgreSQL with user RLS isolation.

### F. Global Notification Center
- **Categories**: `Career`, `Skills`, `Roadmap`, `Problems`, `Companies`, `News`, `Evidence`, `System`.
- **Delivery Model**: Supabase Realtime pub/sub combined with indexed database records for read/unread state management and priority filtering (`Urgent`, `High`, `Standard`, `Digest`).

### G & H. Live Company, Skill & Role News Feed
- **External Integration Audit**:
  - Direct scraping is prohibited. Free public news APIs (e.g. GNews, NewsAPI) have strict developer limits (50-100 req/day) and attribution requirements.
  - *Recommended Approach*: A scheduled server-side cron worker that ingests curated public RSS feeds (e.g. Hacker News API, official engineering tech blogs from Google/Microsoft/Uber, and standard tech feeds), categorizes articles by company and technology slug, caches them in `public.news_articles`, and presents a filtered stream with clear source links and `"Why this matters to you"` contextual highlights.

### I. Multi-Companion Switching & Theme Integration
- Reuses the existing `CompanionThemeContext` and `MENTOR_PERSONAS`. Switching active mentor updates `profiles.selected_mentor`, triggering real-time theme CSS variable reconfiguration (`--cc-primary`, `--cc-glow`, `--cc-surface`) and modifying coaching dialogue tones across the dashboard, skills, and roadmap pages.

### J & K. Alternative Career Discovery & Horizontal Swipeable Cards
- **Alternative Role Scoring**: Runs all 14 standard roles against candidate evidence to detect high-confidence secondary alignments without disparaging the primary choice.
- **Swipeable Interaction**: Uses Framer Motion's `drag="x"` with physics constraints (`dragConstraints={{ left: 0, right: 0 }}`, `dragElastic={0.2}`) with desktop arrow controls, auto-pause on hover/drag, and full keyboard arrow navigation.

### L & M. Resume Intelligence & Master Career Profile Variants
- **Master Profile Aggregator**: Pulls verified education, verified skills, GitHub repositories, and coding telemetry into a unified structured resume schema.
- **Variant Engine**: Supports generating multiple role-tailored resume presentations (`Software Engineer`, `AI Engineer`, `Fullstack`, `Frontend`) with customizable emphasis without inventing achievements.

### N, O & P. Industry Intelligence, Interview Prep & Mock Assessment Engine
- **Curated Multi-Domain Question Bank**: 5 DSA questions, 5 CS fundamentals, 4 role-specific architecture questions, 3 company hiring criteria, and 3 STAR behavioral scenarios.
- **Deterministic Evaluation**: Computes segmented section scores and maps weaknesses directly to specific roadmap tasks and problem recommendations.

---

## Part 3 — Proposed Database Schema & Entity Model

```sql
-- 1. Coding Problems Catalog (Global / Cached)
CREATE TABLE public.coding_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL, -- 'leetcode', 'codeforces', 'hackerrank'
    external_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    url TEXT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    role_relevance JSONB DEFAULT '{}',
    company_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Problem Attempts & Practice Telemetry (User-specific)
CREATE TABLE public.user_problem_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.coding_problems(id),
    status VARCHAR(50) NOT NULL, -- 'attempted', 'solved_independent', 'solved_with_help'
    confidence VARCHAR(50) NOT NULL,
    difficulty_feedback VARCHAR(50) NOT NULL,
    primary_friction VARCHAR(100),
    notes TEXT,
    time_spent_minutes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Global Notifications (User-specific)
CREATE TABLE public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'standard',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_href TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Curated News Articles (Global / Ingested)
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    matched_companies TEXT[] DEFAULT '{}',
    matched_skills TEXT[] DEFAULT '{}',
    matched_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Mock Assessment Runs (User-specific)
CREATE TABLE public.mock_assessment_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role VARCHAR(100) NOT NULL,
    total_score INT NOT NULL,
    max_score INT NOT NULL,
    breakdown JSONB NOT NULL,
    weakest_areas TEXT[] DEFAULT '{}',
    strongest_areas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Part 4 — External Platform Integration & Capability Audit

| Integration / Service | Status | Mechanism / Feasibility | Limitations & Risk Mitigation |
| :--- | :--- | :--- | :--- |
| **LeetCode** | `LIMITED` | Read-only public GraphQL query for total solves count & contest rating | Private submission code is inaccessible without session cookies (disallowed). Rely on verified problem logging and public handle stats. |
| **Codeforces** | `SUPPORTED` | Official public REST API (`/user.info`, `/user.status`) | Fully supported for public contest rank, solve counts, and submission logs without authentication. |
| **GitHub** | `SUPPORTED` | GitHub REST API v3 / OAuth apps | Public repos, stars, language breakdowns, and commit frequency verified cleanly via standard token. |
| **HackerRank / GFG** | `LIMITED` | Public profile badge scraping is discouraged | Manual profile handle association with self-reported milestone completion. |
| **Industry News** | `POSSIBLE` | RSS Feeds + Tech blog aggregators | Avoid high-cost per-request news APIs; use server-side scheduled RSS ingestion with Redis/DB caching. |
| **AI LLM Provider** | `POSSIBLE` | Google Gemini API / Anthropic API / OpenAI API | Secure server-side route handler execution with prompt boundary guards and tenant rate limiting. |

---

## Part 5 — Security, Privacy & Data Isolation Strategy

1. **Row Level Security (RLS)**: Mandatory `auth.uid() = user_id` policies on all user-owned tables (`user_problem_attempts`, `user_notifications`, `mock_assessment_runs`).
2. **External Token Encryption**: If OAuth tokens (e.g. GitHub) are stored, they must be stored in encrypted vaults using Supabase Vault or AES-256 server-side encryption.
3. **No Client-Exposed API Keys**: All external API integrations (News feeds, AI queries, GitHub sync) must run exclusively inside Next.js Server Actions or Route Handlers.
4. **Rate Limiting & Abuse Protection**: IP and user-based rate limiting on all verification and coaching endpoints to prevent automated spam.

---

## Part 6 — Master Phased Implementation Roadmap

```
Phase 7:  Skills Intelligence Workspace                     [COMPLETED]
Phase 8:  Coding Problem Intelligence & Normalization Model [COMPLETED]
Phase 9:  Post-Problem Feedback & Adaptive Recommendation Engine [NEXT]
Phase 10: Global Notification Center & Activity PubSub
Phase 11: Contextual Company, Skill & Role News Feed
Phase 12: Alternative Career Discovery & Swipeable Insight Cards
Phase 13: Resume Intelligence & Role-Specific Variant Builder
Phase 14: Industry Intelligence & Public Interview Prep Engine
Phase 15: Full Mock Assessment & Diagnostic Evaluation Engine
Phase 16: External Telemetry & GitHub Evidence Sync
Phase 17: Multi-Companion Switching & Persona Deepening
Phase 18: Unified Career Operating Loop & Autonomous Recalibration
```

### Next Phase Specification (Phase 9):
- **Objective**: Post-Problem Feedback & Adaptive Recommendation Engine — Expand the post-solve feedback loop with companion-driven reflection, adaptive difficulty adjustment, and targeted drill recommendations.

---

## Part 7 — Verification & Cleanliness Check

- **TypeScript Compilation (`npx tsc --noEmit`)**: `0 errors` (PASSED)
- **ESLint Validation (`npm run lint`)**: `0 errors` (PASSED)
- **Production Build (`npm run build`)**: `0 errors` (PASSED across all 28 app routes including `/problems`)

