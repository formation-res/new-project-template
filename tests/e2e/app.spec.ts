import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders an accessible responsive application shell", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "New Project Template" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Language" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const accessibility = await new AxeBuilder({ page }).analyze();
  const seriousViolations = accessibility.violations.filter(({ impact }) =>
    impact ? ["serious", "critical"].includes(impact) : false,
  );
  expect(seriousViolations).toEqual([]);
});

test("persists dark mode and supports an RTL locale", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The mobile project covers the combined small-screen state");

  await page.getByRole("checkbox", { name: "Toggle theme" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "qr-dark");

  await page.getByRole("combobox", { name: "Language" }).selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "qr-dark");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("serves build identity metadata", async ({ request }) => {
  const response = await request.get("/version.json");
  expect(response.ok()).toBeTruthy();
  const version = await response.json();
  expect(version).toEqual(
    expect.objectContaining({
      version: expect.any(String),
      commit: expect.any(String),
      builtAt: expect.any(String),
      environment: expect.any(String),
    }),
  );
});
