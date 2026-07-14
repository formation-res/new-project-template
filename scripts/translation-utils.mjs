import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { FluentBundle, FluentResource } from "@fluent/bundle";

export const LANG_DIR = new URL("../public/lang/", import.meta.url);
export const HASH_PATTERN = /^# source-hash: ([a-f0-9]{64})$/m;

export const sourceHash = (source) => createHash("sha256").update(source).digest("hex");

export const messageIds = (source) =>
  new Set([...source.matchAll(/^([a-zA-Z][\w-]*)\s*=/gm)].map((match) => match[1]));

export function validateCatalog(locale, source, expectedIds) {
  const bundle = new FluentBundle(locale);
  const errors = bundle.addResource(new FluentResource(source));
  if (errors.length > 0) {
    throw new Error(`${locale} contains invalid Fluent syntax: ${errors.join(", ")}`);
  }

  const actualIds = messageIds(source);
  const missing = [...expectedIds].filter((id) => !actualIds.has(id));
  const unexpected = [...actualIds].filter((id) => !expectedIds.has(id));
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `${locale} key mismatch. Missing: ${missing.join(", ") || "none"}. Unexpected: ${unexpected.join(", ") || "none"}.`,
    );
  }
}

export async function readCatalog(locale) {
  return readFile(new URL(`${locale}.ftl`, LANG_DIR), "utf8");
}
