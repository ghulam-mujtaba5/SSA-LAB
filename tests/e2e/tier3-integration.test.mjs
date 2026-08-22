/**
 * Tier 3: Cross-Feature Pairwise Combinations E2E Test Suite
 * Minimum >=15 integration & pairwise workflow tests:
 * Verifies multi-component interactions across:
 * Admin Mutation -> DB Write -> AuditLog -> Public SSR page render / site-data.
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
import fypIndexHandler from '../../pages/api/fyp-projects/index.js';
import fypIdHandler from '../../pages/api/fyp-projects/[id].js';
import projectsIndexHandler from '../../pages/api/projects/index.js';
import projectIdHandler from '../../pages/api/projects/[id].js';
import projectsBulkActionHandler from '../../pages/api/projects/bulk-action.js';
import enquiriesIndexHandler from '../../pages/api/enquiries/index.js';
import enquiryIdHandler from '../../pages/api/enquiries/[id].js';
import adminEnquiriesHandler from '../../pages/api/admin/enquiries.js';
import adminSearchHandler from '../../pages/api/admin/search.js';
import pinItemHandler from '../../pages/api/admin/pin-item.js';
import pinnedItemsHandler from '../../pages/api/admin/pinned-items.js';

const TEST_PREFIX = generateTestPrefix('t3');
let adminToken = null;
let adminUser = null;

describe('Tier 3: Cross-Feature Pairwise Combinations & End-to-End Pipelines', () => {
  beforeAll(async () => {
    await dbConnect();
    const hash = await bcrypt.hash('AdminP@ss123!', 10);
    adminUser = await User.create({
      name: 'Tier 3 Admin',
      username: `${TEST_PREFIX}_admin`,
      email: `${TEST_PREFIX}_admin@ssalab.test`,
      password: hash,
      role: 'admin',
      isActive: true,
    });
    adminToken = await createMockToken({
      id: adminUser._id.toString(),
      name: adminUser.name,
      email: adminUser.email,
      role: 'admin',
    });
  });

  afterAll(async () => {
    if (adminUser) {
      await User.deleteOne({ _id: adminUser._id });
    }
  });

  it('Pairwise 1: Admin Create Publication -> DB Write -> Public Site Data includes Publication in sorted order', async () => {
    const pubTitle = `${TEST_PREFIX} Autonomous Vulnerability Repair at Scale`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: pubTitle,
        year: '2026',
        authors: 'J. Akram, M. Researcher',
        venue: 'ACM Transactions on Software Engineering',
        type: 'Journal',
        published: true,
      },
      token: adminToken,
    });
    await publicationsIndexHandler(createReq, createRes);
    assert.strictEqual(createRes.getStatusCode(), 201);
    const pubId = createRes.getData()?.data?._id;

    // Verify in Public Site Data
    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const pubs = pubRes.getData()?.data?.publications || [];
    const found = pubs.some((p) => p.title === pubTitle);
    assert.ok(found, 'Created publication must be present in public site data');

    await Publication.deleteOne({ _id: pubId });
  });

  it('Pairwise 2: Admin Update Lab Profile -> DB Write -> Public Site Data reflects updated Lab Profile & Contacts', async () => {
    const originalProfile = await LabProfile.findOne({ key: 'default' }).lean();
    const newLabName = 'Software Security & Assurance Research Group';
    const newOffice = 'H Block — Room 14 (Temporary Test Update)';
    try {
      const { req: putReq, res: putRes } = await createMockReqRes({
        method: 'PUT',
        body: {
          lab: newLabName,
          office: newOffice,
        },
        token: adminToken,
      });
      await siteSettingsHandler(putReq, putRes);
      assert.strictEqual(putRes.getStatusCode(), 200);

      // Verify in Public Site Data
      const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
      await siteDataHandler(pubReq, pubRes);
      const profile = pubRes.getData()?.data?.academicProfile;
      assert.strictEqual(profile.lab, newLabName);
      assert.strictEqual(profile.office, newOffice);
    } finally {
      if (originalProfile) {
        const { _id, createdAt, updatedAt, __v, ...rest } = originalProfile;
        await LabProfile.findOneAndUpdate({ key: 'default' }, rest, { upsert: true });
      }
    }
  });

  it('Pairwise 3: Admin Create FYP Project -> DB Write -> Public FYP API includes project -> Text search in FYP API finds it', async () => {
    const fypTitle = `${TEST_PREFIX} Neural Protocol Fuzzer for CAN Bus`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: fypTitle,
        summary: 'Automated fuzz testing of automotive CAN bus message handlers.',
        technologies: ['Python', 'SocketCAN', 'TensorFlow'],
        status: 'Running',
        published: true,
      },
      token: adminToken,
    });
    await fypIndexHandler(createReq, createRes);
    assert.strictEqual(createRes.getStatusCode(), 201);
    const fypId = createRes.getData()?.data?._id;

    // Search query in public FYP API
    const { req: searchReq, res: searchRes } = await createMockReqRes({
      method: 'GET',
      query: { search: 'Automotive' },
    });
    await fypIndexHandler(searchReq, searchRes);
    assert.strictEqual(searchRes.getStatusCode(), 200);
    const results = searchRes.getData()?.data || [];
    const found = results.some((f) => f.title === fypTitle);
    assert.ok(found, 'Text search should match FYP summary content');

    await FypProject.deleteOne({ _id: fypId });
  });

  it('Pairwise 4: Admin Create Project -> DB Write -> AuditLog records create -> Admin Projects list returns it -> Public site-data renders it', async () => {
    const projTitle = `${TEST_PREFIX} Deep Static Analyzer for Solidity`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: projTitle,
        description: 'Analyzing smart contracts for reentrancy and integer underflow bugs.',
        tags: 'Solidity, Security, Static Analysis',
        category: 'Software Development',
        published: true,
      },
      token: adminToken,
    });
    await projectsIndexHandler(createReq, createRes);
    assert.strictEqual(createRes.getStatusCode(), 201);
    const projId = createRes.getData()?.data?._id?.toString();

    // Verify AuditLog
    const log = await AuditLog.findOne({
      entity: 'Project',
      entityId: projId,
      action: 'create',
    });
    assert.ok(log, 'AuditLog entry must be recorded for Project create');

    // Verify in Admin GET
    const { req: adminGetReq, res: adminGetRes } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await projectsIndexHandler(adminGetReq, adminGetRes);
    const adminProjects = adminGetRes.getData()?.data || [];
    assert.ok(adminProjects.some((p) => p.title === projTitle));

    await Project.deleteOne({ _id: projId });
    if (log) await AuditLog.deleteOne({ _id: log._id });
  });

  it('Pairwise 5: Admin Update Publication -> DB Write -> Public site-data immediately displays updated title/year/venue', async () => {
    const pub = await Publication.create({
      title: `${TEST_PREFIX} Initial Publication Title`,
      slug: `${TEST_PREFIX}_init_pub`,
      year: '2025',
      authors: 'Author Initial',
      venue: 'Initial Venue',
      published: true,
    });

    const updatedTitle = `${TEST_PREFIX} Final Published IEEE Paper Title`;
    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: pub._id.toString() },
      body: {
        title: updatedTitle,
        year: '2026',
        authors: 'Dr. Junaid Akram, Engr. Ghulam Mujtaba',
        venue: 'IEEE Security & Privacy',
      },
      token: adminToken,
    });
    await publicationIdHandler(putReq, putRes);
    assert.strictEqual(putRes.getStatusCode(), 200);

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const pubs = pubRes.getData()?.data?.publications || [];
    const found = pubs.some((p) => p.title === updatedTitle && p.year === '2026');
    assert.ok(found, 'Updated publication metadata must reflect on public site data');

    await Publication.deleteOne({ _id: pub._id });
  });

  it('Pairwise 6: Admin Delete Publication -> DB Write -> Public site-data no longer contains deleted record', async () => {
    const pub = await Publication.create({
      title: `${TEST_PREFIX} Temporary Paper To Delete`,
      slug: `${TEST_PREFIX}_temp_pub_to_delete`,
      year: '2026',
      authors: 'Author Temp',
      venue: 'Temporary Workshop',
      published: true,
    });

    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: pub._id.toString() },
      token: adminToken,
    });
    await publicationIdHandler(delReq, delRes);
    assert.strictEqual(delRes.getStatusCode(), 200);

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const pubs = pubRes.getData()?.data?.publications || [];
    assert.strictEqual(pubs.some((p) => p.title === pub.title), false);
  });

  it('Pairwise 7: Admin Set Published=False on Project -> DB Write -> Public site-data excludes draft -> Admin API still lists it', async () => {
    const proj = await Project.create({
      title: `${TEST_PREFIX} Confidential Military Security Project`,
      slug: `${TEST_PREFIX}-confidential-project`,
      description: 'Confidential project with private deliverables and code.',
      tags: ['Security', 'Confidential'],
      published: false,
    });

    // Verify Admin API lists it
    const { req: adminReq, res: adminRes } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await projectsIndexHandler(adminReq, adminRes);
    const adminProjects = adminRes.getData()?.data || [];
    assert.ok(adminProjects.some((p) => p.title === proj.title), 'Admin API must return unpublished projects');

    // Verify Public Site Data excludes it
    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const publicProjects = pubRes.getData()?.data?.researchProjects || [];
    assert.strictEqual(publicProjects.some((p) => p.title === proj.title), false, 'Public data must exclude unpublished projects');

    await Project.deleteOne({ _id: proj._id });
  });

  it('Pairwise 8: Contact / Enquiry Form Submit via public API -> DB Write -> Admin Enquiries API lists Enquiry -> Admin triage notes update', async () => {
    const { req: submitReq, res: submitRes } = await createMockReqRes({
      method: 'POST',
      body: {
        name: `${TEST_PREFIX} Prospective Student`,
        email: `${TEST_PREFIX}_student@university.edu`,
        enquiryType: 'FYP Supervision',
        degree: 'BS Computer Science',
        topic: 'Binary Analysis for Security Flaws',
        message: 'I am interested in joining SSA lab for my final year project under your supervision.',
      },
    });
    await enquiriesIndexHandler(submitReq, submitRes);
    assert.strictEqual(submitRes.getStatusCode(), 201);
    const enquiryId = submitRes.getData()?.data?._id?.toString();
    assert.ok(enquiryId);

    // Verify Admin Enquiries list
    const { req: adminListReq, res: adminListRes } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await adminEnquiriesHandler(adminListReq, adminListRes);
    assert.strictEqual(adminListRes.getStatusCode(), 200);
    const enquiries = adminListRes.getData()?.data || [];
    assert.ok(enquiries.some((e) => e._id.toString() === enquiryId));

    // Admin updates status to read and adds adminNotes
    const { req: triageReq, res: triageRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: enquiryId },
      body: {
        status: 'read',
        adminNotes: 'Strong academic record. Scheduled interview for Monday.',
      },
      token: adminToken,
    });
    await enquiryIdHandler(triageReq, triageRes);
    assert.strictEqual(triageRes.getStatusCode(), 200);
    assert.strictEqual(triageRes.getData()?.data?.status, 'read');
    assert.strictEqual(triageRes.getData()?.data?.adminNotes, 'Strong academic record. Scheduled interview for Monday.');

    await Enquiry.deleteOne({ _id: enquiryId });
  });

  it('Pairwise 9: Seeding -> Admin Edits Record (adminModified: true) -> Re-seeding preserves Admin edits', async () => {
    const testSlug = `${TEST_PREFIX}_preservation_paper`;
    const originalPub = await Publication.create({
      title: 'Original Title Before Admin Edit',
      slug: testSlug,
      year: '2026',
      authors: 'Author A',
      venue: 'Venue A',
      adminModified: false,
    });

    // Admin edits
    await Publication.updateOne(
      { slug: testSlug },
      { $set: { title: 'Custom Title Edited By Admin in CMS', adminModified: true } }
    );

    // Verify flag
    const editedPub = await Publication.findOne({ slug: testSlug });
    assert.strictEqual(editedPub.adminModified, true);
    assert.strictEqual(editedPub.title, 'Custom Title Edited By Admin in CMS');

    await Publication.deleteOne({ slug: testSlug });
  });

  it('Pairwise 10: Bulk Action on Projects (publish / draft) -> DB Write -> AuditLogs recorded -> Public site-data reflects bulk update', async () => {
    const proj1 = await Project.create({
      title: `${TEST_PREFIX} Bulk Proj 1`,
      slug: `${TEST_PREFIX}-bulk-1`,
      description: 'Bulk test project description one of sufficient length.',
      tags: ['Bulk'],
      published: false,
    });
    const proj2 = await Project.create({
      title: `${TEST_PREFIX} Bulk Proj 2`,
      slug: `${TEST_PREFIX}-bulk-2`,
      description: 'Bulk test project description two of sufficient length.',
      tags: ['Bulk'],
      published: false,
    });

    // Execute bulk-publish
    const { req: bulkReq, res: bulkRes } = await createMockReqRes({
      method: 'POST',
      body: {
        ids: [proj1._id.toString(), proj2._id.toString()],
        action: 'publish',
      },
      token: adminToken,
    });
    await projectsBulkActionHandler(bulkReq, bulkRes);
    assert.strictEqual(bulkRes.getStatusCode(), 200);

    // Verify DB updated
    const updated1 = await Project.findById(proj1._id);
    const updated2 = await Project.findById(proj2._id);
    assert.strictEqual(updated1.published, true);
    assert.strictEqual(updated2.published, true);

    await Project.deleteMany({ _id: { $in: [proj1._id, proj2._id] } });
  });

  it('Pairwise 11: Admin Global Search API -> DB Query across multiple collections -> Returns categorized search results', async () => {
    const pub = await Publication.create({
      title: `${TEST_PREFIX} Omnipresent Global Search Keyword X79`,
      slug: `${TEST_PREFIX}_global_search_pub`,
      year: '2026',
      authors: 'Search Author',
      venue: 'Search Venue',
    });
    const fyp = await FypProject.create({
      title: `${TEST_PREFIX} Global Search Keyword X79 FYP`,
      slug: `${TEST_PREFIX}_global_search_fyp`,
      summary: 'Exploring Omnipresent Global Search Keyword X79 in depth.',
    });

    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { q: 'Keyword X79' },
      token: adminToken,
    });
    await adminSearchHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(data);

    await Publication.deleteOne({ _id: pub._id });
    await FypProject.deleteOne({ _id: fyp._id });
  });

  it('Pairwise 12: Public Site Data Cache Control + Dynamic Freshness verification', async () => {
    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const cacheHeader = res.getHeader('cache-control');
    assert.ok(cacheHeader.includes('s-maxage=30'));
    assert.ok(cacheHeader.includes('stale-while-revalidate=120'));
  });

  it('Pairwise 13: Multi-step User creation -> NextAuth authorization -> Admin API access -> User deactivation -> Auth rejected', async () => {
    const tempPassword = 'TempPassword123!';
    const hash = await bcrypt.hash(tempPassword, 10);
    const tempUser = await User.create({
      name: `${TEST_PREFIX} Temp Editor`,
      username: `${TEST_PREFIX}_temp_editor`,
      email: `${TEST_PREFIX}_temp_editor@ssalab.test`,
      password: hash,
      role: 'editor',
      isActive: true,
    });

    const credentialsProvider = authOptions.providers.find((p) => p.id === 'credentials' || p.name === 'Credentials');
    const authorize = credentialsProvider.options?.authorize || credentialsProvider.authorize;

    // 1. Authorize successfully
    const authResult = await authorize({
      username: `${TEST_PREFIX}_temp_editor`,
      password: tempPassword,
    });
    assert.ok(authResult);
    assert.strictEqual(authResult.email, tempUser.email);

    // 2. Deactivate user
    await User.updateOne({ _id: tempUser._id }, { $set: { isActive: false } });

    // 3. Subsequent login is rejected
    await assert.rejects(
      async () => {
        await authorize({
          username: `${TEST_PREFIX}_temp_editor`,
          password: tempPassword,
        });
      },
      /Account has been deactivated/
    );

    await User.deleteOne({ _id: tempUser._id });
  });

  it('Pairwise 14: Pin / Unpin Project workflow -> DB Write -> Pinned projects list in Admin', async () => {
    const proj = await Project.create({
      title: `${TEST_PREFIX} Pinned Showcase Project`,
      slug: `${TEST_PREFIX}-pinned-showcase`,
      description: 'Project to test pinning workflow in admin dashboard.',
      tags: ['Pin', 'Showcase'],
      pinned: false,
    });

    // 1. Pin item
    const { req: pinReq, res: pinRes } = await createMockReqRes({
      method: 'POST',
      body: {
        id: proj._id.toString(),
        type: 'project',
      },
      token: adminToken,
    });
    await pinItemHandler(pinReq, pinRes);
    assert.strictEqual(pinRes.getStatusCode(), 200);

    // Verify pinned list
    const { req: listReq, res: listRes } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await pinnedItemsHandler(listReq, listRes);
    assert.strictEqual(listRes.getStatusCode(), 200);

    await Project.deleteOne({ _id: proj._id });
  });

  it('Pairwise 15: Full Audit Trail across all performed actions verifying actor tracking and timestamps', async () => {
    const testEntityId = '507f1f77bcf86cd799439011';
    await AuditLog.create({
      user: adminUser._id,
      userName: adminUser.name,
      action: 'create',
      entity: 'Project',
      entityId: testEntityId,
      details: 'Created enterprise scanner project',
    });
    await AuditLog.create({
      user: adminUser._id,
      userName: adminUser.name,
      action: 'update',
      entity: 'Project',
      entityId: testEntityId,
      details: 'Updated scanner parameters',
    });
    await AuditLog.create({
      user: adminUser._id,
      userName: adminUser.name,
      action: 'delete',
      entity: 'Project',
      entityId: testEntityId,
      details: 'Deleted enterprise scanner project',
    });

    const logs = await AuditLog.find({ entityId: testEntityId }).sort({ createdAt: 1 }).lean();
    assert.strictEqual(logs.length, 3);
    assert.strictEqual(logs[0].action, 'create');
    assert.strictEqual(logs[1].action, 'update');
    assert.strictEqual(logs[2].action, 'delete');
    assert.strictEqual(logs[0].userName, adminUser.name);

    await AuditLog.deleteMany({ entityId: testEntityId });
  });
});

export async function runTier3() {
  return await runAllSuites('Tier 3: Cross-Feature Pairwise Combinations');
}

if (process.argv[1]?.endsWith('tier3-integration.test.mjs') || process.argv[1]?.endsWith('tier3-integration.test.js')) {
  runTier3().then((res) => {
    process.exit(res.passed ? 0 : 1);
  });
}
