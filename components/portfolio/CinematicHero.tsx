"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
|--------------------------------------------------------------------------
| CINEMATIC SPACE EXPLORER HERO
|--------------------------------------------------------------------------
|
| 01  Pilot identification
| 02  System boot
| 03  Navigation lights
| 04  Ship elevation
| 05  Engine ignition
| 06  Ready for launch
| 07  Engine burst
| 08  Departure
|
|--------------------------------------------------------------------------
*/

const stars = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  left: `${(i * 47.37) % 100}%`,
  top: `${(i * 71.83) % 100}%`,
  size: i % 7 === 0 ? 2 : 1,
  opacity: 0.25 + ((i * 13) % 60) / 100,
}));

function HudCorners() {
  return (
    <>
      <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan-400/60" />
      <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan-400/60" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan-400/60" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan-400/60" />
    </>
  );
}

function HudLabel({
  children,
  violet = false,
}: {
  children: React.ReactNode;
  violet?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[9px] tracking-[0.35em] ${
        violet ? "text-violet-300" : "text-cyan-300"
      }`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CSS SPACECRAFT                                                             */
/* -------------------------------------------------------------------------- */

function Spacecraft() {
  return (
    <div className="spacecraft relative h-[300px] w-[540px]">
      {/* Atmospheric glow */}
      <div className="absolute left-1/2 top-[55%] h-[220px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

      {/* Engine exhaust */}
      <div className="engine-glow absolute left-1/2 top-[76%] z-0 flex -translate-x-1/2 gap-5">
        <div className="engine-flame h-[100px] w-[48px] rounded-b-[30px] bg-gradient-to-b from-white via-cyan-300 to-blue-600 opacity-0 blur-[7px]" />

        <div className="engine-flame h-[120px] w-[55px] rounded-b-[35px] bg-gradient-to-b from-white via-cyan-300 to-blue-600 opacity-0 blur-[8px]" />

        <div className="engine-flame h-[100px] w-[48px] rounded-b-[30px] bg-gradient-to-b from-white via-cyan-300 to-blue-600 opacity-0 blur-[7px]" />
      </div>

      {/* Main ship */}
      <div className="ship-body absolute left-1/2 top-1/2 z-10 h-[145px] w-[300px] -translate-x-1/2 -translate-y-1/2">
        {/* Left wing */}
        <div
          className="
            absolute left-[-135px] top-[47px]
            h-[62px] w-[160px]
            origin-right -skew-y-[18deg]
            rounded-l-[45px] rounded-br-[12px]
            border border-cyan-300/20
            bg-gradient-to-br from-slate-800 via-slate-900 to-[#050914]
            shadow-[inset_0_0_30px_rgba(34,211,238,0.08)]
          "
        >
          <div className="absolute right-5 top-1/2 h-[2px] w-20 -translate-y-1/2 bg-cyan-300/40 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

          <div className="absolute right-10 top-[38px] h-[3px] w-10 bg-violet-400/60" />
        </div>

        {/* Right wing */}
        <div
          className="
            absolute right-[-135px] top-[47px]
            h-[62px] w-[160px]
            origin-left skew-y-[18deg]
            rounded-r-[45px] rounded-bl-[12px]
            border border-cyan-300/20
            bg-gradient-to-bl from-slate-800 via-slate-900 to-[#050914]
            shadow-[inset_0_0_30px_rgba(34,211,238,0.08)]
          "
        >
          <div className="absolute left-5 top-1/2 h-[2px] w-20 -translate-y-1/2 bg-cyan-300/40 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

          <div className="absolute left-10 top-[38px] h-[3px] w-10 bg-violet-400/60" />
        </div>

        {/* Central fuselage */}
        <div
          className="
            absolute left-1/2 top-1/2
            h-[125px] w-[250px]
            -translate-x-1/2 -translate-y-1/2
            rounded-[48%_48%_30%_30%]
            border border-cyan-200/20
            bg-gradient-to-b from-slate-600 via-slate-900 to-[#03050c]
            shadow-[inset_0_12px_35px_rgba(255,255,255,0.06),0_0_45px_rgba(34,211,238,0.08)]
          "
        />

        {/* Upper spine */}
        <div
          className="
            absolute left-1/2 top-[12px]
            h-[70px] w-[105px]
            -translate-x-1/2
            rounded-[50%_50%_35%_35%]
            border border-cyan-200/20
            bg-gradient-to-b from-slate-500 to-slate-950
          "
        />

        {/* Rear canopy */}
        <div
          className="
            absolute left-1/2 top-[22px]
            h-[43px] w-[86px]
            -translate-x-1/2
            rounded-[50%]
            border border-cyan-200/30
            bg-gradient-to-b from-cyan-200/30 via-blue-500/15 to-transparent
            shadow-[0_0_20px_rgba(34,211,238,0.15)]
          "
        />

        {/* Center light */}
        <div
          className="
            ship-light absolute left-1/2 top-[91px]
            h-[4px] w-[105px]
            -translate-x-1/2
            rounded-full
            bg-cyan-300
            opacity-0
            shadow-[0_0_8px_#67e8f9,0_0_20px_#22d3ee]
          "
        />

        {/* Left navigation light */}
        <div
          className="
            nav-light-left absolute left-[23px] top-[66px]
            h-[6px] w-[6px] rounded-full
            bg-cyan-300 opacity-0
            shadow-[0_0_12px_#22d3ee]
          "
        />

        {/* Right navigation light */}
        <div
          className="
            nav-light-right absolute right-[23px] top-[66px]
            h-[6px] w-[6px] rounded-full
            bg-violet-300 opacity-0
            shadow-[0_0_12px_#a78bfa]
          "
        />

        {/* Engine housing */}
        <div className="absolute bottom-[-5px] left-1/2 flex -translate-x-1/2 gap-5">
          {[0, 1, 2].map((engine) => (
            <div
              key={engine}
              className="
                engine-housing
                h-[28px] w-[42px]
                rounded-b-xl
                border border-slate-600/60
                bg-gradient-to-b from-slate-700 to-black
              "
            >
              <div className="engine-core mx-auto mt-1 h-[8px] w-[22px] rounded-full bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/* PILOT PROFILE HUD                                                          */
/* -------------------------------------------------------------------------- */

function PilotProfile() {
  return (
    <div className="relative w-[min(760px,calc(100vw-32px))] sm:w-[min(760px,calc(100vw-48px))]">
      {/* Outer HUD frame */}
      <div
        className="
          relative
          border border-cyan-300/20
          bg-cyan-950/[0.035]
          px-4 py-5
          backdrop-blur-[3px]
          sm:px-7 sm:py-7
          md:px-10 md:py-9
        "
      >
        {/* HUD corner brackets */}
        <div className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-300/70 sm:h-8 sm:w-8" />
        <div className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-300/70 sm:h-8 sm:w-8" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-300/70 sm:h-8 sm:w-8" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-300/70 sm:h-8 sm:w-8" />

        {/* Top scan line */}
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

        {/* Header */}
        <div
          className="
            mb-5 flex items-center justify-between
            border-b border-cyan-300/10 pb-3
            sm:mb-7 sm:pb-4
          "
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)] sm:h-2.5 sm:w-2.5" />

            <span className="truncate font-mono text-[9px] tracking-[0.25em] text-cyan-200/90 sm:text-sm sm:tracking-[0.4em]">
              PILOT IDENTIFICATION
            </span>
          </div>

          <span className="ml-3 shrink-0 font-mono text-[8px] tracking-[0.2em] text-cyan-300/40 sm:text-xs sm:tracking-[0.3em]">
            ID // 001
          </span>
        </div>

        {/* Main profile */}
        <div
          className="
            flex flex-col items-center gap-7
            sm:gap-8
            md:flex-row md:items-center md:gap-10
          "
        >
          {/* Profile image */}
          <div
            className="
              relative
              h-[150px] w-[150px] shrink-0
              sm:h-[180px] sm:w-[180px]
              md:h-[220px] md:w-[220px]
            "
          >
            {/* Targeting frame */}
            <div className="absolute inset-0 border border-cyan-300/20" />

            {/* Corner brackets */}
            <div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-cyan-300/80 sm:-left-3 sm:-top-3 sm:h-8 sm:w-8" />
            <div className="absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-cyan-300/80 sm:-right-3 sm:-top-3 sm:h-8 sm:w-8" />
            <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-cyan-300/80 sm:-bottom-3 sm:-left-3 sm:h-8 sm:w-8" />
            <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-cyan-300/80 sm:-bottom-3 sm:-right-3 sm:h-8 sm:w-8" />

            {/* Portrait viewport */}
            <div className="absolute inset-2 overflow-hidden bg-cyan-950/[0.08] sm:inset-3">
              <div className="absolute inset-0 scale-[1.20]">
                <Image
                  src="/images/profile.png"
                  alt="Ramil Aoanan"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Static horizontal scanlines */}
              <div
                className="
                  pointer-events-none absolute inset-0 z-10
                  opacity-30
                  bg-[repeating-linear-gradient(
                    to_bottom,
                    transparent 0px,
                    transparent 3px,
                    rgba(103,232,249,0.08) 4px,
                    transparent 5px
                  )]
                "
              />

              {/* Moving scan beam */}
              <div
                className="
              pointer-events-none absolute
              left-0 top-[-25%]
              z-20
              h-[20%] w-full
              animate-[profileScan_3.6s_linear_infinite]
              bg-gradient-to-b
              from-transparent
              via-cyan-300/20
              to-transparent
              shadow-[0_0_18px_rgba(34,211,238,0.25)]
              "
              />

              {/* Bright scan edge */}
              <div
                className="
              pointer-events-none absolute
              left-0 top-[-25%]
              z-20
              h-px w-full
              animate-[profileScanLine_3.6s_linear_infinite]
              bg-cyan-300/70
              shadow-[0_0_8px_rgba(103,232,249,0.9)]
              "
              />

              {/* Image vignette */}
              <div
                className="
                  pointer-events-none absolute inset-0 z-30
                  bg-[radial-gradient(
                    circle,
                    transparent 45%,
                    rgba(8,145,178,0.10) 75%,
                    rgba(2,3,10,0.28) 100%
                  )]
                "
              />

              {/* Subtle cyan tint */}
              <div className="pointer-events-none absolute inset-0 z-30 bg-cyan-400/[0.025]" />
            </div>

            {/* Image status */}
            <div className="absolute -bottom-5 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap bg-[#02030a] px-2 font-mono text-[7px] tracking-[0.2em] text-cyan-300/50 sm:-bottom-6 sm:px-3 sm:text-[10px] sm:tracking-[0.25em]">
              BIOMETRIC // VERIFIED
            </div>
          </div>

          {/* Profile information */}
          <div className="w-full min-w-0 text-center md:text-left">
            <div className="mb-1 font-mono text-[8px] tracking-[0.28em] text-cyan-300/45 sm:text-[10px] sm:tracking-[0.35em]">
              DESIGNATION
            </div>

            <div className="mb-1 whitespace-nowrap text-2xl font-light tracking-[0.08em] text-white sm:text-3xl md:text-4xl md:tracking-[0.12em]">
              RAMIL AOANAN
            </div>

            <div className="mb-5 font-mono text-[9px] tracking-[0.2em] text-cyan-300/70 sm:mb-7 sm:text-xs sm:text-sm sm:tracking-[0.28em]">
              EXPLORATION PILOT
            </div>

            {/* Data rows */}
            <div className="space-y-3 border-l-0 pl-0 sm:space-y-4 md:border-l md:border-cyan-300/15 md:pl-5">
              <div>
                <div className="font-mono text-[8px] tracking-[0.22em] text-white/30 sm:text-[10px] sm:tracking-[0.28em]">
                  SPECIALIZATION
                </div>

                <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-white/75 sm:text-sm sm:tracking-[0.16em]">
                  WEB SYSTEMS
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] tracking-[0.22em] text-white/30 sm:text-[10px] sm:tracking-[0.28em]">
                  PRIMARY STACK
                </div>

                <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-white/75 sm:text-sm sm:tracking-[0.16em]">
                  REACT / NEXT.JS
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] tracking-[0.22em] text-white/30 sm:text-[10px] sm:tracking-[0.28em]">
                  EXPERIENCE
                </div>

                <div className="mt-1 font-mono text-[10px] tracking-[0.12em] text-white/75 sm:text-sm sm:tracking-[0.16em]">
                  05+ YEARS
                </div>
              </div>

              <div>
                <div className="font-mono text-[8px] tracking-[0.22em] text-white/30 sm:text-[10px] sm:tracking-[0.28em]">
                  MISSION STATUS
                </div>

                <div className="mt-1 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.12em] text-cyan-300 md:justify-start sm:text-sm sm:tracking-[0.16em]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
                  ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status strip */}
        <div className="mt-7 flex flex-col items-center gap-2 border-t border-cyan-300/10 pt-3 sm:mt-9 sm:flex-row sm:justify-between sm:pt-4">
          <div className="font-mono text-[7px] tracking-[0.2em] text-white/25 sm:text-[10px] sm:tracking-[0.3em]">
            EXPLORATION PROGRAM // NX-01
          </div>

          <div className="font-mono text-[7px] tracking-[0.2em] text-cyan-300/45 sm:text-[10px] sm:tracking-[0.3em]">
            AUTHORIZED PILOT
          </div>
        </div>

        {/* Decorative data marks - hidden on mobile */}
        <div className="absolute -right-12 top-1/2 hidden -translate-y-1/2 flex-col gap-1 opacity-40 sm:flex">
          <div className="h-px w-8 bg-cyan-300" />
          <div className="h-px w-5 bg-cyan-300" />
          <div className="h-px w-10 bg-cyan-300" />
          <div className="h-px w-4 bg-cyan-300" />
          <div className="h-px w-7 bg-cyan-300" />
        </div>
      </div>
    </div>
  );
}

export default function CinematicHero() {
  const scrollProgress = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const starsLayer = useRef<HTMLDivElement>(null);
  const ship = useRef<HTMLDivElement>(null);
  const shipGlow = useRef<HTMLDivElement>(null);
  const horizon = useRef<HTMLDivElement>(null);
  const pilotProfile = useRef<HTMLDivElement>(null);

  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const [audioOn, setAudioOn] = useState(false);

  useEffect(() => {
    if (!root.current || !ship.current) return;

    const ctx = gsap.context(() => {
      const messageSequence = [
        "INITIALIZING EXPLORATION SYSTEM",
        "NAVIGATION ARRAY ONLINE",
        "LIFE SUPPORT SYSTEMS STABLE",
        "PROPULSION SYSTEM STANDBY",
        "FLIGHT CONTROL READY",
      ];

      /*
       * ----------------------------------------------------------------------
       * INITIAL STATE
       * ----------------------------------------------------------------------
       */

      gsap.set(ship.current, {
        y: 150,
        scale: 0.82,
        opacity: 0,
      });

      gsap.set(pilotProfile.current, {
        opacity: 0,
        scale: 0.96,
        y: 10,
      });

      gsap.set(".ship-light", {
        opacity: 0,
      });

      gsap.set(".nav-light-left, .nav-light-right", {
        opacity: 0,
      });

      gsap.set(".engine-core", {
        backgroundColor: "#334155",
        boxShadow: "none",
      });

      gsap.set(".engine-flame", {
        opacity: 0,
        scaleY: 0.15,
        transformOrigin: "top center",
      });

      gsap.set(".engine-glow", {
        opacity: 0,
      });

      gsap.set(shipGlow.current, {
        opacity: 0,
      });

      gsap.set(horizon.current, {
        opacity: 0,
      });

      /*
       * ----------------------------------------------------------------------
       * BOOT MESSAGES
       * ----------------------------------------------------------------------
       */

      let messageIndex = 0;

      const messageTimer = window.setInterval(() => {
        if (messageIndex >= messageSequence.length) {
          window.clearInterval(messageTimer);
          return;
        }

        setBootMessages((previous) => [
          ...previous,
          messageSequence[messageIndex],
        ]);

        messageIndex++;
      }, 850);

      /*
       * ----------------------------------------------------------------------
       * INTRO TIMELINE
       * ----------------------------------------------------------------------
       */

      const intro = gsap.timeline({
        delay: 0.3,
      });

      /*
       * SCENE 01
       * Pilot identification appears in the center.
       */

      intro
        .to(pilotProfile.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
        })
        /*
         * Hold pilot profile briefly.
         */
        .to(
          {},
          {
            duration: 2.2,
          },
        )

        /*
         * SCENE 02
         * Ship reveals while parked.
         */
        .to(ship.current, {
          opacity: 1,
          duration: 2.2,
          ease: "power2.out",
        })

        /*
         * SCENE 03
         * Ship gently rises into center.
         */
        .to(ship.current, {
          y: 0,
          scale: 1,
          duration: 2.8,
          ease: "power3.inOut",
        })

        /*
         * SCENE 04
         * Navigation lights.
         */
        .to(
          ".nav-light-left, .nav-light-right",
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=0.7",
        )

        /*
         * Body lights.
         */
        .to(
          ".ship-light",
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.2",
        )

        /*
         * SCENE 05
         * Engine startup.
         */
        .to(".engine-core", {
          backgroundColor: "#67e8f9",
          boxShadow: "0 0 14px rgba(34,211,238,.9)",
          duration: 1.5,
        })

        /*
         * Engine glow.
         */
        .to(
          ".engine-glow",
          {
            opacity: 0.75,
            duration: 1,
          },
          "-=0.8",
        )

        /*
         * SCENE 06
         * Engine idle.
         */
        .to(".engine-flame", {
          opacity: 0.65,
          scaleY: 0.45,
          duration: 1,
          stagger: 0.08,
        })

        /*
         * Horizon.
         */
        .to(
          horizon.current,
          {
            opacity: 1,
            duration: 1.5,
          },
          "-=0.8",
        );

      /*
       * ----------------------------------------------------------------------
       * ENGINE IDLE
       * ----------------------------------------------------------------------
       */

      const engineIdle = gsap.to(".engine-flame", {
        scaleY: 0.7,
        opacity: 0.85,
        duration: 0.32,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      engineIdle.play();

      /*
       * ----------------------------------------------------------------------
       * SCROLL LAUNCH TIMELINE
       * ----------------------------------------------------------------------
       */

      const launch = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=6500",
          scrub: 2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (scrollProgress.current) {
              gsap.set(scrollProgress.current, {
                width: `${Math.max(4, self.progress * 100)}%`,
              });
            }
          },
        },
      });

      launch.to(
        pilotProfile.current,
        {
          opacity: 0,
          scale: 0.98,
          y: -12,
          duration: 0.45,
        },
        0,
      );

      /*
       * SCENE 07
       * Engine burst.
       */

      launch.to(
        ".engine-flame",
        {
          opacity: 1,
          scaleY: 1.8,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.in",
        },
        0,
      );

      launch.to(
        ".engine-glow",
        {
          opacity: 1,
          scale: 1.35,
          duration: 0.8,
          ease: "power2.in",
        },
        0,
      );

      launch.to(
        ship.current,
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0.5,
      );

      launch.to(
        ship.current,
        {
          y: "-=180",
          scale: 0.62,
          duration: 2.2,
          ease: "power2.in",
        },
        0.8,
      );

      /*
       * Stars accelerate past the spacecraft.
       */
      launch.to(
        starsLayer.current,
        {
          y: 700,
          scale: 1.2,
          duration: 2.2,
          ease: "power2.in",
        },
        0.8,
      );

      launch.to(
        horizon.current,
        {
          scaleY: 2.5,
          opacity: 0,
          duration: 2,
          ease: "power2.in",
        },
        1,
      );

      /*
       * ----------------------------------------------------------------------
       * SCENE 09
       * Deep-space departure.
       *
       * The spacecraft progressively becomes smaller:
       *
       * 0.62  →  0.30  →  0.12  →  0.035  →  0.008
       *
       * This makes it visually transition from spacecraft → distant craft
       * → tiny point → star-like dot.
       * ----------------------------------------------------------------------
       */

      /* Stage 1 — distant spacecraft */
      launch.to(
        ship.current,
        {
          y: "-=180",
          scale: 0.3,
          duration: 1.8,
          ease: "power3.in",
        },
        3,
      );

      /* Stage 2 — very distant */
      launch.to(
        ship.current,
        {
          y: "-=120",
          scale: 0.12,
          duration: 1.6,
          ease: "power3.in",
        },
        4.8,
      );

      /* Stage 3 — tiny spacecraft */
      launch.to(
        ship.current,
        {
          y: "-=70",
          scale: 0.035,
          duration: 1.5,
          ease: "power4.in",
        },
        6.4,
      );

      /* Stage 4 — star-like point */
      launch.to(
        ship.current,
        {
          y: "-=35",
          scale: 0.008,
          opacity: 0.85,
          duration: 1.2,
          ease: "power4.in",
        },
        7.9,
      );

      /*
       * Final disappearance.
       *
       * Keep this extremely small so the spacecraft appears to become
       * a distant point of light rather than simply shrinking away.
       */
      launch.to(
        ship.current,
        {
          scale: 0.001,
          opacity: 0,
          duration: 0.7,
          ease: "power4.in",
        },
        9.1,
      );

      /*
       * Engine exhaust disappears separately.
       */
      launch.to(
        ".engine-flame",
        {
          opacity: 0,
          scaleY: 0.2,
          duration: 1.2,
          ease: "power2.in",
        },
        6.8,
      );

      /*
       * Star field initial state.
       */
      gsap.set(starsLayer.current, {
        scale: 1,
      });

      return () => {
        window.clearInterval(messageTimer);
        engineIdle.kill();
        launch.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className="
        relative h-screen w-full
        overflow-hidden
        bg-[#02030a]
        text-white
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* SPACE BACKGROUND                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Blue atmosphere */}
        <div
          className="
            absolute left-1/2 top-[42%]
            h-[65vh] w-[65vw]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-blue-700/10
            blur-[130px]
          "
        />

        {/* Violet atmosphere */}
        <div
          className="
            absolute right-[-10%] top-[25%]
            h-[50vh] w-[45vw]
            rounded-full
            bg-violet-700/10
            blur-[130px]
          "
        />

        {/* Star field */}
        <div ref={starsLayer} className="absolute inset-[-20%]">
          {stars.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* Nebula streak */}
        <div
          className="
            absolute left-[-20%] top-[42%]
            h-[1px] w-[140%]
            rotate-[-8deg]
            bg-gradient-to-r
            from-transparent
            via-cyan-400/20
            to-transparent
            blur-[2px]
          "
        />

        {/* Horizon */}
        <div
          ref={horizon}
          className="
            absolute left-1/2 top-[72%]
            h-[130px] w-[80vw]
            -translate-x-1/2
            rounded-[50%]
            bg-cyan-400/10
            blur-[55px]
          "
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TOP HUD                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="absolute left-0 right-0 top-0 z-40 px-6 py-6 md:px-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs tracking-[0.45em] text-cyan-300">
              RAMIL
            </div>

            <div className="mt-1 font-mono text-[8px] tracking-[0.35em] text-white/40">
              EXPLORATION SYSTEM
            </div>
          </div>

          <button
            onClick={() => setAudioOn((value) => !value)}
            className="
              font-mono text-[9px]
              tracking-[0.25em]
              text-white/50
              transition
              hover:text-cyan-300
            "
          >
            AUDIO SYSTEM // {audioOn ? "ONLINE" : "OFFLINE"}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* CENTER TITLE                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute left-1/2 top-[11%] z-30 -translate-x-1/2 text-center">
        <HudLabel>MISSION 001</HudLabel>

        <h1 className="mt-3 text-2xl font-light tracking-[0.35em] text-white/90 md:text-4xl">
          BEYOND THE HORIZON
        </h1>

        <p className="mt-3 font-mono text-[9px] tracking-[0.3em] text-white/35">
          DEEP SPACE EXPLORATION PROTOCOL
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SYSTEM MESSAGES                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute left-6 top-1/2 z-30
          hidden w-[230px]
          -translate-y-1/2
          md:block
        "
      >
        <div className="relative border border-white/10 bg-black/10 p-5 backdrop-blur-sm">
          <HudCorners />

          <HudLabel>SYSTEM STATUS</HudLabel>

          <div className="mt-5 space-y-3">
            {bootMessages.map((message, index) => (
              <div
                key={`${message}-${index}`}
                className="flex items-center gap-3 font-mono text-[8px] tracking-[0.15em] text-white/45"
              >
                <span className="h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_7px_#22d3ee]" />

                {message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT HUD                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute right-6 top-1/2 z-30
          hidden w-[190px]
          -translate-y-1/2
          md:block
        "
      >
        <div className="relative border border-white/10 bg-black/10 p-5 backdrop-blur-sm">
          <HudCorners />

          <HudLabel violet>DESTINATION</HudLabel>

          <div className="mt-5">
            <div className="font-mono text-lg tracking-[0.2em] text-white/80">
              NEBULA
            </div>

            <div className="mt-1 font-mono text-[9px] tracking-[0.3em] text-violet-300">
              NX-07
            </div>

            <div className="mt-5 h-px bg-white/10" />

            <div className="mt-4 flex justify-between font-mono text-[8px] text-white/30">
              <span>DISTANCE</span>
              <span>1,240 LY</span>
            </div>

            <div className="mt-2 flex justify-between font-mono text-[8px] text-white/30">
              <span>STATUS</span>
              <span className="text-cyan-300">READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CENTER PILOT PROFILE                                                */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={pilotProfile}
        className="
          absolute
          left-1/2
          top-1/2
          z-[35]
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <PilotProfile />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SPACECRAFT                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={ship}
        className="
          absolute left-1/2 top-[57%]
          z-20
          -translate-x-1/2
        "
      >
        <div
          ref={shipGlow}
          className="absolute inset-0 rounded-full bg-cyan-400/10 blur-[70px]"
        />

        <Spacecraft />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BOTTOM HUD                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute bottom-7 left-0 right-0 z-40 px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <HudLabel>CRAFT</HudLabel>

            <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/60">
              EXPLORER // NX-01
            </div>
          </div>

          <div className="text-right">
            <HudLabel violet>FLIGHT MODE</HudLabel>

            <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/60">
              STANDBY
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mx-auto mt-5 flex w-[160px] flex-col items-center">
          <div className="font-mono text-[7px] tracking-[0.35em] text-white/25">
            SCROLL TO LAUNCH
          </div>

          <div className="mt-3 h-[1px] w-full overflow-hidden bg-white/10">
            <div
              ref={scrollProgress}
              className="h-full w-[4%] bg-cyan-300/70 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Cinematic vignette */}
      <div
        className="
          pointer-events-none
          absolute inset-0 z-50
          bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.55)_100%)]
        "
      />

      {/* Scanline */}
      <div
        className="
          pointer-events-none
          absolute inset-0 z-50
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px)]
          [background-size:100%_4px]
        "
      />
    </main>
  );
}
