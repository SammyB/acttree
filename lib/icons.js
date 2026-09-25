// Inlines Tabler outline icons (https://tabler.io/icons) so no icon font or sprite is shipped.
// Swap the source folder here if the designer settles on a different set.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const iconDir = fileURLToPath(new URL("../node_modules/@tabler/icons/icons/outline/", import.meta.url));
const cache = new Map();

export function icon(name, className = "size-6") {
  if (!cache.has(name)) {
    let svg;
    try {
      svg = readFileSync(`${iconDir}${name}.svg`, "utf8");
    } catch {
      throw new Error(`Unknown icon "${name}" (looked in @tabler/icons outline set)`);
    }
    cache.set(name, svg.replace(/\s+/g, " ").replace(/\s*class="[^"]*"/, "").trim());
  }
  return cache
    .get(name)
    .replace("<svg ", `<svg class="${className}" aria-hidden="true" focusable="false" `);
}
