# Architectural Handbook — SCSA Research Lab / Portfolio Application

**Project Name**: `scsa-research-lab`  
**Version**: `1.0.0`  
**Audit Date**: 2026-08-01  
**Auditor**: Explorer 1 (Milestone 1: Architecture, Build Baseline & Project Audit)

---

## 1. Executive Summary

`scsa-research-lab` is a Next.js (v16.1.0) full-stack web application for an academic research group and personal portfolio. It features:
- A public academic portal (research projects, FYP projects, publications/articles, team, supervision, services, interactive demos).
- A rich administrative portal (`/admin`) with authentication, project management, article publishing with TipTap rich-text editing, audit logs, media library, and analytics dashboards.
- MongoDB / Mongoose backend persistence with Cloudinary integration for media assets.
- NextAuth.js JWT authentication protecting administrative APIs and routes.
- Next.js Pages Router directory structure with custom rewrites, redirects, security headers (CSP, HSTS), and CSS Modules with CSS design tokens.

---

## 2. Configuration & Tooling Audit

### 2.1 Configuration Files Inventory
| File | Purpose / Details |
|---|---|
| `package.json` | Project manifest, dependencies, npm build/test scripts |
| `next.config.js` | Next.js configuration, `@next/bundle-analyzer`, strict mode, Turbopack empty config block, image remote patterns, rewrites (`/` -> `/portfolio`), 20+ legacy route redirects, security headers (CSP, HSTS, XFO, COOP), and asset cache headers |
| `jest.config.js` | Jest 30 setup wrapping `next/jest`, `jest-environment-jsdom`, module name mapping for CSS modules (`identity-obj-proxy`) and file mocks |
| `jest.setup.js` | Extends `@testing-library/jest-dom` and provides global fetch mock |
| `.eslintrc.json` | Extends `next/core-web-vitals` |
| `next-sitemap-config.js` | `next-sitemap` runner configuration targeting `sitemap-0.xml` with exclusions and robots.txt disallow policies |
| `proxy.js` | Middleware request interceptor handling credentials login rate limiting (`express-rate-limit`) and JWT authentication verification for `/admin/*` and `/api/admin/*` |
| `.env.local` | Local environment variables (MongoDB URI, NextAuth secret, Cloudinary config, Email credentials) |

### 2.2 Missing / Non-Existent Configurations
- **TypeScript**: No `tsconfig.json` or TypeScript dependencies installed. The codebase is written entirely in JavaScript (ES6+ / JSX).
- **Tailwind CSS**: No `tailwind.config.js` or PostCSS Tailwind plugins. The application uses plain CSS Modules (`*.module.css`), design tokens (`tokens.css`), custom animations (`animations.css`), and theme classes instead of Tailwind.

---

## 3. Dependency Baseline & NPM Scripts

### 3.1 Technology Stack & Core Dependencies
- **Framework & Core**: Next.js (`^16.1.0`), React (`^19.2.3`), React DOM (`^19.2.3`).
- **UI Components & Animation**: Framer Motion (`^12.23.26`), Lucide React (`^0.562.0`), React Icons (`^5.5.0`), Lottie React (`^2.4.1`), `next-themes` (`^0.4.6`).
- **Rich Text Editor**: TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image` `^3.14.0`).
- **Forms & Validation**: `react-hook-form` (`^7.69.0`), `@hookform/resolvers` (`^5.2.2`), `zod` (`^4.2.1`), `joi` (`^18.0.2`).
- **Database, ORM & Auth**: `mongodb` (`^7.0.0`), `mongoose` (`^9.0.2`), `next-auth` (`^4.24.13`), `bcryptjs` (`^3.0.3`).
- **Security & Rate Limiting**: `express-rate-limit` (`^8.2.1`), `rate-limit-mongo` (`^2.3.2`).
- **Storage & Communications**: `cloudinary` (`^2.8.0`), `nodemailer` (`^7.0.12`), `emailjs-com` (`^3.2.0`), `axios` (`^1.13.2`), `formidable` (`^3.5.4`).
- **Data Visualization**: `chart.js` (`^4.5.1`), `react-chartjs-2` (`^5.3.1`), `react-sparklines` (`^1.7.0`).
- **Utilities**: `date-fns` (`^4.1.0`), `prismjs` (`^1.30.0`), `slugify` (`^1.6.6`), `react-hot-toast` (`^2.6.0`), `react-datepicker` (`^9.1.0`), `nextjs-google-analytics` (`^2.3.7`).

### 3.2 Development & Testing Dependencies
- `jest` (`^30.2.0`), `jest-environment-jsdom` (`^30.2.0`), `@testing-library/react` (`^16.3.1`), `@testing-library/jest-dom` (`^6.9.1`), `@testing-library/dom` (`^10.4.1`), `@testing-library/user-event` (`^14.6.1`).
- `@next/bundle-analyzer` (`^16.2.6`), `eslint-config-next` (`^16.1.0`), `eslint-plugin-jsx-a11y` (`^6.10.2`), `identity-obj-proxy` (`^3.0.0`), `sharp` (`^0.34.5`).

### 3.3 NPM Scripts Evaluation
```json
{
  "dev": "next dev",
  "migrate:projects": "node scripts/migrate-projects.js",
  "db:seed": "node scripts/seed-projects.js",
  "db:seed:fyp": "node scripts/seed-fyp-projects.js",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postbuild": "node scripts/generate-sitemap-paths.js",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

#### Test & Build Execution Results:
1. **`npm test`**: **PASS** (1 test suite, 8/8 tests passed in `components/Admin/ArticleForm/__tests__/ChipInput.test.jsx`).
2. **`npm run lint`**: `next lint` throws a directory parsing error when invoked without explicit paths in Next 16 CLI mode. Direct `npx eslint .` runs lint analysis against project files.

---

## 4. Directory & Codebase Organization

The repository follows the Next.js **Pages Router** pattern (without a top-level `src/` wrapper):

```
e:\MyPortfolio - Copy\
├── components/          # React components grouped into 27 functional subdirectories
│   ├── AboutPage/       # CSS modules for about page
│   ├── AcademicSite/    # Academic portal components (Hero, Pipeline, Visuals, Modals)
│   ├── Admin/           # Admin layout, dashboards, article form, project form, user lists, charts
│   ├── AnimatedUI/      # Animated containers and motion components
│   ├── Articles/        # Article filters, cards, and listing components
│   ├── Backgrounds/     # Canvas and visual background components
│   ├── Badges/          # Status and technology badges
│   ├── CookieConsentBanner/ # Cookie consent banner
│   ├── ErrorBoundary/   # React error boundary wrappers
│   ├── GMBackground/    # Custom background effects
│   ├── GMIcon/          # Custom SVG icon set
│   ├── Highlight/       # Code highlighting components
│   ├── Icon/            # Icon wrappers
│   ├── Languages/       # Language skill badges
│   ├── LoadingAnimation/# Loading states
│   ├── NavBar_Mobile/   # Mobile navigation components
│   ├── OptimizedImage/  # Image wrapper components
│   ├── Popover/         # Floating popover overlays
│   ├── Projects/        # Project display cards, filters, and modals
│   ├── ScrollToTop/     # Scroll to top button
│   ├── SEO.js           # Centralized SEO Head tag generator component
│   ├── Services/        # Service offerings components
│   ├── Skills/          # Skill matrix visualization
│   ├── Spinner/         # Loading spinner components
│   ├── Stats/           # Numeric counter/stats components
│   ├── ThemeToggle/     # Light/Dark mode switcher
│   ├── Tooltip/         # Tooltip components
│   └── TopProgress/     # Top loading progress bar
├── pages/               # Next.js Pages Router routes
│   ├── admin/           # Admin pages (dashboard, analytics, articles, fyp, projects, login, users, audit-logs, search, media)
│   ├── alumni/          # Alumni page routes
│   ├── api/             # REST API routes (admin, analytics, articles, audit-logs, auth, fyp-projects, media, projects, users)
│   ├── articles/        # Public article routes
│   ├── insights/        # Insights page routes
│   ├── portfolio/       # Internal target routes for homepage/resume rewrites
│   ├── projects/        # Public project page routes
│   ├── supervision/     # Supervision page routes
│   ├── _app.js          # Main application wrapper (Providers, global CSS imports)
│   ├── _document.js     # HTML Document structure, font links, analytics scripts
│   ├── 404.js / 500.js  # Custom error pages
│   ├── about.js, contact.js, events.js, fyp.js, privacy-policy.js, publications.js, research.js, search.js, services.js, team.js, uses.js
│   └── sitemap.xml.js, feed.xml.js # Dynamic RSS and sitemap handlers
├── models/              # Mongoose data models
│   ├── Article.js       # Article content, status, tags, slugs, versions
│   ├── ArticleVersion.js# Historical article version snapshots
│   ├── AuditLog.js      # System audit logging model
│   ├── DailyStat.js     # Analytics aggregated daily metrics
│   ├── FypProject.js    # Final Year Project showcase model
│   ├── MediaAsset.js    # Cloudinary media library records
│   ├── Note.js          # Admin quick notes
│   ├── Project.js       # Portfolio & research project records
│   ├── Resume.js        # Dynamic resume data structure
│   ├── SavedSearch.js   # Saved search queries
│   ├── Snippet.js       # Code snippet model
│   └── User.js          # Admin user credentials & role management
├── lib/                 # Core utilities, database connections, security
│   ├── mongoose.js      # Cached Mongoose connection helper
│   ├── mongodb.js       # MongoDB native driver client setup
│   ├── dbConnect.js     # Standard db connection export
│   ├── auditLog.js      # Audit logger helper
│   ├── rate-limiter.js  # In-memory rate limiting middleware
│   ├── withAdminAuth.js # Higher-order component / API wrapper for authentication
│   ├── validation/      # Joi/Zod validation schemas and validators
│   ├── cloudinary.js    # Cloudinary SDK wrapper
│   ├── motion.js        # Framer motion variant helpers
│   ├── indexnow.js      # IndexNow search engine notification utility
│   ├── calendly.js      # Calendly integration helper
│   └── gtag.js          # Google Analytics event reporting
├── styles/              # Global styling & CSS modules
│   ├── tokens.css       # Root CSS variables (colors, spacing, typography)
│   ├── animations.css   # Custom keyframe animations
│   ├── admin-design-system.css # Admin portal theme tokens
│   ├── admin-premium.css # Admin premium visual overrides
│   └── *.module.css     # Modular component styles
├── data/                # Static fallback data files (`academicSite.js`, `fypProjects.js`)
├── hooks/               # Custom React hooks (`useScrollAnimation.js`, `useViewTransition.js`)
├── context/             # React Context (`ThemeContext.js`)
├── utils/               # Helper utilities (`articleUtils.js`, `projectEnhancements.js`, `dateUtils.js`, `revalidate.js`, `cookieConsent.js`)
├── constants/           # Constants (`navigation.js`)
├── scripts/             # Admin seeding & migration scripts
├── docs/                # Project design guides and documentation
├── public/              # Static assets (images, icons, documents)
└── test/                # Test mocks (`__mocks__/fileMock.js`)
```

---

## 5. Architectural Findings & Key Insights

1. **Pages Router Pattern**: The application relies on Next.js Pages Router with custom internal rewrites (mapping `/` -> `/portfolio`) and legacy route redirects.
2. **Custom CSS Token System**: Instead of Tailwind CSS, the application leverages custom CSS variables in `tokens.css`, CSS Modules (`*.module.css`), and dedicated dark/light/premium CSS stylesheets.
3. **Robust Backend & Auth System**: REST APIs under `pages/api/` handle authentication via NextAuth.js, database persistence via Mongoose, input validation via Joi/Zod schemas, and rate limiting via `express-rate-limit`.
4. **Rich Content Management**: Includes full CMS capabilities for articles (TipTap rich text editor, versioning, tag management), project showcases, media asset management (Cloudinary), and audit logging.
5. **Testing Baseline**: Unit testing is configured with Jest and React Testing Library. Current suite passes with 100% success (8/8 tests passed).

---

## 6. Recommendations for Next Milestones

1. **Lint Script Fix**: Update `package.json` script `"lint": "next lint"` or configure target paths to ensure `npm run lint` runs seamlessly across OS environments.
2. **Expand Test Coverage**: Add unit and integration tests for core backend API routes (`pages/api/projects`, `pages/api/articles`) and UI components.
3. **Type Safety Evaluation**: Consider evaluating TypeScript adoption or JSDoc type definitions for complex data models (`Article.js`, `Project.js`).
