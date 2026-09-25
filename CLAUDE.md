# CLAUDE.md – acttree.com.au

Static marketing site for ACT Tree Felling (Canberra tree services since 1975).
Full context lives in `docs/project-brief.md`. Old site copy lives in `docs/old-site-content.md`. Read them before large changes.

## Stack
- Eleventy 3 with Nunjucks (`.njk`) templates. Content lives in `src/_data/*.json` and front matter.
- Tailwind CSS. Design tokens (colour, font, spacing, radius) are defined **once** in the Tailwind theme.
- Output is plain HTML in `_site/`, hosted on OzHosting (Plesk/Apache). No database, no server-side code.
- The contact form is a styled HTML form that POSTs to JotForm (see "Forms").

## Commands
- `npm run dev` runs the local server with live reload.
- `npm run build` does a production build to `_site/`.
- `npm run check` builds, then runs an HTML validation and link check.

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
  .htaccess     HTTPS + canonical host, 301 map from old *.html URLs, caching (passthrough copy)
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
- Every page sets `title` and `description` in front matter. The base layout outputs the canonical link, Open Graph tags and `LocalBusiness` JSON-LD.
- Use Australian English in all copy.
- Designs are still being validated. Until Figma tokens are approved, build **low-fidelity** layouts that match the Figma structure, and keep styling easy to swap.

## Forms (JotForm)
- The form ID and field names live in `site.json`. They must exactly match the JotForm form (e.g. `q3_name[first]`, `q4_email`, `formID`).
- JotForm redirects to `/thank-you/` after submit, and the Google Ads conversion fires on that page (through GTM).
- If a field changes in JotForm, update the component to match. Don't invent field names.

## Tracking
- GTM ID in `site.json` (`GTM-5KX98C2`). Only output it when `ELEVENTY_ENV=production`.
- No hard-coded gtag, UA or AW tags; everything goes through GTM.
- Add `data-track="phone"` to all `tel:` links so GTM can track click-to-call.

## Deploy
- Phase 1: `npm run build`, then upload the contents of `_site/` to `httpdocs/`.
- Phase 2: a GitHub Actions workflow builds and deploys on push to `main`. Credentials are stored in repo secrets, never in the repo.
- Never deploy `.git`, `node_modules` or `docs/`.
