# CLAUDE.md — Aegis Bank Q1

## Project Overview

Aegis Bank Q1 is a static front-end landing page for a neo-banking product targeted at young people. It is an educational UX/UI integration project (Q1 school assignment) built with vanilla HTML5 and CSS3 — no JavaScript, no frameworks, no build tools.

**Live demo:** https://leafy-cocada-121f1f.netlify.app/

## Repository Structure

```
AEGIS-Q1/
├── CLAUDE.md              # This file — AI assistant guide
├── README.md              # Project documentation (French)
├── .gitignore             # Ignores .DS_Store, Thumbs.db
└── AEGIS BANK/            # Main project directory (note: space in name)
    ├── index.html          # Single-page HTML entry point
    └── assets/
        └── css/
            └── style.css   # Single stylesheet (all styles)
```

**Important:** The main project directory is named `AEGIS BANK` (with a space). Always quote this path in shell commands:
```bash
cd "AEGIS BANK"
```

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Markup     | HTML5 (semantic)        |
| Styling    | CSS3 (custom properties, Flexbox, Grid) |
| Font       | Google Fonts — Montserrat (500, 700, 900) |
| Deployment | Netlify (auto-deploy from git) |

There are **no** build tools, package managers, bundlers, linters, test frameworks, or JavaScript files.

## Architecture & Key Conventions

### HTML (`index.html`)

- **Language:** French (`lang="fr"`)
- **Semantic elements:** `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`
- **Accessibility:** ARIA attributes (`aria-label`, `aria-labelledby`) on interactive and landmark elements
- **Section comments** mark each major block:
  ```html
  <!-- HEADER (logo + menu) -->
  <!-- HERO (titre + sous-titre + 2 boutons) -->
  <!-- PROMO (grosse card + badge + bouton) -->
  <!-- SOCIAL (3 ronds) -->
  <!-- FOOTER -->
  ```

### CSS (`style.css`)

- **Methodology:** BEM (Block Element Modifier)
  - Block: `.hero`, `.promo-card`, `.site-header`
  - Element: `.hero__title`, `.promo-card__badge`
  - Modifier: `.btn--primary`, `.btn--outline`

- **Numbered sections** organize the stylesheet:
  ```
  01) RESET CSS
  02) DESIGN SYSTEM (Variables CSS)
  03) GLOBAL
  04) HEADER (Flexbox)
  05) HERO
  06) BUTTONS (BEM modifiers)
  07) PROMO CARD
  08) SOCIAL (Grid)
  09) FOOTER (Liens légaux)
  10) RESPONSIVE
  ```

- **CSS Custom Properties (design tokens):**
  - Colors: `--c-purple`, `--c-blue`, `--c-green`, `--c-teal`, `--c-ink`, `--c-ink-dark`
  - Font: `--font-main`
  - Spacing: `--s-1` through `--s-5` (8px base unit)
  - Radius: `--r-pill` (999px), `--r-card` (52px), `--r-btn` (6px)
  - Shadows: `--shadow-soft`, `--shadow-glow`
  - Layout: `--container`

- **Responsive:** Mobile-first with a single breakpoint at `768px`

- **Layout techniques:** Flexbox (header, buttons, hero) and CSS Grid (social links section)

## Development Workflow

### Local development

No build step is needed. Open `AEGIS BANK/index.html` directly in a browser or use any static file server:

```bash
# Python
python3 -m http.server -d "AEGIS BANK" 8000

# Node (if npx available)
npx serve "AEGIS BANK"
```

### Deployment

The site is deployed on Netlify via git-based auto-deploy. Pushing to the main branch triggers a new deployment. There is no build command — Netlify serves the static files directly.

### Testing

There is no automated test suite. Validation is manual:
- Visual inspection against wireframe/mockup
- Browser dev tools responsive mode for mobile/desktop checks
- HTML validation via [W3C Validator](https://validator.w3.org/)
- Accessibility checks via browser dev tools or aXe

## Guidelines for AI Assistants

1. **Preserve BEM naming** — all new CSS classes must follow the `block__element--modifier` pattern already in use.
2. **Use existing CSS custom properties** — do not hard-code colors, spacing, or radii. Reference the variables defined in the `02) DESIGN SYSTEM` section.
3. **Keep it vanilla** — do not introduce JavaScript, build tools, or external dependencies unless explicitly requested.
4. **Maintain numbered CSS sections** — new styles should be placed in the appropriate existing section or in a new numbered section appended before `10) RESPONSIVE`.
5. **Semantic HTML** — use appropriate HTML5 elements and maintain ARIA attributes for accessibility.
6. **French content** — the page content is in French. Preserve French language for user-facing text. Code comments may be in French or English.
7. **Quote the project path** — the directory `AEGIS BANK` has a space. Always quote it in commands and paths.
8. **Mobile-first CSS** — write base styles for mobile, then override inside the `@media (min-width: 768px)` block.
9. **No over-engineering** — this is a simple static page. Keep changes minimal and focused.
