import { test, expect } from "@playwright/test";

test.describe("Pruebas de Caja Negra (Playwright E2E)", () => {
  test("carga la página principal y verifica elementos clave de la interfaz", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Convivo/i);
    await expect(
      page.getByRole("heading", { name: /Gestión simple/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Iniciar sesión/i }).first(),
    ).toBeVisible();
  });

  test("navega a la página de login y muestra las opciones de acceso", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("button", { name: /Google/i }),
    ).toBeVisible();
  });

  test("pantalla de error de autenticación no expone infraestructura interna", async ({
    page,
  }) => {
    await page.goto("/auth/error?reason=connection_failed");
    await expect(
      page.getByRole("heading", {
        name: /Servicio no disponible temporalmente/i,
      }),
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText("AWS Cognito");
    await expect(
      page.getByRole("button", { name: /Reintentar/i }),
    ).toBeVisible();
  });
});
