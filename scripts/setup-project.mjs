import { readFile, unlink, writeFile } from "node:fs/promises";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { readLocales, readProjectConfig, validateProjectConfig } from "./project-config.mjs";

const root = new URL("../", import.meta.url);
const args = process.argv.slice(2);

function optionsFromArgs(values) {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value?.startsWith("--")) continue;
    const [rawKey, inlineValue] = value.slice(2).split("=", 2);
    const nextValue = inlineValue ?? values[index + 1];
    if (inlineValue === undefined && nextValue && !nextValue.startsWith("--")) index += 1;
    options[rawKey] = nextValue ?? "true";
  }
  return options;
}

const options = optionsFromArgs(args);
const current = await readProjectConfig();
const availableLocales = await readLocales();
const interactive = process.stdin.isTTY && options.yes !== "true";
const prompt = interactive ? createInterface({ input, output }) : null;

const ask = async (question, fallback, key) => {
  if (options[key]) return options[key];
  if (!prompt) return fallback;
  return (await prompt.question(`${question} [${fallback}]: `)).trim() || fallback;
};

const name = (await ask("Package/project slug", current.name, "name")).toLowerCase();
const displayName = await ask("Display name", current.displayName, "display-name");
const description = await ask("Description", current.description, "description");
const productionUrlInput = await ask(
  "Production URL (blank if unknown)",
  current.productionUrl,
  "production-url",
);
const cloudflarePagesProject = await ask(
  "Cloudflare Pages project (blank to disable deploys)",
  current.cloudflarePagesProject,
  "cloudflare-project",
);
const localeInput = await ask(
  "Locales (comma separated)",
  availableLocales.map(({ id }) => id).join(","),
  "locales",
);
const selectedLocaleIds = new Set(localeInput.split(",").map((value) => value.trim()));
const locales = availableLocales.filter(({ id }) => selectedLocaleIds.has(id));
const defaultLocale = await ask("Default locale", current.defaultLocale, "default-locale");
const visibility = await ask("Repository visibility", current.visibility, "visibility");
prompt?.close();

const productionUrl = productionUrlInput
  ? new URL(
      productionUrlInput.includes("://") ? productionUrlInput : `https://${productionUrlInput}`,
    )
      .toString()
      .replace(/\/$/, "")
  : "";

const config = {
  configured: true,
  name,
  displayName,
  description,
  productionUrl,
  cloudflarePagesProject,
  defaultLocale,
  visibility,
};
validateProjectConfig(config, locales);

const writeJson = (path, value) =>
  writeFile(new URL(path, root), `${JSON.stringify(value, null, 2)}\n`);

const packageJson = await readProjectConfigFile("package.json");
const packageLock = await readProjectConfigFile("package-lock.json");
packageJson.name = name;
packageLock.name = name;
if (packageLock.packages?.[""]) packageLock.packages[""].name = name;

await Promise.all([
  writeJson("project.config.json", config),
  writeJson("config/locales.json", locales),
  writeJson("package.json", packageJson),
  writeJson("package-lock.json", packageLock),
]);

const indexPath = new URL("index.html", root);
const indexSource = await readFile(indexPath, "utf8");
await writeFile(
  indexPath,
  indexSource
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(displayName)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    ),
);

const readmePath = new URL("README.md", root);
const readme = await readFile(readmePath, "utf8");
await writeFile(readmePath, readme.replace(/^# .+$/m, `# ${displayName}`));

const retained = new Set(locales.map(({ id }) => id));
for (const locale of availableLocales) {
  if (!retained.has(locale.id)) {
    await unlink(new URL(`public/lang/${locale.id}.ftl`, root)).catch(() => undefined);
  }
}

console.log(`Configured ${displayName} (${name}).`);
console.log("Run npm run check and commit the resulting project configuration.");

async function readProjectConfigFile(path) {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
