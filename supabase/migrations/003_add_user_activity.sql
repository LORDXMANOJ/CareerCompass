-- Migration 003: Add user_activity column to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_activity JSONB DEFAULT '{"completedMissions": [], "dsaSolvedCount": 0, "verifiedSkills": [], "lastActive": null}'::jsonb;
