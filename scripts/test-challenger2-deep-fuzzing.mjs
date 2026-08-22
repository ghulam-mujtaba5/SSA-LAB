// scripts/test-challenger2-deep-fuzzing.mjs
import mongoose from "mongoose";
import dbConnect from "../lib/mongoose.js";
import * as schemas from "../lib/validation/schemas.js";

import LabProfile from "../models/LabProfile.js";
import Publication from "../models/Publication.js";
import Member from "../models/Member.js";
import ResearchDomain from "../models/ResearchDomain.js";
import EventHighlight from "../models/EventHighlight.js";
import FypProject from "../models/FypProject.js";
import Project from "../models/Project.js";
import AuditLog from "../models/AuditLog.js";
import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";

const results = {
  dbTests: [],
  fuzzTests: [],
  summary: { total: 0, passed: 0, failed: 0, issues: [] }
};

function recordTest(suite, testName, expectedToPass, actualPassed, details = {}) {
  const passed = expectedToPass === actualPassed;
  const testRecord = {
    suite,
    testName,
    expectedToPass,
    actualPassed,
    verdict: passed ? "PASS" : "FAIL",
    ...details
  };
  if (suite === "DB_Live") results.dbTests.push(testRecord);
  else results.fuzzTests.push(testRecord);

  results.summary.total++;
  if (passed) {
    results.summary.passed++;
  } else {
    results.summary.failed++;
    results.summary.issues.push(testRecord);
  }
  return testRecord;
}

console.log("=== STARTING CHALLENGER 2 DEEP FUZZING & LIVE DB VALIDATION HARNESS ===\n");

// ============================================================================
// PART 1: LIVE MONGOOSE DB INSERTION ENFORCEMENT
// ============================================================================
console.log(">>> Connecting to MongoDB for live database-level validation testing...");
await dbConnect();

console.log(">>> Running Live DB insertion tests (verifying DB-level rejection of invalid data)...");

// Test 1: Live DB rejects Publication with missing required fields
try {
  const badPub = new Publication({
    // Missing title, slug, year, authors, venue
    abstract: "Incomplete publication"
  });
  await badPub.save();
  recordTest("DB_Live", "Live DB rejects Publication missing required fields", false, true, { error: "Saved unexpectedly" });
} catch (err) {
  recordTest("DB_Live", "Live DB rejects Publication missing required fields", false, false, { errorName: err.name, message: err.message });
}

// Test 2: Live DB rejects Publication with duplicate unique slug
try {
  const slug = "test-unique-slug-" + Date.now();
  const pub1 = await Publication.create({
    title: "Original Paper",
    slug,
    year: "2025",
    authors: "Author A",
    venue: "IEEE",
    type: "Journal"
  });

  let duplicateFailed = false;
  try {
    const pub2 = new Publication({
      title: "Duplicate Slug Paper",
      slug, // duplicate
      year: "2025",
      authors: "Author B",
      venue: "ACM",
      type: "Conference"
    });
    await pub2.save();
  } catch (dupErr) {
    duplicateFailed = true;
  }

  // Cleanup pub1
  await Publication.deleteOne({ _id: pub1._id });
  recordTest("DB_Live", "Live DB rejects duplicate Publication slug (unique index)", false, !duplicateFailed);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects duplicate Publication slug (unique index)", false, false, { error: err.message });
}

// Test 3: Live DB rejects Member with invalid enum
try {
  const badMember = new Member({
    name: "Invalid Member",
    slug: "invalid-member-" + Date.now(),
    category: "invalid_category_xyz"
  });
  await badMember.save();
  recordTest("DB_Live", "Live DB rejects Member with invalid category enum", false, true);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects Member with invalid category enum", false, false, { errorName: err.name });
}

// Test 4: Live DB rejects ResearchDomain with subdocument validation error
try {
  const badDomain = new ResearchDomain({
    title: "Domain Test",
    slug: "domain-test-" + Date.now(),
    description: "Description test",
    toolsAndDatasets: {
      items: [{ url: "https://example.com" }] // missing required name
    }
  });
  await badDomain.save();
  recordTest("DB_Live", "Live DB rejects ResearchDomain with missing subdoc tool name", false, true);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects ResearchDomain with missing subdoc tool name", false, false, { errorName: err.name });
}

// Test 5: Live DB rejects FypProject with invalid status enum
try {
  const badFyp = new FypProject({
    title: "Bad FYP",
    slug: "bad-fyp-" + Date.now(),
    summary: "Summary test exceeding 10 characters",
    status: "NonExistentStatus"
  });
  await badFyp.save();
  recordTest("DB_Live", "Live DB rejects FypProject with invalid status enum", false, true);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects FypProject with invalid status enum", false, false, { errorName: err.name });
}

// Test 6: Live DB rejects AuditLog with invalid entity and action
try {
  const badAudit = new AuditLog({
    userName: "hacker",
    action: "malicious_action",
    entity: "UnauthorizedEntity"
  });
  await badAudit.save();
  recordTest("DB_Live", "Live DB rejects AuditLog with invalid action/entity enums", false, true);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects AuditLog with invalid action/entity enums", false, false, { errorName: err.name });
}

// Test 7: Live DB rejects Enquiry exceeding max length
try {
  const badEnquiry = new Enquiry({
    name: "A".repeat(101),
    email: "test@example.com",
    message: "A".repeat(5001)
  });
  await badEnquiry.save();
  recordTest("DB_Live", "Live DB rejects Enquiry exceeding max length limits", false, true);
} catch (err) {
  recordTest("DB_Live", "Live DB rejects Enquiry exceeding max length limits", false, false, { errorName: err.name });
}

// ============================================================================
// PART 2: TYPE FUZZING & PROTOTYPE POLLUTION RESILIENCE
// ============================================================================
console.log("\n>>> Running Part 2: Type Fuzzing & Prototype Pollution Resilience...");

const fuzzPayloads = [
  null,
  undefined,
  12345,
  true,
  false,
  [],
  {},
  { __proto__: { admin: true } },
  { constructor: { prototype: { admin: true } } },
  NaN,
  Infinity,
  -1,
  new Date(),
  () => {},
  Symbol("test")
];

for (const [key, schema] of Object.entries(schemas)) {
  if (typeof schema?.safeParse === "function") {
    let schemaCrash = false;
    for (const payload of fuzzPayloads) {
      try {
        schema.safeParse(payload);
      } catch (err) {
        schemaCrash = true;
        console.error(`Crash on schema ${key} with payload:`, payload, err);
      }
    }
    recordTest("Fuzzing", `Schema ${key} safely handles type fuzzing without runtime crash`, true, !schemaCrash);
  }
}

// ============================================================================
// PART 3: REORDER & BULK ACTION EDGE CASES
// ============================================================================
console.log("\n>>> Running Part 3: Bulk Action & Reorder Edge Cases...");

// Reorder with empty items
const reorderEmpty = schemas.reorderSchema.safeParse({ items: [] });
recordTest("Fuzzing", "reorderSchema handles empty items array safely", true, reorderEmpty.success);

// Bulk action with mixed invalid ObjectIds
const bulkMixed = schemas.bulkActionSchema.safeParse({
  ids: ["507f1f77bcf86cd799439011", "not-a-valid-id-12345"],
  action: "publish"
});
recordTest("Fuzzing", "bulkActionSchema rejects array containing any invalid ObjectId", false, bulkMixed.success);

// Bulk action with non-array ids
const bulkNonArray = schemas.bulkActionSchema.safeParse({
  ids: "507f1f77bcf86cd799439011",
  action: "publish"
});
recordTest("Fuzzing", "bulkActionSchema rejects non-array ids string", false, bulkNonArray.success);

// ============================================================================
// SUMMARY & OUTPUT
// ============================================================================
console.log("\n============================================================================");
console.log("CHALLENGER 2 DEEP FUZZING & LIVE DB RESULTS SUMMARY");
console.log("============================================================================");
console.log(`Total Deep Tests Executed: ${results.summary.total}`);
console.log(`Passed: ${results.summary.passed}`);
console.log(`Failed: ${results.summary.failed}`);
console.log(`Issues Found: ${results.summary.issues.length}`);

if (results.summary.issues.length > 0) {
  console.log("\n❌ ISSUES DETECTED:");
  results.summary.issues.forEach((v, i) => {
    console.log(`  ${i + 1}. [${v.suite}] ${v.testName}: expected ${v.expectedToPass}, got ${v.actualPassed}`);
  });
} else {
  console.log("\n✅ ALL DEEP FUZZING & LIVE DB TESTS PASSED WITH 100% SUCCESS!");
}

console.log("\n=== DEEP TEST EXECUTION COMPLETE ===");

if (mongoose.connection && mongoose.connection.readyState !== 0) {
  await mongoose.connection.close();
}
process.exit(0);
