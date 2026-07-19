import type { IconKey } from "@/lib/icons";

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  /** Clave definida en lib/icons.tsx */
  icon: IconKey;
  /** Color hex usado para el brillo del nodo en la escena 3D */
  color: string;
};

// Esta es la lista de redes que se muestra en el árbol 3D.
// Para agregar una red: sumá un objeto al array (y si el ícono no está
// en lib/icons.tsx, agregalo ahí primero).
// Para quitar una: borrá su objeto. El layout se recalcula solo según
// cuántos links haya.
export const links: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/diegoferrua/",
    icon: "instagram",
    color: "#E1306C",
  },
  {
    id: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/@diego.ferrua",
    icon: "tiktok",
    color: "#25F4EE",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/@diegoferrua742",
    icon: "youtube",
    color: "#FF0000",
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/Diegoferrua/",
    icon: "github",
    color: "#f0f6fc",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/diegoferrua/",
    icon: "linkedin",
    color: "#0A66C2",
  },
  {
    id: "x",
    label: "X",
    url: "https://x.com/tuusuario",
    icon: "x",
    color: "#e7e9ea",
  }
];
