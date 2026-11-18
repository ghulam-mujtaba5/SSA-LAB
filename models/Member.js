import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Member name is required"], trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    role: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: [
        "co-investigator",
        "co_investigator",
        "junior-collaborator",
        "junior_collaborator",
        "pg-researcher",
        "pg_researcher",
        "collaborator",
        "alumni",
        "alumnus",
        "supervised-project",
        "core-team",
        "faculty",
        "other",
      ],
      required: true,
      index: true,
    },
    memberId: { type: String, default: "", trim: true }, // e.g. "FA23-RCS-005"
    degree: { type: String, default: "", trim: true }, // e.g. "MS Computer Science"
    affiliation: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    specialization: { type: String, default: "", trim: true },
    topic: { type: String, default: "", trim: true }, // Thesis / Topic title
    focus: { type: String, default: "", trim: true },
    status: { type: String, default: "Active", trim: true },
    bio: { type: String, default: "", trim: true },
    badge: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    googleScholar: { type: String, default: "", trim: true },
    orcid: { type: String, default: "", trim: true },
    researchGate: { type: String, default: "", trim: true },
    officialProfile: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    github: { type: String, default: "", trim: true },
    term: { type: String, default: "", trim: true }, // e.g. "Fall 2020", "Spring 2021"
    organization: { type: String, default: "", trim: true }, // Alumni employer
    projectTitle: { type: String, default: "", trim: true }, // Supervised project title
    details: { type: String, default: "", trim: true }, // Collaborator details
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

try {
  MemberSchema.index({ category: 1, published: 1, displayOrder: 1 });
  MemberSchema.index(
    { name: "text", specialization: "text", topic: "text", bio: "text" },
    { weights: { name: 5, topic: 3, specialization: 2 }, name: "MemberText_idx" }
  );
} catch (e) {
  // noop
}

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
