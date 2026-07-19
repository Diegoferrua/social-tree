# Social Tree

Página tipo "link in bio" con un árbol de redes sociales en 3D (React Three
Fiber). Pensada para compartir un único link desde Instagram/TikTok/etc.

- Escena 3D con nodos de links, bloom y sparkles, adaptada en 3 niveles
  (mobile / tablet / desktop) según el tamaño de pantalla.
- Si el navegador no soporta WebGL, cae automáticamente a una lista de links
  en HTML plano con el mismo contenido (`components/LinksFallback.tsx`).
- Respeta `prefers-reduced-motion` (desactiva rotación, parallax y bloom).

## Empezar

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Cargar tu contenido

La forma más simple: con `npm run dev` corriendo, abrí
[http://localhost:3000/admin](http://localhost:3000/admin). Es un dashboard
local para editar el perfil y los links desde un form — "Guardar" reescribe
`config/profile.ts` y `config/links.ts` por vos, y también podés subir la
foto de perfil directo (queda en `public/avatar.<ext>`). **Sólo funciona en
local**: en producción (`npm run build && npm start`, o deployado) muestra un
aviso y no permite guardar, a propósito — no hay autenticación, así que no
tendría sentido exponerlo en un sitio público.

También podés editar los archivos a mano si preferís. Todo el contenido vive
en `config/`, no hace falta tocar los componentes:

- **`config/profile.ts`** — nombre, handle, tagline, iniciales y foto de
  perfil (`avatarUrl`; podés subir el archivo a `/public` y apuntar a
  `/foto.jpg`, o usar una URL externa) y el color de acento
  (`themeColor`, se usa también como `theme-color` del navegador en mobile).
- **`config/links.ts`** — un objeto por red social (label, url, color, ícono).
  El layout de la esfera se recalcula solo según cuántos links haya.
- **`lib/icons.tsx`** — mapa de íconos disponibles para usar en
  `config/links.ts`. Si el ícono que necesitás no está, agregalo ahí primero
  (viene de [`react-icons`](https://react-icons.github.io/react-icons/)).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm start        # sirve el build de producción
npm run lint     # eslint
npm test         # suite de Playwright (ver TESTING.md)
```

Ver [`TESTING.md`](./TESTING.md) para el detalle de qué cubren los tests
automatizados, cómo correr Lighthouse, y la checklist manual de dispositivos
antes de dar por cerrado cualquier cambio de contenido o diseño.

## Deploy

El proyecto está listo para deployar tal cual (`npm run build` genera un
build 100% estático). La forma más simple es
[Vercel](https://vercel.com/new), pero cualquier hosting que sirva un build
de Next.js sirve.
