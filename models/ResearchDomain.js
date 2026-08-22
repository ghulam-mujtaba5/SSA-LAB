import mongoose from "mongoose";

const ToolDatasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const CaseStudySchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    context: { type: String, default: "", trim: true },
    challenge: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    impact: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ResearchDomainSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    domainId: { type: String, default: "", trim: true },
    number: { type: String, default: "01", trim: true },
    graphicKey: { type: String, default: "", trim: true },
    title: { type: String, required: [true, "Title is required"], trim: true },
    image: { type: String, default: "", trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, default: "", trim: true },
    keyProblems: { type: [String], default: [] },
    currentDirections: { type: [String], default: [] },
    relatedLabWork: {
      items: { type: [String], default: [] },
      summary: { type: String, default: "" },
    },
    toolsAndDatasets: {
      items: { type: [ToolDatasetSchema], default: [] },
      summary: { type: String, default: "" },
    },
    projectIdeas: { type: [String], default: [] },
    caseStudies: { type: [CaseStudySchema], default: [] },
    coreTopics: { type: [String], default: [] },
    toolsTechnologies: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

try {
  ResearchDomainSchema.index({ published: 1, displayOrder: 1 });
  ResearchDomainSchema.index(
    { title: "text", description: "text", overview: "text" },
    { weights: { title: 5, description: 3, overview: 2 }, name: "ResearchDomainText_idx" }
  );
} catch (e) {
  // noop
}

export default mongoose.models.ResearchDomain || mongoose.model("ResearchDomain", ResearchDomainSchema);
