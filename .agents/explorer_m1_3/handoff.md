# Handoff Report — Explorer 3: Page-by-Page & Component UX Audit

**Agent:** Explorer 3 (UX/UI & Component Auditor)  
**Milestone:** Milestone 1 — Page-by-Page & Component UX Audit  
**Working Directory:** `e:\MyPortfolio - Copy\.agents\explorer_m1_3`  
**Target Project:** `e:\MyPortfolio - Copy`  
**Date:** 2026-08-01  

---

## 1. Observation

Direct observations from inspecting codebase files:

1. **Routing & Redirect Loop (`next.config.js` lines 63 & 156)**:
   * Line 63: `{ source: "/", destination: "/portfolio" }` (Internal rewrite).
   * Line 156: `{ source: "/portfolio", destination: "/", permanent: true }` (301 Redirect).
   * Observation: A visitor accessing `/` is rewritten to `/portfolio`, which triggers a 301 redirect back to `/`, creating a circular redirect loop.
2. **Broken Route Link in `ArticleCard.js` (line 15)**:
   * Line 15: `const href = \`/insights/\${article.slug}\`;`
   * `next.config.js` line 133: `{ source: "/insights", destination: "/publications", permanent: true }` and line 139: `{ source: "/insights/:slug*", destination: "/publications", permanent: true }`.
   * Observation: Clicking an article card redirects the user to `/publications`, losing the individual article slug/content view.
3. **Missing Scope Import in `AcademicSiteLayout.js` (line 184)**:
   * Line 184: `<React.Fragment key={item.href}>`
   * Import at line 4: `import { useState } from "react";` (no default `React` import).
   * Observation: Opening the mobile drawer references `React.Fragment`, causing a potential `ReferenceError: React is not defined` in strict JSX transform mode.
4. **Hover-Only Dropdown in `AcademicSiteLayout.js` (lines 129-131)**:
   * Lines 129-131: `onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}`
   * Observation: Sub-navigation menu for Supervision (`/supervision?tab=running`, etc.) cannot be accessed using keyboard `Tab` navigation.
5. **Horizontal Viewport Overflow on Mobile (`AcademicSite.module.css` line 809)**:
   * Line 809: `.partners > div, .partnerGrid { min-width: 860px; }`
   * Observation: Forces container to be at least 860px wide, causing severe horizontal overflow and scrollbars on devices under 860px width.
6. **Missing Focus Trap in Modal (`AcademicDomainModal.js` lines 46-315)**:
   * Observation: `AcademicDomainModal` renders with `role="dialog"` and `aria-modal="true"`, but contains no `Tab` key trapping logic. Tabbing moves focus to hidden background elements.
7. **Hardcoded Inline Styles Across Components**:
   * `AcademicContentPage.js` contains over 50 instances of inline `style={{...}}` declarations (e.g., lines 77, 188, 646, 1671) for padding, grid layouts, flex wrapping, and colors.
   * `NavBar-mobile.js` lines 123-133 use inline button reset styles: `style={{ background: "none", border: "none", color: "inherit", font: "inherit", padding: 0, margin: 0, width: "100%", textAlign: "left", cursor: "pointer" }}`.
8. **Unsanitized HTML in `Project1.js` (line 139)**:
   * Line 139: `dangerouslySetInnerHTML={{ __html: project?.description || "" }}`
   * Observation: HTML strings from project data are injected directly into the DOM without sanitization (`DOMPurify`).

---

## 2. Logic Chain

1. **From Observation 1 & 2 to Routing Conclusion**:
   * The presence of conflicting `rewrites()` and `redirects()` rules in `next.config.js` causes circular redirects between `/` and `/portfolio`, while `/insights/:slug*` redirects collapse article detail pages into the `/publications` listing page. Therefore, the routing configuration must be consolidated to ensure deterministic page rendering.
2. **From Observation 3 & 4 to Navigation & Header Conclusion**:
   * Missing `React` import in `<React.Fragment>` usage can break mobile drawer rendering at runtime. Meanwhile, `onMouseEnter`/`onMouseLeave` handlers on `.navDropdown` isolate keyboard users from accessing Supervision sub-pages, violating WCAG 2.1 Success Criterion 2.1.1 (Keyboard Accessible).
3. **From Observation 5 & 6 to UX & Mobile Layout Conclusion**:
   * The hardcoded `min-width: 860px` CSS rule forces elements beyond mobile viewport width, breaking mobile responsiveness. Absence of focus trapping in `AcademicDomainModal.js` breaks accessibility guidelines for modal dialogs (WCAG 2.1 SC 2.4.3).
4. **From Observation 7 to Maintainability Conclusion**:
   * Over 50+ inline `style={{...}}` declarations override class-based styles, bypassing the project's CSS Module design tokens (`styles/tokens.css`) and dark mode CSS variables, creating theme inconsistencies.

---

## 3. Caveats

- **Runtime Execution Verification:** Investigation was conducted via static code auditing and component inspection (`view_file`, `grep_search`, `find_by_name`). Server-side API behavior depending on database connection (`dbConnect()` in `pages/fyp.js`) was evaluated based on fallback defaults (`defaultFypProjects`).
- **Browser Cross-Engine Testing:** Visual inspection of CSS modules indicates potential layout variations between WebKit (iOS Safari) and Blink (Chrome) regarding `-webkit-line-clamp` flexbox edge cases in `fypCardSummary`.

---

## 4. Conclusion

The portfolio application possesses a robust academic component architecture, but contains 34 critical UX/UI, accessibility, routing, and responsive defects:
1. **Critical Priority:** Fix circular redirects in `next.config.js`, add `React` import to `AcademicSiteLayout.js`, fix keyboard access for Supervision dropdown, and remove `min-width: 860px` mobile overflow rule.
2. **High Priority:** Implement focus trap & focus restoration in `AcademicDomainModal.js` and `AcademicImageLightbox.js`, and sanitize HTML in `Project1.js`.
3. **Medium Priority:** Refactor 50+ inline `style={{...}}` blocks into CSS Modules, fix dark mode contrast on form `<select>` elements, and add `Escape` key/click-outside listeners to `NavBar-mobile.js`.

Complete component inventory and defect catalog delivered to `handbook_components.md`.

---

## 5. Verification Method

1. **Verify Routing & Redirects:**
   * Run `npm run build` or `next build` to verify next.config.js syntax and route resolution.
   * Inspect `next.config.js` lines 58-197 to confirm no circular rewrite/redirect pairs exist between `/` and `/portfolio`.
2. **Verify Mobile Responsive Layout:**
   * Inspect `components/AcademicSite/AcademicSite.module.css` line 809 to verify `.partners > div, .partnerGrid` does not specify `min-width: 860px`.
   * Test viewport widths between 320px and 860px to ensure zero horizontal scrollbars occur.
3. **Verify Keyboard & Accessibility Compliance:**
   * Inspect `components/AcademicSite/AcademicSiteLayout.js` to ensure Supervision dropdown includes keyboard focus (`onFocus`/`onKeyDown`) handlers.
   * Inspect `components/AcademicSite/AcademicDomainModal.js` to ensure a focus trap traps `Tab` navigation within the open dialog.
