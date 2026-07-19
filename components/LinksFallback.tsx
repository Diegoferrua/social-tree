import { links } from "@/config/links";
import { ICONS } from "@/lib/icons";

// Se muestra en vez del árbol 3D cuando el navegador no soporta WebGL.
export default function LinksFallback() {
  return (
    <nav
      aria-label="Enlaces"
      className="relative z-10 flex min-h-screen flex-col items-center justify-end gap-3 px-6 pb-16 pt-[58vh] sm:gap-4 sm:pt-[52vh]"
    >
      {links.map((link) => {
        const Icon = ICONS[link.icon];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full max-w-xs items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white backdrop-blur-md transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            style={{ boxShadow: `0 0 24px 2px ${link.color}33` }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
              style={{ backgroundColor: `${link.color}22`, color: link.color }}
            >
              <Icon />
            </span>
            <span className="text-sm font-medium">{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
