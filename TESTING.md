# Testing

Este proyecto no tiene backend ni formularios: la superficie a probar es
"¿carga bien y se ve bien en cualquier dispositivo/navegador que alguien
traiga desde un bio de Instagram/TikTok?". Por eso el enfoque combina specs
automatizados (Playwright) para lo funcional, y una checklist manual para lo
que sólo se puede juzgar a ojo (o en hardware real).

## Automatizado

```bash
npm test        # corre todos los specs contra un build de producción
npm run test:ui # modo interactivo de Playwright
```

`playwright.config.ts` levanta el proyecto con `next build && next start`
(no `next dev`): el overlay de Next.js Dev Tools introduce reflows que hacen
flaky el conteo de nodos del árbol 3D, así que los tests corren contra lo
mismo que se despliega.

Proyectos configurados (`playwright.config.ts`):

| Proyecto            | Qué simula                              |
| -------------------- | ---------------------------------------- |
| `mobile-chromium`    | Mobile chico (iPhone SE, 375px)          |
| `mobile-webkit`      | Motor de Safari/iOS (iPhone 12)          |
| `tablet-chromium`    | iPad Mini apaisado                       |
| `desktop-chromium`   | Desktop 1440×900                         |
| `desktop-firefox`    | Firefox desktop 1440×900                 |
| `desktop-ultrawide`  | Desktop 1920×1080                        |

Specs:

- `tests/homepage.spec.ts` — la página carga sin errores de consola, se ve el
  nombre/handle de `config/profile.ts`, están todos los links de
  `config/links.ts` con el `href` correcto, y todo sigue funcionando con
  `prefers-reduced-motion: reduce`.
- `tests/webgl-fallback.spec.ts` — con WebGL deshabilitado (se anula
  `HTMLCanvasElement.prototype.getContext` antes de que cargue la página), se
  muestra la lista de links en HTML plano (`LinksFallback`) en vez del árbol
  3D, con los mismos links/hrefs.

**Limitación conocida**: esto cubre "no hay WebGL desde el arranque". No
cubre pérdida de contexto WebGL a mitad de sesión (evento
`webglcontextlost`, típico de algunos drivers Android) — quedaría para un
listener aparte si se vuelve un problema real.

## Lighthouse (manual)

No hay CI en el repo, así que en vez de un gate automático, corré Lighthouse
a mano contra el build de producción cuando quieras chequear
performance/accesibilidad/SEO:

```bash
npm run build && npm start        # en una terminal
npx lighthouse http://localhost:3000 --view   # en otra
```

Un árbol 3D con bloom es pesado por naturaleza — no esperes 95+ en
Performance mobile; priorizá que Accessibility y SEO estén altos (deberían
rondar 90+) y que Performance no sea dramáticamente peor que en desktop.

## Dashboard de edición (`/admin`)

Es una herramienta interna de un solo usuario, sólo funciona con
`NODE_ENV !== "production"` — por eso no está en la suite de Playwright (que
corre a propósito contra un build de producción). Si tocás
`app/admin/`, `components/admin/AdminForm.tsx`, `app/api/admin/*` o
`lib/admin/*`, verificá a mano:

- [ ] Con `npm run dev`, `/admin` muestra los valores actuales de
      `config/profile.ts` y `config/links.ts`.
- [ ] Editar un campo y "Guardar" reescribe ambos archivos correctamente
      (formato/comentarios se mantienen) y `/` refleja el cambio solo (Fast
      Refresh), sin reiniciar el servidor.
- [ ] Subir una foto de perfil crea `public/avatar.<ext>` y completa el
      campo `avatarUrl`.
- [ ] Guardar con un campo inválido (URL sin `https://`, color sin `#`)
      muestra el error y **no** toca los archivos.
- [ ] Guardrail de producción: `npm run build && npm start`, `/admin`
      muestra el aviso de "no disponible" y
      `curl -X POST localhost:3000/api/admin/save` devuelve `403` sin
      modificar `config/profile.ts`.

## Checklist manual de dispositivos

Antes de dar el proyecto por cerrado (y de nuevo cada vez que cambies
`config/profile.ts` o `config/links.ts` con contenido real), probá a mano:

- [ ] **iPhone real o simulador Safari** (~375px) — el árbol se ve completo,
      sin overlap con el header, sin scroll horizontal.
- [ ] **Android gama media, Chrome** — mismo chequeo; prestá atención a FPS
      del scene 3D (debería sentirse fluido, no trabado).
- [ ] **iPad, retrato y apaisado** — el layout tablet no se ve ni muy chico
      ni muy vacío.
- [ ] **Desktop 1440p y un monitor ultrawide** — la esfera de links no queda
      diminuta ni cortada en los bordes.
- [ ] **`prefers-reduced-motion` activado** (ajuste del SO) — no hay
      rotación ni parallax de cámara, pero los links siguen siendo
      clickeables.
- [ ] **WebGL desactivado** — Chrome: `chrome://flags` → busca "WebGL" y
      deshabilitalo; Firefox: `about:config` → `webgl.disabled = true`. Debe
      aparecer la lista de links en HTML, no una pantalla rota o vacía.
- [ ] **Navegación completa por teclado** — con `Tab` se puede llegar a cada
      link (mirá el anillo de foco) y `Enter` lo abre.
- [ ] **Lector de pantalla** (VoiceOver/TalkBack) — cada link anuncia su
      nombre (ej. "Instagram, link").
