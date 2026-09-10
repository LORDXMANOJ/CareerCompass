# Supabase Auth Template

A reusable Next.js + Supabase authentication template with email/password and Google OAuth.

## Features

✅ Email/password authentication  
✅ Google OAuth (sign in & sign up)  
✅ Protected routes with middleware  
✅ Password reset flow  
✅ Modern UI with Tailwind CSS  
✅ TypeScript support  
✅ Next.js 16 App Router  

## Quick Setup for New Projects

### 1. Clone This Template

```bash
git clone https://github.com/hallengray/supabase-auth-starter.git my-new-project
cd my-new-project
rm -rf .git
git init
```

Or use GitHub's "Use this template" button.

### 2. Create New Supabase Project

Go to supabase.com/dashboard

Click "New Project"

Name your project

Copy the Project URL and anon key

### 3. Update Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Configure OAuth in Supabase

Enable Google OAuth:

Supabase Dashboard → Authentication → Providers

Enable Google

Add your Google Client ID and Secret (see below for reusable credentials)

Add callback URL to Google Cloud Console:

Go to your OAuth app in Google Cloud Console

Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

### 5. Install and Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000 - your auth is ready!

**Note:** You can reuse the same Google OAuth credentials across all your Supabase projects. Just add each new project's callback URL (`https://new-project-id.supabase.co/auth/v1/callback`) to your Google Cloud Console.

## Project Structure

```
app/
├── auth/
│   ├── login/          # Login page with OAuth
│   ├── sign-up/        # Sign up page with OAuth
│   ├── confirm/        # OAuth callback handler
│   ├── forgot-password/ # Password reset
│   └── error/          # Auth error page
├── protected/          # Example protected route
components/
├── login-form.tsx      # Login form with Google OAuth
├── sign-up-form.tsx    # Sign up form with Google OAuth
lib/
└── supabase/
    ├── client.ts       # Client-side Supabase helper
    └── server.ts       # Server-side Supabase helper
middleware.ts           # Route protection
```

## What's Included

- **Email/Password Auth:** Full sign-up, login, and password reset flows
- **Google OAuth:** One-click sign in/sign up
- **Protected Routes:** Middleware-based route protection
- **Modern UI:** Clean, responsive design with shadcn/ui components
- **TypeScript:** Full type safety
- **Server/Client Supabase:** Properly configured for Next.js 16 App Router

## Customization

- **Add more OAuth providers:** Edit `components/login-form.tsx` and `components/sign-up-form.tsx`
- **Change redirect URLs:** Update `options.redirectTo` in auth functions
- **Modify protected routes:** Edit `middleware.ts`
- **Customize UI:** Update components in `components/` folder
- **Change branding:** Edit `app/layout.tsx`

## Environment Variables

| Variable | Description | Where to find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for admin operations) | Supabase Dashboard → Settings → API |

## Time to Deploy: ~10 minutes per project

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Supabase** - Backend as a Service (Auth + Database)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Created by

**Femi Adedayo (hallengray)**  
Gray Peaches IT Consultancy

## Troubleshooting

**Environment variables not loading?**
- Restart dev server after changing `.env.local`
- Make sure variable names match exactly (including `NEXT_PUBLIC_` prefix)

**OAuth not working?**
- Verify callback URL is added to Google Cloud Console
- Check that OAuth is enabled in Supabase Dashboard
- Ensure Client ID and Secret are correct

**"Supabase client not found" error?**
- Check that `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set (not `ANON_KEY`)
