"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { hasWebGL } from "@/lib/webgl";
import Scene3DErrorBoundary from "./Scene3DErrorBoundary";
import LinksFallback from "./LinksFallback";

const spinner = (
  <div className="fixed inset-0 z-0 flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
  </div>
);

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => spinner,
});

// Este componente sólo se monta en cliente (ver Scene3DLoader), así que leer
// soporte WebGL en el initializer no genera mismatch de hidratación: no hay
// nada renderizado en el servidor con lo que comparar.
export default function SceneOrFallback() {
  const [webglSupported] = useState(() => hasWebGL());

  if (!webglSupported) return <LinksFallback />;

  return (
    <Scene3DErrorBoundary>
      <Scene3D />
    </Scene3DErrorBoundary>
  );
}
