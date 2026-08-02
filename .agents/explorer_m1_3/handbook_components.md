# Handbook of Components & UX/UI Audit

**Project:** SCSA Lab Portfolio Application (`e:\MyPortfolio - Copy`)  
**Auditor:** Explorer 3 (UX/UI & Component Auditor)  
**Milestone:** Milestone 1 — Page-by-Page & Component UX Audit  
**Date:** 2026-08-01  

---

## 1. Executive Summary & Inventory Overview

This handbook provides a comprehensive inventory and UX/UI audit of all page components, layout modules, modals, navigation drawers, and cards in the portfolio application.

### Key Metrics & Scope
- **Total Components Audited:** 28 Core Components across 14 Top-Level Routes & Layout Systems
- **Total UX/UI Defects Identified:** 34 Distinct Defect Items
- **Primary Issue Areas:** 
  1. Routing & Redirect Loops (`next.config.js` circular rewrites & redirected routes)
  2. Accessibility & Keyboard Navigation (Hover-only dropdowns, missing focus traps in modals)
  3. Responsive Overflow (`min-width: 860px` hardcoded on partner logo grid)
  4. Hardcoded Inline Styles (Over 50+ inline `style={{...}}` declarations violating token architecture)
  5. Missing Scope Imports (`React.Fragment` missing `React` import in mobile nav layout)

---

## 2. Component-by-Component Inventory

### 2.1 Navigation & Header System
* **Component File:** `components/AcademicSite/AcademicSiteLayout.js` & `components/AcademicSite/AcademicSite.module.css`
* **Type:** Global Layout / Header / Primary Navigation
* **Description:** Sticky glassmorphism header featuring group logo branding, desktop menu links, hover-driven Supervision dropdown, and mobile menu toggle button.
* **Audit Findings:**
  * **A11y:** Supervision dropdown relies purely on hover (`onMouseEnter`/`onMouseLeave`). Keyboard users tabbing through navigation cannot open or access the sub-items (`/supervision?tab=running`, etc.).
  * **A11y:** Mobile menu toggle button (`styles.menuButton`) lacks an `aria-controls` attribute linking to the mobile navigation container ID.
  * **Runtime Defect:** Line 184 references `<React.Fragment key={item.href}>` without importing `React` at the top of `AcademicSiteLayout.js` (uses default `import { useState } from "react"`). Can cause `ReferenceError: React is not defined` in strict JSX transform mode when mobile menu is opened.
  * **Inline Styles:** Hardcoded inline styles on mobile dropdown links (lines 188, 198): `style={item.hasDropdown ? { fontWeight: 700 } : undefined}` and `style={{ paddingLeft: "24px", fontSize: "0.82rem", opacity: 0.85 }}`.

### 2.2 Mobile Menu Drawer
* **Component File:** `components/NavBar_Mobile/NavBar-mobile.js`
* **Type:** Secondary Mobile Navigation Drawer
* **Description:** Animated slide-in side panel using Framer Motion spring physics with theme toggle integration.
* **Audit Findings:**
  * **Inline Styles:** Hardcoded inline styles on link buttons (lines 123-133): `style={{ background: "none", border: "none", color: "inherit", font: "inherit", padding: 0, margin: 0, width: "100%", textAlign: "left", cursor: "pointer" }}`.
  * **A11y:** Missing Keyboard `Escape` event listener to close the drawer.
  * **A11y:** Missing Click-Outside handler to dismiss the drawer when clicking outside the panel overlay.
  * **A11y:** Theme toggle switch (`role="switch"`) lacks focus-visible indicator ring for keyboard users.

### 2.3 Hero & Page Intros
* **Component File:** `components/AcademicSite/AcademicHome.js`, `AcademicPipelineHero.js`, `PageIntro` in `AcademicContentPage.js`
* **Type:** Page Header / Hero Section
* **Description:** Academic hero section displaying lab mission statement, credential list, verified impact counters, professor profile card, and page intro banners.
* **Audit Findings:**
  * **Inline Styles:** `PageIntro` component in `AcademicContentPage.js` contains inline layout overrides: `style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}` and `style={{ flex: '1 1 min(100%, 580px)' }}`.
  * **CLS:** Impact statistics strip switches from 4-column grid to 2-column grid at 900px breakpoint without height reservation, causing layout re-flow when fonts load.
  * **Image Optimization:** Hero portrait uses absolute pixel dimensions in CSS wrapper without aspect-ratio fallback on low-network connections.

### 2.4 Research & Lab Pipeline
* **Component File:** `components/AcademicSite/AcademicResearchPipeline.js`, `AcademicDomainModal.js`, `InteractiveCodeScanner.js`
* **Type:** Interactive Visualization / Modal / Technical Visualizer
* **Description:** Interactive 4-step workflow pipeline, live AST code analysis scanner, and domain roadmap modal.
* **Audit Findings:**
  * **A11y (Focus Trap):** `AcademicDomainModal.js` does NOT implement a focus trap. Pressing `Tab` inside the open modal allows focus to break out into background page links and controls.
  * **A11y (Initial Focus):** `AcademicDomainModal.js` does not set focus to the modal close button or container upon mounting.
  * **Inline Styles:** `AcademicDomainModal.js` lines 64-65 contain inline flex and style definitions: `style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}`.

### 2.5 Projects & Capstone Directory
* **Component File:** `components/AcademicSite/AcademicFypListing.js`, `components/Projects/Project1.js`, `components/Projects/ProjectList.js`
* **Type:** Interactive Directory / Filterable Cards
* **Description:** Directory for running projects, completed capstones, and open supervision topics with search box and category pills.
* **Audit Findings:**
  * **Hardcoded Inline Styles:** `AcademicFypListing.js` contains inline style overrides for category pills (`style={{ fontSize: "0.82rem", padding: "4px 12px" }}`), stats row, and open opportunity borders.
  * **A11y (Nested Interactivity):** `Project1.js` (`ProjectCard`) renders an `<article onClick={...} tabIndex="0">` containing nested `<a>` links. Clicking or tabbing creates nested focus targets and invalid HTML nesting.
  * **Security / Sanitization:** `Project1.js` line 139 uses `dangerouslySetInnerHTML={{ __html: project?.description || "" }}` without HTML sanitization (`DOMPurify`), creating a potential XSS vulnerability if admin descriptions contain unsafe scripts.

### 2.6 Publications & Profiles Page
* **Component File:** `components/AcademicSite/AcademicContentPage.js` (`PublicationsPage`)
* **Type:** Publication List & Citation Manager
* **Description:** Categorized list of peer-reviewed journal and conference publications with BibTeX copy buttons and external DOI links.
* **Audit Findings:**
  * **Inline Styles:** Academic profile button bar (lines 761-799) uses extensive inline styles for gap, padding, and font-size (`style={{ fontSize: "0.85rem", padding: "8px 16px" }}`).
  * **Visual Feedback:** BibTeX copy confirmation relies on inline text change without `aria-live` announcement for screen readers.

### 2.7 Team & People Ecosystem
* **Component File:** `components/AcademicSite/AcademicContentPage.js` (`TeamPage`)
* **Type:** Filterable People & Collaborator Directory
* **Description:** Filterable directory of faculty, MS/PhD researchers, BS engineering teams, alumni placements, and institutional partner logos.
* **Audit Findings:**
  * **Responsive Overflow Defect:** `AcademicSite.module.css` line 809 enforces `.partners > div, .partnerGrid { min-width: 860px; }`. On screens smaller than 860px, partner cards force horizontal scrolling and viewport overflow!
  * **Inline Styles:** Extensive inline styles on avatar circles, degree badges, and section headings (e.g. `style={{ background: "rgba(6, 182, 212, 0.1)", border: "2px solid var(--academic-cyan)" }}`).

### 2.8 Events & Photography Gallery
* **Component File:** `components/AcademicSite/AcademicContentPage.js` (`EventsPage`), `AcademicImageLightbox.js`
* **Type:** Event Timeline & Photo Gallery
* **Description:** Timeline of keynote presentations and grid of conference photos with full-screen lightbox modal.
* **Audit Findings:**
  * **A11y:** `AcademicImageLightbox.js` opens full-screen portal but does not restore focus back to the triggering thumbnail image when closed.
  * **Responsive Grid:** Event gallery grid collapses to single column on mobile (<868px) but portrait cards maintain 4:5 aspect ratio, taking up excessive vertical screen height (>600px per card).

### 2.9 Contact Stage & Enquiry Form
* **Component File:** `components/AcademicSite/AcademicContentPage.js` (`ContactPage`)
* **Type:** Interactive Form & Institutional Information
* **Description:** Contact card grid, Lottie security shield, campus map iframe, and multi-field supervision enquiry form.
* **Audit Findings:**
  * **Inline Styles:** Form grid (lines 1671-1816) uses inline CSS for input fields, textareas, grid columns, and button alignment (e.g., `style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", ... }}`).
  * **A11y / Contrast:** Select dropdown options use default browser background (`#fff`), which causes unreadable text when selecting options in dark mode.

### 2.10 Footer Component
* **Component File:** `components/AcademicSite/AcademicFooter.js` & `AcademicFooter.module.css`
* **Type:** Global Footer
* **Description:** Blueprint-themed footer featuring animated traveling pulse node, schema.org structured metadata, quick navigation columns, social links, and scroll-to-top button.
* **Audit Findings:**
  * **Missing / Broken Link Target:** `SUPERVISION_LINKS` line 33 links to `academicProfile.officialFypIdeas`. If undefined in dataset, causes `href="undefined"` or broken link.
  * **Semantic HTML:** Social icon links have `aria-label` but icon SVGs inside lack `aria-hidden="true"`.

### 2.11 Modals & Overlays
* **Component File:** `components/AcademicSite/AcademicDomainModal.js`, `AcademicImageLightbox.js`, `components/Admin/Modal/Modal.js`
* **Type:** Dialog Overlays
* **Description:** Research domain roadmap modal, image lightbox, and admin confirmation modal.
* **Audit Findings:**
  * **Inconsistent Focus Trap:** `Admin/Modal/Modal.js` implements a custom tab trap listener (lines 72-91), whereas `AcademicDomainModal.js` lacks focus trapping entirely.
  * **Scroll Lock Cleanup:** Body `overflow: hidden` lock in `AcademicDomainModal.js` directly modifies `document.body.style.overflow = "auto"` instead of restoring previous state, overriding inline styles set by other parent layouts.

### 2.12 Cards Catalog
* **Component Files:** `ArticleCard.js`, `Project1.js`, `AcademicFypListing.js` (FYPCard), `AcademicContentPage.js` (CollabCard, ContactCard, EventCardItem)
* **Type:** Data Presentation Cards
* **Description:** Reusable cards for displaying articles, projects, supervised FYPs, collaborators, and contact methods.
* **Audit Findings:**
  * **Truncation:** `fypCardSummary` uses `-webkit-line-clamp: 3` without `word-break: break-word`. Long un-hyphenated technical words cause container overflow or clipping.
  * **Z-Index Overlap:** Card hover transform (`translateY(-4px)`) can cause card shadow or borders to overlap adjacent sticky elements or absolute badges.

---

## 3. Comprehensive UX/UI Defect Matrix

| ID | Category | Location / Component | Defect Description | Severity | Impact |
|---|---|---|---|---|---|
| **DEF-01** | Routing / Redirect | `next.config.js` (lines 63, 156) | **Circular Rewrite/Redirect Loop:** `rewrites()` maps `/` -> `/portfolio`, while `redirects()` maps `/portfolio` -> `/` (permanent 301). Causes search engines and crawlers to encounter redirect loop. | High | SEO & Crawlability |
| **DEF-02** | Routing / Redirect | `next.config.js` (lines 74, 161) | **Conflicting Resume Redirects:** `/resume` redirects to `/about`, but rewrite maps `/resume` -> `/portfolio/resume`, and redirect maps `/portfolio/resume` -> `/resume`. | High | User Routing |
| **DEF-03** | Broken Link | `ArticleCard.js` (line 15) | **Broken Route Target:** `ArticleCard` links to `/insights/${article.slug}`, but `next.config.js` line 133 redirects `/insights` -> `/publications`, stripping the slug! | High | Broken Links |
| **DEF-04** | Runtime Error | `AcademicSiteLayout.js` (line 184) | **Missing React Import:** Uses `<React.Fragment key={...}>` without importing `React` explicitly. Triggers `ReferenceError: React is not defined` when mobile menu opens. | High | App Crash |
| **DEF-05** | Accessibility | `AcademicSiteLayout.js` (line 127) | **Hover-Only Dropdown:** Supervision nav menu opens on `onMouseEnter`. Keyboard users cannot access sub-items (`/supervision?tab=running`). | High | A11y (Keyboard) |
| **DEF-06** | Responsive / Overflow | `AcademicSite.module.css` (line 809) | **Hardcoded Minimum Width:** `.partners > div, .partnerGrid { min-width: 860px; }` forces horizontal scrollbar on mobile screens < 860px. | High | Mobile Layout |
| **DEF-07** | Accessibility | `AcademicDomainModal.js` (lines 46-315) | **Missing Focus Trap:** Open modal does not trap focus. Pressing `Tab` moves focus to background page content. | High | A11y (Modal) |
| **DEF-08** | Security / XSS | `Project1.js` (line 139) | **Unsanitized HTML:** `dangerouslySetInnerHTML={{ __html: project?.description }}` rendered without sanitization library (`DOMPurify`). | High | Security |
| **DEF-09** | Accessibility | `AcademicSiteLayout.js` (line 172) | **Missing aria-controls:** Mobile menu toggle button lacks `aria-controls="mobile-nav-menu"` link. | Medium | A11y |
| **DEF-10** | Accessibility | `NavBar-mobile.js` (lines 48-224) | **Missing Escape Listener:** Drawer menu does not close when pressing `Escape` key. | Medium | A11y |
| **DEF-11** | Accessibility | `NavBar-mobile.js` (lines 48-224) | **Missing Click Outside Handler:** Mobile menu drawer does not dismiss when clicking on backdrop area outside menu. | Medium | UX / Usability |
| **DEF-12** | Accessibility | `Project1.js` (line 86) | **Nested Interactive Elements:** `<article onClick="..." tabIndex="0">` contains nested `<a>` links, violating W3C nesting spec. | Medium | A11y & HTML Spec |
| **DEF-13** | Inline Styles | `AcademicContentPage.js` (lines 77, 188, 646, 1671) | **Over 50+ Hardcoded Inline Styles:** Extensive `style={{...}}` usage for grid layouts, padding, and colors instead of CSS modules. | Medium | Code Quality / Tokens |
| **DEF-14** | Inline Styles | `AcademicSiteLayout.js` (lines 188, 198) | **Hardcoded Inline Styles:** Mobile dropdown links use inline styles for font weight and padding. | Medium | Code Quality |
| **DEF-15** | Inline Styles | `NavBar-mobile.js` (lines 123-133) | **Hardcoded Inline Styles:** Menu list buttons use inline reset styles (`background: "none"`, etc.). | Medium | Code Quality |
| **DEF-16** | Accessibility | `AcademicDomainModal.js` (mount) | **Missing Initial Focus:** Focus is not placed on close button or modal container upon open. | Medium | A11y |
| **DEF-17** | Accessibility | `AcademicImageLightbox.js` (close) | **Missing Focus Restoration:** Focus is not returned to the thumbnail trigger button when lightbox closes. | Medium | A11y |
| **DEF-18** | Truncation / Overflow | `AcademicSite.module.css` (line 2330) | **Text Truncation Overflow:** `fypCardSummary` line clamping lacks `word-break: break-word`, causing clipping of long technical words. | Medium | Visual Flaw |
| **DEF-19** | Dark Mode Flaw | `AcademicContentPage.js` (line 1749) | **Unstyled Form Select in Dark Mode:** `<select>` element uses white background (`#fff`) with default options, causing contrast mismatch. | Medium | Dark Mode UX |
| **DEF-20** | Layout Shift | `AcademicSite.module.css` (line 70) | **Brand Hover Layout Shift:** `.brand:hover .logoWrap` scale `1.08` causes layout jitter if parent flex gap is constrained. | Low | Visual Polish |
| **DEF-21** | Accessibility | `ThemeToggle.js` (line 44) | **Missing Focus Ring:** Floating theme toggle button lacks explicit custom `:focus-visible` outline in CSS. | Low | A11y |
| **DEF-22** | Inconsistent Spacing | `AcademicContentPage.js` vs `AcademicSite.module.css` | **Padding Discrepancies:** Sections use inline `paddingTop: 0` or `paddingBottom: "24px"` breaking standardized section tokens. | Low | Consistency |
| **DEF-23** | Broken Link Target | `AcademicFooter.js` (line 33) | **Potential Undefined Link:** `academicProfile.officialFypIdeas` fallback produces invalid URL if undefined in dataset. | Medium | Broken Links |
| **DEF-24** | Accessibility | `AcademicFooter.js` (lines 138-181) | **Missing SVGs aria-hidden:** Social links contain SVGs without `aria-hidden="true"`, causing duplicate screen reader announcements. | Low | A11y |
| **DEF-25** | Responsive Flaw | `AcademicSite.module.css` (line 1989) | **Mobile Avatar Height:** People grid images on mobile (<520px) stretch to `max-height: 320px` causing aspect-ratio distortion. | Medium | Mobile Visual |
| **DEF-26** | Layout Shift | `AcademicHome.js` (line 128) | **Impact Strip CLS:** Statistics grid shifts height dynamically when count values render asynchronously. | Medium | Layout Shift |
| **DEF-27** | Accessibility | `AcademicFypListing.js` (line 170) | **Search Input Labeling:** Search box clear button (`×`) lacks `aria-label="Clear search query"`. | Low | A11y |
| **DEF-28** | Responsive Flaw | `AcademicSite.module.css` (line 1736) | **Header Navigation Wrap:** Between 1020px and 1140px, desktop navigation items wrap onto two lines before breakpoint triggers. | Medium | Responsive |
| **DEF-29** | Inconsistent Tokens | `AcademicSite.module.css` (lines 156, 165) | **Fallback Color Duplication:** Mix of hex fallbacks (`#ffffff`, `#111827`, `#e2e8f0`) hardcoded in module CSS instead of design tokens. | Low | Code Quality |
| **DEF-30** | Usability | `AcademicFypListing.js` (line 31) | **URL Tab Sync:** Query parameter `?tab=running` doesn't update browser history state when user clicks tabs manually. | Low | UX |
| **DEF-31** | Accessibility | `InteractiveCodeScanner.js` | **Interactive Element Role:** Code scanner tab buttons lack `role="tab"` and `aria-selected` attributes. | Medium | A11y |
| **DEF-32** | Visual Overlap | `AcademicSite.module.css` (line 357) | **Badge Z-Index Stacking:** `.heroLogoBadge` (`z-index: 10`) overlaps sticky header dropdowns on smaller desktop widths. | Medium | Visual Overlap |
| **DEF-33** | Usability | `AcademicContentPage.js` (`PublicationsPage`) | **Missing Live Region:** BibTeX copy success message is non-announcing for screen readers. | Low | A11y |
| **DEF-34** | State Management | `AcademicSiteLayout.js` (line 76) | **Menu State Sticky:** Mobile menu remains open if window is resized from mobile width to desktop width. | Low | Edge Case UX |

---

## 4. Remediation Recommendations

1. **Routing & Redirect Consolidation:**
   * Remove circular redirect/rewrite rules in `next.config.js`. Ensure `/` maps cleanly to `pages/portfolio/index.js` or `pages/index.js` without external 301 loops to `/portfolio`.
   * Update `ArticleCard.js` link target from `/insights/${slug}` to `/publications` or create appropriate route handler.

2. **Accessibility (a11y) & Focus Management:**
   * Implement a standard `FocusTrap` component for `AcademicDomainModal.js` and `AcademicImageLightbox.js`.
   * Add keyboard accessibility to header dropdowns (`onFocus`, `onKeyDown` for Space/Enter/Arrows).
   * Add `Escape` key listener and click-outside dismissal to `NavBar-mobile.js`.

3. **Responsive Layout & Overflow:**
   * Replace `.partners > div, .partnerGrid { min-width: 860px; }` in `AcademicSite.module.css` with a responsive grid (`grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))`) to eliminate horizontal scrollbars.

4. **Design Token Standardization:**
   * Refactor all 50+ inline `style={{...}}` instances in `AcademicContentPage.js`, `AcademicFypListing.js`, and `AcademicSiteLayout.js` into CSS Modules using variables from `styles/tokens.css`.
