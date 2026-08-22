import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    year: { type: String, required: [true, "Year is required"], trim: true },
    type: {
      type: String,
      enum: ["Journal", "Conference", "Book Chapter", "Preprint", "Workshop", "Patent", "Other"],
      default: "Journal",
    },
    authors: { type: String, required: [true, "Authors string is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    href: { type: String, default: "", trim: true },
    bibtex: { type: String, default: "", trim: true },
    abstract: { type: String, default: "", trim: true },
    pdfUrl: { type: String, default: "", trim: true },
    codeUrl: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

try {
  PublicationSchema.index({ published: 1, year: -1, displayOrder: 1 });
  PublicationSchema.index(
    { title: "text", authors: "text", venue: "text" },
    { weights: { title: 5, authors: 3, venue: 2 }, name: "PublicationText_idx" }
  );
} catch (e) {
  // noop
}

export default mongoose.models.Publication || mongoose.model("Publication", PublicationSchema);
