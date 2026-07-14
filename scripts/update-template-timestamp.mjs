import { readFile, writeFile } from "node:fs/promises";

const targets = [
  {
    path: "README.md",
    pattern: /(\*\*Template last updated:\*\* `)([^`]+)(`)/,
  },
  {
    path: "MAINTAINERS.md",
    pattern: /(Last updated: )([^\n]+)(\n)/,
  },
  {
    path: "docs/START-A-PROJECT.md",
    pattern: /(Last updated: )([^\n]+)(\n)/,
  },
  {
    path: "docs/SHARED-INFRASTRUCTURE.md",
    pattern: /(Last updated: )([^\n]+)(\n)/,
  },
  {
    path: "src/templateMetadata.ts",
    pattern: /(TEMPLATE_LAST_UPDATED = ")([^"]+)(";)/,
  },
];

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const suppliedTimestamp = args.find((argument) => !argument.startsWith("--"));

const normalizeTimestamp = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  return parsed.toISOString();
};

if (checkOnly) {
  const timestamps = [];

  for (const target of targets) {
    const source = await readFile(target.path, "utf8");
    const match = source.match(target.pattern);
    if (!match) {
      throw new Error(`Timestamp marker not found in ${target.path}`);
    }
    timestamps.push(normalizeTimestamp(match[2]));
  }

  if (new Set(timestamps).size !== 1) {
    throw new Error("Template timestamps are not synchronized");
  }

  console.log(`Template timestamp is synchronized: ${timestamps[0]}`);
  process.exit(0);
}

const timestamp = normalizeTimestamp(suppliedTimestamp ?? new Date().toISOString());

for (const target of targets) {
  const source = await readFile(target.path, "utf8");
  if (!target.pattern.test(source)) {
    throw new Error(`Timestamp marker not found in ${target.path}`);
  }
  await writeFile(
    target.path,
    source.replace(
      target.pattern,
      (_match, prefix, _current, suffix = "") => `${prefix}${timestamp}${suffix}`,
    ),
  );
}

console.log(`Updated template timestamp: ${timestamp}`);
