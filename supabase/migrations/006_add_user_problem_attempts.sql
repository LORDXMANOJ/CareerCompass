-- Migration 006: Normalized User Problem Attempts & Practice Telemetry
--
-- Provides normalized persistence for authentic problem attempt logs,
-- self-reported confidence, perceived difficulty, and primary friction points.

CREATE TABLE IF NOT EXISTS public.user_problem_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'attempted' | 'solved_with_help' | 'solved_independent' | 'skipped'
    confidence VARCHAR(50) NOT NULL, -- 'couldnt_start' | 'understood_idea' | 'needed_hints' | 'solved_with_help' | 'solved_independently'
    perceived_difficulty VARCHAR(50) NOT NULL, -- 'too_easy' | 'right_level' | 'hard' | 'very_hard'
    primary_friction VARCHAR(100) DEFAULT 'none',
    time_spent_minutes INT DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performant telemetry aggregations
CREATE INDEX IF NOT EXISTS user_problem_attempts_user_idx ON public.user_problem_attempts(user_id);
CREATE INDEX IF NOT EXISTS user_problem_attempts_problem_idx ON public.user_problem_attempts(problem_id);
CREATE INDEX IF NOT EXISTS user_problem_attempts_user_problem_idx ON public.user_problem_attempts(user_id, problem_id);
CREATE INDEX IF NOT EXISTS user_problem_attempts_created_at_idx ON public.user_problem_attempts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_problem_attempts ENABLE ROW LEVEL SECURITY;

-- Enforce strict isolation: Users can only select, insert, update, or delete their own attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_problem_attempts' AND policyname = 'Users can view their own problem attempts'
  ) THEN
    CREATE POLICY "Users can view their own problem attempts"
      ON public.user_problem_attempts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_problem_attempts' AND policyname = 'Users can insert their own problem attempts'
  ) THEN
    CREATE POLICY "Users can insert their own problem attempts"
      ON public.user_problem_attempts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_problem_attempts' AND policyname = 'Users can update their own problem attempts'
  ) THEN
    CREATE POLICY "Users can update their own problem attempts"
      ON public.user_problem_attempts FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_problem_attempts' AND policyname = 'Users can delete their own problem attempts'
  ) THEN
    CREATE POLICY "Users can delete their own problem attempts"
      ON public.user_problem_attempts FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
