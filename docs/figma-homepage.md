# Figma homepage – structure and copy

This was extracted on 26 Sep 2026 from Sam's working copy of the Figma file:

- file `SZ570YQEPeviNy0oQtXAOf`
- page "Creative Explore 🔴"
- frames: "Home - Desktop" (1440 × 7522) and "Home - Mobile" (368 × 13553)

Sections appear below in page order. Mobile uses the **same order**, stacked into one column.

Copy is verbatim from Figma except for the fixes marked **[FIX]**. Those have been sent to the designer. Use the fixed text in the build. The Figma component name for each section is shown in `code`.

---

## 1. Header – `Navbars`
- Logo: `ACT Tree Felling Logo`. Links to `/`.
- Nav links: Home · Services (opens the mega menu) · Why ACT Tree Felling · Resources · Careers
- Buttons:
  - **Contact Us** (secondary/outline) → `/contact/`
  - **Request a Quote** (primary) → `/contact/#quote`
- [TODO] The designer is adding a phone number. Build a slot for the mobile number from `site.json`, with a `tel:` link and `data-track="phone"`.

### Desktop mega menu (Services) – `DesktopMenu`
1. Tree Removal
2. Tree Pruning
3. Stump Grinding
4. Powerline Clearance
5. Arborist Consultations & Reports
6. Commercial Tree Services
7. Cabling & Bracing

### Mobile menu – `MobileMenu1` (closed and open states)
- Links: Home · Services (expands to the same 7 services) · Why ACT Tree Felling (has an expand chevron) · Resources (has an expand chevron) · Careers
- Buttons: **Contact Us** (outline) and **Request a Quote** (primary), full width
- [TODO] The sub-items for "Why ACT Tree Felling" and "Resources" aren't designed yet. Render them as plain links until they are.

---

## 2. Hero – `Hero`
- Full-bleed photo (the superb fairy-wren on a branch) with a dark gradient overlay on the left. Text is left-aligned.
- **H1:** Serving the region since 1975
  - [PENDING] The feedback suggested a headline that says what the business does. Keep the text in front matter so it's easy to change.
- **Intro:** From specialist pruning and difficult tree removals to stump grinding, power line clearance and professional arborist advice, ACT Tree Felling provides experienced, reliable tree care throughout Canberra and the surrounding region.
- Buttons:
  - **Request a Free Quote** (primary) → `/contact/#quote`
  - **Call ACT Tree Felling** (white fill with a green outline) → `tel:` link to the mobile number, with `data-track="phone"`
- Image: 1467 × 762 on desktop. It needs a separate mobile crop.

---

## 3. Services grid – `Frame 1618873018`
- **Eyebrow:** SERVICES
- **H2:** Professional Tree Services in Canberra
- The cards use `CardBase - new`: an image on top, then an H3, a description and a "Learn more" button. The layout is 3 columns on desktop and 1 column on mobile. Each card image is 395 × 219.

| Card (H3) | Description | Link |
|---|---|---|
| Tree Removal | Safe and efficient removal of dead, dangerous, unwanted and difficult-to-access trees. | `/services/tree-removal/` |
| Tree Pruning | Professional pruning to improve tree structure, safety, clearance, appearance and long-term health. | `/services/tree-pruning/` |
| Stump Grinding | Remove unwanted tree stumps and reclaim usable space in your garden or landscape. | `/services/stump-grinding/` |
| Powerline Clearance | Our appropriately trained and accredited staff undertake tree work around powerlines and can coordinate outages with Evoenergy where required. | `/services/powerline-clearance/` |
| Arborist Consultation and Reports | Our consulting arborists can assess tree health, structural condition, risk, development impacts and long-term management options. | `/services/arborist-consultation/` |
| Commercial Tree Services | Professional arboricultural services for commercial property managers, strata organisations, civil contractors, developers and government clients. | `/services/commercial-tree-services/` |

- The button text is "Learn more". Add visually hidden text so screen readers hear "Learn more about Tree Removal", and so on.
- Put these descriptions in `services.json` as the `summary` field.
- [PENDING] Cabling & Bracing is in the menu but not on the grid. Include it in `services.json` and add a `showOnHome` flag.
- Pin the buttons to the bottom of each card so they line up across a row.

---

## 4. Experience split – `Call to Action` (first instance)
- Layout: cream text panel on the left, full-height photo on the right (720 × 603). On mobile, the text comes first, then the image.
- **H2:** Canberra tree care backed by more than 50 years of experience
- Body:
  - ACT Tree Felling is one of Canberra's longest-established professional tree-care businesses.
  - Since 1975, we have provided arboricultural services to homeowners, businesses, property managers, government organisations and major institutions throughout the Canberra region.
  - Our work ranges from small residential pruning jobs through to large, technically difficult tree removals, commercial projects and professional arborist assessments.
  - We combine experienced people, specialised equipment and sound arboricultural practice to achieve safe, practical and professional outcomes.
- Has no button.
- [FIX] Give the text panel more top and bottom padding. The Figma version has almost none.

---

## 5. Trust icons – `Frame 1618873017`
- Grid of 6 items: an icon above an H3-size label. 3 columns on desktop, 1 column on mobile. Icon colour is green 500.

| Icon (Figma name) | Label |
|---|---|
| Map / Map | Serving Canberra since 1975 |
| People / User Check | Qualified Arborists |
| Document / File Certificate | Evoenergy Accredited |
| Document / Certificate | Fully Insured |
| Buildings / Building Community | Residential and Commercial |
| Nature / Leaf | Sustainment Services [PENDING – the label is unclear and the designer is confirming it] |

- [FIX] Figma has double spaces in "Qualified  Arborists" and "Evoenergy  Accredited". Use single spaces.
- Store these in `site.json` as a `trust` array.

---

## 6. Reviews – `Google review`
- **Eyebrow:** REVIEWS
- **H2:** See what our customers say
- Summary card: the Google logo, "ACT Tree Felling", **4.9** stars and "Read our 204 Reviews", plus a **Write a review** button.
- Review cards show:
  - an avatar initial and the reviewer's name
  - a star rating and the review text
  - an optional owner response
  - a "View on Google" link and a share icon
- Carousel with previous/next round buttons. The next button is green.
- Sample reviews (these belong in `reviews.json`):
  - **Rachael Hunter** (5★): "Amazing service at a very competitive price. I would highly recommend ACT Tree Felling. The team were super professional and fast! The whole experience was smooth and great value. Thanks guys. I'm really thrilled ☺️"
  - **Kay Johns** (5★): "Great service, minimum fuss and very professional. Price reasonable." The owner's response: "Hi Kay, Thank you for taking the time to leave us a positive review! We appreciate the kind words and feedback, and hope to see you again! Kind Regards, ACT Tree Felling."
- [FIX] Figma uses Inter and a black button, and the text is clipped. Build it with the site font, the green button and no clipping.
- [FIX] Don't show relative dates like "1 week ago". Show a month and year, or no date.
- [TODO] The rating (4.9) and review count (204) go in `site.json`. Keep them easy to update.

---

## 7. Quote CTA band – `Call to Action` (second instance)
- Layout: dark panel (grey 900) with text on the left, photo on the right (720 × 596). On mobile, the text comes first, then the image.
- **Eyebrow:** NEED TREE WORK?
- **H2:** Request a free quotation
- Body:
  - [FIX] **If** you already know what tree work you would like priced, ACT Tree Felling provides free, no-obligation quotations.
  - If you are unsure what should be done and require professional advice about a tree's health, safety or management, please request an arborist consultation.
- Button: **Request a Quote** (primary) → `/contact/#quote`
- [PENDING] The designer may add a second button for "Book a consultation".

---

## 8. Why ACT Tree Felling – `cards`
- **Eyebrow:** WHY ACT TREE FELLING
- **H2:** Experience matters
- Intro:
  - Tree work can involve considerable risk to people, property and the tree itself.
  - ACT Tree Felling has been operating in Canberra since 1975 and has built decades of experience dealing with the region's tree species, weather conditions, urban environment and regulatory requirements.
  - Our team has the capability to undertake everything from everyday residential work to technically demanding jobs requiring specialised climbing, rigging and machinery.
- 4 cards (`Preview Cards`), each with an image (288 × 216), an H3 and text. 4 columns on desktop, 1 column on mobile.

| H3 | Text |
|---|---|
| Qualified people | Our tree work is undertaken by appropriately trained and experienced personnel, including qualified arborists. |
| Specialist equipment | Our trucks, chippers, stump grinders, climbing equipment and specialised machinery allow us to complete work efficiently and safely. |
| Professional standards | We take arboriculture seriously. Wherever practical, our preference is to retain healthy trees and recommend work that supports their long-term safety and condition. |
| Thorough clean-up | Our crews take pride not only in the tree work itself, but also in leaving the work area clean and tidy when the job is complete. |

- Button: **Discover more** (primary) → `/why-act-tree-felling/`
- [FIX] Cap the intro text's line length at about 70 characters.

---

## 9. Client logos – `LogoGrid`
- Layout: sand background (grey 200) with text on the left and a logo grid on the right. On mobile, the logos become two scrolling rows.
- **H2:** Trusted throughout Canberra
- Body:
  - Over more than five decades, ACT Tree Felling has undertaken arboricultural work for residential, commercial, government and institutional clients across Canberra.
  - Our previous work has included specialist tree services for prominent Canberra sites including the Australian National Botanic Gardens and the Prime Minister's Lodge.
- Logos seen so far:
  - ACT Government
  - Evoenergy
  - Antarctica New Zealand (mobile only)
  - ASX (mobile only)
  - Australian Bureau of Statistics (mobile only)
- [PENDING] The final logo list and the client's permission to use each logo. Build from `logos.json`, and use a static grid first. Only animate the logos if the designer specifies it, and respect `prefers-reduced-motion`.

---

## 10. Footer – `Footer`
- Dark background (grey 900).
- Nav: Home · Services · Why ACT Tree Felling [FIX: Figma says "Feeling"] · Resources · Careers · Contact
- Four columns:
  - **Get in touch:** Southside 02 6281 2687 · Northside 02 6162 2678 · Mobile 0417 492 760 · Email service@acttree.com.au. All are links: `tel:` / `mailto:`, with `data-track="phone"` on the `tel:` links.
  - **Office hours:** 7.30 am – 4.00 pm, Monday – Friday
  - **Street address:** 56 Port Arthur Street, Lyons ACT 2606
  - **Postal address:** PO Box 301, Curtin ACT 2605
- © {current year} ACT Tree Felling Pty Ltd · Privacy Policy
- Social icons:
  - Facebook, Instagram
  - X, YouTube [PENDING – confirm these accounts exist; hide them if the `site.json` URL is empty]
- Arboriculture Australia "Member" badge
- All the details above come from `site.json`, never hard-coded.

---

## Images needed from the designer (export-ready)

- **Hero:** 1467 × 762 on desktop, plus a mobile crop
- **Service cards:** 6 images at 395 × 219, plus Cabling & Bracing if it's added to the grid
  - one photo is reused: the green loader appears in both the Tree Removal card and the "Specialist equipment" card
- **Split sections:** 2 images, at 720 × 603 and 720 × 596
- **Why-us cards:** 4 images at 288 × 216
- **Logos:** SVG where possible
- **Arboriculture Australia badge**
- **Site logo:** SVG
- Supply every image at 2× these sizes. The build generates the responsive AVIF/WebP versions.
