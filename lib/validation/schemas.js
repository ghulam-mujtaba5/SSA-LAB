// lib/validation/schemas.js
import { z } from "zod";

// Helper: allow common image URL patterns beyond strict absolute URLs
const isLooseImageUrl = (val) => {
  if (typeof val !== "string") return false;
  const v = val.trim();
  if (v === "") return true; // empty allowed separately
  // Absolute http(s)
  if (/^https?:\/\//i.test(v)) return true;
  // Protocol-relative
  if (/^\/\//.test(v)) return true;
  // Root-relative path
  if (/^\//.test(v)) return true;
  // Data URL (base64)
  if (/^data:image\//i.test(v)) return true;
  // Blob URL (used by browsers for temp previews)
  if (/^blob:/.test(v)) return true;
  // File-like path or URL ending with common image extensions (even without protocol)
  if (/\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(v)) return true;
  return false;
};

export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// ==========================================
// 1. Project Schemas
// ==========================================
export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long.")
    .optional(),
  summary: z.string().trim().optional(),
  collaboration: z.string().trim().optional(),
  graphicKey: z.string().trim().optional(),
  details: z
    .object({
      problem: z.string().optional().default(""),
      approach: z.string().optional().default(""),
      outcome: z.string().optional().default(""),
    })
    .optional(),
  tags: z
    .union([
      z.string().min(1, "At least one tag is required."),
      z.array(z.string()).min(1, "At least one tag is required."),
    ]),
  status: z
    .enum(["In Progress", "Completed", "Archived", "Active", "Planning", "Running"])
    .optional()
    .default("In Progress"),
  category: z
    .enum([
      "All",
      "Software Development",
      "Web Development",
      "AI",
      "Data Science",
      "UI/UX",
      "Client Projects",
      "Research Project",
      "Others",
    ])
    .or(z.string())
    .optional()
    .default("Others"),
  projectType: z
    .enum(["Research", "Supervised", "Industry", "Open Source", "General"])
    .optional()
    .default("Research"),
  links: z
    .object({
      live: z.string().url("Invalid URL.").or(z.literal("")).optional(),
      github: z.string().url("Invalid URL.").or(z.literal("")).optional(),
    })
    .optional(),
  image: z
    .string()
    .trim()
    .refine((v) => v === "" || isLooseImageUrl(v), {
      message: "Invalid URL for image.",
    })
    .optional(),
  gallery: z
    .array(
      z.object({
        url: z.string().refine((v) => isLooseImageUrl(v), {
          message: "Invalid URL for gallery image.",
        }),
        caption: z.string().trim().max(200).optional().default(""),
        alt: z.string().trim().max(125).optional().default(""),
        order: z.number().int().min(0).optional().default(0),
      })
    )
    .max(20, "Maximum 20 gallery images allowed.")
    .optional()
    .default([]),
  imageFit: z
    .enum(["contain", "cover", "fill", "none", "scale-down"])
    .optional(),
  showImage: z.boolean().optional().default(true),
  showGallery: z.boolean().optional().default(true),
  published: z.boolean().optional().default(false),
  featuredOnHome: z.boolean().optional().default(false),
  metaTitle: z
    .string()
    .trim()
    .max(70, "Meta title should not exceed 70 characters.")
    .optional(),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description should not exceed 160 characters.")
    .optional(),
  ogImage: z
    .string()
    .trim()
    .refine((v) => v === "" || isLooseImageUrl(v), {
      message: "Invalid URL for OG image.",
    })
    .optional(),
  scheduledAt: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/i, "Invalid date & time."),
      z.string().datetime(),
      z.literal(""),
      z.null(),
    ])
    .optional(),
  role: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  collaboration: z.string().trim().optional(),
  period: z.string().trim().optional(),
  organization: z.string().trim().optional(),
  funding: z.string().trim().optional(),
  focus: z.string().trim().optional(),
  students: z.union([z.string(), z.array(z.string())]).optional(),
  graphicKey: z.string().trim().optional(),
  details: z
    .object({
      problem: z.string().trim().optional(),
      approach: z.string().trim().optional(),
      outcome: z.string().trim().optional(),
    })
    .optional(),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
  users: z.string().trim().optional(),
  features: z.string().trim().optional(),
  learned: z.string().trim().optional(),
  pinned: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const createProjectSchema = projectSchema;
export const updateProjectSchema = projectSchema.partial().extend({
  description: z.string().trim().optional(),
});

// ==========================================
// 2. FYP Project Schemas
// ==========================================
export const fypProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(300, "Title cannot exceed 300 characters."),
  slug: z.string().trim().optional(),
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters long."),
  status: z
    .enum(["Running", "Completed", "Available for Supervision", "In Progress", "Archived"])
    .optional()
    .default("In Progress"),
  categoryType: z
    .enum(["running", "completed", "future"])
    .optional()
    .default("running"),
  projectType: z.string().trim().optional().default("Final Year Project"),
  nature: z.string().trim().optional().default("Software Security Research"),
  category: z.string().trim().optional().default("Vulnerability & Security"),
  programme: z.string().trim().optional().default("BS Software Engineering"),
  session: z.string().trim().optional().default(""),
  institution: z.string().trim().optional().default("COMSATS University Islamabad, Lahore Campus"),
  academicYear: z.string().trim().optional().default(""),
  students: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Student name is required"),
        registration: z.string().trim().optional().default(""),
        profileUrl: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
  supervisor: z.string().trim().optional().default("Dr. Junaid Akram"),
  coSupervisor: z.string().trim().optional().default(""),
  specializations: z.array(z.string()).optional().default([]),
  sdgs: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  problem: z.string().trim().optional().default(""),
  solution: z.string().trim().optional().default(""),
  objectives: z.array(z.string()).optional().default([]),
  architecture: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Stage title is required"),
        detail: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
  features: z.array(z.string()).optional().default([]),
  contributions: z.array(z.string()).optional().default([]),
  outcome: z.string().trim().optional().default(""),
  limitations: z.array(z.string()).optional().default([]),
  futureWork: z.array(z.string()).optional().default([]),
  prerequisites: z.string().trim().optional().default(""),
  expectedDeliverables: z.array(z.string()).optional().default([]),
  isRunning: z.boolean().optional().default(false),
  isOpportunity: z.boolean().optional().default(false),
  coverImage: z.string().trim().optional().default(""),
  coverAlt: z.string().trim().optional().default(""),
  gallery: z
    .array(
      z.object({
        url: z.string().refine((v) => isLooseImageUrl(v), {
          message: "Invalid URL for gallery image.",
        }),
        caption: z.string().trim().max(200).optional().default(""),
        alt: z.string().trim().max(125).optional().default(""),
        order: z.number().int().min(0).optional().default(0),
      })
    )
    .optional()
    .default([]),
  liveUrl: z.string().trim().optional().default(""),
  repositoryUrl: z.string().trim().optional().default(""),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const createFypProjectSchema = fypProjectSchema;
export const updateFypProjectSchema = fypProjectSchema.partial();

// ==========================================
// 3. Publication Schemas
// ==========================================
export const publicationSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long."),
  slug: z.string().trim().optional(),
  year: z.string().trim().min(2, "Year is required."),
  type: z
    .enum(["Journal", "Conference", "Book Chapter", "Preprint", "Workshop", "Patent", "Other"])
    .optional()
    .default("Journal"),
  authors: z.string().trim().min(1, "Authors string is required."),
  venue: z.string().trim().min(1, "Venue is required."),
  href: z.string().trim().optional().default(""),
  bibtex: z.string().trim().optional().default(""),
  abstract: z.string().trim().optional().default(""),
  pdfUrl: z.string().trim().optional().default(""),
  codeUrl: z.string().trim().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
});

export const createPublicationSchema = publicationSchema;
export const updatePublicationSchema = publicationSchema.partial();

// ==========================================
// 4. Member Schemas
// ==========================================
export const memberSchema = z.object({
  name: z.string().trim().min(1, "Member name is required."),
  slug: z.string().trim().optional(),
  role: z.string().trim().optional().default(""),
  category: z.enum([
    "co-investigator",
    "co_investigator",
    "pg-researcher",
    "pg_researcher",
    "collaborator",
    "alumni",
    "alumnus",
    "supervised-project",
    "core-team",
    "faculty",
    "other",
  ]),
  memberId: z.string().trim().optional().default(""),
  degree: z.string().trim().optional().default(""),
  affiliation: z.string().trim().optional().default(""),
  institution: z.string().trim().optional().default(""),
  specialization: z.string().trim().optional().default(""),
  topic: z.string().trim().optional().default(""),
  focus: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default("Active"),
  bio: z.string().trim().optional().default(""),
  badge: z.string().trim().optional().default(""),
  image: z.string().trim().optional().default(""),
  email: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  googleScholar: z.string().trim().optional().default(""),
  orcid: z.string().trim().optional().default(""),
  researchGate: z.string().trim().optional().default(""),
  officialProfile: z.string().trim().optional().default(""),
  linkedin: z.string().trim().optional().default(""),
  github: z.string().trim().optional().default(""),
  term: z.string().trim().optional().default(""),
  organization: z.string().trim().optional().default(""),
  projectTitle: z.string().trim().optional().default(""),
  details: z.string().trim().optional().default(""),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const createMemberSchema = memberSchema;
export const updateMemberSchema = memberSchema.partial();

// ==========================================
// 5. Research Domain Schemas
// ==========================================
export const researchDomainSchema = z.object({
  slug: z.string().trim().optional(),
  domainId: z.string().trim().optional().default(""),
  number: z.string().trim().optional().default("01"),
  graphicKey: z.string().trim().optional().default(""),
  title: z.string().trim().min(2, "Title is required."),
  image: z.string().trim().optional().default(""),
  description: z.string().trim().min(5, "Description is required."),
  overview: z.string().trim().optional().default(""),
  keyProblems: z.array(z.string()).optional().default([]),
  currentDirections: z.array(z.string()).optional().default([]),
  relatedLabWork: z
    .object({
      items: z.array(z.string()).optional().default([]),
      summary: z.string().optional().default(""),
    })
    .optional()
    .default({ items: [], summary: "" }),
  toolsAndDatasets: z
    .object({
      items: z
        .array(
          z.object({
            name: z.string().trim().min(1),
            url: z.string().trim().optional().default(""),
          })
        )
        .optional()
        .default([]),
      summary: z.string().optional().default(""),
    })
    .optional()
    .default({ items: [], summary: "" }),
  projectIdeas: z.array(z.string()).optional().default([]),
  caseStudies: z
    .array(
      z.object({
        title: z.string().trim().optional().default(""),
        context: z.string().trim().optional().default(""),
        challenge: z.string().trim().optional().default(""),
        solution: z.string().trim().optional().default(""),
        impact: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
  coreTopics: z.array(z.string()).optional().default([]),
  toolsTechnologies: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
});

export const createResearchDomainSchema = researchDomainSchema;
export const updateResearchDomainSchema = researchDomainSchema.partial();

// ==========================================
// 6. Event Highlight Schemas
// ==========================================
export const eventHighlightSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  slug: z.string().trim().optional(),
  year: z.string().trim().optional().default(""),
  date: z.string().trim().optional().default(""),
  badge: z.string().trim().optional().default("News"),
  category: z
    .enum(["Workshop", "Conference", "Exhibition", "News", "Poster Session", "Seminar", "Award", "Other"])
    .optional()
    .default("News"),
  venue: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  summary: z.string().trim().min(5, "Summary is required."),
  content: z.string().trim().optional().default(""),
  src: z.string().trim().optional().default(""),
  image: z.string().trim().optional().default(""),
  alt: z.string().trim().optional().default(""),
  caption: z.string().trim().optional().default(""),
  orientation: z.enum(["landscape", "portrait"]).optional().default("landscape"),
  isGalleryItem: z.boolean().optional().default(false),
  width: z.number().optional().default(1280),
  height: z.number().optional().default(900),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
});

export const createEventHighlightSchema = eventHighlightSchema;
export const updateEventHighlightSchema = eventHighlightSchema.partial();

// ==========================================
// 7. Lab Profile Schemas
// ==========================================
export const labProfileSchema = z.object({
  key: z.string().trim().optional().default("default"),
  name: z.string().trim().min(2, "Lab/PI Name is required."),
  shortName: z.string().trim().optional().default(""),
  role: z.string().trim().optional().default(""),
  institution: z.string().trim().optional().default(""),
  lab: z.string().trim().optional().default(""),
  labShort: z.string().trim().optional().default(""),
  office: z.string().trim().optional().default(""),
  emails: z.array(z.string()).optional().default([]),
  labEmail: z.string().trim().optional().default(""),
  googleScholar: z.string().trim().optional().default(""),
  linkedin: z.string().trim().optional().default(""),
  researchGate: z.string().trim().optional().default(""),
  orcid: z.string().trim().optional().default(""),
  officialProfile: z.string().trim().optional().default(""),
  officialFypIdeas: z.string().trim().optional().default(""),
  sourceSite: z.string().trim().optional().default(""),
  credentials: z.array(z.string()).optional().default([]),
  experience: z
    .array(
      z.object({
        role: z.string().trim().min(1),
        organization: z.string().trim().min(1),
        period: z.string().trim().min(1),
      })
    )
    .optional()
    .default([]),
  education: z
    .array(
      z.object({
        qualification: z.string().trim().min(1),
        institution: z.string().trim().min(1),
        period: z.string().trim().min(1),
      })
    )
    .optional()
    .default([]),
  pillars: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        title: z.string().trim().min(1),
        iconName: z.string().trim().optional().default("ShieldCheck"),
        desc: z.string().trim().min(1),
      })
    )
    .optional()
    .default([]),
  milestones: z
    .array(
      z.object({
        year: z.string().trim().min(1),
        era: z.string().trim().min(1),
        title: z.string().trim().min(1),
        location: z.string().trim().optional().default(""),
        tag: z.string().trim().optional().default(""),
        badge: z.string().trim().optional().default(""),
        summary: z.string().trim().min(1),
        achievements: z.array(z.string()).optional().default([]),
        stats: z.any().optional().default({}),
      })
    )
    .optional()
    .default([]),
  impactStats: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
        note: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
  partnerLogos: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        image: z.string().trim().min(1),
        href: z.string().trim().optional().default(""),
        role: z.string().trim().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

export const updateLabProfileSchema = labProfileSchema.partial();

// ==========================================
// 8. Bulk Actions, Reorder & Enquiries
// ==========================================
export const bulkActionSchema = z
  .object({
    ids: z.array(objectId).optional(),
    projectIds: z.array(objectId).optional(),
    action: z.enum(["publish", "draft", "delete"]),
  })
  .refine(
    (data) => (data.ids && data.ids.length > 0) || (data.projectIds && data.projectIds.length > 0),
    { message: "At least one item must be selected (provide ids or projectIds)." }
  );

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: objectId,
      displayOrder: z.number().int(),
    })
  ),
});

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  degree: z.string().trim().optional().default(""),
  enquiryType: z
    .enum(["FYP Supervision", "Research Collaboration", "MS/PhD Inquiry", "General"])
    .optional()
    .default("General"),
  topic: z.string().trim().optional().default(""),
  message: z.string().trim().min(1, "Message content is required").max(5000),
  status: z.enum(["new", "read", "replied", "archived"]).optional().default("new"),
  adminNotes: z.string().optional().default(""),
});
