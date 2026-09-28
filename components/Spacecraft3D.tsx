"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type Spacecraft3DHandle = {
  group: THREE.Group | null;

  setEnginePower: (power: number) => void;
  setNavigationLights: (enabled: boolean) => void;

  setBodyLights: (enabled: boolean) => void;
};

const Spacecraft3D = forwardRef<Spacecraft3DHandle>((_, ref) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const shipGroupRef = useRef<THREE.Group | null>(null);
  const engineGlowRef = useRef<THREE.Mesh[]>([]);
  const navigationLightsRef = useRef<THREE.Mesh[]>([]);
  const bodyLightsRef = useRef<THREE.Mesh[]>([]);

  useImperativeHandle(ref, () => ({
    group: shipGroupRef.current,

    setEnginePower(power: number) {
      const value = THREE.MathUtils.clamp(power, 0, 1);

      engineGlowRef.current.forEach((mesh, index) => {
        const material = mesh.material as THREE.MeshBasicMaterial;

        material.opacity = value;

        const scale = 0.35 + value * 0.65;

        mesh.scale.set(1, 1, scale);

        // Slightly brighten the engine core.
        material.color.setRGB(0.05 + value * 0.1, 0.5 + value * 0.5, 1);
      });
    },

    setNavigationLights(enabled: boolean) {
      navigationLightsRef.current.forEach((mesh) => {
        const material = mesh.material as THREE.MeshBasicMaterial;

        material.opacity = enabled ? 1 : 0;
      });
    },
    setBodyLights(enabled: boolean) {
      bodyLightsRef.current.forEach((mesh) => {
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = enabled ? 1 : 0;
      });
    },
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;

    /* ============================================================
       SCENE
    ============================================================ */

    const scene = new THREE.Scene();

    /* ============================================================
       CAMERA
    ============================================================ */

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.8, 16);
    camera.lookAt(0, 0, 0);

    /* ============================================================
       RENDERER
    ============================================================ */

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    mount.appendChild(renderer.domElement);

    /* ============================================================
       LIGHTING
    ============================================================ */

    const ambient = new THREE.AmbientLight(0xffffff, 2.2);

    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4);

    keyLight.position.set(5, 8, 10);

    scene.add(keyLight);

    const blueLight = new THREE.DirectionalLight(0x4488ff, 3);

    blueLight.position.set(-8, 3, 6);

    scene.add(blueLight);

    const purpleLight = new THREE.DirectionalLight(0x7744ff, 2);

    purpleLight.position.set(7, 1, -5);

    scene.add(purpleLight);

    /* ============================================================
       MATERIALS
    ============================================================ */

    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d4a5e,
      metalness: 0.85,
      roughness: 0.3,
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x101722,
      metalness: 0.9,
      roughness: 0.25,
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x263244,
      metalness: 0.8,
      roughness: 0.3,
    });

    const canopyMaterial = new THREE.MeshStandardMaterial({
      color: 0x071525,
      metalness: 0.55,
      roughness: 0.15,
    });

    const cyanMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.9,
    });

    const violetMaterial = new THREE.MeshBasicMaterial({
      color: 0x7b5cff,
      transparent: true,
      opacity: 0.8,
    });

    const engineMaterial = new THREE.MeshStandardMaterial({
      color: 0x151f2f,
      metalness: 0.95,
      roughness: 0.2,
    });

    const engineCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const navigationMaterial = new THREE.MeshBasicMaterial({
      color: 0x00eaff,
      transparent: true,
      opacity: 0,
    });

    /* ============================================================
       SHIP GROUP
    ============================================================ */

    const ship = new THREE.Group();

    ship.position.set(0, 0, 0);

    shipGroupRef.current = ship;

    scene.add(ship);

    /* ============================================================
       MAIN FUSELAGE
    ============================================================ */

    const fuselage = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 1.45, 5.5),
      hullMaterial,
    );

    fuselage.position.set(0, 0, 0);

    ship.add(fuselage);

    /* ============================================================
       LOWER BODY
    ============================================================ */

    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.65, 4.8),
      darkMaterial,
    );

    lowerBody.position.set(0, -0.85, 0.15);

    ship.add(lowerBody);

    /* ============================================================
       UPPER BODY
    ============================================================ */

    const upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.05, 3.8),
      panelMaterial,
    );

    upperBody.position.set(0, 1.05, -0.25);

    ship.add(upperBody);

    /* ============================================================
       COCKPIT / CANOPY
    ============================================================ */

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.7, 2.5),
      canopyMaterial,
    );

    canopy.position.set(0, 1.7, -0.55);

    ship.add(canopy);

    /* ============================================================
       CANOPY CENTER SPINE
    ============================================================ */

    const canopySpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.75, 2.6),
      darkMaterial,
    );

    canopySpine.position.set(0, 1.75, -0.55);

    ship.add(canopySpine);

    /* ============================================================
       LEFT WING
    ============================================================ */

    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.28, 2.8),
      hullMaterial,
    );

    leftWing.position.set(-3.35, 0, 0.3);

    leftWing.rotation.z = THREE.MathUtils.degToRad(-7);

    ship.add(leftWing);

    /* ============================================================
       RIGHT WING
    ============================================================ */

    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.28, 2.8),
      hullMaterial,
    );

    rightWing.position.set(3.35, 0, 0.3);

    rightWing.rotation.z = THREE.MathUtils.degToRad(7);

    ship.add(rightWing);

    /* ============================================================
       WING REAR STABILIZERS
    ============================================================ */

    const leftTail = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.22, 1.8),
      darkMaterial,
    );

    leftTail.position.set(-2.6, 0.75, 2.05);

    leftTail.rotation.z = THREE.MathUtils.degToRad(-20);

    ship.add(leftTail);

    const rightTail = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.22, 1.8),
      darkMaterial,
    );

    rightTail.position.set(2.6, 0.75, 2.05);

    rightTail.rotation.z = THREE.MathUtils.degToRad(20);

    ship.add(rightTail);

    /* ============================================================
       REAR ENGINE FRAME
    ============================================================ */

    const rearFrame = new THREE.Mesh(
      new THREE.BoxGeometry(5.1, 1.75, 0.65),
      darkMaterial,
    );

    rearFrame.position.set(0, 0, 2.9);

    ship.add(rearFrame);

    /* ============================================================
       ENGINE BOOSTERS
    ============================================================ */

    const enginePositions = [-1.65, 0, 1.65];

    enginePositions.forEach((x, index) => {
      /* ENGINE HOUSING */

      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 1.15, 1.8),
        engineMaterial,
      );

      housing.position.set(x, -0.05, 3.65);

      ship.add(housing);

      /* ENGINE INNER RING */

      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.18, 24),
        darkMaterial,
      );

      ring.rotation.x = Math.PI / 2;

      ring.position.set(x, -0.05, 4.58);

      ship.add(ring);

      /* ENGINE CORE */

      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.42, 0.25, 24),
        engineCoreMaterial.clone(),
      );

      core.rotation.x = Math.PI / 2;

      core.position.set(x, -0.05, 4.68);

      ship.add(core);

      engineGlowRef.current[index] = core;
    });

    /* ============================================================
       BODY SIDE ARMOR
    ============================================================ */

    const leftArmor = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.9, 3.4),
      darkMaterial,
    );

    leftArmor.position.set(-2.35, 0.15, 0);

    ship.add(leftArmor);

    const rightArmor = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.9, 3.4),
      darkMaterial,
    );

    rightArmor.position.set(2.35, 0.15, 0);

    ship.add(rightArmor);

    /* ============================================================
       CYAN BODY LIGHT STRIPS
    ============================================================ */

    const leftLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 3.2),
      cyanMaterial,
    );

    leftLight.position.set(-2.5, 0.55, 0);

    ship.add(leftLight);

    const rightLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 3.2),
      cyanMaterial,
    );

    rightLight.position.set(2.5, 0.55, 0);

    ship.add(rightLight);

    /* ============================================================
       VIOLET REAR LIGHT STRIPS
    ============================================================ */

    const violetLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 1.7),
      violetMaterial,
    );

    violetLeft.position.set(-1.25, -0.65, 2.4);

    ship.add(violetLeft);

    const violetRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 1.7),
      violetMaterial,
    );

    violetRight.position.set(1.25, -0.65, 2.4);

    ship.add(violetRight);

    /* ============================================================
       NAVIGATION LIGHTS
    ============================================================ */

    const navPositions = [
      [-3.9, 0.2, 1.0],
      [3.9, 0.2, 1.0],
      [-2.8, 0.8, 2.3],
      [2.8, 0.8, 2.3],
    ];

    navPositions.forEach(([x, y, z]) => {
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 12, 12),
        navigationMaterial.clone(),
      );

      light.position.set(x, y, z);

      ship.add(light);

      navigationLightsRef.current.push(light);
    });

    /* ============================================================
       INITIAL POWER STATE
    ============================================================ */

    engineGlowRef.current.forEach((mesh) => {
      const material = mesh.material as THREE.MeshBasicMaterial;

      material.opacity = 0;
    });

    navigationLightsRef.current.forEach((mesh) => {
      const material = mesh.material as THREE.MeshBasicMaterial;

      material.opacity = 0;
    });

    /* ============================================================
       RESIZE
    ============================================================ */

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(mount);

    /* ============================================================
       RENDER LOOP
    ============================================================ */

    let animationFrame = 0;

    const render = () => {
      animationFrame = requestAnimationFrame(render);

      renderer.render(scene, camera);
    };

    render();

    /* ============================================================
       CLEANUP
    ============================================================ */

    return () => {
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      renderer.dispose();

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;

        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((material) => {
            material.dispose();
          });
        }
      });

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
  );
});

Spacecraft3D.displayName = "Spacecraft3D";

export default Spacecraft3D;
