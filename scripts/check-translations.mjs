import { SOURCE_LOCALE, TARGET_LOCALES } from "./i18n-config.mjs";
import {
  HASH_PATTERN,
  messageIds,
  readCatalog,
  sourceHash,
  validateCatalog,
} from "./translation-utils.mjs";

const source = await readCatalog(SOURCE_LOCALE);
const expectedIds = messageIds(source);
const expectedHash = sourceHash(source);
const stale = [];

validateCatalog(SOURCE_LOCALE, source, expectedIds);

for (const { id } of TARGET_LOCALES) {
  const catalog = await readCatalog(id);
  validateCatalog(id, catalog, expectedIds);
  if (catalog.match(HASH_PATTERN)?.[1] !== expectedHash) stale.push(id);
}

if (stale.length > 0) {
  console.warn(
    `Translation content is valid but stale for: ${stale.join(", ")}. Run npm run translations:sync.`,
  );
}

console.log(`Validated ${TARGET_LOCALES.length + 1} Fluent catalogs.`);
