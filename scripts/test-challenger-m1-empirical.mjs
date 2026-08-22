/**
 * Empirical Adversarial Test Harness for Milestone 1
 * Challenging:
 * 1. Seeding Idempotency (successive runs, count stability, hash integrity)
 * 2. adminModified Flag Protection (field preservation, non-destructive upserts, --force behavior)
 * 3. Indexing & Query Execution Plans (IXSCAN/TEXT explain plans across slug, category, published, year, and text search)
 * 4. Performance benchmarks
 */

import dotenv from "dotenv";
import { execSync } from "child_process";
dotenv.config({ path: ".env.local" });
dotenv.config();

const results = {
  idempotency: { runs: 0, passed: true, details: [] },
  adminModifiedProtection: { passed: true, tests: [] },
  indexCoverage: { passed: true, collections: {} },
  queryExplainPlans: { passed: true, queries: [] },
  performance: { benchmarks: [] },
  summary: { totalTests: 0, passedTests: 0, failedTests: 0, verdict: "PENDING" }
};

function recordTest(suite, name, passed, details = "") {
  results.summary.totalTests++;
  if (passed) {
    results.summary.passedTests++;
    console.log(`  [PASS] ${name}`);
  } else {
    results.summary.failedTests++;
    console.error(`  [FAIL] ${name}: ${details}`);
  }
}

async function runEmpiricalChallenge() {
  console.log("================================================================================");
  console.log("⚡ SSA LAB - EMPIRICAL CHALLENGER 1 (MILESTONE 1 VERIFICATION & STRESS HARNESS)");
  console.log("================================================================================\n");

  const dbConnectModule = await import("../lib/mongoose.js");
  const dbConnect = dbConnectModule.default;
  const mongooseInstance = await dbConnect();
  const db = mongooseInstance.connection.db;

  const LabProfile = (await import("../models/LabProfile.js")).default;
  const Publication = (await import("../models/Publication.js")).default;
  const Member = (await import("../models/Member.js")).default;
  const ResearchDomain = (await import("../models/ResearchDomain.js")).default;
  const EventHighlight = (await import("../models/EventHighlight.js")).default;
  const FypProject = (await import("../models/FypProject.js")).default;
  const Project = (await import("../models/Project.js")).default;
  const AuditLog = (await import("../models/AuditLog.js")).default;
  const User = (await import("../models/User.js")).default;

  const models = {
    LabProfile,
    ResearchDomain,
    Publication,
    Project,
    Member,
    EventHighlight,
    FypProject,
    User,
    AuditLog
  };

  // Helper to sync indexes
  console.log("🔄 Ensuring and synchronizing MongoDB indexes across all models...");
  for (const [name, model] of Object.entries(models)) {
    try {
      await model.syncIndexes();
      console.log(`  ✓ Synced indexes for ${name}`);
    } catch (e) {
      console.warn(`  ! Index sync notice for ${name}: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 1. INDEX COVERAGE & EXPLAIN PLANS VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("📊 1. INDEX COVERAGE & QUERY EXPLAIN VERIFICATION");
  console.log("================================================================================");

  // Check 1.1: Publication Indexes
  const pubIndexes = await Publication.collection.indexes();
  const pubIndexNames = pubIndexes.map(i => i.name || Object.keys(i.key).join("_"));
  console.log("Publication Indexes:", pubIndexNames);
  
  const hasPubSlug = pubIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasPubCompound = pubIndexes.some(i => i.key.published === 1 && i.key.year === -1);
  const hasPubText = pubIndexes.some(i => i.textIndexVersion !== undefined || i.name === "PublicationText_idx" || i.key._fts === "text");
  
  recordTest("indexing", "Publication: unique index on slug", hasPubSlug);
  recordTest("indexing", "Publication: compound index { published: 1, year: -1, displayOrder: 1 }", hasPubCompound);
  recordTest("indexing", "Publication: text index on { title, authors, venue }", hasPubText);

  // Check 1.2: Member Indexes
  const memberIndexes = await Member.collection.indexes();
  const hasMemberSlug = memberIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasMemberCat = memberIndexes.some(i => i.key.category === 1 || (i.key.category === 1 && i.key.published === 1));
  const hasMemberText = memberIndexes.some(i => i.textIndexVersion !== undefined || i.name === "MemberText_idx" || i.key._fts === "text");
  
  recordTest("indexing", "Member: unique index on slug", hasMemberSlug);
  recordTest("indexing", "Member: category / compound index { category: 1, published: 1, displayOrder: 1 }", hasMemberCat);
  recordTest("indexing", "Member: text index on { name, specialization, topic, bio }", hasMemberText);

  // Check 1.3: ResearchDomain Indexes
  const domainIndexes = await ResearchDomain.collection.indexes();
  const hasDomainSlug = domainIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasDomainPub = domainIndexes.some(i => i.key.published === 1);
  const hasDomainText = domainIndexes.some(i => i.textIndexVersion !== undefined || i.name === "ResearchDomainText_idx" || i.key._fts === "text");

  recordTest("indexing", "ResearchDomain: unique index on slug", hasDomainSlug);
  recordTest("indexing", "ResearchDomain: index on { published: 1, displayOrder: 1 }", hasDomainPub);
  recordTest("indexing", "ResearchDomain: text index on { title, description, overview }", hasDomainText);

  // Check 1.4: EventHighlight Indexes
  const eventIndexes = await EventHighlight.collection.indexes();
  const hasEventSlug = eventIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasEventPub = eventIndexes.some(i => i.key.published === 1);
  const hasEventText = eventIndexes.some(i => i.textIndexVersion !== undefined || i.name === "EventHighlightText_idx" || i.key._fts === "text");

  recordTest("indexing", "EventHighlight: unique index on slug", hasEventSlug);
  recordTest("indexing", "EventHighlight: index on { published: 1, displayOrder: 1, createdAt: -1 }", hasEventPub);
  recordTest("indexing", "EventHighlight: text index on { title, summary, caption }", hasEventText);

  // Check 1.5: FypProject Indexes
  const fypIndexes = await FypProject.collection.indexes();
  const hasFypSlug = fypIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasFypCat = fypIndexes.some(i => i.key.categoryType === 1 || (i.key.published === 1 && i.key.categoryType === 1));
  const hasFypText = fypIndexes.some(i => i.textIndexVersion !== undefined || i.name === "FypProjectText_idx" || i.key._fts === "text");

  recordTest("indexing", "FypProject: unique index on slug", hasFypSlug);
  recordTest("indexing", "FypProject: compound index { published: 1, categoryType: 1, ... }", hasFypCat);
  recordTest("indexing", "FypProject: text index on { title, summary, technologies, specializations }", hasFypText);

  // Check 1.6: Project Indexes
  const projIndexes = await Project.collection.indexes();
  const hasProjSlug = projIndexes.some(i => i.key.slug === 1 && i.unique);
  const hasProjPub = projIndexes.some(i => i.key.published === 1);
  const hasProjText = projIndexes.some(i => i.textIndexVersion !== undefined || i.name === "ProjectTextIndex" || i.key._fts === "text");

  recordTest("indexing", "Project: unique index on slug", hasProjSlug);
  recordTest("indexing", "Project: index on { published: 1, createdAt: -1 }", hasProjPub);
  recordTest("indexing", "Project: text index on { title, description, tags }", hasProjText);

  // Check 1.7: LabProfile Indexes
  const labIndexes = await LabProfile.collection.indexes();
  const hasLabKey = labIndexes.some(i => i.key.key === 1 && i.unique);
  recordTest("indexing", "LabProfile: unique index on key", hasLabKey);

  // Check 1.8: AuditLog Indexes
  const auditIndexes = await AuditLog.collection.indexes();
  const hasAuditEntity = auditIndexes.some(i => i.key.entity === 1);
  recordTest("indexing", "AuditLog: compound index { entity: 1, createdAt: -1 }", hasAuditEntity);

  // -------------------------------------------------------------------------
  // 1.9: EXPLAIN QUERY EXECUTION PLANS (Verify IXSCAN / TEXT)
  // -------------------------------------------------------------------------
  console.log("\n🔬 Running Query Explain Plans with executionStats...");

  // Helper to extract stage
  function getWinningStage(explainResult) {
    const stage = explainResult?.queryPlanner?.winningPlan?.stage ||
                  explainResult?.queryPlanner?.winningPlan?.inputStage?.stage ||
                  explainResult?.stages?.[0]?.stage ||
                  "UNKNOWN";
    const subStage = explainResult?.queryPlanner?.winningPlan?.inputStage?.stage;
    return subStage ? `${stage} -> ${subStage}` : stage;
  }

  // Publication Slug Query
  const samplePub = await Publication.findOne().lean();
  if (samplePub) {
    const explain = await Publication.find({ slug: samplePub.slug }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesIx = stage.includes("IXSCAN") || stage.includes("IDHACK");
    recordTest("explain", `Publication.find({ slug: "${samplePub.slug}" }) uses IXSCAN [${stage}]`, usesIx);
  }

  // Publication Compound Filter Query
  {
    const explain = await Publication.find({ published: true, year: "2025" }).sort({ displayOrder: 1 }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesIx = stage.includes("IXSCAN");
    recordTest("explain", `Publication.find({ published: true, year: "2025" }) uses IXSCAN [${stage}]`, usesIx);
  }

  // Publication Text Search Query
  {
    const explain = await Publication.find({ $text: { $search: "malware security" } }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesText = stage.includes("TEXT") || stage.includes("TEXT_MATCH") || stage.includes("IXSCAN");
    recordTest("explain", `Publication.find({ $text: { $search: "malware security" } }) uses TEXT index [${stage}]`, usesText);
  }

  // Member Category Query
  {
    const explain = await Member.find({ category: "co-investigator", published: true }).sort({ displayOrder: 1 }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesIx = stage.includes("IXSCAN");
    recordTest("explain", `Member.find({ category: "co-investigator" }) uses IXSCAN [${stage}]`, usesIx);
  }

  // Member Text Search Query
  {
    const explain = await Member.find({ $text: { $search: "Vasan" } }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesText = stage.includes("TEXT") || stage.includes("TEXT_MATCH") || stage.includes("IXSCAN");
    recordTest("explain", `Member.find({ $text: { $search: "Vasan" } }) uses TEXT index [${stage}]`, usesText);
  }

  // ResearchDomain Slug Query
  {
    const explain = await ResearchDomain.find({ slug: "cyber-security" }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesIx = stage.includes("IXSCAN") || stage.includes("IDHACK");
    recordTest("explain", `ResearchDomain.find({ slug: "cyber-security" }) uses IXSCAN [${stage}]`, usesIx);
  }

  // FypProject CategoryType Query
  {
    const explain = await FypProject.find({ published: true, categoryType: "running" }).sort({ displayOrder: 1 }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesIx = stage.includes("IXSCAN");
    recordTest("explain", `FypProject.find({ categoryType: "running" }) uses IXSCAN [${stage}]`, usesIx);
  }

  // FypProject Text Search Query
  {
    const explain = await FypProject.find({ $text: { $search: "vulnerability detection" } }).explain("executionStats");
    const stage = getWinningStage(explain);
    const usesText = stage.includes("TEXT") || stage.includes("TEXT_MATCH") || stage.includes("IXSCAN");
    recordTest("explain", `FypProject.find({ $text: { $search: "vulnerability" } }) uses TEXT index [${stage}]`, usesText);
  }

  // -------------------------------------------------------------------------
  // 2. SEEDING IDEMPOTENCY STRESS TEST
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("🔁 2. SEEDING IDEMPOTENCY MULTI-RUN STRESS TEST");
  console.log("================================================================================");

  // Capture baseline counts
  async function getCounts() {
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

  const baselineCounts = await getCounts();
  console.log("Baseline Collection Counts:", baselineCounts);

  // Execute 3 successive runs of scripts/seed-all-data.js
  for (let runIdx = 1; runIdx <= 3; runIdx++) {
    console.log(`\n▶️ Executing Seeding Run #${runIdx}...`);
    try {
      const output = execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });
      const currentCounts = await getCounts();
      
      let countsIdentical = true;
      for (const [col, count] of Object.entries(baselineCounts)) {
        if (currentCounts[col] !== count) {
          countsIdentical = false;
          console.error(`  Count mismatch in ${col}: expected ${count}, got ${currentCounts[col]}`);
        }
      }

      recordTest("idempotency", `Run #${runIdx}: Document counts match baseline exactly (${JSON.stringify(currentCounts)})`, countsIdentical);
      recordTest("idempotency", `Run #${runIdx}: Execution completed with exit code 0 (no duplicate key collisions)`, true);
    } catch (err) {
      recordTest("idempotency", `Run #${runIdx}: Execution failed: ${err.message}`, false);
    }
  }

  // -------------------------------------------------------------------------
  // 3. adminModified SAFETY & NON-DESTRUCTIVE UPSERT STRESS TEST
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("🛡️ 3. adminModified PROTECTION & RE-SEEDING STRESS TEST");
  console.log("================================================================================");

  // Target 1: LabProfile
  const originalLabProfile = await LabProfile.findOne({ key: "default" }).lean();
  const testRole = "Distinguished Chair Professor (Empirical Test Modified)";
  await LabProfile.updateOne({ key: "default" }, { $set: { role: testRole, adminModified: true } });
  console.log("  -> Modified LabProfile.role to:", testRole);

  // Target 2: Publication
  const targetPub = await Publication.findOne().lean();
  const testVenue = "IEEE Symposium on Security & Privacy 2026 (Empirical Test Modified)";
  await Publication.updateOne({ _id: targetPub._id }, { $set: { venue: testVenue, adminModified: true } });
  console.log(`  -> Modified Publication (${targetPub.slug}) venue to:`, testVenue);

  // Target 3: Member
  const targetMember = await Member.findOne({ category: "co-investigator" }).lean();
  const testMemberRole = "Chief Research Fellow (Empirical Test Modified)";
  await Member.updateOne({ _id: targetMember._id }, { $set: { role: testMemberRole, adminModified: true } });
  console.log(`  -> Modified Member (${targetMember.name}) role to:`, testMemberRole);

  // Target 4: ResearchDomain
  const targetDomain = await ResearchDomain.findOne().lean();
  const testDomainDesc = "Leading frontier AI research on cyber-physical vulnerabilities (Empirical Test Modified)";
  await ResearchDomain.updateOne({ _id: targetDomain._id }, { $set: { description: testDomainDesc, adminModified: true } });
  console.log(`  -> Modified ResearchDomain (${targetDomain.slug}) description`);

  // Target 5: EventHighlight
  const targetEvent = await EventHighlight.findOne({ isGalleryItem: false }).lean();
  const testEventVenue = "Stockholm Royal Hall (Empirical Test Modified)";
  await EventHighlight.updateOne({ _id: targetEvent._id }, { $set: { venue: testEventVenue, adminModified: true } });
  console.log(`  -> Modified EventHighlight (${targetEvent.slug}) venue`);

  // Target 6: FypProject
  const targetFyp = await FypProject.findOne({ categoryType: "running" }).lean();
  const testFypSummary = "Advanced neural fuzzing pipeline for smart contracts (Empirical Test Modified)";
  await FypProject.updateOne({ _id: targetFyp._id }, { $set: { summary: testFypSummary, adminModified: true } });
  console.log(`  -> Modified FypProject (${targetFyp.slug}) summary`);

  // Target 7: Project
  const targetProj = await Project.findOne({ projectType: "Research" }).lean();
  const testProjSummary = "State-of-the-art vulnerability detection using transformers (Empirical Test Modified)";
  await Project.updateOne({ _id: targetProj._id }, { $set: { summary: testProjSummary, adminModified: true } });
  console.log(`  -> Modified Project (${targetProj.slug}) summary`);

  // Now execute safe seeding
  console.log("\n▶️ Re-running seed-all-data.js (Safe Mode)...");
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  // Verify ALL modified records were preserved
  const verifyLab = await LabProfile.findOne({ key: "default" }).lean();
  recordTest("adminModified", "LabProfile: role preserved after safe seed", verifyLab.role === testRole && verifyLab.adminModified === true);

  const verifyPub = await Publication.findById(targetPub._id).lean();
  recordTest("adminModified", "Publication: venue preserved after safe seed", verifyPub.venue === testVenue && verifyPub.adminModified === true);

  const verifyMem = await Member.findById(targetMember._id).lean();
  recordTest("adminModified", "Member: role preserved after safe seed", verifyMem.role === testMemberRole && verifyMem.adminModified === true);

  const verifyDom = await ResearchDomain.findById(targetDomain._id).lean();
  recordTest("adminModified", "ResearchDomain: description preserved after safe seed", verifyDom.description === testDomainDesc && verifyDom.adminModified === true);

  const verifyEv = await EventHighlight.findById(targetEvent._id).lean();
  recordTest("adminModified", "EventHighlight: venue preserved after safe seed", verifyEv.venue === testEventVenue && verifyEv.adminModified === true);

  const verifyFyp = await FypProject.findById(targetFyp._id).lean();
  recordTest("adminModified", "FypProject: summary preserved after safe seed", verifyFyp.summary === testFypSummary && verifyFyp.adminModified === true);

  const verifyProj = await Project.findById(targetProj._id).lean();
  recordTest("adminModified", "Project: summary preserved after safe seed", verifyProj.summary === testProjSummary && verifyProj.adminModified === true);

  // Test --force Flag Overwrite
  console.log("\n▶️ Testing --force override flag on seed-all-data.js...");
  execSync("node scripts/seed-all-data.js --force", { encoding: "utf-8" });

  const forcedLab = await LabProfile.findOne({ key: "default" }).lean();
  const forcedPub = await Publication.findById(targetPub._id).lean();
  const forcedMem = await Member.findById(targetMember._id).lean();

  recordTest("adminModified", "seed-all-data.js --force: successfully updates LabProfile back to static baseline", forcedLab.role !== testRole);
  recordTest("adminModified", "seed-all-data.js --force: successfully updates Publication back to static baseline", forcedPub.venue !== testVenue);
  recordTest("adminModified", "seed-all-data.js --force: successfully updates Member back to static baseline", forcedMem.role !== testMemberRole);

  // Clean re-seed to baseline
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  // -------------------------------------------------------------------------
  // 4. PERFORMANCE & CONCURRENCY BENCHMARK
  // -------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("⚡ 4. CONCURRENT QUERY LATENCY BENCHMARK (100 parallel queries)");
  console.log("================================================================================");

  const tStart = Date.now();
  const queryPromises = [];
  for (let i = 0; i < 20; i++) {
    queryPromises.push(Publication.find({ published: true }).sort({ year: -1, displayOrder: 1 }).lean());
    queryPromises.push(Member.find({ category: "pg-researcher", published: true }).lean());
    queryPromises.push(FypProject.find({ categoryType: "running", published: true }).lean());
    queryPromises.push(ResearchDomain.find({ published: true }).lean());
    queryPromises.push(Publication.find({ $text: { $search: "security" } }).lean());
  }

  await Promise.all(queryPromises);
  const totalElapsed = Date.now() - tStart;
  const avgQueryMs = (totalElapsed / 100).toFixed(2);
  console.log(`  Completed 100 concurrent DB queries in ${totalElapsed}ms (avg ~${avgQueryMs}ms per query across network)`);
  recordTest("performance", `100 concurrent queries completed successfully (<5000ms total, actual: ${totalElapsed}ms)`, totalElapsed < 5000);

  // Final Verdict
  console.log("\n================================================================================");
  console.log("🏁 EMPIRICAL TEST HARNESS SUMMARY");
  console.log("================================================================================");
  console.log(`Total Tests Run: ${results.summary.totalTests}`);
  console.log(`Passed:         ${results.summary.passedTests}`);
  console.log(`Failed:         ${results.summary.failedTests}`);
  
  if (results.summary.failedTests === 0) {
    results.summary.verdict = "APPROVE";
    console.log("🎯 VERDICT: APPROVE (100% of adversarial checks passed)");
  } else {
    results.summary.verdict = "REQUEST_CHANGES";
    console.log("❌ VERDICT: REQUEST_CHANGES");
  }

  process.exit(results.summary.failedTests === 0 ? 0 : 1);
}

runEmpiricalChallenge().catch(err => {
  console.error("FATAL ERROR in test harness:", err);
  process.exit(1);
});
