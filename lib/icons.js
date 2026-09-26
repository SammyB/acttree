// Inlines Tabler icons (https://tabler.io/icons) so no icon font or sprite is shipped.
// Swap the source folder here if the designer settles on a different set.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const iconRoot = fileURLToPath(new URL("../node_modules/@tabler/icons/icons/", import.meta.url));
const cache = new Map();

// style: "outline" (default) or "filled"
export function icon(name, className = "size-6", style = "outline") {
  const key = `${style}/${name}`;
  if (!cache.has(key)) {
    let svg;
    try {
      svg = readFileSync(`${iconRoot}${key}.svg`, "utf8");
    } catch {
      throw new Error(`Unknown icon "${name}" (looked in @tabler/icons ${style} set)`);
    }
    cache.set(key, svg.replace(/\s+/g, " ").replace(/\s*class="[^"]*"/, "").trim());
  }
  return cache
    .get(key)
    .replace("<svg ", `<svg class="${className}" aria-hidden="true" focusable="false" `);
}
