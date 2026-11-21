// test/m2_endpoints.test.js
import {
  publicationSchema,
  memberSchema,
  researchDomainSchema,
  eventHighlightSchema,
  labProfileSchema,
  reorderSchema,
} from "../lib/validation/schemas";
import { validate } from "../lib/validation/validator";

describe("Milestone 2 API Validations & Endpoint Unit Tests", () => {
  describe("Publication Schema & Validation Middleware", () => {
    test("validates valid publication payload", () => {
      const payload = {
        title: "Deep Learning for Android Malware Detection",
        year: "2024",
        type: "Journal",
        authors: "Junaid Akram, Danish Vasan",
        venue: "IEEE Transactions on Information Forensics and Security",
        href: "https://doi.org/10.1109/TIFS.2024.123456",
        bibtex: "@article{akram2024deep, ...}",
        tags: ["Malware", "Android", "Deep Learning"],
        published: true,
      };

      const parsed = publicationSchema.parse(payload);
      expect(parsed.title).toBe(payload.title);
      expect(parsed.year).toBe("2024");
      expect(parsed.tags.length).toBe(3);
    });

    test("fails when required publication fields are missing", () => {
      expect(() => publicationSchema.parse({ title: "Incomplete" })).toThrow();
    });

    test("validation middleware intercepts invalid body", async () => {
      const mockReq = {
        method: "POST",
        body: { title: "No" }, // title too short, missing fields
      };
      let status = 200;
      let jsonResponse = null;
      const mockRes = {
        status: (code) => {
          status = code;
          return {
            json: (data) => {
              jsonResponse = data;
              return data;
            },
          };
        },
      };

      const dummyHandler = jest.fn();
      const wrapped = validate(publicationSchema)(dummyHandler);
      await wrapped(mockReq, mockRes);

      expect(status).toBe(400);
      expect(jsonResponse.success).toBe(false);
      expect(dummyHandler).not.toHaveBeenCalled();
    });
  });

  describe("Harmonized Team Member Category Validation", () => {
    test("accepts both hyphenated and underscore category representations", () => {
      const categories = [
        "junior-collaborator",
        "junior_collaborator",
        "junior-researcher",
        "junior_researcher",
        "pg-researcher",
        "pg_researcher",
        "co-investigator",
        "co_investigator",
        "alumni",
        "alumnus",
        "collaborator",
        "faculty",
        "supervised-project",
        "core-team",
      ];

      for (const category of categories) {
        const parsed = memberSchema.parse({
          name: "Test Member",
          category,
          role: "Researcher",
        });
        expect(parsed.category).toBe(category);
      }
    });

    test("rejects unknown category strings", () => {
      expect(() =>
        memberSchema.parse({
          name: "Test Member",
          category: "unsupported_category_name",
        })
      ).toThrow();
    });
  });

  describe("Research Domain & Lab Profile Schemas", () => {
    test("validates research domain with nested tools, datasets and case studies", () => {
      const payload = {
        title: "Software Security & Vulnerability Analysis",
        description: "Focuses on static and dynamic vulnerability analysis.",
        number: "01",
        keyProblems: ["Buffer overflows", "Memory safety"],
        toolsAndDatasets: {
          items: [{ name: "LLVM Sanitizer", url: "https://llvm.org" }],
          summary: "Compiler-based dynamic analysis tools",
        },
        caseStudies: [
          {
            title: "Memory Safety in Embedded Systems",
            context: "Automotive firmware",
            challenge: "Pointer corruption",
            solution: "Automated type sanitizer",
            impact: "Zero fatal crashes",
          },
        ],
      };

      const parsed = researchDomainSchema.parse(payload);
      expect(parsed.title).toBe(payload.title);
      expect(parsed.toolsAndDatasets.items[0].name).toBe("LLVM Sanitizer");
      expect(parsed.caseStudies.length).toBe(1);
    });

    test("validates lab profile schema with milestones and impact stats", () => {
      const profile = {
        name: "Dr. Junaid Akram",
        shortName: "J. Akram",
        lab: "Software Security Assessment (SSA) Lab",
        milestones: [
          {
            year: "2024",
            era: "Current",
            title: "Lab Launch",
            summary: "Formal establishment of the SSA research group",
          },
        ],
        impactStats: [
          { label: "Publications", value: "30+" },
          { label: "Citations", value: "500+" },
        ],
      };

      const parsed = labProfileSchema.parse(profile);
      expect(parsed.name).toBe("Dr. Junaid Akram");
      expect(parsed.milestones.length).toBe(1);
      expect(parsed.impactStats.length).toBe(2);
    });
  });

  describe("Event Highlight & Reorder Schema", () => {
    test("validates event highlight and photo gallery", () => {
      const event = {
        title: "International Symposium on Software Security",
        summary: "Keynote presentation on automated vulnerability remediation.",
        category: "Conference",
        year: "2024",
        isGalleryItem: false,
      };

      const parsed = eventHighlightSchema.parse(event);
      expect(parsed.title).toBe(event.title);
      expect(parsed.category).toBe("Conference");
    });

    test("validates reorder items array schema", () => {
      const reorderPayload = {
        items: [
          { id: "507f1f77bcf86cd799439011", displayOrder: 0 },
          { id: "507f1f77bcf86cd799439012", displayOrder: 1 },
        ],
      };

      const parsed = reorderSchema.parse(reorderPayload);
      expect(parsed.items.length).toBe(2);
      expect(parsed.items[0].displayOrder).toBe(0);
    });
  });
});
