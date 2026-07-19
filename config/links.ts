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
// cuántos links haya, no hace falta tocar ningún otro archivo.
export const links: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/tuusuario",
    icon: "instagram",
    color: "#E1306C",
  },
  {
    id: "tiktok",
    label: "TikTok",
    url: "https://tiktok.com/@tuusuario",
    icon: "tiktok",
    color: "#25F4EE",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@tuusuario",
    icon: "youtube",
    color: "#FF0000",
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/tuusuario",
    icon: "github",
    color: "#f0f6fc",
  },
  {
    id: "x",
    label: "X",
    url: "https://x.com/tuusuario",
    icon: "x",
    color: "#e7e9ea",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/tuusuario",
    icon: "linkedin",
    color: "#0A66C2",
  },
];
