import {
  labProfileSchema,
  publicationSchema,
  memberSchema,
  researchDomainSchema,
  eventHighlightSchema,
  fypProjectSchema,
  projectSchema,
} from "../lib/validation/schemas";
import { slugify } from "../lib/slugify.js";

describe("Milestone 1 Models & Schemas Validation Suite", () => {
  // 1. Lab Profile Schema
  describe("labProfileSchema", () => {
    test("validates lab profile with pillars, milestones, and stats", () => {
      const payload = {
        name: "Dr. Junaid Akram",
        shortName: "Junaid Akram",
        role: "Assistant Professor",
        institution: "COMSATS University Islamabad",
        lab: "Software Security Assessment Lab",
        emails: ["junaid@example.com"],
        credentials: ["PhD Tsinghua University", "Postdoc SnT Luxembourg"],
        pillars: [
          { id: "vulnerability", title: "Vulnerability Detection", desc: "Automated vulnerability finding" },
        ],
        milestones: [
          { year: "2021-2023", era: "Phase 2", title: "Postdoctoral Research", summary: "SnT Luxembourg research" },
        ],
        impactStats: [{ label: "Citations", value: "500+" }],
      };

      const parsed = labProfileSchema.parse(payload);
      expect(parsed.name).toBe("Dr. Junaid Akram");
      expect(parsed.pillars.length).toBe(1);
      expect(parsed.milestones.length).toBe(1);
      expect(parsed.impactStats.length).toBe(1);
    });
  });

  // 2. Publication Schema
  describe("publicationSchema", () => {
    test("validates Journal and Conference publications", () => {
      const payload = {
        title: "An Advanced Ensemble Framework for Defending Against Obfuscated Malware",
        year: "2025",
        type: "Journal",
        authors: "Danish Vasan, Junaid Akram, et al.",
        venue: "Applied Soft Computing (Elsevier)",
        href: "https://doi.org/10.1016/j.asoc.2025.112845",
        bibtex: "@article{vasan2025advanced, ...}",
      };

      const parsed = publicationSchema.parse(payload);
      expect(parsed.title).toBe(payload.title);
      expect(parsed.type).toBe("Journal");
      expect(parsed.year).toBe("2025");
      expect(parsed.published).toBe(true);
    });
  });

  // 3. Member Schema
  describe("memberSchema", () => {
    test("validates Co-Investigator member", () => {
      const ci = {
        name: "Dr. Danish Vasan",
        category: "co-investigator",
        role: "Senior Co-Investigator",
        affiliation: "KFUPM / SnT Luxembourg",
        specialization: "Malware Detection",
        email: "danish@example.com",
      };
      const parsed = memberSchema.parse(ci);
      expect(parsed.name).toBe("Dr. Danish Vasan");
      expect(parsed.category).toBe("co-investigator");
    });

    test("validates PG Researcher member", () => {
      const pg = {
        name: "Mahzaib Mukhtar",
        category: "pg-researcher",
        memberId: "FA23-RCS-005",
        degree: "MS Computer Science",
        topic: "Automated Search Based Test Data Generation",
      };
      const parsed = memberSchema.parse(pg);
      expect(parsed.name).toBe("Mahzaib Mukhtar");
      expect(parsed.category).toBe("pg-researcher");
      expect(parsed.memberId).toBe("FA23-RCS-005");
    });

    test("validates Alumni placement member", () => {
      const alum = {
        name: "Mak Sue Sun",
        category: "alumni",
        term: "Fall 2020",
        organization: "Ernst & Young",
      };
      const parsed = memberSchema.parse(alum);
      expect(parsed.name).toBe("Mak Sue Sun");
      expect(parsed.category).toBe("alumni");
      expect(parsed.organization).toBe("Ernst & Young");
    });
  });

  // 4. Research Domain Schema
  describe("researchDomainSchema", () => {
    test("validates domain with key problems and directions", () => {
      const domain = {
        title: "Cyber Security",
        number: "01",
        description: "Source-level assessment methods for identifying vulnerabilities.",
        keyProblems: ["Injection vulnerabilities", "Authentication bypass"],
        currentDirections: ["AI-assisted remediation", "Secure-by-design"],
        toolsAndDatasets: {
          items: [{ name: "SQVDT", url: "https://example.com/sqvdt" }],
          summary: "Open source security datasets",
        },
      };
      const parsed = researchDomainSchema.parse(domain);
      expect(parsed.title).toBe("Cyber Security");
      expect(parsed.keyProblems.length).toBe(2);
      expect(parsed.toolsAndDatasets.items.length).toBe(1);
    });
  });

  // 5. Event Highlight Schema
  describe("eventHighlightSchema", () => {
    test("validates event highlight and gallery items", () => {
      const event = {
        title: "IPBG Annual Workshop — SnT, Luxembourg",
        year: "2022",
        category: "Workshop",
        badge: "Keynote Presentation",
        venue: "SnT Luxembourg",
        summary: "Presented research paper on test data generation.",
      };
      const parsed = eventHighlightSchema.parse(event);
      expect(parsed.title).toBe(event.title);
      expect(parsed.category).toBe("Workshop");
      expect(parsed.isGalleryItem).toBe(false);
    });

    test("validates gallery item", () => {
      const galleryItem = {
        title: "Poster Session at SnT",
        summary: "Interactive poster session",
        src: "/academic/events/event-02.jpg",
        orientation: "portrait",
        isGalleryItem: true,
      };
      const parsed = eventHighlightSchema.parse(galleryItem);
      expect(parsed.isGalleryItem).toBe(true);
      expect(parsed.orientation).toBe("portrait");
    });
  });

  // 6. FYP Project Schema Enums & Deliverables
  describe("fypProjectSchema enhanced fields", () => {
    test("supports Running, Completed, and Available for Supervision statuses", () => {
      const running = fypProjectSchema.parse({
        title: "Running FYP Project",
        summary: "Summary of running project exceeding ten chars.",
        status: "Running",
        categoryType: "running",
        isRunning: true,
      });
      expect(running.status).toBe("Running");
      expect(running.categoryType).toBe("running");

      const available = fypProjectSchema.parse({
        title: "Open Supervision Idea",
        summary: "Summary of supervision opportunity idea.",
        status: "Available for Supervision",
        categoryType: "future",
        isOpportunity: true,
        prerequisites: "Strong C++ and Python skills",
        expectedDeliverables: ["Benchmark dataset", "Research paper draft"],
      });
      expect(available.status).toBe("Available for Supervision");
      expect(available.isOpportunity).toBe(true);
      expect(available.expectedDeliverables.length).toBe(2);
    });
  });

  // 7. Slugify Utility
  describe("slugify utility", () => {
    test("correctly normalizes strings into URL slugs", () => {
      expect(slugify("Cyber Security & Vulnerability Defense")).toBe("cyber-security-vulnerability-defense");
      expect(slugify("Dr. Junaid Akram, PhD")).toBe("dr-junaid-akram-phd");
      expect(slugify("IPBG Annual Workshop — SnT, Luxembourg (2022)")).toBe("ipbg-annual-workshop-snt-luxembourg-2022");
    });
  });
});
