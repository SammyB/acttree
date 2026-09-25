// Inline markdown for strings in _data (links, bold). Raw HTML in data is escaped, not rendered.
import markdownIt from "markdown-it";

const md = markdownIt({ html: false, linkify: false, typographer: false });

export function mdInline(text = "") {
  return md.renderInline(String(text));
}
