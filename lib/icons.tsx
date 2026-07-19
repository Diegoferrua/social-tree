import {
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiGithub,
  SiX,
  SiDiscord,
  SiSpotify,
  SiThreads,
  SiWhatsapp,
} from "react-icons/si";
// simple-icons ya no incluye el logo de LinkedIn (política de marca),
// así que ese ícono se toma del set de Font Awesome.
import { FaLinkedin } from "react-icons/fa";
import type { IconType } from "react-icons";

// Agregá una entrada acá por cada red que quieras poder usar en config/links.ts.
// La clave (ej. "instagram") es lo que se referencia desde ese archivo.
export const ICONS = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  github: SiGithub,
  x: SiX,
  linkedin: FaLinkedin,
  discord: SiDiscord,
  spotify: SiSpotify,
  threads: SiThreads,
  whatsapp: SiWhatsapp,
} satisfies Record<string, IconType>;

export type IconKey = keyof typeof ICONS;
