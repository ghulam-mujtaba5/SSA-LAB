import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    views: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    collaboration: {
      type: String,
      default: "",
      trim: true,
    },
    graphicKey: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      problem: { type: String, default: "" },
      approach: { type: String, default: "" },
      outcome: { type: String, default: "" },
    },
    image: {
      type: String,
      default: "",
    },
    gallery: {
      type: [
        {
          url: { type: String, required: true },
          caption: { type: String, default: "" },
          alt: { type: String, default: "" },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    imageFit: {
      type: String,
      enum: ["contain", "cover", "fill", "none", "scale-down"],
      default: undefined,
    },
    showImage: {
      type: Boolean,
      default: true,
    },
    showGallery: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    period: {
      type: String,
      trim: true,
      default: "",
    },
    organization: {
      type: String,
      trim: true,
      default: "",
    },
    funding: {
      type: String,
      trim: true,
      default: "",
    },
    focus: {
      type: String,
      trim: true,
      default: "",
    },
    students: {
      type: [String],
      default: [],
    },
    problem: {
      type: String,
      trim: true,
      default: "",
    },
    solution: {
      type: String,
      trim: true,
      default: "",
    },
    outcome: {
      type: String,
      trim: true,
      default: "",
    },
    users: {
      type: String,
      trim: true,
      default: "",
    },
    features: {
      type: String,
      trim: true,
      default: "",
    },
    learned: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      default: "Completed",
      trim: true,
    },
    links: {
      live: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    category: {
      type: String,
      default: "Research Project",
      trim: true,
    },
    projectType: {
      type: String,
      enum: ["Research", "Supervised", "Industry", "Open Source", "General"],
      default: "Research",
    },
    published: {
      type: Boolean,
      default: true,
    },
    featuredOnHome: {
      type: Boolean,
      default: false,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    adminModified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

try {
  ProjectSchema.index({ published: 1, createdAt: -1 }, { name: "ProjectPublishedCreated_idx" });
  ProjectSchema.index({ status: 1, createdAt: -1 }, { name: "ProjectStatusCreated_idx" });
  ProjectSchema.index({ projectType: 1, createdAt: -1 }, { name: "ProjectTypeCreated_idx" });
  ProjectSchema.index({ pinned: 1, createdAt: -1 }, { name: "ProjectPinnedCreated_idx" });
  ProjectSchema.index({ displayOrder: 1, createdAt: -1 }, { name: "ProjectDisplayOrder_idx" });
  ProjectSchema.index({ tags: 1 }, { name: "ProjectTags_idx" });
  ProjectSchema.index(
    { title: "text", description: "text", tags: "text" },
    { weights: { title: 5, description: 3, tags: 1 }, name: "ProjectTextIndex" }
  );
} catch (e) {
  // noop
}

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
