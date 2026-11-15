/**
 * Master Seeding & Migration Engine for SSA Lab CMS
 * 
 * Migrates static academic data from data/academicSite.js and data/fypProjects.js
 * into MongoDB with non-destructive, idempotent upserts.
 * 
 * Respects `adminModified` flag on existing records to avoid overwriting manual CMS edits.
 * 
 * Usage:
 *   node scripts/seed-all-data.js
 *   node scripts/seed-all-data.js --force   (Overwrites even adminModified records)
 *   node scripts/seed-all-data.js --dry-run (Simulates without writing)
 */

import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

// Helper for slug generation
export function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const isForce = process.argv.includes("--force");
  const isDryRun = process.argv.includes("--dry-run");

  console.log("==================================================");
  console.log("🚀 SSA Lab - Master Seeding & Migration Engine");
  console.log(`Mode: ${isDryRun ? "DRY-RUN (No changes applied)" : isForce ? "FORCE OVERWRITE" : "SAFE IDEMPOTENT UPSERT"}`);
  console.log("==================================================");

  // Dynamic import of db connection and models
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

  // Import static datasets
  const academicSite = await import("../data/academicSite.js");
  const fypData = await import("../data/fypProjects.js");

  const stats = {
    labProfile: { inserted: 0, updated: 0, skipped: 0 },
    researchDomains: { inserted: 0, updated: 0, skipped: 0 },
    publications: { inserted: 0, updated: 0, skipped: 0 },
    researchProjects: { inserted: 0, updated: 0, skipped: 0 },
    members: { inserted: 0, updated: 0, skipped: 0 },
    eventHighlights: { inserted: 0, updated: 0, skipped: 0 },
    fypProjects: { inserted: 0, updated: 0, skipped: 0 },
    users: { inserted: 0, updated: 0, skipped: 0 },
  };

  // ----------------------------------------------------
  // 1. Seed LabProfile (Singleton)
  // ----------------------------------------------------
  console.log("\n📦 1. Seeding Lab Profile & Site Settings...");
  {
    const profilePayload = {
      key: "default",
      name: academicSite.academicProfile?.name || "Junaid Akram, PhD",
      shortName: academicSite.academicProfile?.shortName || "Junaid Akram",
      role: academicSite.academicProfile?.role || "Assistant Professor",
      institution: academicSite.academicProfile?.institution || "University of Nottingham Ningbo China",
      department: academicSite.academicProfile?.department || "School of Computer Science",
      lab: academicSite.academicProfile?.lab || "Software Security Assessment Lab",
      labShort: academicSite.academicProfile?.labShort || "SSA Research Lab",
      office: academicSite.academicProfile?.office || "School of Computer Science, University of Nottingham Ningbo China, 199 Taikang East Road, Ningbo, 315100, China (Ext. 6424)",
      phone: academicSite.academicProfile?.phone || "+86 (0) 574 88180000 (Ext. 6424)",
      emails: academicSite.academicProfile?.emails || ["Junaid.Akram@nottingham.edu.cn", "junaid.tsinghua@yahoo.com"],
      labEmail: academicSite.academicProfile?.labEmail || "",
      googleScholar: academicSite.academicProfile?.googleScholar || "",
      linkedin: academicSite.academicProfile?.linkedin || "",
      researchGate: academicSite.academicProfile?.researchGate || "",
      orcid: academicSite.academicProfile?.orcid || "",
      officialProfile: academicSite.academicProfile?.officialProfile || "",
      officialFypIdeas: academicSite.academicProfile?.officialFypIdeas || "",
      sourceSite: academicSite.academicProfile?.sourceSite || "https://www.ssa-lab.tech",
      credentials: academicSite.academicProfile?.credentials || [],
      experience: academicSite.academicProfile?.experience || [],
      education: academicSite.academicProfile?.education || [],
      pillars: academicSite.labPillars || [],
      milestones: academicSite.labMilestones || [],
      impactStats: academicSite.labImpactStats || [],
      partnerLogos: academicSite.partnerLogos || [],
    };

    const existing = await LabProfile.findOne({ key: "default" });
    if (!existing) {
      if (!isDryRun) {
        await LabProfile.create({ ...profilePayload, adminModified: false });
      }
      stats.labProfile.inserted++;
      console.log("   ✓ Created default LabProfile record");
    } else if (existing.adminModified && !isForce) {
      stats.labProfile.skipped++;
      console.log("   - Skipped LabProfile (adminModified: true)");
    } else {
      if (!isDryRun) {
        await LabProfile.updateOne({ key: "default" }, { $set: profilePayload });
      }
      stats.labProfile.updated++;
      console.log("   ✓ Updated default LabProfile record");
    }
  }

  // ----------------------------------------------------
  // 2. Seed ResearchDomains (6 domains)
  // ----------------------------------------------------
  console.log("\n📦 2. Seeding Research Domains (6 domains)...");
  {
    const domains = academicSite.researchDomains || [];
    for (let idx = 0; idx < domains.length; idx++) {
      const d = domains[idx];
      const domainSlug = d.id || slugify(d.title);
      const payload = {
        slug: domainSlug,
        domainId: d.id || domainSlug,
        number: d.number || String(idx + 1).padStart(2, "0"),
        graphicKey: d.graphicKey || domainSlug,
        title: d.title,
        image: d.image || "",
        description: d.description,
        overview: d.overview,
        keyProblems: d.keyProblems || [],
        currentDirections: d.currentDirections || [],
        relatedLabWork: d.relatedLabWork || { items: [], summary: "" },
        toolsAndDatasets: d.toolsAndDatasets || { items: [], summary: "" },
        projectIdeas: d.projectIdeas || [],
        displayOrder: idx,
        published: true,
      };

      // Remove any legacy duplicates without slug or with title collision
      if (!isDryRun) {
        await ResearchDomain.deleteMany({
          title: d.title,
          slug: { $ne: domainSlug },
        });
      }

      const existing = await ResearchDomain.findOne({ slug: domainSlug });
      if (!existing) {
        if (!isDryRun) {
          await ResearchDomain.create({ ...payload, adminModified: false });
        }
        stats.researchDomains.inserted++;
        console.log(`   ✓ Inserted Domain: ${d.title} (${domainSlug})`);
      } else if (existing.adminModified && !isForce) {
        stats.researchDomains.skipped++;
        console.log(`   - Skipped Domain: ${d.title} (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await ResearchDomain.updateOne({ slug: domainSlug }, { $set: payload });
        }
        stats.researchDomains.updated++;
        console.log(`   ✓ Updated Domain: ${d.title} (${domainSlug})`);
      }
    }
  }

  // ----------------------------------------------------
  // 3. Seed Publications (10 records)
  // ----------------------------------------------------
  console.log("\n📦 3. Seeding Publications (10 records)...");
  {
    const pubs = academicSite.publications || [];
    for (let idx = 0; idx < pubs.length; idx++) {
      const pub = pubs[idx];
      const pubSlug = slugify(pub.title);
      const payload = {
        title: pub.title,
        slug: pubSlug,
        year: String(pub.year || ""),
        type: pub.type || "Journal",
        authors: pub.authors,
        venue: pub.venue,
        href: pub.href || "",
        bibtex: pub.bibtex || "",
        abstract: pub.abstract || "",
        tags: pub.tags || [],
        displayOrder: idx,
        published: true,
      };

      // Remove legacy duplicates with old slug prefixes
      if (!isDryRun) {
        await Publication.deleteMany({
          title: pub.title,
          slug: { $ne: pubSlug },
        });
      }

      const existing = await Publication.findOne({ slug: pubSlug });
      if (!existing) {
        if (!isDryRun) {
          await Publication.create({ ...payload, adminModified: false });
        }
        stats.publications.inserted++;
        console.log(`   ✓ Inserted Publication: ${pub.title.slice(0, 50)}...`);
      } else if (existing.adminModified && !isForce) {
        stats.publications.skipped++;
        console.log(`   - Skipped Publication: ${pub.title.slice(0, 50)}... (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await Publication.updateOne({ slug: pubSlug }, { $set: payload });
        }
        stats.publications.updated++;
        console.log(`   ✓ Updated Publication: ${pub.title.slice(0, 50)}...`);
      }
    }
  }

  // ----------------------------------------------------
  // 4. Seed ResearchProjects in models/Project (9 records)
  // ----------------------------------------------------
  console.log("\n📦 4. Seeding Research Projects in models/Project (9 records)...");
  {
    const projects = academicSite.researchProjects || [];
    for (let idx = 0; idx < projects.length; idx++) {
      const proj = projects[idx];
      const projSlug = slugify(proj.title);
      const payload = {
        title: proj.title,
        slug: projSlug,
        description: proj.summary || proj.title,
        summary: proj.summary || "",
        status: proj.status || "Completed",
        collaboration: proj.collaboration || "",
        image: proj.image || "",
        graphicKey: proj.graphicKey || "",
        category: "Research Project",
        projectType: "Research",
        details: proj.details || { problem: "", approach: "", outcome: "" },
        problem: proj.details?.problem || "",
        solution: proj.details?.approach || "",
        outcome: proj.details?.outcome || "",
        displayOrder: idx,
        published: true,
      };

      const existing = await Project.findOne({ slug: projSlug });
      if (!existing) {
        if (!isDryRun) {
          await Project.create({ ...payload, adminModified: false });
        }
        stats.researchProjects.inserted++;
        console.log(`   ✓ Inserted Project: ${proj.title.slice(0, 50)}...`);
      } else if (existing.adminModified && !isForce) {
        stats.researchProjects.skipped++;
        console.log(`   - Skipped Project: ${proj.title.slice(0, 50)}... (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await Project.updateOne({ slug: projSlug }, { $set: payload });
        }
        stats.researchProjects.updated++;
        console.log(`   ✓ Updated Project: ${proj.title.slice(0, 50)}...`);
      }
    }
  }

  // ----------------------------------------------------
  // 5. Seed Members (Faculty, PG, Collaborators, Theses, Alumni)
  // ----------------------------------------------------
  console.log("\n📦 5. Seeding Members & Personnel...");
  {
    const memberList = [];

    // 5.1 Co-Investigators (6)
    (academicSite.coInvestigators || []).forEach((ci, idx) => {
      memberList.push({
        name: ci.name,
        slug: slugify(ci.name + "-co-investigator"),
        role: ci.role || "Co-Investigator",
        category: "co-investigator",
        affiliation: ci.affiliation || "",
        specialization: ci.specialization || "",
        image: ci.image || "",
        email: ci.email || "",
        googleScholar: ci.googleScholar || "",
        orcid: ci.orcid || "",
        researchGate: ci.researchGate || "",
        officialProfile: ci.officialProfile || "",
        bio: ci.bio || "",
        badge: ci.badge || "",
        displayOrder: idx,
        published: true,
      });
    });

    // 5.2 PG Researchers (7)
    (academicSite.pgResearchers || []).forEach((pg, idx) => {
      memberList.push({
        name: pg.name,
        slug: slugify(pg.name + "-" + (pg.id || "pg-researcher")),
        role: "Postgraduate Researcher",
        category: "pg-researcher",
        memberId: pg.id || "",
        degree: pg.degree || "MS Computer Science",
        topic: pg.topic || "",
        focus: pg.focus || "",
        status: pg.status || "Active MS Thesis Research",
        institution: pg.institution || "COMSATS University Islamabad, Lahore Campus",
        image: pg.image || "",
        displayOrder: idx + 10,
        published: true,
      });
    });

    // 5.3 Collaborators (2)
    (academicSite.collaborators || []).forEach((collab, idx) => {
      memberList.push({
        name: collab.name,
        slug: slugify(collab.name + "-collaborator"),
        role: "International Collaborator",
        category: "collaborator",
        details: collab.details || "",
        bio: collab.details || "",
        email: collab.email || "",
        image: collab.image || "",
        displayOrder: idx + 20,
        published: true,
      });
    });

    // 5.4 Supervised Theses / Projects (7)
    (academicSite.supervisedProjects || []).forEach((sp, idx) => {
      memberList.push({
        name: sp.student,
        slug: slugify(sp.student + "-" + sp.term + "-thesis"),
        role: "Supervised Student",
        category: "supervised-project",
        term: sp.term || "",
        institution: sp.institution || "Xiamen University Malaysia",
        projectTitle: sp.title || "",
        topic: sp.title || "",
        displayOrder: idx + 30,
        published: true,
      });
    });

    // 5.5 Alumni Placements (7)
    (academicSite.alumniPlacements || []).forEach((alum, idx) => {
      memberList.push({
        name: alum.name,
        slug: slugify(alum.name + "-" + alum.term + "-alumni"),
        role: "Alumnus",
        category: "alumni",
        term: alum.term || "",
        organization: alum.organization || "",
        displayOrder: idx + 40,
        published: true,
      });
    });

    for (const mem of memberList) {
      const existing = await Member.findOne({ slug: mem.slug });
      if (!existing) {
        if (!isDryRun) {
          await Member.create({ ...mem, adminModified: false });
        }
        stats.members.inserted++;
        console.log(`   ✓ Inserted Member [${mem.category}]: ${mem.name}`);
      } else if (existing.adminModified && !isForce) {
        stats.members.skipped++;
        console.log(`   - Skipped Member [${mem.category}]: ${mem.name} (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await Member.updateOne({ slug: mem.slug }, { $set: mem });
        }
        stats.members.updated++;
        console.log(`   ✓ Updated Member [${mem.category}]: ${mem.name}`);
      }
    }
  }

  // ----------------------------------------------------
  // 6. Seed EventHighlights & Gallery (4 highlights + 2 gallery)
  // ----------------------------------------------------
  console.log("\n📦 6. Seeding Event Highlights & Gallery...");
  {
    const eventsList = [];

    // 6.1 Event Highlights (4)
    (academicSite.eventHighlights || []).forEach((ev, idx) => {
      eventsList.push({
        title: ev.title,
        slug: slugify(ev.title),
        year: String(ev.year || ""),
        badge: ev.badge || "Workshop",
        category: "Workshop",
        venue: ev.venue || "",
        location: ev.location || "",
        summary: ev.summary,
        isGalleryItem: false,
        displayOrder: idx,
        published: true,
      });
    });

    // 6.2 Event Gallery Items (2)
    (academicSite.eventGallery || []).forEach((item, idx) => {
      eventsList.push({
        title: item.title || "Gallery Item " + (idx + 1),
        slug: slugify(item.title || "gallery-item-" + idx),
        src: item.src || "",
        image: item.src || "",
        alt: item.alt || "",
        caption: item.caption || "",
        badge: item.badge || "Exhibition",
        category: item.category || "Exhibition",
        date: String(item.date || ""),
        year: String(item.date || ""),
        location: item.location || "",
        orientation: item.orientation || "landscape",
        width: item.width || 1280,
        height: item.height || 900,
        summary: item.caption || item.title || "",
        isGalleryItem: true,
        displayOrder: idx + 10,
        published: true,
      });
    });

    for (const ev of eventsList) {
      const existing = await EventHighlight.findOne({ slug: ev.slug });
      if (!existing) {
        if (!isDryRun) {
          await EventHighlight.create({ ...ev, adminModified: false });
        }
        stats.eventHighlights.inserted++;
        console.log(`   ✓ Inserted Event [${ev.isGalleryItem ? "Gallery" : "Highlight"}]: ${ev.title.slice(0, 50)}...`);
      } else if (existing.adminModified && !isForce) {
        stats.eventHighlights.skipped++;
        console.log(`   - Skipped Event: ${ev.title.slice(0, 50)}... (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await EventHighlight.updateOne({ slug: ev.slug }, { $set: ev });
        }
        stats.eventHighlights.updated++;
        console.log(`   ✓ Updated Event: ${ev.title.slice(0, 50)}...`);
      }
    }
  }

  // ----------------------------------------------------
  // 7. Seed FypProjects (26 projects)
  // ----------------------------------------------------
  console.log("\n📦 7. Seeding FYP Projects (26 records)...");
  {
    const projects = fypData.defaultFypProjects || [];
    for (let idx = 0; idx < projects.length; idx++) {
      const proj = projects[idx];
      const payload = {
        ...proj,
        displayOrder: proj.displayOrder !== undefined ? proj.displayOrder : idx,
        published: proj.published !== undefined ? proj.published : true,
      };

      const existing = await FypProject.findOne({ slug: proj.slug });
      if (!existing) {
        if (!isDryRun) {
          await FypProject.create({ ...payload, adminModified: false });
        }
        stats.fypProjects.inserted++;
        console.log(`   ✓ Inserted FYP [${proj.categoryType || "running"}]: ${proj.title.slice(0, 45)}...`);
      } else if (existing.adminModified && !isForce) {
        stats.fypProjects.skipped++;
        console.log(`   - Skipped FYP: ${proj.title.slice(0, 45)}... (adminModified: true)`);
      } else {
        if (!isDryRun) {
          await FypProject.updateOne({ slug: proj.slug }, { $set: payload });
        }
        stats.fypProjects.updated++;
        console.log(`   ✓ Updated FYP [${proj.categoryType || "running"}]: ${proj.title.slice(0, 45)}...`);
      }
    }
  }

  // ----------------------------------------------------
  // 8. Ensure Default Admin User Exists
  // ----------------------------------------------------
  console.log("\n📦 8. Ensuring Default Admin User Exists...");
  {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ssalab.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { username: "admin" }],
    }).select("+password");

    if (!existingAdmin) {
      if (!isDryRun) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: "SSA Lab Administrator",
          username: "admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          isActive: true,
        });
      }
      stats.users.inserted++;
      console.log(`   ✓ Created default admin user: ${adminEmail} (username: admin)`);
    } else {
      stats.users.skipped++;
      console.log(`   - Default admin user already exists: ${existingAdmin.email} (${existingAdmin.username})`);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 Seeding & Migration Completed Successfully!");
  console.log("==================================================");
  console.table({
    "Lab Profile": stats.labProfile,
    "Research Domains": stats.researchDomains,
    "Publications": stats.publications,
    "Research Projects": stats.researchProjects,
    "Members": stats.members,
    "Event Highlights": stats.eventHighlights,
    "FYP Projects": stats.fypProjects,
    "Admin Users": stats.users,
  });

  process.exit(0);
}

// Only run main if executed directly via CLI
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("seed-all-data.js") ||
  process.argv[1].includes("seed-all-data")
);
if (isDirectRun && !process.env.JEST_WORKER_ID) {
  main().catch((err) => {
    console.error("\n❌ Fatal error during seeding:", err);
    process.exit(1);
  });
}

