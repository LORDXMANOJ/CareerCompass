import { createClient } from "@/lib/supabase/server";
import { getPostAuthDestination } from "@/lib/auth-helpers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      
      // Shared post-auth destination determination
      const computedDestination = await getPostAuthDestination(supabase, user);
      
      // Allow explicitly passed next URL if valid and relative, otherwise use computed destination
      const targetDestination = (nextParam && nextParam.startsWith("/")) ? nextParam : computedDestination;

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${targetDestination}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${targetDestination}`);
      } else {
        return NextResponse.redirect(`${origin}${targetDestination}`);
      }
    } else if (error) {
      console.error("[AuthCallback] OAuth exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Return the user to login page with clear error message if code is missing or exchange failed
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication code invalid or expired. Please sign in again.")}`);
}
