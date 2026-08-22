# Original User Request

## 2026-08-22T03:07:46Z

Enable comprehensive management of all existing and new website content directly from the Admin Portal, including database migration/seeding for existing static data, full CRUD UI for all site sections, dynamic synchronization with public pages, and thorough end-to-end browser verification.

Working directory: e:\ssa lab
Integrity mode: development

## Requirements

### R1. Database Migration & Existing Data Seeding
- Migrate and seed all existing static data (from `data/academicSite.js`, `data/fypProjects.js`, and related sources) into MongoDB models so that all pre-existing records (Lab details, Publications, Team Members, Research Areas, News/Announcements, FYP Projects, and General Projects) exist in the database and appear immediately in the admin portal.
- Ensure the seeding mechanism safely upserts or populates missing records without overwriting future admin modifications.

### R2. Complete Admin Portal CMS & Management Interfaces
- Build/extend admin dashboard interfaces and API endpoints to provide full CRUD (Create, Read, Update, Delete) management for:
  - Lab Profile & Site Settings (Name, tagline, mission, contact info, hero content)
  - Team Members & Alumni (Profiles, designations, bio, images, social links)
  - Publications (Title, authors, year, conference/journal, DOI/links, categories)
  - Research Areas & Focus Topics (Titles, descriptions, icons, associated papers/projects)
  - News, Events & Announcements (Headlines, dates, summaries, details)
  - FYP Projects & Regular Projects (Titles, supervisors, students, status, tags, deliverables)
- Include proper form validation, image/asset upload handling, sorting, search, filtering, and audit logging for modifications.

### R3. Public Site Dynamic Integration
- Update public-facing pages and components to consume live data directly from MongoDB via Next.js server-side/API routes, with fallback handling to ensure the site remains fully functional even before initialization.
- Ensure any edits or additions made in the admin portal reflect immediately on the corresponding public site pages.

### R4. End-to-End Browser & Verification Testing
- Perform comprehensive browser testing (navigating the admin portal, logging in, creating, modifying, and deleting records across all sections).
- Verify that updated content displays accurately on public-facing site pages without layout or runtime errors.

## Acceptance Criteria

### Data & Seeding
- [ ] All pre-existing static records from `data/academicSite.js` and `data/fypProjects.js` are populated in the database.
- [ ] Database contains valid collections and schemas for all site sections (Site Info, Members, Publications, Research Areas, News, Projects).

### Admin Portal Management
- [ ] Admin portal displays lists and management tables for all site entities with search, edit, delete, and add new capabilities.
- [ ] Admin forms allow editing all fields (text, arrays, dates, tags, URLs, images) and successfully save updates to MongoDB.
- [ ] New items can be added and existing items can be edited or removed without database or UI errors.

### Public Website Synchronization
- [ ] Public pages (Home, About, Team, Research, Publications, Projects, News/Events) dynamically render database content.
- [ ] Changes saved in the admin portal immediately update the live public view.

### Browser Verification
- [ ] Browser verification confirms successful admin authentication, entity creation/editing/deletion, and public site verification.
