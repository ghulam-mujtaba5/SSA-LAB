import assert from "node:assert";
import mongoose from "mongoose";
import dbConnect from "../lib/mongoose.js";
import {
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
  bulkActionSchema,
  fypProjectSchema,
  enquirySchema,
} from "../lib/validation/schemas.js";
import AuditLog from "../models/AuditLog.js";
import Project from "../models/Project.js";
import FypProject from "../models/FypProject.js";
import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";
import { createAuditLog } from "../lib/auditLog.js";
import { slugifyFypTitle } from "../lib/fypProjects.js";
import adminSearchHandler from "../pages/api/admin/search.js";
import fypIndexHandler from "../pages/api/fyp/index.js";
import fypIdHandler from "../pages/api/fyp/[id].js";
import fypProjectsIndexHandler from "../pages/api/fyp-projects/index.js";
import fypProjectsIdHandler from "../pages/api/fyp-projects/[id].js";
import { encode } from "next-auth/jwt";

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    throw err;
  }
}

console.log("\n=======================================================");
console.log(" Milestone 2 Empirical Challenger 2 Adversarial Suite");
console.log("=======================================================\n");

process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "test_secret_key_m2_challenger_12345678901234567890";

async function createMockReqRes({ method = "GET", body = {}, query = {}, headers = {}, token = null } = {}) {
  const reqHeaders = { "x-forwarded-for": "127.0.0.1", ...headers };
  const cookies = {};

  if (token) {
    const encodedToken = await encode({
      token,
      secret: process.env.NEXTAUTH_SECRET,
    });
    cookies["next-auth.session-token"] = encodedToken;
    reqHeaders.cookie = `next-auth.session-token=${encodedToken}`;
  }

  const req = {
    method,
    body,
    query,
    cookies,
    headers: reqHeaders,
    socket: { remoteAddress: "127.0.0.1" },
  };

  let statusCode = 200;
  let responseData = null;
  let responseHeaders = {};
  let endCalled = false;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end(data) {
      endCalled = true;
      if (data) responseData = data;
      return this;
    },
    setHeader(key, val) {
      responseHeaders[key] = val;
      return this;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
    getHeaders: () => responseHeaders,
    isEnded: () => endCalled,
  };

  return { req, res };
}

async function main() {
  await dbConnect();
  console.log("Connected to MongoDB for live empirical verification.\n");

  const timestamp = Date.now();
  const TEST_PREFIX = `m2-c2-${timestamp}`;

  let cleanupDone = false;
  const cleanup = async () => {
    if (cleanupDone) return;
    cleanupDone = true;
    console.log("\n--- Cleaning up test artifacts ---");
    await Project.deleteMany({
      $or: [
        { title: new RegExp(TEST_PREFIX, "i") },
        { slug: new RegExp(TEST_PREFIX, "i") }
      ]
    });
    await FypProject.deleteMany({
      $or: [
        { title: new RegExp(TEST_PREFIX, "i") },
        { slug: new RegExp(TEST_PREFIX, "i") }
      ]
    });
    await Enquiry.deleteMany({ name: new RegExp(TEST_PREFIX, "i") });
    await User.deleteMany({ name: new RegExp(TEST_PREFIX, "i") });
    await AuditLog.deleteMany({ details: new RegExp(TEST_PREFIX, "i") });
    console.log("Cleaned up all temporary test artifacts.");
  };

  try {
    // =========================================================================
    // 1. ZOD PROJECT SCHEMA & CASE STUDY FIELDS
    // =========================================================================
    console.log("--- 1. Zod projectSchema & Case-Study Fields ---");

    runTest("1.1 projectSchema preserves all case-study fields without stripping", () => {
      const payload = {
        title: "Deep Reinforcement Learning for Drone Swarms",
        description: "A comprehensive investigation of multi-agent reinforcement learning for autonomous decentralized UAV swarms.",
        tags: ["AI", "RL", "Robotics", "PyTorch"],
        role: "Lead Research Scientist & Systems Architect",
        problem: "Dynamic obstacle collision avoidance in dense unknown 3D environments.",
        solution: "Hierarchical PPO policy with shared spatial attention embeddings.",
        outcome: "Zero collision across 1,000 randomized benchmark simulations; published at IEEE RA-L.",
        users: "Autonomous robotics research laboratories and defense surveillance teams.",
        features: "Distributed Multi-Agent PPO\nReal-time LiDAR pointcloud fusion\nHardware-in-the-loop PX4 simulation",
        learned: "Centralized training with decentralized execution drastically reduces sample complexity.",
        pinned: true,
        displayOrder: 7,
        status: "Completed",
        category: "AI",
        published: true,
        featuredOnHome: true,
        links: {
          live: "https://drl-swarm.ssalab.org",
          github: "https://github.com/ssalab/drl-drone-swarm",
        },
        image: "https://example.com/cover.png",
        gallery: [
          { url: "https://example.com/sim1.png", caption: "Gazebo World", alt: "Gazebo Simulation", order: 0 },
          { url: "https://example.com/bench.png", caption: "Reward Convergence", alt: "Training curves", order: 1 },
        ],
        metaTitle: "DRL Drone Swarms - SSA Lab",
        metaDescription: "Multi-agent reinforcement learning for UAV swarms.",
      };

      const parsed = projectSchema.parse(payload);

      assert.strictEqual(parsed.title, payload.title);
      assert.strictEqual(parsed.role, payload.role);
      assert.strictEqual(parsed.problem, payload.problem);
      assert.strictEqual(parsed.solution, payload.solution);
      assert.strictEqual(parsed.outcome, payload.outcome);
      assert.strictEqual(parsed.users, payload.users);
      assert.strictEqual(parsed.features, payload.features);
      assert.strictEqual(parsed.learned, payload.learned);
      assert.strictEqual(parsed.pinned, true);
      assert.strictEqual(parsed.displayOrder, 7);
      assert.strictEqual(parsed.status, "Completed");
      assert.strictEqual(parsed.category, "AI");
      assert.strictEqual(parsed.published, true);
      assert.strictEqual(parsed.gallery.length, 2);
    });

    runTest("1.2 projectSchema applies sensible defaults for missing optional case-study fields", () => {
      const minimal = {
        title: "SSA Research Website",
        description: "Official web portal and operations suite for SSA Research Lab.",
        tags: "NextJS, React, MongoDB",
      };

      const parsed = projectSchema.parse(minimal);
      assert.strictEqual(parsed.pinned, false);
      assert.strictEqual(parsed.displayOrder, 0);
      assert.strictEqual(parsed.status, "In Progress");
      assert.strictEqual(parsed.category, "Others");
      assert.strictEqual(parsed.published, false);
      assert.strictEqual(parsed.role, undefined);
      assert.strictEqual(parsed.problem, undefined);
      assert.strictEqual(parsed.solution, undefined);
      assert.strictEqual(parsed.outcome, undefined);
      assert.strictEqual(parsed.users, undefined);
      assert.strictEqual(parsed.features, undefined);
      assert.strictEqual(parsed.learned, undefined);
    });

    runTest("1.3 updateProjectSchema supports partial updates (e.g., updating only case study notes)", () => {
      const partial = {
        problem: "Updated bottleneck in decentralized state estimation.",
        solution: "Asynchronous federated averaging with adaptive client sampling.",
        pinned: true,
        displayOrder: 2,
      };

      const parsed = updateProjectSchema.parse(partial);
      assert.strictEqual(parsed.problem, partial.problem);
      assert.strictEqual(parsed.solution, partial.solution);
      assert.strictEqual(parsed.pinned, true);
      assert.strictEqual(parsed.displayOrder, 2);
    });

    runTest("1.4 createProjectSchema enforces validation boundaries (title min 3, description min 20)", () => {
      assert.throws(
        () => createProjectSchema.parse({ title: "AB", description: "This is a long description.", tags: ["AI"] }),
        /Title must be at least 3 characters/
      );

      assert.throws(
        () => createProjectSchema.parse({ title: "Valid Title", description: "Too short", tags: ["AI"] }),
        /Description must be at least 20 characters/
      );
    });

    // =========================================================================
    // 2. ZOD BULK ACTION SCHEMA POLYMORPHISM
    // =========================================================================
    console.log("\n--- 2. Zod bulkActionSchema Verification ---");

    const testOid1 = "507f1f77bcf86cd799439011";
    const testOid2 = "507f191e810c19729de860ea";

    runTest("2.1 bulkActionSchema accepts { ids: [...] }", () => {
      const parsed = bulkActionSchema.parse({
        ids: [testOid1, testOid2],
        action: "publish",
      });
      assert.deepStrictEqual(parsed.ids, [testOid1, testOid2]);
      assert.strictEqual(parsed.action, "publish");
    });

    runTest("2.2 bulkActionSchema accepts { projectIds: [...] }", () => {
      const parsed = bulkActionSchema.parse({
        projectIds: [testOid1, testOid2],
        action: "draft",
      });
      assert.deepStrictEqual(parsed.projectIds, [testOid1, testOid2]);
      assert.strictEqual(parsed.action, "draft");
    });

    runTest("2.3 bulkActionSchema accepts both { ids: [...], projectIds: [...] }", () => {
      const parsed = bulkActionSchema.parse({
        ids: [testOid1],
        projectIds: [testOid2],
        action: "delete",
      });
      assert.deepStrictEqual(parsed.ids, [testOid1]);
      assert.deepStrictEqual(parsed.projectIds, [testOid2]);
      assert.strictEqual(parsed.action, "delete");
    });

    runTest("2.4 bulkActionSchema rejects empty payload or missing arrays", () => {
      assert.throws(
        () => bulkActionSchema.parse({ action: "publish" }),
        /At least one item must be selected/
      );

      assert.throws(
        () => bulkActionSchema.parse({ ids: [], action: "publish" }),
        /At least one item must be selected/
      );

      assert.throws(
        () => bulkActionSchema.parse({ projectIds: [], action: "delete" }),
        /At least one item must be selected/
      );
    });

    runTest("2.5 bulkActionSchema rejects invalid ObjectId strings and invalid actions", () => {
      assert.throws(
        () => bulkActionSchema.parse({ ids: ["bad-hex-id-123"], action: "publish" }),
        /Invalid MongoDB ObjectId/
      );

      assert.throws(
        () => bulkActionSchema.parse({ ids: [testOid1], action: "archive" }),
        /Invalid/
      );
    });

    // =========================================================================
    // 3. AUDIT LOG MODEL ENTITIES & ACTIONS EMPIRICAL DB PERSISTENCE
    // =========================================================================
    console.log("\n--- 3. AuditLog Model Entities & Actions Empirical DB Tests ---");

    const allEntities = [
      "Article",
      "Project",
      "FypProject",
      "Enquiry",
      "MediaAsset",
      "User",
      "Auth",
      "Setting",
      "SavedSearch",
      "PinnedItem",
    ];

    const allActions = [
      "create",
      "update",
      "delete",
      "bulk_delete",
      "bulk-delete",
      "bulk-publish",
      "bulk-draft",
      "reorder",
      "login_success",
      "login_fail",
      "pin",
      "unpin",
      "upload",
      "status_change",
    ];

    for (const ent of allEntities) {
      await runAsyncTest(`3.1 AuditLog persistence for entity: '${ent}'`, async () => {
        const log = await AuditLog.create({
          userName: "M2 Challenger",
          action: "create",
          entity: ent,
          entityId: "test_entity_123",
          details: `${TEST_PREFIX} entity test for ${ent}`,
        });

        assert.ok(log._id);
        assert.strictEqual(log.entity, ent);
        await AuditLog.findByIdAndDelete(log._id);
      });
    }

    for (const act of allActions) {
      await runAsyncTest(`3.2 AuditLog persistence for action: '${act}'`, async () => {
        const log = await AuditLog.create({
          userName: "M2 Challenger",
          action: act,
          entity: "Project",
          entityId: "test_action_123",
          details: `${TEST_PREFIX} action test for ${act}`,
        });

        assert.ok(log._id);
        assert.strictEqual(log.action, act);
        await AuditLog.findByIdAndDelete(log._id);
      });
    }

    await runAsyncTest("3.3 AuditLog schema rejects unapproved entity and action values", async () => {
      await assert.rejects(
        async () => {
          await AuditLog.create({
            userName: "M2 Challenger",
            action: "create",
            entity: "UnauthorizedEntityName",
            details: "should fail",
          });
        },
        /Validation failed|is not a valid enum value/
      );

      await assert.rejects(
        async () => {
          await AuditLog.create({
            userName: "M2 Challenger",
            action: "unauthorized_action_name",
            entity: "Project",
            details: "should fail",
          });
        },
        /Validation failed|is not a valid enum value/
      );
    });

    await runAsyncTest("3.4 createAuditLog helper handles session extraction and anonymous fallback", async () => {
      // Full user session
      await createAuditLog({
        session: { user: { id: "507f1f77bcf86cd799439011", name: "Dr. SSA" } },
        action: "reorder",
        entity: "PinnedItem",
        details: `${TEST_PREFIX} reordered pinned items`,
      });

      const log1 = await AuditLog.findOne({ details: `${TEST_PREFIX} reordered pinned items` });
      assert.ok(log1);
      assert.strictEqual(log1.userName, "Dr. SSA");
      assert.strictEqual(log1.action, "reorder");
      assert.strictEqual(log1.entity, "PinnedItem");
      await AuditLog.findByIdAndDelete(log1._id);

      // Anonymous fallback
      await createAuditLog({
        session: null,
        action: "login_fail",
        entity: "Auth",
        details: `${TEST_PREFIX} failed auth attempt`,
      });

      const log2 = await AuditLog.findOne({ details: `${TEST_PREFIX} failed auth attempt` });
      assert.ok(log2);
      assert.strictEqual(log2.userName, "Unknown User");
      assert.strictEqual(log2.action, "login_fail");
      assert.strictEqual(log2.entity, "Auth");
      await AuditLog.findByIdAndDelete(log2._id);
    });

    // =========================================================================
    // 4. GLOBAL SEARCH API RESPONSE FORMAT EMPIRICAL DB VERIFICATION
    // =========================================================================
    console.log("\n--- 4. Global Search API Response Format Verification ---");

    const seedProject = await Project.create({
      title: `${TEST_PREFIX} Quantum ML Project`,
      slug: `${TEST_PREFIX}-quantum-ml`,
      description: "Quantum computing algorithms applied to large language model optimizations.",
      tags: ["Quantum", "ML", "SSA"],
      category: "AI",
      published: true,
    });

    const fypSlug = slugifyFypTitle(`${TEST_PREFIX} FYP Quantum Circuit`);
    const seedFyp = await FypProject.create({
      title: `${TEST_PREFIX} FYP Quantum Circuit`,
      slug: fypSlug,
      summary: "Undergraduate final year project researching variational quantum eigensolvers.",
      status: "In Progress",
      academicYear: "2025-2026",
      published: true,
    });

    const seedEnquiry = await Enquiry.create({
      name: `${TEST_PREFIX} Alice Student`,
      email: `${TEST_PREFIX}-alice@quantum.edu`,
      topic: `${TEST_PREFIX} Quantum Research Inquiry`,
      message: "Seeking supervision in quantum machine learning architectures.",
      status: "new",
    });

    const seedUser = await User.create({
      name: `${TEST_PREFIX} Quantum Admin`,
      username: `${TEST_PREFIX}-quantadmin`.replace(/[^a-z0-9]/g, ""),
      email: `${TEST_PREFIX}-quant@ssalab.test`,
      password: "HashedPassword123!",
      role: "admin",
      isActive: true,
    });

    const adminToken = {
      id: seedUser._id.toString(),
      name: "Admin Challenger",
      role: "admin",
    };

    await runAsyncTest("4.1 Global Search API returns 403 when unauthenticated", async () => {
      const { req, res } = await createMockReqRes({
        method: "GET",
        query: { q: `${TEST_PREFIX}`, type: "all", limit: "10" },
        token: null,
      });

      await adminSearchHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 403);
      const unauthData = res.getData();
      assert.strictEqual(Array.isArray(unauthData), false);
      assert.strictEqual(unauthData.success, false);
      assert.strictEqual(unauthData.message, "Forbidden");
    });

    await runAsyncTest("4.2 Global Search API returns { success: true, data: [...] } and never raw array", async () => {
      const { req, res } = await createMockReqRes({
        method: "GET",
        query: { q: `${TEST_PREFIX}`, type: "all", limit: "10" },
        token: adminToken,
      });

      await adminSearchHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const body = res.getData();
      assert.strictEqual(Array.isArray(body), false, "Top-level response must not be a raw array");
      assert.strictEqual(body.success, true, "Response must include success: true");
      assert.ok(Array.isArray(body.data), "Response data property must be an Array");
      assert.ok(body.data.length >= 4, `Expected at least 4 matched items, got ${body.data.length}`);

      const types = body.data.map((item) => item.type);
      assert.ok(types.includes("Project"), "Includes Project results");
      assert.ok(types.includes("FypProject"), "Includes FypProject results");
      assert.ok(types.includes("Enquiry"), "Includes Enquiry results");
      assert.ok(types.includes("User"), "Includes User results");
    });

    await runAsyncTest("4.3 Global Search API supports scoped entity filters (type=projects, type=fyp, etc.)", async () => {
      const { req: reqP, res: resP } = await createMockReqRes({
        method: "GET",
        query: { q: `${TEST_PREFIX}`, type: "projects" },
        token: adminToken,
      });
      await adminSearchHandler(reqP, resP);
      assert.strictEqual(resP.getStatusCode(), 200);
      assert.ok(resP.getData().data.every((i) => i.type === "Project"));

      const { req: reqF, res: resF } = await createMockReqRes({
        method: "GET",
        query: { q: `${TEST_PREFIX}`, type: "fyp" },
        token: adminToken,
      });
      await adminSearchHandler(reqF, resF);
      assert.strictEqual(resF.getStatusCode(), 200);
      assert.ok(resF.getData().data.every((i) => i.type === "FypProject"));
    });

    // =========================================================================
    // 5. /api/fyp ROUTE COMPATIBILITY
    // =========================================================================
    console.log("\n--- 5. /api/fyp Route Compatibility ---");

    runTest("5.1 /api/fyp/index exports the exact same handler as /api/fyp-projects/index", () => {
      assert.strictEqual(fypIndexHandler, fypProjectsIndexHandler);
      assert.strictEqual(typeof fypIndexHandler, "function");
    });

    runTest("5.2 /api/fyp/[id] exports the exact same handler as /api/fyp-projects/[id]", () => {
      assert.strictEqual(fypIdHandler, fypProjectsIdHandler);
      assert.strictEqual(typeof fypIdHandler, "function");
    });

    await runAsyncTest("5.3 /api/fyp index GET returns { success: true, data: [...] } for public query", async () => {
      const { req, res } = await createMockReqRes({
        method: "GET",
        query: { status: "In Progress" },
      });

      await fypIndexHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      const data = res.getData();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.data));
      assert.ok(data.data.some((item) => item.slug === fypSlug));
    });

    await runAsyncTest("5.4 /api/fyp [id] GET returns single project by slug or ObjectId", async () => {
      // By slug
      const { req: reqSlug, res: resSlug } = await createMockReqRes({
        method: "GET",
        query: { id: fypSlug },
      });

      await fypIdHandler(reqSlug, resSlug);
      assert.strictEqual(resSlug.getStatusCode(), 200);
      assert.strictEqual(resSlug.getData().success, true);
      assert.strictEqual(resSlug.getData().data._id.toString(), seedFyp._id.toString());

      // By ObjectId
      const { req: reqId, res: resId } = await createMockReqRes({
        method: "GET",
        query: { id: seedFyp._id.toString() },
      });

      await fypIdHandler(reqId, resId);
      assert.strictEqual(resId.getStatusCode(), 200);
      assert.strictEqual(resId.getData().success, true);
      assert.strictEqual(resId.getData().data.slug, fypSlug);
    });

    await runAsyncTest("5.5 /api/fyp [id] PUT updates FYP document and records audit log", async () => {
      const { req, res } = await createMockReqRes({
        method: "PUT",
        query: { id: seedFyp._id.toString() },
        body: {
          title: `${TEST_PREFIX} FYP Quantum Circuit Updated`,
          summary: "Updated summary describing newly formulated quantum circuits.",
        },
        token: adminToken,
      });

      await fypIdHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 200);
      assert.strictEqual(res.getData().success, true);
      assert.strictEqual(res.getData().data.title, `${TEST_PREFIX} FYP Quantum Circuit Updated`);

      // Verify audit log
      const log = await AuditLog.findOne({
        entity: "FypProject",
        action: "update",
        entityId: seedFyp._id.toString(),
      });
      assert.ok(log, "Audit log must be created for FYP update");
    });

    await runAsyncTest("5.6 /api/fyp [id] DELETE removes FYP document with HTTP 204 and records audit log", async () => {
      const { req, res } = await createMockReqRes({
        method: "DELETE",
        query: { id: seedFyp._id.toString() },
        token: adminToken,
      });

      await fypIdHandler(req, res);
      assert.strictEqual(res.getStatusCode(), 204);
      assert.ok(res.isEnded());

      const check = await FypProject.findById(seedFyp._id);
      assert.strictEqual(check, null);

      const log = await AuditLog.findOne({
        entity: "FypProject",
        action: "delete",
        entityId: seedFyp._id.toString(),
      });
      assert.ok(log, "Audit log must be created for FYP delete");
    });

    console.log("\n=======================================================");
    console.log(` RESULTS: ${passedTests} / ${totalTests} Empirical Tests Passed (100%)`);
    console.log("=======================================================\n");
  } finally {
    await cleanup();
    await mongoose.disconnect();
  }
}

main().catch(async (err) => {
  console.error("FATAL TEST EXECUTION ERROR:", err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
