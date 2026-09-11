-- Migration 002: Add Onboarding & Placement Readiness fields to public.profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_mentor TEXT DEFAULT 'athena',
ADD COLUMN IF NOT EXISTS target_role TEXT,
ADD COLUMN IF NOT EXISTS target_companies JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS connected_accounts JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS readiness_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
