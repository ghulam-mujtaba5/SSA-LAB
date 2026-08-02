# Milestone 1 Audit Synthesis & Summary

## Overview
Comprehensive UI/UX, Design System, Component, and Routing Audit conducted by specialist Explorers.

---

## Key Discoveries & Defect Catalog

### 1. Design System & CSS Theme Engine (`explorer_m1_2`)
- **Zero HSL Tokens**: `styles/tokens.css` relies entirely on Hex (`#0284c7`, `#6366f1`) and RGBA strings. No HSL/HSLA custom properties exist, preventing standard dynamic color tinting.
- **Font System Disconnect**: `pages/_document.js` imports Google Fonts *Open Sans* and *Poppins*, while `pages/global.css` declares `body` as `"Inter"` and `code` as `"JetBrains Mono"`, neither of which are loaded.
- **Theme Provider Conflict**: `pages/_app.js` renders custom `ThemeContext.js`, but `pages/admin/articles/index.js` imports `useTheme` from `"next-themes"`, breaking theme state in the admin section.
- **Split CSS Module Anti-Pattern**: 32 components import separate `.dark.module.css` files and choose styles via JS props (`theme === 'dark' ? dark : light`), inflating bundle size and risking SSR hydration mismatches.
- **WCAG AA Contrast Failures**:
  - `styles/Search.module.css`: `#9ca3af` on `#ffffff` (**1.95:1**)
  - `styles/ServicesPage.module.css`: `#a0aec0` on `#ffffff` (**2.45:1**)
  - `styles/ServicesPage.module.css`: `#555555` on `#1d2127` (**2.70:1**)
- **Legacy Hex Contamination**: `#4573df` (Royal Blue) mixed across 20+ CSS files alongside modern `#0284c7` and `#6366f1`.

### 2. Page & Component UX Audit (`explorer_m1_3`)
- **Circular Redirect Loop**: `next.config.js` rewrites `/` to `/portfolio` and 301 redirects `/portfolio` to `/`.
- **Broken Article Link**: `ArticleCard.js` links to `/insights/${slug}`, but `next.config.js` redirects `/insights/:slug*` to `/publications`, breaking individual article pages.
- **Runtime Scope Error**: `AcademicSiteLayout.js` uses `<React.Fragment>` without importing `React`, risking runtime failure when opening mobile drawer.
- **Keyboard Inaccessible Dropdown**: Supervision dropdown uses `onMouseEnter`/`onMouseLeave` only.
- **Mobile Viewport Overflow**: `AcademicSite.module.css` specifies `min-width: 860px` on `.partnerGrid`, breaking mobile devices under 860px.
- **Missing Focus Traps**: `AcademicDomainModal.js` dialog lacks tabbing focus trap and Escape listener.
- **50+ Inline Style Declarations**: Hardcoded `style={{...}}` blocks across `AcademicContentPage.js` and `NavBar-mobile.js`.
- **Unsanitized HTML Injection**: `Project1.js` uses `dangerouslySetInnerHTML` directly without sanitization.

---

## Action Plan for Implementation Milestones

1. **Milestone 2 (Design System & Theme Engine)**:
   - Convert `styles/tokens.css` to full HSL variable palette with light/dark CSS custom properties on `:root` and `[data-theme="dark"]`.
   - Reconcile `pages/_document.js` font preloads (`Inter` + `JetBrains Mono` + `Poppins`).
   - Unify `ThemeContext.js` and fix `next-themes` mismatch.
   - Refactor 32 split CSS modules into CSS variables.

2. **Milestone 3 (Page-by-Page & Component Overhaul)**:
   - Fix `next.config.js` circular rewrites/redirects and article slug routes.
   - Add missing `React` import in `AcademicSiteLayout.js`.
   - Remove `min-width: 860px` overflow in `AcademicSite.module.css`.
   - Refactor inline styles to CSS modules.
   - Sanitize HTML in `Project1.js`.

3. **Milestone 4 (Micro-animations & Accessibility)**:
   - Implement keyboard focus trapping in `AcademicDomainModal.js` & `AcademicImageLightbox.js`.
   - Upgrade hover dropdowns to handle keyboard focus (`onFocus`/`onBlur`/`onKeyDown`).
   - Fix WCAG AA contrast failures across search, services, and academic components.
   - Enhance Framer Motion micro-interactions on cards, buttons, and mobile navigation.

4. **Milestone 5 (Verification & Regression Testing)**:
   - Build, lint, and unit test execution via Worker & Reviewer.
   - Forensic integrity audit.
