import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

export const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));

export const readProjectConfig = () => readJson("project.config.json");
export const readLocales = () => readJson("config/locales.json");

export function validateProjectConfig(config, locales) {
  const requiredStrings = ["name", "displayName", "description", "defaultLocale", "visibility"];
  for (const key of requiredStrings) {
    if (typeof config[key] !== "string" || config[key].trim() === "") {
      throw new Error(`project.config.json requires a non-empty ${key}`);
    }
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(config.name)) {
    throw new Error("Project name must use lowercase letters, numbers, and hyphens");
  }
  if ([config.displayName, config.description].some((value) => /[\r\n]/.test(value))) {
    throw new Error("Display name and description must each fit on one line");
  }
  if (!Array.isArray(locales) || locales.length === 0) {
    throw new Error("config/locales.json must include at least one locale");
  }
  if (!locales.some(({ id }) => id === "en-US")) {
    throw new Error("English (en-US) must remain available as the translation source");
  }
  if (!locales.some(({ id }) => id === config.defaultLocale)) {
    throw new Error("The default locale must be present in config/locales.json");
  }
  if (!new Set(["private", "public"]).has(config.visibility)) {
    throw new Error("Visibility must be private or public");
  }
  if (config.productionUrl) {
    const url = new URL(config.productionUrl);
    if (url.protocol !== "https:") {
      throw new Error("Production URL must use HTTPS");
    }
  }
}
