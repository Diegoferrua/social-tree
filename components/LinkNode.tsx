import { useEffect, useRef, useState } from "react";
import { Float, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { ICONS } from "@/lib/icons";
import type { SocialLink } from "@/config/links";

type Props = {
  link: SocialLink;
  position: [number, number, number];
  index: number;
  reduceMotion: boolean;
};

export default function LinkNode({ link, position, index, reduceMotion }: Props) {
  const Icon = ICONS[link.icon];
  const [visible, setVisible] = useState(false);
  const group = useRef<Group>(null);
  const scale = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250 + index * 90);
    return () => clearTimeout(t);
  }, [index]);

  useFrame((_, delta) => {
    const target = visible ? 1 : 0;
    scale.current += (target - scale.current) * Math.min(1, delta * 6);
    group.current?.scale.setScalar(scale.current);
  });

  return (
    <group position={position} ref={group} scale={0}>
      <Float
        speed={reduceMotion ? 0 : 2}
        rotationIntensity={0}
        floatIntensity={reduceMotion ? 0 : 1.5}
      >
        <mesh>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color={link.color}
            emissive={link.color}
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
        <Html center distanceFactor={8.5} occlude={false}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group flex -translate-y-18 flex-col items-center gap-1.5 whitespace-nowrap transition-[transform,opacity] duration-300 focus:outline-none"
            style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:border-white/50 group-focus-visible:scale-115 group-focus-visible:ring-2 group-focus-visible:ring-white/80 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black sm:h-16 sm:w-16 sm:text-3xl"
              style={{ boxShadow: `0 0 28px 4px ${link.color}88` }}
            >
              <Icon />
            </span>
            <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white/90 opacity-90 shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-focus-visible:opacity-100">
              {link.label}
            </span>
          </a>
        </Html>
      </Float>
    </group>
  );
}
