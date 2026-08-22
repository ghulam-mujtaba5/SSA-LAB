import {
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
  bulkActionSchema,
  fypProjectSchema,
  enquirySchema,
} from "../lib/validation/schemas";

describe("Milestone 2 Zod Validation Schemas", () => {
  // =========================================================================
  // 1. ZOD PROJECT SCHEMA & CASE STUDY FIELDS
  // =========================================================================
  describe("projectSchema and case study fields", () => {
    const validFullPayload = {
      title: "Autonomous Swarm Robotics Framework",
      description:
        "A comprehensive framework for autonomous distributed drone navigation and mapping.",
      tags: ["Robotics", "Swarm AI", "ROS2"],
      role: "Lead Systems Architect & ML Engineer",
      problem:
        "Decentralized consensus under intermittent ad-hoc network connectivity.",
      solution:
        "Implemented gossip protocol with asynchronous state estimation.",
      outcome:
        "Achieved 99.4% packet delivery and zero mid-air collisions in 100+ flights.",
      users: "Autonomous UAV fleet operators and search & rescue teams.",
      features:
        "Distributed SLAM\nDynamic Obstacle Avoidance\nFault-tolerant Mesh",
      learned:
        "Importance of event-driven synchronization in bounded-memory microcontrollers.",
      pinned: true,
      displayOrder: 5,
      status: "In Progress",
      category: "AI",
      published: true,
      featuredOnHome: true,
      links: {
        live: "https://swarm.example.com",
        github: "https://github.com/ssalab/swarm-robotics",
      },
      image: "https://example.com/cover.png",
      gallery: [
        {
          url: "https://example.com/g1.jpg",
          caption: "Field test 1",
          alt: "Drone in flight",
          order: 1,
        },
      ],
      imageFit: "cover",
      showImage: true,
      showGallery: true,
      metaTitle: "Swarm Robotics - SSA Lab",
      metaDescription: "Autonomous distributed drone navigation by SSA Lab.",
      ogImage: "https://example.com/og.png",
      scheduledAt: "2026-10-01T10:00",
    };

    test("preserves all case-study fields without stripping", () => {
      const parsed = projectSchema.parse(validFullPayload);

      expect(parsed.role).toBe("Lead Systems Architect & ML Engineer");
      expect(parsed.problem).toBe(
        "Decentralized consensus under intermittent ad-hoc network connectivity."
      );
      expect(parsed.solution).toBe(
        "Implemented gossip protocol with asynchronous state estimation."
      );
      expect(parsed.outcome).toBe(
        "Achieved 99.4% packet delivery and zero mid-air collisions in 100+ flights."
      );
      expect(parsed.users).toBe(
        "Autonomous UAV fleet operators and search & rescue teams."
      );
      expect(parsed.features).toBe(
        "Distributed SLAM\nDynamic Obstacle Avoidance\nFault-tolerant Mesh"
      );
      expect(parsed.learned).toBe(
        "Importance of event-driven synchronization in bounded-memory microcontrollers."
      );
      expect(parsed.pinned).toBe(true);
      expect(parsed.displayOrder).toBe(5);
    });

    test("applies correct defaults when optional case-study fields are omitted", () => {
      const minimalPayload = {
        title: "Basic Research Tool",
        description:
          "A minimal research tool created for internal lab data processing.",
        tags: "Python, CLI",
      };

      const parsed = projectSchema.parse(minimalPayload);

      expect(parsed.pinned).toBe(false);
      expect(parsed.displayOrder).toBe(0);
      expect(parsed.status).toBe("In Progress");
      expect(parsed.category).toBe("Others");
      expect(parsed.published).toBe(false);
      expect(parsed.role).toBeUndefined();
      expect(parsed.problem).toBeUndefined();
      expect(parsed.solution).toBeUndefined();
      expect(parsed.outcome).toBeUndefined();
      expect(parsed.users).toBeUndefined();
      expect(parsed.features).toBeUndefined();
      expect(parsed.learned).toBeUndefined();
    });

    test("accepts both array and CSV string for tags", () => {
      const parsedArr = projectSchema.parse({
        title: "Project Alpha",
        description: "Valid description exceeding 20 chars.",
        tags: ["tag1", "tag2"],
      });
      expect(parsedArr.tags).toEqual(["tag1", "tag2"]);

      const parsedStr = projectSchema.parse({
        title: "Project Beta",
        description: "Valid description exceeding 20 chars.",
        tags: "tag1, tag2, tag3",
      });
      expect(parsedStr.tags).toBe("tag1, tag2, tag3");
    });

    test("updateProjectSchema permits partial updates and optional description", () => {
      const partialUpdate = {
        pinned: true,
        displayOrder: 10,
        problem: "Updated problem statement.",
        solution: "Updated solution architecture.",
      };

      const parsed = updateProjectSchema.parse(partialUpdate);
      expect(parsed.pinned).toBe(true);
      expect(parsed.displayOrder).toBe(10);
      expect(parsed.problem).toBe("Updated problem statement.");
      expect(parsed.solution).toBe("Updated solution architecture.");
    });

    test("rejects invalid inputs on createProjectSchema", () => {
      expect(() => {
        createProjectSchema.parse({
          title: "AB",
          description: "This is a valid long description.",
          tags: ["test"],
        });
      }).toThrow(/Title must be at least 3 characters long/);

      expect(() => {
        createProjectSchema.parse({
          title: "Valid Title",
          description: "Short desc",
          tags: ["test"],
        });
      }).toThrow(/Description must be at least 20 characters long/);

      expect(() => {
        createProjectSchema.parse({
          title: "Valid Title",
          description:
            "This is a valid description that has more than 20 characters.",
          tags: ["test"],
          links: { live: "not-a-url" },
        });
      }).toThrow(/Invalid URL/);
    });
  });

  // =========================================================================
  // 2. ZOD BULK ACTION SCHEMA POLYMORPHISM
  // =========================================================================
  describe("bulkActionSchema validation", () => {
    const validObjectId1 = "507f1f77bcf86cd799439011";
    const validObjectId2 = "507f191e810c19729de860ea";

    test("accepts payload with { ids: [...] }", () => {
      const payload = {
        ids: [validObjectId1, validObjectId2],
        action: "publish",
      };
      const parsed = bulkActionSchema.parse(payload);
      expect(parsed.ids).toEqual([validObjectId1, validObjectId2]);
      expect(parsed.action).toBe("publish");
    });

    test("accepts payload with { projectIds: [...] }", () => {
      const payload = {
        projectIds: [validObjectId1, validObjectId2],
        action: "draft",
      };
      const parsed = bulkActionSchema.parse(payload);
      expect(parsed.projectIds).toEqual([validObjectId1, validObjectId2]);
      expect(parsed.action).toBe("draft");
    });

    test("accepts payload with both { ids: [...], projectIds: [...] }", () => {
      const payload = {
        ids: [validObjectId1],
        projectIds: [validObjectId2],
        action: "delete",
      };
      const parsed = bulkActionSchema.parse(payload);
      expect(parsed.ids).toEqual([validObjectId1]);
      expect(parsed.projectIds).toEqual([validObjectId2]);
      expect(parsed.action).toBe("delete");
    });

    test("rejects when neither ids nor projectIds are provided", () => {
      const payload = {
        action: "publish",
      };
      expect(() => bulkActionSchema.parse(payload)).toThrow(
        /At least one item must be selected/
      );
    });

    test("rejects when ids is an empty array and projectIds is missing", () => {
      const payload = {
        ids: [],
        action: "publish",
      };
      expect(() => bulkActionSchema.parse(payload)).toThrow(
        /At least one item must be selected/
      );
    });

    test("rejects when projectIds is an empty array and ids is missing", () => {
      const payload = {
        projectIds: [],
        action: "delete",
      };
      expect(() => bulkActionSchema.parse(payload)).toThrow(
        /At least one item must be selected/
      );
    });

    test("rejects invalid MongoDB ObjectId format", () => {
      expect(() =>
        bulkActionSchema.parse({
          ids: ["invalid-id-string"],
          action: "publish",
        })
      ).toThrow(/Invalid MongoDB ObjectId/);

      expect(() =>
        bulkActionSchema.parse({
          projectIds: ["12345"],
          action: "draft",
        })
      ).toThrow(/Invalid MongoDB ObjectId/);
    });

    test("rejects invalid action enum values", () => {
      expect(() =>
        bulkActionSchema.parse({
          ids: [validObjectId1],
          action: "archive",
        })
      ).toThrow();
    });
  });

  // =========================================================================
  // 3. FYP & ENQUIRY SCHEMAS
  // =========================================================================
  describe("fypProjectSchema and enquirySchema", () => {
    test("validates FYP schema correctly", () => {
      const validFyp = {
        title: "Autonomous Vehicle Perception",
        summary: "Detailed summary of perception system.",
        students: [{ name: "Student 1", registration: "FA21-BCS-001" }],
        status: "In Progress",
        academicYear: "2025-2026",
      };

      const parsed = fypProjectSchema.parse(validFyp);
      expect(parsed.title).toBe("Autonomous Vehicle Perception");
      expect(parsed.students.length).toBe(1);
    });

    test("validates Enquiry schema correctly", () => {
      const validEnquiry = {
        name: "John Doe",
        email: "john@example.com",
        enquiryType: "FYP Supervision",
        topic: "Deep Learning Research",
        message: "I would like to apply for FYP supervision in Deep Learning.",
      };

      const parsed = enquirySchema.parse(validEnquiry);
      expect(parsed.name).toBe("John Doe");
      expect(parsed.email).toBe("john@example.com");
      expect(parsed.status).toBe("new");
    });
  });
});
