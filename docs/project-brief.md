# ACT Tree Felling – Website Rebuild: Project Brief

_Last updated: 26 Sep 2026 (rev 2) · Owner: Sam Brunno (developer)_

## 1. The job

Rebuild **acttree.com.au** for ACT Tree Felling. The business was founded in Canberra in 1975 and offers tree removal, pruning, stump grinding, powerline clearance, arborist consultation and reports, and commercial tree services.

The old site is hand-written HTML/jQuery from around 2020. The new site is a static Eleventy + Tailwind build based on the designer's Figma.

**Current stage:**
- The homepage design has been reviewed and feedback sent to the designer and client (§8).
- The core build is done in Claude Code: the scaffold, SEO, data files, components, pages and `.htaccess` (build plan steps 1–6).
- **We are now building the actual Figma design.** Sam doesn't expect much to change. The tokens and homepage copy have been extracted to `docs/design-tokens.md` and `docs/figma-homepage.md`.
- The next phase is **UAT**: proof-of-concept previews for the designer and client.
- **Nothing is uploaded to the live site until go-live.**

## 2. Decisions (confirmed)

| Area | Decision |
|---|---|
| Generator | **Eleventy 3** with Nunjucks templates |
| Styling | **Tailwind CSS**. Design tokens come from the Figma variables and are documented in `docs/design-tokens.md`. The font is **Alexandria** (Google Fonts), the brand green is `#037b3e`, and a warm grey scale runs from cream to near-black |
| Output | Plain static HTML/CSS/minimal vanilla JS. No framework in the browser |
| Hosting | **OzHosting** (Plesk, Apache). `.htaccess` for HTTPS, redirects and caching. **No database, no server-side PHP needed** |
| Contact/quote form | **JotForm** (existing form ID `201330756177049`). A custom-styled HTML form that POSTs to `https://submit.jotform.com/submit/201330756177049/`. JotForm redirects to `/thank-you/` on our site |
| Version control | GitHub |
| Canonical host | **`https://www.acttree.com.au`** (decided). Google has indexed www and the old site links to it. Non-www and http redirect 301 to it. The host is set in `site.json` |
| UAT / previews | **Cloudflare Pages** (planned) builds preview links from GitHub for the designer and client. Non-production builds are `noindex`, and GTM is off. `.htaccess` doesn't run there |
| Live site | **No uploads or changes to the live site until go-live** (Sam's decision) |
| Deploy (at launch) | Phase 1: build locally, upload `_site/` by FTP or the Plesk File Manager. Phase 2: GitHub Actions builds and deploys (FTP, or Plesk Git extension if OzHosting supports it) |
| CMS | **None at launch.** Content lives in `_data/*.json` so **Pages CMS** (free, Git-based) can be added later if the client wants to self-edit |

## 3. Business facts (from the current site – verify before launch)

- Phone: Southside 02 6281 2687 · Northside 02 6162 2678 · Mobile 0417 492 760
- Email: service@acttree.com.au
- Street: 56 Port Arthur Street, Lyons ACT 2606 · Postal: PO Box 301, Curtin ACT 2605
- Hours: 7.30 am – 4.00 pm, Monday–Friday
- Social: facebook.com/acttreefelling, instagram.com/acttreefelling (the Figma footer also shows X and YouTube; confirm these accounts exist)
- Member of Arboriculture Australia (badge in footer). Evoenergy-accredited for powerline work
- Founded 1975 by Paddy Hanson; now run by Tim van der Linden

## 4. Tracking and analytics

- **GTM container `GTM-5KX98C2`** is on the live site. It does **not** contain the Google Ads tag. Sam has no access to the container yet.
- **Google Ads `AW-974770116`** is hard-coded as a base tag only. **No conversion event exists anywhere**, so form enquiries are not reported to Ads.
- **`UA-108378272-1`** (Universal Analytics) is dead and should be removed. Replace it with **GA4** (the client needs to create a property or grant access).
- New site plan:
  - fire the Ads conversion on `/thank-you/`
  - track `tel:` link clicks as a conversion
  - put all tags in GTM (not hard-coded)
  - needs **conversion labels from the client's Ads account holder**

## 5. Figma

- Original file (designer): `wkru217NnARkUHeANt182D` "ACT Tree Feeling 2026". Sam's connected Figma account (SammyB) has **view-only** access, so the Figma MCP can't read it until the designer grants edit access.
- Working copy (Sam's drafts, readable by the MCP): `SZ570YQEPeviNy0oQtXAOf`, node `29392:3375`, page "Creative Explore 🔴". This is a snapshot and won't show the designer's later changes.
- Designed so far: homepage (desktop 1440 and mobile 368), desktop mega-menu and mobile menu, navbar and footer. **Everything else is still to design.**
- Tokens extracted from the Figma variables and styles are in **`docs/design-tokens.md`**:
  - font Alexandria, with an h1–h6 scale in desktop and mobile sizes
  - colours: a warm grey scale plus green `#037b3e`
  - spacing on a 4px grid
  - corner radius: 6px for buttons, 16px for cards
  - content container 1248px wide
- Homepage structure and copy (10 sections, plus the menus and footer) are in **`docs/figma-homepage.md`**. It marks each item as [FIX], [PENDING] or [TODO].
- The icon library hasn't been identified yet; its layers use names like `Map / Map` and `People / User Check`. Ask the designer. Until then, export the icons as SVGs.
- Ignore these Figma leftovers:
  - the `Themes` variable collection ("Cogito Group")
  - Inter, which only appears in the reviews mock-up
  - Gotham, which only appears in one leftover text style

## 6. Sitemap and redirects (proposed – confirm with client)

New nav: Home · Services · Why ACT Tree Felling · Resources · Careers · Contact.

| Old URL | New URL |
|---|---|
| `/index.html`, `/default.html` | `/` |
| `/about.html` | `/why-act-tree-felling/` |
| `/services.html` | `/services/` |
| `/tree-removal.html` | `/services/tree-removal/` |
| `/tree-pruning.html` | `/services/tree-pruning/` |
| `/stump-grinding.html` | `/services/stump-grinding/` |
| `/powerline-clearance.html` | `/services/powerline-clearance/` |
| `/cable-and-bracing.html` | `/services/cabling-and-bracing/` |
| `/commercial-works.html` | `/services/commercial-tree-services/` |
| `/tree-consultation.html` + `/tree-consul-*.html` (6 pages) | `/services/arborist-consultation/` (sections or subpages – TBC) |
| `/faq.html` | `/resources/faq/` |
| `/testimonials.html` | `/why-act-tree-felling/#reviews` (TBC) |
| `/careers.html` | `/careers/` |
| `/contact.html` | `/contact/` |
| `/mulch-orders.html` | TBC – does the client still offer mulch? |
| `/survey.html` | `/` (embeds FluidSurveys, which no longer works) |
| `/sitemap.html` | `/sitemap.xml` |

New pages: `/thank-you/`, `/privacy-policy/`, `/404.html`.

**Canonical host is www** (decided 26 Sep 2026). Both hosts currently serve the site without redirecting, but Google has indexed www.

As implemented in `src/htaccess.njk`:
- the six consultation pages redirect to anchors on `/services/arborist-consultation/`
- `mulch-orders.html` is a temporary **302** to `/contact/` until the client decides; change it to a 301 once they do

## 7. Contact form (JotForm) spec

- Current fields and JotForm names:
  - `q3_name[first]`, `q3_name[last]` (required)
  - `q8_phoneNumber`
  - `q4_email` (required)
  - `q5_address[addr_line1]`, `[addr_line2]`, `[city]`, `[state]`, `[postal]`, `[country]`
  - `q6_comments`
  - the hidden `formID`
- Drop the country dropdown, or fix it to Australia.
- The current embed is outdated 2020 source code and throws console errors (`/API/form/staticTexts` 404). **Regenerate from JotForm**, or use a clean HTML form without JotForm's scripts.
- To do in JotForm (needs the account owner – unknown):
  - enable spam protection
  - set the redirect to `/thank-you/`
  - check the plan's submission limits and where notifications are sent
  - optionally add a photo upload and a "type of service" field
- If any field changes in JotForm, update the site component to match.

## 8. Design feedback sent (26 Sep 2026) – awaiting designer

These items are pending from the designer:

- Typos: "Tree Feeling" in the footer nav, and "f you already know" missing its "I".
- The reviews section is clipped, uses the wrong font (Inter) and has a black button.
- Logo tiles are unfinished, and the desktop and mobile logo sets don't match.
- Section margins are inconsistent (76/88/96/108px).
- Button labels are inconsistent.
- Services count doesn't match: 7 in the menu, 6 on the homepage.
- Missing phone number in the header.
- Hero headline doesn't say what the business does.
- "Since 1975" is repeated about 5 times.
- "Sustainment Services" label is unclear.
- A photo is reused.
- Layer names are auto-generated.
- Missing designs:
  - form and its states
  - all inner pages
  - tablet breakpoint
  - hover/focus states
  - 404 and thank-you pages
- Technical notes were also sent:
  - JotForm field constraints
  - reviews approach (static or widget, no relative dates)
  - Figma variables so tokens map to Tailwind
  - an icon set name
  - export-ready images with alt text
  - page names close to the old URLs

## 9. Content to confirm with the client

- Years of operation: the old site says "38 years" / "almost 40". It is now 50+.
- Outdated names:
  - ActewAGL is now Evoenergy
  - TAMS is now TCCS
- **The ACT Tree Protection Act 2005 is referenced.** It was likely replaced by the Urban Forest Act 2023; an arborist should check.
- Insurance policy numbers are published on the About page. Replace them with "available on request".
- Named clients and logos need permission: the Lodge, ANBG, the ACT Government crest, Evoenergy, ASX, ABS and others.
- Testimonials date from about 2010–2019. Check they can still be used alongside Google reviews.
- Careers page: is visa sponsorship still offered?
- Mulch orders: still offered?
- Do the X and YouTube accounts exist?
- Are the hero wren photo and other images licensed?

## 10. Old server clean-up (live site – deferred to launch, no live changes for now)

The new `.htaccess` also returns `410 Gone` for these paths, in case any copies are left behind.

Remove:

- `php_mail_test.php` (sends an email on every hit)
- `500.php` (runs a shell command)
- `acttreecom.zip` (a downloadable site backup)
- the `/mail/` folder (PHPMailer 6.1.5, unused)
- the duplicate `contact_form/` site copy
- the `archived/` folders

## 11. Build plan

Steps 1–6 are done. Step 10 is now in progress.

1. Repo, Eleventy, Tailwind scaffold, and `npm run dev` / `npm run build`
2. Base layout with SEO:
   - per-page title/description, canonical, Open Graph
   - `LocalBusiness` JSON-LD schema from `site.json`
   - `sitemap.xml` and `robots.txt`
3. Data files: `site.json`, `services.json`, `reviews.json`, `logos.json`, `faq.json`, `nav.json`
4. Components as low-fidelity "grey box" versions:
   - header/nav with mobile menu, footer, buttons, hero, service card, CTA band, trust icons, reviews, logo grid
   - JotForm form
5. Pages: home, services index plus one template for all services, why us, FAQ, careers, contact, thank-you, privacy, 404
6. `.htaccess`: HTTPS and canonical host, the full 301 map (§6), caching, and blocking `.git` / dotfiles
7. GTM snippet in the layout, with an env/data toggle so it only loads in production
8. Image pipeline with `@11ty/eleventy-img` (responsive AVIF/WebP)
9. Deploy script (phase 1) and GitHub Actions (phase 2)
10. **Now:** apply the tokens from `design-tokens.md` and rebuild the homepage, header and footer to match `figma-homepage.md`
11. UAT: Cloudflare Pages previews, with `noindex` on non-production builds. Send the links to the designer and client
12. Inner pages, reusing the homepage components until the designer supplies inner-page designs

## 12. Open questions / blockers

- Who owns the JotForm account?
- Who owns Google Ads and GTM? We need conversion labels and GTM access.
- GA4: new property or existing?
- Figma edit access on the designer's original file
- Final page list: Resources contents, consultation structure (currently anchors on one page), mulch
- Which icon library the designer is using
- Export-ready images at 2× (listed at the end of `figma-homepage.md`)
- Should Cabling & Bracing appear on the homepage grid (7 in the menu vs 6 on the homepage)?
- What does the "Sustainment Services" label mean?

## 13. Pre-launch test list (before go-live)

- **`.htaccess`**, tested on an OzHosting staging subdomain:
  - the homepage has no redirect loop
  - http → https and non-www → www happen in one hop
  - every old `.html` URL redirects 301 to the right new page (mulch is a temporary 302)
  - dotfiles are blocked
  - the 404 page works
- **Uploading `.htaccess`:** upload it deliberately, because FTP clients can hide dotfiles. Use either the `.htaccess` rules or Plesk's HTTPS/preferred-domain settings, not both. Enable HSTS only once HTTPS works on both hosts.
- **JotForm:**
  - redirects to `/thank-you/` on the site
  - spam protection is on
  - notifications go to the right inbox
  - a test submission arrives
- **Tracking:**
  - the Google Ads conversion fires on `/thank-you/` and on `tel:` clicks via GTM (check with Tag Assistant)
  - GA4 is live
- **SEO:**
  - the production build has no `noindex`
  - `sitemap.xml` and `robots.txt` are correct
  - the sitemap is submitted in Search Console
- **Clean-up:**
  - the old server files are removed (§10)
  - updated non-hashed assets (logo, icons) show after deploy
