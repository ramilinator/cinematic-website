"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";

export type Spacecraft3DHandle = {
  group: THREE.Group | null;
  setEnginePower: (power: number) => void;
  setNavigationLights: (enabled: boolean) => void;
  setBodyLights: (power: number) => void;
};

type SpacecraftProps = {
  enginePower?: number;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/* ============================================================
   MATERIALS
============================================================ */

function createMaterials() {
  const hull = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#171d25"),
    metalness: 0.82,
    roughness: 0.3,
  });

  const hullDark = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0b1016"),
    metalness: 0.9,
    roughness: 0.26,
  });

  const hullEdge = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#27323e"),
    metalness: 0.9,
    roughness: 0.2,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#06131d"),
    metalness: 0.4,
    roughness: 0.14,
    transmission: 0.05,
    transparent: true,
    opacity: 0.88,
  });

  const engineMetal = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#080b10"),
    metalness: 0.95,
    roughness: 0.2,
  });

  const engineInner = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#18232d"),
    metalness: 0.8,
    roughness: 0.2,
    emissive: new THREE.Color("#06212c"),
    emissiveIntensity: 0.2,
  });

  const cyan = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#8ff7ff"),
    emissive: new THREE.Color("#18dfff"),
    emissiveIntensity: 3,
    toneMapped: false,
  });

  const violet = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d7b7ff"),
    emissive: new THREE.Color("#8d4dff"),
    emissiveIntensity: 2.2,
    toneMapped: false,
  });

  return {
    hull,
    hullDark,
    hullEdge,
    glass,
    engineMetal,
    engineInner,
    cyan,
    violet,
  };
}

/* ============================================================
   ENGINE
============================================================ */

type EngineProps = {
  power: React.MutableRefObject<number>;
  position: [number, number, number];
  scale?: number;
};

function Engine({ power, position, scale = 1 }: EngineProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pointRef = useRef<THREE.PointLight>(null);

  const flicker = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    flicker.current += delta * 14;

    const targetPower = clamp(power.current);

    const pulse =
      0.88 +
      Math.sin(flicker.current) * 0.07 +
      Math.sin(flicker.current * 2.7) * 0.04;

    const currentPower = targetPower * pulse;

    if (coreRef.current) {
      coreRef.current.scale.set(1, 1, 0.7 + currentPower * 0.45);

      const material = coreRef.current.material as THREE.MeshStandardMaterial;

      material.emissiveIntensity = 0.2 + currentPower * 5;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(0.8 + currentPower * 1.4);

      const material = glowRef.current.material as THREE.MeshBasicMaterial;

      material.opacity = currentPower * 0.5;
    }

    if (pointRef.current) {
      pointRef.current.intensity = currentPower * 2.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Engine outer housing */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.6, 16]} />
        <meshStandardMaterial
          color="#080c11"
          metalness={0.95}
          roughness={0.22}
        />
      </mesh>

      {/* Inner nozzle */}
      <mesh position={[0, -0.31, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.31, 0.37, 0.1, 16]} />
        <meshStandardMaterial
          color="#141c25"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>

      {/* Engine core */}
      <mesh
        ref={coreRef}
        position={[0, -0.38, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.18, 0.24, 0.28, 16]} />

        <meshStandardMaterial
          color="#b9fbff"
          emissive="#00cfff"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Engine glow */}
      <mesh
        ref={glowRef}
        position={[0, -0.54, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.28, 0.12, 0.7, 16]} />

        <meshBasicMaterial
          color="#24dfff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight
        ref={pointRef}
        position={[0, -0.7, 0]}
        color="#32dcff"
        intensity={0}
        distance={3}
      />
    </group>
  );
}

/* ============================================================
   SHIP MODEL
============================================================ */

const SpacecraftModel = forwardRef<Spacecraft3DHandle>((_, ref) => {
  const groupRef = useRef<THREE.Group>(null);

  const enginePower = useRef(0);
  const navigationEnabled = useRef(false);
  const bodyLightPower = useRef(0);

  const navLeftRef = useRef<THREE.Mesh>(null);
  const navRightRef = useRef<THREE.Mesh>(null);

  const bodyLightRef = useRef<THREE.Mesh>(null);

  const materials = useRef(createMaterials()).current;

  useImperativeHandle(
    ref,
    () => ({
      group: groupRef.current,

      setEnginePower(power: number) {
        enginePower.current = clamp(power);
      },

      setNavigationLights(enabled: boolean) {
        navigationEnabled.current = enabled;
      },

      setBodyLights(power: number) {
        bodyLightPower.current = clamp(power);
      },
    }),
    [],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    /* Navigation light pulse */
    const navPower = navigationEnabled.current
      ? 1 + Math.sin(time * 5) * 0.18
      : 0;

    if (navLeftRef.current) {
      const material = navLeftRef.current
        .material as THREE.MeshStandardMaterial;

      material.emissiveIntensity = navPower * 3;
    }

    if (navRightRef.current) {
      const material = navRightRef.current
        .material as THREE.MeshStandardMaterial;

      material.emissiveIntensity = navPower * 3;
    }

    /* Body lighting */
    if (bodyLightRef.current) {
      const material = bodyLightRef.current
        .material as THREE.MeshStandardMaterial;

      material.emissiveIntensity = bodyLightPower.current * 2.5;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      {/* ======================================================
          MAIN FUSELAGE
      ====================================================== */}

      <mesh
        position={[0, 0.25, 0]}
        scale={[1.55, 0.52, 2.4]}
        material={materials.hull}
      >
        <sphereGeometry args={[1, 32, 20]} />
      </mesh>

      {/* Lower armored fuselage */}
      <mesh
        position={[0, -0.08, -0.1]}
        scale={[1.28, 0.32, 2]}
        material={materials.hullDark}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Upper spine */}
      <mesh
        position={[0, 0.65, 0.25]}
        scale={[0.42, 0.18, 1.5]}
        material={materials.hullEdge}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Rear armor plate */}
      <mesh
        position={[0, 0.05, 1.65]}
        scale={[1.12, 0.46, 0.18]}
        material={materials.hullEdge}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ======================================================
          CANOPY
      ====================================================== */}

      <mesh
        position={[0, 0.68, -0.25]}
        scale={[0.72, 0.24, 0.95]}
        material={materials.glass}
      >
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>

      {/* Canopy frame */}
      <mesh
        position={[0, 0.82, -0.25]}
        scale={[0.06, 0.08, 0.85]}
        material={materials.hullEdge}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ======================================================
          LEFT WING
      ====================================================== */}

      <group position={[-1.2, 0, 0.1]}>
        <mesh
          rotation={[0, 0, -0.08]}
          scale={[1.9, 0.12, 1.65]}
          material={materials.hull}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* Wing leading edge */}
        <mesh
          position={[-0.72, 0.08, -0.3]}
          rotation={[0, 0, -0.08]}
          scale={[1.55, 0.08, 0.12]}
          material={materials.hullEdge}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* Wing underside */}
        <mesh
          position={[-0.35, -0.12, 0.5]}
          rotation={[0, 0, -0.08]}
          scale={[1.45, 0.08, 0.65]}
          material={materials.hullDark}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>

      {/* ======================================================
          RIGHT WING
      ====================================================== */}

      <group position={[1.2, 0, 0.1]}>
        <mesh
          rotation={[0, 0, 0.08]}
          scale={[1.9, 0.12, 1.65]}
          material={materials.hull}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* Wing leading edge */}
        <mesh
          position={[0.72, 0.08, -0.3]}
          rotation={[0, 0, 0.08]}
          scale={[1.55, 0.08, 0.12]}
          material={materials.hullEdge}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* Wing underside */}
        <mesh
          position={[0.35, -0.12, 0.5]}
          rotation={[0, 0, 0.08]}
          scale={[1.45, 0.08, 0.65]}
          material={materials.hullDark}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>

      {/* ======================================================
          WING STRUCTURAL DETAILS
      ====================================================== */}

      <mesh
        position={[-1.65, -0.02, 0.15]}
        scale={[0.75, 0.05, 0.08]}
        material={materials.hullEdge}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh
        position={[1.65, -0.02, 0.15]}
        scale={[0.75, 0.05, 0.08]}
        material={materials.hullEdge}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ======================================================
          ENGINE POD STRUCTURES
      ====================================================== */}

      <mesh
        position={[-0.78, -0.18, 1.55]}
        scale={[0.48, 0.4, 0.55]}
        material={materials.engineMetal}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh
        position={[0, -0.18, 1.7]}
        scale={[0.52, 0.42, 0.6]}
        material={materials.engineMetal}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh
        position={[0.78, -0.18, 1.55]}
        scale={[0.48, 0.4, 0.55]}
        material={materials.engineMetal}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ======================================================
          THREE ENGINES
      ====================================================== */}

      <Engine power={enginePower} position={[-0.78, -0.28, 1.9]} scale={0.9} />

      <Engine power={enginePower} position={[0, -0.3, 2.05]} scale={1} />

      <Engine power={enginePower} position={[0.78, -0.28, 1.9]} scale={0.9} />

      {/* ======================================================
          BODY LIGHT
      ====================================================== */}

      <mesh
        ref={bodyLightRef}
        position={[0, -0.42, 0.55]}
        scale={[0.7, 0.04, 1.2]}
      >
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial
          color="#aefaff"
          emissive="#16dfff"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      {/* ======================================================
          NAVIGATION LIGHTS
      ====================================================== */}

      <mesh ref={navLeftRef} position={[-2.05, 0.02, 0.05]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#8ff7ff"
          emissive="#19dfff"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={navRightRef} position={[2.05, 0.02, 0.05]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#d8b8ff"
          emissive="#8d4dff"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Navigation point lights */}
      <pointLight
        position={[-2.05, 0, 0.05]}
        color="#20dfff"
        intensity={0.7}
        distance={2}
      />

      <pointLight
        position={[2.05, 0, 0.05]}
        color="#8d4dff"
        intensity={0.7}
        distance={2}
      />
    </group>
  );
});

SpacecraftModel.displayName = "SpacecraftModel";

/* ============================================================
   CANVAS
============================================================ */

export default forwardRef<Spacecraft3DHandle, SpacecraftProps>(
  function Spacecraft3D({ enginePower = 0 }, ref) {
    return (
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 1.3, 7],
            fov: 32,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={0.3} />

          <directionalLight position={[4, 5, 6]} intensity={2} />

          <directionalLight position={[-4, 2, 3]} intensity={1.2} />

          <pointLight position={[0, 0, 5]} color="#39dfff" intensity={1.5} />

          <SpacecraftModel ref={ref} />

          <Environment preset="night" />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
    );
  },
);
