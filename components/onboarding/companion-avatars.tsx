"use client";

import React, { memo } from "react";

export type CompanionEmotion = "idle" | "correct" | "wrong";

interface AvatarProps {
  id: string;
  className?: string;
  size?: number;
  emotion?: CompanionEmotion;
}

export const CompanionAvatar = memo(function CompanionAvatar({
  id,
  className = "",
  size = 100,
  emotion = "idle",
}: AvatarProps) {
  switch (id) {
    case "athena":
      return <AthenaAvatar size={size} className={className} emotion={emotion} />;
    case "nova":
      return <NovaAvatar size={size} className={className} emotion={emotion} />;
    case "atlas":
      return <AtlasAvatar size={size} className={className} emotion={emotion} />;
    case "byte":
      return <ByteAvatar size={size} className={className} emotion={emotion} />;
    case "sage":
      return <SageAvatar size={size} className={className} emotion={emotion} />;
    case "raven":
      return <RavenAvatar size={size} className={className} emotion={emotion} />;
    default:
      return <AthenaAvatar size={size} className={className} emotion={emotion} />;
  }
});

// Common micro-animation keyframes embedded in SVG <defs>
const AvatarAnimationStyles = () => (
  <style>{`
    @keyframes avatarBreath {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      50% { transform: translateY(-1.5px) scaleY(1.015); }
    }
    @keyframes avatarHeadFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-2px) rotate(0.4deg); }
    }
    @keyframes avatarBlink {
      0%, 94%, 98%, 100% { transform: scaleY(1); }
      96% { transform: scaleY(0.08); }
    }
    @keyframes avatarSteam {
      0% { transform: translateY(0px) opacity(0.8); }
      50% { transform: translateY(-3px) opacity(0.4); }
      100% { transform: translateY(-6px) opacity(0); }
    }
    @keyframes avatarGlowPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }
    .anim-torso {
      animation: avatarBreath 4s ease-in-out infinite;
      transform-origin: 80px 160px;
    }
    .anim-head {
      animation: avatarHeadFloat 4s ease-in-out infinite;
      transform-origin: 80px 90px;
    }
    .anim-eyes {
      animation: avatarBlink 4.5s ease-in-out infinite;
      transform-origin: 80px 65px;
    }
    .anim-glow {
      animation: avatarGlowPulse 3s ease-in-out infinite;
    }
    .anim-steam {
      animation: avatarSteam 2.5s ease-out infinite;
    }
  `}</style>
);

// -------------------------------------------------------------
// 1. ATHENA (Academic Mentor — Wise, Patient, Wireframe Glasses)
// -------------------------------------------------------------
function AthenaAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="athena-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={isCorrect ? "0.65" : "0.45"} />
          <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="athena-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="athena-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
        <linearGradient id="athena-blazer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#athena-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#60a5fa" : isWrong ? "#93c5fd" : "#3b82f6"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Aura Ring */}
      <circle cx="80" cy="70" r="54" fill="#3b82f6" fillOpacity={isCorrect ? "0.25" : "0.12"} className="anim-glow" />

      {/* Torso / Blazer with Breathing Animation */}
      <g className="anim-torso">
        <path d="M24 160 C24 128 48 116 80 116 C112 116 136 128 136 160 Z" fill="url(#athena-blazer)" />
        <path d="M68 116 L80 138 L92 116 Z" fill="#93c5fd" />
        <path d="M80 126 L80 160" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M50 118 L76 142 L68 160 L38 160 Z" fill="#1d4ed8" />
        <path d="M110 118 L84 142 L92 160 L122 160 Z" fill="#1e40af" />
        {/* Silver Crest Pin */}
        <circle cx="56" cy="134" r="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        <polygon points="56,131 58,134 56,137 54,134" fill="#60a5fa" />
      </g>

      {/* Head Group with Gentle Floating Animation */}
      <g className="anim-head">
        {/* Neck */}
        <rect x="71" y="92" width="18" height="26" rx="6" fill="#fdba74" />
        {/* Hair Behind */}
        <ellipse cx="80" cy="62" rx="38" ry="36" fill="url(#athena-hair)" />

        {/* Face Base */}
        <path
          d="M55 64 C55 48 64 40 80 40 C96 40 105 48 105 64 C105 84 95 98 80 98 C65 98 55 84 55 64 Z"
          fill="url(#athena-skin)"
        />

        {/* Ears */}
        <circle cx="54" cy="68" r="5.5" fill="#fca5a5" />
        <circle cx="106" cy="68" r="5.5" fill="#fca5a5" />
        <circle cx="54" cy="71" r="1.5" fill="#cbd5e1" />
        <circle cx="106" cy="71" r="1.5" fill="#cbd5e1" />

        {/* Hair Front (Sleek Side Parting) */}
        <path
          d="M48 54 C54 36 70 32 80 32 C94 32 110 36 112 56 C112 62 106 62 102 54 C94 36 78 42 64 50 C56 54 50 62 48 54 Z"
          fill="url(#athena-hair)"
        />
        <path d="M49 56 C55 64 57 74 53 82 C51 74 51 64 49 56 Z" fill="url(#athena-hair)" />

        {/* Eyebrows */}
        {isWrong ? (
          <>
            <path d="M63 59 Q70 54 75 57" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M85 55 Q90 58 97 55" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M64 57 Q70 54 75 57" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M85 57 Q90 54 96 57" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Eyes Group with Natural Blinking */}
        <g className="anim-eyes">
          {isCorrect ? (
            // Smiling Joy Eyes 😊
            <>
              <path d="M64 66 Q70 60 76 66" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M84 66 Q90 60 96 66" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : isWrong ? (
            // Pensive Thinking Eyes 🤔
            <>
              <circle cx="70" cy="66" r="3.2" fill="#1e1b4b" />
              <circle cx="90" cy="65" r="3" fill="#1e1b4b" />
              <circle cx="71.5" cy="64.5" r="1.2" fill="#ffffff" />
              <circle cx="91.5" cy="63.5" r="1.2" fill="#ffffff" />
            </>
          ) : (
            // Steady Encouraging Eyes
            <>
              <circle cx="70" cy="66" r="3.4" fill="#1e1b4b" />
              <circle cx="90" cy="66" r="3.4" fill="#1e1b4b" />
              <circle cx="71.5" cy="64.5" r="1.3" fill="#ffffff" />
              <circle cx="91.5" cy="64.5" r="1.3" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Wireframe Eyeglasses */}
        <rect x="61" y="58" width="18" height="15" rx="5" fill="none" stroke="#93c5fd" strokeWidth="1.8" />
        <rect x="81" y="58" width="18" height="15" rx="5" fill="none" stroke="#93c5fd" strokeWidth="1.8" />
        <path d="M79 65 L81 65" stroke="#93c5fd" strokeWidth="1.8" />
        <path d="M56 64 L61 64" stroke="#93c5fd" strokeWidth="1.5" />
        <path d="M99 64 L104 64" stroke="#93c5fd" strokeWidth="1.5" />

        {/* Mouth with Expression Morphing */}
        {isCorrect ? (
          // Radiant Beaming Smile 😄
          <path d="M72 80 Q80 89 88 80" stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" fill="#fecaca" />
        ) : isWrong ? (
          // Thoughtful Modest Smile 🤔
          <path d="M74 82 Q80 84 86 81" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          // Encouraging Gentle Smile
          <path d="M73 81 Q80 87 87 81" stroke="#b91c1c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="74" rx="4.5" ry="2.8" fill="#f87171" fillOpacity={isCorrect ? "0.55" : "0.35"} />
        <ellipse cx="96" cy="74" rx="4.5" ry="2.8" fill="#f87171" fillOpacity={isCorrect ? "0.55" : "0.35"} />
      </g>

      {/* Stylus Pose in Hand */}
      <g transform="translate(112, 114) rotate(-22)">
        <rect x="0" y="0" width="7" height="32" rx="3" fill="#e2e8f0" stroke="#3b82f6" strokeWidth="1.2" />
        <polygon points="0,0 7,0 3.5,-7" fill="#3b82f6" />
        <circle cx="3.5" cy="24" r="1.8" fill="#60a5fa" />
      </g>

      {/* Emotion Indicator Icon in Top-Left */}
      {isCorrect && (
        <g transform="translate(14, 14)">
          <circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="1" />
          <path d="M10 5 L11.5 8.5 L15 10 L11.5 11.5 L10 15 L8.5 11.5 L5 10 L8.5 8.5 Z" fill="#22c55e" />
        </g>
      )}
      {isWrong && (
        <g transform="translate(14, 14)">
          <circle cx="10" cy="10" r="10" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="10" cy="9" r="3.5" fill="#60a5fa" />
          <rect x="8.5" y="13" width="3" height="1.8" rx="0.5" fill="#93c5fd" />
        </g>
      )}
    </svg>
  );
}

// -------------------------------------------------------------
// 2. NOVA (Startup Engineer — Energetic, Hoodie, Headset, Thumbs-Up)
// -------------------------------------------------------------
function NovaAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="nova-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={isCorrect ? "0.7" : "0.5"} />
          <stop offset="60%" stopColor="#b45309" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="nova-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="nova-hoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#nova-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#fbbf24" : isWrong ? "#fed7aa" : "#f59e0b"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Glowing Energy Ring */}
      <circle cx="80" cy="70" r="52" fill="#f59e0b" fillOpacity={isCorrect ? "0.28" : "0.15"} className="anim-glow" />

      {/* Torso / Tech Hoodie */}
      <g className="anim-torso">
        <path d="M22 160 C22 126 46 114 80 114 C114 114 138 126 138 160 Z" fill="url(#nova-hoodie)" />
        <path d="M60 114 Q80 134 100 114" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M72 126 L72 144" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
        <path d="M88 126 L88 144" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />

        {/* Rocket Badge */}
        <circle cx="48" cy="138" r="8" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1" />
        <path d="M48 132 L52 138 L48 143 L44 138 Z" fill="#f59e0b" />
      </g>

      {/* Head Group with Float Animation */}
      <g className="anim-head">
        {/* Neck */}
        <rect x="71" y="90" width="18" height="26" rx="6" fill="#fbcfe8" />
        {/* Face */}
        <path
          d="M55 64 C55 48 64 40 80 40 C96 40 105 48 105 64 C105 84 95 98 80 98 C65 98 55 84 55 64 Z"
          fill="#fde047"
          fillOpacity="0.95"
        />

        {/* Spiky Messy Hair */}
        <path
          d="M48 54 C46 36 60 26 78 28 C92 26 108 32 112 48 C118 52 110 60 104 54 C98 34 84 36 72 40 C62 42 54 48 48 54 Z"
          fill="url(#nova-hair)"
        />
        <polygon points="68,26 76,17 80,28" fill="#78350f" />
        <polygon points="86,24 95,17 97,28" fill="#78350f" />

        {/* Wireless Headset */}
        <path d="M51 48 Q80 30 109 48" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" />
        <rect x="47" y="52" width="8" height="19" rx="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <rect x="105" y="52" width="8" height="19" rx="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        <path d="M51 68 Q57 76 68 76" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="68" cy="76" r="2.5" fill="#fbbf24" />

        {/* Eyebrows */}
        {isWrong ? (
          <>
            <path d="M62 58 L73 54" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            <path d="M87 53 L98 57" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M63 55 L74 52" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            <path d="M86 52 L97 55" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Eyes with Blink Animation */}
        <g className="anim-eyes">
          {isCorrect ? (
            // Excited Happy Eyes 😄
            <>
              <circle cx="69" cy="63" r="5" fill="#18181b" />
              <circle cx="91" cy="63" r="5" fill="#18181b" />
              <circle cx="70.5" cy="61" r="2" fill="#ffffff" />
              <circle cx="92.5" cy="61" r="2" fill="#ffffff" />
            </>
          ) : isWrong ? (
            // Surprised / Timeout Eyes 😅
            <>
              <circle cx="69" cy="64" r="4" fill="#18181b" />
              <circle cx="91" cy="64" r="4" fill="#18181b" />
              <circle cx="70" cy="63" r="1.3" fill="#ffffff" />
              <circle cx="92" cy="63" r="1.3" fill="#ffffff" />
            </>
          ) : (
            // Energetic Standard Eyes
            <>
              <circle cx="69" cy="64" r="4.6" fill="#18181b" />
              <circle cx="91" cy="64" r="4.6" fill="#18181b" />
              <circle cx="70.5" cy="62.5" r="1.8" fill="#ffffff" />
              <circle cx="92.5" cy="62.5" r="1.8" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Mouth */}
        {isCorrect ? (
          // Huge Energetic Grin with Teeth 😄
          <path d="M69 77 Q80 92 91 77 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.8">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M69 77 Q80 92 91 77 Z; M69 76 Q80 93 91 76 Z; M69 77 Q80 92 91 77 Z" />
          </path>
        ) : isWrong ? (
          // "Whoa Timeout" Round Open Mouth 😅
          <ellipse cx="80" cy="80" rx="5.5" ry="4" fill="#b91c1c" />
        ) : (
          <path d="M71 78 Q80 89 89 78 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
        )}
        <path d="M72 79 Q80 84 88 79" fill="#ffffff" />
      </g>

      {/* Thumbs-Up Hand Pose with Subtle Spring */}
      <g transform="translate(108, 118)">
        <circle cx="14" cy="14" r="11" fill="#fde047" stroke="#f59e0b" strokeWidth="1.8" />
        <rect x="11" y="2" width="6" height="12" rx="3" fill="#fde047" stroke="#f59e0b" strokeWidth="1.8" />
        {isCorrect && (
          <g transform="translate(24, 6)">
            <path d="M2 12 L6 4 L10 12 L6 9 Z" fill="#38bdf8" />
          </g>
        )}
      </g>

      {isWrong && (
        // Sweatdrop
        <g transform="translate(104, 38)">
          <path d="M6 0 C3 4 0 7 0 10 C0 13 3 16 6 16 C9 16 12 13 12 10 C12 7 9 4 6 0 Z" fill="#38bdf8" />
        </g>
      )}
    </svg>
  );
}

// -------------------------------------------------------------
// 3. ATLAS (FAANG Mentor — Executive Tech Lead, Smartwatch)
// -------------------------------------------------------------
function AtlasAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="atlas-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={isCorrect ? "0.65" : "0.45"} />
          <stop offset="60%" stopColor="#6b21a8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="atlas-suit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#atlas-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#c084fc" : isWrong ? "#e9d5ff" : "#a855f7"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Hexagonal Architecture Grid */}
      <polygon
        points="80,22 106,37 106,67 80,82 54,67 54,37"
        fill="#a855f7"
        fillOpacity="0.08"
        stroke="#a855f7"
        strokeWidth="1"
        strokeOpacity="0.25"
        className="anim-glow"
      />

      {/* Torso / Structured Blazer */}
      <g className="anim-torso">
        <path d="M24 160 C24 126 48 114 80 114 C112 114 136 126 136 160 Z" fill="url(#atlas-suit)" />
        <path d="M68 114 L80 140 L92 114 Z" fill="#0f172a" />
        <path d="M50 116 L76 142 L68 160" stroke="#64748b" strokeWidth="1.5" fill="none" />
        <path d="M110 116 L84 142 L92 160" stroke="#64748b" strokeWidth="1.5" fill="none" />

        {/* Smart Titanium Watch */}
        <rect x="34" y="140" width="18" height="14" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1.8" />
        <circle cx="43" cy="147" r="3" fill={isCorrect ? "#22c55e" : "#38bdf8"} className="anim-glow" />
      </g>

      {/* Head Group with Float */}
      <g className="anim-head">
        {/* Neck */}
        <rect x="71" y="90" width="18" height="26" rx="5" fill="#fed7aa" />
        {/* Face */}
        <path
          d="M55 64 C55 46 65 38 80 38 C95 38 105 46 105 64 C105 84 95 98 80 98 C65 98 55 84 55 64 Z"
          fill="#ffedd5"
        />

        {/* Clean Trimmed Fade Haircut */}
        <path
          d="M53 52 C53 36 67 28 80 28 C93 28 107 36 107 52 C107 58 103 60 99 52 C91 36 78 36 64 48 C60 52 56 56 53 52 Z"
          fill="#1e1b4b"
        />

        {/* Designer Stubble */}
        <path
          d="M62 76 C64 92 72 98 80 98 C88 98 96 92 98 76 C98 82 92 94 80 94 C68 94 62 82 62 76 Z"
          fill="#334155"
          fillOpacity="0.4"
        />

        {/* Eyebrows */}
        {isWrong ? (
          // One Raised Eyebrow (Skeptical Staff Scrutiny)
          <>
            <path d="M63 56 L74 56" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M85 50 L96 54" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M64 55 L75 53" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M85 53 L96 55" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
          </>
        )}

        {/* Focused Eyes with Blink */}
        <g className="anim-eyes">
          <circle cx="70" cy="65" r="3.4" fill="#0f172a" />
          <circle cx="90" cy="65" r="3.4" fill="#0f172a" />
          <circle cx="71.5" cy="63.8" r="1.2" fill="#38bdf8" />
          <circle cx="91.5" cy="63.8" r="1.2" fill="#38bdf8" />
        </g>

        {/* Smirk / Expression */}
        {isCorrect ? (
          // Satisfied Staff Engineer Nod & Smile 😎
          <path d="M72 80 Q80 86 88 80" stroke="#991b1b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        ) : isWrong ? (
          // Firm Evaluative Straight Line 😐
          <line x1="74" y1="81" x2="86" y2="81" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
        ) : (
          <path d="M74 81 Q80 83 87 79" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  );
}

// -------------------------------------------------------------
// 4. BYTE (Coding Buddy — Funny, Beanie, Relaxed, Coffee Mug)
// -------------------------------------------------------------
function ByteAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="byte-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#10b981" stopOpacity={isCorrect ? "0.65" : "0.45"} />
          <stop offset="60%" stopColor="#047857" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="byte-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#byte-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#34d399" : isWrong ? "#a7f3d0" : "#10b981"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Torso / Comfy Raglan Sweatshirt */}
      <g className="anim-torso">
        <path d="M22 160 C22 126 46 114 80 114 C114 114 138 126 138 160 Z" fill="url(#byte-sweater)" />
        <rect x="50" y="136" width="11" height="11" rx="3" fill="#34d399" />
        <rect x="53" y="139" width="4" height="5" fill="#064e3b" />
      </g>

      {/* Head Group with Float */}
      <g className="anim-head">
        {/* Neck */}
        <rect x="71" y="90" width="18" height="26" rx="5" fill="#fde047" fillOpacity="0.85" />
        {/* Face */}
        <path
          d="M55 64 C55 48 64 42 80 42 C96 42 105 48 105 64 C105 84 95 98 80 98 C65 98 55 84 55 64 Z"
          fill="#fef08a"
        />

        {/* Teal Developer Beanie Hat */}
        <path d="M47 48 C47 30 61 22 80 22 C99 22 113 30 113 48 Z" fill="#0f766e" />
        <rect x="45" y="44" width="70" height="13" rx="4" fill="#14b8a6" stroke="#0d9488" strokeWidth="1" />

        {/* Wavy Hair */}
        <path d="M51 56 Q55 66 51 74" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M109 56 Q105 66 109 74" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Eyebrows */}
        <path d="M63 57 Q69 53 75 57" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M85 57 Q91 53 97 57" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Eyes with Animated Expression */}
        <g className="anim-eyes">
          {isCorrect ? (
            // Double Happy Winks 😄
            <>
              <path d="M63 66 Q70 60 77 66" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M83 66 Q90 60 97 66" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : isWrong ? (
            // Sheepish / Skeptical Eyes 😅
            <>
              <circle cx="69" cy="65" r="3.6" fill="#1f2937" />
              <path d="M84 66 Q90 62 96 66" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Signature Wink
            <>
              <path d="M63 66 Q70 61 77 66" stroke="#1f2937" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <circle cx="90" cy="65" r="4" fill="#1f2937" />
              <circle cx="91.5" cy="63.5" r="1.3" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Mouth */}
        {isCorrect ? (
          <path d="M71 78 Q80 88 89 78" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : isWrong ? (
          <path d="M73 81 Q80 77 87 81" stroke="#b91c1c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M72 79 Q80 87 88 80" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* Ceramic Coffee Mug in Hand (Bottom Right) */}
      <g transform="translate(104, 114)">
        <rect x="4" y="8" width="24" height="26" rx="5" fill="#f8fafc" stroke="#047857" strokeWidth="1.8" />
        <path d="M28 14 C35 14 35 25 28 25" stroke="#f8fafc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="7" y="25" fontSize="8.5" fontWeight="bold" fill="#10b981" fontFamily="monospace">
          404
        </text>
        {/* Animated Steam Plumes */}
        <path d="M10 4 Q8 1 12 -3" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" fill="none" className="anim-steam" />
        <path d="M19 4 Q17 1 21 -3" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" fill="none" className="anim-steam" style={{ animationDelay: "0.8s" }} />
      </g>
    </svg>
  );
}

// -------------------------------------------------------------
// 5. SAGE (Career Coach — Serene, Analytical, Modern Cardigan)
// -------------------------------------------------------------
function SageAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="sage-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity={isCorrect ? "0.65" : "0.45"} />
          <stop offset="60%" stopColor="#0e7490" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="sage-cardigan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#sage-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#22d3ee" : isWrong ? "#a5f3fc" : "#06b6d4"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Torso / Sand Knit Cardigan */}
      <g className="anim-torso">
        <path d="M24 160 C24 126 48 116 80 116 C112 116 136 126 136 160 Z" fill="url(#sage-cardigan)" />
        <path d="M68 116 Q80 134 92 116 Z" fill="#ffffff" />
        <path d="M52 118 L74 160" stroke="#d6d3d1" strokeWidth="2" fill="none" />
        <path d="M108 118 L86 160" stroke="#d6d3d1" strokeWidth="2" fill="none" />
      </g>

      {/* Head Group with Float */}
      <g className="anim-head">
        {/* Neck */}
        <rect x="71" y="90" width="18" height="28" rx="6" fill="#fcd34d" fillOpacity="0.8" />
        {/* Face */}
        <path
          d="M55 64 C55 46 64 38 80 38 C96 38 105 46 105 64 C105 84 95 98 80 98 C65 98 55 84 55 64 Z"
          fill="#fde68a"
        />

        {/* Contemporary Bob Haircut */}
        <path
          d="M48 56 C50 36 64 28 80 28 C96 28 110 36 112 56 C114 74 110 86 106 88 C104 74 104 54 94 40 C84 34 70 36 58 46 C52 52 50 72 48 88 C46 84 44 72 48 56 Z"
          fill="#292524"
        />

        {/* Rose-Gold Glasses */}
        <rect x="61" y="59" width="17" height="14" rx="4" fill="none" stroke="#f472b6" strokeWidth="1.6" />
        <rect x="82" y="59" width="17" height="14" rx="4" fill="none" stroke="#f472b6" strokeWidth="1.6" />
        <line x1="78" y1="65" x2="82" y2="65" stroke="#f472b6" strokeWidth="1.6" />

        {/* Eyes with Blink */}
        <g className="anim-eyes">
          {isCorrect ? (
            // Enlightened Joy
            <>
              <path d="M64 66 Q70 61 76 66" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M84 66 Q90 61 96 66" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="70" cy="65" r="3.4" fill="#1c1917" />
              <circle cx="90" cy="65" r="3.4" fill="#1c1917" />
              <circle cx="71.5" cy="64" r="1.2" fill="#ffffff" />
              <circle cx="91.5" cy="64" r="1.2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Serene Smile */}
        <path d="M73 81 Q80 87 87 81" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Holding Smart Tablet Folio */}
      <g transform="translate(30, 122) rotate(12)">
        <rect x="0" y="0" width="24" height="32" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.8" />
        <line x1="4" y1="8" x2="20" y2="8" stroke={isCorrect ? "#22c55e" : "#22d3ee"} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="14" x2="16" y2="14" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="20" x2="18" y2="20" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// -------------------------------------------------------------
// 6. RAVEN (Challenge Mode — Tactical Turtleneck, Raised Eyebrow)
// -------------------------------------------------------------
function RavenAvatar({ size, className, emotion }: { size: number; className?: string; emotion: CompanionEmotion }) {
  const isCorrect = emotion === "correct";
  const isWrong = emotion === "wrong";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-3xl transition-all duration-300 ${className}`}
    >
      <defs>
        <AvatarAnimationStyles />
        <radialGradient id="raven-bg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity={isCorrect ? "0.65" : "0.45"} />
          <stop offset="60%" stopColor="#9f1239" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="raven-turtleneck" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="160" height="160" rx="32" fill="url(#raven-bg)" />
      <rect
        width="158"
        height="158"
        x="1"
        y="1"
        rx="31"
        stroke={isCorrect ? "#fb7185" : isWrong ? "#fda4af" : "#f43f5e"}
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Tactical Crosshair Grid */}
      <circle
        cx="80"
        cy="70"
        r="48"
        stroke="#f43f5e"
        strokeWidth="1"
        strokeDasharray="4 4"
        strokeOpacity="0.3"
        fill="none"
        className="anim-glow"
      />

      {/* High-Collar Tactical Turtleneck */}
      <g className="anim-torso">
        <path d="M22 160 C22 124 46 112 80 112 C114 112 138 124 138 160 Z" fill="url(#raven-turtleneck)" />
        <rect x="66" y="88" width="28" height="26" rx="6" fill="#27272a" stroke="#f43f5e" strokeWidth="1.5" />
        <polygon points="80,124 88,133 80,146 72,133" fill="#e11d48" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M34 156 Q80 140 126 156" stroke="#3f3f46" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Head Group with Float */}
      <g className="anim-head">
        {/* Face */}
        <path
          d="M55 62 C55 46 65 38 80 38 C95 38 105 46 105 62 C105 82 95 94 80 94 C65 94 55 82 55 62 Z"
          fill="#fed7aa"
        />

        {/* Sharp Undercut Haircut */}
        <path
          d="M48 50 C50 30 68 24 82 24 C100 24 114 34 112 54 C108 50 102 44 94 40 C80 36 68 40 56 48 C50 52 48 56 48 50 Z"
          fill="#09090b"
        />
        <polygon points="52,48 46,62 58,54" fill="#09090b" />
        <polygon points="56,54 50,72 62,60" fill="#09090b" />

        {/* Asymmetrical Brows */}
        {isWrong ? (
          // Extreme Critical Brow
          <>
            <path d="M62 58 L74 53" stroke="#09090b" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M86 46 L98 52" stroke="#09090b" strokeWidth="3.6" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M63 55 L74 53" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
            <path d="M86 48 L97 53" stroke="#09090b" strokeWidth="3.4" strokeLinecap="round" />
          </>
        )}

        {/* Piercing Focused Eyes with Blink */}
        <g className="anim-eyes">
          <circle cx="69" cy="62" r="3.6" fill="#09090b" />
          <circle cx="91" cy="61" r="3.6" fill="#09090b" />
          <circle cx="70.5" cy="60.5" r="1.3" fill="#fb7185" />
          <circle cx="92.5" cy="59.5" r="1.3" fill="#fb7185" />
        </g>

        {/* Mouth */}
        {isCorrect ? (
          // Rare Satisfied Smirk
          <path d="M74 78 Q80 81 87 77" stroke="#991b1b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        ) : isWrong ? (
          // Deep Disapproving Frown
          <path d="M73 80 Q80 75 87 80" stroke="#991b1b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        ) : (
          <line x1="74" y1="78" x2="86" y2="78" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
