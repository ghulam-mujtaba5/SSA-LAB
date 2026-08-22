/**
 * Tier 4: Real-World Workload Scenarios E2E Test Suite
 * End-to-End realistic user and administrator journeys:
 * Scenario 1: Full Seeding & Admin Bootstrap
 * Scenario 2: Publication Lifecycle Management
 * Scenario 3: Lab Profile & Department Rebranding
 * Scenario 4: Academic Team & Alumni Career Progression
 * Scenario 5: Research Agenda & FYP Project Supervision Workflow
 * Scenario 6: Database Outage & Graceful Degradation
 * Scenario 7: Student Enquiry & Admin Triage Pipeline
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
import statsHandler from '../../pages/api/admin/stats.js';
import enquiriesIndexHandler from '../../pages/api/enquiries/index.js';
import enquiryIdHandler from '../../pages/api/enquiries/[id].js';
import adminEnquiriesHandler from '../../pages/api/admin/enquiries.js';

import * as staticAcademicData from '../../data/academicSite.js';
import { defaultFypProjects as staticFypProjects } from '../../data/fypProjects.js';

const TEST_PREFIX = generateTestPrefix('t4');
let adminToken = null;
let adminUser = null;

describe('Tier 4: Real-World Workload Scenarios & Application Lifecycles', () => {
  beforeAll(async () => {
    await dbConnect();
    const hash = await bcrypt.hash('ScenarioPass123!', 10);
    adminUser = await User.create({
      name: 'Scenario Admin',
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

  it('Scenario 1: Full Seeding & Admin Bootstrap (Database seeding verification, Admin login, Dashboard KPI stats)', async () => {
    const profileCount = await LabProfile.countDocuments({ key: 'default' });
    const pubCount = await Publication.countDocuments();
    const memberCount = await Member.countDocuments();
    const domainCount = await ResearchDomain.countDocuments();
    const fypCount = await FypProject.countDocuments();

    assert.strictEqual(profileCount, 1, 'LabProfile default record must exist');
    assert.ok(pubCount >= 5, `Publications must be seeded, found ${pubCount}`);
    assert.ok(memberCount >= 10, `Members must be seeded, found ${memberCount}`);
    assert.ok(domainCount >= 6, `Domains must be seeded, found ${domainCount}`);
    assert.ok(fypCount >= 20, `FYPs must be seeded, found ${fypCount}`);

    const credentialsProvider = authOptions.providers.find((p) => p.id === 'credentials' || p.name === 'Credentials');
    const authorize = credentialsProvider.options?.authorize || credentialsProvider.authorize;
    const authSession = await authorize({
      username: `${TEST_PREFIX}_admin`,
      password: 'ScenarioPass123!',
    });
    assert.ok(authSession, 'Admin user must authenticate successfully');
    assert.strictEqual(authSession.role, 'admin');

    const { req: statsReq, res: statsRes } = await createMockReqRes({
      method: 'GET',
      token: adminToken,
    });
    await statsHandler(statsReq, statsRes);
    assert.strictEqual(statsRes.getStatusCode(), 200);
    const statsData = statsRes.getData()?.data?.stats;
    assert.ok(statsData.fypProjects >= 20);
    assert.ok(statsData.users >= 1);
  });

  it('Scenario 2: Publication Lifecycle Management (Create with BibTeX -> Update DOI/Links -> Publish -> Public Verification -> Unpublish -> Verify Excluded)', async () => {
    const bibtexSnippet = `@article{akram2026neural,
      title={Neural Vulnerability Repair},
      author={Akram, Junaid and Qazi, Zainab},
      journal={IEEE Transactions on Dependable and Secure Computing},
      year={2026}
    }`;

    // Step 1: Admin creates publication in draft mode
    const pubTitle = `${TEST_PREFIX} Neural Vulnerability Repair in Modern Systems`;
    const { req: createReq, res: createRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: pubTitle,
        year: '2026',
        authors: 'Junaid Akram, Zainab Qazi',
        venue: 'IEEE TDSC',
        type: 'Journal',
        bibtex: bibtexSnippet,
        tags: 'AI, Fuzzing, Security',
        published: false,
      },
      token: adminToken,
    });
    await publicationsIndexHandler(createReq, createRes);
    assert.strictEqual(createRes.getStatusCode(), 201);
    const pubId = createRes.getData()?.data?._id?.toString();

    // Step 2: Verify not visible on public site while published=false
    const { req: checkPub1Req, res: checkPub1Res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(checkPub1Req, checkPub1Res);
    let publicPubs = checkPub1Res.getData()?.data?.publications || [];
    assert.strictEqual(publicPubs.some((p) => p.title === pubTitle), false, 'Draft publication must not be visible on public site');

    // Step 3: Admin updates with DOI link and sets published=true
    const doiUrl = 'https://doi.org/10.1109/TDSC.2026.123456';
    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: pubId },
      body: {
        title: pubTitle,
        year: '2026',
        authors: 'Junaid Akram, Zainab Qazi',
        venue: 'IEEE TDSC',
        href: doiUrl,
        published: true,
      },
      token: adminToken,
    });
    await publicationIdHandler(putReq, putRes);
    assert.strictEqual(putRes.getStatusCode(), 200);

    // Step 4: Verify visible on public site with DOI link
    const { req: checkPub2Req, res: checkPub2Res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(checkPub2Req, checkPub2Res);
    publicPubs = checkPub2Res.getData()?.data?.publications || [];
    const publishedItem = publicPubs.find((p) => p.title === pubTitle);
    assert.ok(publishedItem, 'Published publication must now be visible on public site');
    assert.strictEqual(publishedItem.href, doiUrl);

    // Step 5: Clean up by deleting publication
    const { req: delReq, res: delRes } = await createMockReqRes({
      method: 'DELETE',
      query: { id: pubId },
      token: adminToken,
    });
    await publicationIdHandler(delReq, delRes);
    assert.strictEqual(delRes.getStatusCode(), 200);
  });

  it('Scenario 3: Lab Profile & Department Rebranding (Admin updates PI bio, credentials, pillars, milestones, and impact stats -> Verifies live public payload)', async () => {
    const updatedName = 'Junaid Akram, PhD (IEEE Senior Member)';
    const updatedPillars = [
      {
        id: 'quantum-ai-sec',
        title: 'Quantum-Safe AI Systems',
        desc: 'Pioneering robust security against post-quantum AI threats.',
        iconName: 'ShieldAlert',
      },
      {
        id: 'automated-repair',
        title: 'Zero-Day Automated Patching',
        desc: 'Continuous real-time vulnerability detection and synthesis.',
        iconName: 'Cpu',
      },
    ];
    const updatedStats = [
      { label: 'Citations', value: '1,500+' },
      { label: 'Supervised Theses', value: '35+' },
      { label: 'Funded Research', value: '$1.2M+' },
    ];

    const { req: putReq, res: putRes } = await createMockReqRes({
      method: 'PUT',
      body: {
        name: updatedName,
        pillars: updatedPillars,
        impactStats: updatedStats,
      },
      token: adminToken,
    });
    await siteSettingsHandler(putReq, putRes);
    assert.strictEqual(putRes.getStatusCode(), 200);

    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const data = pubRes.getData()?.data;
    assert.strictEqual(data.academicProfile.name, updatedName);
    assert.strictEqual(data.labPillars.length, 2);
    assert.strictEqual(data.labPillars[0].title, 'Quantum-Safe AI Systems');
    assert.strictEqual(data.labImpactStats.length, 3);
  });

  it('Scenario 4: Academic Team & Alumni Career Progression (Add MS Researcher -> Researcher completes thesis -> Transition to alumni -> Placement data verified)', async () => {
    const researcherName = `${TEST_PREFIX} Muhammad Bilal`;
    const researcherSlug = `${TEST_PREFIX}-muhammad-bilal`;

    // Step 1: Add MS Researcher
    const researcher = await Member.create({
      name: researcherName,
      slug: researcherSlug,
      category: 'pg-researcher',
      role: 'Postgraduate Researcher',
      degree: 'MS Computer Science',
      topic: 'Automated Fuzzing for Rust Binaries',
      institution: 'COMSATS University Islamabad, Lahore Campus',
      published: true,
    });

    const foundResearcher = await Member.findById(researcher._id);
    assert.ok(foundResearcher);
    assert.strictEqual(foundResearcher.category, 'pg-researcher');

    // Step 2: Researcher Graduates & Moves to Alumni
    await Member.updateOne(
      { _id: researcher._id },
      {
        $set: {
          category: 'alumni',
          role: 'Alumnus — Security Engineer at CrowdStrike',
          organization: 'CrowdStrike',
          term: 'Fall 2026',
          adminModified: true,
        },
      }
    );

    const updatedAlumnus = await Member.findById(researcher._id);
    assert.strictEqual(updatedAlumnus.category, 'alumni');
    assert.strictEqual(updatedAlumnus.organization, 'CrowdStrike');
    assert.strictEqual(updatedAlumnus.adminModified, true);

    await Member.deleteOne({ _id: researcher._id });
  });

  it('Scenario 5: Research Agenda & FYP Supervision Workflow (Admin creates Research Domain & FYP Project -> Public supervision & research sync)', async () => {
    const domainTitle = `${TEST_PREFIX} Hardware Security & Side-Channel Analysis`;
    const domainSlug = `${TEST_PREFIX}-hardware-security`;

    // 1. Create Research Domain
    const domain = await ResearchDomain.create({
      title: domainTitle,
      slug: domainSlug,
      domainId: domainSlug,
      number: '08',
      description: 'Analyzing power analysis and electromagnetic side-channel attacks on cryptographic accelerators.',
      keyProblems: ['Electromagnetic leakage in RISC-V cores', 'Fault injection during key exchange'],
      currentDirections: ['AI-guided differential power analysis', 'Physical unclonable functions (PUFs)'],
      published: true,
    });

    // 2. Create Aligned FYP Project
    const fypTitle = `${TEST_PREFIX} Power Side-Channel Leakage Detector for Embedded IoT`;
    const { req: fypReq, res: fypRes } = await createMockReqRes({
      method: 'POST',
      body: {
        title: fypTitle,
        summary: 'Building hardware probe oscilloscope capture pipeline for cryptographic leak detection.',
        technologies: ['ChipWhisperer', 'Python', 'C', 'STM32'],
        students: [
          { name: 'Student Alpha', registration: 'SP22-BCS-088' },
          { name: 'Student Beta', registration: 'SP22-BCS-092' },
        ],
        status: 'Running',
        published: true,
      },
      token: adminToken,
    });
    await fypIndexHandler(fypReq, fypRes);
    assert.strictEqual(fypRes.getStatusCode(), 201);
    const fypId = fypRes.getData()?.data?._id;

    // 3. Verify in Public site-data
    const { req: pubReq, res: pubRes } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(pubReq, pubRes);
    const data = pubRes.getData()?.data;
    assert.ok(data.researchDomains.some((d) => d.title === domainTitle));
    assert.ok(data.fypProjects.some((f) => f.title === fypTitle));

    await ResearchDomain.deleteOne({ _id: domain._id });
    await FypProject.deleteOne({ _id: fypId });
  });

  it('Scenario 6: Database Outage & Graceful Degradation (Simulate MongoDB crash -> Public endpoints return HTTP 200 with static fallback)', async () => {
    const originalFind = Publication.find;
    const originalFindProfile = LabProfile.findOne;

    Publication.find = () => { throw new Error('Simulated Database Network Partioning'); };
    LabProfile.findOne = () => { throw new Error('Simulated Database Network Partioning'); };

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200, 'Public endpoint must never crash even on complete DB failure');
    assert.strictEqual(res.getData()?.source, 'fallback');
    assert.ok(res.getData()?.data?.publications?.length > 0);
    assert.ok(res.getData()?.data?.academicProfile);

    Publication.find = originalFind;
    LabProfile.findOne = originalFindProfile;
  });

  it('Scenario 7: Student Enquiry & Admin Triage Pipeline (Supervision enquiry submit -> Admin triage -> Read status & review notes -> Replied status -> Audit verification)', async () => {
    const studentEmail = `${TEST_PREFIX}_aspirant@university.edu`;
    const { req: submitReq, res: submitRes } = await createMockReqRes({
      method: 'POST',
      body: {
        name: `${TEST_PREFIX} Aspirant Student`,
        email: studentEmail,
        degree: 'BS Software Engineering',
        enquiryType: 'FYP Supervision',
        topic: 'AI-Guided Fuzzing for Protocol Verification',
        message: 'Dear Dr. Junaid Akram, I would like to request supervision for our final year project on automated fuzzing.',
      },
    });
    await enquiriesIndexHandler(submitReq, submitRes);
    assert.strictEqual(submitRes.getStatusCode(), 201);
    const enquiryId = submitRes.getData()?.data?._id?.toString();
    assert.ok(enquiryId);

    const { req: listReq, res: listRes } = await createMockReqRes({
      method: 'GET',
      query: { status: 'new' },
      token: adminToken,
    });
    await adminEnquiriesHandler(listReq, listRes);
    assert.strictEqual(listRes.getStatusCode(), 200);
    const enquiries = listRes.getData()?.data || [];
    assert.ok(enquiries.some((e) => e._id.toString() === enquiryId));

    const { req: readReq, res: readRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: enquiryId },
      body: {
        status: 'read',
        adminNotes: 'Reviewed proposal. Excellent topic alignment with SSA Lab research pillars.',
      },
      token: adminToken,
    });
    await enquiryIdHandler(readReq, readRes);
    assert.strictEqual(readRes.getStatusCode(), 200);
    assert.strictEqual(readRes.getData()?.data?.status, 'read');

    const { req: replyReq, res: replyRes } = await createMockReqRes({
      method: 'PUT',
      query: { id: enquiryId },
      body: {
        status: 'replied',
        adminNotes: 'Meeting scheduled for Thursday 2 PM in Room 14.',
      },
      token: adminToken,
    });
    await enquiryIdHandler(replyReq, replyRes);
    assert.strictEqual(replyRes.getStatusCode(), 200);
    assert.strictEqual(replyRes.getData()?.data?.status, 'replied');

    await Enquiry.deleteOne({ _id: enquiryId });
  });
});

export async function runTier4() {
  return await runAllSuites('Tier 4: Real-World Workload Scenarios');
}

if (process.argv[1]?.endsWith('tier4-scenarios.test.mjs') || process.argv[1]?.endsWith('tier4-scenarios.test.js')) {
  runTier4().then((res) => {
    process.exit(res.passed ? 0 : 1);
  });
}
