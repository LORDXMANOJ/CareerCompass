import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 backdrop-blur-2xl shadow-2xl shadow-purple-950/10 relative overflow-hidden",
        gradient && "bg-gradient-to-b from-slate-900/80 to-slate-950/90",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
