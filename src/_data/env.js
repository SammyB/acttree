export default {
  production: process.env.ELEVENTY_ENV === "production",
  // Appended to CSS/JS URLs (?v=...) so browsers fetch fresh files after each deploy,
  // which lets .htaccess cache them for a long time.
  buildId: Date.now().toString(36),
};
