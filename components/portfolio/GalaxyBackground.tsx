"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   TYPES
========================================================= */

type GalaxyBackgroundProps = {
  className?: string;
  opacity?: number;
  speed?: number;
};

/* =========================================================
   SEEDED RANDOM
   Keeps the star field deterministic between renders.
========================================================= */

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* =========================================================
   STAR FIELD
========================================================= */

function StarField({
  count = 3200,
  radius = 35,
  size = 0.035,
  opacity = 0.8,
  speed = 0.02,
}: {
  count?: number;
  radius?: number;
  size?: number;
  opacity?: number;
  speed?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const theta = seededRandom(i + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i + 1000) - 1);

      // Non-uniform distribution creates a more natural
      // deep-space field instead of a perfect sphere.
      const distance = Math.pow(seededRandom(i + 2000), 0.55) * radius;

      positions[i3] = Math.sin(phi) * Math.cos(theta) * distance;

      positions[i3 + 1] = Math.cos(phi) * distance;

      positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * distance;

      // Mostly white stars with subtle cool variation.
      const temperature = seededRandom(i + 3000);

      if (temperature > 0.93) {
        color.setRGB(0.72, 0.86, 1);
      } else if (temperature > 0.82) {
        color.setRGB(0.82, 0.9, 1);
      } else if (temperature > 0.68) {
        color.setRGB(0.94, 0.96, 1);
      } else {
        color.setRGB(1, 1, 1);
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geo;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x += delta * speed * 0.12;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* =========================================================
   GALACTIC DUST
========================================================= */

function GalacticDust() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);

    gradient.addColorStop(0, "rgba(100,180,255,0.22)");
    gradient.addColorStop(0.25, "rgba(70,120,255,0.12)");
    gradient.addColorStop(0.55, "rgba(90,50,180,0.06)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    return tex;
  }, []);

  const dustPlanes = useMemo(
    () => [
      {
        position: [-7, 2, -12] as [number, number, number],
        rotation: [0.1, 0.3, -0.35] as [number, number, number],
        scale: [18, 10, 1] as [number, number, number],
        opacity: 0.5,
      },
      {
        position: [8, -2, -18] as [number, number, number],
        rotation: [-0.2, -0.25, 0.25] as [number, number, number],
        scale: [20, 12, 1] as [number, number, number],
        opacity: 0.38,
      },
      {
        position: [0, 4, -25] as [number, number, number],
        rotation: [0, 0, 0.12] as [number, number, number],
        scale: [25, 14, 1] as [number, number, number],
        opacity: 0.3,
      },
    ],
    [],
  );

  if (!texture) return null;

  return (
    <group>
      {dustPlanes.map((dust, index) => (
        <mesh
          key={index}
          position={dust.position}
          rotation={dust.rotation}
          scale={dust.scale}
        >
          <planeGeometry args={[1, 1]} />

          <meshBasicMaterial
            map={texture}
            transparent
            opacity={dust.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   MILKY WAY BAND
========================================================= */

function GalaxyBand() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 1600;
    canvas.height = 700;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*
     * Multiple blurred gradients create the appearance
     * of layered galactic dust rather than one flat glow.
     */

    const main = ctx.createLinearGradient(0, 200, canvas.width, 500);

    main.addColorStop(0, "rgba(40,90,180,0)");

    main.addColorStop(0.2, "rgba(60,110,220,0.08)");

    main.addColorStop(0.5, "rgba(140,170,255,0.17)");

    main.addColorStop(0.7, "rgba(70,100,200,0.09)");

    main.addColorStop(1, "rgba(40,70,160,0)");

    ctx.fillStyle = main;

    ctx.filter = "blur(35px)";

    ctx.fillRect(0, 130, canvas.width, 440);

    /*
     * Bright galactic core.
     */

    ctx.filter = "blur(60px)";

    const core = ctx.createRadialGradient(800, 340, 20, 800, 340, 430);

    core.addColorStop(0, "rgba(220,230,255,0.25)");

    core.addColorStop(0.35, "rgba(120,150,255,0.10)");

    core.addColorStop(1, "rgba(50,60,160,0)");

    ctx.fillStyle = core;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tex = new THREE.CanvasTexture(canvas);

    tex.colorSpace = THREE.SRGBColorSpace;

    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -22]} rotation={[0, 0, -0.16]} scale={[30, 14, 1]}>
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* =========================================================
   FAR STAR LAYER
========================================================= */

function FarStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 900;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const x = (seededRandom(i * 4 + 10) - 0.5) * 55;

      const y = (seededRandom(i * 4 + 20) - 0.5) * 35;

      const z = -25 - seededRandom(i * 4 + 30) * 35;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }

    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += delta * 0.003;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        color="#b9d8ff"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* =========================================================
   CAMERA MOTION
========================================================= */

function CameraMotion() {
  useFrame(({ camera }) => {
    const time = performance.now() * 0.0001;

    camera.position.x = Math.sin(time) * 0.12;

    camera.position.y = Math.cos(time * 0.8) * 0.06;

    camera.lookAt(0, 0, -10);
  });

  return null;
}

/* =========================================================
   GALAXY SCENE
========================================================= */

function GalaxyScene({ speed = 0.02 }: { speed?: number }) {
  return (
    <>
      <color attach="background" args={["#010207"]} />

      <fog attach="fog" args={["#010207", 20, 65]} />

      <CameraMotion />

      {/* Deep background */}
      <FarStars />

      {/* Main star field */}
      <StarField
        count={3200}
        radius={40}
        size={0.035}
        opacity={0.8}
        speed={speed}
      />

      {/* Additional smaller stars */}
      <StarField
        count={1800}
        radius={28}
        size={0.018}
        opacity={0.5}
        speed={speed * 0.5}
      />

      {/* Milky Way */}
      <GalaxyBand />

      {/* Nebula / interstellar dust */}
      <GalacticDust />
    </>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function GalaxyBackground({
  className = "",
  opacity = 1,
  speed = 0.02,
}: GalaxyBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        opacity,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 8],
          fov: 55,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <GalaxyScene speed={speed} />
      </Canvas>

      {/* Cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(1,2,7,0.25) 58%, rgba(1,2,7,0.82) 100%)",
        }}
      />

      {/* Subtle bottom fade for hero content */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to top, rgba(1,2,7,0.8), transparent)",
        }}
      />
    </div>
  );
}
