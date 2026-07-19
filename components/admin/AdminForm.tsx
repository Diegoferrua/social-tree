"use client";

import { useState } from "react";
import type { IconKey } from "@/lib/icons";
import type { SocialLink } from "@/config/links";
import { isValidHexColor, isValidUrl, slugify } from "@/lib/admin/validate";

type ProfileData = {
  name: string;
  handle: string;
  tagline: string;
  initials: string;
  avatarUrl: string;
  themeColor: string;
};

type Props = {
  initialProfile: ProfileData;
  initialLinks: SocialLink[];
  iconKeys: IconKey[];
};

type Status = "idle" | "saving" | "saved" | "error";

function fieldClass() {
  return "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";
}

export default function AdminForm({ initialProfile, initialLinks, iconKeys }: Props) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function updateProfile<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function updateLink<K extends keyof SocialLink>(index: number, key: K, value: SocialLink[K]) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value } : l)));
  }

  function addLink() {
    const existingIds = new Set(links.map((l) => l.id));
    let id = slugify("nuevo-link");
    let n = 2;
    while (existingIds.has(id)) {
      id = `${slugify("nuevo-link")}-${n++}`;
    }
    setLinks((prev) => [
      ...prev,
      { id, label: "", url: "", icon: iconKeys[0], color: "#ffffff" },
    ]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveLink(index: number, direction: -1 | 1) {
    setLinks((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function validate(): string | null {
    if (!profile.name.trim()) return "El nombre no puede estar vacío.";
    if (!profile.handle.trim()) return "El handle no puede estar vacío.";
    if (!profile.initials.trim()) return "Las iniciales no pueden estar vacías.";
    if (!isValidHexColor(profile.themeColor)) return "El color de acento no es un hex válido.";
    if (links.length === 0) return "Agregá al menos un link.";
    for (const link of links) {
      if (!link.label.trim()) return "Hay un link sin nombre.";
      if (!isValidUrl(link.url)) return `La URL de "${link.label || link.id}" no es válida.`;
      if (!isValidHexColor(link.color)) return `El color de "${link.label || link.id}" no es un hex válido.`;
    }
    return null;
  }

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen");
      updateProfile("avatarUrl", data.avatarUrl);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    setStatus("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, links }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar");
      setStatus("saved");
      setMessage("Guardado. La página principal ya debería reflejar los cambios.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Editar Social Tree</h1>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 underline">
          Ver sitio
        </a>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">Perfil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Nombre
            <input className={fieldClass()} value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Handle
            <input className={fieldClass()} value={profile.handle} onChange={(e) => updateProfile("handle", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-white/70 sm:col-span-2">
            Tagline
            <input className={fieldClass()} value={profile.tagline} onChange={(e) => updateProfile("tagline", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Iniciales
            <input className={fieldClass()} value={profile.initials} onChange={(e) => updateProfile("initials", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-white/70">
            Color de acento
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-9 shrink-0 cursor-pointer rounded border border-white/15 bg-transparent"
                value={/^#([0-9a-f]{6})$/i.test(profile.themeColor) ? profile.themeColor : "#8b5cf6"}
                onChange={(e) => updateProfile("themeColor", e.target.value)}
              />
              <input className={fieldClass()} value={profile.themeColor} onChange={(e) => updateProfile("themeColor", e.target.value)} />
            </div>
          </label>
          <label className="flex flex-col gap-1 text-sm text-white/70 sm:col-span-2">
            Foto de perfil (URL, o subí un archivo)
            <input className={fieldClass()} value={profile.avatarUrl} onChange={(e) => updateProfile("avatarUrl", e.target.value)} placeholder="/avatar.jpg" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleAvatarUpload(file);
              }}
              className="mt-1 text-xs text-white/50"
            />
            {uploading && <span className="text-xs text-white/50">Subiendo…</span>}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">Links</h2>
        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <div key={link.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Nombre
                  <input className={fieldClass()} value={link.label} onChange={(e) => updateLink(index, "label", e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  URL
                  <input className={fieldClass()} value={link.url} onChange={(e) => updateLink(index, "url", e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Ícono
                  <select
                    className={fieldClass()}
                    value={link.icon}
                    onChange={(e) => updateLink(index, "icon", e.target.value as IconKey)}
                  >
                    {iconKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-white/60">
                  Color
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-9 w-9 shrink-0 cursor-pointer rounded border border-white/15 bg-transparent"
                      value={/^#([0-9a-f]{6})$/i.test(link.color) ? link.color : "#ffffff"}
                      onChange={(e) => updateLink(index, "color", e.target.value)}
                    />
                    <input className={fieldClass()} value={link.color} onChange={(e) => updateLink(index, "color", e.target.value)} />
                  </div>
                </label>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <button type="button" onClick={() => moveLink(index, -1)} disabled={index === 0} className="text-white/60 hover:text-white disabled:opacity-30">
                  ↑ Subir
                </button>
                <button type="button" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1} className="text-white/60 hover:text-white disabled:opacity-30">
                  ↓ Bajar
                </button>
                <button type="button" onClick={() => removeLink(index)} className="ml-auto text-red-400 hover:text-red-300">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLink}
          className="mt-4 w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-white/60 hover:border-white/40 hover:text-white"
        >
          + Agregar link
        </button>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {status === "saving" ? "Guardando…" : "Guardar"}
        </button>
        {message && (
          <span className={`text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>{message}</span>
        )}
      </div>
    </div>
  );
}
