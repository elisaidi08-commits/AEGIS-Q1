# CLAUDE.md

## Project Overview

**Aegis Bank — Q1** is a static neo-bank landing page built with pure HTML5 and CSS3. It is an educational UX/UI integration project based on a mid-fidelity wireframe/mockup. The site is in French (`lang="fr"`).

**Live demo:** https://leafy-cocada-121f1f.netlify.app/

## Repository Structure

```
AEGIS-Q1/
├── AEGIS BANK/              # Main project directory (note: contains a space)
│   ├── index.html            # Single-page entry point (84 lines)
│   └── assets/
│       └── css/
│           └── style.css     # All styles in one file (359 lines)
├── README.md                 # Project documentation (French)
└── CLAUDE.md                 # This file
```

There are only **2 source files** — one HTML file and one CSS file. No JavaScript is used.

## Tech Stack

- **HTML5** — semantic elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`)
- **CSS3** — custom properties, Flexbox, Grid, gradients, `min()` function
- **Google Fonts** — Montserrat (weights: 500, 700, 900)
- **Deployment** — Netlify (static hosting, no build step)

There is **no build system**, no package manager, no preprocessor, no JavaScript, no test framework, and no CI/CD pipeline.

## CSS Architecture

The stylesheet is organized into 10 clearly commented sections:

1. **RESET CSS** — box-sizing, margin/padding resets
2. **DESIGN SYSTEM** — CSS custom properties (`:root`)
3. **GLOBAL** — page-level styles, container sizing
4. **HEADER** — Flexbox layout for logo and menu toggle
5. **HERO** — Title, subtitle, CTA buttons
6. **BUTTONS** — Base `.btn` class with BEM modifiers
7. **PROMO CARD** — Feature card with badge and CTA
8. **SOCIAL** — CSS Grid layout for social link circles
9. **FOOTER** — Legal links section
10. **RESPONSIVE** — Single breakpoint at `768px`

### Design System Variables

| Category | Variables |
|----------|-----------|
| Colors | `--c-purple`, `--c-blue`, `--c-green`, `--c-teal`, `--c-ink`, `--c-ink-2`, `--c-line` |
| Typography | `--font-sans` (Montserrat + system fallbacks) |
| Layout | `--container` (420px mobile, 520px tablet) |
| Spacing | `--s-1` (8px) through `--s-5` (32px) |
| Radius | `--r-pill` (999px), `--r-card` (52px) |
| Shadows | `--shadow-soft`, `--shadow-glow` |

## Conventions

### CSS Naming: BEM Methodology

All class names follow **Block__Element--Modifier** (BEM):

- **Block:** `.site-header`, `.hero`, `.promo-card`, `.quick-links`, `.site-footer`
- **Element:** `.site-header__inner`, `.hero__title`, `.promo-card__badge`
- **Modifier:** `.btn--primary`, `.btn--secondary`

Class names use `kebab-case`. No camelCase, no underscores outside of BEM double-underscore separators.

### HTML Conventions

- Semantic HTML5 elements for document structure
- Accessibility attributes: `aria-label`, `aria-labelledby`, `aria-hidden`
- French-language content and comments
- CSS comments in French where inline (e.g., `/* 2 boutons en ligne */`)
- Section comments use `<!-- SECTION NAME (description) -->` format

### Responsive Design

- Mobile-first approach
- Single tablet breakpoint at `min-width: 768px`
- Container uses `min(100% - 24px, var(--container))` for fluid sizing

## Development Workflow

Since this is a static site with no build tools:

1. **Edit** `AEGIS BANK/index.html` or `AEGIS BANK/assets/css/style.css` directly
2. **Preview** by opening `index.html` in a browser
3. **Deploy** via Netlify (auto-deploys from the repository)

There are no npm scripts, linters, formatters, or tests to run.

## Important Notes for AI Assistants

- The main project directory `AEGIS BANK/` contains a **space** in its name — always quote paths when referencing it in shell commands
- This is a **static site** — do not introduce build tools, preprocessors, or JavaScript unless explicitly requested
- Maintain the existing **BEM naming convention** and **CSS section structure** when adding styles
- Use **CSS custom properties** from the design system rather than hardcoding values
- Keep **accessibility attributes** (`aria-*`) on new HTML elements
- Comments and content are in **French** — follow the existing language convention
- The CSS file is intentionally a **single file** with clear section separators — do not split it unless asked
- Preserve the **10-section CSS organization** and add new sections following the same comment format:
  ```css
  /* ==========================================================
     ##) SECTION NAME
     ========================================================== */
  ```
