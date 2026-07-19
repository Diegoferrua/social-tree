"use client";

import { Component, type ReactNode } from "react";
import LinksFallback from "./LinksFallback";

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Si el Canvas 3D falla al construir el contexto WebGL en tiempo de render,
// mostramos la lista de links en HTML en vez de dejar la pantalla rota.
export default class Scene3DErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Scene3D falló al renderizar, se muestra el fallback de links.", error);
  }

  render() {
    if (this.state.hasError) {
      return <LinksFallback />;
    }
    return this.props.children;
  }
}
