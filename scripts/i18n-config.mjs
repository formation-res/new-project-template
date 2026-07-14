import { readFile } from "node:fs/promises";

export const SOURCE_LOCALE = "en-US";

const locales = JSON.parse(
  await readFile(new URL("../config/locales.json", import.meta.url), "utf8"),
);

export const TARGET_LOCALES = locales
  .filter(({ id }) => id !== SOURCE_LOCALE)
  .map(({ id, language }) => ({ id, language }));
