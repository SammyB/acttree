// Verifies _site/.htaccess against the build:
//   - every redirect points at the canonical host from site.json
//   - every redirect target page exists in _site, and any #anchor exists on that page
//   - every page of the old site (old-website/*.html) is covered by a redirect
// Exits 1 on any problem.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const canonical = new URL(site.url);
const htaccess = readFileSync("_site/.htaccess", "utf8");
const problems = [];

const rules = [...htaccess.matchAll(/^RewriteRule\s+(\S+)\s+(https?:\/\/\S+)\s+\[([^\]]+)\]/gm)].map(
  ([, pattern, target, flags]) => ({ pattern, target, flags }),
);

for (const { pattern, target, flags } of rules) {
  if (target.includes("%{")) {
    // The HTTPS / canonical-host rule.
    if (!target.startsWith(`${canonical.origin}%{`)) problems.push(`Canonical rule targets ${target}, expected ${canonical.origin}`);
    continue;
  }
  const url = new URL(target);
  if (url.origin !== canonical.origin) {
    problems.push(`${pattern}: target host ${url.origin} does not match site.json url ${canonical.origin}`);
    continue;
  }
  const file = join("_site", decodeURIComponent(url.pathname), url.pathname.endsWith("/") ? "index.html" : "");
  if (!existsSync(file)) {
    problems.push(`${pattern}: target ${url.pathname} does not exist in _site`);
    continue;
  }
  if (url.hash) {
    if (!flags.includes("NE")) problems.push(`${pattern}: target has #anchor but no NE flag`);
    const id = url.hash.slice(1);
    if (!readFileSync(file, "utf8").includes(`id="${id}"`)) problems.push(`${pattern}: #${id} not found on ${url.pathname}`);
  }
}

if (existsSync("old-website")) {
  const redirectPatterns = rules.filter((r) => !r.target.includes("%{")).map((r) => new RegExp(r.pattern));
  for (const page of readdirSync("old-website").filter((f) => f.endsWith(".html"))) {
    if (!redirectPatterns.some((re) => re.test(page))) problems.push(`Old page /${page} has no redirect`);
  }
}

if (problems.length) {
  console.error(`Redirect check failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Redirect check: ${rules.length} rules OK, all targets and anchors exist, all old pages covered.`);
