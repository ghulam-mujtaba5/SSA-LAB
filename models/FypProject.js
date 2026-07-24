import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registration: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ArchitectureStageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    detail: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const GalleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const FypProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Archived"],
      default: "In Progress",
    },
    projectType: { type: String, default: "Final Year Project", trim: true },
    nature: { type: String, default: "Research & Development", trim: true },
    programme: { type: String, default: "", trim: true },
    session: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    students: { type: [StudentSchema], default: [] },
    supervisor: { type: String, default: "Dr. Junaid Akram", trim: true },
    coSupervisor: { type: String, default: "", trim: true },
    specializations: { type: [String], default: [] },
    sdgs: { type: [String], default: [] },
    problem: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    objectives: { type: [String], default: [] },
    architecture: { type: [ArchitectureStageSchema], default: [] },
    features: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    contributions: { type: [String], default: [] },
    outcome: { type: String, default: "", trim: true },
    limitations: { type: [String], default: [] },
    futureWork: { type: [String], default: [] },
    coverImage: { type: String, default: "", trim: true },
    coverAlt: { type: String, default: "", trim: true },
    gallery: { type: [GalleryImageSchema], default: [] },
    liveUrl: { type: String, default: "", trim: true },
    repositoryUrl: { type: String, default: "", trim: true },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

FypProjectSchema.index(
  { published: 1, displayOrder: 1, createdAt: -1 },
  { name: "FypPublishedOrder_idx" },
);
FypProjectSchema.index(
  { title: "text", summary: "text", technologies: "text", specializations: "text" },
  {
    name: "FypProjectText_idx",
    weights: { title: 5, summary: 3, technologies: 2, specializations: 2 },
  },
);

export default mongoose.models.FypProject ||
  mongoose.model("FypProject", FypProjectSchema);

