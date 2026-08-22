/**
 * Reviewer 2 Independent Deep Audit & Verification Script
 * Milestone 1: Database Schemas, Models & Seeding Engine
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function runDeepAudit() {
  console.log("================================================================================");
  console.log("🔬 REVIEWER 2 INDEPENDENT AUDIT: DATA MIGRATION FIDELITY & SCHEMA COMPLETENESS");
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

  const academicSite = await import("../data/academicSite.js");
  const fypData = await import("../data/fypProjects.js");

  const auditReport = {
    checksPassed: 0,
    checksFailed: 0,
    findings: [],
  };

  function assert(condition, message, details = null) {
    if (condition) {
      auditReport.checksPassed++;
      console.log(`  ✅ PASS: ${message}`);
    } else {
      auditReport.checksFailed++;
      const errorMsg = `❌ FAIL: ${message}`;
      console.error(`  ${errorMsg}`, details ? details : "");
      auditReport.findings.push({ message, details });
    }
  }

  // ==========================================================================
  // SECTION 1: LAB PROFILE FIDELITY
  // ==========================================================================
  console.log("--- SECTION 1: Lab Profile & Site Settings Fidelity ---");
  {
    const profile = await LabProfile.findOne({ key: "default" }).lean();
    assert(!!profile, "LabProfile record with key='default' exists in database");

    const src = academicSite.academicProfile;
    assert(profile.name === src.name, `Profile name matches: "${profile?.name}" === "${src?.name}"`);
    assert(profile.shortName === src.shortName, `Profile shortName matches: "${profile?.shortName}" === "${src?.shortName}"`);
    assert(profile.role === src.role, `Profile role matches: "${profile?.role}" === "${src?.role}"`);
    assert(profile.institution === src.institution, `Profile institution matches: "${profile?.institution}"`);
    assert(profile.lab === src.lab, `Profile lab matches: "${profile?.lab}"`);
    assert(profile.labShort === src.labShort, `Profile labShort matches: "${profile?.labShort}"`);
    assert(profile.office === src.office, `Profile office matches: "${profile?.office}"`);
    assert(profile.labEmail === src.labEmail, `Profile labEmail matches: "${profile?.labEmail}"`);
    assert(profile.googleScholar === src.googleScholar, `Profile googleScholar matches: "${profile?.googleScholar}"`);
    assert(profile.linkedin === src.linkedin, `Profile linkedin matches: "${profile?.linkedin}"`);
    assert(profile.researchGate === src.researchGate, `Profile researchGate matches: "${profile?.researchGate}"`);
    assert(profile.orcid === src.orcid, `Profile orcid matches: "${profile?.orcid}"`);
    assert(profile.officialProfile === src.officialProfile, `Profile officialProfile matches: "${profile?.officialProfile}"`);
    assert(profile.officialFypIdeas === src.officialFypIdeas, `Profile officialFypIdeas matches: "${profile?.officialFypIdeas}"`);
    assert(profile.sourceSite === src.sourceSite, `Profile sourceSite matches: "${profile?.sourceSite}"`);

    // Compare arrays
    assert(JSON.stringify(profile.emails) === JSON.stringify(src.emails), "Emails array matches verbatim");
    assert(JSON.stringify(profile.credentials) === JSON.stringify(src.credentials), "Credentials array matches verbatim");
    assert(JSON.stringify(profile.experience) === JSON.stringify(src.experience), `Experience array matches (${profile.experience.length} items)`);
    assert(JSON.stringify(profile.education) === JSON.stringify(src.education), `Education array matches (${profile.education.length} items)`);
    assert(JSON.stringify(profile.pillars) === JSON.stringify(academicSite.labPillars), `Lab Pillars matches (${profile.pillars.length} items)`);
    assert(JSON.stringify(profile.milestones) === JSON.stringify(academicSite.labMilestones), `Lab Milestones matches (${profile.milestones.length} items)`);
    assert(JSON.stringify(profile.impactStats) === JSON.stringify(academicSite.labImpactStats), `Lab Impact Stats matches (${profile.impactStats.length} items)`);
    assert(JSON.stringify(profile.partnerLogos) === JSON.stringify(academicSite.partnerLogos), `Partner Logos matches (${profile.partnerLogos.length} items)`);
  }

  // ==========================================================================
  // SECTION 2: RESEARCH DOMAINS FIDELITY (6 Domains)
  // ==========================================================================
  console.log("\n--- SECTION 2: Research Domains Fidelity (6 Domains) ---");
  {
    const srcDomains = academicSite.researchDomains;
    const dbDomains = await ResearchDomain.find().sort({ displayOrder: 1 }).lean();
    assert(dbDomains.length === srcDomains.length, `ResearchDomain count matches: ${dbDomains.length} === ${srcDomains.length}`);

    for (const src of srcDomains) {
      const dbDoc = dbDomains.find(d => d.slug === src.id || d.domainId === src.id || d.title === src.title);
      assert(!!dbDoc, `Found matching DB document for domain "${src.title}" (id: ${src.id})`);
      if (dbDoc) {
        assert(dbDoc.number === src.number, `Domain [${src.id}] number: "${dbDoc.number}" === "${src.number}"`);
        assert(dbDoc.graphicKey === src.graphicKey, `Domain [${src.id}] graphicKey: "${dbDoc.graphicKey}" === "${src.graphicKey}"`);
        assert(dbDoc.title === src.title, `Domain [${src.id}] title matches`);
        assert(dbDoc.description === src.description, `Domain [${src.id}] description matches`);
        assert(dbDoc.overview === src.overview, `Domain [${src.id}] overview matches`);
        assert(JSON.stringify(dbDoc.keyProblems) === JSON.stringify(src.keyProblems), `Domain [${src.id}] keyProblems matches (${dbDoc.keyProblems.length} items)`);
        assert(JSON.stringify(dbDoc.currentDirections) === JSON.stringify(src.currentDirections), `Domain [${src.id}] currentDirections matches (${dbDoc.currentDirections.length} items)`);
        assert(JSON.stringify(dbDoc.relatedLabWork) === JSON.stringify(src.relatedLabWork), `Domain [${src.id}] relatedLabWork matches`);
        assert(JSON.stringify(dbDoc.toolsAndDatasets) === JSON.stringify(src.toolsAndDatasets), `Domain [${src.id}] toolsAndDatasets matches`);
        assert(JSON.stringify(dbDoc.projectIdeas) === JSON.stringify(src.projectIdeas), `Domain [${src.id}] projectIdeas matches (${dbDoc.projectIdeas.length} items)`);
      }
    }
  }

  // ==========================================================================
  // SECTION 3: PUBLICATIONS FIDELITY (10 Publications)
  // ==========================================================================
  console.log("\n--- SECTION 3: Publications Fidelity (10 Records) ---");
  {
    const srcPubs = academicSite.publications;
    const dbPubs = await Publication.find().sort({ displayOrder: 1 }).lean();
    assert(dbPubs.length >= srcPubs.length, `Publications count in DB (${dbPubs.length}) covers static publications (${srcPubs.length})`);

    for (const src of srcPubs) {
      const dbDoc = dbPubs.find(p => p.title.trim().toLowerCase() === src.title.trim().toLowerCase());
      assert(!!dbDoc, `Found matching DB document for publication "${src.title.slice(0, 40)}..."`);
      if (dbDoc) {
        assert(String(dbDoc.year) === String(src.year), `Publication year matches: "${dbDoc.year}" === "${src.year}"`);
        assert(dbDoc.type === src.type, `Publication type matches: "${dbDoc.type}" === "${src.type}"`);
        assert(dbDoc.authors === src.authors, `Publication authors matches`);
        assert(dbDoc.venue === src.venue, `Publication venue matches`);
        assert((dbDoc.href || "") === (src.href || ""), `Publication href matches`);
        assert((dbDoc.bibtex || "") === (src.bibtex || ""), `Publication bibtex matches`);
      }
    }
  }

  // ==========================================================================
  // SECTION 4: RESEARCH PROJECTS IN models/Project (9 Records)
  // ==========================================================================
  console.log("\n--- SECTION 4: Research Projects in models/Project (9 Records) ---");
  {
    const srcProjects = academicSite.researchProjects;
    const dbProjects = await Project.find({ projectType: "Research" }).sort({ displayOrder: 1 }).lean();
    assert(dbProjects.length >= srcProjects.length, `Research Projects count in DB (${dbProjects.length}) covers static projects (${srcProjects.length})`);

    for (const src of srcProjects) {
      const dbDoc = dbProjects.find(p => p.title.trim().toLowerCase() === src.title.trim().toLowerCase());
      assert(!!dbDoc, `Found matching DB project for "${src.title.slice(0, 40)}..."`);
      if (dbDoc) {
        assert(dbDoc.summary === src.summary, `Project summary matches`);
        assert(dbDoc.status === src.status, `Project status matches: "${dbDoc.status}" === "${src.status}"`);
        assert(dbDoc.collaboration === src.collaboration, `Project collaboration matches: "${dbDoc.collaboration}" === "${src.collaboration}"`);
        assert((dbDoc.image || "") === (src.image || ""), `Project image matches: "${dbDoc.image}" === "${src.image}"`);
        assert(dbDoc.graphicKey === src.graphicKey, `Project graphicKey matches: "${dbDoc.graphicKey}" === "${src.graphicKey}"`);
        assert(dbDoc.details?.problem === src.details?.problem, `Project details.problem matches`);
        assert(dbDoc.details?.approach === src.details?.approach, `Project details.approach matches`);
        assert(dbDoc.details?.outcome === src.details?.outcome, `Project details.outcome matches`);
      }
    }
  }

  // ==========================================================================
  // SECTION 5: MEMBERS & PERSONNEL FIDELITY (29 Records across 5 categories)
  // ==========================================================================
  console.log("\n--- SECTION 5: Members & Personnel Fidelity (29 Records) ---");
  {
    // 5.1 Co-Investigators (6)
    const srcCI = academicSite.coInvestigators;
    const dbCI = await Member.find({ category: "co-investigator" }).lean();
    assert(dbCI.length === srcCI.length, `Co-Investigators count matches: ${dbCI.length} === ${srcCI.length}`);
    for (const src of srcCI) {
      const dbDoc = dbCI.find(m => m.name.trim().toLowerCase() === src.name.trim().toLowerCase());
      assert(!!dbDoc, `Co-Investigator found: "${src.name}"`);
      if (dbDoc) {
        assert(dbDoc.role === src.role, `CI role matches: "${dbDoc.role}" === "${src.role}"`);
        assert(dbDoc.affiliation === src.affiliation, `CI affiliation matches`);
        assert(dbDoc.specialization === src.specialization, `CI specialization matches`);
        assert(dbDoc.image === src.image, `CI image matches`);
        assert((dbDoc.email || "") === (src.email || ""), `CI email matches`);
        assert((dbDoc.googleScholar || "") === (src.googleScholar || ""), `CI googleScholar matches`);
        assert((dbDoc.orcid || "") === (src.orcid || ""), `CI orcid matches`);
        assert((dbDoc.researchGate || "") === (src.researchGate || ""), `CI researchGate matches`);
        assert((dbDoc.officialProfile || "") === (src.officialProfile || ""), `CI officialProfile matches`);
        assert((dbDoc.bio || "") === (src.bio || ""), `CI bio matches`);
        assert((dbDoc.badge || "") === (src.badge || ""), `CI badge matches`);
      }
    }

    // 5.2 PG Researchers (7)
    const srcPG = academicSite.pgResearchers;
    const dbPG = await Member.find({ category: "pg-researcher" }).lean();
    assert(dbPG.length === srcPG.length, `PG Researchers count matches: ${dbPG.length} === ${srcPG.length}`);
    for (const src of srcPG) {
      const dbDoc = dbPG.find(m => m.name.trim().toLowerCase() === src.name.trim().toLowerCase());
      assert(!!dbDoc, `PG Researcher found: "${src.name}"`);
      if (dbDoc) {
        assert(dbDoc.memberId === src.id, `PG memberId matches: "${dbDoc.memberId}" === "${src.id}"`);
        assert(dbDoc.degree === src.degree, `PG degree matches: "${dbDoc.degree}" === "${src.degree}"`);
        assert(dbDoc.topic === src.topic, `PG topic matches: "${dbDoc.topic}" === "${src.topic}"`);
        assert(dbDoc.focus === src.focus, `PG focus matches: "${dbDoc.focus}" === "${src.focus}"`);
        assert(dbDoc.status === src.status, `PG status matches: "${dbDoc.status}" === "${src.status}"`);
        assert(dbDoc.institution === src.institution, `PG institution matches`);
        assert(dbDoc.image === src.image, `PG image matches`);
      }
    }

    // 5.3 Collaborators (2)
    const srcCollab = academicSite.collaborators;
    const dbCollab = await Member.find({ category: "collaborator" }).lean();
    assert(dbCollab.length === srcCollab.length, `Collaborators count matches: ${dbCollab.length} === ${srcCollab.length}`);
    for (const src of srcCollab) {
      const dbDoc = dbCollab.find(m => m.name.trim().toLowerCase() === src.name.trim().toLowerCase());
      assert(!!dbDoc, `Collaborator found: "${src.name}"`);
      if (dbDoc) {
        assert(dbDoc.details === src.details, `Collaborator details matches`);
        assert((dbDoc.email || "") === (src.email || ""), `Collaborator email matches`);
        assert(dbDoc.image === src.image, `Collaborator image matches`);
      }
    }

    // 5.4 Supervised Theses (7)
    const srcSupervised = academicSite.supervisedProjects;
    const dbSupervised = await Member.find({ category: "supervised-project" }).lean();
    assert(dbSupervised.length === srcSupervised.length, `Supervised Theses count matches: ${dbSupervised.length} === ${srcSupervised.length}`);
    for (const src of srcSupervised) {
      const dbDoc = dbSupervised.find(m => m.name === src.student && m.term === src.term);
      assert(!!dbDoc, `Supervised student found: "${src.student}" (${src.term})`);
      if (dbDoc) {
        assert(dbDoc.term === src.term, `Supervised term matches: "${dbDoc.term}" === "${src.term}"`);
        assert(dbDoc.institution === src.institution, `Supervised institution matches: "${dbDoc.institution}"`);
        assert(dbDoc.projectTitle === src.title, `Supervised projectTitle matches: "${dbDoc.projectTitle}"`);
      }
    }

    // 5.5 Alumni Placements (7)
    const srcAlumni = academicSite.alumniPlacements;
    const dbAlumni = await Member.find({ category: "alumni" }).lean();
    assert(dbAlumni.length === srcAlumni.length, `Alumni Placements count matches: ${dbAlumni.length} === ${srcAlumni.length}`);
    for (const src of srcAlumni) {
      const dbDoc = dbAlumni.find(m => m.name === src.name && m.term === src.term);
      assert(!!dbDoc, `Alumnus found: "${src.name}" (${src.term})`);
      if (dbDoc) {
        assert(dbDoc.term === src.term, `Alumni term matches: "${dbDoc.term}" === "${src.term}"`);
        assert(dbDoc.organization === src.organization, `Alumni organization matches: "${dbDoc.organization}"`);
      }
    }
  }

  // ==========================================================================
  // SECTION 6: EVENT HIGHLIGHTS & GALLERY (4 Highlights + 2 Gallery = 6 Records)
  // ==========================================================================
  console.log("\n--- SECTION 6: Event Highlights & Gallery (6 Records) ---");
  {
    // 6.1 Highlights (4)
    const srcHighlights = academicSite.eventHighlights;
    const dbHighlights = await EventHighlight.find({ isGalleryItem: false }).lean();
    assert(dbHighlights.length === srcHighlights.length, `Event Highlights count matches: ${dbHighlights.length} === ${srcHighlights.length}`);
    for (const src of srcHighlights) {
      const dbDoc = dbHighlights.find(e => e.title.trim().toLowerCase() === src.title.trim().toLowerCase());
      assert(!!dbDoc, `Event Highlight found: "${src.title.slice(0, 40)}..."`);
      if (dbDoc) {
        assert(String(dbDoc.year) === String(src.year), `Event year matches: "${dbDoc.year}" === "${src.year}"`);
        assert(dbDoc.badge === src.badge, `Event badge matches: "${dbDoc.badge}" === "${src.badge}"`);
        assert((dbDoc.venue || "") === (src.venue || ""), `Event venue matches: "${dbDoc.venue}"`);
        assert((dbDoc.location || "") === (src.location || ""), `Event location matches: "${dbDoc.location}"`);
        assert(dbDoc.summary === src.summary, `Event summary matches`);
      }
    }

    // 6.2 Gallery items (2)
    const srcGallery = academicSite.eventGallery;
    const dbGallery = await EventHighlight.find({ isGalleryItem: true }).lean();
    assert(dbGallery.length === srcGallery.length, `Gallery Items count matches: ${dbGallery.length} === ${srcGallery.length}`);
    for (const src of srcGallery) {
      const dbDoc = dbGallery.find(g => (g.src || g.image) === src.src);
      assert(!!dbDoc, `Gallery item found for src "${src.src}"`);
      if (dbDoc) {
        assert(dbDoc.src === src.src, `Gallery src matches`);
        assert(dbDoc.alt === src.alt, `Gallery alt matches`);
        assert(dbDoc.caption === src.caption, `Gallery caption matches`);
        assert(dbDoc.badge === src.badge, `Gallery badge matches`);
        assert(dbDoc.category === src.category, `Gallery category matches`);
        assert(String(dbDoc.date) === String(src.date), `Gallery date matches`);
        assert(dbDoc.location === src.location, `Gallery location matches`);
        assert(dbDoc.orientation === src.orientation, `Gallery orientation matches`);
        assert(dbDoc.width === src.width, `Gallery width matches: ${dbDoc.width}`);
        assert(dbDoc.height === src.height, `Gallery height matches: ${dbDoc.height}`);
      }
    }
  }

  // ==========================================================================
  // SECTION 7: FYP PROJECTS FIDELITY (26 Records)
  // ==========================================================================
  console.log("\n--- SECTION 7: FYP Projects Fidelity (26 Records) ---");
  {
    const srcFyp = fypData.defaultFypProjects;
    const dbFyp = await FypProject.find().lean();
    assert(dbFyp.length >= srcFyp.length, `FYP Projects count in DB (${dbFyp.length}) covers static projects (${srcFyp.length})`);

    for (const src of srcFyp) {
      const dbDoc = dbFyp.find(f => f.slug === src.slug);
      assert(!!dbDoc, `FYP project found for slug "${src.slug}"`);
      if (dbDoc) {
        assert(dbDoc.title === src.title, `FYP [${src.slug}] title matches`);
        assert(dbDoc.summary === src.summary, `FYP [${src.slug}] summary matches`);
        assert(dbDoc.status === src.status, `FYP [${src.slug}] status matches: "${dbDoc.status}" === "${src.status}"`);
        assert(dbDoc.categoryType === src.categoryType, `FYP [${src.slug}] categoryType matches: "${dbDoc.categoryType}" === "${src.categoryType}"`);
        assert(dbDoc.projectType === src.projectType, `FYP [${src.slug}] projectType matches`);
        assert(dbDoc.nature === src.nature, `FYP [${src.slug}] nature matches`);
        assert(dbDoc.category === src.category, `FYP [${src.slug}] category matches`);
        assert(dbDoc.programme === src.programme, `FYP [${src.slug}] programme matches`);
        assert((dbDoc.session || "") === (src.session || ""), `FYP [${src.slug}] session matches`);
        assert(dbDoc.institution === src.institution, `FYP [${src.slug}] institution matches`);
        assert(dbDoc.supervisor === src.supervisor, `FYP [${src.slug}] supervisor matches`);
        assert((dbDoc.coSupervisor || "") === (src.coSupervisor || ""), `FYP [${src.slug}] coSupervisor matches`);
        assert(JSON.stringify(dbDoc.specializations || []) === JSON.stringify(src.specializations || []), `FYP [${src.slug}] specializations matches`);
        assert(JSON.stringify(dbDoc.sdgs || []) === JSON.stringify(src.sdgs || []), `FYP [${src.slug}] sdgs matches`);
        assert(JSON.stringify(dbDoc.technologies || []) === JSON.stringify(src.technologies || []), `FYP [${src.slug}] technologies matches`);
        assert((dbDoc.problem || "") === (src.problem || ""), `FYP [${src.slug}] problem matches`);
        assert((dbDoc.solution || "") === (src.solution || ""), `FYP [${src.slug}] solution matches`);
        assert(JSON.stringify(dbDoc.objectives || []) === JSON.stringify(src.objectives || []), `FYP [${src.slug}] objectives matches`);
        assert(JSON.stringify(dbDoc.features || []) === JSON.stringify(src.features || []), `FYP [${src.slug}] features matches`);
        assert(JSON.stringify(dbDoc.contributions || []) === JSON.stringify(src.contributions || []), `FYP [${src.slug}] contributions matches`);
        assert((dbDoc.outcome || "") === (src.outcome || ""), `FYP [${src.slug}] outcome matches`);
        assert(JSON.stringify(dbDoc.limitations || []) === JSON.stringify(src.limitations || []), `FYP [${src.slug}] limitations matches`);
        assert(JSON.stringify(dbDoc.futureWork || []) === JSON.stringify(src.futureWork || []), `FYP [${src.slug}] futureWork matches`);
        assert((dbDoc.prerequisites || "") === (src.prerequisites || ""), `FYP [${src.slug}] prerequisites matches`);
        assert(JSON.stringify(dbDoc.expectedDeliverables || []) === JSON.stringify(src.expectedDeliverables || []), `FYP [${src.slug}] expectedDeliverables matches`);
        assert(Boolean(dbDoc.isRunning) === Boolean(src.isRunning), `FYP [${src.slug}] isRunning matches`);
        assert(Boolean(dbDoc.isOpportunity) === Boolean(src.isOpportunity), `FYP [${src.slug}] isOpportunity matches`);
        assert((dbDoc.coverImage || "") === (src.coverImage || ""), `FYP [${src.slug}] coverImage matches`);
        assert((dbDoc.coverAlt || "") === (src.coverAlt || ""), `FYP [${src.slug}] coverAlt matches`);
        assert((dbDoc.liveUrl || "") === (src.liveUrl || ""), `FYP [${src.slug}] liveUrl matches`);
        assert((dbDoc.repositoryUrl || "") === (src.repositoryUrl || ""), `FYP [${src.slug}] repositoryUrl matches`);

        // Check students array
        assert((dbDoc.students || []).length === (src.students || []).length, `FYP [${src.slug}] students count matches`);
        for (let i = 0; i < (dbDoc.students || []).length; i++) {
          assert(dbDoc.students[i].name === src.students[i].name, `Student ${i} name matches: "${dbDoc.students[i].name}"`);
          assert((dbDoc.students[i].registration || "") === (src.students[i].registration || ""), `Student ${i} registration matches`);
          assert((dbDoc.students[i].profileUrl || "") === (src.students[i].profileUrl || ""), `Student ${i} profileUrl matches`);
        }
      }
    }
  }

  // ==========================================================================
  // SECTION 8: ADVERSARIAL STRESS TESTING (adminModified, Idempotency, Collisions)
  // ==========================================================================
  console.log("\n--- SECTION 8: Adversarial Stress Testing ---");
  {
    // Test 8.1: Idempotent re-run safety
    console.log("  Testing Seeding Idempotency & Admin Protection...");
    
    // Pick a test document from Publication
    const testPub = await Publication.findOne({ slug: "an-advanced-ensemble-framework-for-defending-against-obfuscated-windows-android-and-iot-malware" });
    assert(!!testPub, "Target publication for adminModified test found");
    
    if (testPub) {
      const originalTitle = testPub.title;
      const modifiedTitle = originalTitle + " [ADMIN MODIFIED TEST]";

      // Simulate Admin CMS edit with adminModified = true
      await Publication.updateOne({ _id: testPub._id }, { $set: { title: modifiedTitle, adminModified: true } });
      
      // Verify update was applied in DB
      const checkModified = await Publication.findById(testPub._id);
      assert(checkModified.title === modifiedTitle && checkModified.adminModified === true, "Admin edit simulated in database");

      // Execute Seeder
      const { execSync } = await import("child_process");
      try {
        execSync("node scripts/seed-all-data.js", { stdio: "pipe" });
        assert(true, "seed-all-data.js executed successfully without throwing");
      } catch (err) {
        assert(false, `seed-all-data.js threw error: ${err.message}`);
      }

      // Verify document was NOT overwritten because adminModified === true
      const postSeedDoc = await Publication.findById(testPub._id);
      assert(postSeedDoc.title === modifiedTitle, `adminModified protection verified: "${postSeedDoc.title}" preserved`);

      // Reset document back to original
      await Publication.updateOne({ _id: testPub._id }, { $set: { title: originalTitle, adminModified: false } });
      const resetDoc = await Publication.findById(testPub._id);
      assert(resetDoc.title === originalTitle && resetDoc.adminModified === false, "Test publication restored to original seed state");
    }
  }

  console.log("\n================================================================================");
  console.log(`AUDIT COMPLETE: ${auditReport.checksPassed} checks passed, ${auditReport.checksFailed} failed.`);
  console.log("================================================================================\n");

  if (auditReport.checksFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runDeepAudit().catch(err => {
  console.error("Fatal audit error:", err);
  process.exit(1);
});
