import { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Reusable post-authentication destination decision logic for Google & GitHub OAuth
 * as well as email/password authentication.
 * 
 * Rules:
 * - New user or missing profile -> create profile with onboarding_completed = false -> /onboarding
 * - Existing user with onboarding_completed = false -> /onboarding
 * - Existing user with onboarding_completed = true -> /dashboard
 * - Uncaught error during lookup -> safe fallback to /onboarding (never silent dashboard bypass)
 */
export async function getPostAuthDestination(
  supabase: SupabaseClient,
  user: User
): Promise<string> {
  if (!user || !user.id) {
    return "/login?error=Authentication%20required";
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, onboarding_completed, name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[AuthHelper] Profile lookup error:", error.message);
      // Fallback safely to onboarding if error occurs (never assume database failure = onboarding complete)
      return "/onboarding";
    }

    if (!profile) {
      // New User: Initialize user profile row
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.email ? user.email.split("@")[0] : "Student");
      const avatarUrl =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

      const { error: insertError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          name,
          email: user.email || "",
          avatar_url: avatarUrl,
          selected_mentor: "athena",
          onboarding_completed: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (insertError) {
        console.error("[AuthHelper] Profile initialization error:", insertError.message);
      }

      return "/onboarding";
    }

    // Existing User: Check onboarding completion status
    return profile.onboarding_completed ? "/dashboard" : "/onboarding";
  } catch (err) {
    console.error("[AuthHelper] Unexpected post-auth routing exception:", err);
    return "/onboarding";
  }
}
