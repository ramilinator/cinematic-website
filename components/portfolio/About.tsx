"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: section.current,
          start: "top 75%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={section}
      className="relative overflow-hidden border-t border-white/5 bg-[#03040d] py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-16 lg:grid-cols-[0.7fr_1.3fr]">
          {/* LEFT — PROFILE */}
          <div className="about-reveal">
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-3xl border border-cyan-300/10 bg-[#070914]">
              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_55%)]" />

              <Image
                src="/images/profile.png"
                alt="Ramil Aoanan"
                loading="eager"
                fill
                className="relative object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority={false}
              />

              {/* Scanline effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(34,211,238,0.05)_50%,transparent_100%)]" />

              {/* Bottom gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#03040d] to-transparent" />

              {/* HUD corners */}
              <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-cyan-300/50" />
              <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-cyan-300/50" />
              <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-cyan-300/50" />
              <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-cyan-300/50" />

              {/* Profile label */}
              <div className="absolute bottom-5 left-6">
                <p className="text-[9px] uppercase tracking-[0.35em] text-cyan-300/60">
                  Pilot Profile
                </p>

                <p className="mt-1 text-sm tracking-[0.15em] text-white">
                  RAMIL AOANAN
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — CONTENT */}
          <div className="about-reveal">
            <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-300/60">
              01 // Mission Profile
            </p>
            <br />
            <h2 className="text-4xl font-light tracking-[-0.02em] text-white sm:text-6xl">
              Building digital
              <br />
              <span className="text-white/35">experiences.</span>
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-white/50">
              I'm Ramil Aoanan, a frontend developer focused on creating modern,
              responsive and interactive web experiences. I enjoy combining
              clean engineering with strong visual design to build websites that
              feel as good as they function.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                ["05+", "Years"],
                ["20+", "Projects"],
                ["∞", "Curiosity"],
                ["24/7", "Learning"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#070914] p-6">
                  <p className="text-2xl font-light text-cyan-200">{value}</p>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-white/30">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
