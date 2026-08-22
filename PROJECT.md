# Project: Comprehensive Academic Lab CMS & Dynamic Synchronization

## Architecture
The system is built on Next.js (Pages Router), React, Mongoose/MongoDB, NextAuth.js v4, TipTap WYSIWYG, and Zod validation. It bridges pre-existing static academic assets into an enterprise-grade CMS with live public synchronization.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MongoDB Database                              │
│  - LabProfile (SiteSettings)  - Publications    - Team Members/Alumni │
│  - ResearchDomains            - News/Events     - FYP & Lab Projects   │
│  - Users, AuditLogs, MediaAssets, Enquiries                           │
└───────────────────▲──────────────────────────────────┬─────────────────┘
                    │ (CRUD APIs, Validations,         │ (getServerSideProps,
                    │  Audit Logging)                  │  Resilient Fallback)
┌───────────────────┴───────────────┐     ┌────────────▼─────────────────┐
│     Admin Portal CMS Interfaces   │     │    Live Public Website       │
│  - /admin/site-settings           │     │  - / (Home)                  │
│  - /admin/publications            │     │  - /about                    │
│  - /admin/research-areas          │     │  - /team                     │
│  - /admin/team (Faculty/MS/Alumni)│     │  - /research                 │
│  - /admin/news-events             │     │  - /publications             │
│  - /admin/fyp & /admin/projects   │     │  - /supervision              │
│  - /admin/media, /admin/analytics │     │  - /events, /contact         │
└───────────────────────────────────┘     └──────────────────────────────┘
```

## Feature Inventory
Every feature from the user request and survey is cataloged and assigned to a milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Database Schemas & Models | Unified Mongoose models for LabProfile, Publication, Member, ResearchDomain, EventHighlight, updated FypProject & Project & AuditLog | M1 | Survey / R1 |
| 2 | Idempotent Seeding Engine | `scripts/seed-all-data.js` migrating 16 static entities from `academicSite.js` and 26 projects from `fypProjects.js` with `adminModified` protection | M1 | Survey / R1 |
| 3 | Admin API Endpoints | Full CRUD REST endpoints with Zod validation, NextAuth session protection, and audit logging for all entities | M2 | Survey / R2 |
| 4 | Admin Navigation & Dashboard | Updated `AdminLayout.js`, stats aggregation in `/api/admin/stats`, and dashboard KPI integration | M3 | Survey / R2 |
| 5 | Lab Profile & Site Settings CMS | Admin interface `/admin/site-settings` for PI bio, credentials, experience, education, pillars, milestones, stats | M3 | Survey / R2 |
| 6 | Publications Management CMS | Admin interface `/admin/publications` for papers, BibTeX import, DOI, citation formatting, filtering, search | M3 | Survey / R2 |
| 7 | Team Members & Alumni CMS | Admin interface `/admin/team` for Faculty, PG Researchers, Collaborators, Supervised Theses, and Alumni | M3 | Survey / R2 |
| 8 | Research Areas CMS | Admin interface `/admin/research-areas` for 6 research domains, key problems, directions, tools, project ideas | M3 | Survey / R2 |
| 9 | News & Events CMS | Admin interface `/admin/news-events` for announcements, conference talks, workshop highlights, and gallery | M3 | Survey / R2 |
| 10 | FYP & General Projects CMS | Enhanced admin interfaces `/admin/fyp` and `/admin/projects` supporting all fields, deliverables, and gallery | M3 | Survey / R2 |
| 11 | Component Decoupling & Props | Refactor `AcademicHome.js`, `AcademicContentPage.js`, `AcademicSiteLayout.js`, `AcademicFooter.js` to accept dynamic props with static fallbacks | M4 | Survey / R3 |
| 12 | Dynamic Public Pages SSR | Implement resilient `getServerSideProps` across Home, About, Team, Research, Publications, Supervision, Events, Contact | M4 | Survey / R3 |
| 13 | Real-time Synchronization & Cache | Fast edge cache-control headers and live synchronization ensuring admin edits immediately reflect on public pages | M4 | Survey / R3 |
| 14 | E2E Testing Suite (Tiers 1-4) | Comprehensive test harness & test suite verifying Seeding, Models, Admin APIs, CMS UI, Public SSR, and Fallbacks | Test Track | R4 |
| 15 | Browser E2E Verification & Hardening | Full browser verification (Auth, CRUD, public sync) and Tier 5 adversarial coverage hardening | M5 (Final) | R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test suite (Tiers 1-4), test harness, runner, publishing TEST_READY.md | none | DONE (119/119 pass) |
| M1 | Database Models & Seeding Engine | Create missing Mongoose models, update existing models/enums, create `scripts/seed-all-data.js`, seed MongoDB safely | none | DONE (Gate PASS) |
| M2 | Backend API Endpoints & Validation | Build REST API routes for all entities with Zod schemas, auth verification, and audit logging | M1 | DONE (Gate PASS) |
| M3 | Admin Portal CMS Interfaces | Build full CRUD pages for Site Settings, Publications, Team, Research Areas, News/Events, and FYP/Projects | M2 | IN_PROGRESS |
| M4 | Public Site Dynamic Integration | Update public pages and components with `getServerSideProps` and resilient fallback handling | M1, M2 | PLANNED |
| M5 | E2E Verification & Adversarial Hardening | Pass 100% E2E tests, browser testing (Admin CRUD -> Public sync), Tier 5 adversarial stress testing | M3, M4, E2E | PLANNED |

## Interface Contracts
### Models ↔ Seeding & APIs
- `LabProfile`: `{ key: "default", name, shortName, role, institution, lab, labShort, office, emails, labEmail, googleScholar, linkedin, researchGate, orcid, credentials, experience, education, pillars, milestones, impactStats, partnerLogos, adminModified }`
- `Publication`: `{ title, slug, year, type, authors, venue, href, bibtex, abstract, pdfUrl, codeUrl, featured, published, displayOrder, tags, adminModified }`
- `Member` / `TeamMember`: `{ name, slug, role, category, memberId, degree, affiliation, institution, specialization, topic, focus, status, bio, badge, image, email, googleScholar, orcid, researchGate, linkedin, github, term, organization, projectTitle, published, featured, displayOrder, adminModified }`
- `ResearchDomain`: `{ slug, number, title, graphicKey, image, description, overview, keyProblems, currentDirections, relatedLabWork, toolsAndDatasets, projectIdeas, published, displayOrder, adminModified }`
- `EventHighlight` / `NewsEvent`: `{ title, slug, year, date, badge, category, venue, location, summary, content, src, alt, caption, orientation, isGalleryItem, published, displayOrder, adminModified }`
- `FypProject`: `{ title, slug, summary, status, categoryType, projectType, nature, category, programme, session, institution, students, supervisor, coSupervisor, specializations, sdgs, technologies, problem, solution, objectives, architecture, features, contributions, outcome, limitations, futureWork, prerequisites, expectedDeliverables, isRunning, isOpportunity, coverImage, coverAlt, gallery, liveUrl, repositoryUrl, published, featured, displayOrder, adminModified }`

### Admin APIs ↔ Admin CMS
- `GET /api/admin/<entity>` -> `{ items: [...], total, page, totalPages }`
- `POST /api/<entity>` -> `{ success: true, item: {...} }` with HTTP 201
- `GET /api/<entity>/[id]` -> `{ item: {...} }`
- `PUT /api/<entity>/[id]` -> `{ success: true, item: {...} }` with HTTP 200
- `DELETE /api/<entity>/[id]` -> `{ success: true, message: "Deleted" }` with HTTP 200
- `PUT /api/admin/reorder-<entity>` -> `{ success: true }`

### Public Pages ↔ MongoDB
- `getServerSideProps({ res })`:
  1. Sets `Cache-Control: public, s-maxage=10, stale-while-revalidate=59`
  2. Queries Mongoose model with `.lean()`
  3. Returns `{ props: { [entity]: docs.length ? JSON.parse(JSON.stringify(docs)) : fallbackStaticData } }`
  4. On error: logs warning and returns fallback static data with HTTP 200.

## Code Layout
- `models/`: Mongoose data models (`LabProfile.js`, `Publication.js`, `Member.js`, `ResearchDomain.js`, `EventHighlight.js`, `FypProject.js`, `Project.js`, `AuditLog.js`, `User.js`, `MediaAsset.js`, `Enquiry.js`).
- `lib/validation/`: Zod validation schemas (`schemas.js`, `validator.js`).
- `scripts/`: Seeding and maintenance scripts (`seed-all-data.js`, `ensure-admin-user.js`).
- `pages/api/`: REST API endpoints (`pages/api/admin/`, `pages/api/publications/`, `pages/api/team-members/`, `pages/api/research-domains/`, `pages/api/news-events/`, `pages/api/site-settings.js`, etc.).
- `pages/admin/`: Admin CMS pages (`site-settings/`, `publications/`, `team/`, `research-areas/`, `news-events/`, `fyp/`, `projects/`).
- `components/Admin/`: Admin UI components, layout, and form controls.
- `pages/`: Public pages (`index.js`, `about.js`, `team.js`, `research.js`, `publications.js`, `supervision.js`, `events.js`, `contact.js`).
- `components/AcademicSite/`: Public components (`AcademicHome.js`, `AcademicContentPage.js`, `AcademicSiteLayout.js`, `AcademicFooter.js`).
- `tests/`: E2E and unit test suites.
