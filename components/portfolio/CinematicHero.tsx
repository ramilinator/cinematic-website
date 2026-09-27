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

  const cockpit = useRef<HTMLDivElement>(null);
  const welcome = useRef<HTMLDivElement>(null);
  const pilot = useRef<HTMLDivElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const selectedDestination = useRef<HTMLSpanElement>(null);
  const system = useRef<HTMLDivElement>(null);
  const countdown = useRef<HTMLDivElement>(null);

  const starLayer = useRef<HTMLDivElement | null>(null);
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
     * NORMAL STARS → SHOOTING STARS
     * ===========================================================
     */

    let shootingTimer: ReturnType<typeof setTimeout> | null = null;
    let doubleShotTimer: ReturnType<typeof setTimeout> | null = null;

    const shootStar = () => {
      const stars = starRefs.current;

      if (!stars.length) return;

      /*
       * Select an existing normal star.
       * No second star system is created.
       */
      const selectedIndex = shootingCursor.current % stars.length;

      shootingCursor.current++;

      const star = stars[selectedIndex];
      const original = normalStars[selectedIndex];

      if (!star || !original) return;

      /*
       * Prevent CSS twinkle animation from fighting GSAP.
       */
      const wasTwinkling = original.twinkle;

      star.classList.remove("star-twinkle");

      gsap.killTweensOf(star);

      /*
       * Slightly different trajectory every time.
       * Everything remains deterministic — no Math.random()
       * during render.
       */
      const sequence = shootingCursor.current;

      const angle = 18 + ((sequence * 17) % 28);

      const distance = 220 + ((sequence * 47) % 220);

      const duration = 0.38 + ((sequence * 13) % 30) / 100;

      /*
       * Mostly travel downward/right,
       * occasionally slightly upward/right.
       */
      const direction = sequence % 4 === 0 ? -0.45 : 0.55;

      const travelY = distance * direction;

      /*
       * Convert the tiny star into a long streak.
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
           * Restore this EXACT star's original properties.
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
           * Restore normal twinkle behavior.
           */
          if (wasTwinkling) {
            star.classList.add("star-twinkle");
          }
        },
      });

      /*
       * 1. Star appears
       */
      timeline.to(star, {
        duration: 0.05,

        opacity: 1,
        scaleX: 0.2,

        ease: "power2.out",
      });

      /*
       * 2. FAST SHOOT
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
       * 3. Fade the tail at the end
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
       * 1.8–6 seconds between shooting stars.
       */
      const sequence = shootingCursor.current;

      const delay = 1800 + ((sequence * 137) % 4200);

      shootingTimer = setTimeout(() => {
        shootStar();

        /*
         * Occasionally create a second star shortly
         * after the first one.
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
     * AUDIO INITIALIZATION
     * ===========================================================
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
     * -----------------------------------------------------------
     * AMBIENT SPACE
     * -----------------------------------------------------------
     */

    ambientAudio.current.loop = true;
    ambientAudio.current.volume = 0.18;

    /*
     * -----------------------------------------------------------
     * STEADY ENGINE HUM
     *
     * Runs continuously once the spacecraft powers up.
     * -----------------------------------------------------------
     */

    engineHum.current.loop = true;
    engineHum.current.volume = 0.55;

    /*
     * -----------------------------------------------------------
     * RAPID ENGINE FLICKER
     *
     * Runs continuously during the rapid engine ignition phase.
     * -----------------------------------------------------------
     */

    engineFlickerAudio.current.loop = true;
    engineFlickerAudio.current.volume = 0.45;

    /*
     * -----------------------------------------------------------
     * OTHER AUDIO LEVELS
     * -----------------------------------------------------------
     */

    scanAudio.current.volume = 0.45;
    navigationAudio.current.volume = 0.4;
    systemAudio.current.volume = 0.3;
    countdownAudio.current.volume = 0.42;
    launchAudio.current.volume = 0.8;
    whooshAudio.current.volume = 0.75;

    /*
     * ===========================================================
     * RANDOM DESTINATION
     * ===========================================================
     */

    const randomDestination =
      destinations[Math.floor(Math.random() * destinations.length)];

    setSelectedMission(randomDestination);

    /*
     * ===========================================================
     * GSAP CONTEXT
     * ===========================================================
     */

    const context = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /*
       * ===========================================================
       * INITIAL SHIP STATE
       *
       * The ship starts completely dormant.
       * Nothing moves.
       * Nothing glows.
       * The spacecraft is parked.
       * ===========================================================
       */

      gsap.set(spaceship.current, {
        y: 0,
        scale: 0.5,
        opacity: 0,
        rotateX: 0,
        rotateY: 10,
      });

      gsap.set(q(".ship-aura"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-ground-glow"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-cockpit-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-side-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-nav-light"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-engine-glow"), {
        autoAlpha: 0,
        scale: 1,
      });

      gsap.set(q(".engine-flame"), {
        scaleY: 0,
        scaleX: 0.5,
        autoAlpha: 0,
        transformOrigin: "50% 0%",
      });

      gsap.set(q(".ship-awake-status"), {
        autoAlpha: 0,
      });

      gsap.set(q(".ship-docked-status"), {
        autoAlpha: 1,
      });

      /*
       * ===========================================================
       * CAMERA
       *
       * Start far away.
       * The first cinematic movement is a slow push toward
       * the spacecraft.
       * ===========================================================
       */

      gsap.set(shipCamera.current, {
        scale: 0.25,
        y: 0,
      });

      /*
       * ===========================================================
       * WELCOME
       * ===========================================================
       */

      gsap.set(welcome.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".welcome-modal"), {
        autoAlpha: 0,
        scale: 0.94,
        y: 25,
      });

      gsap.set(q(".welcome-line"), {
        y: 22,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * PILOT
       * ===========================================================
       */

      gsap.set(pilot.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".pilot-line"), {
        y: 25,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * DESTINATION
       * ===========================================================
       */

      gsap.set(destination.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".destination-line"), {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(q(".map-grid"), {
        scale: 1.15,
        opacity: 0,
      });

      gsap.set(q(".map-target"), {
        scale: 0.7,
        opacity: 0,
      });

      /*
       * ===========================================================
       * SYSTEM
       * ===========================================================
       */

      gsap.set(system.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".system-line"), {
        x: -25,
        autoAlpha: 0,
      });

      gsap.set(q(".system-progress"), {
        width: "0%",
      });

      /*
       * ===========================================================
       * COUNTDOWN
       * ===========================================================
       */

      gsap.set(countdown.current, {
        autoAlpha: 0,
      });

      gsap.set(q(".countdown-line"), {
        y: 20,
        autoAlpha: 0,
      });

      /*
       * ===========================================================
       * LAUNCH EFFECTS
       * ===========================================================
       */

      gsap.set(launchGlow.current, {
        scale: 0.25,
        autoAlpha: 0,
      });

      gsap.set(launchFlash.current, {
        opacity: 0,
      });

      /*
       * ===========================================================
       * PILOT SCANNER
       *
       * Runs continuously but is only visible when pilot UI exists.
       * ===========================================================
       */

      gsap.to(q(".pilot-scan-line"), {
        top: "100%",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * ===========================================================
       * STAR LAYER
       *
       * ===========================================================
       */

      gsap.set(".hero-star-layer", {
        width: "100vw",
        height: "200vh",

        left: "50%",
        top: "50%",

        xPercent: -50,
        yPercent: -50,

        // Show the TOP portion of the enlarged star field
        y: "50vh",

        x: 0,
        scale: 0.8,

        opacity: 0.82,
      });

      /*
       * ===========================================================
       * ENGINE IDLE
       *
       * Created paused.
       * It will only begin after ignition.
       * ===========================================================
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

      /*
       * ===========================================================
       * ENGINE BURST
       *
       * A short explosive thrust burst used only when the ship
       * actually launches.
       *
       * It does NOT loop.
       * ===========================================================
       */

      const engineBurst = gsap.timeline({ paused: true });

      engineBurst
        .set(q(".engine-flame"), {
          autoAlpha: 1,
          scaleX: 1,
          scaleY: 1,
        })
        .to(q(".engine-flame"), {
          scaleY: 2.8,
          scaleX: 1.12,
          duration: 0.12,
          ease: "power4.out",
        })
        .to(q(".engine-flame"), {
          scaleY: 4.5,
          scaleX: 1.25,
          duration: 0.16,
          ease: "power3.in",
        })
        .to(q(".engine-flame"), {
          scaleY: 1.4,
          scaleX: 1,
          duration: 0.3,
          ease: "power3.out",
        });

      /*
       * ===========================================================
       * SHIP FLOAT
       *
       * Created paused.
       *
       * The ship does NOT float while parked.
       * It also does NOT float immediately after moving upward.
       *
       * It will only begin when explicitly started later.
       * ===========================================================
       */

      const shipFloat = gsap.to(spaceship.current, {
        y: -1,
        duration: 0.1,
        ease: "sine.inOut",
        paused: true,
        repeat: -1,
        yoyo: true,
      });

      const shipDrift = gsap.to(spaceship.current, {
        rotation: 0.3,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      /*
       * ===========================================================
       * MASTER CINEMATIC TIMELINE
       *
       * 9 SCENE STRUCTURE
       *
       * 01 — COCKPIT / VIEW DECK
       * 02 — SHIP REVEAL / CAMERA APPROACH
       * 03 — COUNTDOWN
       * 04 — ENGINE PREPARATION
       * 05 — ENGINE IGNITION
       * 06 — ENGINE IDLE / FLICKER
       * 07 — FINAL IGNITION
       * 08 — DEPARTURE
       * 09 — DEEP SPACE HOLD
       * ===========================================================
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=9000",
          scrub: 2,
          pin: true,
          anticipatePin: 1,

          onUpdate: (self) => {
            /*
             * User returned completely to the top.
             */
            if (self.progress <= 0.001) {
              stopCinematicAudio();

              /*
               * Make absolutely sure the looping ship animations
               * are disabled at the starting position.
               */
              shipFloat.pause();
              shipDrift.pause();
              engineIdle.pause();
              engineBurst.pause();
            }
          },
        },
      });

      /*
       * ===========================================================
       * SCENE 1
       * COCKPIT / VIEW DECK
       *
       * The viewer begins inside the spacecraft.
       *
       * The exterior ship is NOT the focus yet.
       *
       * Sequence:
       *
       *   cockpit
       *      ↓
       *   welcome
       *      ↓
       *   pilot identification
       *      ↓
       *   destination
       *      ↓
       *   system diagnostics
       *      ↓
       *   system complete
       *
       * The system check is the final event of Scene 1.
       * ===========================================================
       */

      timeline
        .addLabel("scene1")

        /*
         * Make sure the ship itself remains parked and dormant
         * while the viewer is inside the view deck.
         */
        .call(() => {
          shipFloat.pause();
          shipDrift.pause();
          engineIdle.pause();
          engineBurst.pause();

          if (engineHum.current) {
            engineHum.current.pause();
            engineHum.current.currentTime = 0;
          }
        })

        /*
         * ---------------------------------------------------------
         * COCKPIT ESTABLISHING SHOT
         * ---------------------------------------------------------
         */

        .to(cockpit.current, {
          autoAlpha: 1,
          duration: 1.2,
          ease: "power2.out",
        })

        .call(() => {
          playSound(scanAudio.current, 0.45);
        })

        /*
         * Small cinematic pause.
         */
        .to(
          {},
          {
            duration: 0.5,
          },
        )

        /*
         * ---------------------------------------------------------
         * WELCOME MESSAGE
         * ---------------------------------------------------------
         */

        .set(welcome.current, {
          autoAlpha: 1,
        })

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        .to(q(".welcome-modal"), {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })

        .to(
          q(".welcome-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.3",
        )

        .to(
          {},
          {
            duration: 1,
          },
        )

        .to(welcome.current, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.inOut",
        })

        /*
         * ---------------------------------------------------------
         * PILOT IDENTIFICATION
         * ---------------------------------------------------------
         */

        .set(pilot.current, {
          autoAlpha: 1,
        })

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        .to(
          {},
          {
            duration: 0.25,
          },
        )

        .to(q(".pilot-line"), {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.16,
          ease: "power3.out",
        })

        .to(
          {},
          {
            duration: 1.2,
          },
        )

        .to(pilot.current, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.inOut",
        })

        /*
         * ---------------------------------------------------------
         * DESTINATION / NAVIGATION
         * ---------------------------------------------------------
         */

        .set(destination.current, {
          autoAlpha: 1,
        })

        .call(() => {
          playSound(navigationAudio.current, 0.4);
        })

        .to(q(".map-grid"), {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        })

        .to(
          q(".destination-line"),
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.16,
            ease: "power3.out",
          },
          "-=0.3",
        )

        .to(q(".map-target"), {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        })

        .to(q(".map-target"), {
          scale: 1.12,
          duration: 0.45,
          repeat: 2,
          yoyo: true,
          ease: "sine.inOut",
        })

        .call(() => {
          playSound(navigationAudio.current, 0.3);
        })

        .to(
          {},
          {
            duration: 0.9,
          },
        )

        .to(destination.current, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.inOut",
        })

        /*
         * ---------------------------------------------------------
         * SYSTEM DIAGNOSTICS
         * ---------------------------------------------------------
         *
         * This is intentionally the FINAL part of Scene 1.
         */
        .set(system.current, {
          autoAlpha: 1,
        })

        .to(q(".system-line"), {
          x: 0,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.22,
          ease: "power2.out",
        })

        .call(() => {
          playSound(systemAudio.current, 0.3);
        })

        .to(q(".system-progress"), {
          width: "100%",
          duration: 2.1,
          ease: "power1.inOut",
        })

        .to(
          {},
          {
            duration: 0.7,
          },
        )

        /*
         * System disappears.
         *
         * This is the transition point into Scene 2.
         */
        .to(system.current, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.6,
          },
        );

      /*
       * ===========================================================
       * SCENE 2
       * CINEMATIC CAMERA DESCENT / PARKED SHIP REVEAL
       *
       * The viewer starts high above the environment and gradually
       * descends toward the parked spaceship.
       *
       * The stars move upward while the camera descends, creating
       * the feeling of traveling from the sky toward the ground.
       * ===========================================================
       */

      timeline
        .addLabel("scene2")

        // -----------------------------------------------------------
        // HIDE COCKPIT
        // -----------------------------------------------------------
        .to(cockpit.current, {
          autoAlpha: 0,
          scale: 1.02,
          duration: 1.2,
          ease: "power2.inOut",
        })

        // -----------------------------------------------------------
        // PREPARE SHIP
        // -----------------------------------------------------------
        .set(spaceship.current, {
          autoAlpha: 1,
          scale: 0.5,
          y: 0,
          rotateX: 0,
          rotateY: 10,
        })

        // -----------------------------------------------------------
        // INITIAL CAMERA POSITION
        //
        // Start high above the parked spaceship.
        // The ship is initially lower in the composition.
        // -----------------------------------------------------------
        .set(shipCamera.current, {
          y: 2200,
          scale: 1.35,
          transformOrigin: "50% 100%",
        })

        // -----------------------------------------------------------
        // SMALL PAUSE
        //
        // Gives the viewer a moment to see the environment
        // before the descent begins.
        // -----------------------------------------------------------
        .to(
          {},
          {
            duration: 0.8,
          },
        )

        // ===========================================================
        // LONG CINEMATIC CAMERA DESCENT
        //
        // Increased from 6.5s → 10s.
        //
        // This is now the main visual movement of Scene 2.
        // ===========================================================
        .to(shipCamera.current, {
          y: -35,
          scale: 1,
          duration: 30,
          ease: "power2.inOut",
        })

        // -----------------------------------------------------------
        // STARS MOVE UPWARD WITH THE CAMERA
        //
        // Same duration keeps the star field synchronized with
        // the camera descent.
        // -----------------------------------------------------------
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

        // ===========================================================
        // HORIZON ATMOSPHERE APPEARS
        //
        // Begin revealing the ground/horizon as the camera starts
        // descending.
        // ===========================================================
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

        // -----------------------------------------------------------
        // COCKPIT POWER
        // -----------------------------------------------------------
        .to(q(".ship-cockpit-light"), {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        })

        // -----------------------------------------------------------
        // SIDE ENGINE-POD LIGHTS
        // -----------------------------------------------------------
        .to(
          q(".ship-side-light"),
          {
            autoAlpha: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.35",
        )

        // -----------------------------------------------------------
        // NAVIGATION LIGHTS
        // -----------------------------------------------------------
        .to(
          q(".ship-nav-light"),
          {
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.25",
        )

        // -----------------------------------------------------------
        // SHIP AURA
        // -----------------------------------------------------------
        .to(
          q(".ship-aura"),
          {
            autoAlpha: 0.35,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.2",
        )

        // -----------------------------------------------------------
        // INITIAL ENGINE POWER
        //
        // Internal glow only — NOT the engine flame.
        // -----------------------------------------------------------
        .to(
          q(".ship-engine-glow"),
          {
            autoAlpha: 0.35,
            scale: 1.03,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        )

        .to(
          {},
          {
            duration: 0.8,
          },
        );

      /*
       * ===========================================================
       * SCENE 3
       * COUNTDOWN
       *
       * ONLY countdown.
       *
       * There is no second countdown later.
       * ===========================================================
       */

      countdownState.current.value = 10;
      lastCountdownValue.current = 10;

      timeline
        .addLabel("scene3")

        .set(countdown.current, {
          autoAlpha: 1,
        })

        .to(q(".countdown-line"), {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.14,
          ease: "power3.out",
        })

        /*
         * Brief anticipation.
         */
        .to(
          {},
          {
            duration: 0.5,
          },
        )

        .set(countNumber.current, {
          textContent: "10",
        })

        /*
         * 10 → 0
         */
        .to(countdownState.current, {
          value: 0,
          duration: 10,
          ease: "none",

          onUpdate: () => {
            if (!countNumber.current) return;

            const nextValue = Math.ceil(countdownState.current.value);

            countNumber.current.textContent = String(nextValue);

            if (
              nextValue !== lastCountdownValue.current &&
              nextValue < lastCountdownValue.current
            ) {
              playSound(countdownAudio.current, 0.42);

              lastCountdownValue.current = nextValue;
            }
          },
        })

        /*
         * Countdown disappears.
         */
        .to(countdown.current, {
          autoAlpha: 0,
          duration: 0.65,
          ease: "power2.inOut",
        })

        .to(
          {},
          {
            duration: 0.4,
          },
        );

      /*
       * ===========================================================
       * SCENE 4
       * ENGINE PREPARATION
       *
       * No launch yet.
       * No full flame yet.
       * ===========================================================
       */

      timeline
        .addLabel("scene4")

        /*
         * Engine housing begins charging.
         */
        .to(q(".ship-engine-glow"), {
          autoAlpha: 0.85,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.out",
        })

        /*
         * Aura expands.
         */
        .to(
          q(".ship-aura"),
          {
            autoAlpha: 0.5,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4",
        )

        /*
         * Ground glow increases.
         */
        .to(
          q(".ship-ground-glow"),
          {
            autoAlpha: 0.45,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4",
        )

        /*
         * Engine preparation hold.
         */
        .to(
          {},
          {
            duration: 1,
          },
        );

      /*
       * ===========================================================
       * SCENE 5
       * ENGINE IGNITION
       *
       * Ignition starts.
       * Launch energy begins building.
       * ===========================================================
       */

      timeline
        .addLabel("scene5")

        .call(() => {
          playSound(engineFlickerAudio.current, 0.7);
        })

        /*
         * Launch energy begins.
         */
        .to(launchGlow.current, {
          autoAlpha: 0.45,
          scale: 0.65,
          duration: 0.9,
          ease: "power2.out",
        })

        /*
         * Engine flame begins to respond.
         */
        .to(q(".engine-flame"), {
          autoAlpha: 1,
          scaleY: 0.5,
          scaleX: 0.82,
          duration: 0.45,
          ease: "power2.out",
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

      /*
       * ===========================================================
       * SCENE 6
       * ENGINE IDLE / FLICKER
       *
       * Rapid visual engine flicker.
       *
       * This is deliberately separate from the actual full-thrust
       * ignition in Scene 7.
       * ===========================================================
       */

      timeline
        .addLabel("scene6")

        /*
         * Start the rapid visual flame flicker.
         */
        .call(() => {
          engineIdle.play();
        })
        // Start gentle spacecraft floating

        /*
         * Hold the running engine.
         */
        .to(
          {},
          {
            duration: 1.8,
          },
        );

      /*
       * ===========================================================
       * SCENE 7
       * FINAL IGNITION
       *
       * The engine transitions from flickering idle to full thrust.
       * ===========================================================
       */

      timeline
        .addLabel("scene7")

        /*
         * Full engine flame.
         */
        .to(q(".engine-flame"), {
          autoAlpha: 1,
          scaleY: 1,
          scaleX: 1,
          duration: 0.65,
          ease: "power2.inOut",
        })

        /*
         * Engine becomes extremely bright.
         */
        .to(q(".ship-engine-glow"), {
          autoAlpha: 1,
          scale: 1.3,
          duration: 0.6,
          ease: "power2.out",
        })

        /*
         * Launch glow expands.
         */
        .to(
          launchGlow.current,
          {
            autoAlpha: 0.8,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3",
        )

        /*
         * Final tension hold.
         */
        .to(
          {},
          {
            duration: 0.8,
          },
        );

      /*
       * ===========================================================
       * SCENE 8
       * SMOOTH SKY LAUNCH
       * ===========================================================
       *
       * The spacecraft:
       *
       * 1. Lifts gently from the landing area
       * 2. Builds thrust
       * 3. Accelerates upward
       * 4. Continues climbing into the sky
       * 5. Gradually moves farther away
       * 6. Eventually becomes small naturally
       *
       * The terrain reacts underneath the ship as one group.
       * ===========================================================
       */

      timeline
        .addLabel("scene8")

        /*
         * ===========================================================
         * LAUNCH AUDIO
         * ===========================================================
         */

        .call(() => {
          if (engineHum.current) {
            engineHum.current.pause();
            engineHum.current.currentTime = 0;
          }

          playSound(launchAudio.current);
        })

        /*
         * ===========================================================
         * 1. GENTLE LIFT-OFF
         * ===========================================================
         *
         * The ship slowly separates from the landing surface.
         * ===========================================================
         */

        .to(spaceship.current, {
          y: -60,
          z: 20,
          scale: 1,
          rotateX: -2,
          duration: 1.2,
          ease: "power1.out",
        })

        /*
         * ===========================================================
         * TERRAIN — INITIAL REACTION
         * ===========================================================
         */

        .to(
          horizonAtmosphere.current,
          {
            y: 50,
            scale: 1.01,
            duration: 1.2,
            ease: "power1.out",
          },
          "<",
        )

        /*
         * ===========================================================
         * LAUNCH GLOW
         * ===========================================================
         */

        .to(
          launchGlow.current,
          {
            autoAlpha: 0,
            scale: 0.85,
            duration: 1,
            ease: "power2.in",
          },
          "<",
        )

        /*
         * ===========================================================
         * ENGINE IGNITION
         * ===========================================================
         */

        .call(() => {
          engineBurst.restart();
        })

        /*
         * ===========================================================
         * 2. BUILDING THRUST
         * ===========================================================
         *
         * The spacecraft begins accelerating upward.
         * ===========================================================
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
         * ===========================================================
         * TERRAIN — LIFTING AWAY
         * ===========================================================
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
         * ===========================================================
         * STAR FIELD — BEGIN MOVING
         * ===========================================================
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
         * ===========================================================
         * 3. STRONGER ASCENT
         * ===========================================================
         *
         * Now the ship clearly begins climbing into the sky.
         * ===========================================================
         */

        .to(spaceship.current, {
          y: -180,
          z: -120,
          scale: 0.88,
          rotateX: -6,
          duration: 2.2,
          ease: "power2.in",
        })

        /*
         * ===========================================================
         * TERRAIN — FALLING AWAY
         * ===========================================================
         */

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

        /*
         * ===========================================================
         * STAR FIELD — CAMERA ACCELERATION
         * ===========================================================
         */

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
         * ===========================================================
         * 4. HIGH-ALTITUDE ASCENT
         * ===========================================================
         *
         * The ship continues climbing rather than disappearing.
         * ===========================================================
         */

        .to(spaceship.current, {
          y: -200,
          z: -500,
          scale: 0.65,
          rotateX: -7,
          duration: 3,
          ease: "power3.in",
        })

        /*
         * ===========================================================
         * TERRAIN — RAPIDLY FALLING AWAY
         * ===========================================================
         */

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

        /*
         * ===========================================================
         * STAR FIELD — SKY TRANSITION
         * ===========================================================
         */

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
         * ===========================================================
         * 5. FINAL SKY CLIMB
         * ===========================================================
         *
         * The ship remains visible while climbing toward the
         * upper part of the scene.
         * ===========================================================
         */

        .to(spaceship.current, {
          y: -250,
          z: -1000,
          scale: 0.42,
          rotateX: -8,
          duration: 3.5,
          ease: "power3.inOut",
        })

        /*
         * ===========================================================
         * TERRAIN — LEAVING THE SURFACE
         * ===========================================================
         */

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

        /*
         * ===========================================================
         * STAR FIELD — FINAL ACCELERATION
         * ===========================================================
         */

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
         * ===========================================================
         * WHOOSH
         * ===========================================================
         */

        .call(() => {
          playSound(whooshAudio.current);
        })

        /*
         * ===========================================================
         * 6. FINAL DEPARTURE
         * ===========================================================
         *
         * Only now does the ship leave the visible frame.
         *
         * IMPORTANT:
         * No autoAlpha: 0.
         *
         * The ship disappears naturally because it travels
         * beyond the camera view.
         * ===========================================================
         */

        .to(spaceship.current, {
          y: -300,
          z: -1800,
          scale: 0.012,
          rotateX: -10,
          duration: 3,
          ease: "power4.in",
        })

        /*
         * ===========================================================
         * TERRAIN — COMPLETE DEPARTURE
         * ===========================================================
         */

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

        /*
         * ===========================================================
         * STAR FIELD — DEEP SPACE
         * ===========================================================
         */

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
         * ===========================================================
         * FINAL CYAN ATMOSPHERIC BURST
         * ===========================================================
         */

        /* Tiny point appears exactly where the ship ends */
        .set(q(".ship-departure-star"), {
          autoAlpha: 0,
          scale: 0.15,
        })

        .set(q(".ship-departure-burst"), {
          autoAlpha: 0,
          scale: 0.1,
        })

        /* Ship has become extremely distant */
        .to(spaceship.current, {
          scale: 0.012,
          y: -5200,
          z: -6500,
          duration: 2.5,
          ease: "expo.in",
        })

        /* Tiny cyan point appears */
        .to(q(".ship-departure-star"), {
          autoAlpha: 1,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.out",
        })

        /* CHARGE */
        .to(q(".ship-departure-star"), {
          scale: 2,
          duration: 0.25,
          ease: "power2.out",
        })

        /* =========================================================
   MASSIVE CYAN BURST
   ========================================================= */

        .to(q(".ship-departure-burst"), {
          autoAlpha: 1,
          scale: 0.2,
          duration: 0.05,
          ease: "power4.out",
        })

        .to(q(".ship-departure-star"), {
          scale: 5,
          autoAlpha: 1,
          duration: 0.12,
          ease: "expo.out",
        })

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

        /* Bright core */
        .to(q(".ship-departure-star"), {
          scale: 2,
          duration: 0.12,
          ease: "expo.inOut",
        })

        /* SECOND ENERGY PULSE */
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

        /* Collapse into distant cyan star */
        .to(q(".ship-departure-star"), {
          scale: 0.7,
          autoAlpha: 0.95,
          duration: 0.5,
          ease: "power3.inOut",
        })

        /* Tiny star twinkle */
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

        /* Final distant star */
        .to(q(".ship-departure-star"), {
          scale: 0.25,
          autoAlpha: 0.85,
          duration: 1.2,
          ease: "power2.out",
        })

        /* Slowly disappear */
        .to(q(".ship-departure-star"), {
          scale: 0.1,
          autoAlpha: 0,
          duration: 1.8,
          ease: "power2.out",
        })

        /*
         * -----------------------------------------------------------
         * SPACECRAFT DISAPPEARS
         * -----------------------------------------------------------
         */

        .to(spaceship.current, {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
        })

        /*
         * -----------------------------------------------------------
         * DISTANT CYAN STAR
         * -----------------------------------------------------------
         */

        .to(q(".ship-departure-star"), {
          autoAlpha: 0.75,
          scale: 0.8,
          duration: 1.2,
          ease: "power2.inOut",
        })

        /*
         * -----------------------------------------------------------
         * FINAL FADE INTO STAR FIELD
         * -----------------------------------------------------------
         */

        .to(q(".ship-departure-star"), {
          autoAlpha: 0,
          scale: 0.25,
          duration: 1.8,
          ease: "power2.out",
        });

      /*
       * ===========================================================
       * SCENE 9
       * DEEP-SPACE HOLD
       *
       * Final cinematic moment.
       *
       * No additional launch sequence.
       * ===========================================================
       */

      timeline
        .addLabel("scene9")

        .to(
          {},
          {
            duration: 1.8,
          },
        );

      /*
       * ===========================================================
       * PROGRESS BAR
       * ===========================================================
       */

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=12000",

        onUpdate: (self) => {
          if (self.progress <= 0.001) {
            stopCinematicAudio();
          }
        },
      });
    }, root);

    return () => {
      context.revert();

      /*
       * -----------------------------------------------------------
       * STOP ALL AUDIO
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
       * RESET AUDIO REFS
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

      return () => {
        if (shootingTimer) {
          clearTimeout(shootingTimer);
        }

        if (doubleShotTimer) {
          clearTimeout(doubleShotTimer);
        }

        starRefs.current.forEach((star) => {
          if (!star) return;

          gsap.killTweensOf(star);

          gsap.set(star, {
            clearProps: "transform,background,boxShadow",
          });
        });
      };
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
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-6 font-mono text-[10px] tracking-[0.3em] text-white/40 md:px-12">
          <span>RAMIL / EXPLORATION SYSTEM</span>

          <span className="hidden md:block">MISSION // 001</span>

          <span>ONLINE</span>
        </div>
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
h-10 w-[470px] -translate-x-1/2 rounded-[50%]
bg-cyan-400/20 blur-3xl"
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

                  {/* Cockpit reflection */}

                  <div
                    className="absolute left-[25px] top-[14px]
h-px w-[55px]
rotate-[12deg]
bg-white/10"
                  />

                  {/* =================================================
COCKPIT POWER INDICATOR
Hidden initially by GSAP.
================================================== */}

                  <div
                    className="ship-cockpit-light absolute bottom-[10px]
left-1/2 h-px w-12
-translate-x-1/2
bg-cyan-300
opacity-0
shadow-[0_0_12px_rgba(34,211,238,0.9)]"
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
              >
                <div>VESSEL // RA-01</div>

                <div className="relative mt-1">
                  {/* Initial state */}

                  <span className="ship-docked-status text-white/30">
                    DOCKED • SYSTEMS STANDBY
                  </span>

                  {/* Activated state */}

                  <span
                    className="ship-awake-status absolute left-0 top-0
text-cyan-300 opacity-0"
                  >
                    AWAKE • FLIGHT SYSTEMS ONLINE
                  </span>
                </div>
              </div>
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
        {/* =====================================================
            SCENE 1
            COCKPIT
        ====================================================== */}
        <div
          ref={cockpit}
          className="cockpit-frame pointer-events-none absolute inset-0 z-30"
        >
          {/* TOP COCKPIT FRAME */}
          <div className="absolute left-0 right-0 top-0 h-[14vh] border-b border-white/10 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.5em] text-white/25">
              FLIGHT DECK
            </div>
          </div>

          {/* BOTTOM COCKPIT / DASHBOARD */}
          <div className="absolute bottom-0 left-1/2 h-[32vh] w-[120%] -translate-x-1/2 rounded-[50%_50%_0_0] border border-white/10 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* BOTTOM STATUS */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-[8px] tracking-[0.4em] text-white/25">
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            FLIGHT DECK
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
          </div>
        </div>
        {/* =====================================================
            WELCOME SCENE
        ===================================================== */}
        <div
          ref={welcome}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-3xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar
              label="Passenger Communication"
              status="Link Established"
            />

            <div className="welcome-line absolute left-5 top-[52px] font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
              CHANNEL // 01
            </div>

            <div className="px-6 py-16 text-center md:px-12 md:py-20">
              <div className="welcome-line font-mono text-[7px] uppercase tracking-[0.5em] text-cyan-300/60">
                Deep Space Transit Authority
              </div>

              <h1 className="welcome-line mt-6 text-4xl font-light tracking-tight md:text-7xl">
                Welcome,
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">
                  passenger.
                </span>
              </h1>

              <div className="welcome-line mx-auto mt-8 h-px w-24 bg-cyan-300/40" />

              <p className="welcome-line mx-auto mt-7 max-w-lg font-mono text-[7px] uppercase leading-7 tracking-[0.28em] text-white/30">
                Your interstellar journey is about to begin.
                <br />
                Please remain seated while navigation systems initialize.
              </p>
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
                PASSENGER CHANNEL
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-300/50">
                READY
              </span>
            </div>
          </div>
        </div>
        {/* =====================================================
            PILOT SCENE
        ===================================================== */}
        <div
          ref={pilot}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-5xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar label="Crew Identification" status="Profile Active" />

            <div className="grid md:grid-cols-[280px_1fr]">
              {/* Pilot portrait */}

              <div className="pilot-line relative flex min-h-[310px] items-center justify-center border-b border-white/10 md:border-b-0 md:border-r">
                <div className="relative h-56 w-44 overflow-hidden border border-white/10 bg-black/30">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/[0.08] via-transparent to-black/70" />

                  <Image
                    src="/images/profile.png"
                    alt="Pilot profile"
                    fill
                    priority
                    className="object-cover object-center grayscale-[20%]"
                    sizes="340px"
                  />

                  {/* Scan */}

                  <div className="pilot-scan-line absolute left-0 top-0 h-px w-full bg-cyan-300/70 shadow-[0_0_10px_rgba(34,211,238,.8)]" />

                  <div className="absolute bottom-3 left-3 font-mono text-[5px] uppercase tracking-[0.25em] text-cyan-300/60">
                    BIOMETRIC LOCK
                  </div>

                  <div className="absolute bottom-3 right-3 font-mono text-[5px] text-white/20">
                    01
                  </div>
                </div>
              </div>

              {/* Pilot information */}

              <div className="flex flex-col justify-center px-7 py-10 md:px-12">
                <div className="pilot-line font-mono text-[7px] uppercase tracking-[0.35em] text-white/25">
                  Mission Commander
                </div>

                <h2 className="pilot-line mt-4 text-4xl font-light tracking-tight md:text-6xl">
                  Ramil
                  <br />
                  <span className="text-white/30">Aoanan.</span>
                </h2>

                <div className="pilot-line mt-7 h-px w-24 bg-cyan-300/40" />

                <p className="pilot-line mt-7 max-w-xl font-mono text-[7px] uppercase leading-7 tracking-[0.25em] text-white/30">
                  Full-stack developer and technical writer.
                  <br />
                  Frontend systems / interface architecture / digital
                  exploration.
                </p>

                <div className="pilot-line mt-9 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 md:grid-cols-3">
                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Clearance
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-cyan-300/70">
                      LEVEL 07
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Role
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-white/60">
                      PILOT
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                      Status
                    </div>

                    <div className="mt-2 font-mono text-[7px] text-cyan-300/70">
                      ACTIVE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/20">
                CREW DATABASE
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-cyan-300/50">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
        {/* =====================================================
    DESTINATION SCENE — COMPACT HUD
===================================================== */}
        <div
          ref={destination}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-4xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            {/* TITLE BAR */}

            <HudTitleBar
              label="Navigation System"
              status="Auto Nav // Online"
            />

            {/* HEADER */}

            <div className="destination-line flex items-end justify-between px-5 pb-4 pt-6 md:px-6">
              <div>
                <div className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
                  Mission Navigation
                </div>

                <h2 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">
                  Destination
                  <span className="text-white/30"> acquisition.</span>
                </h2>
              </div>

              <div className="hidden text-right md:block">
                <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-white/25">
                  Navigation Status
                </div>

                <div className="mt-1 flex items-center justify-end gap-2 font-mono text-[7px] uppercase tracking-[0.25em] text-cyan-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                  TARGET LOCKED
                </div>
              </div>
            </div>

            {/* MAP */}

            <div className="destination-line relative mx-5 h-[280px] overflow-hidden border border-white/10 bg-black/20 md:mx-6 md:h-[300px]">
              {/* GRID */}

              <div
                className="map-grid absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(100,180,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,.25) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* CROSSHAIR */}

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-cyan-300/10" />

              <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px bg-cyan-300/10" />

              {/* RADAR RINGS */}

              <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

              <div className="absolute left-1/2 top-1/2 h-[135px] w-[135px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15" />

              <div className="absolute left-1/2 top-1/2 h-[75px] w-[75px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

              {/* NAVIGATION VECTORS */}

              <div className="absolute left-1/2 top-1/2 h-[210px] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />

              <div className="absolute left-1/2 top-1/2 h-[210px] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />

              {/* ORIGIN */}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-xl" />

                <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(80,220,255,1)]" />
                </div>

                <div className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  ORIGIN
                </div>
              </div>

              {/* DESTINATION TARGET */}

              <div className="map-target absolute left-[68%] top-[30%]">
                <div className="relative flex h-11 w-11 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-300/20" />

                  <div className="absolute inset-2 rounded-full border border-cyan-300/30" />

                  <div className="absolute inset-4 rounded-full border border-cyan-300/50" />

                  <div className="relative h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(80,220,255,1)]" />
                </div>

                {/* TARGET CROSSHAIR */}

                <div className="absolute left-1/2 top-1/2 h-px w-12 -translate-x-1/2 bg-cyan-300/30" />

                <div className="absolute left-1/2 top-1/2 h-12 w-px -translate-y-1/2 bg-cyan-300/30" />

                {/* TARGET DATA */}

                <div className="absolute left-12 top-0 whitespace-nowrap">
                  <div className="font-mono text-[6px] uppercase tracking-[0.3em] text-cyan-300">
                    <span ref={selectedDestination}>
                      {selectedMission.name}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.25em] text-white/30">
                    TARGET // {selectedMission.code}
                  </div>

                  <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.25em] text-white/20">
                    DIST // {selectedMission.distance}
                  </div>
                </div>
              </div>

              {/* VECTOR LINE */}

              <div className="absolute left-[52%] top-[48%] h-px w-[17%] origin-left rotate-[-18deg] bg-gradient-to-r from-cyan-300/10 via-cyan-300/30 to-cyan-300/70">
                <div className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 border-r border-t border-cyan-300/80" />
              </div>

              {/* TOP LEFT TELEMETRY */}

              <div className="absolute left-4 top-4 font-mono text-[5px] uppercase leading-4 tracking-[0.2em] text-white/30">
                <div className="text-cyan-300/60">GALACTIC NAVIGATION</div>

                <div>SECTOR // {selectedMission.code}</div>

                <div>VECTOR // CALCULATED</div>

                <div>TRAJECTORY // OPTIMAL</div>
              </div>

              {/* TOP RIGHT TELEMETRY */}

              <div className="absolute right-4 top-4 text-right font-mono text-[5px] uppercase leading-4 tracking-[0.2em] text-white/30">
                <div>SCAN // ACTIVE</div>

                <div>SIGNAL // STABLE</div>

                <div className="text-cyan-300/60">LOCK // CONFIRMED</div>
              </div>

              {/* BOTTOM LEFT */}

              <div className="absolute bottom-4 left-4 font-mono text-[5px] uppercase tracking-[0.2em] text-white/25">
                <div>DESTINATION</div>

                <div className="mt-1 text-cyan-300/70">
                  {selectedMission.name}
                </div>
              </div>

              {/* BOTTOM RIGHT */}

              <div className="absolute bottom-4 right-4 text-right font-mono text-[5px] uppercase tracking-[0.2em] text-white/25">
                <div>NAVIGATION</div>

                <div className="mt-1 text-cyan-300/70">AUTONOMOUS</div>
              </div>

              {/* CENTER STATUS */}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[5px] uppercase tracking-[0.3em] text-white/20">
                <span className="mr-2 inline-block h-1 w-1 rounded-full bg-cyan-400" />
                MATRIX SYNCHRONIZED
              </div>
            </div>

            {/* TELEMETRY STRIP */}

            <div className="destination-line mx-5 mt-4 grid grid-cols-3 border-y border-white/10 md:mx-6">
              <div className="border-r border-white/10 px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Destination
                </div>

                <div className="mt-1 text-xs font-light text-white/70">
                  {selectedMission.name}
                </div>
              </div>

              <div className="border-r border-white/10 px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Distance
                </div>

                <div className="mt-1 text-xs font-light text-white/70">
                  {selectedMission.distance}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-[5px] uppercase tracking-[0.3em] text-white/25">
                  Status
                </div>

                <div className="mt-1 flex items-center gap-2 font-mono text-[6px] text-cyan-300">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)]" />
                  LOCKED
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="destination-line flex items-center justify-between px-5 py-4 font-mono text-[5px] uppercase tracking-[0.25em] text-white/20 md:px-6">
              <span>{selectedMission.description}</span>

              <span className="hidden md:block">
                AUTO DESTINATION SELECTION
              </span>
            </div>
          </div>
        </div>
        {/* =====================================================
            SYSTEM CHECK
        ===================================================== */}
        <div
          ref={system}
          className="hero-scene absolute inset-0 z-30 flex items-center justify-center px-5"
        >
          <div className="relative w-full max-w-4xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
            <HudCorners />

            <HudTitleBar
              label="Spacecraft Diagnostics"
              status="System Scan // Running"
            />

            <div className="system-line px-6 pb-5 pt-8 md:px-9">
              <div className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/25">
                Pre-flight diagnostic sequence
              </div>

              <h2 className="mt-3 text-4xl font-light md:text-5xl">
                Systems
                <span className="text-white/30"> check.</span>
              </h2>
            </div>

            <div className="px-6 pb-7 md:px-9">
              {[
                ["PROPULSION", "THRUST ARRAY"],
                ["NAVIGATION", "GUIDANCE CORE"],
                ["LIFE SUPPORT", "ENVIRONMENTAL"],
                ["COMMUNICATION", "DEEP SPACE LINK"],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="system-line border-t border-white/10 py-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-[7px] tracking-[0.25em] text-white/60">
                        {name}
                      </div>

                      <div className="mt-1 font-mono text-[5px] uppercase tracking-[0.2em] text-white/20">
                        {detail}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[6px] text-cyan-300/70">
                        100%
                      </span>

                      <span className="flex h-5 w-5 items-center justify-center border border-cyan-300/20 text-[8px] text-cyan-300">
                        ✓
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 h-px bg-white/5">
                    <div className="system-progress h-px w-0 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,.6)]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-9 items-center justify-between border-t border-white/10 px-5">
              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/20">
                DIAGNOSTIC ENGINE
              </span>

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-cyan-300/60">
                ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>
        </div>
        {/* =====================================================
            SCENE 8
            COUNTDOWN
        ====================================================== */}
        <div
          ref={countdown}
          className="hero-scene absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="countdown-line font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-300/70">
              Launch sequence
            </div>

            <div
              ref={countNumber}
              className="countdown-line mt-5 text-[12rem] font-extralight leading-none tracking-tighter text-white md:text-[18rem]"
            >
              10
            </div>

            <div className="countdown-line mt-5 font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
              Prepare for ignition
            </div>
          </div>
        </div>
        {/* =====================================================
            ENGINE / LAUNCH GLOW
        ====================================================== */}
        <div
          ref={launchGlow}
          className="launch-glow pointer-events-none absolute left-1/2 top-[70%] z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/50 blur-[70px]"
        />
        {/* =====================================================
            LAUNCH FLASH
        ====================================================== */}
        <div
          ref={launchFlash}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[50] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 opacity-0 shadow-[0_0_30px_rgba(34,211,238,1),0_0_80px_rgba(6,182,212,0.9),0_0_150px_rgba(6,182,212,0.6)]"
        />
        {/* =====================================================
            LAUNCH STATUS
        ====================================================== */}
        <div className="launch-status pointer-events-none absolute bottom-20 left-1/2 z-[80] -translate-x-1/2 opacity-0 font-mono text-[8px] uppercase tracking-[0.4em] text-cyan-300">
          <span className="mr-3 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]" />
          LAUNCHING
        </div>
        {/* =====================================================
            BOTTOM HUD
        ====================================================== */}
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-50 flex items-center justify-between px-6 font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 md:px-12">
          <span>LAT 14.5995°</span>

          <span className="hidden md:block">DIGITAL EXPLORATION UNIT</span>

          <span>LONG 120.9842°</span>
        </div>
      </div>
    </section>
  );
}
