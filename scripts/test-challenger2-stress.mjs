// scripts/test-challenger2-stress.mjs
import mongoose from "mongoose";
import { z } from "zod";
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
import MediaAsset from "../models/MediaAsset.js";

const results = {
  zodTests: [],
  mongooseTests: [],
  summary: { total: 0, passed: 0, failed: 0, vulnerabilities: [] }
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
  if (suite === "Zod") results.zodTests.push(testRecord);
  else results.mongooseTests.push(testRecord);

  results.summary.total++;
  if (passed) {
    results.summary.passed++;
  } else {
    results.summary.failed++;
    results.summary.vulnerabilities.push(testRecord);
  }
  return testRecord;
}

console.log("=== STARTING CHALLENGER 2 EMPIRICAL ADVERSARIAL STRESS TEST SUITE ===\n");

// ============================================================================
// SUITE 1: ZOD SCHEMA ADVERSARIAL VALIDATION TESTS
// ============================================================================

console.log(">>> Running Suite 1: Zod Schema Adversarial Tests...");

// 1.1 Empty strings & Missing fields
function testZodEmptyAndMissing() {
  // projectSchema: empty title
  const t1 = schemas.projectSchema.safeParse({ title: "", description: "A valid long description that is long enough.", tags: ["test"] });
  recordTest("Zod", "projectSchema rejects empty title", false, t1.success, { error: t1.error?.issues?.[0]?.message });

  // projectSchema: whitespace title
  const t2 = schemas.projectSchema.safeParse({ title: "   ", description: "A valid long description that is long enough.", tags: ["test"] });
  recordTest("Zod", "projectSchema rejects whitespace-only title", false, t2.success, { error: t2.error?.issues?.[0]?.message });

  // projectSchema: title under 3 chars
  const t3 = schemas.projectSchema.safeParse({ title: "AB", description: "A valid long description that is long enough.", tags: ["test"] });
  recordTest("Zod", "projectSchema rejects title < 3 chars", false, t3.success, { error: t3.error?.issues?.[0]?.message });

  // projectSchema: empty description if provided
  const t4 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "Too short", tags: ["test"] });
  recordTest("Zod", "projectSchema rejects description < 20 chars", false, t4.success, { error: t4.error?.issues?.[0]?.message });

  // projectSchema: missing tags
  const t5 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough." });
  recordTest("Zod", "projectSchema rejects missing tags", false, t5.success, { error: t5.error?.issues?.[0]?.message });

  // projectSchema: empty tags array
  const t6 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: [] });
  recordTest("Zod", "projectSchema rejects empty tags array", false, t6.success, { error: t6.error?.issues?.[0]?.message });

  // projectSchema: empty tags string
  const t7 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: "" });
  recordTest("Zod", "projectSchema rejects empty tags string", false, t7.success, { error: t7.error?.issues?.[0]?.message });

  // fypProjectSchema: empty title
  const t8 = schemas.fypProjectSchema.safeParse({ title: "", summary: "Valid summary exceeding 10 characters." });
  recordTest("Zod", "fypProjectSchema rejects empty title", false, t8.success, { error: t8.error?.issues?.[0]?.message });

  // fypProjectSchema: summary under 10 chars
  const t9 = schemas.fypProjectSchema.safeParse({ title: "Valid FYP Title", summary: "Short" });
  recordTest("Zod", "fypProjectSchema rejects summary < 10 chars", false, t9.success, { error: t9.error?.issues?.[0]?.message });

  // fypProjectSchema: student with empty name
  const t10 = schemas.fypProjectSchema.safeParse({
    title: "Valid FYP Title",
    summary: "Valid summary exceeding 10 characters.",
    students: [{ name: "" }]
  });
  recordTest("Zod", "fypProjectSchema rejects student with empty name", false, t10.success, { error: t10.error?.issues?.[0]?.message });

  // publicationSchema: missing required fields
  const t11 = schemas.publicationSchema.safeParse({ title: "Valid Title" });
  recordTest("Zod", "publicationSchema rejects missing year/authors/venue", false, t11.success, { errorCount: t11.error?.issues?.length });

  // publicationSchema: empty authors
  const t12 = schemas.publicationSchema.safeParse({ title: "Valid Title", year: "2025", authors: "", venue: "IEEE" });
  recordTest("Zod", "publicationSchema rejects empty authors string", false, t12.success, { error: t12.error?.issues?.[0]?.message });

  // memberSchema: empty name
  const t13 = schemas.memberSchema.safeParse({ name: "", category: "co-investigator" });
  recordTest("Zod", "memberSchema rejects empty name", false, t13.success, { error: t13.error?.issues?.[0]?.message });

  // memberSchema: missing category
  const t14 = schemas.memberSchema.safeParse({ name: "Dr. Test" });
  recordTest("Zod", "memberSchema rejects missing category", false, t14.success, { error: t14.error?.issues?.[0]?.message });

  // researchDomainSchema: empty description
  const t15 = schemas.researchDomainSchema.safeParse({ title: "Cybersecurity", description: "" });
  recordTest("Zod", "researchDomainSchema rejects empty description", false, t15.success, { error: t15.error?.issues?.[0]?.message });

  // researchDomainSchema: tool without name
  const t16 = schemas.researchDomainSchema.safeParse({
    title: "Cybersecurity",
    description: "Valid research description here.",
    toolsAndDatasets: { items: [{ name: "", url: "https://example.com" }] }
  });
  recordTest("Zod", "researchDomainSchema rejects tool item with empty name", false, t16.success, { error: t16.error?.issues?.[0]?.message });

  // eventHighlightSchema: empty title
  const t17 = schemas.eventHighlightSchema.safeParse({ title: "", summary: "Valid summary here" });
  recordTest("Zod", "eventHighlightSchema rejects empty title", false, t17.success, { error: t17.error?.issues?.[0]?.message });

  // labProfileSchema: empty name
  const t18 = schemas.labProfileSchema.safeParse({ name: "" });
  recordTest("Zod", "labProfileSchema rejects empty name", false, t18.success, { error: t18.error?.issues?.[0]?.message });

  // labProfileSchema: experience item with empty fields
  const t19 = schemas.labProfileSchema.safeParse({
    name: "Dr. Junaid Akram",
    experience: [{ role: "", organization: "SSA Lab", period: "2020" }]
  });
  recordTest("Zod", "labProfileSchema rejects experience item with empty role", false, t19.success, { error: t19.error?.issues?.[0]?.message });

  // enquirySchema: empty name and message
  const t20 = schemas.enquirySchema.safeParse({ name: "", email: "test@example.com", message: "" });
  recordTest("Zod", "enquirySchema rejects empty name and message", false, t20.success, { errorCount: t20.error?.issues?.length });
}
testZodEmptyAndMissing();

// 1.2 Invalid Enum Values
function testZodInvalidEnums() {
  // projectSchema: invalid status
  const t1 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    status: "INVALID_STATUS"
  });
  recordTest("Zod", "projectSchema rejects invalid status enum", false, t1.success, { error: t1.error?.issues?.[0]?.message });

  // projectSchema: invalid projectType
  const t2 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    projectType: "Personal"
  });
  recordTest("Zod", "projectSchema rejects invalid projectType enum", false, t2.success, { error: t2.error?.issues?.[0]?.message });

  // projectSchema: invalid imageFit
  const t3 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    imageFit: "stretched"
  });
  recordTest("Zod", "projectSchema rejects invalid imageFit enum", false, t3.success, { error: t3.error?.issues?.[0]?.message });

  // fypProjectSchema: invalid status
  const t4 = schemas.fypProjectSchema.safeParse({
    title: "Valid FYP Title",
    summary: "Valid summary exceeding 10 characters.",
    status: "PendingApproval"
  });
  recordTest("Zod", "fypProjectSchema rejects invalid status enum", false, t4.success, { error: t4.error?.issues?.[0]?.message });

  // fypProjectSchema: invalid categoryType
  const t5 = schemas.fypProjectSchema.safeParse({
    title: "Valid FYP Title",
    summary: "Valid summary exceeding 10 characters.",
    categoryType: "archived"
  });
  recordTest("Zod", "fypProjectSchema rejects invalid categoryType enum", false, t5.success, { error: t5.error?.issues?.[0]?.message });

  // publicationSchema: invalid type
  const t6 = schemas.publicationSchema.safeParse({
    title: "Valid Title",
    year: "2025",
    authors: "Author A",
    venue: "IEEE",
    type: "Blog"
  });
  recordTest("Zod", "publicationSchema rejects invalid type enum", false, t6.success, { error: t6.error?.issues?.[0]?.message });

  // memberSchema: invalid category
  const t7 = schemas.memberSchema.safeParse({
    name: "Dr. Test",
    category: "faculty"
  });
  recordTest("Zod", "memberSchema rejects invalid category enum", false, t7.success, { error: t7.error?.issues?.[0]?.message });

  // eventHighlightSchema: invalid category
  const t8 = schemas.eventHighlightSchema.safeParse({
    title: "Valid Event",
    summary: "Valid summary here",
    category: "UnrecognizedCategory"
  });
  recordTest("Zod", "eventHighlightSchema rejects invalid category enum", false, t8.success, { error: t8.error?.issues?.[0]?.message });

  // eventHighlightSchema: invalid orientation
  const t9 = schemas.eventHighlightSchema.safeParse({
    title: "Valid Event",
    summary: "Valid summary here",
    orientation: "diagonal"
  });
  recordTest("Zod", "eventHighlightSchema rejects invalid orientation enum", false, t9.success, { error: t9.error?.issues?.[0]?.message });

  // bulkActionSchema: invalid action
  const t10 = schemas.bulkActionSchema.safeParse({
    ids: ["507f1f77bcf86cd799439011"],
    action: "destroy_all"
  });
  recordTest("Zod", "bulkActionSchema rejects invalid action enum", false, t10.success, { error: t10.error?.issues?.[0]?.message });

  // enquirySchema: invalid enquiryType
  const t11 = schemas.enquirySchema.safeParse({
    name: "John Doe",
    email: "john@example.com",
    message: "Valid message content here.",
    enquiryType: "SpamInquiry"
  });
  recordTest("Zod", "enquirySchema rejects invalid enquiryType enum", false, t11.success, { error: t11.error?.issues?.[0]?.message });

  // enquirySchema: invalid status
  const t12 = schemas.enquirySchema.safeParse({
    name: "John Doe",
    email: "john@example.com",
    message: "Valid message content here.",
    status: "destroyed"
  });
  recordTest("Zod", "enquirySchema rejects invalid status enum", false, t12.success, { error: t12.error?.issues?.[0]?.message });
}
testZodInvalidEnums();

// 1.3 URL validation & isLooseImageUrl Adversarial Probing
function testZodUrlsAndImages() {
  // Malformed URLs on project links
  const t1 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    links: { live: "not-a-url" }
  });
  recordTest("Zod", "projectSchema rejects invalid links.live URL", false, t1.success, { error: t1.error?.issues?.[0]?.message });

  const t2 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    links: { github: "http//missing-colon.com" }
  });
  recordTest("Zod", "projectSchema rejects malformed links.github URL", false, t2.success, { error: t2.error?.issues?.[0]?.message });

  // Valid URLs on project links
  const t3 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    links: { live: "https://example.com/demo", github: "https://github.com/ssalab/repo" }
  });
  recordTest("Zod", "projectSchema accepts valid https URLs in links", true, t3.success);

  // Empty string URLs on project links (allowed for optional empty inputs)
  const t4 = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    links: { live: "", github: "" }
  });
  recordTest("Zod", "projectSchema accepts empty string for blank links", true, t4.success);

  // Image validation: isLooseImageUrl
  const validImages = [
    "https://images.unsplash.com/photo-123.jpg",
    "http://example.com/asset.png",
    "/academic/events/event-01.jpg",
    "//cdn.example.com/logo.webp",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "blob:http://localhost:3000/123-456",
    "preview.jpg?v=2"
  ];
  for (const img of validImages) {
    const res = schemas.projectSchema.safeParse({
      title: "Valid Title",
      description: "A valid long description that is long enough.",
      tags: ["test"],
      image: img
    });
    recordTest("Zod", `projectSchema accepts valid image format [${img.slice(0, 30)}...]`, true, res.success);
  }

  // Malicious image URLs
  const invalidImages = [
    "javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "random text string without extension"
  ];
  for (const img of invalidImages) {
    const res = schemas.projectSchema.safeParse({
      title: "Valid Title",
      description: "A valid long description that is long enough.",
      tags: ["test"],
      image: img
    });
    recordTest("Zod", `projectSchema rejects invalid/malicious image [${img.slice(0, 30)}]`, false, res.success, { error: res.error?.issues?.[0]?.message });
  }

  // Gallery image validation
  const galleryMalicious = schemas.projectSchema.safeParse({
    title: "Valid Title",
    description: "A valid long description that is long enough.",
    tags: ["test"],
    gallery: [{ url: "javascript:alert('XSS')" }]
  });
  recordTest("Zod", "projectSchema rejects javascript: in gallery[].url", false, galleryMalicious.success, { error: galleryMalicious.error?.issues?.[0]?.message });
}
testZodUrlsAndImages();

// 1.4 Maximum length boundaries & Stress testing
function testZodMaxLengths() {
  // projectSchema.title max 100
  const title100 = "A".repeat(100);
  const title101 = "A".repeat(101);
  const t1 = schemas.projectSchema.safeParse({ title: title100, description: "A valid long description that is long enough.", tags: ["test"] });
  recordTest("Zod", "projectSchema accepts title at exact 100 chars limit", true, t1.success);
  const t2 = schemas.projectSchema.safeParse({ title: title101, description: "A valid long description that is long enough.", tags: ["test"] });
  recordTest("Zod", "projectSchema rejects title exceeding 100 chars (101 chars)", false, t2.success, { error: t2.error?.issues?.[0]?.message });

  // projectSchema.metaTitle max 70
  const meta70 = "A".repeat(70);
  const meta71 = "A".repeat(71);
  const t3 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], metaTitle: meta70 });
  recordTest("Zod", "projectSchema accepts metaTitle at exact 70 chars limit", true, t3.success);
  const t4 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], metaTitle: meta71 });
  recordTest("Zod", "projectSchema rejects metaTitle exceeding 70 chars (71 chars)", false, t4.success, { error: t4.error?.issues?.[0]?.message });

  // projectSchema.metaDescription max 160
  const desc160 = "A".repeat(160);
  const desc161 = "A".repeat(161);
  const t5 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], metaDescription: desc160 });
  recordTest("Zod", "projectSchema accepts metaDescription at exact 160 chars limit", true, t5.success);
  const t6 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], metaDescription: desc161 });
  recordTest("Zod", "projectSchema rejects metaDescription exceeding 160 chars (161 chars)", false, t6.success, { error: t6.error?.issues?.[0]?.message });

  // projectSchema.gallery max 20 items
  const gallery20 = Array.from({ length: 20 }, (_, i) => ({ url: `/img/${i}.jpg` }));
  const gallery21 = Array.from({ length: 21 }, (_, i) => ({ url: `/img/${i}.jpg` }));
  const t7 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], gallery: gallery20 });
  recordTest("Zod", "projectSchema accepts gallery with 20 items", true, t7.success);
  const t8 = schemas.projectSchema.safeParse({ title: "Valid Title", description: "A valid long description that is long enough.", tags: ["test"], gallery: gallery21 });
  recordTest("Zod", "projectSchema rejects gallery exceeding 20 items (21 items)", false, t8.success, { error: t8.error?.issues?.[0]?.message });

  // enquirySchema.name max 100 & message max 5000
  const enqName101 = "A".repeat(101);
  const enqMsg5001 = "A".repeat(5001);
  const t9 = schemas.enquirySchema.safeParse({ name: enqName101, email: "test@example.com", message: "Valid message." });
  recordTest("Zod", "enquirySchema rejects name exceeding 100 chars (101 chars)", false, t9.success, { error: t9.error?.issues?.[0]?.message });
  const t10 = schemas.enquirySchema.safeParse({ name: "Valid Name", email: "test@example.com", message: enqMsg5001 });
  recordTest("Zod", "enquirySchema rejects message exceeding 5000 chars (5001 chars)", false, t10.success, { error: t10.error?.issues?.[0]?.message });

  // Stress test: 100k characters on unbounded fields
  const big100k = "X".repeat(100000);
  const pubBig = schemas.publicationSchema.safeParse({
    title: big100k,
    year: "2025",
    authors: "Author A",
    venue: "Venue B"
  });
  // Note: publicationSchema title has min(3) but no max limit. Does it accept 100k chars?
  recordTest("Zod", "publicationSchema handles 100,000 char title without crashing", true, pubBig.success, { note: "Unbounded text fields parse without runtime exception" });
}
testZodMaxLengths();

// 1.5 XSS & HTML Injection in Content / String fields
function testZodXSSAndSanitization() {
  const xssPayloads = [
    "<script>alert('XSS')</script>",
    "<img src='x' onerror='alert(1)'>",
    "<iframe src='javascript:alert(1)'></iframe>",
    "<svg onload=alert(1)>",
    "'; DROP TABLE users; --",
    "{{7*7}}",
    "${process.env}"
  ];

  for (const xss of xssPayloads) {
    const res = schemas.projectSchema.safeParse({
      title: "Valid Project " + xss.slice(0, 10),
      description: "A valid long description that is long enough: " + xss,
      tags: ["test", xss],
      problem: xss,
      solution: xss,
      outcome: xss
    });
    // Zod's role is schema structural type validation (strings allowed). It should safely parse without throwing unhandled exceptions.
    recordTest("Zod", `projectSchema safely parses string containing payload [${xss.slice(0, 20)}] without runtime throw`, true, res.success);
  }
}
testZodXSSAndSanitization();

// 1.6 Bulk Action & Reorder Schemas
function testZodBulkAndReorder() {
  const validObjectId1 = "507f1f77bcf86cd799439011";
  const validObjectId2 = "507f191e810c19729de860ea";

  // Bulk action with invalid ObjectId
  const t1 = schemas.bulkActionSchema.safeParse({ ids: ["invalid_id"], action: "publish" });
  recordTest("Zod", "bulkActionSchema rejects malformed ObjectId in ids", false, t1.success, { error: t1.error?.issues?.[0]?.message });

  // Bulk action with empty ids and empty projectIds
  const t2 = schemas.bulkActionSchema.safeParse({ ids: [], projectIds: [], action: "publish" });
  recordTest("Zod", "bulkActionSchema rejects empty ids and projectIds", false, t2.success, { error: t2.error?.issues?.[0]?.message });

  // Reorder schema with invalid ObjectId
  const t3 = schemas.reorderSchema.safeParse({ items: [{ id: "not_an_id", displayOrder: 1 }] });
  recordTest("Zod", "reorderSchema rejects malformed ObjectId in items", false, t3.success, { error: t3.error?.issues?.[0]?.message });

  // Reorder schema with non-integer displayOrder
  const t4 = schemas.reorderSchema.safeParse({ items: [{ id: validObjectId1, displayOrder: 1.5 }] });
  recordTest("Zod", "reorderSchema rejects float displayOrder", false, t4.success, { error: t4.error?.issues?.[0]?.message });

  // Reorder schema with valid payload
  const t5 = schemas.reorderSchema.safeParse({ items: [{ id: validObjectId1, displayOrder: 0 }, { id: validObjectId2, displayOrder: 1 }] });
  recordTest("Zod", "reorderSchema accepts valid items array", true, t5.success);
}
testZodBulkAndReorder();

// ============================================================================
// SUITE 2: MONGOOSE MODEL SCHEMA ADVERSARIAL VALIDATION TESTS
// ============================================================================

console.log("\n>>> Running Suite 2: Mongoose Model Schema Adversarial Tests...");

async function testMongooseValidation() {
  // 2.1 Publication Model Validation
  // Missing required fields
  const pubEmpty = new Publication({});
  const pubEmptyErr = pubEmpty.validateSync();
  recordTest("Mongoose", "Publication model requires title, slug, year, authors, venue", false, !pubEmptyErr, {
    missingErrors: Object.keys(pubEmptyErr?.errors || {})
  });

  // Invalid enum on Publication.type
  const pubInvalidType = new Publication({
    title: "Test Paper",
    slug: "test-paper",
    year: "2025",
    authors: "Author A",
    venue: "IEEE",
    type: "InvalidTypeName"
  });
  const pubTypeErr = pubInvalidType.validateSync();
  recordTest("Mongoose", "Publication model rejects invalid type enum", false, !pubTypeErr, {
    error: pubTypeErr?.errors?.type?.message
  });

  // Valid Publication
  const pubValid = new Publication({
    title: "Test Paper",
    slug: "test-paper",
    year: "2025",
    authors: "Author A",
    venue: "IEEE",
    type: "Journal"
  });
  const pubValidErr = pubValid.validateSync();
  recordTest("Mongoose", "Publication model accepts valid document", true, !pubValidErr);

  // 2.2 Member Model Validation
  // Missing required fields
  const memEmpty = new Member({});
  const memEmptyErr = memEmpty.validateSync();
  recordTest("Mongoose", "Member model requires name, slug, category", false, !memEmptyErr, {
    missingErrors: Object.keys(memEmptyErr?.errors || {})
  });

  // Invalid category enum
  const memInvalidCat = new Member({
    name: "Dr. Test",
    slug: "dr-test",
    category: "invalid_category"
  });
  const memCatErr = memInvalidCat.validateSync();
  recordTest("Mongoose", "Member model rejects invalid category enum", false, !memCatErr, {
    error: memCatErr?.errors?.category?.message
  });

  // Valid Member
  const memValid = new Member({
    name: "Dr. Test",
    slug: "dr-test",
    category: "co-investigator"
  });
  const memValidErr = memValid.validateSync();
  recordTest("Mongoose", "Member model accepts valid document", true, !memValidErr);

  // 2.3 ResearchDomain Model Validation
  // Missing required fields
  const rdEmpty = new ResearchDomain({});
  const rdEmptyErr = rdEmpty.validateSync();
  recordTest("Mongoose", "ResearchDomain model requires title, slug, description", false, !rdEmptyErr, {
    missingErrors: Object.keys(rdEmptyErr?.errors || {})
  });

  // Subdocument validation: toolsAndDatasets.items missing name
  const rdInvalidSub = new ResearchDomain({
    title: "AI Security",
    slug: "ai-security",
    description: "Domain description",
    toolsAndDatasets: { items: [{ url: "https://example.com" }] } // missing required name
  });
  const rdSubErr = rdInvalidSub.validateSync();
  recordTest("Mongoose", "ResearchDomain rejects toolsAndDatasets item missing name", false, !rdSubErr, {
    error: rdSubErr?.errors?.["toolsAndDatasets.items.0.name"]?.message
  });

  // 2.4 EventHighlight Model Validation
  // Missing required fields
  const evEmpty = new EventHighlight({});
  const evEmptyErr = evEmpty.validateSync();
  recordTest("Mongoose", "EventHighlight model requires title, slug, summary", false, !evEmptyErr, {
    missingErrors: Object.keys(evEmptyErr?.errors || {})
  });

  // Invalid category & orientation enum
  const evInvalidEnum = new EventHighlight({
    title: "Event Title",
    slug: "event-title",
    summary: "Event Summary",
    category: "InvalidCategory",
    orientation: "diagonal"
  });
  const evEnumErr = evInvalidEnum.validateSync();
  recordTest("Mongoose", "EventHighlight rejects invalid category & orientation enums", false, !evEnumErr, {
    errors: Object.keys(evEnumErr?.errors || {})
  });

  // 2.5 FypProject Model Validation
  // Missing required fields
  const fypEmpty = new FypProject({});
  const fypEmptyErr = fypEmpty.validateSync();
  recordTest("Mongoose", "FypProject requires title, slug, summary", false, !fypEmptyErr, {
    missingErrors: Object.keys(fypEmptyErr?.errors || {})
  });

  // Invalid status enum
  const fypInvalidStatus = new FypProject({
    title: "FYP Title",
    slug: "fyp-title",
    summary: "FYP Summary",
    status: "Discontinued"
  });
  const fypStatusErr = fypInvalidStatus.validateSync();
  recordTest("Mongoose", "FypProject rejects invalid status enum", false, !fypStatusErr, {
    error: fypStatusErr?.errors?.status?.message
  });

  // Subdocument validation: student missing name
  const fypInvalidStudent = new FypProject({
    title: "FYP Title",
    slug: "fyp-title",
    summary: "FYP Summary",
    students: [{ registration: "FA21-BCS-001" }] // missing required name
  });
  const fypStudentErr = fypInvalidStudent.validateSync();
  recordTest("Mongoose", "FypProject rejects student subdocument missing name", false, !fypStudentErr, {
    error: fypStudentErr?.errors?.["students.0.name"]?.message
  });

  // Subdocument validation: gallery missing url
  const fypInvalidGallery = new FypProject({
    title: "FYP Title",
    slug: "fyp-title",
    summary: "FYP Summary",
    gallery: [{ caption: "Missing URL image" }] // missing required url
  });
  const fypGalleryErr = fypInvalidGallery.validateSync();
  recordTest("Mongoose", "FypProject rejects gallery subdocument missing url", false, !fypGalleryErr, {
    error: fypGalleryErr?.errors?.["gallery.0.url"]?.message
  });

  // 2.6 Project Model Validation
  // Missing required fields
  const projEmpty = new Project({});
  const projEmptyErr = projEmpty.validateSync();
  recordTest("Mongoose", "Project requires title, slug, description", false, !projEmptyErr, {
    missingErrors: Object.keys(projEmptyErr?.errors || {})
  });

  // Invalid imageFit enum
  const projInvalidFit = new Project({
    title: "Project Title",
    slug: "project-title",
    description: "Project Description",
    imageFit: "invalid-fit-mode"
  });
  const projFitErr = projInvalidFit.validateSync();
  recordTest("Mongoose", "Project rejects invalid imageFit enum", false, !projFitErr, {
    error: projFitErr?.errors?.imageFit?.message
  });

  // Invalid projectType enum
  const projInvalidType = new Project({
    title: "Project Title",
    slug: "project-title",
    description: "Project Description",
    projectType: "PersonalProject"
  });
  const projTypeErr = projInvalidType.validateSync();
  recordTest("Mongoose", "Project rejects invalid projectType enum", false, !projTypeErr, {
    error: projTypeErr?.errors?.projectType?.message
  });

  // 2.7 LabProfile Model Validation
  // Subdocument experience missing required fields
  const lpInvalidExp = new LabProfile({
    name: "Dr. Junaid Akram",
    experience: [{ role: "Professor" }] // missing organization and period
  });
  const lpExpErr = lpInvalidExp.validateSync();
  recordTest("Mongoose", "LabProfile rejects experience subdocument missing organization/period", false, !lpExpErr, {
    errors: Object.keys(lpExpErr?.errors || {})
  });

  // Subdocument pillar missing required desc
  const lpInvalidPillar = new LabProfile({
    name: "Dr. Junaid Akram",
    pillars: [{ id: "p1", title: "Pillar 1" }] // missing desc
  });
  const lpPillarErr = lpInvalidPillar.validateSync();
  recordTest("Mongoose", "LabProfile rejects pillar subdocument missing desc", false, !lpPillarErr, {
    error: lpPillarErr?.errors?.["pillars.0.desc"]?.message
  });

  // 2.8 AuditLog Model Validation
  // Missing required fields
  const auditEmpty = new AuditLog({});
  const auditEmptyErr = auditEmpty.validateSync();
  recordTest("Mongoose", "AuditLog requires action, entity, userName", false, !auditEmptyErr, {
    missingErrors: Object.keys(auditEmptyErr?.errors || {})
  });

  // Invalid action enum
  const auditInvalidAction = new AuditLog({
    userName: "admin",
    action: "unauthorized_action",
    entity: "Publication"
  });
  const auditActionErr = auditInvalidAction.validateSync();
  recordTest("Mongoose", "AuditLog rejects invalid action enum", false, !auditActionErr, {
    error: auditActionErr?.errors?.action?.message
  });

  // Invalid entity enum
  const auditInvalidEntity = new AuditLog({
    userName: "admin",
    action: "create",
    entity: "UnknownCollection"
  });
  const auditEntityErr = auditInvalidEntity.validateSync();
  recordTest("Mongoose", "AuditLog rejects invalid entity enum", false, !auditEntityErr, {
    error: auditEntityErr?.errors?.entity?.message
  });

  // 2.9 Enquiry Model Validation
  // Missing required fields
  const enqEmpty = new Enquiry({});
  const enqEmptyErr = enqEmpty.validateSync();
  recordTest("Mongoose", "Enquiry requires name, email, message", false, !enqEmptyErr, {
    missingErrors: Object.keys(enqEmptyErr?.errors || {})
  });

  // Invalid enquiryType enum
  const enqInvalidType = new Enquiry({
    name: "Test User",
    email: "test@example.com",
    message: "Test Message",
    enquiryType: "InvalidEnquiryType"
  });
  const enqTypeErr = enqInvalidType.validateSync();
  recordTest("Mongoose", "Enquiry rejects invalid enquiryType enum", false, !enqTypeErr, {
    error: enqTypeErr?.errors?.enquiryType?.message
  });

  // Invalid status enum
  const enqInvalidStatus = new Enquiry({
    name: "Test User",
    email: "test@example.com",
    message: "Test Message",
    status: "spam"
  });
  const enqStatusErr = enqInvalidStatus.validateSync();
  recordTest("Mongoose", "Enquiry rejects invalid status enum", false, !enqStatusErr, {
    error: enqStatusErr?.errors?.status?.message
  });

  // Maxlength validation on Enquiry.name (>100) and message (>5000)
  const enqLong = new Enquiry({
    name: "A".repeat(101),
    email: "test@example.com",
    message: "A".repeat(5001)
  });
  const enqLongErr = enqLong.validateSync();
  recordTest("Mongoose", "Enquiry rejects name > 100 and message > 5000 chars", false, !enqLongErr, {
    errors: Object.keys(enqLongErr?.errors || {})
  });
}
await testMongooseValidation();

// ============================================================================
// SUMMARY & OUTPUT
// ============================================================================
console.log("\n============================================================================");
console.log("CHALLENGER 2 EMPIRICAL TEST RESULTS SUMMARY");
console.log("============================================================================");
console.log(`Total Adversarial Tests Executed: ${results.summary.total}`);
console.log(`Passed: ${results.summary.passed}`);
console.log(`Failed: ${results.summary.failed}`);
console.log(`Vulnerabilities / Anomalies Detected: ${results.summary.vulnerabilities.length}`);

if (results.summary.vulnerabilities.length > 0) {
  console.log("\n❌ VULNERABILITIES / ANOMALIES FOUND:");
  results.summary.vulnerabilities.forEach((v, i) => {
    console.log(`  ${i + 1}. [${v.suite}] ${v.testName}: expected ${v.expectedToPass}, got ${v.actualPassed}`);
  });
} else {
  console.log("\n✅ ALL EMPIRICAL ADVERSARIAL STRESS TESTS PASSED WITH ZERO VULNERABILITIES!");
}

console.log("\n=== TEST EXECUTION COMPLETE ===");
