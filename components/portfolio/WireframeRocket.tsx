"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

export type WireframeRocketHandle = {
  element: HTMLDivElement | null;
};

type WireframeRocketProps = {
  className?: string;
};

/* =======================================================
   COLORS
======================================================= */

const COLORS = {
  body: "#8B92A3",
  bodyDark: "#343946",
  bodyLight: "#C7CDD8",

  panel: "#555D6D",
  panelDark: "#202532",

  cyan: "#22D3EE",
  cyanBright: "#67E8F9",

  violet: "#8B5CF6",
  violetBright: "#A78BFA",

  glass: "#071827",

  engine: "#303746",
  nozzle: "#171B25",

  // Clean neutral engine flame
  flameOuter: "#D8DEE8",
  flameMiddle: "#F3F6FA",
  flameCore: "#FFFFFF",
};

/* =======================================================
   METALLIC MATERIAL
======================================================= */

function MetalMaterial({
  color,
  metalness = 0.75,
  roughness = 0.32,
}: {
  color: string;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
    />
  );
}

/* =======================================================
   ROCKET BODY
======================================================= */

function RocketBody() {
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0.72, -1.65),
      new THREE.Vector2(0.78, -1.35),
      new THREE.Vector2(0.79, -0.5),
      new THREE.Vector2(0.79, 0.45),

      // Shoulder transition
      new THREE.Vector2(0.77, 0.68),
      new THREE.Vector2(0.72, 0.85),
      new THREE.Vector2(0.65, 1.02),
      new THREE.Vector2(0.56, 1.18),
      new THREE.Vector2(0.45, 1.32),
      new THREE.Vector2(0.31, 1.44),
      new THREE.Vector2(0.16, 1.52),
      new THREE.Vector2(0, 1.57),
    ];

    return new THREE.LatheGeometry(points, 48);
  }, []);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <MetalMaterial color={COLORS.body} metalness={0.88} roughness={0.28} />
    </mesh>
  );
}

/* =======================================================
   BODY PANEL LINES
======================================================= */

function BodyPanelRing({
  y,
  radius = 0.795,
  thickness = 0.025,
  color = COLORS.cyan,
  opacity = 0.55,
}: {
  y: number;
  radius?: number;
  thickness?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <torusGeometry args={[radius, thickness, 8, 48]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

/* =======================================================
   BODY STRUCTURAL RAILS
======================================================= */

function BodyRails() {
  const rails = useMemo(() => {
    const group = new THREE.Group();

    const radius = 0.802;

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;

      const points = [
        new THREE.Vector3(
          Math.cos(angle) * radius,
          -1.48,
          Math.sin(angle) * radius,
        ),
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0.62,
          Math.sin(angle) * radius,
        ),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? COLORS.cyan : COLORS.violet,
        transparent: true,
        opacity: 0.42,
      });

      group.add(new THREE.Line(geometry, material));
    }

    return group;
  }, []);

  return <primitive object={rails} />;
}

/* =======================================================
   NOSE CAP
======================================================= */

function NoseCap() {
  return (
    <group position={[0, 1.52, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.17, 24, 16]} />

        <meshStandardMaterial
          color={COLORS.bodyLight}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, -0.08, 0]} scale={[1.15, 0.7, 1.15]}>
        <sphereGeometry args={[0.15, 24, 16]} />

        <meshStandardMaterial
          color={COLORS.bodyLight}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   COCKPIT / WINDOWS
======================================================= */

function CockpitWindows() {
  return (
    <group>
      {/* Front cockpit */}
      <mesh position={[0, 1.04, 0.66]} rotation={[-0.18, 0, 0]}>
        <sphereGeometry args={[0.24, 24, 16]} />

        <meshStandardMaterial
          color={COLORS.glass}
          metalness={0.55}
          roughness={0.08}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* Cyan glass reflection */}
      <mesh position={[0, 1.06, 0.875]} scale={[0.65, 0.3, 0.05]}>
        <sphereGeometry args={[0.18, 20, 12]} />

        <meshBasicMaterial
          color={COLORS.cyanBright}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      {/* Side windows */}
      <mesh position={[0.67, 0.98, 0]} rotation={[0, Math.PI / 2, 0]}>
        <sphereGeometry args={[0.18, 20, 12]} />

        <meshStandardMaterial
          color={COLORS.glass}
          metalness={0.55}
          roughness={0.08}
        />
      </mesh>

      <mesh position={[-0.67, 0.98, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[0.18, 20, 12]} />

        <meshStandardMaterial
          color={COLORS.glass}
          metalness={0.55}
          roughness={0.08}
        />
      </mesh>

      {/* Rear side window */}
      <mesh position={[0, 0.98, -0.67]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[0.18, 20, 12]} />

        <meshStandardMaterial
          color={COLORS.glass}
          metalness={0.55}
          roughness={0.08}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   WINDOW FRAMES
======================================================= */

function WindowFrame({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[0.19, 0.025, 8, 24]} />

      <meshStandardMaterial
        color={COLORS.bodyDark}
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  );
}

/* =======================================================
   ROCKET FIN
======================================================= */

function RocketFin({
  rotation,
  side = 1,
}: {
  rotation: number;
  side?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0.68, -0.45);
    shape.lineTo(1.0, -0.55);
    shape.lineTo(1.23, -1.15);
    shape.lineTo(1.08, -1.68);
    shape.lineTo(0.74, -1.52);
    shape.lineTo(0.72, -0.72);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      steps: 1,
    });
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[0, 0, side * 0.02]}
      rotation={[0, rotation, 0]}
      castShadow
    >
      <meshStandardMaterial
        color={COLORS.bodyDark}
        metalness={0.82}
        roughness={0.3}
      />
    </mesh>
  );
}

/* =======================================================
   FIN EDGE LIGHT
======================================================= */

function FinEdge({ rotation }: { rotation: number }) {
  const points = [
    new THREE.Vector3(0.78, -0.5, 0),
    new THREE.Vector3(1.2, -1.12, 0),
    new THREE.Vector3(1.05, -1.58, 0),
  ];

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [],
  );

  return (
    <line geometry={geometry} rotation={[0, rotation, 0]}>
      <lineBasicMaterial color={COLORS.cyan} transparent opacity={0.65} />
    </line>
  );
}

/* =======================================================
   ENGINE SECTION
   Clean version — no cyan/violet rings
======================================================= */

function EngineSection() {
  return (
    <group>
      {/* Engine mounting collar */}
      <mesh position={[0, -1.73, 0]}>
        <cylinderGeometry args={[0.77, 0.77, 0.16, 48]} />

        <meshStandardMaterial
          color={COLORS.panelDark}
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>

      {/* Engine housing */}
      <mesh position={[0, -1.98, 0]}>
        <cylinderGeometry args={[0.68, 0.62, 0.32, 32]} />

        <meshStandardMaterial
          color={COLORS.engine}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   ENGINE BELL
   Clean continuous nozzle — no decorative rings
======================================================= */

function EngineBell() {
  return (
    <group position={[0, -2.3, 0]}>
      {/* Outer bell */}
      <mesh>
        <cylinderGeometry args={[0.58, 0.43, 0.48, 32, 1, true]} />

        <meshStandardMaterial
          color={COLORS.nozzle}
          metalness={0.95}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner nozzle */}
      <mesh position={[0, -0.26, 0]}>
        <cylinderGeometry args={[0.34, 0.22, 0.3, 24, 1, true]} />

        <meshStandardMaterial
          color="#090C12"
          metalness={0.85}
          roughness={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   ENGINE EXHAUST
   No glow sphere / no ring
======================================================= */

function EngineExhaust() {
  return (
    <group position={[0, -2.72, 0]}>
      {/* Clean exhaust opening */}
      <mesh>
        <cylinderGeometry args={[0.21, 0.17, 0.16, 24]} />

        <meshStandardMaterial
          color="#11151D"
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   FLAME
   Neutral white/metallic exhaust flame
======================================================= */

function EngineFlame() {
  const flameRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!flameRef.current) return;

    const time = clock.getElapsedTime();

    const pulse = 1 + Math.sin(time * 12) * 0.07 + Math.sin(time * 23) * 0.035;

    flameRef.current.scale.x = pulse;
    flameRef.current.scale.z = pulse;

    flameRef.current.scale.y =
      1 + Math.sin(time * 14) * 0.08 + Math.sin(time * 25) * 0.035;
  });

  return (
    <group ref={flameRef} position={[0, -3.42, 0]}>
      {/* Outer flame */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.43, 2.0, 16, 3, true]} />

        <meshBasicMaterial
          color={COLORS.flameOuter}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Middle flame */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.04, 0]}>
        <coneGeometry args={[0.29, 1.55, 14, 3, true]} />

        <meshBasicMaterial
          color={COLORS.flameMiddle}
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bright core */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.1, 0]}>
        <coneGeometry args={[0.14, 1.15, 10, 3, true]} />

        <meshBasicMaterial
          color={COLORS.flameCore}
          transparent
          opacity={0.58}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Neutral exhaust light */}
      <pointLight color="#E8EDF4" intensity={1.2} distance={3} decay={2} />
    </group>
  );
}

/* =======================================================
   BODY DETAILS
======================================================= */

function BodyDetails() {
  return (
    <>
      {/* Horizontal structural rings */}
      <BodyPanelRing y={0.55} />
      <BodyPanelRing y={0.1} opacity={0.38} />
      <BodyPanelRing y={-0.48} opacity={0.38} />
      <BodyPanelRing y={-1.05} opacity={0.42} />

      {/* Window frames */}
      <WindowFrame position={[0, 1.04, 0.87]} rotation={[Math.PI / 2, 0, 0]} />

      <WindowFrame position={[0.87, 0.98, 0]} rotation={[0, Math.PI / 2, 0]} />

      <WindowFrame position={[-0.87, 0.98, 0]} rotation={[0, Math.PI / 2, 0]} />

      <WindowFrame position={[0, 0.98, -0.87]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
}

/* =======================================================
   ROCKET MODEL
======================================================= */

function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!rocketRef.current) return;

    rocketRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={rocketRef} position={[0, 0, 0]} scale={1.12}>
      {/* Main structure */}
      <RocketBody />

      <BodyRails />

      <NoseCap />

      <CockpitWindows />

      <BodyDetails />

      {/* Fins */}
      <RocketFin rotation={0} />
      <RocketFin rotation={Math.PI / 2} />
      <RocketFin rotation={Math.PI} />
      <RocketFin rotation={(Math.PI * 3) / 2} />

      <FinEdge rotation={0} />
      <FinEdge rotation={Math.PI / 2} />
      <FinEdge rotation={Math.PI} />
      <FinEdge rotation={(Math.PI * 3) / 2} />

      {/* Clean engine */}
      <EngineSection />

      <EngineBell />

      <EngineExhaust />

      <EngineFlame />
    </group>
  );
}

/* =======================================================
   COMPONENT
======================================================= */

const WireframeRocket = forwardRef<WireframeRocketHandle, WireframeRocketProps>(
  function WireframeRocket({ className = "" }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        element: rootRef.current,
      }),
      [],
    );

    return (
      <div
        ref={rootRef}
        className={`relative w-[520px] aspect-square ${className}`}
      >
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{
            position: [0, 0, 16.5],
            fov: 34,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          {/* =================================================
          LIGHTING
        ================================================= */}

          <ambientLight intensity={0.45} />

          <directionalLight position={[4, 6, 5]} intensity={2} />

          <directionalLight
            position={[-4, 2, -3]}
            intensity={1.2}
            color={COLORS.violetBright}
          />

          <pointLight
            position={[0, 1, 3]}
            intensity={1.5}
            distance={7}
            color={COLORS.cyanBright}
          />

          <pointLight
            position={[0, -2.5, 2]}
            intensity={1.8}
            distance={5}
            color={COLORS.violet}
          />

          <RocketModel />
        </Canvas>
      </div>
    );
  },
);

WireframeRocket.displayName = "WireframeRocket";

export default WireframeRocket;
