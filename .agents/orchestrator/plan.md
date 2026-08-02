# Master Execution Plan: Portfolio UI/UX Overhaul

## Project Overview
Overhaul the frontend UI/UX of the portfolio application (`e:\MyPortfolio - Copy`) to address existing layout bugs, visual glitches, accessibility gaps, and animation flaws, while elevating visual design, responsiveness, and interactivity across all viewports without introducing regressions or breaking existing tests.

## Milestones & Decomposition

| Milestone | Title | Scope | Dependencies | Status |
|-----------|-------|-------|--------------|--------|
| **M1** | **Comprehensive UI/UX & Codebase Audit** | Codebase structure inspection, component inventory, baseline build/lint/test execution, issue cataloging | None | DONE |
| **M2** | **Design System & CSS Theme Engine** | HSL/CSS color tokens, dark/light theme switching, typography scaling, glassmorphism styles, shared animation variants | M1 | IN_PROGRESS |
| **M3** | **Page-by-Page & Component UX Overhaul** | Navigation/Navbar, Footer, Hero Section, Projects, Research/Lab, Publications, Contact, Cards & Modals | M2 | PLANNED |
| **M4** | **Micro-interactions, Accessibility & Responsive Hardening** | Hover effects, scroll triggers, keyboard navigation, touch targets, screen reader ARIA labels, responsive breakpoints | M3 | PLANNED |
| **M5** | **Regression Verification & Final Build Validation** | Full `npm run build`, `npm run lint`, `npm test` verification, forensic audit verification, victory summary | M4 | PLANNED |

## Orchestration Procedure & Iteration Loop
For each milestone:
1. **Explorer**: Investigate current codebase, catalog requirements/bugs, and propose concrete fix strategy.
2. **Worker**: Implement code changes, execute unit tests and build/lint commands, report outcomes.
3. **Reviewers**: Evaluate code quality, UI consistency, visual aesthetics, and component architecture.
4. **Challenger**: Empirically stress-test components, edge cases, responsive behavior, and build/test targets.
5. **Forensic Auditor**: Verify genuine code implementation without facades, hardcoding, or test bypassing.
6. **Gate Verification**: All tests pass, reviews clean, auditor CLEAN -> Mark milestone DONE.

## Code Layout & Standards
- Source components & pages: `src/` or `components/`, `pages/` / `app/`
- Styling: Tailwind CSS / CSS Modules / HSL Custom Properties
- Icons: Lucide React / React Icons
- Animations: Framer Motion
