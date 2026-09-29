"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    name: "NEBULA",
    code: "NX-07",
    distance: "1,240 LY",
    description: "Deep-space nebula research zone",
  },
  {
    name: "ORION",
    code: "OR-19",
    distance: "1,344 LY",
    description: "Outer Orion exploration sector",
  },
  {
    name: "ANDROMEDA",
    code: "AD-01",
    distance: "2.53 MLY",
    description: "Intergalactic exploration destination",
  },
];

/*
 * =============================================================
 * DETERMINISTIC STARS
 * =============================================================
 */

const normalStars = Array.from({ length: 150 }, (_, index) => {
  const top = (index * 83.21) % 100;

  const horizonFade = top < 48 ? 1 : top < 65 ? 0.75 : top < 80 ? 0.4 : 0.12;

  const opacity = (0.25 + ((index * 17) % 70) / 100) * horizonFade;

  return {
    left: `${(index * 47.37) % 100}%`,
    top: `${top}%`,
    size: `${1 + (index % 3) * 0.5}px`,
    opacity,
    twinkle: index % 4 !== 0,
    duration: 2.5 + ((index * 19) % 45) / 10,
    delay: ((index * 13) % 50) / 10,
  };
});

/* ============================================================
   SHARED HUD COMPONENTS
============================================================ */

function HudTitleBar({
  label,
  status,
  accent = "cyan",
}: {
  label: string;
  status: string;
  accent?: "cyan" | "violet";
}) {
  const cyan = accent === "cyan";

  return (
    <div className="flex h-10 items-center justify-between border-b border-white/10 bg-black/20 px-4 md:px-5">
      <div className="flex items-center gap-3">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            cyan ? "bg-cyan-300" : "bg-violet-300"
          } ${
            cyan
              ? "shadow-[0_0_10px_rgba(34,211,238,1)]"
              : "shadow-[0_0_10px_rgba(167,139,250,1)]"
          }`}
        />

        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/55">
          {label}
        </span>
      </div>

      <div
        className={`flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.3em] ${
          cyan ? "text-cyan-300/70" : "text-violet-300/70"
        }`}
      >
        {status}

        <span
          className={`h-1 w-1 rounded-full ${
            cyan ? "bg-cyan-300" : "bg-violet-300"
          }`}
        />
      </div>
    </div>
  );
}

function HudCorners() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-cyan-300/35" />

      <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r border-t border-cyan-300/35" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b border-l border-cyan-300/35" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-cyan-300/35" />
    </>
  );
}

export default function CinematicHero() {
  const root = useRef<HTMLDivElement>(null);

  /*
   * =============================================================
   * SCENE REFS
   * =============================================================
   */

  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shootingCursor = useRef(0);

  /*
   * =============================================================
   * SHIP / CAMERA REFS
   * =============================================================
   */

  const sceneWorld = useRef<HTMLDivElement>(null);
  const spaceship = useRef<HTMLDivElement>(null);
  const shipCamera = useRef<HTMLDivElement>(null);

  const launchGlow = useRef<HTMLDivElement>(null);
  const launchFlash = useRef<HTMLDivElement>(null);

  const horizonAtmosphere = useRef<HTMLDivElement>(null);

  const shipFloat = useRef<gsap.core.Tween | null>(null);

  /*
   * =============================================================
   * HUD REFS
   * =============================================================
   */

  const countNumber = useRef<HTMLDivElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);

  /*
   * =============================================================
   * COUNTDOWN STATE
   * =============================================================
   */

  const countdownState = useRef({ value: 10 });
  const lastCountdownValue = useRef(10);

  /*
   * =============================================================
   * REACT STATE
   * =============================================================
   */

  const [audioOn, setAudioOn] = useState(false);
  const [selectedMission, setSelectedMission] = useState(destinations[0]);

  const audioEnabled = useRef(false);

  /*
   * =============================================================
   * AUDIO
   * =============================================================
   */

  const ambientAudio = useRef<HTMLAudioElement | null>(null);

  const engineHum = useRef<HTMLAudioElement | null>(null);
  const engineFlickerAudio = useRef<HTMLAudioElement | null>(null);

  const scanAudio = useRef<HTMLAudioElement | null>(null);
  const navigationAudio = useRef<HTMLAudioElement | null>(null);
  const systemAudio = useRef<HTMLAudioElement | null>(null);
  const countdownAudio = useRef<HTMLAudioElement | null>(null);
  const launchAudio = useRef<HTMLAudioElement | null>(null);
  const whooshAudio = useRef<HTMLAudioElement | null>(null);

  /*
   * =============================================================
   * AUDIO HELPER
   * =============================================================
   */

  const playSound = (audio: HTMLAudioElement | null, volume = 0.5) => {
    if (!audioEnabled.current || !audio) return;

    audio.currentTime = 0;
    audio.volume = volume;

    audio.play().catch(() => {
      // Browser autoplay protection.
    });
  };

  const stopCinematicAudio = () => {
    const cinematicAudios = [
      scanAudio.current,
      navigationAudio.current,
      systemAudio.current,
      countdownAudio.current,
      launchAudio.current,
      whooshAudio.current,
      engineHum.current,
      engineFlickerAudio.current,
    ];

    cinematicAudios.forEach((audio) => {
      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;
    });
  };

  /*
   * =============================================================
   * MAIN EFFECT
   * =============================================================
   */

  useEffect(() => {
    if (!root.current) return;

    /*
     * ===========================================================
     * CINEMATIC CONFIGURATION
     * ===========================================================
     */

    const TIMELINE_DISTANCE = 9000;

    /*
     * ===========================================================
     * LOCAL TIMERS
     * ===========================================================
     */

    let shootingTimer: ReturnType<typeof setTimeout> | null = null;
    let doubleShotTimer: ReturnType<typeof setTimeout> | null = null;

    /*
     * ===========================================================
     * 01. SHOOTING STAR SYSTEM
     * ===========================================================
     */

    const shootStar = () => {
      const stars = starRefs.current;

      if (!stars.length) return;

      /*
       * Select an existing normal star.
       *
       * We reuse the existing star elements instead of creating
       * a second star system.
       */
      const selectedIndex = shootingCursor.current % stars.length;

      shootingCursor.current++;

      const star = stars[selectedIndex];
      const original = normalStars[selectedIndex];

      if (!star || !original) return;

      /*
       * Remember whether this star originally had twinkle.
       */
      const wasTwinkling = original.twinkle;

      /*
       * Prevent CSS animation from fighting GSAP.
       */
      star.classList.remove("star-twinkle");

      gsap.killTweensOf(star);

      /*
       * Deterministic sequence.
       *
       * No Math.random() is used here.
       */
      const sequence = shootingCursor.current;

      const angle = 18 + ((sequence * 17) % 28);

      const distance = 220 + ((sequence * 47) % 220);

      const duration = 0.38 + ((sequence * 13) % 30) / 100;

      /*
       * Mostly downward/right.
       *
       * Occasionally slightly upward/right.
       */
      const direction = sequence % 4 === 0 ? -0.45 : 0.55;

      const travelY = distance * direction;

      /*
       * Convert the normal star into a shooting-star streak.
       */
      gsap.set(star, {
        width: 110,
        height: 1.5,

        borderRadius: 999,

        background:
          "linear-gradient(90deg, transparent 0%, rgba(150,210,255,.15) 25%, rgba(190,225,255,.55) 65%, rgba(255,255,255,1) 100%)",

        boxShadow:
          "0 0 4px rgba(255,255,255,.95), 0 0 10px rgba(100,180,255,.8), 0 0 22px rgba(80,130,255,.35)",

        transformOrigin: "right center",

        rotation: angle,

        scaleX: 0.05,

        opacity: 0,

        x: 0,
        y: 0,
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          /*
           * Restore this exact star.
           */
          gsap.set(star, {
            width: original.size,
            height: original.size,

            left: original.left,
            top: original.top,

            opacity: original.opacity,

            background: "",
            boxShadow: "none",

            borderRadius: 999,

            x: 0,
            y: 0,

            rotation: 0,
            scaleX: 1,

            clearProps: "transform,background,boxShadow",
          });

          /*
           * Restore CSS twinkle.
           */
          if (wasTwinkling) {
            star.classList.add("star-twinkle");
          }
        },
      });

      /*
       * -----------------------------------------------------------
       * STAR APPEARS
       * -----------------------------------------------------------
       */

      timeline.to(star, {
        duration: 0.05,
        opacity: 1,
        scaleX: 0.2,
        ease: "power2.out",
      });

      /*
       * -----------------------------------------------------------
       * FAST SHOOT
       * -----------------------------------------------------------
       */

      timeline.to(star, {
        duration,

        x: distance,
        y: travelY,

        scaleX: 1,

        opacity: 1,

        ease: "power3.in",
      });

      /*
       * -----------------------------------------------------------
       * FADE TAIL
       * -----------------------------------------------------------
       */

      timeline.to(star, {
        duration: 0.14,

        x: distance * 1.15,
        y: travelY * 1.15,

        opacity: 0,

        scaleX: 0.35,

        ease: "power2.out",
      });
    };

    const scheduleNextShootingStar = () => {
      /*
       * Deterministic 1.8–6 second interval.
       */
      const sequence = shootingCursor.current;

      const delay = 1800 + ((sequence * 137) % 4200);

      shootingTimer = setTimeout(() => {
        shootStar();

        /*
         * Occasionally create a second shooting star.
         */
        if (shootingCursor.current % 5 === 0) {
          doubleShotTimer = setTimeout(() => {
            shootStar();
          }, 350);
        }

        scheduleNextShootingStar();
      }, delay);
    };

    scheduleNextShootingStar();

    /*
     * ===========================================================
     * 02. AUDIO SYSTEM
     * ===========================================================
     */

    const initializeAudio = () => {
      /*
       * ---------------------------------------------------------
       * Create audio instances
       * ---------------------------------------------------------
       */

      engineHum.current = new Audio("/sounds/engine-on.mp3");

      engineFlickerAudio.current = new Audio("/sounds/engine-rev.mp3");

      ambientAudio.current = new Audio("/sounds/space-atmosphere.mp3");

      scanAudio.current = new Audio("/sounds/scan.mp3");

      navigationAudio.current = new Audio("/sounds/navigation.mp3");

      systemAudio.current = new Audio("/sounds/system-beep.mp3");

      countdownAudio.current = new Audio("/sounds/countdown.mp3");

      launchAudio.current = new Audio("/sounds/launch.mp3");

      whooshAudio.current = new Audio("/sounds/whoosh.mp3");

      /*
       * ---------------------------------------------------------
       * Ambient
       * ---------------------------------------------------------
       */

      ambientAudio.current.loop = true;
      ambientAudio.current.volume = 0.18;

      /*
       * ---------------------------------------------------------
       * Steady engine hum
       * ---------------------------------------------------------
       */

      engineHum.current.loop = true;
      engineHum.current.volume = 0.55;

      /*
       * ---------------------------------------------------------
       * Rapid engine flicker
       * ---------------------------------------------------------
       */

      engineFlickerAudio.current.loop = true;
      engineFlickerAudio.current.volume = 0.45;

      /*
       * ---------------------------------------------------------
       * Other audio levels
       * ---------------------------------------------------------
       */

      scanAudio.current.volume = 0.45;
      navigationAudio.current.volume = 0.4;
      systemAudio.current.volume = 0.3;
      countdownAudio.current.volume = 0.42;

      launchAudio.current.volume = 0.8;
      whooshAudio.current.volume = 0.75;
    };

    initializeAudio();

    /*
     * ===========================================================
     * 03. MISSION SELECTION
     * ===========================================================
     */

    const randomDestination =
      destinations[Math.floor(Math.random() * destinations.length)];

    setSelectedMission(randomDestination);

    /*
     * ===========================================================
     * 04. GSAP CONTEXT
     * ===========================================================
     */

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /*
       * =========================================================
       * 04.1 SHIP ANIMATION SYSTEM
       * =========================================================
       */

      /*
       * ---------------------------------------------------------
       * ENGINE IDLE
       *
       * Persistent looping animation.
       *
       * IMPORTANT:
       * This animation does NOT decide when the engine is active.
       *
       * setShipPowerState() controls it.
       * ---------------------------------------------------------
       */

      const engineIdle = gsap.to(q(".engine-flame"), {
        scaleY: 0.86,
        scaleX: 0.94,
        duration: 0.14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      let engineFlameTransition: gsap.core.Tween | null = null;

      const antiGravityPulse = gsap.timeline({
        repeat: -1,
        yoyo: true,
        paused: true,
      });

      antiGravityPulse
        .to(
          q(".ship-antigravity-beam"),
          {
            autoAlpha: 0.45,
            scaleY: 0.82,
            scaleX: 0.94,
            duration: 1.1,
            ease: "sine.inOut",
          },
          0,
        )
        .to(
          q(".ship-antigravity-core"),
          {
            autoAlpha: 0.55,
            scaleX: 0.82,
            scaleY: 2,
            duration: 1.1,
            ease: "sine.inOut",
          },
          0,
        );

      const startAntiGravity = (hide = true) => {
        antiGravityPulse.pause();

        if (hide) {
          gsap.to([q(".ship-antigravity-beam"), q(".ship-antigravity-core")], {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      };

      /*
       * ---------------------------------------------------------
       * SHIP POWER STATE
       * ---------------------------------------------------------
       *
       * OFF
       * SYSTEM
       * ENGINE
       * LAUNCH
       * ---------------------------------------------------------
       */

      type ShipPowerState = "off" | "system" | "engine" | "launch";

      let currentShipState: ShipPowerState = "off";

      /*
       * =========================================================
       * SHIP SYSTEMS
       * =========================================================
       *
       * These elements remain active once the ship has powered on.
       * We do not need to redeclare them in every later state.
       */

      const activateShipSystems = (duration: number) => {
        gsap.to(q(".ship-cockpit-light"), {
          autoAlpha: 1,
          duration,
          ease: "power2.out",
        });

        gsap.to(q(".ship-side-light"), {
          autoAlpha: 1,
          duration,
          ease: "power2.out",
        });

        gsap.to(q(".ship-nav-light"), {
          autoAlpha: 1,
          duration,
          ease: "power2.out",
        });
      };

      /*
       * =========================================================
       * SHIP POWER STATE
       * =========================================================
       */
      const setShipPowerState = (state: ShipPowerState, immediate = false) => {
        currentShipState = state;

        const duration = immediate ? 0 : 0.5;

        gsap.killTweensOf([
          q(".ship-cockpit-light"),
          q(".ship-side-light"),
          q(".ship-nav-light"),
          q(".ship-aura"),
          q(".ship-ground-glow"),
          q(".ship-engine-glow"),
          launchGlow.current,
          launchFlash.current,
        ]);

        /*
         * Kill only the temporary flame transition.
         *
         * Do NOT kill .engine-flame directly because engineIdle
         * also controls it.
         */
        engineFlameTransition?.kill();
        engineFlameTransition = null;

        /*
         * =========================================================
         * OFF
         * =========================================================
         */
        if (state === "off") {
          engineIdle.pause();
          startAntiGravity(false);

          gsap.to(q(".ship-cockpit-light"), {
            autoAlpha: 0,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-side-light"), {
            autoAlpha: 0,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-nav-light"), {
            autoAlpha: 0,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-aura"), {
            autoAlpha: 0,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-ground-glow"), {
            autoAlpha: 0,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-engine-glow"), {
            autoAlpha: 0,
            scale: 1,
            duration,
            ease: "power2.out",
          });

          /*
           * Flash is always reset when powered off.
           */
          if (launchFlash.current) {
            gsap.set(launchFlash.current, {
              autoAlpha: 0,
              scale: 1,
            });
          }

          engineFlameTransition = gsap.to(q(".engine-flame"), {
            autoAlpha: 0,
            scaleX: 0.5,
            scaleY: 0,
            duration,
            ease: "power2.out",
          });

          return;
        }

        /*
         * =========================================================
         * SYSTEM
         * =========================================================
         *
         * Electronics online.
         * No launch glow yet.
         */
        if (state === "system") {
          activateShipSystems(duration);
          startAntiGravity(true);

          gsap.to(q(".ship-aura"), {
            autoAlpha: 0.35,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-ground-glow"), {
            autoAlpha: 0.3,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-engine-glow"), {
            autoAlpha: 0.25,
            scale: 1,
            duration,
            ease: "power2.out",
          });

          if (launchFlash.current) {
            gsap.set(launchFlash.current, {
              autoAlpha: 0,
              scale: 1,
            });
          }

          engineFlameTransition = gsap.to(q(".engine-flame"), {
            autoAlpha: 0,
            scaleX: 0.5,
            scaleY: 0,
            duration,
            ease: "power2.out",
          });

          engineIdle.pause();

          return;
        }

        /*
         * =========================================================
         * ENGINE
         * =========================================================
         *
         * Engine starts building power.
         */
        if (state === "engine") {
          gsap.to(q(".ship-aura"), {
            autoAlpha: 0.55,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-ground-glow"), {
            autoAlpha: 0.6,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-engine-glow"), {
            autoAlpha: 0.85,
            scale: 1.15,
            duration,
            ease: "power2.out",
          });

          engineFlameTransition = gsap.to(q(".engine-flame"), {
            autoAlpha: 1,
            scaleX: 0.65,
            scaleY: 0.6,
            duration,
            ease: "power2.out",

            onComplete: () => {
              if (currentShipState === "engine") {
                engineIdle.play();
              }
            },
          });

          return;
        }

        /*
         * =========================================================
         * LAUNCH
         * =========================================================
         *
         * Maximum continuous power.
         */
        if (state === "launch") {
          startAntiGravity(false);
          gsap.to(q(".ship-aura"), {
            autoAlpha: 0.9,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-ground-glow"), {
            autoAlpha: 1,
            duration,
            ease: "power2.out",
          });

          gsap.to(q(".ship-engine-glow"), {
            autoAlpha: 1,
            scale: 1.4,
            duration,
            ease: "power2.out",
          });

          /*
           * Flash remains OFF.
           *
           * It will only fire during engineBurst.
           */
          if (launchFlash.current) {
            gsap.set(launchFlash.current, {
              autoAlpha: 0,
              scale: 1,
            });
          }

          /*
           * Keep engineIdle running.
           */
          engineFlameTransition = gsap.to(q(".engine-flame"), {
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1.3,
            duration,
            ease: "power2.out",
          });

          return;
        }
      };
      /*
       * =========================================================
       * 04.2 ENGINE BURST
       * =========================================================
       *
       * One-shot cinematic thrust effect.
       *
       * This is intentionally NOT part of engineIdle.
       * =========================================================
       */

      const engineBurst = gsap.timeline({
        paused: true,

        onStart: () => {
          /*
           * engineIdle stops temporarily.
           *
           * The burst now controls the flame.
           */
          engineIdle.pause();

          /*
           * Reset flash before every ignition.
           */
          if (launchFlash.current) {
            gsap.set(launchFlash.current, {
              autoAlpha: 0,
              scale: 0.5,
            });
          }
        },

        onComplete: () => {
          /*
           * Return flame control to engineIdle after the burst.
           */
          if (currentShipState === "launch") {
            engineIdle.play();
          }
        },
      });

      engineBurst

        /*
         * =========================================================
         * 1. FLASH
         * =========================================================
         */

        .to(
          launchFlash.current,
          {
            autoAlpha: 1,
            scale: 1.2,
            duration: 0.08,
            ease: "power4.out",
          },
          0,
        )

        .to(
          launchFlash.current,
          {
            autoAlpha: 0,
            scale: 2.5,
            duration: 0.35,
            ease: "power3.out",
          },
          0.08,
        )

        /*
         * =========================================================
         * 3. ENGINE FLAME BURST
         * =========================================================
         */

        .set(
          q(".engine-flame"),
          {
            autoAlpha: 1,
            scaleX: 1,
            scaleY: 1,
          },
          0,
        )

        .to(
          q(".engine-flame"),
          {
            scaleY: 2.8,
            scaleX: 1.12,
            duration: 0.12,
            ease: "power4.out",
          },
          0,
        )

        .to(
          q(".engine-flame"),
          {
            scaleY: 4.5,
            scaleX: 1.25,
            duration: 0.16,
            ease: "power3.in",
          },
          0.12,
        )

        .to(
          q(".engine-flame"),
          {
            scaleY: 1.4,
            scaleX: 1,
            duration: 0.3,
            ease: "power3.out",
          },
          0.28,
        );

      /*
       * =========================================================
       * 04.3 INITIAL SCENE STATE
       * =========================================================
       */

      const initializeCinematicState = () => {
        /*
         * -------------------------------------------------------
         * SPACECRAFT
         * -------------------------------------------------------
         */

        /*
         * Ship is completely dormant.
         */
        setShipPowerState("off", true);

        gsap.set(spaceship.current, {
          y: 0,
          scale: 0.5,

          opacity: 0,

          rotateX: 0,
          rotateY: 10,
        });

        gsap.set(launchGlow.current, {
          autoAlpha: 0,
          scale: 1,
        });

        gsap.set(launchFlash.current, {
          autoAlpha: 0,
          scale: 1,
        });

        /*
         * -------------------------------------------------------
         * STATUS UI
         * -------------------------------------------------------
         */

        gsap.set(q(".ship-awake-status"), {
          autoAlpha: 0,
        });

        gsap.set(q(".ship-docked-status"), {
          autoAlpha: 1,
        });

        /*
         * -------------------------------------------------------
         * CAMERA
         * -------------------------------------------------------
         */

        gsap.set(shipCamera.current, {
          scale: 0.25,
          y: 0,
        });

        /*
         * -------------------------------------------------------
         * STAR FIELD
         * -------------------------------------------------------
         */

        gsap.set(".hero-star-layer", {
          width: "100vw",
          height: "200vh",

          left: "50%",
          top: "50%",

          xPercent: -50,
          yPercent: -50,

          y: "50vh",

          x: 0,

          scale: 0.8,

          opacity: 0.82,
        });
      };

      initializeCinematicState();

      /*
       * =========================================================
       * 04.4 SCENE 1
       * =========================================================
       *
       * COCKPIT / VIEW DECK
       * =========================================================
       */

      const addScene1 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene1")

          /*
           * Small cinematic pause.
           */
          .to(
            {},
            {
              duration: 0.5,
            },
          );
      };

      /*
       * =========================================================
       * 04.5 SCENE 2
       * =========================================================
       *
       * CINEMATIC CAMERA DESCENT
       * =========================================================
       */

      const addScene2 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene2")

          /*
           * -----------------------------------------------------
           * Reveal parked spacecraft.
           * -----------------------------------------------------
           */

          .set(spaceship.current, {
            autoAlpha: 1,
            scale: 0.5,
            y: 0,
            rotateX: 0,
            rotateY: 10,
          })

          /*
           * -----------------------------------------------------
           * Camera begins high above the ship.
           * -----------------------------------------------------
           */

          .set(shipCamera.current, {
            y: 2200,
            scale: 1.35,
            transformOrigin: "50% 100%",
          })

          /*
           * -----------------------------------------------------
           * Establishing pause.
           * -----------------------------------------------------
           */

          .to(
            {},
            {
              duration: 0.8,
            },
          )

          /*
           * -----------------------------------------------------
           * LONG CAMERA DESCENT
           * -----------------------------------------------------
           */

          .to(shipCamera.current, {
            y: -35,
            scale: 1,
            duration: 30,
            ease: "power2.inOut",
          })

          /*
           * -----------------------------------------------------
           * STAR FIELD
           * -----------------------------------------------------
           */

          .to(
            ".hero-star-layer",
            {
              y: 0,
              scale: 1,
              opacity: 0.65,
              duration: 30,
              ease: "power1.inOut",
            },
            "<",
          )

          /*
           * -----------------------------------------------------
           * HORIZON
           * -----------------------------------------------------
           */

          .to(
            horizonAtmosphere.current,
            {
              opacity: 1,
              autoAlpha: 1,
              duration: 30,
              ease: "power2.out",
            },
            "<",
          )

          /*
           * -----------------------------------------------------
           * SHIP SYSTEMS ONLINE
           * -----------------------------------------------------
           */

          .call(() => {
            setShipPowerState("system");
          })

          /*
           * -----------------------------------------------------
           * System hold.
           * -----------------------------------------------------
           */

          .to(
            {},
            {
              duration: 0.8,
            },
          );
      };

      /*
       * =========================================================
       * 04.6 SCENE 4
       * =========================================================
       *
       * ENGINE PREPARATION
       * =========================================================
       */

      const addScene4 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene4")

          /*
           * Engine starts.
           *
           * This also starts engineIdle after the flame
           * becomes visible.
           */
          .call(() => {
            setShipPowerState("engine");
          })

          /*
           * Engine preparation hold.
           */
          .to(
            {},
            {
              duration: 1,
            },
          );
      };

      /*
       * =========================================================
       * 04.7 SCENE 5
       * =========================================================
       *
       * ENGINE IGNITION / GENTLE LIFT-OFF
       * =========================================================
       */

      const addScene5 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene5")

          /*
           * -----------------------------------------------------
           * Gentle lift-off.
           * -----------------------------------------------------
           */

          .call(() => {
            antiGravityPulse.play();
          })

          .to(spaceship.current, {
            y: -200,
            z: 20,
            duration: 4,
            ease: "power1.out",
          })

          /*
           * Brief ignition hold.
           */
          .to(
            {},
            {
              duration: 0.6,
            },
          );
      };

      /*
       * =========================================================
       * 04.8 SCENE 6
       * =========================================================
       *
       * ENGINE IDLE / FLICKER
       * =========================================================
       */

      const addScene6 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene6")

          /*
           * engineIdle is already running because
           * the ship is in "engine" state.
           *
           * We simply hold this cinematic beat.
           */
          .to(
            {},
            {
              duration: 1.8,
            },
          );
      };

      /*
       * =========================================================
       * 04.9 SCENE 7
       * =========================================================
       *
       * FINAL IGNITION
       * =========================================================
       */

      const addScene7 = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene7")

          /*
           * -----------------------------------------------------
           * Switch ship to maximum power.
           * -----------------------------------------------------
           */

          .call(() => {
            setShipPowerState("launch");
          })

          /*
           * Final tension hold.
           */
          .to(
            {},
            {
              duration: 0.8,
            },
          );
      };

      /*
       * =========================================================
       * 04.10 SCENE 9
       * =========================================================
       *
       * FINAL DEPARTURE
       * =========================================================
       */

      const addScene9Departure = (tl: gsap.core.Timeline) => {
        tl.addLabel("scene9")

          /*
           * -----------------------------------------------------
           * Final engine tension.
           * -----------------------------------------------------
           */

          .to(
            {},
            {
              duration: 1.8,
            },
          )

          /*
           * =====================================================
           * 1. INITIAL ASCENT
           * =====================================================
           */

          .to(spaceship.current, {
            y: -180,
            z: 60,
            scale: 0.97,
            rotateX: -4,

            duration: 1.4,

            ease: "power2.in",
          })

          /*
           * Terrain rises away.
           */
          .to(
            horizonAtmosphere.current,
            {
              y: 150,
              scale: 1.035,

              duration: 1.4,

              ease: "power2.in",
            },
            "<",
          )

          /*
           * Stars begin moving.
           */
          .to(
            ".hero-star-layer",
            {
              y: 80,
              scale: 1.06,
              opacity: 0.78,

              duration: 1.4,

              ease: "power1.inOut",
            },
            "<",
          )

          /*
           * =====================================================
           * 2. STRONGER ASCENT
           * =====================================================
           */

          .to(spaceship.current, {
            y: -180,
            z: -120,
            scale: 0.88,
            rotateX: -6,

            duration: 2.2,

            ease: "power2.in",
          })

          .to(
            horizonAtmosphere.current,
            {
              y: 320,
              scale: 1.08,

              duration: 2.2,

              ease: "power2.in",
            },
            "<",
          )

          .to(
            ".hero-star-layer",
            {
              y: 220,
              scale: 1.18,
              opacity: 0.72,

              duration: 2.2,

              ease: "power2.in",
            },
            "<",
          )

          /*
           * =====================================================
           * 3. HIGH ALTITUDE
           * =====================================================
           */

          .to(spaceship.current, {
            y: -200,
            z: -500,
            scale: 0.65,
            rotateX: -7,

            duration: 3,

            ease: "power3.in",
          })

          .to(
            horizonAtmosphere.current,
            {
              y: 650,
              scale: 1.18,
              autoAlpha: 0.7,

              duration: 3,

              ease: "power3.in",
            },
            "<",
          )

          .to(
            ".hero-star-layer",
            {
              y: 450,
              scale: 1.4,
              opacity: 0.68,

              duration: 3,

              ease: "power3.in",
            },
            "<",
          )

          /*
           * -----------------------------------------------------
           * Final ignition burst.
           * -----------------------------------------------------
           */

          .call(() => {
            engineBurst.restart();
          })

          /*
           * =====================================================
           * 4. FINAL SKY CLIMB
           * =====================================================
           */

          .to(spaceship.current, {
            y: -250,
            z: -1000,
            scale: 0.42,
            rotateX: -8,

            duration: 3.5,

            ease: "power3.inOut",
          })

          .to(
            horizonAtmosphere.current,
            {
              y: 1000,
              scale: 1.3,
              autoAlpha: 0.25,

              duration: 3.5,

              ease: "power3.in",
            },
            "<",
          )

          .to(
            ".hero-star-layer",
            {
              y: 700,
              scale: 1.8,
              opacity: 0.65,

              duration: 3.5,

              ease: "power3.in",
            },
            "<",
          )

          /*
           * =====================================================
           * WHOOSH
           * =====================================================
           */

          .call(() => {
            playSound(whooshAudio.current);
          })

          /*
           * =====================================================
           * 5. FINAL DEPARTURE
           * =====================================================
           */

          .to(spaceship.current, {
            y: -300,
            z: -1800,
            scale: 0.012,
            rotateX: -10,

            duration: 3,

            ease: "power4.in",
          })

          .to(
            horizonAtmosphere.current,
            {
              y: 1400,
              scale: 1.45,
              autoAlpha: 0,

              duration: 3,

              ease: "power4.in",
            },
            "<",
          )

          .to(
            ".hero-star-layer",
            {
              y: 1000,
              scale: 2.2,
              opacity: 0.6,

              duration: 3,

              ease: "power4.in",
            },
            "<",
          )

          /*
           * =====================================================
           * SHIP LEAVES VIEW
           * =====================================================
           */

          .to(spaceship.current, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
          })

          /*
           * -----------------------------------------------------
           * SHUT DOWN PERSISTENT SHIP EFFECTS
           *
           * Important:
           *
           * The ship is now leaving the scene, so persistent
           * lights/glows/flame must disappear.
           * -----------------------------------------------------
           */

          .call(() => {
            setShipPowerState("off");
          })

          /*
           * =====================================================
           * DEPARTURE BURST
           * =====================================================
           */

          .to(q(".ship-departure-burst"), {
            autoAlpha: 1,
            scale: 0.2,

            duration: 0.05,

            ease: "power4.out",
          })

          /*
           * Bright central star.
           */
          .to(q(".ship-departure-star"), {
            scale: 5,
            autoAlpha: 1,

            duration: 0.12,

            ease: "expo.out",
          })

          /*
           * First energy pulse.
           */
          .to(
            q(".ship-departure-burst"),
            {
              scale: 18,
              autoAlpha: 0,

              duration: 0.65,

              ease: "expo.out",
            },
            "<",
          )

          /*
           * Bright core contraction.
           */
          .to(q(".ship-departure-star"), {
            scale: 2,

            duration: 0.12,

            ease: "expo.inOut",
          })

          /*
           * =====================================================
           * SECOND ENERGY PULSE
           * =====================================================
           */

          .to(q(".ship-departure-burst"), {
            autoAlpha: 0.8,
            scale: 0.4,

            duration: 0.08,

            ease: "power3.out",
          })

          .to(
            q(".ship-departure-burst"),
            {
              scale: 10,
              autoAlpha: 0,

              duration: 0.45,

              ease: "expo.out",
            },
            "<",
          )

          /*
           * =====================================================
           * DISTANT STAR
           * =====================================================
           */

          .to(q(".ship-departure-star"), {
            scale: 0.7,
            autoAlpha: 0.95,

            duration: 0.5,

            ease: "power3.inOut",
          })

          /*
           * Small twinkle.
           */
          .to(q(".ship-departure-star"), {
            scale: 1.4,
            autoAlpha: 1,

            duration: 0.18,

            ease: "power2.out",
          })

          .to(q(".ship-departure-star"), {
            scale: 0.55,
            autoAlpha: 0.7,

            duration: 0.25,

            ease: "power2.inOut",
          })

          /*
           * Final distant star.
           */
          .to(q(".ship-departure-star"), {
            scale: 0.25,
            autoAlpha: 0.85,

            duration: 1.2,

            ease: "power2.out",
          })

          /*
           * Slowly disappear.
           */
          .to(q(".ship-departure-star"), {
            scale: 0.1,
            autoAlpha: 0,

            duration: 1.8,

            ease: "power2.out",
          });
      };

      /*
       * =========================================================
       * 05. MASTER CINEMATIC TIMELINE
       * =========================================================
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,

          start: "top top",

          /*
           * Single source of truth.
           */
          end: `+=${TIMELINE_DISTANCE}`,

          scrub: 2,

          pin: true,

          anticipatePin: 1,

          onUpdate: (self) => {
            /*
             * User returned completely to the top.
             */
            if (self.progress <= 0.001) {
              stopCinematicAudio();
            }
          },
        },
      });

      /*
       * =========================================================
       * ADD CINEMATIC SCENES
       * =========================================================
       */

      addScene1(timeline);

      addScene2(timeline);

      addScene4(timeline);

      addScene5(timeline);

      addScene6(timeline);

      addScene7(timeline);

      addScene9Departure(timeline);

      /*
       * =========================================================
       * 06. PROGRESS TRACKER
       * =========================================================
       *
       * Uses the SAME distance as the master timeline.
       * =========================================================
       */

      ScrollTrigger.create({
        trigger: root.current,

        start: "top top",

        end: `+=${TIMELINE_DISTANCE}`,

        onUpdate: (self) => {
          /*
           * If you have a progress state/ref, update it here.
           *
           * Example:
           *
           * setProgress(self.progress);
           */

          if (self.progress <= 0.001) {
            stopCinematicAudio();
          }
        },
      });
    }, root);

    /*
     * ===========================================================
     * 07. CLEANUP
     * ===========================================================
     */

    return () => {
      /*
       * -----------------------------------------------------------
       * GSAP / ScrollTrigger
       * -----------------------------------------------------------
       */

      context.revert();

      /*
       * -----------------------------------------------------------
       * Shooting-star timers
       * -----------------------------------------------------------
       */

      if (shootingTimer) {
        clearTimeout(shootingTimer);
        shootingTimer = null;
      }

      if (doubleShotTimer) {
        clearTimeout(doubleShotTimer);
        doubleShotTimer = null;
      }

      /*
       * -----------------------------------------------------------
       * Shooting-star animations
       * -----------------------------------------------------------
       */

      starRefs.current.forEach((star) => {
        if (!star) return;

        gsap.killTweensOf(star);

        gsap.set(star, {
          clearProps: "transform,background,boxShadow",
        });
      });

      /*
       * -----------------------------------------------------------
       * Stop audio
       * -----------------------------------------------------------
       */

      ambientAudio.current?.pause();

      engineHum.current?.pause();

      engineFlickerAudio.current?.pause();

      scanAudio.current?.pause();

      navigationAudio.current?.pause();

      systemAudio.current?.pause();

      countdownAudio.current?.pause();

      launchAudio.current?.pause();

      whooshAudio.current?.pause();

      /*
       * -----------------------------------------------------------
       * Reset audio refs
       * -----------------------------------------------------------
       */

      ambientAudio.current = null;

      engineHum.current = null;

      engineFlickerAudio.current = null;

      scanAudio.current = null;

      navigationAudio.current = null;

      systemAudio.current = null;

      countdownAudio.current = null;

      launchAudio.current = null;

      whooshAudio.current = null;
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-screen overflow-hidden bg-[#02030a] text-white"
    >
      <div className="launch-camera absolute inset-0">
        {/* =====================================================
            SPACE BACKGROUND
        ====================================================== */}
        <div className="hero-background absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(70,50,180,0.22),transparent_40%),linear-gradient(180deg,#02030a_0%,#050719_50%,#010208_100%)]" />

          <div className="absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="absolute left-[70%] top-[35%] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        </div>
        {/* =====================================================
            NORMAL STARS
        ====================================================== */}
        <div className="hero-star-layer pointer-events-none absolute inset-0 overflow-hidden">
          {normalStars.map((star, index) => (
            <span
              key={index}
              ref={(el) => {
                starRefs.current[index] = el;
              }}
              className={`star absolute rounded-full bg-white ${
                star.twinkle ? "star-twinkle" : ""
              }`}
              style={{
                width: star.size,
                height: star.size,
                left: star.left,
                top: star.top,
                opacity: star.opacity,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* =====================================================
            TOP HUD
        ====================================================== */}
        <button
          type="button"
          onClick={() => {
            const nextState = !audioOn;

            audioEnabled.current = nextState;
            setAudioOn(nextState);

            if (nextState) {
              ambientAudio.current?.play().catch(() => {});
            } else {
              ambientAudio.current?.pause();
            }
          }}
          className="pointer-events-auto absolute right-6 top-20 z-[80] border border-cyan-300/20 bg-black/30 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-300/70 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-cyan-300 md:right-12"
        >
          AUDIO SYSTEM // {audioOn ? "ONLINE" : "OFFLINE"}
        </button>

        {/* =====================================================
            SIDE PROGRESS
        ====================================================== */}
        <div className="pointer-events-none absolute right-5 top-1/2 z-40 hidden h-32 w-px -translate-y-1/2 bg-white/10 md:block">
          <div
            ref={progressBar}
            className="absolute left-0 top-0 h-full w-full origin-top bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{
              transform: "scaleY(0)",
            }}
          />
        </div>
        {/* =====================================================
            SHIP CAMERA
        ====================================================== */}
        <div ref={shipCamera} className="absolute inset-0 z-10">
          {/* =========================================================
              CINEMATIC EXPLORATION SPACECRAFT
          ========================================================= */}
          <div
            ref={spaceship}
            className="spaceship pointer-events-none absolute left-1/2 top-[85%] z-[5] -translate-x-1/2 -translate-y-1/2"
          >
            {/* ===================================================
              DEPARTURE STAR 
          ==================================================== */}

            {/* =======================================================
SHIP AURA
Hidden initially by GSAP.
======================================================== */}

            <div
              className="ship-aura absolute left-1/2 top-1/2 h-[500px] w-[500px]
-translate-x-1/2 -translate-y-1/2 rounded-full
bg-cyan-500/10 blur-[120px]"
            />

            {/* =======================================================
GROUND / ENGINE AMBIENT GLOW
Hidden initially by GSAP.
======================================================== */}

            <div
              className="ship-ground-glow absolute left-1/2 top-[79%]
h-5 w-[300px] -translate-x-1/2 rounded-[50%]
bg-cyan-400/20 blur-2xl"
            />

            {/* =======================================================
SHIP BODY
======================================================== */}

            <div className="relative h-[340px] w-[620px]">
              {/* =====================================================
REAR SHADOW / SILHOUETTE
====================================================== */}

              <div
                className="absolute left-1/2 top-[42%]
                h-[115px] w-[480px]
                -translate-x-1/2
                rounded-[50%]
                bg-black/80
                blur-2xl"
              />

              {/* =====================================================
LEFT OUTER WING
====================================================== */}

              <div
                className="absolute left-[8px] top-[126px]
h-[90px] w-[245px]
origin-right
-skew-x-[25deg]
rounded-[30px_8px_8px_45px]
border border-white/[0.08]
bg-gradient-to-br
from-slate-700/80
via-slate-900
to-black"
              >
                {/* Wing armor panel */}

                <div
                  className="absolute left-[35px] top-[15px]
h-px w-[150px]
rotate-[-8deg]
bg-white/[0.12]"
                />

                <div
                  className="absolute left-[55px] top-[42px]
h-px w-[110px]
rotate-[-8deg]
bg-white/[0.06]"
                />

                {/* Wing edge */}

                <div
                  className="absolute bottom-[12px] left-[25px]
h-px w-[170px]
rotate-[-7deg]
bg-slate-400/20"
                />

                {/* Navigation light */}

                <div
                  className="ship-nav-light absolute left-[46px] bottom-[24px]
h-1.5 w-7 rounded-full
bg-cyan-300
opacity-0
shadow-[0_0_15px_rgba(34,211,238,1)]"
                />
              </div>

              {/* =====================================================
RIGHT OUTER WING
====================================================== */}

              <div
                className="absolute right-[8px] top-[126px]
h-[90px] w-[245px]
origin-left
skew-x-[25deg]
rounded-[8px_30px_45px_8px]
border border-white/[0.08]
bg-gradient-to-bl
from-slate-700/80
via-slate-900
to-black"
              >
                {/* Wing armor panel */}

                <div
                  className="absolute right-[35px] top-[15px]
h-px w-[150px]
rotate-[8deg]
bg-white/[0.12]"
                />

                <div
                  className="absolute right-[55px] top-[42px]
h-px w-[110px]
rotate-[8deg]
bg-white/[0.06]"
                />

                {/* Wing edge */}

                <div
                  className="absolute bottom-[12px] right-[25px]
h-px w-[170px]
rotate-[7deg]
bg-slate-400/20"
                />

                {/* Navigation light */}

                <div
                  className="ship-nav-light absolute right-[46px] bottom-[24px]
h-1.5 w-7 rounded-full
bg-cyan-300
opacity-0
shadow-[0_0_15px_rgba(34,211,238,1)]"
                />
              </div>

              {/* =====================================================
MAIN FUSELAGE
====================================================== */}

              <div
                className="absolute left-1/2 top-[72px]
h-[170px] w-[410px]
-translate-x-1/2
overflow-visible
rounded-[46%_46%_24%_24%]
border border-white/[0.13]
bg-gradient-to-b
from-slate-600
via-slate-800
to-[#05070b]
shadow-[0_35px_80px_rgba(0,0,0,0.9)]"
              >
                {/* ===================================================
TOP ARMOR PLATE
==================================================== */}

                <div
                  className="absolute left-1/2 top-[8px]
h-[42px] w-[270px]
-translate-x-1/2
rounded-[50%_50%_20%_20%]
border border-white/[0.10]
bg-gradient-to-b
from-slate-400/20
to-transparent"
                />

                {/* ===================================================
CENTER ARMOR RIDGE
==================================================== */}

                <div
                  className="absolute left-1/2 top-[25px]
h-[110px] w-[2px]
-translate-x-1/2
bg-gradient-to-b
from-white/[0.18]
via-white/[0.04]
to-transparent"
                />

                {/* ===================================================
LEFT ARMOR PANEL
==================================================== */}

                <div
                  className="absolute left-[28px] top-[70px]
h-[55px] w-[95px]
skew-x-[-12deg]
border border-white/[0.06]
bg-black/20"
                />

                {/* ===================================================
RIGHT ARMOR PANEL
==================================================== */}

                <div
                  className="absolute right-[28px] top-[70px]
h-[55px] w-[95px]
skew-x-[12deg]
border border-white/[0.06]
bg-black/20"
                />

                {/* ===================================================
LOWER ARMOR STRIP
==================================================== */}

                <div
                  className="absolute bottom-[23px] left-1/2
h-[18px] w-[290px]
-translate-x-1/2
rounded-full
border border-white/[0.07]
bg-black/30"
                />

                {/* ===================================================
COCKPIT CANOPY
==================================================== */}

                <div
                  className="absolute left-1/2 top-[-46px]
h-[82px] w-[170px]
-translate-x-1/2
overflow-hidden
rounded-[70%_70%_28%_28%]
border border-slate-300/20
bg-gradient-to-b
from-slate-700/70
via-slate-950
to-black
shadow-[inset_0_8px_20px_rgba(255,255,255,0.05)]"
                >
                  {/* Canopy glass */}

                  <div
                    className="absolute inset-[7px]
rounded-[65%_65%_25%_25%]
border border-white/[0.07]
bg-gradient-to-br
from-slate-500/10
via-black/60
to-black"
                  />

                  {/* Canopy center division */}

                  <div
                    className="absolute left-1/2 top-[8px]
h-[58px] w-px
-translate-x-1/2
rotate-[2deg]
bg-white/[0.08]"
                  />
                </div>

                {/* ===================================================
LEFT SIDE NAVIGATION STRIP
==================================================== */}

                <div
                  className="absolute left-[42px] top-[133px]
h-px w-[65px]
rotate-[-8deg]
bg-white/[0.08]"
                />

                {/* ===================================================
RIGHT SIDE NAVIGATION STRIP
==================================================== */}

                <div
                  className="absolute right-[42px] top-[133px]
h-px w-[65px]
rotate-[8deg]
bg-white/[0.08]"
                />

                {/* ===================================================
LEFT SIDE ENGINE POD
==================================================== */}

                <div
                  className="absolute left-[36px] bottom-[-24px]
h-[46px] w-[105px]
rotate-[5deg]
rounded-[40%_20%_20%_40%]
border border-white/[0.10]
bg-gradient-to-b
from-slate-700
via-slate-900
to-black"
                >
                  {/* Mechanical seam */}

                  <div
                    className="absolute left-[16px] top-1/2
h-px w-[65px]
-translate-y-1/2
bg-white/[0.08]"
                  />

                  {/* Engine opening */}

                  <div
                    className="absolute right-[10px] top-1/2
h-5 w-8
-translate-y-1/2
rounded-full
border border-slate-400/20
bg-black"
                  />

                  {/* Side engine light */}

                  <div
                    className="ship-side-light absolute right-[13px] top-1/2
h-2 w-5
-translate-y-1/2
rounded-full
bg-cyan-200
opacity-0
shadow-[0_0_12px_rgba(34,211,238,1)]"
                  />
                </div>

                {/* ===================================================
RIGHT SIDE ENGINE POD
==================================================== */}

                <div
                  className="absolute right-[36px] bottom-[-24px]
h-[46px] w-[105px]
-rotate-[5deg]
rounded-[20%_40%_40%_20%]
border border-white/[0.10]
bg-gradient-to-b
from-slate-700
via-slate-900
to-black"
                >
                  {/* Mechanical seam */}

                  <div
                    className="absolute right-[16px] top-1/2
h-px w-[65px]
-translate-y-1/2
bg-white/[0.08]"
                  />

                  {/* Engine opening */}

                  <div
                    className="absolute left-[10px] top-1/2
h-5 w-8
-translate-y-1/2
rounded-full
border border-slate-400/20
bg-black"
                  />

                  {/* Side engine light */}

                  <div
                    className="ship-side-light absolute left-[13px] top-1/2
h-2 w-5
-translate-y-1/2
rounded-full
bg-cyan-200
opacity-0
shadow-[0_0_12px_rgba(34,211,238,1)]"
                  />
                </div>

                {/* ===================================================
MAIN REAR ENGINE HOUSING
==================================================== */}

                <div
                  className="absolute bottom-[-12px] left-1/2
h-[34px] w-[135px]
-translate-x-1/2
rounded-[50%]
border border-white/[0.12]
bg-gradient-to-b
from-slate-700
to-black"
                >
                  {/* Engine chamber */}

                  <div
                    className="absolute left-1/2 top-1/2
h-[20px] w-[85px]
-translate-x-1/2
-translate-y-1/2
rounded-full
border border-white/[0.08]
bg-black"
                  />

                  {/* Engine glow */}

                  <div
                    className="ship-engine-glow absolute left-1/2 top-1/2
h-[12px] w-[70px]
-translate-x-1/2
-translate-y-1/2
rounded-full
bg-cyan-300/70
opacity-0
blur-md"
                  />

                  {/* Engine flame */}
                  <div
                    className="
engine-flame
absolute bottom-[-18px] left-1/2
h-[42px] w-[76px]
-translate-x-1/2
origin-top
rounded-[9px]
bg-white
opacity-0
shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_30px_rgba(34,211,238,0.95),0_0_55px_rgba(34,211,238,0.45)]
"
                  />
                </div>

                {/* Anti-gravity beam */}
                <div className="ship-antigravity-beam pointer-events-none absolute left-1/2 top-full z-[-1] h-[300px] w-[180px] -translate-x-1/2 origin-top opacity-0">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(120,220,255,0.75),rgba(80,140,255,0.3),transparent)] blur-[18px]" />

                  <div className="absolute left-1/2 top-0 h-full w-[55px] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(220,250,255,0.9),rgba(80,190,255,0.35),transparent)] blur-[8px]" />
                </div>

                {/* Anti-gravity core */}
                <div className="ship-antigravity-core pointer-events-none absolute left-1/2 top-full z-[-1] h-[24px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0">
                  <div className="absolute inset-0 rounded-full bg-cyan-200 blur-[5px]" />

                  <div className="absolute inset-x-[15%] top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(180,240,255,1),0_0_28px_rgba(80,180,255,0.9)]" />
                </div>

                {/* ===================================================
LOWER REACTOR / STRUCTURAL DETAILS
==================================================== */}

                <div
                  className="absolute bottom-[28px] left-1/2
h-[8px] w-[240px]
-translate-x-1/2
rounded-full
bg-black/70"
                />

                <div
                  className="absolute bottom-[2px] left-[82px]
h-1 w-12
bg-slate-500/20"
                />

                <div
                  className="absolute bottom-[2px] right-[82px]
h-1 w-12
bg-slate-500/20"
                />
              </div>

              {/* =====================================================
TOP FIN / SENSOR ARRAY
====================================================== */}

              <div
                className="absolute left-1/2 top-[38px]
h-[55px] w-[42px]
-translate-x-1/2
border-x border-t border-white/[0.10]
bg-gradient-to-b from-slate-700/50 to-black/60
[clip-path:polygon(50%_0%,100%_100%,0%_100%)]"
              />

              {/* =====================================================
LEFT REAR FIN
====================================================== */}

              <div
                className="absolute left-[125px] top-[105px]
h-[55px] w-[35px]
rotate-[-25deg]
border border-white/[0.08]
bg-slate-900"
              />

              {/* =====================================================
RIGHT REAR FIN
====================================================== */}

              <div
                className="absolute right-[125px] top-[105px]
h-[55px] w-[35px]
rotate-[25deg]
border border-white/[0.08]
bg-slate-900"
              />

              {/* =====================================================
SHIP TELEMETRY
====================================================== */}

              <div
                className="absolute left-1/2 top-[calc(100%+18px)]
-translate-x-1/2
whitespace-nowrap
text-center
font-mono text-[8px]
uppercase tracking-[0.35em]
text-white/30"
              ></div>
            </div>
          </div>

          <div
            className="ship-departure-star pointer-events-none absolute left-1/2 top-1/2 z-[60]
    h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full
    bg-cyan-100 opacity-0
    shadow-[0_0_12px_rgba(207,250,254,1),
            0_0_30px_rgba(34,211,238,1),
            0_0_70px_rgba(6,182,212,1),
            0_0_140px_rgba(6,182,212,0.8),
            0_0_220px_rgba(6,182,212,0.5)]"
          />

          <div
            className="ship-departure-burst pointer-events-none absolute left-1/2 top-1/2 z-[59]
    h-8 w-8 -translate-x-1/2 -translate-y-1/2
    rounded-full border-2 border-cyan-300 opacity-0
    shadow-[0_0_30px_rgba(34,211,238,0.9),
            0_0_70px_rgba(6,182,212,0.7),
            0_0_130px_rgba(6,182,212,0.4)]"
          />

          {/* =====================================================
            LAUNCH FLASH
        ====================================================== */}
          <div
            ref={launchFlash}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[50] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 opacity-0 shadow-[0_0_30px_rgba(34,211,238,1),0_0_80px_rgba(6,182,212,0.9),0_0_150px_rgba(6,182,212,0.6)]"
          />

          {/* =========================================================
    ALIEN LANDING ZONE
    Cinematic extraterrestrial parking environment
========================================================= */}
          <div
            ref={horizonAtmosphere}
            className="pointer-events-none absolute inset-x-0 bottom-[0] z-[3] h-[60%] overflow-hidden opacity-0"
          >
            {/* =======================================================
      DISTANT ALIEN ATMOSPHERE
  ======================================================== */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#010208] via-[#030817]/100 to-transparent" />

            {/* Distant atmospheric haze */}

            <div className="absolute bottom-[35%] left-1/2 h-[35%] w-[120%] -translate-x-1/2 rounded-[50%] bg-violet-700/[0.08] blur-[100px]" />

            <div className="absolute bottom-[28%] left-[35%] h-[20%] w-[45%] rounded-[50%] bg-cyan-500/[0.06] blur-[90px]" />

            {/* =======================================================
      DISTANT ALIEN MOUNTAINS
  ======================================================== */}

            <div className="absolute bottom-[30%] inset-x-0 h-[180px] w-[100%] bg-gradient-to-t from-[#050713] via-[#0a1020] to-transparent opacity-90 [clip-path:polygon(0%_100%,8%_72%,18%_82%,31%_42%,42%_68%,54%_32%,65%_65%,76%_48%,88%_76%,100%_55%,100%_100%)]" />

            {/* Far mountain glow */}

            <div className="absolute bottom-[37%] inset-x-0 h-px w-[28%] rotate-[-8deg] bg-violet-300/10 blur-[2px]" />

            {/* =======================================================
      ALIEN ROCK FORMATIONS
  ======================================================== */}

            <div className="absolute bottom-[18%] left-[5%] h-[100px] w-[190px] rotate-[-8deg] rounded-[45%_55%_20%_15%] bg-gradient-to-t from-[#010208] via-[#090e19] to-[#101a2b] shadow-[inset_20px_10px_30px_rgba(80,120,180,0.05)]" />

            <div className="absolute bottom-[16%] right-[4%] h-[120px] w-[220px] rotate-[7deg] rounded-[55%_45%_15%_20%] bg-gradient-to-t from-[#010208] via-[#080d18] to-[#111a2a] shadow-[inset_-20px_10px_30px_rgba(80,120,180,0.05)]" />

            <div className="absolute bottom-[14%] left-[26%] h-[65px] w-[110px] rotate-[12deg] rounded-[60%_40%_20%_30%] bg-gradient-to-t from-[#010208] to-[#0b1320]" />

            <div className="absolute bottom-[15%] right-[27%] h-[80px] w-[130px] rotate-[-10deg] rounded-[40%_60%_25%_15%] bg-gradient-to-t from-[#010208] to-[#0c1422]" />

            {/* =======================================================
      ALIEN GROUND
  ======================================================== */}

            <div className="absolute bottom-[-18%] left-1/2 h-[50%] w-[125%] -translate-x-1/2 rounded-[50%_50%_0_0] bg-gradient-to-t from-[#000105] via-[#030712] to-[#07101c] shadow-[inset_0_20px_60px_rgba(80,140,200,0.04)]" />

            {/* Ground contour */}

            <div className="absolute bottom-[24%] left-1/2 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/[0.12] to-transparent blur-[1px]" />

            {/* =======================================================
      LANDING PAD / SHIP CONTACT AREA
  ======================================================== */}

            <div className="absolute bottom-[7%] left-1/2 h-[95px] w-[520px] -translate-x-1/2 rounded-[50%] border border-cyan-300/[0.07] bg-cyan-400/[0.015] shadow-[inset_0_0_50px_rgba(34,211,238,0.025)]" />

            <div className="absolute bottom-[10%] left-1/2 h-px w-[390px] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />

            {/* Landing pad markings */}

            <div className="absolute bottom-[11%] left-1/2 h-[60px] w-[310px] -translate-x-1/2 rounded-[50%] border border-white/[0.035]" />

            <div className="absolute bottom-[11%] left-1/2 h-[35px] w-[190px] -translate-x-1/2 rounded-[50%] border border-cyan-300/[0.05]" />

            {/* =======================================================
      GROUND LIGHT POOLS
  ======================================================== */}

            <div className="absolute bottom-[8%] left-1/2 h-[80px] w-[430px] -translate-x-1/2 rounded-[50%] bg-cyan-400/[0.035] blur-[45px]" />

            <div className="absolute bottom-[17%] left-[15%] h-[50px] w-[120px] rounded-full bg-violet-500/[0.035] blur-[35px]" />

            <div className="absolute bottom-[16%] right-[14%] h-[50px] w-[140px] rounded-full bg-cyan-500/[0.035] blur-[35px]" />

            {/* =======================================================
      LOW ALIEN MIST
  ======================================================== */}

            <div className="absolute bottom-[18%] left-1/2 h-[55px] w-[90%] -translate-x-1/2 rounded-[50%] bg-cyan-200/[0.025] blur-[25px]" />

            <div className="absolute bottom-[23%] left-[12%] h-[35px] w-[30%] rounded-[50%] bg-violet-300/[0.025] blur-[25px]" />

            <div className="absolute bottom-[20%] right-[8%] h-[40px] w-[32%] rounded-[50%] bg-cyan-300/[0.025] blur-[28px]" />

            {/* =======================================================
      ATMOSPHERIC PARTICLES / DISTANT LIGHTS
  ======================================================== */}

            <div className="absolute bottom-[27%] left-[22%] h-1 w-1 rounded-full bg-cyan-300/30 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

            <div className="absolute bottom-[34%] left-[61%] h-1 w-1 rounded-full bg-violet-300/30 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />

            <div className="absolute bottom-[29%] right-[25%] h-1 w-1 rounded-full bg-cyan-300/25 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

            {/* =======================================================
      FINAL ATMOSPHERIC VIGNETTE
  ======================================================== */}
          </div>
        </div>
      </div>
    </section>
  );
}
