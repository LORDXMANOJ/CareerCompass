import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl h-16">
          <div className="w-full max-w-6xl flex justify-between items-center px-6 text-sm">
            <div className="flex gap-3 items-center font-bold text-lg">
              <Link href={"/"} className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  CC
                </div>
                <span>CareerCompass</span>
              </Link>
            </div>
            <Suspense fallback={<div className="h-8 w-16 bg-slate-900 animate-pulse rounded" />}>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-8 max-w-6xl w-full p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
