# CLAUDE.md – acttree.com.au

Static marketing site for ACT Tree Felling (Canberra tree services since 1975).
Read these docs before large changes:
- `docs/project-brief.md`: decisions, status, redirects, open questions, pre-launch tests
- `docs/design-tokens.md`: fonts, colours, spacing and radii from the Figma
- `docs/figma-homepage.md`: homepage section order, layouts and copy
- `docs/old-site-content.md`: the old site's copy, for the inner pages (out of date in places)

## Stack
- Eleventy 3 with Nunjucks (`.njk`) templates. Content lives in `src/_data/*.json` and front matter.
- Tailwind CSS. Design tokens (colour, font, spacing, radius) are defined **once** in the Tailwind theme, using the values in `docs/design-tokens.md`. The font is Alexandria.
- Output is plain HTML in `_site/`, hosted on OzHosting (Plesk/Apache). No database, no server-side code.
- The contact form is a styled HTML form that POSTs to JotForm (see "Forms").

## Commands
- `npm run dev` runs the local server with live reload.
- `npm run build` does a production build to `_site/`.
- `npm run check` builds, then runs an HTML validation and link check.
- `npm run test:apache` builds, then serves `_site/` in Apache 2.4 (Docker must be running) and checks the `.htaccess` redirects, blocked files, 404 page and caching. Run it before every launch or `.htaccess` change.

## Layout
```
src/
  _data/        site.json (contacts, hours, tracking IDs) · nav.json · services.json · reviews.json · logos.json · faq.json
  _includes/
    layouts/    base.njk (head, SEO, GTM) · page.njk · service.njk
    components/ header, footer, button, hero, service-card, cta, trust-icons, reviews, logo-grid, jotform-quote
  assets/       css/main.css (Tailwind entry) · js/ (small vanilla modules) · img/
  services/     services.njk – ONE paginated template generates every page in services.json
  *.njk         index, why-act-tree-felling, resources/faq, careers, contact, thank-you, privacy-policy, 404
  htaccess.njk  generates _site/.htaccess: HTTPS + canonical host, 301 map from old *.html URLs, 410s for old files, caching
```

## Rules
- **Never hard-code contact details, IDs or service copy in templates.** Read them from `_data`.
- Build every repeated UI element as a component in `_includes/components/`. Pages only compose components.
- Only use theme tokens: no arbitrary Tailwind values (`bg-[#...]`, `mt-[37px]`) and no inline styles.
- Only add JS where needed (the mobile menu, the reviews carousel). Use vanilla ES modules, no jQuery or frameworks.
- Accessibility:
  - use semantic landmarks, with one `<h1>` per page
  - every image needs `alt`
  - "Learn more" links need descriptive text (visually hidden text is fine)
  - show visible focus states
  - respect `prefers-reduced-motion`
- Images go through `@11ty/eleventy-img` (responsive AVIF/WebP, with width and height set).
  - It runs as an HTML transform: write a plain `<img src="/assets/img/…" alt="…" sizes="…">` (works inside macros) and the build turns it into a `<picture>`. Add `eleventy:ignore` for SVGs, and `eleventy:formats="avif,webp,png"` for images that need transparency.
  - Source images live in `src/assets/img/`: `photos/` (from the Figma), `logos/` (client logos and the Arboriculture Australia badge) and `brand/` (SVG site logo and Google wordmark, copied as-is). Image paths and alt text live in `_data` or front matter, not in templates.
  - It **must** output to `/assets/img/generated/` (`outputDir: "_site/assets/img/generated/"`, `urlPath: "/assets/img/generated/"`) with its default content-hashed filenames. `.htaccess` gives only that folder the 1-year `immutable` cache; anything else under `/assets/img/` is cached for 1 week.
- Every page sets `title` and `description` in front matter. The base layout outputs the canonical link, Open Graph tags and `LocalBusiness` JSON-LD.
- Use Australian English in all copy.
- Build to the real design. Use the tokens from `docs/design-tokens.md`, and follow `docs/figma-homepage.md` for the homepage. Apply its [FIX] items, and keep [PENDING] items easy to change (in data or front matter).
- Inner pages aren't designed yet. Reuse the homepage components and styles for them.
- Use the Figma MCP to check details like shadows and spacing, not screenshots. Use Sam's team copy `JSWVzi7e2wvXptHlpO9X6s` ("ACT Tree Feeling 2026 - Master (Copy)"): it's on the Dev seat, so the MCP isn't rate-limited. Page "Creative Explore" (node `29392:3375`): frames "Home - Desktop" (`29397:48144`), "Home - Mobile" (`29417:46986`), "MobileMenu1" (`29440:54046` closed, `29440:54047` Services open) and "DesktopMenu" (`29440:54031`). The designer's original is `ig9ALsJjjUUGvOvBA0mzcC` (Starter team, rate-limited): if the designer changes it, re-copy it into Sam's team. The older working copy `SZ570YQEPeviNy0oQtXAOf` is out of date.

## Forms (JotForm)
- The form ID and field names live in `site.json`. They must exactly match the JotForm form (e.g. `q3_name[first]`, `q4_email`, `formID`).
- JotForm redirects to `/thank-you/` after submit, and the Google Ads conversion fires on that page (through GTM).
- If a field changes in JotForm, update the component to match. Don't invent field names.

## Tracking
- GTM ID in `site.json` (`GTM-5KX98C2`). Only output it when `ELEVENTY_ENV=production`.
- No hard-coded gtag, UA or AW tags; everything goes through GTM.
- Add `data-track="phone"` to all `tel:` links so GTM can track click-to-call.

## Hosting, redirects and previews
- The canonical origin is `site.url` in `site.json`: `https://www.acttree.com.au`. Everything that needs the host reads it from there, including `.htaccess`, canonical tags, the sitemap and JSON-LD.
- Edit `src/htaccess.njk`, never `_site/.htaccess`. Keep the `index.html` redirect guarded with `THE_REQUEST` to avoid a redirect loop. Only hashed or versioned assets get the `immutable` cache.
- UAT previews run on Cloudflare Pages. Non-production builds must output `noindex` and a blocking `robots.txt`, and must not load GTM. `.htaccess` doesn't run on previews.

## Deploy
- **Nothing is uploaded to the live site until go-live.** Don't suggest or run deploys to OzHosting before Sam asks.
- Phase 1: `npm run build`, then upload the contents of `_site/` to `httpdocs/`.
- Phase 2: a GitHub Actions workflow builds and deploys on push to `main`. Credentials are stored in repo secrets, never in the repo.
- Never deploy `.git`, `node_modules` or `docs/`.
