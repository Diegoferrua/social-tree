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
        speed={reduceMotion ? 0 : 1.4}
        rotationIntensity={0}
        floatIntensity={reduceMotion ? 0 : 1.2}
      >
        <mesh>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={link.color}
            emissive={link.color}
            emissiveIntensity={1.1}
            roughness={0.25}
          />
        </mesh>
        <Html center distanceFactor={7} occlude={false}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group flex -translate-y-16 flex-col items-center gap-1 whitespace-nowrap transition-[transform,opacity] duration-300 focus:outline-none"
            style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black"
              style={{ boxShadow: `0 0 24px 3px ${link.color}66` }}
            >
              <Icon />
            </span>
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {link.label}
            </span>
          </a>
        </Html>
      </Float>
    </group>
  );
}
