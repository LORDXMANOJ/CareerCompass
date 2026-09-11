-- Migration 005: Adaptive Daily Practice & Problem Performance System
--
-- Extends user_activity JSONB documentation and provides optional normalized table.
--
-- 1. In profiles.user_activity JSONB, we now store:
--    - dailyPractice: {
--        date: string (YYYY-MM-DD local),
--        recommendedCount: integer,
--        easyTarget: integer,
--        mediumTarget: integer,
--        hardTarget: integer,
--        completedCount: integer,
--        solvedCount: integer,
--        attemptedCount: integer,
--        dailyScore: integer | null,
--        completionRate: float,
--        averageConfidence: float,
--        status: 'not_started' | 'in_progress' | 'completed' | 'exceeded',
--        problemIds: string[]
--      }
--    - dailyHistory: Array of {
--        date: string,
--        recommendedCount: integer,
--        completedCount: integer,
--        solvedCount: integer,
--        attemptedCount: integer,
--        dailyScore: integer | null
--      }
--
-- 2. Optional Normalized Schema for dedicated analytics queries:

CREATE TABLE IF NOT EXISTS public.user_daily_practice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_date DATE NOT NULL,
    recommended_count INT NOT NULL DEFAULT 8,
    easy_target INT NOT NULL DEFAULT 2,
    medium_target INT NOT NULL DEFAULT 5,
    hard_target INT NOT NULL DEFAULT 1,
    completed_count INT NOT NULL DEFAULT 0,
    solved_count INT NOT NULL DEFAULT 0,
    attempted_count INT NOT NULL DEFAULT 0,
    daily_score INT, -- null if 0 problems solved today
    completion_rate NUMERIC(4,3) DEFAULT 0.000,
    average_confidence NUMERIC(3,2) DEFAULT 0.00,
    average_difficulty NUMERIC(3,2) DEFAULT 1.50,
    primary_friction VARCHAR(100),
    status VARCHAR(30) DEFAULT 'not_started',
    recommended_problem_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT user_daily_practice_unique_user_date UNIQUE (user_id, practice_date)
);

-- Enable RLS
ALTER TABLE public.user_daily_practice ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only select and mutate their own records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_daily_practice' AND policyname = 'Users can view their own daily practice'
  ) THEN
    CREATE POLICY "Users can view their own daily practice"
      ON public.user_daily_practice FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_daily_practice' AND policyname = 'Users can insert their own daily practice'
  ) THEN
    CREATE POLICY "Users can insert their own daily practice"
      ON public.user_daily_practice FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_daily_practice' AND policyname = 'Users can update their own daily practice'
  ) THEN
    CREATE POLICY "Users can update their own daily practice"
      ON public.user_daily_practice FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

COMMENT ON COLUMN public.profiles.user_activity IS
  'Stores completedMissions, dsaSolvedCount, verifiedSkills, lastActive, problemAttempts[], solvedProblemIds[], dailyPractice, and dailyHistory[]';
