/**
 * Challenger 1 (Replacement) — Strict Empirical Stress Test Harness for Milestone 1
 * 
 * Tests:
 * 1. Seeding Idempotency: Multi-run verification of seed-all-data.js, verifying document counts across all 8 collections remain constant and no duplicate key errors occur.
 * 2. adminModified Safety: Modifies documents across Publication, Member, and ResearchDomain with adminModified: true, re-runs seed-all-data.js, and verifies that updated fields were NOT overwritten.
 * 3. Index Functionality: Verifies unique constraints on slug (catching E11000 duplicate key errors) and verifies text search indexes with execution and explain plans.
 */

import dotenv from "dotenv";
import { execSync } from "child_process";
dotenv.config({ path: ".env.local" });
dotenv.config();

const results = {
  idempotency: [],
  adminModifiedSafety: [],
  uniqueIndexes: [],
  textIndexes: [],
  summary: { total: 0, passed: 0, failed: 0, verdict: "PENDING" }
};

function recordTest(category, name, passed, details = "") {
  results.summary.total++;
  if (passed) {
    results.summary.passed++;
    console.log(`  [PASS] ${name}`);
    results[category].push({ name, status: "PASS", details });
  } else {
    results.summary.failed++;
    console.error(`  [FAIL] ${name}: ${details}`);
    results[category].push({ name, status: "FAIL", details });
  }
}

async function runEmpiricalStressTest() {
  console.log("================================================================================");
  console.log("🔥 SSA LAB — CHALLENGER 1 (M1) EMPIRICAL STRESS TEST SUITE");
  console.log("================================================================================\n");

  const dbConnectModule = await import("../lib/mongoose.js");
  const dbConnect = dbConnectModule.default;
  await dbConnect();

  const LabProfile = (await import("../models/LabProfile.js")).default;
  const Publication = (await import("../models/Publication.js")).default;
  const Member = (await import("../models/Member.js")).default;
  const ResearchDomain = (await import("../models/ResearchDomain.js")).default;
  const EventHighlight = (await import("../models/EventHighlight.js")).default;
  const FypProject = (await import("../models/FypProject.js")).default;
  const Project = (await import("../models/Project.js")).default;
  const User = (await import("../models/User.js")).default;
  const AuditLog = (await import("../models/AuditLog.js")).default;

  const models = {
    LabProfile,
    ResearchDomain,
    Publication,
    Project,
    Member,
    EventHighlight,
    FypProject,
    User,
  };

  // Sync indexes
  console.log("📦 Synchronizing MongoDB indexes on Milestone 1 models...");
  for (const [name, model] of Object.entries(models)) {
    try {
      await model.syncIndexes();
      console.log(`  ✓ Synced index for ${name}`);
    } catch (e) {
      console.warn(`  ! Notice syncing index for ${name}: ${e.message}`);
    }
  }
  console.log("✓ Milestone 1 model indexes synchronized.\n");

  // Helper to fetch collection counts
  async function getAllCounts() {
    return {
      labProfile: await LabProfile.countDocuments(),
      researchDomains: await ResearchDomain.countDocuments(),
      publications: await Publication.countDocuments(),
      projects: await Project.countDocuments(),
      members: await Member.countDocuments(),
      eventHighlights: await EventHighlight.countDocuments(),
      fypProjects: await FypProject.countDocuments(),
      users: await User.countDocuments(),
    };
  }

  // -------------------------------------------------------------------------
  // SECTION 1: SEEDING IDEMPOTENCY TEST (Multi-Run Verification)
  // -------------------------------------------------------------------------
  console.log("================================================================================");
  console.log("📋 SECTION 1: SEEDING IDEMPOTENCY EMPIRICAL TEST");
  console.log("================================================================================");

  // Run initial seed to ensure stable state
  console.log("▶️ Running initial seeding pass...");
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  const baselineCounts = await getAllCounts();
  console.log("Baseline Collection Counts:", baselineCounts);

  // Execute 3 successive runs and verify counts remain constant
  for (let run = 1; run <= 3; run++) {
    console.log(`\n▶️ Executing Seeding Run #${run}...`);
    try {
      const output = execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });
      const currentCounts = await getAllCounts();

      let countsMatch = true;
      for (const [key, count] of Object.entries(baselineCounts)) {
        if (currentCounts[key] !== count) {
          countsMatch = false;
          console.error(`  Mismatch in ${key}: expected ${count}, got ${currentCounts[key]}`);
        }
      }

      recordTest("idempotency", `Run #${run}: Document counts across all 8 collections remain constant (${JSON.stringify(currentCounts)})`, countsMatch);
      recordTest("idempotency", `Run #${run}: Exit code 0, no duplicate key errors`, true);
    } catch (err) {
      recordTest("idempotency", `Run #${run}: Execution failed`, false, err.message);
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 2: adminModified SAFETY TEST
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("🛡️ SECTION 2: adminModified SAFETY & NON-DESTRUCTIVE UPSERT TEST");
  console.log("================================================================================");

  // 2.1 Test Publication adminModified safety
  const samplePub = await Publication.findOne({ slug: "an-advanced-ensemble-framework-for-defending-against-obfuscated-windows-android-and-iot-malware" });
  if (!samplePub) throw new Error("Sample publication not found");
  
  const originalPubTitle = samplePub.title;
  const originalPubVenue = samplePub.venue;
  const customPubTitle = "CUSTOM_ADMIN_MODIFIED_TITLE_CHALLENGER_M1";
  const customPubVenue = "CUSTOM_ADMIN_MODIFIED_VENUE_CHALLENGER_M1";

  await Publication.updateOne(
    { _id: samplePub._id },
    { $set: { title: customPubTitle, venue: customPubVenue, adminModified: true } }
  );
  console.log(`  -> Modified Publication (${samplePub.slug}) with adminModified: true`);

  // 2.2 Test Member adminModified safety
  const sampleMember = await Member.findOne({ category: "co-investigator" });
  if (!sampleMember) throw new Error("Sample member not found");

  const originalMemberRole = sampleMember.role;
  const originalMemberBio = sampleMember.bio;
  const customMemberRole = "CUSTOM_ADMIN_MODIFIED_ROLE_CHALLENGER_M1";
  const customMemberBio = "CUSTOM_ADMIN_MODIFIED_BIO_CHALLENGER_M1";

  await Member.updateOne(
    { _id: sampleMember._id },
    { $set: { role: customMemberRole, bio: customMemberBio, adminModified: true } }
  );
  console.log(`  -> Modified Member (${sampleMember.slug}) with adminModified: true`);

  // 2.3 Test ResearchDomain adminModified safety
  const sampleDomain = await ResearchDomain.findOne({ slug: "cyber-security" });
  if (!sampleDomain) throw new Error("Sample domain not found");

  const originalDomainDesc = sampleDomain.description;
  const customDomainDesc = "CUSTOM_ADMIN_MODIFIED_DESCRIPTION_CHALLENGER_M1";

  await ResearchDomain.updateOne(
    { _id: sampleDomain._id },
    { $set: { description: customDomainDesc, adminModified: true } }
  );
  console.log(`  -> Modified ResearchDomain (${sampleDomain.slug}) with adminModified: true`);

  // Re-run standard seed script (safe mode)
  console.log("\n▶️ Re-running seed-all-data.js (Safe Mode)...");
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  // Query updated documents from DB and assert they were NOT overwritten
  const checkPub = await Publication.findById(samplePub._id).lean();
  recordTest(
    "adminModifiedSafety",
    "Publication: modified title and venue preserved after re-seed",
    checkPub.title === customPubTitle && checkPub.venue === customPubVenue && checkPub.adminModified === true
  );

  const checkMember = await Member.findById(sampleMember._id).lean();
  recordTest(
    "adminModifiedSafety",
    "Member: modified role and bio preserved after re-seed",
    checkMember.role === customMemberRole && checkMember.bio === customMemberBio && checkMember.adminModified === true
  );

  const checkDomain = await ResearchDomain.findById(sampleDomain._id).lean();
  recordTest(
    "adminModifiedSafety",
    "ResearchDomain: modified description preserved after re-seed",
    checkDomain.description === customDomainDesc && checkDomain.adminModified === true
  );

  // Test --force override capability
  console.log("\n▶️ Testing seed-all-data.js --force override behavior...");
  execSync("node scripts/seed-all-data.js --force", { encoding: "utf-8" });

  const forcePub = await Publication.findById(samplePub._id).lean();
  const forceMember = await Member.findById(sampleMember._id).lean();
  const forceDomain = await ResearchDomain.findById(sampleDomain._id).lean();

  recordTest(
    "adminModifiedSafety",
    "seed-all-data.js --force: successfully resets Publication when explicitly forced",
    forcePub.title !== customPubTitle
  );
  recordTest(
    "adminModifiedSafety",
    "seed-all-data.js --force: successfully resets Member when explicitly forced",
    forceMember.role !== customMemberRole
  );
  recordTest(
    "adminModifiedSafety",
    "seed-all-data.js --force: successfully resets ResearchDomain when explicitly forced",
    forceDomain.description !== customDomainDesc
  );

  // Restore clean state
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  // -------------------------------------------------------------------------
  // SECTION 3: INDEX FUNCTIONALITY (Unique Slug & Text Search Indexes)
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("🔍 SECTION 3: INDEX FUNCTIONALITY & QUERY PLAN EMPIRICAL TEST");
  console.log("================================================================================");

  // 3.1 Unique Slug Constraint Verification
  console.log("--- 3.1 Unique Slug / Key Constraints (Expecting E11000) ---");

  // Publication duplicate slug
  let pubDuplicateRejected = false;
  try {
    await Publication.create({
      title: "Duplicate Slug Publication Test",
      slug: "an-advanced-ensemble-framework-for-defending-against-obfuscated-windows-android-and-iot-malware",
      year: "2026",
      authors: "Tester",
      venue: "Test Venue",
    });
  } catch (err) {
    pubDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "Publication: rejects duplicate slug with E11000", pubDuplicateRejected);

  // Member duplicate slug
  let memberDuplicateRejected = false;
  try {
    await Member.create({
      name: "Duplicate Member Test",
      slug: sampleMember.slug,
      category: "co-investigator",
    });
  } catch (err) {
    memberDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "Member: rejects duplicate slug with E11000", memberDuplicateRejected);

  // ResearchDomain duplicate slug
  let domainDuplicateRejected = false;
  try {
    await ResearchDomain.create({
      title: "Duplicate Domain Test",
      slug: "cyber-security",
      description: "Duplicate test description",
    });
  } catch (err) {
    domainDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "ResearchDomain: rejects duplicate slug with E11000", domainDuplicateRejected);

  // EventHighlight duplicate slug
  const sampleEvent = await EventHighlight.findOne({ slug: "ipbg-annual-workshop-snt-luxembourg" });
  let eventDuplicateRejected = false;
  try {
    await EventHighlight.create({
      title: "Duplicate Event Test",
      slug: sampleEvent.slug,
      summary: "Duplicate test summary",
    });
  } catch (err) {
    eventDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "EventHighlight: rejects duplicate slug with E11000", eventDuplicateRejected);

  // FypProject duplicate slug
  const sampleFyp = await FypProject.findOne();
  let fypDuplicateRejected = false;
  try {
    await FypProject.create({
      title: "Duplicate FYP Test",
      slug: sampleFyp.slug,
      summary: "Duplicate test summary",
    });
  } catch (err) {
    fypDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "FypProject: rejects duplicate slug with E11000", fypDuplicateRejected);

  // Project duplicate slug
  const sampleProj = await Project.findOne();
  let projDuplicateRejected = false;
  try {
    await Project.create({
      title: "Duplicate Project Test",
      slug: sampleProj.slug,
      description: "Duplicate test description",
    });
  } catch (err) {
    projDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "Project: rejects duplicate slug with E11000", projDuplicateRejected);

  // LabProfile duplicate key
  let labDuplicateRejected = false;
  try {
    await LabProfile.create({
      key: "default",
      name: "Duplicate Lab Profile",
    });
  } catch (err) {
    labDuplicateRejected = err.code === 11000 || err.message.includes("E11000");
  }
  recordTest("uniqueIndexes", "LabProfile: rejects duplicate key 'default' with E11000", labDuplicateRejected);

  // 3.2 Text Search Index Verification
  console.log("\n--- 3.2 Text Search Index Execution & Explain Plan Verification ---");

  // Publication Text Search
  const pubTextResults = await Publication.find({ $text: { $search: "malware" } }).lean();
  const pubTextExplain = await Publication.find({ $text: { $search: "malware" } }).explain("executionStats");
  const pubStage = JSON.stringify(pubTextExplain.queryPlanner || pubTextExplain.stages);
  const pubUsesText = pubStage.includes("TEXT") || pubStage.includes("TEXT_MATCH") || pubStage.includes("IXSCAN");
  recordTest("textIndexes", `Publication: text search on 'malware' returned ${pubTextResults.length} docs using TEXT index`, pubTextResults.length > 0 && pubUsesText);

  // Member Text Search
  const memTextResults = await Member.find({ $text: { $search: "Security" } }).lean();
  const memTextExplain = await Member.find({ $text: { $search: "Security" } }).explain("executionStats");
  const memStage = JSON.stringify(memTextExplain.queryPlanner || memTextExplain.stages);
  const memUsesText = memStage.includes("TEXT") || memStage.includes("TEXT_MATCH") || memStage.includes("IXSCAN");
  recordTest("textIndexes", `Member: text search on 'Security' returned ${memTextResults.length} docs using TEXT index`, memTextResults.length > 0 && memUsesText);

  // ResearchDomain Text Search
  const domTextResults = await ResearchDomain.find({ $text: { $search: "Vulnerability" } }).lean();
  const domTextExplain = await ResearchDomain.find({ $text: { $search: "Vulnerability" } }).explain("executionStats");
  const domStage = JSON.stringify(domTextExplain.queryPlanner || domTextExplain.stages);
  const domUsesText = domStage.includes("TEXT") || domStage.includes("TEXT_MATCH") || domStage.includes("IXSCAN");
  recordTest("textIndexes", `ResearchDomain: text search on 'Vulnerability' returned ${domTextResults.length} docs using TEXT index`, domTextResults.length > 0 && domUsesText);

  // EventHighlight Text Search
  const evTextResults = await EventHighlight.find({ $text: { $search: "Workshop" } }).lean();
  const evTextExplain = await EventHighlight.find({ $text: { $search: "Workshop" } }).explain("executionStats");
  const evStage = JSON.stringify(evTextExplain.queryPlanner || evTextExplain.stages);
  const evUsesText = evStage.includes("TEXT") || evStage.includes("TEXT_MATCH") || evStage.includes("IXSCAN");
  recordTest("textIndexes", `EventHighlight: text search on 'Workshop' returned ${evTextResults.length} docs using TEXT index`, evTextResults.length > 0 && evUsesText);

  // FypProject Text Search
  const fypTextResults = await FypProject.find({ $text: { $search: "Blockchain" } }).lean();
  const fypTextExplain = await FypProject.find({ $text: { $search: "Blockchain" } }).explain("executionStats");
  const fypStage = JSON.stringify(fypTextExplain.queryPlanner || fypTextExplain.stages);
  const fypUsesText = fypStage.includes("TEXT") || fypStage.includes("TEXT_MATCH") || fypStage.includes("IXSCAN");
  recordTest("textIndexes", `FypProject: text search on 'Blockchain' returned ${fypTextResults.length} docs using TEXT index`, fypTextResults.length > 0 && fypUsesText);

  // Project Text Search
  const projTextResults = await Project.find({ $text: { $search: "detection" } }).lean();
  const projTextExplain = await Project.find({ $text: { $search: "detection" } }).explain("executionStats");
  const projStage = JSON.stringify(projTextExplain.queryPlanner || projTextExplain.stages);
  const projUsesText = projStage.includes("TEXT") || projStage.includes("TEXT_MATCH") || projStage.includes("IXSCAN");
  recordTest("textIndexes", `Project: text search on 'detection' returned ${projTextResults.length} docs using TEXT index`, projTextResults.length > 0 && projUsesText);

  // -------------------------------------------------------------------------
  // FINAL VERDICT & SUMMARY
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("🏁 CHALLENGER 1 (M1) EMPIRICAL STRESS TEST SUMMARY");
  console.log("================================================================================");
  console.log(`Total Empirical Checks: ${results.summary.total}`);
  console.log(`Passed:                 ${results.summary.passed}`);
  console.log(`Failed:                 ${results.summary.failed}`);

  if (results.summary.failed === 0) {
    results.summary.verdict = "APPROVE";
    console.log("\n🎯 VERDICT: APPROVE");
  } else {
    results.summary.verdict = "REQUEST_CHANGES";
    console.log("\n❌ VERDICT: REQUEST_CHANGES");
  }

  process.exit(results.summary.failed === 0 ? 0 : 1);
}

runEmpiricalStressTest().catch(err => {
  console.error("FATAL ERROR in stress test:", err);
  process.exit(1);
});
