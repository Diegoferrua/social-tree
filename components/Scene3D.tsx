"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Torus } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { links } from "@/config/links";
import { profile } from "@/config/profile";
import LinkNode from "./LinkNode";

function fibonacciSphere(index: number, total: number, radius: number): [number, number, number] {
  const offset = 2 / total;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = index * increment;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  return [x * radius, y * radius * 0.55, z * radius];
}

function CameraRig({ enabled }: { enabled: boolean }) {
  useFrame((state) => {
    if (!enabled) return;
    const { pointer, camera } = state;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.8, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 1.2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function OrbitGroup({
  reduceMotion,
  radius,
}: {
  reduceMotion: boolean;
  radius: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reduceMotion || !group.current) return;
    group.current.rotation.y += delta * 0.14;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  const positions = useMemo(
    () => links.map((_, i) => fibonacciSphere(i, links.length, radius)),
    [radius]
  );

  return (
    <group ref={group}>
      <Torus args={[1.5, 0.015, 16, 100]} rotation={[Math.PI / 2.3, 0, 0]}>
        <meshBasicMaterial color={profile.themeColor} transparent opacity={0.4} />
      </Torus>
      {links.map((link, i) => (
        <LinkNode
          key={link.id}
          link={link}
          position={positions[i]}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </group>
  );
}

type Tier = "mobile" | "tablet" | "desktop";

function getTier(width: number): Tier {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

const TIER_SETTINGS: Record<
  Tier,
  { radius: number; cameraZ: number; maxDpr: number; sparkles: number; bloom: boolean }
> = {
  mobile: { radius: 2.6, cameraZ: 9.4, maxDpr: 1.5, sparkles: 70, bloom: false },
  tablet: { radius: 3.1, cameraZ: 8.6, maxDpr: 2, sparkles: 120, bloom: true },
  desktop: { radius: 3.5, cameraZ: 7.8, maxDpr: 2, sparkles: 180, bloom: true },
};

export default function Scene3D() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [tier, setTier] = useState<Tier>(() => getTier(window.innerWidth));

  useEffect(() => {
    const check = () => setTier(getTier(window.innerWidth));
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { radius, cameraZ, maxDpr, sparkles, bloom } = TIER_SETTINGS[tier];

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, maxDpr]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={50} color={profile.themeColor} />
        <Sparkles
          count={sparkles}
          scale={14}
          size={2.4}
          speed={0.5}
          opacity={0.7}
          color={profile.themeColor}
        />
        <CameraRig enabled={!prefersReducedMotion} />
        <OrbitGroup reduceMotion={prefersReducedMotion} radius={radius} />
        {!prefersReducedMotion && bloom && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.4} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
