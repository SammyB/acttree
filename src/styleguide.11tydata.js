// The styleguide is a development aid: skip it entirely in production builds.
export default {
  permalink: () => (process.env.ELEVENTY_ENV === "production" ? false : "/styleguide/"),
};
