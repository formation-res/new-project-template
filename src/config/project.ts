import localeData from "../../config/locales.json";
import projectData from "../../project.config.json";

export interface LocaleDefinition {
  id: string;
  label: string;
  language: string;
  rtl: boolean;
}

export interface ProjectConfig {
  configured: boolean;
  name: string;
  displayName: string;
  description: string;
  productionUrl: string;
  cloudflarePagesProject: string;
  defaultLocale: string;
  visibility: "private" | "public";
}

const localeDefinitions = localeData as LocaleDefinition[];
const candidate = projectData as ProjectConfig;

if (!/^[a-z0-9][a-z0-9-]*$/.test(candidate.name) || candidate.displayName.trim() === "") {
  throw new Error("Project configuration contains an invalid name");
}
if (!new Set(["private", "public"]).has(candidate.visibility)) {
  throw new Error("Project configuration contains an invalid visibility");
}
if (!localeDefinitions.some(({ id }) => id === candidate.defaultLocale)) {
  throw new Error("The configured default locale is unavailable");
}

export const projectConfig = Object.freeze(candidate);
export const locales = Object.freeze(localeDefinitions);
