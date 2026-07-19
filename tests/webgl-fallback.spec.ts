import { test, expect } from "@playwright/test";
import { links } from "../config/links";
import { profile } from "../config/profile";

// Simula un navegador sin soporte WebGL anulando getContext antes de que
// cargue cualquier script de la página. Es más confiable cross-browser que
// depender de flags de lanzamiento del navegador.
async function disableWebGL(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = new Proxy(original, {
      apply(target, thisArg, args: [string, ...unknown[]]) {
        const [type] = args;
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return Reflect.apply(target, thisArg, args);
      },
    }) as typeof original;
  });
}

test("sin WebGL, se muestra la lista de links en HTML en vez del árbol 3D", async ({ page }) => {
  await disableWebGL(page);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: profile.name })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Enlaces" })).toBeVisible();

  for (const link of links) {
    const anchor = page.getByRole("link", { name: link.label });
    await expect(anchor).toBeVisible();
    await expect(anchor).toHaveAttribute("href", link.url);
  }

  await expect(page.getByRole("link")).toHaveCount(links.length);
  await expect(page.locator("canvas")).toHaveCount(0);
});
