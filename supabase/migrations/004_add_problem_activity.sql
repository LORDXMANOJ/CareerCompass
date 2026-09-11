-- Migration 004: Document problem tracking fields in user_activity JSONB
--
-- The user_activity JSONB column (added in migration 003) now additionally stores:
--
--   problemAttempts: array of objects, each containing:
--     - problemId (string): Internal problem catalog ID
--     - status ('attempted' | 'solved_with_help' | 'solved_independent' | 'skipped')
--     - confidence ('couldnt_start' | 'understood_idea' | 'needed_hints' | 'solved_with_help' | 'solved_independently')
--     - difficultyFeedback ('too_easy' | 'right_level' | 'hard' | 'very_hard')
--     - primaryFriction ('concept_misunderstanding' | 'approach_failure' | 'coding_error' | 'complexity_issue' | 'edge_cases' | 'none')
--     - notes (text)
--     - timeSpentMinutes (integer)
--     - createdAt (ISO 8601 timestamp)
--
--   solvedProblemIds: array of string (problem IDs with status 'solved_independent' or 'solved_with_help')
--
-- No DDL change is needed. The JSONB column is schemaless and accepts arbitrary keys.
-- This migration exists purely for documentation and schema tracking purposes.

COMMENT ON COLUMN public.profiles.user_activity IS
  'Stores completedMissions, dsaSolvedCount, verifiedSkills, lastActive, problemAttempts[], and solvedProblemIds[]';
