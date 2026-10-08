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
   EDGE MATERIAL
======================================================= */

function EdgeMaterial({
  color = "#7DD3FC",
  opacity = 0.85,
}: {
  color?: string;
  opacity?: number;
}) {
  return (
    <lineBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
    />
  );
}

/* =======================================================
   FIN
======================================================= */

function RocketFin({ rotation }: { rotation: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0.62, 0.05);
    shape.lineTo(1.05, -0.12);

    // Wider lower section
    shape.lineTo(1.12, -0.75);

    // Wide bottom
    shape.lineTo(0.82, -1.55);

    shape.lineTo(0.48, -1.42);

    shape.lineTo(0.58, -0.55);

    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: false,
      steps: 1,
    });
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[0, -1.05, 0]}
      rotation={[0, rotation, 0]}
    >
      <meshBasicMaterial
        color="#22D3EE"
        wireframe
        transparent
        opacity={0.88}
        depthWrite={false}
      />
    </mesh>
  );
}

/* =======================================================
   ROCKET BODY
======================================================= */
function RocketBody() {
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0.82, -1.55),
      new THREE.Vector2(0.82, -0.25),
      new THREE.Vector2(0.82, 0.45),
      new THREE.Vector2(0.8, 0.65),
      new THREE.Vector2(0.74, 0.82),
      new THREE.Vector2(0.65, 0.98),
      new THREE.Vector2(0.52, 1.14),
      new THREE.Vector2(0.35, 1.28),
      new THREE.Vector2(0.18, 1.38),
      new THREE.Vector2(0, 1.45),
    ];

    return new THREE.LatheGeometry(points, 12);
  }, []);

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);

  const gradientMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
  }, []);

  useMemo(() => {
    const position = edges.attributes.position;

    const colors: number[] = [];

    const violet = new THREE.Color("#8B5CF6");
    const cyan = new THREE.Color("#22D3EE");

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);

      // Bottom = cyan, top = violet
      const t = THREE.MathUtils.clamp((y + 1.55) / 3, 0, 1);

      const color = violet.clone().lerp(cyan, t);

      colors.push(color.r, color.g, color.b);
    }

    edges.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return edges;
  }, [edges]);

  return <lineSegments geometry={edges} material={gradientMaterial} />;
}
function BodyStructure() {
  const lines = useMemo(() => {
    const group = new THREE.Group();

    const radius = 0.825;

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;

      const points = [
        new THREE.Vector3(
          Math.cos(angle) * radius,
          -1.52,
          Math.sin(angle) * radius,
        ),

        new THREE.Vector3(
          Math.cos(angle) * radius,
          0.45,
          Math.sin(angle) * radius,
        ),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: "#60A5FA",
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      });

      group.add(new THREE.Line(geometry, material));
    }

    return group;
  }, []);

  return <primitive object={lines} />;
}

/* =======================================================
   ENGINE
======================================================= */

function Engine() {
  return (
    <group>
      {/* Wide engine base */}
      <mesh position={[0, -1.68, 0]}>
        <cylinderGeometry args={[0.76, 0.68, 0.28, 12, 1, true]} />

        <meshBasicMaterial
          color="#7C3AED"
          wireframe
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </mesh>

      {/* Tapered engine nozzle */}
      <mesh position={[0, -1.98, 0]}>
        <cylinderGeometry args={[0.62, 0.46, 0.38, 12, 1, true]} />

        <meshBasicMaterial
          color="#A78BFA"
          wireframe
          transparent
          opacity={0.76}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function EngineExhaust() {
  return (
    <group>
      {/* Original exhaust */}
      <mesh position={[0, -2.18, 0]}>
        <cylinderGeometry args={[0.46, 0.34, 0.42, 12, 1, true]} />

        <meshBasicMaterial
          color="#22D3A6"
          wireframe
          transparent
          opacity={0.82}
          depthWrite={false}
        />
      </mesh>

      {/* Narrow exhaust tip */}
      <mesh position={[0, -2.48, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 12, 1, true]} />

        <meshBasicMaterial
          color="#22D3A6"
          wireframe
          transparent
          opacity={0.82}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
function EngineFlame() {
  const flameRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!flameRef.current) return;

    const time = clock.getElapsedTime();

    const pulse = 1 + Math.sin(time * 10) * 0.08 + Math.sin(time * 17) * 0.04;

    flameRef.current.scale.x = pulse;
    flameRef.current.scale.z = pulse;

    flameRef.current.scale.y = 1 + Math.sin(time * 13) * 0.1;
  });

  return (
    <group ref={flameRef} position={[0, -3.15, 0]} rotation={[Math.PI, 0, 0]}>
      {/* Large outer flame */}
      <mesh>
        <coneGeometry args={[0.52, 2.25, 12, 1, true]} />

        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Large inner flame */}
      <mesh position={[0, -0.12, 0]}>
        <coneGeometry args={[0.34, 1.75, 10, 1, true]} />

        <meshBasicMaterial
          color="#A78BFA"
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright core */}
      <mesh position={[0, -0.18, 0]}>
        <coneGeometry args={[0.16, 1.25, 8, 1, true]} />

        <meshBasicMaterial
          color="#DDD6FE"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* =======================================================
   ROCKET MODEL
======================================================= */

function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!rocketRef.current) return;

    rocketRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={rocketRef} position={[0, 0, 0]} scale={1.15}>
      <RocketBody />

      <BodyStructure />

      <RocketFin rotation={0} />
      <RocketFin rotation={Math.PI / 2} />
      <RocketFin rotation={Math.PI} />
      <RocketFin rotation={(Math.PI * 3) / 2} />

      <Engine />
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
          camera={{
            position: [0, 0, 15],
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
          <RocketModel />
        </Canvas>
      </div>
    );
  },
);

WireframeRocket.displayName = "WireframeRocket";

export default WireframeRocket;
