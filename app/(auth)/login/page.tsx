import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden selection:bg-[#EE4C7C] selection:text-white py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#5D001E]/30 via-[#9A1750]/20 to-[#EE4C7C]/15 rounded-full blur-[190px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#9A1750]/10 rounded-full blur-[100px] pointer-events-none" />

      <LoginForm />
    </main>
  );
}
