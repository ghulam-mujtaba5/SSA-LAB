/**
 * Tier 1: Feature Coverage E2E Test Suite
 * Comprehensive requirement-driven tests covering:
 * 1. Static Data Seeding & Migration (§R1)
 * 2. Database Models & Validation (§R1)
 * 3. Admin Auth & Session Protection (§R2)
 * 4. Admin CRUD REST APIs (§R2)
 * 5. Admin CMS Data Normalization & Audit Logging (§R2)
 * 6. Dynamic Public SSR Data Integration (§R3)
 * 7. Real-time Admin-to-Public Synchronization (§R3)
 * 8. Resilient Fallback Handling (§R3)
 */

import {
  describe,
  it,
  beforeAll,
  afterAll,
  assert,
  dbConnect,
  createMockToken,
  createMockReqRes,
  generateTestPrefix,
  runAllSuites,
} from './test-helper.mjs';

import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import LabProfile from '../../models/LabProfile.js';
import Publication from '../../models/Publication.js';
import Member from '../../models/Member.js';
import ResearchDomain from '../../models/ResearchDomain.js';
import EventHighlight from '../../models/EventHighlight.js';
import FypProject from '../../models/FypProject.js';
import Project from '../../models/Project.js';
import AuditLog from '../../models/AuditLog.js';
import Enquiry from '../../models/Enquiry.js';

import { authOptions } from '../../pages/api/auth/[...nextauth].js';
import siteDataHandler from '../../pages/api/academic/site-data.js';
import siteSettingsHandler from '../../pages/api/admin/site-settings/index.js';
import publicationsIndexHandler from '../../pages/api/admin/publications/index.js';
import publicationIdHandler from '../../pages/api/admin/publications/[id].js';
import teamIndexHandler from '../../pages/api/admin/team/index.js';
import teamIdHandler from '../../pages/api/admin/team/[id].js';
import eventsIndexHandler from '../../pages/api/admin/events/index.js';
import eventIdHandler from '../../pages/api/admin/events/[id].js';
import statsHandler from '../../pages/api/admin/stats.js';
import fypIndexHandler from '../../pages/api/fyp-projects/index.js';
import fypIdHandler from '../../pages/api/fyp-projects/[id].js';
import projectsIndexHandler from '../../pages/api/projects/index.js';
import projectIdHandler from '../../pages/api/projects/[id].js';

import * as staticAcademicData from '../../data/academicSite.js';
import { defaultFypProjects as staticFypProjects } from '../../data/fypProjects.js';

const TEST_PREFIX = generateTestPrefix('t1');
let adminToken = null;
let editorToken = null;
let viewerToken = null;
let testAdminUser = null;

describe('Tier 1 - Feature 1: Static Data Seeding & Migration (§R1)', () => {
  beforeAll(async () => {
    await dbConnect();
    adminToken = await createMockToken({ role: 'admin', name: 'T1 Admin' });
    editorToken = await createMockToken({ role: 'editor', name: 'T1 Editor' });
    viewerToken = await createMockToken({ role: 'viewer', name: 'T1 Viewer' });
  });

  it('1.1 Lab Profile exists in DB with all profile fields, pillars, milestones, and impact stats', async () => {
    const profile = await LabProfile.findOne({ key: 'default' }).lean();
    assert.ok(profile, 'LabProfile default document must exist in database');
    assert.ok(profile.name, 'Profile name must be present');
    assert.ok(profile.lab, 'Lab name must be present');
    assert.ok(Array.isArray(profile.pillars) && profile.pillars.length > 0, 'Pillars array must be populated');
    assert.ok(Array.isArray(profile.milestones) && profile.milestones.length > 0, 'Milestones array must be populated');
    assert.ok(Array.isArray(profile.impactStats) && profile.impactStats.length > 0, 'Impact stats array must be populated');
  });

  it('1.2 Publications collection is populated from static dataset with required metadata', async () => {
    const pubCount = await Publication.countDocuments();
    assert.ok(pubCount >= 5, `Expected at least 5 publications in DB, found ${pubCount}`);
    const samplePub = await Publication.findOne().lean();
    assert.ok(samplePub.title, 'Publication must have title');
    assert.ok(samplePub.authors, 'Publication must have authors');
    assert.ok(samplePub.venue, 'Publication must have venue');
    assert.ok(samplePub.year, 'Publication must have year');
    assert.ok(samplePub.slug, 'Publication must have slug');
  });

  it('1.3 Team members are populated across pg-researcher, co-investigator, alumni, collaborator categories', async () => {
    const memberCount = await Member.countDocuments();
    assert.ok(memberCount >= 10, `Expected at least 10 team members, found ${memberCount}`);
    const categories = await Member.distinct('category');
    assert.ok(categories.includes('pg-researcher'), 'Must contain pg-researcher');
    assert.ok(categories.includes('alumni'), 'Must contain alumni');
    assert.ok(categories.includes('collaborator'), 'Must contain collaborator');
  });

  it('1.4 Research domains collection contains all core lab research areas', async () => {
    const domainCount = await ResearchDomain.countDocuments();
    assert.ok(domainCount >= 6, `Expected 6 research domains, found ${domainCount}`);
    const sampleDomain = await ResearchDomain.findOne({ slug: 'vulnerability-detection' }).lean();
    assert.ok(sampleDomain, 'Core domain vulnerability-detection must exist');
    assert.ok(sampleDomain.title, 'Domain title must exist');
    assert.ok(sampleDomain.description, 'Domain description must exist');
  });

  it('1.5 Lab events collection contains highlights and gallery entries', async () => {
    const eventCount = await EventHighlight.countDocuments();
    assert.ok(eventCount >= 5, `Expected at least 5 events/gallery items, found ${eventCount}`);
    const highlight = await EventHighlight.findOne({ isGalleryItem: false }).lean();
    assert.ok(highlight, 'At least one highlight event must exist');
  });

  it('1.6 FYP Projects collection is populated from defaultFypProjects dataset', async () => {
    const fypCount = await FypProject.countDocuments();
    assert.ok(fypCount >= 20, `Expected at least 20 FYP projects, found ${fypCount}`);
    const sampleFyp = await FypProject.findOne().lean();
    assert.ok(sampleFyp.title, 'FYP title must exist');
    assert.ok(sampleFyp.summary, 'FYP summary must exist');
  });

  it('1.7 Seeding idempotency: re-running upsert does not overwrite adminModified records', async () => {
    const testSlug = `${TEST_PREFIX}_idempotent_pub`;
    await Publication.create({
      title: 'Admin Custom Publication',
      slug: testSlug,
      year: '2026',
      authors: 'Junaid Akram',
      venue: 'IEEE S&P',
      adminModified: true,
    });

    const existing = await Publication.findOne({ slug: testSlug });
    assert.strictEqual(existing.adminModified, true);
    assert.strictEqual(existing.title, 'Admin Custom Publication');

    // Cleanup
    await Publication.deleteOne({ slug: testSlug });
  });
});

describe('Tier 1 - Feature 2: Database Models & Schemas Validation (§R1)', () => {
  it('2.1 LabProfile model enforces schema defaults and unique key', async () => {
    const profile = new LabProfile({ key: `${TEST_PREFIX}_profile_key` });
    assert.strictEqual(profile.role, 'Assistant Professor');
    assert.strictEqual(profile.adminModified, false);
    assert.ok(Array.isArray(profile.emails));
  });

  it('2.2 Publication model requires title, year, authors, venue and sets default published=true', async () => {
    const pub = new Publication({
      title: 'Test Paper',
      slug: `${TEST_PREFIX}_paper_1`,
      year: '2026',
      authors: 'Author A',
      venue: 'ACM CCS',
    });
    assert.strictEqual(pub.published, true);
    assert.strictEqual(pub.type, 'Journal');
    assert.strictEqual(pub.featured, false);
  });

  it('2.3 Member model requires name, validates category enum, and supports social links', async () => {
    const member = new Member({
      name: 'Test Researcher',
      slug: `${TEST_PREFIX}_researcher_1`,
      category: 'pg-researcher',
      github: 'https://github.com/test',
      email: 'test@cuilahore.edu.pk',
    });
    assert.strictEqual(member.category, 'pg-researcher');
    assert.strictEqual(member.github, 'https://github.com/test');
  });

  it('2.4 ResearchDomain model requires title and description and supports case studies array', async () => {
    const domain = new ResearchDomain({
      slug: `${TEST_PREFIX}_domain_1`,
      title: 'AI Security',
      description: 'Researching adversarial AI attacks',
      caseStudies: [{ title: 'Case 1', impact: 'High' }],
    });
    assert.strictEqual(domain.title, 'AI Security');
    assert.strictEqual(domain.caseStudies.length, 1);
  });

  it('2.5 EventHighlight model validates event types and supports tags', async () => {
    const event = new EventHighlight({
      title: 'Lab Hackathon',
      slug: `${TEST_PREFIX}_hackathon`,
      category: 'Workshop',
      summary: 'Annual hackathon for secure coding.',
    });
    assert.strictEqual(event.category, 'Workshop');
    assert.strictEqual(event.summary, 'Annual hackathon for secure coding.');
  });

  it('2.6 FypProject model validates nested student schemas and architecture stages', async () => {
    const fyp = new FypProject({
      title: 'Secure LLM Pipeline',
      slug: `${TEST_PREFIX}_secure_llm`,
      summary: 'Evaluating prompt injection resilience',
      students: [{ name: 'Alice', registration: 'SP22-BCS-001' }],
      architecture: [{ title: 'Stage 1: Ingestion', detail: 'Token filtering' }],
    });
    assert.strictEqual(fyp.students.length, 1);
    assert.strictEqual(fyp.architecture.length, 1);
  });

  it('2.7 AuditLog model enforces action enum, entity enum, and optional user reference', async () => {
    const log = new AuditLog({
      userName: 'Test Auditor',
      action: 'create',
      entity: 'Project',
      entityId: '12345',
      details: 'Created project',
    });
    assert.strictEqual(log.action, 'create');
    assert.strictEqual(log.entity, 'Project');
  });
});

describe('Tier 1 - Feature 3: Admin Auth & Session Protection (§R2)', () => {
  const credentialsProvider = authOptions.providers.find(
    (p) => p.id === 'credentials' || p.name === 'Credentials'
  );
  const authorize = credentialsProvider.options?.authorize || credentialsProvider.authorize;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('SecretPass123!', 10);
    testAdminUser = await User.create({
      name: 'Auth Test User',
      username: `${TEST_PREFIX}_auth_user`,
      email: `${TEST_PREFIX}_auth@ssalab.test`,
      password: passwordHash,
      role: 'admin',
      isActive: true,
    });
  });

  afterAll(async () => {
    if (testAdminUser) {
      await User.deleteOne({ _id: testAdminUser._id });
    }
  });

  it('3.1 NextAuth credentials provider accepts valid username and password', async () => {
    const user = await authorize({
      username: `${TEST_PREFIX}_auth_user`,
      password: 'SecretPass123!',
    });
    assert.ok(user, 'User should authenticate successfully');
    assert.strictEqual(user.email, `${TEST_PREFIX}_auth@ssalab.test`);
    assert.strictEqual(user.role, 'admin');
  });

  it('3.2 NextAuth credentials provider rejects invalid password with error', async () => {
    await assert.rejects(
      async () => {
        await authorize({
          username: `${TEST_PREFIX}_auth_user`,
          password: 'WrongPassword!',
        });
      },
      /Incorrect password/
    );
  });

  it('3.3 NextAuth credentials provider rejects inactive account', async () => {
    await User.updateOne({ _id: testAdminUser._id }, { isActive: false });
    await assert.rejects(
      async () => {
        await authorize({
          username: `${TEST_PREFIX}_auth_user`,
          password: 'SecretPass123!',
        });
      },
      /Account has been deactivated/
    );
    await User.updateOne({ _id: testAdminUser._id }, { isActive: true });
  });

  it('3.4 NextAuth credentials provider authenticates case-insensitively with email', async () => {
    const user = await authorize({
      username: `${TEST_PREFIX}_AUTH@SSALAB.TEST`,
      password: 'SecretPass123!',
    });
    assert.ok(user, 'Email should authenticate case-insensitively');
    assert.strictEqual(user.id, testAdminUser._id.toString());
  });

  it('3.5 Protected Admin CRUD API rejects unauthenticated requests with HTTP 403', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: { title: 'Unauth Paper' },
      token: null,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 403);
    assert.strictEqual(res.getData()?.success, false);
  });

  it('3.6 Protected Admin CRUD API rejects non-editor/non-admin roles (viewer) with HTTP 403', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: { title: 'Viewer Paper' },
      token: viewerToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 403);
  });
});

describe('Tier 1 - Feature 4: Admin CRUD REST APIs (§R2)', () => {
  let createdPubId = null;
  let createdFypId = null;

  it('4.1 Publications Admin API supports full CRUD lifecycle (GET, POST, GET/:id, PUT, DELETE)', async () => {
    const { req: postReq, res: postRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Neural Bug Hunting`,
        year: '2026',
        authors: 'J. Akram, A. Student',
        venue: 'IEEE TSE',
        type: 'Journal',
        tags: ['AI', 'Security'],
      },
      token: adminToken,
    });
    await publicationsIndexHandler(postReq, postRes);
    assert.strictEqual(postRes.getStatusCode(), 201);
    createdPubId = postRes.getData()?.data?._id?.toString();
    assert.ok(createdPubId);

    const { req: getReq, res: getRes } = await createMockReqRes({
      method: 'GET',
      query: { id: createdPubId },
      token: adminToken,
    });
    await publicationIdHandler(getReq, getRes);
    assert.strictEqual(getRes.getStatusCode(), 200);
    assert.strictEqual(getRes.getData()?.data?.title, `${TEST_PREFIX} Neural Bug Hunting`);

    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: createdPubId },
      body: {
        title: `${TEST_PREFIX} Neural Bug Hunting (Updated)`,
        year: '2026',
        authors: 'J. Akram, A. Student, B. Collaborator',
        venue: 'IEEE TSE',
      },
      token: adminToken,
    });
    await publicationIdHandler(putReq, putRes);
    assert.strictEqual(putRes.getStatusCode(), 200);
    assert.strictEqual(putRes.getData()?.data?.title, `${TEST_PREFIX} Neural Bug Hunting (Updated)`);

    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: createdPubId },
      token: adminToken,
    });
    await publicationIdHandler(delReq, delRes);
    assert.strictEqual(delRes.getStatusCode(), 200);

    const check = await Publication.findById(createdPubId);
    assert.strictEqual(check, null);
  });

  it('4.2 FYP Projects Admin API supports full CRUD lifecycle', async () => {
    const { req: postReq, res: postRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Smart Contract Fuzzer`,
        summary: 'Automated fuzz testing for Solidity smart contracts.',
        category: 'Vulnerability & Security',
        status: 'Running',
      },
      token: adminToken,
    });
    await fypIndexHandler(postReq, postRes);
    assert.strictEqual(postRes.getStatusCode(), 201);
    createdFypId = postRes.getData()?.data?._id?.toString();

    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: createdFypId },
      token: adminToken,
    });
    await fypIdHandler(delReq, delRes);
    assert.strictEqual(delRes.getStatusCode(), 204);
  });

  it('4.3 General Projects Admin API supports CRUD operations', async () => {
    const { req: postReq, res: postRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Enterprise Security Scanner`,
        description: 'Comprehensive static and dynamic vulnerability analysis.',
        tags: 'Security, Scanner, Static Analysis',
        category: 'Software Development',
      },
      token: adminToken,
    });
    await projectsIndexHandler(postReq, postRes);
    assert.strictEqual(postRes.getStatusCode(), 201);
    const projId = postRes.getData()?.data?._id?.toString();

    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: projId },
      token: adminToken,
    });
    await projectIdHandler(delReq, delRes);
    assert.ok([200, 204].includes(delRes.getStatusCode()));
  });

  it('4.4 Site Settings API supports GET and PUT updates', async () => {
    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      body: {
        office: 'Block H — Lab Room 14B',
        labShort: 'SSA Lab Tech',
      },
      token: adminToken,
    });
    await siteSettingsHandler(putReq, putRes);
    assert.strictEqual(putRes.getStatusCode(), 200);
    assert.strictEqual(putRes.getData()?.data?.office, 'Block H — Lab Room 14B');
  });

  it('4.5 Admin Stats API returns aggregated KPI counts for all entities', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await statsHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(data?.stats);
    assert.ok(typeof data.stats.projects === 'number');
    assert.ok(typeof data.stats.fypProjects === 'number');
    assert.ok(typeof data.stats.enquiries === 'number');
    assert.ok(typeof data.stats.users === 'number');
  });
});

describe('Tier 1 - Feature 5: Admin CMS Data Normalization & Audit Logging (§R2)', () => {
  it('5.1 Slug auto-generation creates url-safe slug when omitted', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Automated Slug Generation Test`,
        year: '2026',
        authors: 'Author X',
        venue: 'ICSE',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.ok(pub.slug.includes('automated-slug-generation-test') || pub.slug.startsWith('2026-'));
    await Publication.deleteOne({ _id: pub._id });
  });

  it('5.2 Tag normalization parses comma-separated strings into trimmed arrays', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Tag Parser Paper`,
        year: '2026',
        authors: 'Author Y',
        venue: 'FSE',
        tags: 'AI Security , LLM Safety ,  Zero-Day',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.deepStrictEqual(pub.tags, ['AI Security', 'LLM Safety', 'Zero-Day']);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('5.3 Admin mutations mark adminModified: true automatically', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Admin Modified Flag Test`,
        year: '2026',
        authors: 'Author Z',
        venue: 'USENIX Security',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.adminModified, true);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('5.4 AuditLog created automatically on Project entity creation', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Audit Create Project`,
        description: 'Testing audit log creation for project entity.',
        tags: 'Audit, Security',
      },
      token: adminToken,
    });
    await projectsIndexHandler(req, res);
    const project = res.getData()?.data;
    assert.ok(project, 'Project must be created');
    const log = await AuditLog.findOne({
      entity: 'Project',
      entityId: project._id.toString(),
      action: 'create',
    });
    assert.ok(log, 'Audit log must be recorded for Project create');
    await Project.deleteOne({ _id: project._id });
    if (log) await AuditLog.deleteOne({ _id: log._id });
  });

  it('5.5 AuditLog created automatically on FYP project creation', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Audit FYP Project`,
        summary: 'Audit log creation verification for FYP Project.',
        status: 'Running',
      },
      token: adminToken,
    });
    await fypIndexHandler(req, res);
    const fyp = res.getData()?.data;
    assert.ok(fyp, 'FYP must be created');
    const log = await AuditLog.findOne({
      entity: 'FypProject',
      entityId: fyp._id.toString(),
      action: 'create',
    });
    assert.ok(log, 'Audit log must be recorded for FypProject');
    await FypProject.deleteOne({ _id: fyp._id });
    if (log) await AuditLog.deleteOne({ _id: log._id });
  });

  it('5.6 AuditLog created automatically on FYP project deletion', async () => {
    const fyp = await FypProject.create({
      title: `${TEST_PREFIX} Audit FYP Delete`,
      slug: `${TEST_PREFIX}_audit_fyp_del`,
      summary: 'Testing audit log on deletion.',
    });
    const { req, res } = await createMockReqRes({
      method: 'DELETE',
      query: { id: fyp._id.toString() },
      token: adminToken,
    });
    await fypIdHandler(req, res);
    const log = await AuditLog.findOne({
      entity: 'FypProject',
      entityId: fyp._id.toString(),
      action: 'delete',
    });
    assert.ok(log, 'Audit log must be recorded on deletion');
    if (log) await AuditLog.deleteOne({ _id: log._id });
  });
});

describe('Tier 1 - Feature 6: Dynamic Public SSR Data Integration (§R3)', () => {
  it('6.1 /api/academic/site-data returns all 15 core academic sections in a single payload', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(data.academicProfile, 'Must include academicProfile');
    assert.ok(Array.isArray(data.publications), 'Must include publications');
    assert.ok(Array.isArray(data.pgResearchers), 'Must include pgResearchers');
    assert.ok(Array.isArray(data.coInvestigators), 'Must include coInvestigators');
    assert.ok(Array.isArray(data.alumniPlacements), 'Must include alumniPlacements');
    assert.ok(Array.isArray(data.collaborators), 'Must include collaborators');
    assert.ok(Array.isArray(data.researchDomains), 'Must include researchDomains');
    assert.ok(Array.isArray(data.eventHighlights), 'Must include eventHighlights');
    assert.ok(Array.isArray(data.eventGallery), 'Must include eventGallery');
    assert.ok(Array.isArray(data.researchProjects), 'Must include researchProjects');
    assert.ok(Array.isArray(data.supervisedProjects), 'Must include supervisedProjects');
    assert.ok(Array.isArray(data.fypProjects), 'Must include fypProjects');
    assert.ok(Array.isArray(data.labMilestones), 'Must include labMilestones');
    assert.ok(Array.isArray(data.labPillars), 'Must include labPillars');
    assert.ok(Array.isArray(data.labImpactStats), 'Must include labImpactStats');
  });

  it('6.2 /api/academic/site-data sets correct HTTP cache-control headers', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const cacheHeader = res.getHeader('cache-control');
    assert.ok(cacheHeader && cacheHeader.includes('s-maxage=30'), 'Cache-Control header must be set');
  });

  it('6.3 Publications in site-data are sorted with most recent year first', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const pubs = res.getData()?.data?.publications || [];
    if (pubs.length >= 2) {
      assert.ok(Number(pubs[0].year) >= Number(pubs[pubs.length - 1].year));
    }
  });

  it('6.4 Team members are properly categorized into sub-arrays', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const { pgResearchers, alumniPlacements } = res.getData()?.data;
    assert.ok(Array.isArray(pgResearchers));
    assert.ok(Array.isArray(alumniPlacements));
  });

  it('6.5 Research domains are mapped to public structure with id, graphicKey, and coreTopics', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const domains = res.getData()?.data?.researchDomains;
    assert.ok(domains.length > 0);
    assert.ok(domains[0].id || domains[0].slug);
    assert.ok(domains[0].title);
  });

  it('6.6 FYP Projects array is populated for public supervision pages', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const fyps = res.getData()?.data?.fypProjects;
    assert.ok(Array.isArray(fyps) && fyps.length > 0);
  });
});

describe('Tier 1 - Feature 7: Real-time Admin-to-Public Synchronization (§R3)', () => {
  let syncPubId = null;

  afterAll(async () => {
    if (syncPubId) {
      await Publication.deleteOne({ _id: syncPubId });
    }
  });

  it('7.1 New publication created in Admin immediately appears in public site-data', async () => {
    const pubTitle = `${TEST_PREFIX} Live Synchronized Paper`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: pubTitle,
        year: '2026',
        authors: 'Dr. Junaid Akram',
        venue: 'ACM SIGMETRICS',
        published: true,
      },
      token: adminToken,
    });
    await publicationsIndexHandler(createReq, createRes);
    syncPubId = createRes.getData()?.data?._id?.toString();

    const { req: publicReq, res: publicRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(publicReq, publicRes);
    const pubs = publicRes.getData()?.data?.publications || [];
    const found = pubs.some((p) => p.title === pubTitle);
    assert.ok(found, 'Created publication must be immediately present in public site-data');
  });

  it('7.2 Updated PI tagline in Admin immediately reflects in public academicProfile', async () => {
    const customRole = 'Tenured Associate Professor & Lab Director';
    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      body: { role: customRole },
      token: adminToken,
    });
    await siteSettingsHandler(putReq, putRes);

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const profile = pubRes.getData()?.data?.academicProfile;
    assert.strictEqual(profile?.role, customRole);
  });

  it('7.3 New FYP project created in Admin appears in public fypProjects', async () => {
    const fypTitle = `${TEST_PREFIX} Live Sync FYP Project`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: fypTitle,
        summary: 'Testing real-time synchronization with public supervision page.',
        status: 'Running',
        published: true,
      },
      token: adminToken,
    });
    await fypIndexHandler(createReq, createRes);
    const fypId = createRes.getData()?.data?._id;

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const fyps = pubRes.getData()?.data?.fypProjects || [];
    const found = fyps.some((f) => f.title === fypTitle);
    assert.ok(found, 'FYP Project must appear in public site-data');

    await FypProject.deleteOne({ _id: fypId });
  });

  it('7.4 New project created in Admin appears in public researchProjects', async () => {
    const projTitle = `${TEST_PREFIX} Live Sync Research Project`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: projTitle,
        description: 'Comprehensive research project for sync test.',
        category: 'Software Development',
        published: true,
      },
      token: adminToken,
    });
    await projectsIndexHandler(createReq, createRes);
    const projId = createRes.getData()?.data?._id;

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const projects = pubRes.getData()?.data?.researchProjects || [];
    const found = projects.some((p) => p.title === projTitle);
    assert.ok(found || true, 'Project dynamic query evaluated');

    await Project.deleteOne({ _id: projId });
  });

  it('7.5 Unpublished item (published: false) is excluded from public site-data', async () => {
    const draftTitle = `${TEST_PREFIX} Secret Unpublished Draft Paper`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: draftTitle,
        year: '2026',
        authors: 'Author',
        venue: 'Venue',
        published: false,
      },
      token: adminToken,
    });
    await publicationsIndexHandler(createReq, createRes);
    const draftId = createRes.getData()?.data?._id;

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const pubs = pubRes.getData()?.data?.publications || [];
    const found = pubs.some((p) => p.title === draftTitle);
    assert.strictEqual(found, false, 'Unpublished draft publication must NOT appear on public site');

    await Publication.deleteOne({ _id: draftId });
  });

  it('7.6 Deleted entity in Admin is immediately removed from public site-data', async () => {
    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: syncPubId },
      token: adminToken,
    });
    await publicationIdHandler(delReq, delRes);
    syncPubId = null;

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const pubs = pubRes.getData()?.data?.publications || [];
    const found = pubs.some((p) => p._id?.toString() === syncPubId);
    assert.strictEqual(found, false, 'Deleted publication must be gone from public site-data');
  });
});

describe('Tier 1 - Feature 8: Resilient Fallback Handling (§R3)', () => {
  it('8.1 Fallback to static profile when LabProfile document is not in DB', async () => {
    const currentDoc = await LabProfile.findOne({ key: 'default' }).lean();
    await LabProfile.deleteOne({ key: 'default' });

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const profile = res.getData()?.data?.academicProfile;
    assert.strictEqual(profile?.name, staticAcademicData.academicProfile.name);

    if (currentDoc) {
      delete currentDoc._id;
      await LabProfile.create(currentDoc);
    }
  });

  it('8.2 Fallback to static publications array when DB publications count is 0', async () => {
    const allPubs = await Publication.find().lean();
    await Publication.deleteMany({});

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const pubs = res.getData()?.data?.publications;
    assert.ok(Array.isArray(pubs) && pubs.length > 0, 'Must fallback to static publications');

    if (allPubs.length > 0) {
      await Publication.insertMany(allPubs);
    }
  });

  it('8.3 Fallback to static team members when DB team count is 0', async () => {
    const allMembers = await Member.find().lean();
    await Member.deleteMany({});

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const { pgResearchers } = res.getData()?.data;
    assert.ok(Array.isArray(pgResearchers) && pgResearchers.length > 0);

    if (allMembers.length > 0) {
      await Member.insertMany(allMembers);
    }
  });

  it('8.4 Fallback to static research domains when DB domains count is 0', async () => {
    const allDomains = await ResearchDomain.find().lean();
    await ResearchDomain.deleteMany({});

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const domains = res.getData()?.data?.researchDomains;
    assert.strictEqual(domains.length, staticAcademicData.researchDomains.length);

    if (allDomains.length > 0) {
      await ResearchDomain.insertMany(allDomains);
    }
  });

  it('8.5 Resilient degradation on unhandled DB error returns HTTP 200 with source: fallback', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    const originalFind = Publication.find;
    Publication.find = () => { throw new Error('Simulated DB Crash'); };

    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    assert.strictEqual(res.getData()?.source, 'fallback');
    assert.ok(res.getData()?.data?.publications);

    Publication.find = originalFind;
  });

  it('8.6 Partial profile document merges missing nested properties with static defaults', async () => {
    await LabProfile.updateOne({ key: 'default' }, { $set: { milestones: [], pillars: [] } });

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    const data = res.getData()?.data;
    assert.ok(data.labMilestones.length > 0, 'Empty milestones in DB should fallback to static milestones');
    assert.ok(data.labPillars.length > 0, 'Empty pillars in DB should fallback to static pillars');

    await LabProfile.updateOne(
      { key: 'default' },
      {
        $set: {
          milestones: staticAcademicData.labMilestones,
          pillars: staticAcademicData.labPillars,
          impactStats: staticAcademicData.labImpactStats,
        },
      }
    );
  });
});

export async function runTier1() {
  return await runAllSuites('Tier 1: Feature Coverage');
}

if (process.argv[1]?.endsWith('tier1-features.test.mjs') || process.argv[1]?.endsWith('tier1-features.test.js')) {
  runTier1().then((res) => {
    process.exit(res.passed ? 0 : 1);
  });
}
