"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* -------------------------------------------------------------------------- */
/* STAR DATA                                                                  */
/* -------------------------------------------------------------------------- */

const stars = Array.from({ length: 220 }, (_, i) => {
  const x = (i * 47.37) % 100;
  const y = (i * 71.83) % 100;

  // Distance from the center / vanishing point.
  const dx = x - 50;
  const dy = y - 50;

  const distance = Math.sqrt(dx * dx + dy * dy);

  return {
    id: i,
    left: `${x}%`,
    top: `${y}%`,

    dx,
    dy,

    // 0 = center
    // 1 = far from center
    depth: Math.min(1, distance / 70),

    size: i % 9 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,

    opacity: 0.2 + ((i * 13) % 65) / 100,
  };
});

/* -------------------------------------------------------------------------- */
/* SPACE BACKGROUND                                                           */
/* -------------------------------------------------------------------------- */

export default function SpaceBackground() {
  const starRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const animations: gsap.core.Timeline[] = [];

    starRefs.current.forEach((star, index) => {
      if (!star) return;

      const data = stars[index];

      const distance = Math.sqrt(data.dx * data.dx + data.dy * data.dy);

      if (distance === 0) return;

      /*
       * Direction away from the center.
       */
      const dirX = data.dx / distance;
      const dirY = data.dy / distance;

      /*
       * How far the star travels before disappearing.
       *
       * Stars near the center travel farther.
       * Stars already near the edge need less travel.
       */
      const travel = 600 + (1 - data.depth) * 1000;

      /*
       * Slightly different speeds prevent the entire
       * starfield from looking synchronized.
       */
      const duration = 1.8 + data.depth * 2 + ((index * 19) % 100) / 100;

      /*
       * Deterministic stagger.
       *
       * No Math.random() is used, so hydration remains safe.
       */
      const delay = (((index * 41.37) % 100) / 100) * duration;

      const timeline = gsap.timeline({
        repeat: -1,
        delay,
      });

      /*
       * --------------------------------------------------------------
       * STAR LIFECYCLE
       * --------------------------------------------------------------
       *
       *        center
       *           ●
       *          ↗
       *       ↗
       *    ✦
       *
       * Star appears near the center,
       * accelerates outward,
       * stretches visually,
       * disappears,
       * then starts again from the center.
       */

      timeline
        /*
         * Reset to the vanishing point.
         */
        .set(star, {
          x: 0,
          y: 0,
          scale: 0.25,
          opacity: 0,
        })

        /*
         * Star emerges from deep space.
         */
        .to(star, {
          opacity: data.opacity * 0.75,
          scale: 0.8,
          duration: duration * 0.18,
          ease: "power2.out",
        })

        /*
         * Star accelerates toward the viewer.
         */
        .to(star, {
          x: dirX * travel,
          y: dirY * travel,
          scale: 2.5 + data.depth * 3,
          opacity: 0,
          duration: duration * 0.82,
          ease: "power3.in",
        });

      animations.push(timeline);
    });

    return () => {
      animations.forEach((animation) => {
        animation.kill();
      });
    };
  }, []);

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        overflow-hidden
        bg-[#02030a]
      "
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------------ */}
      {/* BLUE ATMOSPHERE                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          left-1/2
          top-[42%]
          h-[65vh]
          w-[65vw]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-700/10
          blur-[130px]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* VIOLET ATMOSPHERE                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          right-[-10%]
          top-[25%]
          h-[50vh]
          w-[45vw]
          rounded-full
          bg-violet-700/10
          blur-[130px]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* STARFIELD                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, index) => (
          <span
            key={star.id}
            ref={(element) => {
              starRefs.current[index] = element;
            }}
            className="
              absolute
              rounded-full
              bg-white
              will-change-transform
            "
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow:
                star.size >= 2 ? "0 0 8px rgba(255,255,255,0.65)" : "none",
            }}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* NEBULA STREAK                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          left-[-20%]
          top-[42%]
          h-px
          w-[140%]
          rotate-[-8deg]
          bg-gradient-to-r
          from-transparent
          via-cyan-400/20
          to-transparent
          blur-[2px]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* GLOBAL VIGNETTE                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_25%,rgba(2,3,10,0.25)_65%,rgba(0,0,0,0.7)_100%)]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* CENTRAL CAMERA GLOW                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[20vh]
          w-[20vw]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.025]
          blur-[100px]
        "
      />
    </div>
  );
}
