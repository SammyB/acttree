// Build environment, from ELEVENTY_ENV (set by the npm scripts, never inferred):
//   production  npm run build      live site: GTM, indexable, normal robots.txt
//   uat         npm run build:uat  Cloudflare preview: UAT banner, noindex, blocking robots.txt, no GTM
//   development npm run dev        local: like uat, plus the styleguide
// Anything other than "production" is treated as non-production, so a missing or mistyped value
// can never switch on analytics or indexing.
const name = process.env.ELEVENTY_ENV || "development";
const production = name === "production";

// Commit/branch from Cloudflare Workers Builds (or Pages), shown in the UAT banner when available.
const commit = process.env.WORKERS_CI_COMMIT_SHA || process.env.CF_PAGES_COMMIT_SHA || "";
const branch = process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || "";

export default {
  name,
  production,
  uat: name === "uat",
  // Search engines may index this build (and GTM may load) only in production.
  indexable: production,
  commit: commit.slice(0, 7),
  branch,
  builtAt: new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney", dateStyle: "medium", timeStyle: "short" }),
  // Appended to CSS/JS URLs (?v=...) so browsers fetch fresh files after each deploy,
  // which lets .htaccess cache them for a long time.
  buildId: Date.now().toString(36),
};
