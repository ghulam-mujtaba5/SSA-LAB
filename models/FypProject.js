import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registration: { type: String, default: "", trim: true },
    profileUrl: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ArchitectureStageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    detail: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const GalleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const FypProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    summary: { type: String, required: [true, "Summary is required"], trim: true },
    status: {
      type: String,
      enum: ["Running", "Completed", "Available for Supervision", "In Progress", "Archived"],
      default: "Running",
      trim: true,
    },
    categoryType: {
      type: String,
      enum: ["running", "completed", "future"],
      default: "running",
      trim: true,
      index: true,
    },
    projectType: { type: String, default: "Final Year Project", trim: true },
    nature: { type: String, default: "Software Security Research", trim: true },
    category: {
      type: String,
      default: "Vulnerability & Security",
      trim: true,
    },
    programme: { type: String, default: "BS Software Engineering", trim: true },
    session: { type: String, default: "", trim: true },
    institution: { type: String, default: "COMSATS University Islamabad, Lahore Campus", trim: true },
    students: { type: [StudentSchema], default: [] },
    supervisor: { type: String, default: "Dr. Junaid Akram", trim: true },
    coSupervisor: { type: String, default: "", trim: true },
    specializations: { type: [String], default: [] },
    sdgs: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    problem: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    objectives: { type: [String], default: [] },
    architecture: { type: [ArchitectureStageSchema], default: [] },
    features: { type: [String], default: [] },
    contributions: { type: [String], default: [] },
    outcome: { type: String, default: "", trim: true },
    limitations: { type: [String], default: [] },
    futureWork: { type: [String], default: [] },
    prerequisites: { type: String, default: "", trim: true },
    expectedDeliverables: { type: [String], default: [] },
    isRunning: { type: Boolean, default: false },
    isOpportunity: { type: Boolean, default: false },
    coverImage: { type: String, default: "", trim: true },
    coverAlt: { type: String, default: "", trim: true },
    gallery: { type: [GalleryImageSchema], default: [] },
    liveUrl: { type: String, default: "", trim: true },
    repositoryUrl: { type: String, default: "", trim: true },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

try {
  FypProjectSchema.index(
    { published: 1, categoryType: 1, displayOrder: 1, createdAt: -1 },
    { name: "FypPublishedCategoryOrder_idx" }
  );
  FypProjectSchema.index(
    { title: "text", summary: "text", technologies: "text", specializations: "text" },
    {
      name: "FypProjectText_idx",
      weights: { title: 5, summary: 3, technologies: 2, specializations: 2 },
    }
  );
} catch (e) {
  // noop
}

export default mongoose.models.FypProject || mongoose.model("FypProject", FypProjectSchema);
