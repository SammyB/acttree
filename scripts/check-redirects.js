// Verifies _site/.htaccess against the build:
//   - every redirect points at the canonical host from site.json
//   - every redirect target page exists in _site, and any #anchor exists on that page
//   - every page of the old site (old-website/*.html) is covered by a redirect
//   - no redirect can loop with DirectoryIndex (index.html rules must use THE_REQUEST)
//   - "immutable" caching is only set inside <If> blocks (versioned / hashed assets)
// Exits 1 on any problem.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const canonical = new URL(site.url);
// SITE_DIR lets the check run against a build outside _site (default: _site).
const siteDir = process.env.SITE_DIR || "_site";
const htaccess = readFileSync(join(siteDir, ".htaccess"), "utf8");
const problems = [];

if (/&#?\w+;/.test(htaccess)) problems.push("HTML entities found in .htaccess (template autoescape?)");

const otherHost = canonical.host.startsWith("www.") ? canonical.host.slice(4) : `www.${canonical.host}`;
const hostCond = htaccess.match(/^RewriteCond %\{HTTP_HOST\} \^(\S+)\$ \[NC\]/m)?.[1];
if (hostCond?.replace(/\\\./g, ".") !== otherHost) {
  problems.push(`Canonical host condition is "${hostCond}", expected to match ${otherHost}`);
}

// Parse redirect rules together with the RewriteCond lines directly above them.
const rules = [];
let conds = [];
for (const line of htaccess.split(/\r?\n/)) {
  const cond = line.match(/^RewriteCond\s+(\S+)\s+(\S+)(?:\s+\[([^\]]+)\])?/);
  if (cond) {
    conds.push({ test: cond[1], pattern: cond[2], flags: cond[3] ?? "" });
    continue;
  }
  const rule = line.match(/^RewriteRule\s+(\S+)\s+(https?:\/\/\S+)\s+\[([^\]]+)\]/);
  if (rule) rules.push({ pattern: rule[1], target: rule[2], flags: rule[3], conds });
  if (line.startsWith("RewriteRule")) conds = [];
}

const requestCond = (rule) => rule.conds.find((c) => c.test === "%{THE_REQUEST}");
const toRegExp = (c) => new RegExp(c.pattern, c.flags.includes("NC") ? "i" : "");
const isCanonicalRule = (rule) => rule.target.includes("%{");
const isRequestRule = (rule) => !!requestCond(rule);

for (const rule of rules) {
  const { pattern, target, flags } = rule;

  if (isCanonicalRule(rule)) {
    if (!target.startsWith(`${canonical.origin}%{`)) problems.push(`Canonical rule targets ${target}, expected ${canonical.origin}`);
    continue;
  }

  if (isRequestRule(rule)) {
    // Dynamic target (/%1): check the host, then the pattern against known requests.
    if (!target.startsWith(`${canonical.origin}/`)) problems.push(`${pattern}: target ${target} is not on ${canonical.origin}`);
    const re = toRegExp(requestCond(rule));
    const expect = [
      ["GET /index.html HTTP/1.1", ""],
      ["GET /default.html HTTP/1.1", ""],
      ["GET /services/index.html HTTP/1.1", "services/"],
      ["GET /index.html?utm=1 HTTP/1.1", ""],
      ["GET / HTTP/1.1", null],
      ["GET /services/ HTTP/1.1", null],
      ["GET /?page=index.html HTTP/1.1", null],
    ];
    for (const [request, captured] of expect) {
      const got = request.match(re)?.[1] ?? null;
      if (got !== captured) problems.push(`THE_REQUEST rule: "${request}" gave ${JSON.stringify(got)}, expected ${JSON.stringify(captured)}`);
    }
    continue;
  }

  // A plain rule that matches index.html would redirect DirectoryIndex's internal request: loop.
  if (new RegExp(pattern).test("index.html")) {
    problems.push(`${pattern}: matches index.html without a THE_REQUEST guard – redirect loop with DirectoryIndex`);
  }

  const url = new URL(target);
  if (url.origin !== canonical.origin) {
    problems.push(`${pattern}: target host ${url.origin} does not match site.json url ${canonical.origin}`);
    continue;
  }
  const file = join(siteDir, decodeURIComponent(url.pathname), url.pathname.endsWith("/") ? "index.html" : "");
  if (!existsSync(file)) {
    problems.push(`${pattern}: target ${url.pathname} does not exist in ${siteDir}`);
    continue;
  }
  if (url.hash) {
    if (!flags.includes("NE")) problems.push(`${pattern}: target has #anchor but no NE flag`);
    const id = url.hash.slice(1);
    if (!readFileSync(file, "utf8").includes(`id="${id}"`)) problems.push(`${pattern}: #${id} not found on ${url.pathname}`);
  }
}

if (existsSync("old-website")) {
  const covers = (page) =>
    rules.some((rule) => {
      if (isCanonicalRule(rule)) return false;
      if (isRequestRule(rule)) return toRegExp(requestCond(rule)).test(`GET /${page} HTTP/1.1`);
      return new RegExp(rule.pattern).test(page);
    });
  for (const page of readdirSync("old-website").filter((f) => f.endsWith(".html"))) {
    if (!covers(page)) problems.push(`Old page /${page} has no redirect`);
  }
}

// "immutable" must only apply to versioned CSS/JS and hashed images, which live in <If> blocks.
let inIf = false;
htaccess.split(/\r?\n/).forEach((line, i) => {
  if (/^<If\s/.test(line)) inIf = true;
  if (/^<\/If>/.test(line)) inIf = false;
  if (!line.startsWith("#") && line.includes("immutable") && !inIf) {
    problems.push(`Line ${i + 1}: "immutable" outside an <If> block`);
  }
});

if (problems.length) {
  console.error(`Redirect check failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Redirect check: ${rules.length} rules OK, all targets and anchors exist, all old pages covered, no index.html loop, immutable only on versioned/hashed assets.`);
