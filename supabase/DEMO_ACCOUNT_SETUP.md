# CareerCompass — Staff Demonstration Account Setup & Operational Guide

## Purpose
The **Staff Demonstration Account** (`careercompass.demo@example.com`) is a dedicated testing identity designed for repeated presentations to college staff, recruiters, and leadership.

When logging into this account, CareerCompass treats it as a brand-new student who has never completed onboarding. The demonstration begins at Step 1 (Welcome) and walks through the entire 9-step calibration flow before delivering the student to the live Dashboard Command Center.

Existing personal and test accounts that have already completed onboarding (`onboarding_completed = true`) are completely unaffected and continue routing directly to `/dashboard`.

---

## 1. Manual Account Creation in Supabase

Because passwords must never be stored in source code or client-side bundles, create the demonstration user manually in your Supabase project:

### Step 1: Create the User in Supabase Authentication
1. Go to your **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Set the fields:
   - **Email**: `careercompass.demo@example.com`
   - **Password**: Choose a secure demonstration password (e.g. `StaffDemo2026!`).
   - **Auto Confirm User**: `Enabled` (Check "Auto Confirm" so no email verification link is required).
4. Click **Create User**.

### Step 2: Verify Initial Profile State
Upon user creation, the existing PostgreSQL trigger `on_auth_user_created` automatically creates a corresponding row in `public.profiles`.

Run the following query in the **Supabase SQL Editor** to verify the initial state:

```sql
SELECT
  id,
  email,
  name,
  onboarding_completed,
  selected_mentor,
  target_role
FROM public.profiles
WHERE email = 'careercompass.demo@example.com';
```

**Expected Result:**
- `onboarding_completed`: `FALSE`
- `selected_mentor`: `'athena'` (or `'dev_sen'`)
- `target_role`: `NULL`

> If for any reason `onboarding_completed` is `TRUE`, run the reset script in Section 4 below.

---

## 2. Conducting the Staff Demonstration

### Step 1: Sign In
1. Navigate to `/login` on CareerCompass.
2. Enter:
   - **Email**: `careercompass.demo@example.com`
   - **Password**: Your configured demo password.
3. Click **Sign In to CareerCompass**.

### Step 2: Post-Auth Routing
- The server checks `profiles.onboarding_completed`.
- Because `onboarding_completed = FALSE`, you are automatically redirected to `/onboarding`.

### Step 3: Walk Through the 9-Step Onboarding Calibration
1. **Welcome**: Introduction to CareerCompass Placement Readiness Engine.
2. **AI Companion Selection**: Choose between *Athena, Nova, Atlas, Byte, Sage, or Raven*. The UI live-updates to the companion's signature theme.
3. **Dream Role**: Search any framework or developer term (e.g. `.NET`, `React`, `Docker`, `Unity`). Show the AI role-matching confidence score and rationale.
4. **Target Companies**: Select tier-1 targets (e.g. Google, Microsoft, Amazon).
5. **Education**: Select degree, department, college, and graduation year (derives semester baseline).
6. **Skills**: Select languages, frameworks, and databases with interactive verification checks.
7. **Practical Experience**: Assess Git hygiene, project depth, and DSA problem readiness.
8. **Connected Accounts**: Connect or input GitHub, LeetCode, Codeforces handles.
9. **Synthesis / Diagnostic Report**: Live deterministic placement readiness calculation (`readinessScore`, level, timeline, strengths, and priority gaps).

### Step 4: Finalization & Transition to Dashboard
- Clicking **Enter My Placement Command Center** calls `saveOnboardingAction()`.
- Supabase updates `public.profiles`:
  - Stores all selected fields.
  - Sets `onboarding_completed = TRUE`.
- The user is redirected to `/dashboard`.
- Subsequent logins to `careercompass.demo@example.com` now go directly to `/dashboard`.

---

## 3. Resetting the Demo Account for Repeated Presentations

To demonstrate the fresh onboarding flow again for another staff member, you can reset the account using either of the following two safe methods:

### Method A: In-App Reset (Fastest & Safest)
1. Log in to `careercompass.demo@example.com`.
2. Navigate to `/settings` (Settings & Preferences).
3. Scroll to **Section 3: Account Operations**.
4. The dedicated card **"Staff Demo Presentation Controls"** will be visible (it only appears for demo accounts).
5. Click **[Reset Demo Onboarding (Return to Step 1)]**.
6. The server securely marks `onboarding_completed = false`, resets onboarding fields on this account only, clears local storage, and redirects directly to Step 1 (`/onboarding`).

### Method B: Manual Supabase SQL Reset
Run this script directly in the **Supabase SQL Editor**:

```sql
UPDATE public.profiles
SET
  onboarding_completed = FALSE,
  target_role = NULL,
  target_companies = '[]'::jsonb,
  education = '{}'::jsonb,
  skills = '{}'::jsonb,
  experience = '{}'::jsonb,
  connected_accounts = '{}'::jsonb,
  readiness_score = 0,
  selected_mentor = 'athena',
  updated_at = NOW()
WHERE email = 'careercompass.demo@example.com';
```

---

## 4. Security & Safety Principles

1. **Zero Client Passwords**: No demonstration passwords or sensitive secrets are stored anywhere in client-side code, Git history, or documentation.
2. **Strict RLS Enforcement**: Row Level Security (`auth.uid() = id`) guarantees that users can only mutate their own profile data.
3. **Restricted Server Action**: `resetDemoOnboardingAction` verifies on the server that the session email matches the designated demo identity before executing the update.
4. **Isolated Scope**: Resetting the demo account never alters or deletes real user accounts or active test profiles.
