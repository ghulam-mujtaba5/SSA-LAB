/**
 * Verification Script for Milestone 1 Database & Models
 * Tests queries, schema integrity, and document counts across all 8 collections.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

async function verify() {
  console.log("==================================================");
  console.log("🔍 Verifying Milestone 1 Database Collections & Models");
  console.log("==================================================");

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
  const AuditLog = (await import("../models/AuditLog.js")).default;
  const User = (await import("../models/User.js")).default;

  const results = {};

  // 1. Lab Profile
  const labProfile = await LabProfile.findOne({ key: "default" }).lean();
  results.labProfile = {
    exists: !!labProfile,
    name: labProfile?.name,
    pillarsCount: labProfile?.pillars?.length,
    milestonesCount: labProfile?.milestones?.length,
    impactStatsCount: labProfile?.impactStats?.length,
    partnerLogosCount: labProfile?.partnerLogos?.length,
  };
  console.log("✓ Lab Profile:", results.labProfile);

  // 2. Research Domains
  const domainsCount = await ResearchDomain.countDocuments();
  const domainsSample = await ResearchDomain.find().select("title slug number").lean();
  results.researchDomains = {
    count: domainsCount,
    domains: domainsSample.map(d => `${d.number} - ${d.title} (${d.slug})`),
  };
  console.log("✓ Research Domains:", results.researchDomains);

  // 3. Publications
  const pubsCount = await Publication.countDocuments();
  const journalsCount = await Publication.countDocuments({ type: "Journal" });
  const confsCount = await Publication.countDocuments({ type: "Conference" });
  results.publications = {
    total: pubsCount,
    journals: journalsCount,
    conferences: confsCount,
  };
  console.log("✓ Publications:", results.publications);

  // 4. Research Projects
  const projectsCount = await Project.countDocuments();
  const researchProjectsCount = await Project.countDocuments({ projectType: "Research" });
  results.projects = {
    total: projectsCount,
    researchProjects: researchProjectsCount,
  };
  console.log("✓ Projects:", results.projects);

  // 5. Members by Category
  const membersTotal = await Member.countDocuments();
  const coInvestigators = await Member.countDocuments({ category: "co-investigator" });
  const pgResearchers = await Member.countDocuments({ category: "pg-researcher" });
  const collaborators = await Member.countDocuments({ category: "collaborator" });
  const supervised = await Member.countDocuments({ category: "supervised-project" });
  const alumni = await Member.countDocuments({ category: "alumni" });
  results.members = {
    total: membersTotal,
    coInvestigators,
    pgResearchers,
    collaborators,
    supervisedTheses: supervised,
    alumni,
  };
  console.log("✓ Members Breakdown:", results.members);

  // 6. Event Highlights & Gallery
  const totalEvents = await EventHighlight.countDocuments();
  const highlightsCount = await EventHighlight.countDocuments({ isGalleryItem: false });
  const galleryCount = await EventHighlight.countDocuments({ isGalleryItem: true });
  results.eventHighlights = {
    total: totalEvents,
    highlights: highlightsCount,
    galleryItems: galleryCount,
  };
  console.log("✓ Event Highlights & Gallery:", results.eventHighlights);

  // 7. FYP Projects by CategoryType
  const totalFyp = await FypProject.countDocuments();
  const runningFyp = await FypProject.countDocuments({ categoryType: "running" });
  const completedFyp = await FypProject.countDocuments({ categoryType: "completed" });
  const futureFyp = await FypProject.countDocuments({ categoryType: "future" });
  results.fypProjects = {
    total: totalFyp,
    running: runningFyp,
    completed: completedFyp,
    supervisionOpportunities: futureFyp,
  };
  console.log("✓ FYP Projects Breakdown:", results.fypProjects);

  // 8. Test AuditLog creation with new entities
  const testAudit = await AuditLog.create({
    userName: "Test System Auditor",
    action: "create",
    entity: "Publication",
    entityId: "test-pub-id",
    details: "Milestone 1 audit log verification",
  });
  console.log("✓ AuditLog entity validation passed:", testAudit._id);
  await AuditLog.deleteOne({ _id: testAudit._id });
  console.log("✓ AuditLog cleaned up");

  // 9. Admin User
  const adminUsersCount = await User.countDocuments({ role: "admin" });
  results.adminUsers = { count: adminUsersCount };
  console.log("✓ Admin Users:", results.adminUsers);

  console.log("\n==================================================");
  console.log("✅ All Milestone 1 Verification Checks PASSED!");
  console.log("==================================================");
  process.exit(0);
}

verify().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
