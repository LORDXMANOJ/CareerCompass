import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        "User-Agent": "CareerCompass-App",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ verified: false, message: "GitHub user not found" }, { status: 404 });
      }
      return NextResponse.json({ verified: false, message: "Failed to query GitHub API" }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      verified: true,
      data: {
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        public_repos: data.public_repos,
        followers: data.followers,
        html_url: data.html_url,
      },
    });
  } catch {
    return NextResponse.json({ verified: false, message: "Network error during GitHub verification" }, { status: 500 });
  }
}
