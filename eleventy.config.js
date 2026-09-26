import { localBusiness, primary, toJsonLd } from "./lib/schema.js";
import { icon } from "./lib/icons.js";
import { mdInline } from "./lib/markdown.js";
import { marqueeTracks } from "./lib/marquee.js";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Static assets copied as-is. CSS is built separately by the Tailwind CLI.
  // Raster images are NOT copied: the image plugin below generates optimised versions of them.
  eleventyConfig.addPassthroughCopy("src/assets/js/**/*.js");
  eleventyConfig.addPassthroughCopy("src/assets/img/**/*.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Every <img src="/assets/img/…"> in the HTML becomes a responsive <picture> (AVIF, WebP, JPEG/PNG)
  // with width and height set. Output MUST stay in /assets/img/generated/ with hashed filenames:
  // .htaccess gives only that folder the 1-year immutable cache. Set `sizes` on each <img>;
  // use eleventy:widths="…" to override the widths, and eleventy:ignore to skip an image (e.g. SVGs).
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    outputDir: "./_site/assets/img/generated/",
    urlPath: "/assets/img/generated/",
    // JPEG fallback for photos; transparent logos opt in to PNG with eleventy:formats="avif,webp,png".
    formats: ["avif", "webp", "jpeg"],
    widths: [400, 800, 1200, 1600],
    sharpAvifOptions: { quality: 50 },
    sharpWebpOptions: { quality: 72 },
    sharpJpegOptions: { quality: 72, mozjpeg: true, progressive: true },
    failOnError: true,
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

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
  // site.phones | phoneById("mobile")
  eleventyConfig.addFilter("phoneById", (phones = [], id) => phones.find((phone) => phone.id === id));
  // reviews | whereEq("source", "google")
  eleventyConfig.addFilter("whereEq", (items = [], key, value) => items.filter((item) => item[key] === value));
  // logos | selectattr("show") | marqueeTracks(2, 6)
  eleventyConfig.addFilter("marqueeTracks", marqueeTracks);
  // Keeps phone numbers on one line.
  eleventyConfig.addFilter("nbsp", (text) => String(text).replace(/ /g, "\u00a0"));

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
