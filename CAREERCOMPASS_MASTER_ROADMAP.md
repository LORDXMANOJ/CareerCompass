# CareerCompass — Complete Product Roadmap & Staff Presentation Guide

## Purpose

This is the master implementation and presentation roadmap for CareerCompass. It is intended to be usable when ChatGPT is unavailable during a staff presentation.

CareerCompass is evolving into a **Personal Career Operating System**: a system that understands a student's academic stage, target role, target companies, skills, gaps, experience, coding practice, evidence, interview preparation, resume needs, and career alternatives, then continuously recommends the next useful action.

> **Execution rule:** Implement one phase at a time. Verify it before starting the next phase. Never allow an agent to implement all remaining phases autonomously.

---

# 1. Product Vision

CareerCompass should continuously answer:

- What should I learn next?
- Why should I learn it?
- What coding problem should I solve?
- Why this problem?
- What roadmap milestone matters now?
- Which skill gap is most important?
- Which target-company expectation should I prepare for?
- What interview topic needs work?
- What evidence is missing from my profile?
- Which alternative role is also a strong fit?

The system should move through this loop:

```text
Student Goal
    ↓
Academic Context
    ↓
Dream Role
    ↓
Target Companies
    ↓
Skills
    ↓
Skill Gaps
    ↓
Roadmap
    ↓
Daily Practice
    ↓
Problem
    ↓
Attempt
    ↓
Feedback
    ↓
Evidence
    ↓
Readiness Update
    ↓
Recommendations
    ↓
Interview Preparation
    ↓
Resume
    ↓
Industry Signals
    ↓
Career Recalibration
    ↓
Student Goal
```

---

# 2. Core Principles

## 2.1 Zero Fabrication

Never invent:

- solved problems
- GitHub activity
- LeetCode submissions
- academic achievements
- skills
- project evidence
- company requirements
- interview performance
- resume facts
- historical activity

If information is unavailable, show an honest state such as:

- Not verified
- Self-reported
- No data yet
- Not enough data
- Verification unavailable

## 2.2 Verification Tiers

### Verified

Supported by a legitimate source or direct assessment.

Examples:

- successful skill micro-assessment
- legitimate GitHub evidence
- authenticated provider evidence

### Self-Reported

Entered by the student but not independently verified.

Examples:

- "I know React"
- "I have completed three projects"

### Inferred

Computed from evidence.

Examples:

- readiness score
- skill-gap priority
- role fit
- recommended daily workload

The UI must not silently turn self-reported information into verified information.

## 2.3 Deterministic Core + Layered AI

Use deterministic logic for:

- daily practice budget
- problem ranking
- skill-gap calculations
- readiness calculations
- role matching
- difficulty distribution

AI may later provide:

- explanations
- natural-language coaching
- contextual answers
- resume wording
- interview coaching

AI must not silently replace evidence.

## 2.4 No Private Platform Scraping

Never request or store:

- LeetCode passwords
- private session cookies
- browser session tokens
- unauthorized platform credentials

Prefer:

- official APIs
- public APIs
- public data
- OAuth
- curated catalogs
- self-reported verification

---

# 3. Current Architecture

## Main Routes

- `/dashboard`
- `/roadmap`
- `/skills`
- `/problems`
- `/companies`
- `/experience`
- `/insights`
- `/settings`
- `/onboarding`

## Presentation

- `AppPageShell`
- collapsible `DashboardSidebar`
- reusable page views
- Framer Motion
- Tailwind
- shadcn/ui

## Intelligence

Existing modules include:

- `dashboard-intelligence.ts`
- `roadmap-intelligence.ts`
- `skills-intelligence.ts`
- `company-matcher.ts`
- `academic-intelligence.ts`
- `practical-experience.ts`
- `problem-intelligence.ts`
- `daily-practice-intelligence.ts`

Reuse these modules. Do not create duplicate intelligence engines.

## Authentication / Data

- Supabase Auth
- email/password
- Google OAuth
- `public.profiles`
- `public.user_activity`
- RLS

---

# 4. Current Completed Work

## Phase 1 — Foundation

Completed.

## Phase 2 — Authentication and Onboarding

Completed.

The onboarding flow is:

1. Welcome
2. Companion selection
3. Dream Role
4. Dream Companies
5. Education
6. Skills
7. Practical Experience
8. Account Connections
9. Synthesis / Diagnostic

## Phase 3 — Career / Academic Intelligence

Completed.

## Phase 4 — Dashboard Foundation

Completed.

## Phase 5 — Dashboard Command Center Integration

Completed.

Dashboard connects to:

- Roadmap
- Skills
- Problems
- Companies
- Experience
- Insights
- Settings

## Phase 6 — Interactive Career Roadmap

Completed.

The roadmap contains phases, tasks, skill gaps, task details and problem connections.

## Phase 7 — Skills Intelligence Workspace

Completed.

Includes:

- categorized skill inventory
- skill verification
- skill gaps
- role relevance
- company relevance
- connections to Problem Lab

## Phase 8 — Coding Problem Intelligence / Problem Lab

Completed as the initial Problem Lab foundation.

Includes:

- normalized problem model
- LeetCode catalog
- Codeforces catalog
- topics
- role relevance
- company tags
- deterministic recommendations
- solved tracking
- attempt history
- confidence
- difficulty feedback
- friction
- notes
- external links

Private submission scraping is intentionally not used.

---

# 5. Current Companion Upgrade

The persistent companion has been implemented as a foundation.

The companion should:

- remain fixed on dashboard pages
- remain visible when the speech bubble closes
- use the existing six personas
- use existing companion themes
- detect current route
- provide contextual guidance
- open an expandable mentor panel
- support keyboard interaction
- respect reduced motion
- avoid unnecessary polling

Six companions:

- Athena
- Nova
- Atlas
- Byte
- Sage
- Raven

## Final companion concept

The character is persistent.

The speech bubble is temporary.

The mentor panel is expandable.

Do not turn every card hover into a large popup.

The companion should feel like a mentor living inside CareerCompass, not like a tooltip.

---

# 6. Adaptive Daily Practice Foundation

The daily practice system has been implemented as a foundation.

## Semester Baselines

Current implementation:

| Academic stage | Base daily recommendation |
|---|---:|
| Semester 1–2 | 3 |
| Semester 3–4 | 6 |
| Semester 5–6 | 10 |
| Semester 7–8 | 12 |
| Graduated / placement | 15 |

The recommendation is bounded between 2 and 20.

## Dynamic Factors

The budget can change based on:

- readiness
- recent solve rate
- friction
- pending foundational gaps

The budget is a recommendation, NOT a hard limit.

If the recommendation is 8 and the student solves 12:

`12 solved / 8 recommended`

The system must not block the student.

## Difficulty Distribution

Beginner:

- mostly Easy
- some Medium
- no Hard by default

Intermediate:

- Easy
- mostly Medium
- some Hard

Advanced:

- some Easy
- mostly Medium
- meaningful Hard practice

## Daily Practice Score

The score must be based on actual recorded activity.

If zero problems are solved:

**No score yet**

Never fabricate a score.

Current score components:

- completion rate
- solve rate
- confidence
- difficulty handling

Future versions can add:

- consistency
- improvement
- time/effort
- skill progression

## Dashboard

Today's Practice should show:

- recommended count
- completed count
- solved count
- Easy target
- Medium target
- Hard target
- Daily Practice Score
- 7-day consistency

---

# 7. Important Current Bug — RESOLVED

A previous runtime error occurred:

`Maximum update depth exceeded`

The stack involved:

`useProblemTracker.syncDailyPlan` (lib/hooks/use-problem-tracker.ts)
and:
`TodaysPracticeCard.useEffect` (components/dashboard/todays-practice-card.tsx)
plus secondary Framer Motion `PresenceChild.onExit` update-depth errors.

### Root Cause Analysis

1. `syncDailyPlan` declared `dailyPlan` as a dependency in `useCallback(..., [userId, attempts, dailyPlan])`.
2. Inside `syncDailyPlan`, `initializeDailyPlan` was called and its result passed to `setDailyPlan(plan)`.
3. `initializeDailyPlan` unconditionally returned a new object reference with an updated `updatedAt` timestamp on every call, even when computed progress metrics were identical.
4. Calling `setDailyPlan` with the new reference updated `dailyPlan` state.
5. Because `dailyPlan` changed, `syncDailyPlan` generated a new callback reference.
6. The changed callback reference re-triggered `useEffect` in `TodaysPracticeCard` and `ProblemsPageView`, creating an infinite synchronous re-render cycle.
7. Framer Motion's `<AnimatePresence>` evaluated `PresenceChild.onExit` on every synchronous cycle, producing the secondary error.

### Resolution Implemented

1. **Reference Equality in `initializeDailyPlan`**: Deep-compares `completedCount`, `solvedCount`, `attemptedCount`, `dailyScore`, `completionRate`, `averageConfidence`, `primaryFriction`, and `status`. If all are identical to `existingPlan`, it returns `existingPlan` directly, preserving reference identity.
2. **Decoupled Callbacks in `useProblemTracker`**:
   - Added `attemptsRef` and `dailyPlanRef` to read current state without callback invalidation.
   - Removed `dailyPlan` from `syncDailyPlan` dependencies (`deps: [userId]`), providing a 100% stable function identity.
   - Guarded `setDailyPlan`: only called when `plan !== currentPlan`.
   - Stabilized `getBudget` and `logAttempt`.
   - Memoized the returned `UseProblemTrackerResult` object.
3. **Consumer Stabilization**: Cleaned up dependencies in `TodaysPracticeCard` and `ProblemsPageView`.
4. **Verification**:
   - `npm run lint`: 0 errors, 0 warnings
   - `npx tsc --noEmit`: 0 errors
   - `npm run build`: Exit code 0 (28/28 pages compiled and generated successfully).

---

# 8. Problem Catalog Expansion — COMPLETED

The catalog has been expanded to **125 normalized problems**:
- **LeetCode** (85 problems): Full Blind 75 core problem set + 10 algorithmic extensions across Arrays, Strings, Hash Maps, Two Pointers, Sliding Window, Binary Search, Linked Lists, Trees, BSTs, Heaps, Graphs, Dynamic Programming, Intervals, and Bit Manipulation.
- **Codeforces** (40 problems): Div 2 A/B/C curated practice problem set with verified problem URLs and tags.
- All entries include valid direct URLs, primary topic categorization, difficulty rating, secondary tags, role relevance mapping, and company tags linked to verified tech companies.
- Zero private scraping or session cookie requirements. Everything is grounded in curated public catalogs.

---

# 9. Phase 9 — Post-Problem Feedback & Adaptive Recommendation Engine

## Goal

Turn Problem Lab into a learning loop.

After every attempt, collect:

- attempted/solved
- confidence
- perceived difficulty
- friction
- time spent
- notes

Then adapt future recommendations.

## Example

If a student repeatedly struggles with Graphs:

- recommend prerequisite Graph problems
- emphasize BFS/DFS
- lower difficulty when necessary
- rebuild foundations

If the student consistently solves Medium problems confidently:

- increase Medium exposure
- introduce selected Hard problems

If the student repeatedly fails Hard problems:

- do not simply recommend more Hard problems
- identify prerequisite gaps

## Final loop

```text
Profile
 ↓
Skill Gap
 ↓
Problem
 ↓
Attempt
 ↓
Feedback
 ↓
Updated Gap
 ↓
Next Problem
```

This phase should also influence future Daily Practice.

---

# 10. Phase 10 — Global Notification Center

## Goal

Create a global notification system.

Categories:

- Career
- Skills
- Roadmap
- Problems
- Companies
- News
- Evidence
- System

## Potential Data Model

`user_notifications`

Fields:

- id
- user_id
- category
- priority
- title
- message
- action_href
- is_read
- created_at

RLS must enforce:

`auth.uid() = user_id`

## UI

Add:

- notification icon
- unread count
- notification panel
- history
- read/unread state
- action links

Never generate fake notifications.

---

# 11. Phase 11 — Contextual Industry / Company / Skill News

## Goal

Give users relevant industry information based on:

- dream role
- target companies
- skills

## Preferred sources

- official engineering blogs
- official technology blogs
- RSS feeds
- legitimate public sources

Avoid aggressive scraping.

## Experience

Do not merely show:

"Microsoft released X."

Instead show:

### Why this matters to you

Explain relevance to:

- role
- skill
- company target

## Data Model

Potential table:

`news_articles`

Fields:

- source_name
- title
- summary
- url
- published_at
- matched_companies
- matched_skills
- matched_roles

Cache news instead of requesting it on every page load.

---

# 12. Phase 12 — Alternative Career Discovery

## Goal

Identify roles where the student's evidence suggests a strong fit.

Current standard roles:

- Software Engineer
- Backend Developer
- Frontend Developer
- Full Stack Engineer
- AI Engineer
- Machine Learning Engineer
- Data Scientist
- DevOps Engineer
- Cloud Engineer
- Cyber Security Analyst
- Android Engineer
- iOS Engineer
- UI/UX Designer
- Game Developer

## UX Rule

Never force a career change.

Use:

"You also show a strong fit for Backend Developer."

not:

"You should switch careers."

## Swipeable Dashboard Cards

Use Framer Motion for:

- horizontal swipe
- desktop arrows
- keyboard navigation
- automatic rotation
- pause while interacting

Cards should explain the evidence behind the fit.

---

# 13. Phase 13 — Resume Intelligence

## Goal

Build resume content from actual CareerCompass evidence.

Possible sources:

- education
- verified skills
- GitHub evidence
- projects
- coding telemetry
- verified certifications

## Strict rule

Never invent achievements.

Do not turn self-reported information into verified information.

## Role-Specific Variants

Examples:

- Software Engineer
- Backend Developer
- AI Engineer
- Data Scientist

Variants can change:

- emphasis
- ordering
- skills
- project priority
- relevant keywords

without fabricating experience.

---

# 14. Phase 14 — Industry Intelligence & Interview Preparation

## Goal

Create an industry expectations workspace.

Inputs:

- industry
- target role
- target company

Outputs:

- expected skills
- common interview topics
- public interview question patterns
- technical preparation
- behavioral preparation
- company preparation where legitimately sourced

## Study Before Interview

Example topics:

- Arrays
- Trees
- Graphs
- SQL
- Operating Systems
- Networking
- System Design
- Behavioral STAR

Every preparation item should connect back to:

- Skills
- Problems
- Roadmap

---

# 15. Phase 15 — Full Mock Assessment

## Goal

Create a diagnostic mock assessment.

Initial proposed structure:

- 5 DSA questions
- 5 CS fundamentals
- 4 role-specific architecture questions
- 3 company/hiring-criteria questions
- 3 STAR behavioral questions

Counts may evolve.

## Results

Compute:

- total score
- maximum score
- category breakdown
- strongest areas
- weakest areas

Potential database table:

`mock_assessment_runs`

Fields:

- user_id
- target_role
- total_score
- max_score
- breakdown
- weakest_areas
- strongest_areas
- created_at

## Diagnostic connection

If assessment identifies:

`Graphs`

then:

```text
Assessment weakness
      ↓
Skills gap
      ↓
Roadmap priority
      ↓
Problem recommendations
      ↓
Daily Practice
      ↓
Companion guidance
```

---

# 16. Phase 16 — External Telemetry & Evidence Sync

## GitHub

Potential legitimate evidence:

- repositories
- languages
- commits
- pull requests
- recent activity
- project evidence

Use GitHub REST API and/or OAuth where appropriate.

## Codeforces

Potential public API evidence:

- profile
- submissions
- ratings
- contest activity
- problem activity

Respect API rate limits and cache results.

## LeetCode

Use only legitimate public or officially supported mechanisms.

Possible public information may include:

- public profile data
- public counts
- public recent activity where available

Do not use private session cookies.

Do not request passwords.

If private submission verification is unavailable, keep:

**I Solved This**

as the safe fallback.

## Other Providers

HackerRank and GeeksForGeeks should be treated as limited unless reliable legitimate integration is available.

Do not build fragile private scraping.

---

# 17. Phase 17 — Multi-Companion Switching & Persona Deepening

## Goal

Make the six companions meaningfully different.

Each companion can eventually have:

- personality
- visual identity
- communication style
- theme
- coaching strengths
- reaction states

## Companion States

Possible:

- idle
- thinking
- encouraging
- success
- concern
- recommendation

## Themes

Each companion should eventually support a professional website-wide theme.

Examples:

- pitch black
- black/gray
- light/white
- Material-inspired

The user should be able to customize:

- background theme
- accent color

Accent should flow through:

- buttons
- bullets
- checkboxes
- highlights
- borders
- progress indicators

---

# 18. Phase 18 — Unified Career Operating Loop

This is the final major architecture.

```text
Goal
 ↓
Academic Context
 ↓
Role
 ↓
Companies
 ↓
Skills
 ↓
Gaps
 ↓
Roadmap
 ↓
Daily Practice
 ↓
Problem
 ↓
Attempt
 ↓
Feedback
 ↓
Evidence
 ↓
Readiness
 ↓
Recommendations
 ↓
Interview Prep
 ↓
Resume
 ↓
Industry Signals
 ↓
Recalibration
 ↓
Goal
```

CareerCompass becomes a continuously adapting system rather than a static dashboard.

---

# 19. Problem Provider Architecture

Long-term provider architecture:

```text
Problem Provider Layer
        |
        +-- CareerCompass Curated Catalog
        |
        +-- Codeforces Public API
        |
        +-- Legitimate LeetCode Data
        |
        +-- HackerRank where legitimately supported
        |
        +-- GeeksForGeeks where legitimately supported
        |
        +-- Future Providers
        |
        ↓
Normalized CodingProblem
        ↓
Problem Intelligence
        ↓
Daily Recommendation
```

The rest of CareerCompass should use the normalized problem model rather than provider-specific models.

---

# 20. Adaptive Daily Problem Budget

The daily workload should NOT be a fixed limit.

Semester provides a baseline.

Then adjust using:

- readiness
- recent success
- confidence
- friction
- skill gaps
- role
- placement proximity
- recent workload

Example:

### Early student

3 recommended problems.

### Intermediate student

6–8 recommended problems.

### Senior student

10–15 recommended problems.

### Placement preparation

12–20 recommended problems depending on readiness and recent workload.

The goal is learning quality, not maximum quantity.

---

# 21. Daily Practice Score Philosophy

Do not reward quantity alone.

A student solving five relevant challenging problems can be progressing better than a student clicking through twenty Easy problems.

The score should eventually consider:

- completion
- solve rate
- confidence
- difficulty
- consistency
- improvement
- time/effort
- skill progression

If no real data exists:

**No score yet**

not a fabricated number.

---

# 22. Dashboard End State

The Dashboard should eventually provide:

## Career Command Center

- readiness
- current roadmap phase
- highest-priority skill gap
- target companies
- today's practice
- daily practice score
- 7-day trend
- alternative role fit
- relevant industry news
- notifications
- persistent companion

The dashboard is the command center.

The Problem Lab is the practice engine.

The Roadmap is the execution plan.

The Skills system is the capability map.

The Companion is the mentor layer.

---

# 23. Staff Demo Account

Create one dedicated Supabase Auth account for staff demonstrations.

Example documentation identity:

`careercompass.demo@example.com`

Do not store a real password in source code.

The account should begin with:

`onboarding_completed = false`

Then staff can demonstrate:

```text
Login
 ↓
Welcome
 ↓
Companion Selection
 ↓
Dream Role
 ↓
Dream Companies
 ↓
Education
 ↓
Skills
 ↓
Practical Experience
 ↓
Connections
 ↓
Synthesis
 ↓
Dashboard
```

After onboarding:

`onboarding_completed = true`

Future login:

`Dashboard`

For repeated presentations, reset only the demo account's onboarding fields.

Never provide a public arbitrary-user reset endpoint.

---

# 24. Staff Presentation Story

## Opening

"CareerCompass first understands the student before recommending anything."

## Companion

"The companion is a persistent mentor, not just a chatbot popup."

## Dream Role

"The student's desired career becomes a major input into the intelligence system."

## Companies

"Target companies influence relevance."

## Education

"Academic stage influences readiness and practice workload."

## Skills

"CareerCompass distinguishes self-reported skills from verified skills."

## Experience

"Experience contributes to readiness, while unsupported claims remain clearly marked."

## Connections

"External evidence is collected only through legitimate mechanisms."

## Diagnostic

"Onboarding becomes a personalized career profile."

## Dashboard

"The system does not stop after onboarding."

## Problem Lab

"CareerCompass gives the student a targeted daily practice workload instead of a random list."

## Feedback

"After solving, the student reports confidence, difficulty and friction. This eventually improves recommendations."

## Roadmap

"The roadmap and problem practice are connected."

## Future System

"The same evidence can drive resume generation, interview preparation, alternative career discovery and industry intelligence."

---

# 25. Manual Verification Checklist

Before staff presentation:

- [ ] Demo login works
- [ ] Demo account starts at Welcome
- [ ] Companion selection works
- [ ] Dream role selection works
- [ ] Company selection works
- [ ] Education works
- [ ] Skills verification works
- [ ] Experience works
- [ ] Connections work
- [ ] Diagnostic completes
- [ ] Dashboard loads
- [ ] Companion remains fixed
- [ ] Companion speech bubble works
- [ ] Mentor panel works
- [ ] Companion does not block important UI
- [ ] Today's Practice appears
- [ ] Problem Lab appears
- [ ] Problems have real links
- [ ] I Solved This works
- [ ] Feedback saves
- [ ] Daily progress updates
- [ ] Daily score is honest
- [ ] No score appears before actual solving
- [ ] Data survives refresh
- [ ] Roadmap links to problems
- [ ] Skills links to problems
- [ ] No fabricated history
- [ ] No private platform credentials are requested
- [ ] RLS remains enabled
- [x] Runtime update-depth error is fixed (State decoupled, equality check implemented)
- [x] `npm run lint` passes (0 errors, 0 warnings)
- [x] `npx tsc --noEmit` passes (0 errors)
- [x] `npm run build` passes (Production build successful, all 28 routes compiled)
- [x] Problem catalog expanded (125 problems: 85 LeetCode + 40 Codeforces)

---

# 26. Coding-Agent Execution Rules

For every phase:

1. Inspect existing architecture.
2. Reuse existing components and intelligence.
3. Identify existing data structures.
4. Avoid duplicate state.
5. Avoid duplicate database structures.
6. Define verification states.
7. Define empty states.
8. Define failure behavior.
9. Define security requirements.
10. Implement only that phase.
11. Run lint.
12. Run TypeScript.
13. Run production build.
14. Report exact changes.
15. Stop.

Never give an agent permission to implement all future phases in one run.

---

# 27. Browser / Localhost Rule

Do not open localhost or use browser automation unless explicitly requested.

Normal agent verification should use:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual browser testing can be performed separately by the developer.

Do not claim runtime behavior was verified unless it was actually tested.

---

# 28. Database Safety

Whenever a migration is created:

- inspect the current schema first
- preserve existing RLS
- do not weaken policies
- do not assume the migration has been executed
- clearly report whether manual Supabase execution is required

User-owned tables should normally use:

`auth.uid() = user_id`

Do not expose service-role keys to client code.

---

# 29. Final Product Definition

CareerCompass should ultimately feel like:

## Personal Career Mentor
+
## Career Roadmap
+
## Skills Verification
+
## Coding Practice Planner
+
## Evidence Tracker
+
## Interview Coach
+
## Resume Intelligence
+
## Industry Intelligence
+
## Alternative Career Discovery

The companion is the human-facing mentor.

The intelligence engines are the decision layer.

The evidence system is the trust layer.

The dashboard is the command center.

The daily practice system is the continuous learning loop.

The student's career goal remains the center.

---

# 30. Final Phase Order

Recommended execution:

```text
CURRENT RUNTIME BUG FIX [COMPLETED]
        ↓
PROBLEM CATALOG EXPANSION / VERIFICATION [COMPLETED]
        ↓
PHASE 9
Post-Problem Feedback & Adaptive Recommendations
        ↓
PHASE 10
Global Notifications
        ↓
PHASE 11
Industry / Company / Skill News
        ↓
PHASE 12
Alternative Career Discovery
        ↓
PHASE 13
Resume Intelligence
        ↓
PHASE 14
Industry + Interview Preparation
        ↓
PHASE 15
Mock Assessment
        ↓
PHASE 16
External Evidence / Telemetry
        ↓
PHASE 17
Companion Deepening
        ↓
PHASE 18
Unified Career Operating Loop
```

---

# 31. Definition of Success

CareerCompass succeeds when a student can enter with a career goal and continuously receive evidence-backed answers to:

- What should I do next?
- Why?
- What should I practice?
- Why this problem?
- What skill is weakest?
- What should I study?
- Which company expectation matters?
- What interview topic needs work?
- What evidence is missing?
- What alternative role fits?

The application should continuously learn from legitimate evidence and student feedback while remaining transparent about what is verified, self-reported, inferred, or unavailable.

---

# END OF MASTER CAREERCOMPASS ROADMAP
