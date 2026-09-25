// Lists content that still needs client sign-off: "review" notes and unconfirmed
// permissions in src/_data, plus "review" notes in page front matter.
// Reports only (exit code 0). Clear the notes before launch.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const findings = [];

function walkData(value, path) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkData(item, `${path}[${item?.slug ?? item?.id ?? item?.name ?? i}]`));
  } else if (value && typeof value === "object") {
    if (Array.isArray(value.review)) value.review.forEach((note) => findings.push([path, note]));
    if (value.permissionConfirmed === false) findings.push([path, "Permission to publish not confirmed"]);
    for (const [key, child] of Object.entries(value)) {
      if (key !== "review") walkData(child, `${path}.${key}`);
    }
  }
}

for (const file of readdirSync("src/_data").filter((f) => f.endsWith(".json"))) {
  walkData(JSON.parse(readFileSync(join("src/_data", file), "utf8")), file.replace(".json", ""));
}

function* templates(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith("_")) yield* templates(path);
    else if (entry.name.endsWith(".njk")) yield path;
  }
}

for (const file of templates("src")) {
  const frontMatter = readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const block = frontMatter.match(/^review:\r?\n((?:\s+-.*\r?\n?)+)/m)?.[1] ?? "";
  for (const line of block.split(/\r?\n/).filter(Boolean)) findings.push([file, line.replace(/^\s*-\s*/, "")]);
}

if (findings.length === 0) {
  console.log("Content review: nothing outstanding.");
} else {
  console.log(`Content review: ${findings.length} item(s) need client sign-off before launch\n`);
  for (const [where, note] of findings) console.log(`  • ${where}\n    ${note}`);
}
