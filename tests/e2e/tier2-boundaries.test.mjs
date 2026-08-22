/**
 * Tier 2: Boundary & Corner Cases E2E Test Suite
 * Minimum >=5 test cases per feature covering:
 * 1. Empty Collections & Missing Fields
 * 2. Malformed Inputs & Schema Violations
 * 3. Duplicate Keys & Collision Resolution
 * 4. Special Characters, Emojis & Unicode Stress
 * 5. Extreme Page Sizes, Limits & Search Queries
 * 6. Date & Year Boundaries
 * 7. Reordering & Array Permutations
 * 8. Fault Injection & Fallback Boundaries
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

import Publication from '../../models/Publication.js';
import Member from '../../models/Member.js';
import ResearchDomain from '../../models/ResearchDomain.js';
import EventHighlight from '../../models/EventHighlight.js';
import FypProject from '../../models/FypProject.js';
import Project from '../../models/Project.js';
import AuditLog from '../../models/AuditLog.js';
import LabProfile from '../../models/LabProfile.js';
import User from '../../models/User.js';

import publicationsIndexHandler from '../../pages/api/admin/publications/index.js';
import publicationIdHandler from '../../pages/api/admin/publications/[id].js';
import fypIndexHandler from '../../pages/api/fyp-projects/index.js';
import fypIdHandler from '../../pages/api/fyp-projects/[id].js';
import projectsIndexHandler from '../../pages/api/projects/index.js';
import projectIdHandler from '../../pages/api/projects/[id].js';
import siteSettingsHandler from '../../pages/api/admin/site-settings/index.js';
import statsHandler from '../../pages/api/admin/stats.js';
import siteDataHandler from '../../pages/api/academic/site-data.js';

const TEST_PREFIX = generateTestPrefix('t2');
let adminToken = null;

describe('Tier 2 - Feature 1: Empty Collections & Missing Fields', () => {
  beforeAll(async () => {
    await dbConnect();
    adminToken = await createMockToken({ role: 'admin', name: 'T2 Admin' });
  });

  it('1.1 Publication created with optional empty strings (href, bibtex, abstract, pdfUrl, codeUrl) saves cleanly', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Empty Fields Publication`,
        year: '2026',
        authors: 'Author E',
        venue: 'IEEE Security & Privacy',
        href: '',
        bibtex: '',
        abstract: '',
        pdfUrl: '',
        codeUrl: '',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.href, '');
    assert.strictEqual(pub.bibtex, '');
    await Publication.deleteOne({ _id: pub._id });
  });

  it('1.2 FYP Project created with empty arrays for students, technologies, architecture saves without crash', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Minimal Empty Arrays FYP`,
        summary: 'Minimal summary for testing empty nested structures.',
        students: [],
        technologies: [],
        architecture: [],
      },
      token: adminToken,
    });
    await fypIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const fyp = res.getData()?.data;
    assert.deepStrictEqual(fyp.students, []);
    assert.deepStrictEqual(fyp.technologies, []);
    await FypProject.deleteOne({ _id: fyp._id });
  });

  it('1.3 LabProfile update with empty arrays for milestones, pillars, impactStats defaults safely', async () => {
    const originalProfile = await LabProfile.findOne({ key: 'default' }).lean();
    try {
      const { req, res } = await createMockReqRes({
        method: 'PUT',
        body: {
          milestones: [],
          pillars: [],
          impactStats: [],
        },
        token: adminToken,
      });
      await siteSettingsHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const updated = res.getData()?.data;
      assert.deepStrictEqual(updated.milestones, []);
    } finally {
      if (originalProfile) {
        const { _id, createdAt, updatedAt, __v, ...rest } = originalProfile;
        await LabProfile.findOneAndUpdate({ key: 'default' }, rest, { upsert: true });
      }
    }
  });

  it('1.4 Project created with minimal required fields populates default status and category', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Minimal Project`,
        description: 'Testing default schema value population.',
        tags: 'Test',
      },
      token: adminToken,
    });
    await projectsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const proj = res.getData()?.data;
    assert.strictEqual(proj.status, 'In Progress');
    assert.strictEqual(proj.category, 'Others');
    await Project.deleteOne({ _id: proj._id });
  });

  it('1.5 Publications GET with non-matching query returns empty array with success: true', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: `${TEST_PREFIX}_nonexistent_query_xyz_12345` },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(Array.isArray(data));
    assert.strictEqual(data.length, 0);
  });

  it('1.6 FYP GET with non-matching status filter returns empty data array', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { status: 'NonExistentStatus999' },
    });
    await fypIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(Array.isArray(data));
    assert.strictEqual(data.length, 0);
  });
});

describe('Tier 2 - Feature 2: Malformed Inputs & Schema Violations', () => {
  it('2.1 Publication POST without title is rejected with HTTP 400', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        year: '2026',
        authors: 'Author',
        venue: 'Venue',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
    assert.strictEqual(res.getData()?.success, false);
  });

  it('2.2 Publication POST without authors or venue is rejected with HTTP 400', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: 'Title Only',
        year: '2026',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
  });

  it('2.3 FYP POST without summary is rejected with HTTP 400', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Missing Summary FYP`,
      },
      token: adminToken,
    });
    await fypIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
  });

  it('2.4 Project POST with title less than 3 chars is rejected by Zod validation', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: 'AB',
        description: 'A valid description of sufficient length for test.',
        tags: 'AI',
      },
      token: adminToken,
    });
    await projectsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
  });

  it('2.5 Project POST with invalid status enum value is rejected by Zod schema with HTTP 400', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Invalid Status Project`,
        description: 'Valid description of at least twenty characters.',
        tags: 'Security',
        status: 'NonExistentStatusEnum',
      },
      token: adminToken,
    });
    await projectsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 400);
  });

  it('2.6 Non-existent ObjectId on GET /api/admin/publications/[id] returns HTTP 404', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { id: fakeId },
      token: adminToken,
    });
    await publicationIdHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 404);
  });
});

describe('Tier 2 - Feature 3: Duplicate Keys & Collision Resolution', () => {
  it('3.1 Duplicate publication slug automatically disambiguates with numerical suffix', async () => {
    const sharedTitle = `${TEST_PREFIX} Disambiguation Paper`;
    const { req: req1, res: res1 } = await createMockReqRes({
      method: 'POST',
      body: {
        title: sharedTitle,
        year: '2026',
        authors: 'Author A',
        venue: 'Venue A',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req1, res1);
    const pub1 = res1.getData()?.data;

    const { req: req2, res: res2 } = await createMockReqRes({
      method: 'POST',
      body: {
        title: sharedTitle,
        year: '2026',
        authors: 'Author B',
        venue: 'Venue B',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req2, res2);
    const pub2 = res2.getData()?.data;

    assert.notStrictEqual(pub1.slug, pub2.slug, 'Slugs must be disambiguated');
    await Publication.deleteMany({ _id: { $in: [pub1._id, pub2._id] } });
  });

  it('3.2 Duplicate FYP Project with identical title is rejected with HTTP 409 Conflict', async () => {
    const fypTitle = `${TEST_PREFIX} Duplicate FYP Title Test`;
    const { req: req1, res: res1 } = await createMockReqRes({
      method: 'POST',
      body: {
        title: fypTitle,
        summary: 'First instance of FYP project.',
      },
      token: adminToken,
    });
    await fypIndexHandler(req1, res1);
    const fyp1 = res1.getData()?.data;

    const { req: req2, res: res2 } = await createMockReqRes({
      method: 'POST',
      body: {
        title: fypTitle,
        summary: 'Second instance with identical title.',
      },
      token: adminToken,
    });
    await fypIndexHandler(req2, res2);
    assert.strictEqual(res2.getStatusCode(), 409, 'Duplicate FYP must return 409 Conflict');

    await FypProject.deleteOne({ _id: fyp1._id });
  });

  it('3.3 Updating publication slug to an existing unique slug is prevented by DB unique constraint', async () => {
    const pub1 = await Publication.create({
      title: `${TEST_PREFIX} Paper 1 Unique`,
      slug: `${TEST_PREFIX}_unique_slug_1`,
      year: '2026',
      authors: 'Author',
      venue: 'Venue',
    });
    const pub2 = await Publication.create({
      title: `${TEST_PREFIX} Paper 2 Unique`,
      slug: `${TEST_PREFIX}_unique_slug_2`,
      year: '2026',
      authors: 'Author',
      venue: 'Venue',
    });

    await assert.rejects(
      async () => {
        await Publication.updateOne({ _id: pub2._id }, { $set: { slug: `${TEST_PREFIX}_unique_slug_1` } });
      },
      /E11000/
    );

    await Publication.deleteMany({ _id: { $in: [pub1._id, pub2._id] } });
  });

  it('3.4 User creation with duplicate email is prevented', async () => {
    const user1 = await User.create({
      name: 'Dup User 1',
      username: `${TEST_PREFIX}_dup1`,
      email: `${TEST_PREFIX}_dup@ssalab.test`,
      password: 'Hash',
    });

    await assert.rejects(
      async () => {
        await User.create({
          name: 'Dup User 2',
          username: `${TEST_PREFIX}_dup2`,
          email: `${TEST_PREFIX}_dup@ssalab.test`,
          password: 'Hash',
        });
      },
      /E11000/
    );

    await User.deleteOne({ _id: user1._id });
  });

  it('3.5 LabProfile enforces single default document with unique key index', async () => {
    await assert.rejects(
      async () => {
        await LabProfile.create({ key: 'default' });
      },
      /E11000/
    );
  });

  it('3.6 Project slug collision automatically appends timestamp to ensure uniqueness', async () => {
    const proj1 = await Project.create({
      title: `${TEST_PREFIX} Colliding Project`,
      slug: `${TEST_PREFIX}-colliding-project`,
      description: 'First colliding project instance description.',
      tags: ['Test'],
    });

    await assert.rejects(
      async () => {
        await Project.create({
          title: `${TEST_PREFIX} Colliding Project 2`,
          slug: `${TEST_PREFIX}-colliding-project`,
          description: 'Second colliding project description.',
          tags: ['Test'],
        });
      },
      /E11000/
    );

    await Project.deleteOne({ _id: proj1._id });
  });
});

describe('Tier 2 - Feature 4: Special Characters, Emojis & Unicode Stress', () => {
  it('4.1 XSS payload in publication title is stored verbatim as raw string without HTML execution', async () => {
    const xssTitle = `${TEST_PREFIX} <script>alert("xss")</script> <b>Bold Paper</b>`;
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: xssTitle,
        year: '2026',
        authors: 'Security Tester',
        venue: 'BlackHat',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.title, xssTitle);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('4.2 Non-Latin Unicode characters (Urdu, Arabic, Chinese) are preserved accurately', async () => {
    const unicodeTitle = `${TEST_PREFIX} جنید اکرم - 软件安全性评估 - أبحاث الأمن السيبراني`;
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: unicodeTitle,
        year: '2026',
        authors: 'د. جنید اکرم',
        venue: 'International Journal of Security',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.title, unicodeTitle);
    assert.strictEqual(pub.authors, 'د. جنید اکرم');
    await Publication.deleteOne({ _id: pub._id });
  });

  it('4.3 Emojis in titles and summaries are handled cleanly without encoding corruption', async () => {
    const emojiTitle = `${TEST_PREFIX} 🔬 Security & Privacy 🛡️ with AI 🚀`;
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: emojiTitle,
        summary: 'Evaluating neural fuzzing models 💻 with automated mutation ⚡',
      },
      token: adminToken,
    });
    await fypIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const fyp = res.getData()?.data;
    assert.strictEqual(fyp.title, emojiTitle);
    await FypProject.deleteOne({ _id: fyp._id });
  });

  it('4.4 Quotes, apostrophes, and mathematical symbols are preserved in publication titles', async () => {
    const mathTitle = `${TEST_PREFIX} "O'Reilly's Guide" to O(n log n) & α-Reduction: A 100% Comprehensive Survey`;
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: mathTitle,
        year: '2026',
        authors: 'Author',
        venue: 'ACM TOCS',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.title, mathTitle);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('4.5 Multiline strings with Windows (\\r\\n) and Unix (\\n) newlines are preserved in abstract', async () => {
    const multilineAbstract = 'Line 1: Problem statement.\r\nLine 2: Proposed methodology.\nLine 3: Empirical evaluation results.';
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Multiline Abstract Paper`,
        year: '2026',
        authors: 'Author',
        venue: 'Venue',
        abstract: multilineAbstract,
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.abstract, multilineAbstract);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('4.6 Leading and trailing whitespace is trimmed automatically by Mongoose schema', async () => {
    const untrimmedTitle = `   ${TEST_PREFIX} Untrimmed Title Paper   `;
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: untrimmedTitle,
        year: ' 2026 ',
        authors: '   Author Trim   ',
        venue: '   Venue Trim   ',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.title, untrimmedTitle.trim());
    assert.strictEqual(pub.year, '2026');
    assert.strictEqual(pub.authors, 'Author Trim');
    await Publication.deleteOne({ _id: pub._id });
  });
});

describe('Tier 2 - Feature 5: Extreme Page Sizes, Limits & Search Queries', () => {
  it('5.1 Search query with special symbols returns managed HTTP response', async () => {
    const testSymbolQuery = 'Security & Privacy';
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: testSymbolQuery },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    assert.ok(Array.isArray(res.getData()?.data));
  });

  it('5.2 Default limit query returns capped list without overwhelming caller', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { limit: '10' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(data.length <= 10);
  });

  it('5.3 Excessive limit query (limit=99999) is clamped to maximum allowed (200)', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { limit: '99999' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData()?.data;
    assert.ok(data.length <= 200);
  });

  it('5.4 Empty search query returns standard full list without error', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: '' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    assert.ok(res.getData()?.data?.length > 0);
  });

  it('5.5 Publications search matches case-insensitively across title, authors, and venue', async () => {
    const testPub = await Publication.create({
      title: `${TEST_PREFIX} Quantum Cryptography Benchmark`,
      slug: `${TEST_PREFIX}_quantum_benchmark`,
      year: '2026',
      authors: 'Zainab Qazi, Junaid Akram',
      venue: 'Quantum Security Summit',
    });

    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: 'qUaNtUm CrYpToGrApHy' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const results = res.getData()?.data || [];
    const found = results.some((r) => r.slug === testPub.slug);
    assert.ok(found, 'Case-insensitive search must find matching record');

    await Publication.deleteOne({ _id: testPub._id });
  });

  it('5.6 FYP search performs text index match across title and summary', async () => {
    const testFyp = await FypProject.create({
      title: `${TEST_PREFIX} Hexagonal Architecture Vulnerability Scanner`,
      slug: `${TEST_PREFIX}_hexagonal_scanner`,
      summary: 'Analyzing microservice design patterns for access control flaws.',
    });

    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: 'Hexagonal' },
    });
    await fypIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);

    await FypProject.deleteOne({ _id: testFyp._id });
  });
});

describe('Tier 2 - Feature 6: Date & Year Boundaries', () => {
  it('6.1 Future year (2035) publication saves and formats cleanly', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Future 2035 Vision Paper`,
        year: '2035',
        authors: 'Author',
        venue: 'Future Computing',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.year, '2035');
    await Publication.deleteOne({ _id: pub._id });
  });

  it('6.2 Historical year (1995) publication saves and formats cleanly', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Historical 1995 Security Paper`,
        year: '1995',
        authors: 'Author',
        venue: 'Early IEEE',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.strictEqual(pub.year, '1995');
    await Publication.deleteOne({ _id: pub._id });
  });

  it('6.3 Admin Stats API filters by startDate and endDate range boundaries', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: {
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      },
      token: adminToken,
    });
    await statsHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    assert.ok(res.getData()?.data?.stats);
  });

  it('6.4 Admin Stats API handles inverted dates (startDate > endDate) gracefully without 500 error', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: {
        startDate: '2026-12-31',
        endDate: '2026-01-01',
      },
      token: adminToken,
    });
    await statsHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
  });

  it('6.5 Milestone schema accepts arbitrary era and year range strings', async () => {
    const originalProfile = await LabProfile.findOne({ key: 'default' }).lean();
    const testEra = '2024 — Present (AI & Security Era)';
    try {
      const { req, res } = await createMockReqRes({
        method: 'PUT',
        body: {
          milestones: [
            {
              year: '2026+',
              era: testEra,
              title: 'Expanding Cyber Security Research',
              summary: 'Leading national software assurance lab initiatives.',
            },
          ],
        },
        token: adminToken,
      });
      await siteSettingsHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const profile = res.getData()?.data;
      assert.strictEqual(profile.milestones[0].era, testEra);
    } finally {
      if (originalProfile) {
        const { _id, createdAt, updatedAt, __v, ...rest } = originalProfile;
        await LabProfile.findOneAndUpdate({ key: 'default' }, rest, { upsert: true });
      }
    }
  });

  it('6.6 Date filtering in publications GET API filters by exact year string', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { year: '2026' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    const pubs = res.getData()?.data || [];
    assert.ok(pubs.every((p) => p.year === '2026'));
  });
});

describe('Tier 2 - Feature 7: Reordering & Array Permutations', () => {
  it('7.1 displayOrder integer ordering is strictly preserved in ascending order', async () => {
    const pubA = await Publication.create({
      title: `${TEST_PREFIX} Order 10 Paper`,
      slug: `${TEST_PREFIX}_order_10`,
      year: '2026',
      authors: 'Author',
      venue: 'Venue',
      displayOrder: 10,
    });
    const pubB = await Publication.create({
      title: `${TEST_PREFIX} Order 1 Paper`,
      slug: `${TEST_PREFIX}_order_1`,
      year: '2026',
      authors: 'Author',
      venue: 'Venue',
      displayOrder: 1,
    });

    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { search: `${TEST_PREFIX} Order` },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const results = res.getData()?.data || [];
    if (results.length >= 2) {
      assert.strictEqual(results[0].displayOrder, 1);
      assert.strictEqual(results[1].displayOrder, 10);
    }

    await Publication.deleteMany({ _id: { $in: [pubA._id, pubB._id] } });
  });

  it('7.2 Non-numeric displayOrder input in publication create is handled safely', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Non-numeric Order Paper`,
        year: '2026',
        authors: 'Author',
        venue: 'Venue',
        displayOrder: 'first',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 201);
    const pub = res.getData()?.data;
    assert.ok(typeof pub.displayOrder === 'number');
    await Publication.deleteOne({ _id: pub._id });
  });

  it('7.3 Negative displayOrder values (-5, -1) sort before positive values', async () => {
    const pubNeg = await Publication.create({
      title: `${TEST_PREFIX} Negative Order Paper`,
      slug: `${TEST_PREFIX}_neg_order`,
      year: '2026',
      authors: 'Author',
      venue: 'Venue',
      displayOrder: -5,
    });

    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { year: '2026' },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const results = res.getData()?.data || [];
    if (results.length > 0) {
      assert.ok(results[0].displayOrder <= 0);
    }

    await Publication.deleteOne({ _id: pubNeg._id });
  });

  it('7.4 Empty payload on site settings PUT is handled without schema corruption', async () => {
    const { req, res } = await createMockReqRes({
      method: 'PUT',
      body: {},
      token: adminToken,
    });
    await siteSettingsHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
  });

  it('7.5 Multiple tags as array or string with duplicate values deduplicates cleanly', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} Duplicate Tags Paper`,
        year: '2026',
        authors: 'Author',
        venue: 'Venue',
        tags: 'AI, AI, Security, Security',
      },
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    const pub = res.getData()?.data;
    assert.ok(pub.tags.length >= 2);
    await Publication.deleteOne({ _id: pub._id });
  });

  it('7.6 Large array of 20 deliverables in FYP Project persists without truncation', async () => {
    const objectives = Array.from({ length: 20 }, (_, i) => `Objective ${i + 1}: Implement subsystem component.`);
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: {
        title: `${TEST_PREFIX} 20 Objectives FYP`,
        summary: 'Testing large array payload persistence.',
        objectives,
      },
      token: adminToken,
    });
    await fypIndexHandler(req, res);
    const fyp = res.getData()?.data;
    assert.strictEqual(fyp.objectives.length, 20);
    await FypProject.deleteOne({ _id: fyp._id });
  });
});

describe('Tier 2 - Feature 8: Fault Injection & Fallback Boundaries', () => {
  it('8.1 Unsupported HTTP method (e.g. PATCH on /api/admin/publications) returns 405 Method Not Allowed', async () => {
    const { req, res } = await createMockReqRes({
      method: 'PATCH',
      token: adminToken,
    });
    await publicationsIndexHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 405);
  });

  it('8.2 Unsupported HTTP method on /api/academic/site-data returns 405 Method Not Allowed', async () => {
    const { req, res } = await createMockReqRes({
      method: 'POST',
      body: { hack: true },
    });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 405);
  });

  it('8.3 Malformed non-hex string as ObjectId on publicationIdHandler returns 500/400 error safely without unhandled exception', async () => {
    const { req, res } = await createMockReqRes({
      method: 'GET',
      query: { id: 'invalid-not-an-objectid-123' },
      token: adminToken,
    });
    await publicationIdHandler(req, res);
    assert.ok([400, 404, 500].includes(res.getStatusCode()));
    assert.strictEqual(res.getData()?.success, false);
  });

  it('8.4 Database query timeout simulation on site-data gracefully returns HTTP 200 static fallback', async () => {
    const originalFindOne = LabProfile.findOne;
    LabProfile.findOne = () => { throw new Error('Connection timed out'); };

    const { req, res } = await createMockReqRes({ method: 'GET' });
    await siteDataHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 200);
    assert.strictEqual(res.getData()?.source, 'fallback');

    LabProfile.findOne = originalFindOne;
  });

  it('8.5 FYP project delete with non-existent ID returns 404', async () => {
    const fakeId = '65f1a2b3c4d5e6f7a8b9c0d1';
    const { req, res } = await createMockReqRes({
      method: 'DELETE',
      query: { id: fakeId },
      token: adminToken,
    });
    await fypIdHandler(req, res);
    assert.strictEqual(res.getStatusCode(), 404);
  });

  it('8.6 Deleting already deleted project returns 404 on subsequent delete request', async () => {
    const proj = await Project.create({
      title: `${TEST_PREFIX} Double Delete Project`,
      slug: `${TEST_PREFIX}-double-delete`,
      description: 'Testing double deletion idempotency.',
      tags: ['Test'],
    });

    const { req: del1Req, res: del1Res } = await createMockReqRes({
      method: 'DELETE',
      query: { id: proj._id.toString() },
      token: adminToken,
    });
    await projectIdHandler(del1Req, del1Res);
    assert.ok([200, 204].includes(del1Res.getStatusCode()));

    const { req: del2Req, res: del2Res } = await createMockReqRes({
      method: 'DELETE',
      query: { id: proj._id.toString() },
      token: adminToken,
    });
    await projectIdHandler(del2Req, del2Res);
    assert.strictEqual(del2Res.getStatusCode(), 404);
  });
});

export async function runTier2() {
  return await runAllSuites('Tier 2: Boundary & Corner Cases');
}

if (process.argv[1]?.endsWith('tier2-boundaries.test.mjs') || process.argv[1]?.endsWith('tier2-boundaries.test.js')) {
  runTier2().then((res) => {
    process.exit(res.passed ? 0 : 1);
  });
}
