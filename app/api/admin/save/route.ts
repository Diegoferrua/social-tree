import { promises as fs } from "fs";
import path from "path";
import { ICONS, type IconKey } from "@/lib/icons";
import { serializeLinks, serializeProfile } from "@/lib/admin/serialize";
import { isValidHexColor, isValidUrl } from "@/lib/admin/validate";

export const runtime = "nodejs";

type IncomingProfile = {
  name: string;
  handle: string;
  tagline: string;
  initials: string;
  avatarUrl: string;
  themeColor: string;
};

type IncomingLink = {
  id: string;
  label: string;
  url: string;
  icon: IconKey;
  color: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateProfile(value: unknown): value is IncomingProfile {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    isNonEmptyString(p.name) &&
    isNonEmptyString(p.handle) &&
    typeof p.tagline === "string" &&
    isNonEmptyString(p.initials) &&
    typeof p.avatarUrl === "string" &&
    (p.avatarUrl === "" || isValidUrl(p.avatarUrl) || p.avatarUrl.startsWith("/")) &&
    isNonEmptyString(p.themeColor) &&
    isValidHexColor(p.themeColor)
  );
}

function validateLinks(value: unknown): value is IncomingLink[] {
  if (!Array.isArray(value)) return false;
  const iconKeys = new Set(Object.keys(ICONS));
  return value.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const l = item as Record<string, unknown>;
    return (
      isNonEmptyString(l.id) &&
      isNonEmptyString(l.label) &&
      isNonEmptyString(l.url) &&
      isValidUrl(l.url) &&
      isNonEmptyString(l.icon) &&
      iconKeys.has(l.icon) &&
      isNonEmptyString(l.color) &&
      isValidHexColor(l.color)
    );
  });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "No disponible en producción" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { profile, links } = (body ?? {}) as { profile?: unknown; links?: unknown };

  if (!validateProfile(profile)) {
    return Response.json({ error: "Datos de perfil inválidos" }, { status: 400 });
  }
  if (!validateLinks(links)) {
    return Response.json({ error: "Datos de links inválidos" }, { status: 400 });
  }

  try {
    await fs.writeFile(path.join(process.cwd(), "config/profile.ts"), serializeProfile(profile));
    await fs.writeFile(path.join(process.cwd(), "config/links.ts"), serializeLinks(links));
  } catch (error) {
    console.error("No se pudo escribir la configuración", error);
    return Response.json({ error: "No se pudo escribir en disco" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
