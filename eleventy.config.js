export default function (eleventyConfig) {
  // Static assets copied as-is. CSS is built separately by the Tailwind CLI.
  eleventyConfig.addPassthroughCopy("src/assets/js/**/*.js");
  eleventyConfig.addPassthroughCopy("src/assets/img/**/*");

  // Tailwind writes straight into _site; reload the browser when it does.
  eleventyConfig.setServerOptions({
    watch: ["_site/assets/css/**/*.css"],
  });

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
