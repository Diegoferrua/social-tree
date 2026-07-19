"use client";

import dynamic from "next/dynamic";

const spinner = (
  <div className="fixed inset-0 z-0 flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
  </div>
);

// three.js necesita el navegador (WebGL), así que se carga solo en el cliente.
const SceneOrFallback = dynamic(() => import("./SceneOrFallback"), {
  ssr: false,
  loading: () => spinner,
});

export default function Scene3DLoader() {
  return <SceneOrFallback />;
}
