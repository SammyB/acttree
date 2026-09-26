// Write /_headers only for non-production builds (UAT previews on Cloudflare).
export default {
  permalink: () => (process.env.ELEVENTY_ENV === "production" ? false : "/_headers"),
};
