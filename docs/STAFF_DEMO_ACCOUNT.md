# CareerCompass — Staff Demonstration Account Setup & Operational Guide

## Purpose
The **Staff Demonstration Account** is a dedicated presentation identity designed for live demonstrations to college leadership, academic staff, and placement officers.

When logging into this account, CareerCompass treats it as a fresh student profile that has never completed onboarding. The demonstration begins at **Step 1 (Welcome)** and progresses through all 9 calibration steps before transitioning to the live Placement Command Center (`/dashboard`).

Existing real user accounts and test profiles that have completed onboarding (`onboarding_completed = true`) are completely unaffected and continue routing directly to `/dashboard`.

---

## 1. Demo Account Credentials & Specifications

- **Suggested Demo Email**: `careercompass.demo@example.com`
- **Password**: **MUST be set by the administrator in Supabase Dashboard** (never stored in source code, markdown, Git, or environment files).
- **Profile Display Name**: `CareerCompass Staff Demo`
- **Initial Onboarding Status**: `onboarding_completed = false`

---

## 2. Supabase Dashboard Setup Instructions

Because this repository enforces strict credential security and does not contain administrative `service_role` keys, the Auth user must be created directly in the Supabase Dashboard:

### Step 1: Create the User in Supabase Auth
1. Log in to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your CareerCompass project (`ifooupjfazfkypjtssoc`).
3. In the left sidebar, navigate to **Authentication** -> **Users**.
4. Click **Add User** -> **Create User**.
5. Fill in the modal:
   - **Email**: `careercompass.demo@example.com`
   - **Password**: Set a strong, memorable demonstration password of your choice.
   - **Auto Confirm User**: **Checked / Enabled** (ensures immediate login without waiting for an email confirmation link).
6. Click **Create User**.

### Step 2: Configure & Verify Profile in Supabase SQL Editor
When the Auth user is created, the PostgreSQL trigger `on_auth_user_created` creates a row in `public.profiles`. Verify and ensure its onboarding fields are calibrated by running this SQL script in the **Supabase SQL Editor**:

```sql
-- Verify and ensure the demo account profile is in a clean, fresh state
UPDATE public.profiles
SET
  name = 'CareerCompass Staff Demo',
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

-- Confirm initial profile state
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

**Expected Verification Output:**
| email | name | onboarding_completed | selected_mentor | target_role |
|---|---|:---:|:---:|:---:|
| `careercompass.demo@example.com` | `CareerCompass Staff Demo` | `false` | `athena` | `null` |

---

## 3. End-to-End Staff Demonstration Flow

1. **Sign In**:
   - Navigate to `/login`.
   - Enter `careercompass.demo@example.com` and your chosen demo password.
   - Click **Sign In to CareerCompass**.
2. **Deterministic Route Evaluation**:
   - Server helper `getPostAuthDestination` checks `profiles.onboarding_completed`.
   - Since `onboarding_completed = false`, the user is directed to `/onboarding`.
   - If the user attempts to manually navigate to `/dashboard`, the server page guard automatically redirects them back to `/onboarding`.
3. **Walkthrough of the 9 Calibration Steps**:
   1. **Welcome**: System overview & placement readiness introduction.
   2. **Companion Selection**: Select Athena, Nova, Atlas, Byte, Sage, or Raven (live visual theme transformation).
   3. **Dream Role**: AI role-matching confidence score & rationale (e.g. Full Stack, AI Engineer).
   4. **Dream Companies**: Tiered enterprise & startup selection (Google, Microsoft, Stripe, etc.).
   5. **Education**: Degree, major, semester calibration (derives semester problem budget).
   6. **Skills**: Languages, frameworks, and databases with micro-verification challenges.
   7. **Practical Experience**: Git workflow hygiene, production deployment evidence, DSA problem depth.
   8. **Account Connections**: Safe connection of public handles (GitHub, LeetCode, Codeforces).
   9. **Synthesis / Diagnostic Report**: Live deterministic placement readiness synthesis.
4. **Transition to Dashboard**:
   - Clicking **Enter My Placement Command Center** sets `onboarding_completed = true` in Supabase.
   - User is redirected to `/dashboard` Command Center.
   - Subsequent logins will now route directly to `/dashboard`.

---

## 4. Safe Reset Procedure (For Repeated Demonstrations)

To reset the demo account for another presentation without affecting any other user or deleting the Auth credentials:

### Method 1: Supabase SQL Editor (Recommended)
Run the following query in the **Supabase SQL Editor**:

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

### Method 2: In-App Settings Panel
1. Log in to CareerCompass as `careercompass.demo@example.com`.
2. Navigate to `/settings`.
3. Locate the **Staff Demo Presentation Controls** card (restricted to the demo email).
4. Click **Reset Demo Onboarding (Return to Step 1)**.
5. The server securely resets `onboarding_completed = false` and redirects to `/onboarding`.

---

## 5. Security & Safety Invariants

- **No Hard-coded Passwords**: Passwords and private API keys are never stored in code, commit history, or documentation.
- **No Backdoors**: There is no public unauthenticated reset API endpoint.
- **Row Level Security (RLS)**: RLS policies (`auth.uid() = id`) remain strictly enforced across all database tables.
- **Isolation**: Reset queries specifically filter by `WHERE email = 'careercompass.demo@example.com'`, preventing accidental modification of real student profiles.
