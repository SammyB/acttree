# Design tokens (from Figma)

These tokens were extracted on 26 Sep 2026 from the Figma file's variables and text styles, and checked against what the homepage frames actually use. The homepage mostly uses the file's styles (71 of 87 text layers), and about half of its colour fills are bound to variables. That means these values are the designer's intent, not guesses from screenshots.

## Fonts
- **Alexandria** is available on Google Fonts as a variable font. Load the 400, 500, 600 and 700 weights.
  - Headings use 600 (SemiBold).
  - Body text uses 400.
  - The footer column headings use 700.
- Fallback: `ui-sans-serif, system-ui, sans-serif`
- Ignore two fonts that appear in the file:
  - **Inter**, which only appears in the pasted Google-reviews mock-up
  - **Gotham**, which only appears in one leftover text style

## Type scale
Headings have two sizes. L–XL is for desktop, and S–M is for mobile and tablet. Each value below is font size / line height in px.

| Style | Desktop (L–XL) | Mobile (S–M) | Used for |
|---|---|---|---|
| h1 | 72 / 72 | 48 / 48 | Hero headline |
| h2 | 48 / 48 | 36 / 40 | Section headings |
| h3 | 30 / 36 | 24 / 32 | Card titles, trust labels |
| h4 | 24 / 32 | 22 / 30 | |
| h5 | 20 / 28 | 20 / 28 | |
| h6 | 18 / 24 | 18 / 24 | |
| body-xl | 24 / 32 | | |
| body-lg | 20 / 28 | | Hero intro |
| body-md | 18 / 26 | | Section intros, button text in the hero |
| body-base | 16 / 22 | | Default body, nav, buttons, eyebrows (uppercase) |
| body-sm | 14 / 20 | | |
| body-xs | 12 / 18 | | |

## Colours
The design uses a warm grey scale, which runs from cream to near-black, plus a green brand scale. The blue only appears in the logo.

| Token | Hex | Used for |
|---|---|---|
| grey-50 | `#fffcf7` | Page background (cream), text on dark backgrounds |
| grey-100 | `#fff9ed` | Alternate cream, text on dark backgrounds |
| grey-200 | `#e4d9cf` | Sand section background (logos) |
| grey-300 | `#c6bdb1` | |
| grey-400 | `#9e9689` | Disabled carousel button |
| grey-500 | `#80756b` | |
| grey-600 | `#62584d` | Muted text |
| grey-700 | `#443b2f` | **Body text** |
| grey-800 | `#261d11` | |
| grey-900 | `#1c1614` | **Headings**, dark sections, footer |
| green-500 | `#037b3e` | **Primary**: buttons, icons, links |
| green-600 | `#00672a` | Suggested primary hover (no hover state is designed yet) |
| green-700 | `#005316` | |
| blue-500 | `#047dba` | Logo only |
| blue-800 | `#00417e` | Logo only |
| white | `#ffffff` | Cards |

The full green and blue scales are in the Figma variables if they're needed. The naming is unusual, though: "50" is a mid tone rather than the lightest tint, and blue-100 is identical to blue-200. Only use the values listed above.

**Contrast:** every text/background pair used on the homepage passes WCAG AA.
- Cream text on green: 5.25:1
- Body text on cream: 10.7:1
- Headings on cream: 17:1

## Spacing
The design's spacing values are 4, 8, 12, 16, 24, 32, 48, 64, 72, 96 and 128 px. These are multiples of 4, so Tailwind's default spacing scale already covers them (`1` = 4px, and so on up to `32` = 128px). You don't need a custom spacing scale.

- **Container:** designed at 1440 wide with 96px side padding, so content is at most **1248px** wide. On mobile the side padding is 24px.
- **Section spacing:** the Figma varies between 76, 88, 96 and 108px (flagged to the designer). Standardise on **96px** on desktop and **64px** on mobile.

## Border radius
| Use | px |
|---|---|
| Buttons, inputs | 6 |
| Small chips | 4 / 8 |
| Cards, images | 16 |
| Round carousel buttons | full |

Card shadow: a soft drop shadow on the white service cards. Take the exact values from the `CardBase - new` component.

## Icons
The file uses icons named `User Interface / Chevron Right Circle`, `Map / Map`, `People / User Check`, `Document / File Certificate`, `Document / Certificate`, `Buildings / Building Community` and `Nature / Leaf`. **Ask the designer which icon library these come from.** Until then, export them from Figma as SVGs into `src/assets/icons/`.

## Tailwind mapping (v4, CSS-first)
```css
@import "tailwindcss";

@theme {
  --font-sans: "Alexandria", ui-sans-serif, system-ui, sans-serif;

  --color-cream: #fffcf7;      /* grey-50  */
  --color-cream-alt: #fff9ed;  /* grey-100 */
  --color-sand: #e4d9cf;       /* grey-200 */
  --color-stone-400: #9e9689;
  --color-stone-600: #62584d;
  --color-body: #443b2f;       /* grey-700 */
  --color-ink: #1c1614;        /* grey-900 */
  --color-brand: #037b3e;      /* green-500 */
  --color-brand-dark: #00672a; /* green-600 */

  --radius-btn: 6px;
  --radius-card: 16px;

  --container-site: 1248px;
}
```
If the scaffold uses Tailwind v3, put the same values under `theme.extend` in `tailwind.config.js`.

## Figma leftovers to ignore
- The `Themes` variable collection comes from another project; its `brand` value is "Cogito Group".
- The `Dimentions` collection has junk entries set to 0 (`large 2`, `xlarge 2`).
- There are many `Tailwind/…` text styles that the homepage doesn't use.
