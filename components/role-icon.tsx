import React from "react";
import {
  Laptop,
  Server,
  Layout,
  Layers,
  Bot,
  Brain,
  BarChart3,
  GitBranch,
  Cloud,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Gamepad2,
  Code2,
  LucideIcon,
} from "lucide-react";

interface RoleIconProps {
  roleNameOrId: string;
  className?: string;
  size?: number;
}

const ROLE_ICON_MAP: Record<string, LucideIcon> = {
  "software-engineer": Laptop,
  "software engineer": Laptop,
  "backend-developer": Server,
  "backend developer": Server,
  "frontend-developer": Layout,
  "frontend developer": Layout,
  "full-stack-engineer": Layers,
  "full stack engineer": Layers,
  "ai-engineer": Bot,
  "ai engineer": Bot,
  "machine-learning-engineer": Brain,
  "machine learning engineer": Brain,
  "data-scientist": BarChart3,
  "data scientist": BarChart3,
  "devops-engineer": GitBranch,
  "devops engineer": GitBranch,
  "cloud-engineer": Cloud,
  "cloud engineer": Cloud,
  "cyber-security-analyst": ShieldCheck,
  "cyber security analyst": ShieldCheck,
  "android-engineer": Smartphone,
  "android engineer": Smartphone,
  "ios-engineer": Smartphone,
  "ios engineer": Smartphone,
  "ui-ux-designer": Sparkles,
  "ui/ux designer": Sparkles,
  "ui-ux designer": Sparkles,
  "game-developer": Gamepad2,
  "game developer": Gamepad2,
};

export function RoleIcon({ roleNameOrId, className = "h-5 w-5", size }: RoleIconProps) {
  const normalizedKey = (roleNameOrId || "").toLowerCase().trim();
  const IconComponent = ROLE_ICON_MAP[normalizedKey] || Code2;

  return <IconComponent className={className} size={size} />;
}
