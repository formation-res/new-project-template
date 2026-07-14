import { readFile } from "node:fs/promises";
import { readLocales, readProjectConfig, validateProjectConfig } from "./project-config.mjs";

const config = await readProjectConfig();
const locales = await readLocales();
validateProjectConfig(config, locales);

if (config.configured) {
  const files = ["package.json", "package-lock.json", "index.html"];
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    if (source.includes("new-project-template") || source.includes("New Project Template")) {
      throw new Error(`${file} still contains an unresolved template name`);
    }
  }
  const readmeHeading = (await readFile(new URL("../README.md", import.meta.url), "utf8")).split(
    "\n",
    1,
  )[0];
  if (readmeHeading === "# New Project Template") {
    throw new Error("README.md still contains the template heading");
  }
}

console.log(
  config.configured
    ? `Project setup is complete for ${config.displayName}.`
    : "Template configuration is valid; run npm run setup in a generated project.",
);
