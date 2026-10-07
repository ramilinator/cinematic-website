"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
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

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type SceneLabelProps = {
  number: string;
  title: string;
};

type IconType = typeof Code2;

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

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

const details: {
  title: string;
  description: string;
  icon: IconType;
}[] = [
  {
    title: "Interaction",
    description: "Interfaces that respond naturally to every action.",
    icon: MousePointer2,
  },
  {
    title: "Responsive",
    description: "Experiences designed for every screen size.",
    icon: Layers3,
  },
  {
    title: "Performance",
    description: "Fast, focused and built with purpose.",
    icon: Zap,
  },
  {
    title: "Structure",
    description: "Clean systems that remain easy to evolve.",
    icon: Code2,
  },
];

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function SceneLabel({ number, title }: SceneLabelProps) {
  return (
    <div className="scene-label mb-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.28em] text-slate-400">
      <span className="font-mono text-blue-600">{number}</span>

      <span className="h-px w-10 bg-slate-300" />

      <span>{title}</span>
    </div>
  );
}

function CornerFrame() {
  return (
    <div className="pointer-events-none absolute inset-6 sm:inset-10">
      <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-slate-300" />
      <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-slate-300" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-slate-300" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-slate-300" />
    </div>
  );
}

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "240px 240px",
        }}
      />

      <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-3xl" />

      <div className="absolute left-[20%] top-[20%] h-[350px] w-[350px] rounded-full bg-violet-500/[0.025] blur-3xl" />
    </div>
  );
}

function SceneContainer({
  children,
  className = "",
  ref,
}: {
  children: ReactNode;
  className?: string;
  ref?: React.Ref<HTMLElement>;
}) {
  return (
    <section
      ref={ref}
      className={`scene absolute inset-0 flex min-h-screen items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 01 — IDEA                                                           */
/* -------------------------------------------------------------------------- */

function IdeaGraphic() {
  return (
    <div className="idea-graphic relative h-[390px] w-[390px]">
      <div className="absolute inset-10 rounded-full border border-slate-300" />
      <div className="absolute inset-[70px] rounded-full border border-dashed border-blue-300" />
      <div className="absolute inset-[105px] rounded-full border border-slate-200" />

      <div className="absolute left-[18px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" />

      <div className="absolute right-[18px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-500" />

      <div className="absolute left-1/2 top-[18px] h-2 w-2 -translate-x-1/2 rounded-full bg-slate-400" />

      <div className="absolute bottom-[18px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-300" />

      <div className="idea-core absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white/80 shadow-[0_20px_70px_rgba(37,99,235,0.12)] backdrop-blur">
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-blue-600" />

          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400">
            concept
          </div>

          <div className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            IDEA
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 h-[105px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-slate-300" />

      <div className="absolute bottom-0 left-1/2 h-[105px] w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-slate-300" />

      <div className="absolute left-0 top-1/2 h-px w-[105px] bg-gradient-to-r from-transparent to-slate-300" />

      <div className="absolute right-0 top-1/2 h-px w-[105px] bg-gradient-to-l from-transparent to-slate-300" />

      <div className="absolute left-0 top-8 font-mono text-[9px] uppercase tracking-widest text-slate-400">
        POSSIBILITY
      </div>

      <div className="absolute bottom-8 right-0 font-mono text-[9px] uppercase tracking-widest text-slate-400">
        DIRECTION
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 02 — VISION                                                          */
/* -------------------------------------------------------------------------- */

function VisionGraphic() {
  return (
    <div className="vision-graphic relative w-full max-w-[700px]">
      <div className="absolute -inset-10 rounded-[40px] bg-blue-500/[0.035] blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.10)]">
        <div className="flex h-12 items-center border-b border-slate-200 px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>

          <div className="mx-auto flex h-6 w-64 items-center rounded-md bg-slate-50 px-3">
            <span className="font-mono text-[8px] text-slate-400">
              your-digital-experience.dev
            </span>
          </div>
        </div>

        <div className="grid min-h-[350px] grid-cols-[1.25fr_.75fr] gap-8 p-8">
          <div className="flex flex-col justify-center">
            <div className="mb-4 h-2 w-20 rounded-full bg-blue-100" />

            <div className="space-y-2">
              <div className="h-6 w-[85%] rounded bg-slate-900" />
              <div className="h-6 w-[62%] rounded bg-slate-900" />
            </div>

            <div className="mt-6 h-2 w-[75%] rounded bg-slate-100" />
            <div className="mt-2 h-2 w-[65%] rounded bg-slate-100" />

            <div className="mt-8 flex gap-3">
              <div className="h-9 w-28 rounded-lg bg-slate-900" />
              <div className="h-9 w-24 rounded-lg border border-slate-200" />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50" />

            <div className="relative h-44 w-44 rounded-full border border-blue-200">
              <div className="absolute inset-6 rounded-full border border-dashed border-violet-200" />

              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg">
                <Globe2 className="m-auto mt-3 h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
          <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400">
            visual system
          </span>

          <span className="flex items-center gap-2 font-mono text-[8px] text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            assembling
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 03 — BUILD                                                           */
/* -------------------------------------------------------------------------- */

function CodeGraphic() {
  return (
    <div className="code-graphic w-full max-w-[700px]">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111318] shadow-[0_40px_100px_rgba(15,23,42,0.22)]">
        <div className="flex h-12 items-center border-b border-white/[0.08] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>

          <div className="ml-5 flex items-center gap-2 font-mono text-[9px] text-white/40">
            <Code2 className="h-3 w-3" />
            experience.tsx
          </div>

          <div className="ml-auto font-mono text-[8px] uppercase tracking-widest text-emerald-400">
            live
          </div>
        </div>

        <div className="grid grid-cols-[42px_1fr] py-6">
          <div className="select-none border-r border-white/[0.06] text-right font-mono text-[10px] leading-7 text-white/20">
            01
            <br />
            02
            <br />
            03
            <br />
            04
            <br />
            05
            <br />
            06
            <br />
            07
            <br />
            08
          </div>

          <div className="px-6 font-mono text-[11px] leading-7">
            <div>
              <span className="text-violet-400">const</span>{" "}
              <span className="text-blue-300">experience</span>{" "}
              <span className="text-white/50">=</span>{" "}
              <span className="text-white/70">{"{"}</span>
            </div>

            <div className="pl-5">
              <span className="text-white/40">design:</span>{" "}
              <span className="text-emerald-300">"intentional"</span>,
            </div>

            <div className="pl-5">
              <span className="text-white/40">interaction:</span>{" "}
              <span className="text-emerald-300">"fluid"</span>,
            </div>

            <div className="pl-5">
              <span className="text-white/40">performance:</span>{" "}
              <span className="text-emerald-300">"optimized"</span>,
            </div>

            <div className="pl-5">
              <span className="text-white/40">structure:</span>{" "}
              <span className="text-emerald-300">"scalable"</span>,
            </div>

            <div>
              <span className="text-white/70">{"}"}</span>;
            </div>

            <div className="mt-5 flex items-center gap-3 text-[9px] uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" />
              <span className="text-white/40">compiling experience...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
          <span className="font-mono text-[8px] text-white/25">
            main / production
          </span>

          <span className="font-mono text-[8px] text-emerald-400">
            build complete
          </span>
        </div>
      </div>

      <div className="build-terminal ml-auto mt-[-20px] mr-6 w-[260px] overflow-hidden rounded-xl border border-slate-700 bg-[#181a20] shadow-xl">
        <div className="border-b border-white/[0.06] px-4 py-2 font-mono text-[8px] text-white/30">
          terminal
        </div>

        <div className="p-4 font-mono text-[9px] leading-5">
          <div className="text-white/40">$ npm run build</div>
          <div className="text-emerald-400">✓ compiled successfully</div>
          <div className="text-white/30">ready in 1.84s</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 04 — EXPERIENCE                                                       */
/* -------------------------------------------------------------------------- */

function ExperienceGraphic() {
  return (
    <div className="experience-graphic relative w-full max-w-[720px]">
      <div className="absolute -inset-10 rounded-full bg-blue-500/[0.035] blur-3xl" />

      <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_35px_100px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>

          <div className="ml-3 h-6 flex-1 rounded-md bg-slate-50" />

          <div className="h-6 w-6 rounded-md bg-slate-100" />
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[1.4fr_.6fr]">
          <div className="relative overflow-hidden rounded-xl bg-[#f5f7fa] p-7">
            <div className="absolute right-[-20px] top-[-30px] h-36 w-36 rounded-full border border-blue-100" />
            <div className="absolute right-[20px] top-[10px] h-20 w-20 rounded-full border border-dashed border-violet-200" />

            <div className="relative">
              <div className="mb-3 h-2 w-16 rounded-full bg-blue-200" />

              <div className="space-y-2">
                <div className="h-5 w-[80%] rounded bg-slate-900" />
                <div className="h-5 w-[55%] rounded bg-slate-900" />
              </div>

              <div className="mt-5 max-w-[280px] text-[10px] leading-5 text-slate-400">
                Design should communicate before the first interaction.
              </div>

              <div className="mt-6 h-9 w-28 rounded-lg bg-slate-900" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-24 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 h-2 w-10 rounded bg-blue-200" />
              <div className="h-2 w-[70%] rounded bg-slate-200" />
              <div className="mt-2 h-2 w-[50%] rounded bg-slate-200" />
            </div>

            <div className="h-24 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 h-2 w-10 rounded bg-violet-200" />
              <div className="h-2 w-[75%] rounded bg-slate-200" />
              <div className="mt-2 h-2 w-[45%] rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400">
            interaction layer
          </span>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            <span className="font-mono text-[8px] text-blue-600">
              responsive
            </span>
          </div>
        </div>
      </div>

      <div className="experience-cursor absolute bottom-[-15px] right-[18%]">
        <MousePointer2 className="h-8 w-8 fill-slate-900 text-white drop-shadow-lg" />

        <div className="ml-5 mt-[-2px] rounded-full bg-slate-900 px-3 py-1 font-mono text-[8px] text-white">
          interaction
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 05 — DETAILS                                                         */
/* -------------------------------------------------------------------------- */

function DetailsGraphic() {
  return (
    <div className="details-graphic relative grid w-full max-w-[720px] grid-cols-2 gap-3 sm:grid-cols-4">
      {details.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="detail-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.06)]"
          >
            <div className="absolute right-[-25px] top-[-25px] h-20 w-20 rounded-full border border-slate-100 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative">
              <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>

              <div className="font-mono text-[8px] uppercase tracking-widest text-slate-400">
                0{index + 1}
              </div>

              <div className="mt-2 text-sm font-semibold text-slate-900">
                {item.title}
              </div>

              <div className="mt-3 text-[10px] leading-5 text-slate-400">
                {item.description}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
          </div>
        );
      })}

      <div className="absolute -left-8 top-1/2 hidden h-px w-6 bg-slate-300 lg:block" />
      <div className="absolute -right-8 top-1/2 hidden h-px w-6 bg-slate-300 lg:block" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 06 — TECHNOLOGY                                                       */
/* -------------------------------------------------------------------------- */

function TechnologyGraphic() {
  return (
    <div className="technology-graphic relative h-[430px] w-[430px]">
      <div className="absolute inset-8 rounded-full border border-slate-200" />
      <div className="absolute inset-[70px] rounded-full border border-dashed border-blue-200" />
      <div className="absolute inset-[125px] rounded-full border border-slate-100" />

      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white shadow-[0_20px_60px_rgba(37,99,235,0.12)]">
        <Cpu className="mb-2 h-6 w-6 text-blue-600" />

        <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">
          system
        </div>

        <div className="mt-1 text-sm font-semibold text-slate-900">STACK</div>
      </div>

      {technologies.map((technology) => {
        const radius = 170;

        const x = Math.cos((technology.angle * Math.PI) / 180) * radius;

        const y = Math.sin((technology.angle * Math.PI) / 180) * radius;

        return (
          <div
            key={technology.name}
            className="tech-node absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <span className="font-mono text-[9px] font-semibold text-slate-600">
                {technology.short}
              </span>
            </div>

            <div className="mt-2 whitespace-nowrap text-center font-mono text-[7px] uppercase tracking-wider text-slate-400">
              {technology.name}
            </div>
          </div>
        );
      })}

      {technologies.map((technology) => (
        <div
          key={`line-${technology.name}`}
          className="absolute left-1/2 top-1/2 h-px origin-left bg-slate-200"
          style={{
            width: "170px",
            transform: `rotate(${technology.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 07 — TRANSFORMATION                                                   */
/* -------------------------------------------------------------------------- */

function TransformationGraphic() {
  const items = [
    { label: "IDEA", icon: Sparkles },
    { label: "DESIGN", icon: Layers3 },
    { label: "CODE", icon: Code2 },
    { label: "EXPERIENCE", icon: Globe2 },
  ];

  return (
    <div className="transformation-graphic w-full max-w-[800px]">
      <div className="relative">
        <div className="absolute left-[10%] right-[10%] top-1/2 hidden h-px bg-slate-200 sm:block" />

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="transformation-node relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.07)]">
                  <Icon className="h-6 w-6 text-blue-600" />

                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[7px] text-white">
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                  {item.label}
                </div>

                <div className="mt-2 h-1 w-8 rounded-full bg-slate-100" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="font-mono text-[8px] uppercase tracking-[0.35em] text-slate-400">
          one continuous process
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 08 — LAUNCH                                                          */
/* -------------------------------------------------------------------------- */

function LaunchGraphic() {
  return (
    <div className="launch-graphic relative w-full max-w-[560px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Terminal className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-900">
                Deployment
              </div>

              <div className="font-mono text-[7px] uppercase tracking-widest text-slate-400">
                production system
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="font-mono text-[7px] uppercase tracking-widest text-emerald-600">
              ready
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {["Design", "Development", "Optimization", "Deployment"].map(
            (item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>

                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-700">
                    {item}
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="launch-progress h-full w-full rounded-full bg-emerald-400" />
                  </div>
                </div>

                <span className="font-mono text-[7px] text-emerald-600">
                  100%
                </span>
              </div>
            ),
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">
                experience
              </div>

              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                READY
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[7px] text-slate-400">RELEASE</div>

              <div className="font-mono text-xs text-blue-600">01.0.0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-blue-400 to-transparent" />

      <div className="absolute -bottom-10 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,.5)]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SCENE 09 — CTA                                                             */
/* -------------------------------------------------------------------------- */

function FinalGraphic() {
  return (
    <div className="final-graphic relative h-[360px] w-[360px]">
      <div className="absolute inset-0 rounded-full border border-slate-200" />
      <div className="absolute inset-10 rounded-full border border-dashed border-blue-200" />
      <div className="absolute inset-20 rounded-full border border-slate-100" />

      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
            <Code2 className="h-5 w-5 text-white" />
          </div>

          <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">
            start
          </div>

          <div className="mt-1 text-sm font-semibold text-slate-900">BUILD</div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[-2px] h-3 w-3 -translate-x-1/2 rounded-full bg-blue-500" />

      <div className="absolute bottom-[-2px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-500" />

      <div className="absolute left-[-2px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-400" />

      <div className="absolute right-[-2px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-300" />

      <div className="absolute left-8 top-8 font-mono text-[7px] uppercase tracking-widest text-slate-400">
        YOUR IDEA
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-[7px] uppercase tracking-widest text-slate-400">
        YOUR NEXT STEP
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function CinematicHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  const sceneRefs = useRef<(HTMLElement | null)[]>([]);

  const progressRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  const ideaGraphicRef = useRef<HTMLDivElement>(null);
  const visionGraphicRef = useRef<HTMLDivElement>(null);
  const codeGraphicRef = useRef<HTMLDivElement>(null);
  const experienceGraphicRef = useRef<HTMLDivElement>(null);
  const detailsGraphicRef = useRef<HTMLDivElement>(null);
  const technologyGraphicRef = useRef<HTMLDivElement>(null);
  const transformationGraphicRef = useRef<HTMLDivElement>(null);
  const launchGraphicRef = useRef<HTMLDivElement>(null);
  const finalGraphicRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const scenes = sceneRefs.current.filter(Boolean) as HTMLElement[];

      if (!scenes.length) return;

      /* ================================================================
         UNIVERSAL TEXT TRANSITION
      ================================================================ */

      const TEXT_FROM = {
        opacity: 0,
        x: 70,
        filter: "blur(8px)",
      };

      const TEXT_IN = {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      };

      const TEXT_OUT = {
        opacity: 0,
        x: -70,
        filter: "blur(8px)",
      };

      /* ================================================================
         INITIAL SCENE STATE
      ================================================================ */

      gsap.set(scenes, {
        autoAlpha: 0,
      });

      gsap.set(scenes[0], {
        autoAlpha: 1,
      });

      /*
       * Every text element starts from exactly the same
       * hidden state.
       */
      const allText = root.querySelectorAll(
        ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
      );

      gsap.set(allText, TEXT_FROM);

      /*
       * Scene 01 text starts visible.
       */
      const firstText = scenes[0].querySelectorAll(
        ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
      );

      gsap.set(firstText, TEXT_IN);

      /* ================================================================
         GRAPHICS INITIAL STATE
      ================================================================ */

      gsap.set(
        [
          visionGraphicRef.current,
          codeGraphicRef.current,
          experienceGraphicRef.current,
          detailsGraphicRef.current,
          technologyGraphicRef.current,
          transformationGraphicRef.current,
          launchGraphicRef.current,
          finalGraphicRef.current,
        ],
        {
          opacity: 0,
          y: 50,
          scale: 0.94,
        },
      );

      gsap.set(ideaGraphicRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.94,
      });

      /* ================================================================
         AMBIENT SCAN
      ================================================================ */

      gsap.to(scanRef.current, {
        yPercent: 100,
        duration: 5,
        repeat: -1,
        ease: "none",
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
         TEXT TRANSITION HELPER
      ================================================================ */

      const animateSceneText = (scene: HTMLElement, isFirst = false) => {
        const textElements = scene.querySelectorAll(
          ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
        );

        if (!textElements.length) return;

        if (!isFirst) {
          gsap.set(textElements, TEXT_FROM);

          tl.to(textElements, {
            ...TEXT_IN,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          });
        } else {
          tl.to(textElements, {
            ...TEXT_IN,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          });
        }
      };

      const exitSceneText = (scene: HTMLElement) => {
        const textElements = scene.querySelectorAll(
          ".scene-copy, .scene-label, .scene-text, .scene-action, .scene-meta",
        );

        if (!textElements.length) return;

        tl.to(textElements, {
          ...TEXT_OUT,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.in",
        });
      };

      /* ================================================================
         SCENE 01
      ================================================================ */

      tl.to(ideaGraphicRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      });

      tl.to(
        ideaGraphicRef.current,
        {
          rotate: 5,
          duration: 1.8,
          ease: "none",
        },
        "<",
      );

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[0]);

      tl.to(
        ideaGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[0], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 02
      ================================================================ */

      tl.set(scenes[1], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[1]);

      tl.to(
        visionGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      tl.to({}, { duration: 0.9 });

      exitSceneText(scenes[1]);

      tl.to(
        visionGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[1], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 03
      ================================================================ */

      tl.set(scenes[2], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[2]);

      tl.to(
        codeGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      const codeLines = codeGraphicRef.current?.querySelectorAll(
        ".px-6.font-mono > div",
      );

      if (codeLines) {
        tl.from(
          codeLines,
          {
            opacity: 0,
            y: 15,
            stagger: 0.08,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.55",
        );
      }

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[2]);

      tl.to(
        codeGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[2], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 04
      ================================================================ */

      tl.set(scenes[3], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[3]);

      tl.to(
        experienceGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      tl.fromTo(
        experienceGraphicRef.current?.querySelector(".experience-cursor"),
        {
          x: -70,
          y: 40,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      );

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[3]);

      tl.to(
        experienceGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[3], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 05
      ================================================================ */

      tl.set(scenes[4], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[4]);

      tl.to(
        detailsGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      const detailCards =
        detailsGraphicRef.current?.querySelectorAll(".detail-card");

      if (detailCards) {
        tl.from(
          detailCards,
          {
            opacity: 0,
            y: 25,
            scale: 0.95,
            stagger: 0.1,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[4]);

      tl.to(
        detailsGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[4], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 06
      ================================================================ */

      tl.set(scenes[5], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[5]);

      tl.to(
        technologyGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      const techNodes =
        technologyGraphicRef.current?.querySelectorAll(".tech-node");

      if (techNodes) {
        tl.from(
          techNodes,
          {
            opacity: 0,
            scale: 0.8,
            stagger: 0.06,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[5]);

      tl.to(
        technologyGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[5], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 07
      ================================================================ */

      tl.set(scenes[6], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[6]);

      tl.to(
        transformationGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      const transformationNodes =
        transformationGraphicRef.current?.querySelectorAll(
          ".transformation-node",
        );

      if (transformationNodes) {
        tl.from(
          transformationNodes,
          {
            opacity: 0,
            y: 25,
            scale: 0.95,
            stagger: 0.12,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[6]);

      tl.to(
        transformationGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[6], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 08
      ================================================================ */

      tl.set(scenes[7], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[7]);

      tl.to(
        launchGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      const progressBars =
        launchGraphicRef.current?.querySelectorAll(".launch-progress");

      if (progressBars) {
        gsap.set(progressBars, {
          width: "0%",
        });

        tl.to(
          progressBars,
          {
            width: "100%",
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "-=0.5",
        );
      }

      tl.to({}, { duration: 0.8 });

      exitSceneText(scenes[7]);

      tl.to(
        launchGraphicRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.96,
          duration: 0.9,
          ease: "power2.in",
        },
        "<",
      );

      tl.set(scenes[7], {
        autoAlpha: 0,
      });

      /* ================================================================
         SCENE 09
      ================================================================ */

      tl.set(scenes[8], {
        autoAlpha: 1,
      });

      animateSceneText(scenes[8]);

      tl.to(
        finalGraphicRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        "<0.15",
      );

      tl.to(
        finalGraphicRef.current,
        {
          rotate: -5,
          duration: 1.8,
          ease: "none",
        },
        "<",
      );

      /* ================================================================
         PROGRESS INDICATOR
      ================================================================ */

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=12000",
        scrub: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleY: self.progress,
            });
          }
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const setSceneRef = (index: number) => (element: HTMLElement | null) => {
    sceneRefs.current[index] = element;
  };

  return (
    <main
      ref={rootRef}
      className="relative h-screen overflow-hidden bg-[#f6f7f9] text-[#111318]"
    >
      <GridBackground />

      <CornerFrame />

      {/* ------------------------------------------------------------------ */}
      {/* SIDE PROGRESS                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute right-6 top-1/2 z-50 hidden h-40 w-px -translate-y-1/2 bg-slate-200 sm:right-10 sm:block">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full w-full origin-top scale-y-0 bg-blue-500"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SCAN                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={scanRef}
        className="pointer-events-none absolute left-0 top-[-100%] z-40 h-[30%] w-full bg-gradient-to-b from-transparent via-blue-400/[0.025] to-transparent"
      />

      {/* ================================================================== */}
      {/* SCENE 01                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(0)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <div className="scene-copy">
            <SceneLabel number="01" title="The Idea" />

            <h1 className="scene-text max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Every great website
              <span className="block text-blue-600">starts with an idea.</span>
            </h1>

            <p className="scene-text mt-8 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Before the layouts, before the code, there is a reason to build. I
              help turn that starting point into something people can
              experience.
            </p>

            <div className="scene-meta mt-10 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">
              <span className="h-px w-8 bg-blue-500" />
              start with purpose
            </div>
          </div>

          <div
            ref={ideaGraphicRef}
            className="flex justify-center lg:justify-end"
          >
            <IdeaGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 02                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(1)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="02" title="The Vision" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              I turn ideas
              <span className="block text-blue-600">into experiences.</span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-slate-500">
              The goal is more than making something look good. It is about
              creating a clear visual direction that makes the purpose
              immediately understandable.
            </p>
          </div>

          <div ref={visionGraphicRef}>
            <VisionGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 03                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(2)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div className="scene-copy">
            <SceneLabel number="03" title="The Build" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Where ideas
              <span className="block text-blue-600">become real.</span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-slate-500">
              This is where design becomes structure, interaction and a working
              digital product.
            </p>

            <div className="scene-meta mt-8 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-400">
              <Terminal className="h-3 w-3 text-blue-600" />
              building the experience
            </div>
          </div>

          <div ref={codeGraphicRef}>
            <CodeGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 04                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(3)}>
        <div className="w-full max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div className="scene-copy">
              <SceneLabel number="04" title="The Experience" />

              <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
                A website
                <span className="block text-blue-600">should feel alive.</span>
              </h2>

              <p className="scene-text mt-8 max-w-lg text-base leading-7 text-slate-500">
                Every movement, transition and interaction has a purpose. The
                finished product should feel natural, intuitive and memorable.
              </p>
            </div>

            <div ref={experienceGraphicRef}>
              <ExperienceGraphic />
            </div>
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 05                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(4)}>
        <div className="w-full max-w-6xl">
          <div className="scene-copy mb-12 max-w-2xl">
            <SceneLabel number="05" title="The Details" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Small details.
              <span className="block text-blue-600">Big difference.</span>
            </h2>

            <p className="scene-text mt-6 max-w-xl text-base leading-7 text-slate-500">
              The difference between a functional website and a great experience
              often lives in the details.
            </p>
          </div>

          <div ref={detailsGraphicRef}>
            <DetailsGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 06                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(5)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <div className="scene-copy">
            <SceneLabel number="06" title="The Technology" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              The right tools
              <span className="block text-blue-600">
                behind the experience.
              </span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-slate-500">
              Modern technologies give ideas the structure, flexibility and
              performance they need to grow.
            </p>

            <div className="scene-meta mt-8 flex flex-wrap gap-2">
              {technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.name}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-[8px] uppercase tracking-wider text-slate-500"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={technologyGraphicRef}
            className="flex justify-center lg:justify-end"
          >
            <TechnologyGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 07                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(6)}>
        <div className="w-full max-w-6xl">
          <div className="scene-copy mx-auto mb-14 max-w-2xl text-center">
            <SceneLabel number="07" title="The Transformation" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              From thought
              <span className="text-blue-600"> to reality.</span>
            </h2>

            <p className="scene-text mx-auto mt-6 max-w-xl text-base leading-7 text-slate-500">
              A simple process. One clear direction. A finished experience ready
              to be shared with the world.
            </p>
          </div>

          <div ref={transformationGraphicRef}>
            <TransformationGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 08                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(7)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="scene-copy">
            <SceneLabel number="08" title="The Launch" />

            <h2 className="scene-text text-5xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Built.
              <span className="block text-blue-600">Refined.</span>
              <span className="block">Ready.</span>
            </h2>

            <p className="scene-text mt-8 max-w-lg text-base leading-7 text-slate-500">
              Once everything comes together, the experience is ready to leave
              the development environment and meet its audience.
            </p>
          </div>

          <div ref={launchGraphicRef}>
            <LaunchGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* SCENE 09                                                            */}
      {/* ================================================================== */}

      <SceneContainer ref={setSceneRef(8)}>
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.8fr]">
          <div className="scene-copy">
            <SceneLabel number="09" title="Let's Build It" />

            <h2 className="scene-text text-6xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Have
              <span className="block text-blue-600">an idea?</span>
            </h2>

            <p className="scene-text mt-8 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Let&apos;s turn it into something useful, beautiful and worth
              remembering.
            </p>

            <div className="scene-action mt-10 flex flex-wrap gap-3">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-xs font-medium text-white transition-transform duration-300 hover:-translate-y-1"
              >
                View My Work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-medium text-slate-800 transition-transform duration-300 hover:-translate-y-1"
              >
                Let&apos;s Talk
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <div className="scene-meta mt-10 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.25em] text-slate-400">
              <span className="h-px w-8 bg-blue-500" />
              let&apos;s create something meaningful
            </div>
          </div>

          <div
            ref={finalGraphicRef}
            className="flex justify-center lg:justify-end"
          >
            <FinalGraphic />
          </div>
        </div>
      </SceneContainer>

      {/* ================================================================== */}
      {/* BOTTOM HUD                                                           */}
      {/* ================================================================== */}

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-3 sm:flex">
        <ArrowDown className="h-3.5 w-3.5 text-blue-600" />

        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-400">
          Scroll to explore
        </span>
      </div>
    </main>
  );
}
