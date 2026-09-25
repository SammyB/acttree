// Per-service SEO fields, computed from the paginated `service` item.
// Note: this file is also the directory data file for src/services/, so it must leave
// pages without a `service` (the services index) untouched.
export default {
  eleventyComputed: {
    title: (data) => (data.service ? data.service.metaTitle : data.title),
    description: (data) => (data.service ? data.service.description : data.description),
  },
};
