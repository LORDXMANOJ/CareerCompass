"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  return redirect("/onboarding");
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  if (!email || !password) {
    return redirect("/register?error=Email%20and%20password%20are%20required");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || "",
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    // Attempt profile creation
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        name: name || email.split("@")[0],
        email: email,
        mentor: "dev_sen",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  }

  if (data.session) {
    revalidatePath("/", "layout");
    return redirect("/onboarding");
  }

  return redirect("/auth/sign-up-success");
}

export async function signInWithGoogleAction() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signInWithGitHubAction() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  if (!email) {
    return redirect("/forgot-password?error=Email%20is%20required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });

  if (error) {
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/forgot-password?success=Check%20your%20email%20for%20password%20reset%20instructions");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return redirect("/login");
}
