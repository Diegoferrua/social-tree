import { test, expect } from "@playwright/test";
import { links } from "../config/links";
import { profile } from "../config/profile";

test.describe("home page", () => {
  test("carga sin errores de consola y muestra el header de perfil", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    await expect(page.getByRole("heading", { name: profile.name })).toBeVisible();
    await expect(page.getByText(profile.handle)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("muestra todos los links de config/links.ts con el href correcto", async ({ page }) => {
    await page.goto("/");

    for (const link of links) {
      const anchor = page.getByRole("link", { name: link.label });
      await expect(anchor).toBeVisible();
      await expect(anchor).toHaveAttribute("href", link.url);
    }

    await expect(page.getByRole("link")).toHaveCount(links.length);
  });
});

test.describe("con prefers-reduced-motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("la página sigue funcional y muestra los mismos links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: profile.name })).toBeVisible();
    await expect(page.getByRole("link")).toHaveCount(links.length);
  });
});
