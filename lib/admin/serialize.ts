import type { SocialLink } from "@/config/links";

type ProfileData = {
  name: string;
  handle: string;
  tagline: string;
  initials: string;
  avatarUrl: string;
  themeColor: string;
};

// Regenera config/profile.ts entero. Se prioriza simplicidad sobre editar el
// AST (ts-morph, etc.): son dos archivos chicos de forma fija, no vale la
// pena la dependencia extra para este uso interno.
export function serializeProfile(profile: ProfileData): string {
  return `// Datos de tu perfil. Editá estos valores con los tuyos.
export const profile = {
  name: ${JSON.stringify(profile.name)},
  handle: ${JSON.stringify(profile.handle)},
  tagline: ${JSON.stringify(profile.tagline)},
  // Iniciales que se muestran si no cargás una foto (avatarUrl vacío).
  initials: ${JSON.stringify(profile.initials)},
  // Poné acá una URL de imagen (podés subir el archivo a /public y usar "/foto.jpg").
  avatarUrl: ${JSON.stringify(profile.avatarUrl)},
  // Color de acento usado en el brillo del avatar y del anillo 3D.
  themeColor: ${JSON.stringify(profile.themeColor)},
};
`;
}

export function serializeLinks(links: SocialLink[]): string {
  const items = links
    .map(
      (link) => `  {
    id: ${JSON.stringify(link.id)},
    label: ${JSON.stringify(link.label)},
    url: ${JSON.stringify(link.url)},
    icon: ${JSON.stringify(link.icon)},
    color: ${JSON.stringify(link.color)},
  }`
    )
    .join(",\n");

  return `import type { IconKey } from "@/lib/icons";

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
${items}
];
`;
}
