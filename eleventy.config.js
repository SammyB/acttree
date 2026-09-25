import { localBusiness, primary, toJsonLd } from "./lib/schema.js";
import { icon } from "./lib/icons.js";
import { mdInline } from "./lib/markdown.js";

export default function (eleventyConfig) {
  // Static assets copied as-is. CSS is built separately by the Tailwind CLI.
  eleventyConfig.addPassthroughCopy("src/assets/js/**/*.js");
  eleventyConfig.addPassthroughCopy("src/assets/img/**/*");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Tailwind writes straight into _site; reload the browser when it does.
  eleventyConfig.setServerOptions({
    watch: ["_site/assets/css/**/*.css"],
  });

  // Fails the build when a page is missing required front matter (e.g. title, description).
  eleventyConfig.addFilter("required", function (value, name) {
    if (value === undefined || value === null || String(value).trim() === "") {
      throw new Error(`${this.page.inputPath} is missing front matter "${name}"`);
    }
    return value;
  });

  eleventyConfig.addFilter("localBusinessJsonLd", (site) => toJsonLd(localBusiness(site)));
  eleventyConfig.addFilter("mdInline", mdInline);
  eleventyConfig.addFilter("primary", primary);

  eleventyConfig.addShortcode("icon", icon);
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
