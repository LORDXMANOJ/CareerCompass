"use server";

import { createClient } from "@/lib/supabase/server";
import { UserActivity } from "@/types";

export async function saveUserActivityAction(activity: UserActivity) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      user_activity: activity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error saving user activity:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateProfileRoleAction(targetRole: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const { error } = await supabase
    .from("profiles")
    .update({
      target_role: targetRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return { success: !error };
}
