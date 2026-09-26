// Collects everything still awaiting sign-off and writes docs/sign-off.md, split into
// "Client to confirm" and "Designer to confirm". Sources:
//   - "review" notes in src/_data/*.json and in page front matter: [{ "who": "client" | "designer", "text": "…" }]
//   - reviews and shown logos whose "permissionConfirmed" is false (grouped into one item each)
// Reports only (exit code 0), except for badly formed notes (exit code 1).
// To clear an item, resolve it and delete its note from the data – don't edit docs/sign-off.md.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const OUTPUT = "docs/sign-off.md";
const readJson = (name) => JSON.parse(readFileSync(`src/_data/${name}.json`, "utf8"));
const site = readJson("site");
const services = readJson("services");
const faq = readJson("faq");
const reviews = readJson("reviews");
const logos = readJson("logos");

const items = []; // { who, where, text }
const problems = [];

function addNotes(notes, where) {
  if (!notes) return;
  for (const note of notes) {
    if (!note || !["client", "designer"].includes(note.who) || !note.text?.trim()) {
      problems.push(`${where}: review notes must look like { "who": "client" | "designer", "text": "…" } (got ${JSON.stringify(note)})`);
      continue;
    }
    items.push({ who: note.who, where, text: note.text.trim() });
  }
}

function frontMatterNotes(file, where) {
  const { data } = matter(readFileSync(file, "utf8"));
  addNotes(data.review, where ?? `${data.heading || data.title} page`);
}

function* templates(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith("_")) yield* templates(path);
    else if (entry.name.endsWith(".njk")) yield path;
  }
}

// In reading order: homepage, business details, services, FAQ, permissions, other pages.
frontMatterNotes("src/index.njk", "Homepage");
addNotes(site.review, "Business details");
site.trust.forEach((item) => addNotes(item.review, "Homepage trust icons"));
addNotes(site.googleReviews?.review, "Google reviews");
services.forEach((service) => addNotes(service.review, `${service.title} page`));
faq.forEach((entry) => addNotes(entry.review, `FAQ: "${entry.question}"`));

const unconfirmedReviews = reviews.filter((r) => r.permissionConfirmed === false).map((r) => r.name);
if (unconfirmedReviews.length) {
  items.push({
    who: "client",
    where: "Customer reviews",
    text: `Can we show these customer reviews on the website? ${unconfirmedReviews.join(", ")}. The letters are from about 2010–2019, so please check they're still OK to use alongside your Google reviews.`,
  });
}
const unconfirmedLogos = logos.filter((l) => l.show && l.permissionConfirmed === false).map((l) => l.name);
if (unconfirmedLogos.length) {
  items.push({
    who: "client",
    where: "Client logos",
    text: `Do we have permission to show these organisations' logos on the website? ${unconfirmedLogos.join(", ")}.`,
  });
}

for (const file of templates("src")) {
  if (file === join("src", "index.njk")) continue; // homepage done above
  frontMatterNotes(file);
}
for (const [key, value] of Object.entries({ site, services, faq, reviews, logos })) {
  // Catch notes left in the old plain-string format anywhere in the data.
  if (JSON.stringify(value).match(/"review":\["/)) problems.push(`${key}.json has a "review" note in the old string format`);
}

// ---------------------------------------------------------------------------

function section(who, heading) {
  const list = items.filter((item) => item.who === who);
  if (!list.length) return `## ${heading}\n\nNothing outstanding.\n`;
  const label = (where) => (/[.?!"]$/.test(where) ? where : `${where}.`);
  return `## ${heading}\n\n${list.map((item, i) => `${i + 1}. **${label(item.where)}** ${item.text}`).join("\n")}\n`;
}

const markdown = `# Sign-off list

These are the questions we still need answered before the new website goes live.

This list is created automatically by \`npm run check\` from notes in the website's files. Please don't edit it by hand. Once a question is answered, we update the website and remove the note, and it drops off this list.

${section("client", "Client to confirm")}
${section("designer", "Designer to confirm")}`;

writeFileSync(OUTPUT, markdown);

const client = items.filter((i) => i.who === "client").length;
const designer = items.length - client;
console.log(`Content review: ${items.length} item(s) need sign-off before launch (${client} client, ${designer} designer). Written to ${OUTPUT}.`);
if (problems.length) {
  console.error(`\n${problems.join("\n")}`);
  process.exit(1);
}
