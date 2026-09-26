// `npm run test:apache` – runs the built _site/ in a real Apache 2.4 (Docker) and checks the
// .htaccess behaviour with raw HTTP requests (no redirect following, like `curl -I`):
//   redirects (one hop, no loops), old-URL map, blocked files, 404 page, Cache-Control.
// Needs Docker running. Run `npm run build` first (the npm script does this for you).
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const IMAGE = "acttree-apache-test";
const CONTAINER = "acttree-apache-test";
const PORTS = { http: 18080, https: 18443 };

const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const canonical = new URL(site.url);
const host = canonical.host;
const otherHost = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
const origin = canonical.origin;

// Expected old-site redirects, written out independently of .htaccess (project brief §6).
const OLD_URLS = {
  "/index.html": "/",
  "/default.html": "/",
  "/about.html": "/why-act-tree-felling/",
  "/testimonials.html": "/why-act-tree-felling/#reviews",
  "/services.html": "/services/",
  "/tree-removal.html": "/services/tree-removal/",
  "/tree-pruning.html": "/services/tree-pruning/",
  "/stump-grinding.html": "/services/stump-grinding/",
  "/powerline-clearance.html": "/services/powerline-clearance/",
  "/cable-and-bracing.html": "/services/cabling-and-bracing/",
  "/commercial-works.html": "/services/commercial-tree-services/",
  "/tree-consultation.html": "/services/arborist-consultation/",
  "/tree-consul-health.html": "/services/arborist-consultation/#health-and-condition",
  "/tree-consul-risk.html": "/services/arborist-consultation/#tree-risk-assessment",
  "/tree-consul-management.html": "/services/arborist-consultation/#tree-management-plans",
  "/tree-consul-root.html": "/services/arborist-consultation/#tree-root-damage",
  "/tree-consul-disease.html": "/services/arborist-consultation/#disease-identification",
  "/tree-consul-elm-leaf.html": "/services/arborist-consultation/#elm-leaf-beetle",
  "/faq.html": "/resources/faq/",
  "/careers.html": "/careers/",
  "/contact.html": "/contact/",
  "/survey.html": "/",
  "/sitemap.html": "/sitemap.xml",
};
const TEMPORARY = { "/mulch-orders.html": "/contact/" }; // 302 until the client confirms mulch

const IMMUTABLE = "public, max-age=31536000, immutable";
const ONE_WEEK = "public, max-age=604800";

// ---------------------------------------------------------------------------

const docker = (...args) => execFileSync("docker", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

function request(url, { redirects = false } = {}) {
  const u = new URL(url);
  const lib = u.protocol === "https:" ? https : http;
  const port = u.protocol === "https:" ? PORTS.https : PORTS.http;
  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        host: "127.0.0.1",
        port,
        path: u.pathname + u.search,
        method: "GET",
        headers: { Host: u.host },
        servername: u.hostname,
        rejectUnauthorized: false, // self-signed test certificate
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

// Follows redirects (up to 5) and returns every hop, so loops and extra hops are visible.
async function trace(url) {
  const hops = [];
  let current = url;
  for (let i = 0; i < 5; i++) {
    const res = await request(current);
    hops.push({ url: current, status: res.status, location: res.headers.location, res });
    if (![301, 302, 307, 308].includes(res.status)) break;
    current = new URL(res.headers.location, current).href.replace(/#.*$/, "");
  }
  return hops;
}

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
}

async function expectRedirect(from, to, status = 301) {
  const hops = await trace(from);
  const [first, second] = hops;
  const oneHop = hops.length === 2 && second.status === 200;
  const ok = first.status === status && first.location === to && oneHop;
  const detail = hops.map((h) => `${h.status}${h.location ? ` → ${h.location}` : ""}`).join(" | ");
  check(`${from} → ${to} (${status}, one hop)`, ok, ok ? "" : detail);
}

async function expectStatus(url, status, extra) {
  const res = await request(url);
  const ok = res.status === status && (!extra || extra(res));
  check(`${url} → ${status}`, ok, ok ? "" : `got ${res.status}${res.headers.location ? ` → ${res.headers.location}` : ""}`);
}

async function expectCache(url, expected, label) {
  const res = await request(url);
  const cc = res.headers["cache-control"];
  const ok = res.status === 200 && cc === expected && (expected !== IMMUTABLE || !res.headers.expires);
  check(`Cache-Control ${label}: "${expected}"`, ok, ok ? "" : `status ${res.status}, cache-control "${cc}", expires "${res.headers.expires ?? ""}"`);
}

// ---------------------------------------------------------------------------

async function run() {
  const W = `https://${host}`;

  // Homepage and index.html: no loop, one 301.
  await expectStatus(`${W}/`, 200, (r) => r.body.includes('id="page-title"'));
  await expectRedirect(`${W}/index.html`, `${origin}/`);
  await expectRedirect(`${W}/services/index.html`, `${origin}/services/`);
  await expectStatus(`${W}/services/`, 200);

  // HTTP and the non-canonical host → https://canonical in one hop.
  await expectRedirect(`http://${otherHost}/`, `${origin}/`);
  await expectRedirect(`http://${otherHost}/careers/`, `${origin}/careers/`);
  await expectRedirect(`http://${host}/contact/`, `${origin}/contact/`);
  await expectRedirect(`https://${otherHost}/resources/faq/`, `${origin}/resources/faq/`);
  await expectRedirect(`http://${otherHost}/index.html`, `${origin}/`);

  // Every old-site page, from the worst case (http + non-canonical host): one hop to the final URL.
  const oldPages = existsSync("old-website") ? readdirSync("old-website").filter((f) => f.endsWith(".html")) : [];
  for (const page of oldPages) {
    if (!(`/${page}` in OLD_URLS) && !(`/${page}` in TEMPORARY)) check(`/${page} has an expected target in test-apache.js`, false, "add it to OLD_URLS");
  }
  for (const [from, to] of Object.entries(OLD_URLS)) await expectRedirect(`http://${otherHost}${from}`, `${origin}${to}`);
  for (const [from, to] of Object.entries(TEMPORARY)) await expectRedirect(`http://${otherHost}${from}`, `${origin}${to}`, 302);

  // Blocked: dotfiles 403 (even when present), old server files 410, .well-known allowed.
  await expectStatus(`${W}/.git/config`, 403);
  await expectStatus(`${W}/.env`, 403);
  await expectStatus(`${W}/.htaccess`, 403);
  await expectStatus(`${W}/.well-known/acme-test.txt`, 200);
  await expectStatus(`${W}/php_mail_test.php`, 410);
  await expectStatus(`${W}/500.php`, 410);
  await expectStatus(`${W}/acttreecom.zip`, 410);
  await expectStatus(`${W}/mail/`, 410);
  await expectStatus(`${W}/archived/old.html`, 410);

  // Missing page → our 404 page with a 404 status.
  await expectStatus(`${W}/no-such-page/`, 404, (r) => r.body.includes("couldn&#39;t find that page") || r.body.includes("couldn't find that page"));

  // Cache-Control.
  await expectCache(`${W}/`, "no-cache", "HTML page");
  await expectCache(`${W}/sitemap.xml`, "no-cache", "sitemap.xml");
  await expectCache(`${W}/assets/img/generated/abc123XYZ0-640.webp`, IMMUTABLE, "generated image");
  await expectCache(`${W}/assets/img/fixture-logo.svg`, ONE_WEEK, "non-hashed SVG");
  await expectCache(`${W}/favicon.ico`, ONE_WEEK, "favicon");
  await expectCache(`${W}/assets/css/main.css?v=test123`, IMMUTABLE, "versioned CSS (?v=)");
  await expectCache(`${W}/assets/css/main.css`, ONE_WEEK, "unversioned CSS");

  // Security headers.
  const home = await request(`${W}/`);
  check("Security headers present", home.headers["x-content-type-options"] === "nosniff" && !!home.headers["referrer-policy"], "");
}

// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync("_site/.htaccess")) throw new Error("_site/.htaccess not found – run `npm run build` first.");
  try {
    docker("info");
  } catch {
    throw new Error("Docker is not running. Start Docker Desktop and try again.");
  }

  // Copy the build and add fixtures for files the site doesn't have yet (or must never serve).
  const root = mkdtempSync(join(tmpdir(), "acttree-apache-"));
  cpSync("_site", root, { recursive: true });
  const fixtures = {
    "assets/img/generated/abc123XYZ0-640.webp": "fixture",
    "assets/img/fixture-logo.svg": '<svg xmlns="http://www.w3.org/2000/svg"/>',
    ".git/config": "[core] secret",
    ".env": "SECRET=1",
    ".well-known/acme-test.txt": "ok",
    "php_mail_test.php": "<?php",
    "500.php": "<?php",
    "acttreecom.zip": "zip",
    "mail/index.html": "old",
    "archived/old.html": "old",
  };
  for (const [path, content] of Object.entries(fixtures)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }

  try {
    console.log("Building Apache test image…");
    docker("build", "-q", "-t", IMAGE, "scripts/apache");
    try { docker("rm", "-f", CONTAINER); } catch { /* not running */ }
    docker(
      "run", "-d", "--rm", "--name", CONTAINER,
      "-p", `127.0.0.1:${PORTS.http}:80`, "-p", `127.0.0.1:${PORTS.https}:443`,
      "-v", `${root}:/usr/local/apache2/htdocs:ro`,
      IMAGE,
    );

    // Wait for Apache to answer.
    for (let i = 0; ; i++) {
      try { await request(`https://${host}/robots.txt`); break; } catch (error) {
        if (i > 40) throw new Error(`Apache did not start:\n${docker("logs", CONTAINER)}`);
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    await run();
  } finally {
    try { docker("rm", "-f", CONTAINER); } catch { /* already gone */ }
    rmSync(root, { recursive: true, force: true });
  }

  const failed = results.filter((r) => !r.ok);
  for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? `\n    ${r.detail}` : ""}`);
  console.log(`\n${results.length - failed.length}/${results.length} Apache checks passed.`);
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
