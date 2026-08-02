## 2026-08-01T16:27:55Z
You are Worker M2 responsible for implementing Milestone 2: Design System, Tokens, Fonts, and Theme Engine Refactoring for the Portfolio Application.

Working directory for your metadata: e:\MyPortfolio - Copy\.agents\worker_m2
Project root directory: e:\MyPortfolio - Copy

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Directives:
1. **HSL Token Architecture in `styles/tokens.css`**:
   - Refactor `styles/tokens.css` to define custom CSS properties using HSL format (e.g. `--primary-hsl: 199 95% 45%`, `--primary: hsl(var(--primary-hsl))`, `--primary-foreground`, `--background-hsl`, `--background`, `--foreground-hsl`, `--foreground`, `--muted-hsl`, `--muted`, `--muted-foreground-hsl`, `--muted-foreground`, `--card-hsl`, `--card`, `--border-hsl`, `--border`, `--accent-hsl`, `--accent`, `--glass-bg`, `--glass-border`, etc.).
   - Define both `:root` (light theme) and `[data-theme="dark"]` / `.dark` (dark theme) rules cleanly.
   - Maintain compatibility with existing CSS class names while modernizing color token management.

2. **Font System Fix in `pages/_document.js` & `pages/global.css`**:
   - Update `pages/_document.js` Google Fonts `<link>` imports to include `Inter:wght@400;500;600;700` and `JetBrains+Mono:wght@400;500;600` alongside Poppins/Open Sans.
   - Verify `pages/global.css` `body` font family specifies `'Inter', sans-serif` and `code` specifies `'JetBrains Mono', monospace`.

3. **Theme Engine & Provider Reconciliation**:
   - Fix `pages/admin/articles/index.js` line 5 where `useTheme` is imported from `"next-themes"`. Change it to import `useTheme` from `../../../context/ThemeContext` (or wrap with appropriate theme provider in `_app.js`), ensuring admin pages correctly access active theme state.

4. **WCAG AA Contrast Resolution**:
   - Fix low contrast text colors:
     - `styles/Search.module.css` line 168: change `#9ca3af` on `#ffffff` to high contrast color (`#4b5563` / `--muted-foreground`, >= 4.5:1 ratio).
     - `styles/ServicesPage.module.css` line 52: change `#a0aec0` on `#ffffff` to high contrast color (`#4a5568`, >= 4.5:1 ratio).
     - `styles/ServicesPage.module.css` line 45: change body text `#555555` on dark `#1d2127` background to high contrast (`#e2e8f0` or `--foreground`, >= 4.5:1 ratio).

5. **Build & Test Verification**:
   - Execute `npm test` using run_command to verify Jest unit tests pass 100%.
   - Execute `npx next lint` or check linting using run_command.
   - Write your completion summary to `e:\MyPortfolio - Copy\.agents\worker_m2\handoff.md` with build/test outputs documented.
   - Update `e:\MyPortfolio - Copy\.agents\worker_m2\progress.md`.
   - Call send_message to report findings back to the Project Orchestrator.
