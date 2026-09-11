"use client";

import React, { useState } from "react";
import { DashboardDailyMission } from "@/lib/dashboard-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import Link from "next/link";
import { Zap, Clock, Trophy, CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface TodaysMissionCardProps {
  mission: DashboardDailyMission;
  onTaskToggle?: (taskId: string) => void;
  completedTaskIds?: string[];
}

export function TodaysMissionCard({
  mission,
  onTaskToggle,
  completedTaskIds = [],
}: TodaysMissionCardProps) {
  const { theme } = useCompanionTheme();
  const [tasks, setTasks] = useState(() =>
    mission.tasks.map((t) => ({
      ...t,
      completed: t.completed || completedTaskIds.includes(t.id),
    }))
  );

  React.useEffect(() => {
    setTasks(
      mission.tasks.map((t) => ({
        ...t,
        completed: t.completed || completedTaskIds.includes(t.id),
      }))
    );
  }, [mission, completedTaskIds]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    onTaskToggle?.(id);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div
      id="mission"
      className="p-7 sm:p-8 rounded-3xl border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden mb-8"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span
              className="flex h-2.5 w-2.5 rounded-full animate-ping"
              style={{ backgroundColor: theme.primary }}
            />
            <span
              className="text-xs font-black uppercase tracking-wider font-mono"
              style={{ color: theme.primary }}
            >
              Today&apos;s Mission
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <Clock className="h-3.5 w-3.5" style={{ color: theme.primary }} />
              <span>~{mission.estimatedMinutes} mins</span>
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold"
              style={{
                backgroundColor: theme.isLight ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.2)",
                borderColor: theme.isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.4)",
                color: theme.warning,
              }}
            >
              <Trophy className="h-3.5 w-3.5" style={{ color: theme.warning }} />
              <span>+{mission.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Mission Title */}
        <h3
          className="text-xl sm:text-2xl font-black tracking-tight mb-1.5"
          style={{ color: theme.text }}
        >
          {mission.title}
        </h3>
        <p
          className="text-xs sm:text-sm font-semibold mb-5"
          style={{ color: theme.textAccent }}
        >
          Focus: {mission.category}
        </p>

        {/* Progress Bar & Counter */}
        <div
          className="mb-6 p-4 rounded-2xl border transition-all"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
            <span style={{ color: theme.textSecondary }}>Mission Progress</span>
            <span className="font-mono" style={{ color: theme.primary }}>
              {completedCount} / {tasks.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div
            className="w-full h-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: theme.isLight ? "#e2e8f0" : "rgba(30, 41, 59, 0.8)" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                background: theme.gradient,
              }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3 mb-6">
          {tasks.map((task) => {
            const taskStyle = task.completed
              ? {
                  backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.08)" : "rgba(6, 78, 59, 0.3)",
                  borderColor: theme.isLight ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.4)",
                  color: theme.textMuted,
                }
              : {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                };

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleTask(task.id)}
                className="w-full p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition-all shadow-sm"
                style={taskStyle}
              >
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5" style={{ color: theme.success }} />
                  ) : (
                    <Circle className="h-5 w-5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: theme.textMuted }} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium leading-relaxed ${
                    task.completed ? "line-through" : ""
                  }`}
                  style={{ color: task.completed ? theme.textMuted : theme.text }}
                >
                  {task.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mentor Tip Box */}
        <div
          className="p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 mb-7"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.textSecondary,
          }}
        >
          <Zap className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.warning }} />
          <p className="leading-relaxed">
            <strong className="font-bold" style={{ color: theme.text }}>
              Coach Tip:
            </strong>{" "}
            {mission.mentorTip}
          </p>
        </div>
      </div>

      {/* Dynamic CTA Routing based on Mission Focus */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const firstIncomplete = tasks.find((t) => !t.completed);
            if (firstIncomplete) toggleTask(firstIncomplete.id);
          }}
          className="w-full sm:w-1/2 h-12 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.text,
          }}
        >
          <span>
            {completedCount === tasks.length ? "Mark Completed ✓" : "Quick Check Off"}
          </span>
        </button>

        <Link
          href={
            mission.category.toLowerCase().includes("algorithm") ||
            mission.category.toLowerCase().includes("problem")
              ? "/skills"
              : mission.category.toLowerCase().includes("backend") ||
                mission.category.toLowerCase().includes("frontend") ||
                mission.category.toLowerCase().includes("project")
              ? "/experience"
              : "/roadmap"
          }
          className="w-full sm:w-1/2 h-12 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: theme.gradient,
            boxShadow: theme.isLight ? theme.shadowSm : `0 8px 25px ${theme.glow}`,
          }}
        >
          <span>Open Workspace</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
