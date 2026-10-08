"use client";

import WireframeRocket, { type WireframeRocketHandle } from "./WireframeRocket";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Cpu,
  Globe2,
  Layers3,
  MousePointer2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   TYPES
   ========================================================================== */

type SceneProps = {
  children: ReactNode;
  className?: string;
  sceneRef: (element: HTMLElement | null) => void;
};

type OverlayProps = {
  overlayRef: (element: HTMLDivElement | null) => void;
};

/* ==========================================================================
   BRAND COLORS
   ========================================================================== */

const BLUE = "#60A5FA";
const CYAN = "#A5F3FC";
const CYAN_BRIGHT = "#67E8F9";
const VIOLET = "#A78BFA";

const NAVY = "#03040D";
const PANEL = "#080B16";

/* ==========================================================================
   DATA
   ========================================================================== */

const technologies = [
  { name: "JavaScript", short: "JS", angle: -90 },
  { name: "React", short: "RE", angle: -45 },
  { name: "Next.js", short: "NX", angle: 0 },
  { name: "Tailwind", short: "TW", angle: 45 },
  { name: "GSAP", short: "GS", angle: 90 },
  { name: "Strapi", short: "ST", angle: 135 },
  { name: "WordPress", short: "WP", angle: 180 },
  { name: "Git", short: "GI", angle: 225 },
];

const detailItems = [
  {
    number: "01",
    title: "NAVIGATION",
    description: "Clear paths",
    icon: Globe2,
  },
  {
    number: "02",
    title: "STRUCTURE",
    description: "Strong foundation",
    icon: Layers3,
  },
  {
    number: "03",
    title: "PERFORMANCE",
    description: "Fast response",
    icon: Zap,
  },
  {
    number: "04",
    title: "PRECISION",
    description: "Refined details",
    icon: Cpu,
  },
];

/* ==========================================================================
   SCENE UI
   ========================================================================== */

function SceneLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="scene-label mb-7 flex items-center gap-4">
      <span
        className="font-mono text-[9px] tracking-[0.3em]"
        style={{ color: CYAN }}
      >
        {number}
      </span>

      <span className="h-px w-10 bg-white/20" />

      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
        {title}
      </span>
    </div>
  );
}

function Scene({ children, className = "", sceneRef }: SceneProps) {
  return (
    <section
      ref={sceneRef}
      className={`scene absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </section>
  );
}

/* ==========================================================================
   BACKGROUND
   ========================================================================== */

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Fine engineering grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,.035) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Major blue grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.055) 1px, transparent 1px)
          `,
          backgroundSize: "240px 240px",
        }}
      />

      {/* Central blue atmosphere */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.045] blur-3xl" />

      {/* Central cyan glow */}
      <div className="absolute left-[40%] top-[42%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.018] blur-[120px]" />

      {/* Violet atmosphere */}
      <div className="absolute right-[-10%] top-[-10%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.035] blur-3xl" />

      {/* Lower violet atmosphere */}
      <div className="absolute bottom-[-15%] left-[-8%] h-[380px] w-[380px] rounded-full bg-violet-500/[0.018] blur-3xl" />

      {/* Technical horizontal axis */}
      <div className="absolute left-0 top-1/2 h-px w-full bg-cyan-300/[0.045]" />

      {/* Technical vertical axis */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-blue-400/[0.035]" />

      {/* Subtle center glow */}
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backgroundColor: CYAN_BRIGHT,
          boxShadow: `0 0 30px ${CYAN_BRIGHT}`,
          opacity: 0.15,
        }}
      />
    </div>
  );
}

/* ==========================================================================
   CORNER FRAME
   ========================================================================== */

function CornerFrame() {
  return (
    <div className="pointer-events-none absolute inset-6 z-50 sm:inset-10">
      <span className="absolute left-0 top-0 h-7 w-7 border-l border-t border-cyan-300/25" />
      <span className="absolute right-0 top-0 h-7 w-7 border-r border-t border-cyan-300/25" />
      <span className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-cyan-300/25" />
      <span className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-cyan-300/25" />

      <span className="absolute left-8 top-0 h-px w-16 bg-blue-400/20" />
      <span className="absolute right-8 top-0 h-px w-16 bg-blue-400/20" />
      <span className="absolute bottom-0 left-8 h-px w-16 bg-blue-400/20" />
      <span className="absolute bottom-0 right-8 h-px w-16 bg-blue-400/20" />
    </div>
  );
}

/* ==========================================================================
   SHARED ROCKET STAGE
   ========================================================================== */

function RocketStage({ children }: { children?: ReactNode }) {
  return (
    <div className="rocket-stage relative flex h-[520px] w-[520px] items-center justify-center">
      {/* Central rocket */}
      <div className="rocket-visual relative z-10 flex h-full w-full items-center justify-center">
        <WireframeRocket className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Scene-specific futuristic HUD */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {children}
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 01 — IDEA
   ========================================================================== */

function IdeaOverlay({ overlayRef }: OverlayProps) {
  const nodes = [
    {
      x: "14%",
      y: "22%",
      label: "PURPOSE",
      code: "SYS.01",
      color: CYAN,
    },
    {
      x: "78%",
      y: "24%",
      label: "VISION",
      code: "SYS.02",
      color: VIOLET,
    },
    {
      x: "14%",
      y: "72%",
      label: "NEED",
      code: "SYS.03",
      color: VIOLET,
    },
    {
      x: "78%",
      y: "72%",
      label: "VALUE",
      code: "SYS.04",
      color: BLUE,
    },
  ];

  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Primary system ring */}
      <div
        className="idea-orbit absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: `${CYAN}26` }}
      />

      {/* Secondary violet ring */}
      <div
        className="idea-orbit-2 absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
        style={{ borderColor: `${VIOLET}30` }}
      />

      {/* Center crosshair */}
      <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
        <span
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: `${CYAN}40` }}
        />
        <span
          className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
          style={{ backgroundColor: `${CYAN}40` }}
        />
      </div>

      {nodes.map((node) => (
        <div
          key={node.label}
          className="idea-node absolute"
          style={{
            left: node.x,
            top: node.y,
          }}
        >
          <div className="rounded-md border border-white/[0.08] bg-[#080B16]/85 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: node.color,
                  boxShadow: `0 0 10px ${node.color}`,
                }}
              />

              <span className="font-mono text-[7px] tracking-[0.2em] text-white/50">
                {node.code}
              </span>
            </div>

            <div className="mt-1 font-mono text-[8px] tracking-[0.2em] text-white/85">
              {node.label}
            </div>
          </div>

          <div
            className="mt-1 h-px w-16"
            style={{
              backgroundColor: node.color,
              opacity: 0.3,
            }}
          />
        </div>
      ))}

      <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
        CONCEPT INITIALIZATION // 001
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 02 — VISION
   ========================================================================== */

function VisionOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Blueprint grid */}
      <div
        className="absolute inset-[55px] rounded-[28px] border border-blue-400/15 bg-blue-400/[0.012] opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,.07) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Blueprint corners */}
      <div className="absolute left-[12%] top-[16%] h-5 w-5 border-l border-t border-cyan-300/35" />

      <div className="absolute right-[12%] top-[16%] h-5 w-5 border-r border-t border-cyan-300/35" />

      <div className="absolute bottom-[16%] left-[12%] h-5 w-5 border-b border-l border-cyan-300/35" />

      <div className="absolute bottom-[16%] right-[12%] h-5 w-5 border-b border-r border-cyan-300/35" />

      {/* Dimensions */}
      <div className="vision-dimension absolute left-[18%] top-[27%] h-[46%] w-px bg-cyan-300/25" />

      <div className="vision-dimension absolute right-[18%] top-[27%] h-[46%] w-px bg-cyan-300/25" />

      <div className="absolute left-[13%] top-[49%] rotate-[-90deg] font-mono text-[6px] uppercase tracking-[0.25em] text-white/35">
        structural axis
      </div>

      <div className="absolute left-[18%] top-[24%] font-mono text-[7px] uppercase tracking-[0.2em] text-cyan-300">
        01 / FRAME
      </div>

      <div className="absolute right-[18%] top-[24%] font-mono text-[7px] uppercase tracking-[0.2em] text-violet-300">
        REV.01
      </div>

      {/* Trajectory */}
      <div className="vision-trajectory absolute bottom-[10%] left-1/2 h-[125px] w-px -translate-x-1/2 border-l border-dashed border-violet-400/45" />

      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 font-mono text-[6px] uppercase tracking-[0.3em] text-violet-300">
        direction
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 03 — BUILD
   ========================================================================== */

function BuildOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Code editor */}
      <div className="code-panel absolute left-[-20px] top-[7%] rounded-lg border border-cyan-300/15 bg-[#080B16]/95 px-4 py-3 font-mono text-[7px] shadow-[0_20px_60px_rgba(0,0,0,.5)]">
        <div className="flex h-9 items-center border-b border-white/[.06] px-3">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full border border-cyan-300/30 bg-[#080B16]" />
            <span className="h-2 w-2 rounded-full border border-cyan-300/30 bg-[#080B16]" />
            <span className="h-2 w-2 rounded-full border border-cyan-300/30 bg-[#080B16]" />
          </div>

          <span className="ml-3 text-left font-mono text-[7px] text-white/40">
            experience.ts
          </span>
        </div>

        <div className="p-4 font-mono text-[7px] leading-5">
          <div>
            <span className="text-violet-300">const</span>{" "}
            <span className="text-cyan-300">experience</span>{" "}
            <span className="text-white/30">=</span>
          </div>

          <div className="text-white/30">{"{"}</div>

          <div className="pl-4 text-white/50">
            structure: <span className="text-cyan-300">&quot;clear&quot;</span>
          </div>

          <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-cyan-300/50">
            interaction
          </div>

          <div className="pl-4 text-white/50">
            performance: <span className="text-cyan-300">&quot;fast&quot;</span>
          </div>

          <div className="pl-4 text-white/50">
            purpose: <span className="text-violet-300">true</span>
          </div>

          <div className="text-white/30">{"}"}</div>
        </div>

        <div className="border-t border-white/[.06] px-4 py-2 font-mono text-[7px] text-cyan-300">
          $ compiling experience...
        </div>
      </div>

      {/* Component blocks */}
      {[
        { x: "72%", y: "14%", title: "CORE" },
        { x: "82%", y: "39%", title: "UI" },
        { x: "75%", y: "69%", title: "API" },
        { x: "12%", y: "75%", title: "DATA" },
      ].map((node, index) => (
        <div
          key={node.title}
          className="build-node absolute"
          style={{
            left: node.x,
            top: node.y,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/25 bg-[#080B16] font-mono text-[7px] text-cyan-300">
              0{index + 1}
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
              {node.title}
            </span>
          </div>
        </div>
      ))}

      {/* Terminal */}
      <div className="build-terminal absolute bottom-[7%] right-[3%] rounded-lg border border-cyan-300/15 bg-[#080B16]/95 px-4 py-3 font-mono text-[7px] shadow-[0_20px_60px_rgba(0,0,0,.5)]">
        <div className="text-white/30">$ build</div>

        <div className="mt-1 text-cyan-300">✓ modules compiled</div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 04 — EXPERIENCE
   ========================================================================== */

function ExperienceOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Ripple rings */}
      <div className="interaction-ring absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.012]" />

      <div className="interaction-ring absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/25" />

      <div className="interaction-ring absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />

      {/* Motion path */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 560"
        fill="none"
      >
        <path
          className="motion-path"
          d="M70 160 C150 55 390 55 490 180"
          stroke={CYAN}
          strokeOpacity=".22"
          strokeWidth="1"
          strokeDasharray="5 9"
        />

        <path
          className="motion-path"
          d="M70 410 C180 500 390 500 490 370"
          stroke={VIOLET}
          strokeOpacity=".22"
          strokeWidth="1"
          strokeDasharray="5 9"
        />
      </svg>

      {/* Cursor */}
      <div className="experience-cursor absolute right-[9%] top-[19%]">
        <MousePointer2 className="h-8 w-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(165,243,252,.45)]" />

        <div className="ml-5 mt-[-2px] rounded-full bg-[#080B16] px-3 py-1 font-mono text-[7px] text-white">
          interact
        </div>
      </div>

      {/* Interaction labels */}
      <div className="absolute left-[5%] top-[29%] rounded-md border border-cyan-300/15 bg-[#080B16]/90 px-3 py-2 shadow-[0_15px_50px_rgba(0,0,0,.4)] backdrop-blur-md">
        <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-cyan-300/50">
          interaction
        </div>

        <div className="mt-1 font-mono text-[8px] font-medium text-white/80">
          RESPONSIVE
        </div>
      </div>

      <div className="absolute bottom-[18%] right-[4%] rounded-md border border-violet-400/15 bg-[#080B16]/90 px-3 py-2 shadow-[0_15px_50px_rgba(0,0,0,.4)] backdrop-blur-md">
        <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-violet-300/50">
          motion
        </div>

        <div className="mt-1 font-mono text-[8px] font-semibold text-white/80">
          INTENTIONAL
        </div>
      </div>

      <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 font-mono text-[6px] uppercase tracking-[0.3em] text-white/30">
        movement with purpose
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 05 — DETAILS
   ========================================================================== */

function DetailsOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Callout lines */}
      <div className="absolute left-[18%] top-[29%] h-[42%] w-px border-l border-dashed border-white/20" />

      <div className="absolute right-[18%] top-[29%] h-[42%] w-px border-r border-dashed border-white/20" />

      {detailItems.map((item, index) => {
        const Icon = item.icon;

        const positions = [
          "left-[1%] top-[12%]",
          "right-[1%] top-[18%]",
          "left-[1%] bottom-[13%]",
          "right-[1%] bottom-[9%]",
        ];

        return (
          <div
            key={item.title}
            className={`detail-card absolute w-[145px] rounded-xl border border-cyan-300/10 bg-[#080B16]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-md ${positions[index]}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] text-white/35">
                {item.number}
              </span>

              <Icon className="h-3 w-3 text-cyan-300" />
            </div>

            <div className="mt-3 text-[8px] font-semibold tracking-[0.12em] text-white/80">
              {item.title}
            </div>

            <div className="mt-1 text-[7px] text-white/40">
              {item.description}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(165,243,252,.6)]" />

              <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-white/40">
                verified
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   SCENE 06 — TECHNOLOGY
   ========================================================================== */

function TechnologyOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Network lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 560"
        fill="none"
      >
        {technologies.map((tech) => {
          const radius = 215;

          const x = 280 + Math.cos((tech.angle * Math.PI) / 180) * radius;

          const y = 280 + Math.sin((tech.angle * Math.PI) / 180) * radius;

          return (
            <line
              key={tech.name}
              className="technology-line"
              x1="280"
              y1="280"
              x2={x}
              y2={y}
              stroke={CYAN}
              strokeOpacity=".16"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {technologies.map((tech, index) => {
        const radius = 215;

        const x = Math.cos((tech.angle * Math.PI) / 180) * radius;

        const y = Math.sin((tech.angle * Math.PI) / 180) * radius;

        const nodeColor =
          index % 3 === 0 ? BLUE : index % 3 === 1 ? CYAN : VIOLET;

        return (
          <div
            key={tech.name}
            className="technology-node absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-lg border bg-[#080B16]/95 shadow-[0_0_25px_rgba(96,165,250,.05)]"
              style={{
                borderColor: `${nodeColor}35`,
              }}
            >
              <span
                className="absolute inset-0 rounded-lg border"
                style={{
                  borderColor: `${nodeColor}10`,
                }}
              />

              <span
                className="font-mono text-[8px] font-semibold"
                style={{ color: nodeColor }}
              >
                {tech.short}
              </span>
            </div>

            <div className="mt-2 whitespace-nowrap text-center font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
              {tech.name}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-300/15 bg-[#080B16] px-4 py-2 font-mono text-[6px] uppercase tracking-widest text-white/40">
        connected architecture
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 07 — TRANSFORMATION
   ========================================================================== */

function TransformationOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      <div className="system-ring absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />

      <div className="system-ring absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/25" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 560"
        fill="none"
      >
        <path
          className="system-connection"
          d="M115 155 L280 280"
          stroke={CYAN}
          strokeOpacity=".22"
        />

        <path
          className="system-connection"
          d="M445 155 L280 280"
          stroke={VIOLET}
          strokeOpacity=".22"
        />

        <path
          className="system-connection"
          d="M115 405 L280 280"
          stroke={VIOLET}
          strokeOpacity=".22"
        />

        <path
          className="system-connection"
          d="M445 405 L280 280"
          stroke={BLUE}
          strokeOpacity=".22"
        />
      </svg>

      {[
        {
          label: "DESIGN",
          number: "01",
          x: "8%",
          y: "20%",
          color: CYAN,
        },
        {
          label: "CODE",
          number: "02",
          x: "76%",
          y: "20%",
          color: BLUE,
        },
        {
          label: "CONTENT",
          number: "03",
          x: "74%",
          y: "72%",
          color: VIOLET,
        },
        {
          label: "EXPERIENCE",
          number: "04",
          x: "7%",
          y: "72%",
          color: CYAN,
        },
      ].map((node) => (
        <div
          key={node.label}
          className="system-node absolute"
          style={{
            left: node.x,
            top: node.y,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md border bg-[#080B16]"
              style={{
                borderColor: `${node.color}40`,
                color: node.color,
              }}
            >
              <span className="font-mono text-[7px]">{node.number}</span>
            </div>

            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
              {node.label}
            </span>
          </div>
        </div>
      ))}

      <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 rounded-md border border-cyan-300/15 bg-[#080B16]/90 px-5 py-2 font-mono text-[7px] uppercase tracking-[0.2em] text-cyan-200/60 backdrop-blur-md">
        SYSTEM INTEGRATED
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 08 — LAUNCH
   ========================================================================== */

function LaunchOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      {/* Vertical trajectory */}
      <div className="launch-trajectory absolute left-1/2 top-[3%] h-[94%] w-px -translate-x-1/2 border-l border-dashed border-cyan-300/30" />

      <div className="absolute left-1/2 top-[3%] h-2 w-2 -translate-x-1/2 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(167,139,250,.65)]" />

      {/* Launch status */}
      <div className="launch-status absolute left-1/2 top-[7%] -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-300/15 bg-[#080B16]/90 px-5 py-2 shadow-[0_15px_50px_rgba(0,0,0,.35)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(165,243,252,.8)]" />

          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
            launch system
          </span>

          <span className="font-mono text-[7px] font-semibold text-cyan-200">
            ONLINE
          </span>
        </div>
      </div>

      {/* Status panels */}
      {[
        {
          side: "left",
          top: "35%",
          title: "STRUCTURE",
          number: "01",
          color: CYAN,
        },
        {
          side: "left",
          top: "55%",
          title: "NAVIGATION",
          number: "02",
          color: CYAN,
        },
        {
          side: "right",
          top: "35%",
          title: "WEB SYSTEM",
          number: "03",
          color: VIOLET,
        },
        {
          side: "right",
          top: "55%",
          title: "PERFORMANCE",
          number: "04",
          color: BLUE,
        },
      ].map((item) => (
        <div
          key={item.title}
          className={`launch-card absolute w-[135px] rounded-lg border border-cyan-300/10 bg-[#080B16]/90 p-3 shadow-[0_15px_50px_rgba(0,0,0,.4)] backdrop-blur-md ${
            item.side === "left" ? "left-[1%]" : "right-[1%]"
          }`}
          style={{
            top: item.top,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${item.color}15`,
              }}
            >
              <Check className="h-3 w-3" style={{ color: item.color }} />
            </div>

            <div>
              <div className="font-mono text-[6px] text-white/35">
                {item.number}
              </div>

              <div className="text-[8px] font-semibold tracking-[0.08em] text-white/80">
                {item.title}
              </div>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="launch-progress h-full w-0 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}

      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 text-center">
        <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/40">
          final status
        </div>

        <div className="mt-1 text-[8px] font-semibold tracking-[0.2em] text-cyan-100">
          READY
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SCENE 09 — FINAL
   ========================================================================== */

function FinalOverlay({ overlayRef }: OverlayProps) {
  return (
    <div ref={overlayRef} className="scene-overlay absolute inset-0">
      <div className="final-orbit absolute left-1/2 top-1/2 h-[500px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-300/15 bg-cyan-300/[0.012]" />

      <div className="final-orbit absolute left-1/2 top-1/2 h-[420px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-violet-400/20" />

      <div className="final-label absolute left-[10%] top-[14%]">
        <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/40">
          your idea
        </div>

        <div className="mt-2 h-px w-14 bg-violet-400" />
      </div>

      <div className="final-label absolute right-[10%] top-[14%] text-right">
        <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-300">
          your product
        </div>

        <div className="ml-auto mt-2 h-px w-14 bg-cyan-300" />
      </div>

      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-300/15 bg-[#080B16]/90 px-5 py-2 font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-200/60 backdrop-blur-md">
        NEXT MISSION READY
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN CINEMATIC HERO
   ========================================================================== */

export default function CinematicHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  const sceneRefs = useRef<(HTMLElement | null)[]>([]);

  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const progressRef = useRef<HTMLDivElement>(null);

  const scanRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const scenes = sceneRefs.current.filter(Boolean) as HTMLElement[];

      const overlays = overlayRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!scenes.length) return;

      /* ================================================================
         INITIAL STATES
      ================================================================ */

      gsap.set(scenes, {
        autoAlpha: 0,
      });

      gsap.set(scenes[0], {
        autoAlpha: 1,
      });

      const textElements = root.querySelectorAll(
        ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
      );

      gsap.set(textElements, {
        opacity: 0,
        x: 70,
        filter: "blur(8px)",
      });

      gsap.set(
        scenes[0].querySelectorAll(
          ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
        ),
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
        },
      );

      gsap.set(overlays, {
        opacity: 0,
        y: 45,
        scale: 0.94,
      });

      /* ================================================================
         AMBIENT SCAN
      ================================================================ */

      if (scanRef.current) {
        gsap.to(scanRef.current, {
          yPercent: 100,
          duration: 5,
          repeat: -1,
          ease: "none",
        });
      }

      const rocketVisual = root.querySelectorAll(".rocket-visual");

      gsap.to(rocketVisual, {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* ================================================================
         MASTER TIMELINE
      ================================================================ */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=12000",
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* ================================================================
         HELPERS
      ================================================================ */

      const sceneText = (scene: HTMLElement) =>
        scene.querySelectorAll(
          ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
        );

      const showScene = (
        scene: HTMLElement,
        overlay: HTMLDivElement | null,
      ) => {
        tl.set(scene, {
          autoAlpha: 1,
        });

        const text = sceneText(scene);

        tl.fromTo(
          text,
          {
            opacity: 0,
            x: 70,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
        );

        if (overlay) {
          tl.fromTo(
            overlay,
            {
              opacity: 0,
              y: 45,
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.95,
              ease: "power3.out",
            },
            "<0.1",
          );
        }
      };

      const hideScene = (
        scene: HTMLElement,
        overlay: HTMLDivElement | null,
      ) => {
        const text = sceneText(scene);

        tl.to(text, {
          opacity: 0,
          x: -65,
          filter: "blur(8px)",
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.in",
        });

        if (overlay) {
          tl.to(
            overlay,
            {
              opacity: 0,
              y: -35,
              scale: 0.97,
              duration: 0.7,
              ease: "power2.in",
            },
            "<",
          );
        }

        tl.set(scene, {
          autoAlpha: 0,
        });
      };

      /* ================================================================
         SCENE 01
      ================================================================ */

      const idea = overlays[0];

      if (idea) {
        tl.to(
          idea.querySelectorAll(".idea-node"),
          {
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.35,
            ease: "back.out(1.5)",
          },
          "+=0.2",
        );

        tl.to(
          idea.querySelector(".idea-orbit"),
          {
            rotation: 360,
            duration: 2,
            ease: "none",
          },
          "<",
        );

        tl.fromTo(
          idea.querySelector(".idea-orbit-2"),
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "<",
        );
      }

      tl.to({}, { duration: 0.7 });

      hideScene(scenes[0], overlays[0]);

      /* ================================================================
         SCENE 02
      ================================================================ */

      showScene(scenes[1], overlays[1]);

      const vision = overlays[1];

      if (vision) {
        tl.fromTo(
          vision.querySelectorAll(".vision-dimension"),
          {
            scaleY: 0,
            transformOrigin: "top center",
          },
          {
            scaleY: 1,
            duration: 0.65,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.45",
        );

        tl.fromTo(
          vision.querySelector(".vision-trajectory"),
          {
            scaleY: 0,
            transformOrigin: "top center",
          },
          {
            scaleY: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }

      tl.to({}, { duration: 0.75 });

      hideScene(scenes[1], overlays[1]);

      /* ================================================================
         SCENE 03
      ================================================================ */

      showScene(scenes[2], overlays[2]);

      const build = overlays[2];

      if (build) {
        tl.fromTo(
          build.querySelector(".code-panel"),
          {
            x: -45,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.45",
        );

        tl.from(
          build.querySelectorAll(".build-node"),
          {
            opacity: 0,
            scale: 0.7,
            stagger: 0.1,
            duration: 0.4,
            ease: "back.out(1.6)",
          },
          "-=0.3",
        );

        tl.fromTo(
          build.querySelector(".build-terminal"),
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
          },
          "-=0.25",
        );
      }

      tl.to({}, { duration: 0.8 });

      hideScene(scenes[2], overlays[2]);

      /* ================================================================
         SCENE 04
      ================================================================ */

      showScene(scenes[3], overlays[3]);

      const experience = overlays[3];

      if (experience) {
        tl.from(
          experience.querySelectorAll(".interaction-ring"),
          {
            scale: 0.5,
            opacity: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );

        tl.fromTo(
          experience.querySelector(".experience-cursor"),
          {
            x: -45,
            y: 30,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.4",
        );

        tl.to(
          experience.querySelectorAll(".motion-path"),
          {
            strokeDashoffset: -80,
            duration: 1.2,
            ease: "none",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.75 });

      hideScene(scenes[3], overlays[3]);

      /* ================================================================
         SCENE 05
      ================================================================ */

      showScene(scenes[4], overlays[4]);

      const details = overlays[4];

      if (details) {
        tl.from(
          details.querySelectorAll(".detail-card"),
          {
            opacity: 0,
            y: 25,
            scale: 0.92,
            stagger: 0.14,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.45",
        );
      }

      tl.to({}, { duration: 0.75 });

      hideScene(scenes[4], overlays[4]);

      /* ================================================================
         SCENE 06
      ================================================================ */

      showScene(scenes[5], overlays[5]);

      const technology = overlays[5];

      if (technology) {
        tl.from(
          technology.querySelectorAll(".technology-node"),
          {
            opacity: 0,
            scale: 0.55,
            stagger: 0.07,
            duration: 0.45,
            ease: "back.out(1.5)",
          },
          "-=0.5",
        );

        tl.from(
          technology.querySelectorAll(".technology-line"),
          {
            opacity: 0,
            scaleX: 0,
            transformOrigin: "center",
            stagger: 0.06,
            duration: 0.4,
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.75 });

      hideScene(scenes[5], overlays[5]);

      /* ================================================================
         SCENE 07
      ================================================================ */

      showScene(scenes[6], overlays[6]);

      const transformation = overlays[6];

      if (transformation) {
        tl.from(
          transformation.querySelectorAll(".system-node"),
          {
            opacity: 0,
            scale: 0.7,
            stagger: 0.12,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.45",
        );

        tl.fromTo(
          transformation.querySelectorAll(".system-connection"),
          {
            strokeDasharray: 300,
            strokeDashoffset: 300,
          },
          {
            strokeDashoffset: 0,
            stagger: 0.12,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.35",
        );

        tl.to(
          transformation.querySelectorAll(".system-ring"),
          {
            rotation: 360,
            duration: 2,
            stagger: 0.15,
            ease: "none",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.75 });

      hideScene(scenes[6], overlays[6]);

      /* ================================================================
         SCENE 08
      ================================================================ */

      showScene(scenes[7], overlays[7]);

      const launch = overlays[7];

      if (launch) {
        tl.fromTo(
          launch.querySelector(".launch-trajectory"),
          {
            scaleY: 0,
            transformOrigin: "bottom center",
          },
          {
            scaleY: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.45",
        );

        tl.from(
          launch.querySelector(".launch-status"),
          {
            y: -20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.55",
        );

        tl.from(
          launch.querySelectorAll(".launch-card"),
          {
            opacity: 0,
            x: 25,
            stagger: 0.1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.35",
        );

        const progressBars = launch.querySelectorAll(".launch-progress");

        gsap.set(progressBars, {
          width: "0%",
        });

        tl.to(
          progressBars,
          {
            width: "100%",
            stagger: 0.12,
            duration: 0.55,
            ease: "power2.inOut",
          },
          "-=0.25",
        );
      }

      tl.to({}, { duration: 0.8 });

      hideScene(scenes[7], overlays[7]);

      /* ================================================================
         SCENE 09
      ================================================================ */

      showScene(scenes[8], overlays[8]);

      const final = overlays[8];

      if (final) {
        tl.from(
          final.querySelectorAll(".final-label"),
          {
            opacity: 0,
            y: 15,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.45",
        );

        tl.to(
          final.querySelectorAll(".final-orbit"),
          {
            rotation: 360,
            duration: 2.4,
            stagger: 0.15,
            ease: "none",
          },
          "-=0.35",
        );
      }

      tl.to({}, { duration: 1.5 });

      /* ================================================================
         PROGRESS INDICATOR
      ================================================================ */

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=12000",
        scrub: true,

        onUpdate: (self) => {
          if (!progressRef.current) return;

          gsap.set(progressRef.current, {
            scaleY: self.progress,
          });
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  const setSceneRef = (index: number) => (element: HTMLElement | null) => {
    sceneRefs.current[index] = element;
  };

  const setOverlayRef = (index: number) => (element: HTMLDivElement | null) => {
    overlayRefs.current[index] = element;
  };

  return (
    <main
      ref={rootRef}
      className="relative h-[100svh] min-h-screen w-full overflow-hidden bg-[#03040D] text-white"
    >
      <GridBackground />

      {/* ================================================================
         CORNER FRAME
      ================================================================ */}

      <CornerFrame />

      {/* ================================================================
         SCROLL PROGRESS
      ================================================================ */}

      <div className="pointer-events-none absolute right-6 top-1/2 z-[60] hidden h-40 w-px -translate-y-1/2 bg-white/10 sm:right-10 sm:block">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full w-full origin-top scale-y-0 bg-gradient-to-b from-blue-400 via-cyan-300 to-violet-400"
        />
      </div>

      {/* ================================================================
         SCAN
      ================================================================ */}

      <div
        ref={scanRef}
        className="pointer-events-none absolute left-0 top-[-30%] z-50 h-[25%] w-full bg-gradient-to-b from-transparent via-cyan-300/[0.025] to-transparent"
      />

      {/* ================================================================
         SCENE 01 — IDEA
      ================================================================ */}

      <Scene sceneRef={setSceneRef(0)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="scene-copy">
            <SceneLabel number="01" title="The Idea" />

            <h1 className="scene-text max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">
              Every great website
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                starts with an idea.
              </span>
            </h1>

            <p className="scene-text mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Before the layouts, before the code, there is a reason to build. I
              help turn that starting point into something people can
              experience.
            </p>

            <div className="scene-meta mt-9 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <span className="h-px w-8 bg-violet-400" />
              start with purpose
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <IdeaOverlay overlayRef={setOverlayRef(0)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 02 — VISION
      ================================================================ */}

      <Scene sceneRef={setSceneRef(1)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="02" title="The Vision" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">
              I turn ideas
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                into experiences.
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-white/45 sm:text-lg">
              The goal is more than making something look good. It is about
              creating a clear visual direction that makes the purpose
              immediately understandable.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <Sparkles className="h-3 w-3 text-violet-300" />
              shaping the direction
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <VisionOverlay overlayRef={setOverlayRef(1)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 03 — BUILD
      ================================================================ */}

      <Scene sceneRef={setSceneRef(2)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="03" title="The Build" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">
              Where ideas
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                become real.
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-white/45 sm:text-lg">
              This is where design becomes structure, interaction and a working
              digital product.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <Terminal className="h-3 w-3 text-cyan-300" />
              building the system
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <BuildOverlay overlayRef={setOverlayRef(2)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 04 — EXPERIENCE
      ================================================================ */}

      <Scene sceneRef={setSceneRef(3)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="04" title="The Experience" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              A website
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                should feel alive.
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-white/45 sm:text-lg">
              Every movement, transition and interaction has a purpose. The
              finished product should feel natural, intuitive and memorable.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <ExperienceOverlay overlayRef={setOverlayRef(3)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 05 — DETAILS
      ================================================================ */}

      <Scene sceneRef={setSceneRef(4)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="05" title="The Details" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              Small details.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                Big difference.
              </span>
            </h2>

            <p className="scene-text mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              The difference between a functional website and a great experience
              often lives in the details.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <Check className="h-3 w-3 text-cyan-300" />
              refined and verified
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <DetailsOverlay overlayRef={setOverlayRef(4)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 06 — TECHNOLOGY
      ================================================================ */}

      <Scene sceneRef={setSceneRef(5)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="scene-copy">
            <SceneLabel number="06" title="The Technology" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              The right tools
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                behind the experience.
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-white/45 sm:text-lg">
              Modern technologies give ideas the structure, flexibility and
              performance they need to grow.
            </p>

            <div className="scene-meta mt-8 flex flex-wrap gap-2">
              {technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.name}
                  className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.03] px-3 py-1.5 font-mono text-[8px] uppercase tracking-wider text-white/45"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <TechnologyOverlay overlayRef={setOverlayRef(5)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 07 — TRANSFORMATION
      ================================================================ */}

      <Scene sceneRef={setSceneRef(6)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="07" title="The Transformation" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              From thought
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                to reality.
              </span>
            </h2>

            <p className="scene-text mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              A simple process. One clear direction. A finished experience ready
              to be shared with the world.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <Layers3 className="h-3 w-3 text-violet-300" />
              systems integrated
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <TransformationOverlay overlayRef={setOverlayRef(6)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 08 — LAUNCH
      ================================================================ */}

      <Scene sceneRef={setSceneRef(7)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="08" title="The Launch" />

            <h2 className="scene-text text-5xl font-semibold leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-7xl">
              Built.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                Refined.
              </span>
              <span className="block">Ready.</span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-white/45 sm:text-lg">
              Once everything comes together, the experience is ready to leave
              the development environment and meet its audience.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <Zap className="h-3 w-3 text-cyan-300" />
              system ready
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <LaunchOverlay overlayRef={setOverlayRef(7)} />
            </RocketStage>
          </div>
        </div>
      </Scene>

      {/* ================================================================
         SCENE 09 — FINAL
      ================================================================ */}

      <Scene sceneRef={setSceneRef(8)}>
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_.9fr]">
          <div className="scene-copy">
            <SceneLabel number="09" title="Let's Build It" />

            <h2 className="scene-text text-6xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl lg:text-8xl">
              Have
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-400 bg-clip-text text-transparent">
                an idea?
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Let&apos;s turn it into something useful, beautiful and worth
              remembering.
            </p>

            <div className="scene-action mt-10 flex flex-wrap gap-3">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/5 px-6 py-3 text-xs font-medium text-cyan-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/70 hover:bg-cyan-300/10"
              >
                View My Work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-violet-400/5 px-6 py-3 text-xs font-medium text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:bg-violet-400/10"
              >
                Let&apos;s Talk
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <div className="scene-meta mt-10 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.25em] text-white/40">
              <span className="h-px w-8 bg-violet-400" />
              let&apos;s create something meaningful
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RocketStage>
              <FinalOverlay overlayRef={setOverlayRef(8)} />
            </RocketStage>
          </div>
        </div>
      </Scene>
    </main>
  );
}
