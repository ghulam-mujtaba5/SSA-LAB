import mongoose from "mongoose";

const EventHighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    year: { type: String, default: "", trim: true },
    date: { type: String, default: "", trim: true },
    badge: { type: String, default: "News", trim: true },
    category: {
      type: String,
      enum: ["Workshop", "Conference", "Exhibition", "News", "Poster Session", "Seminar", "Award", "Other"],
      default: "News",
    },
    venue: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, default: "", trim: true },
    src: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    orientation: { type: String, enum: ["landscape", "portrait"], default: "landscape" },
    isGalleryItem: { type: Boolean, default: false },
    width: { type: Number, default: 1280 },
    height: { type: Number, default: 900 },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

try {
  EventHighlightSchema.index({ published: 1, displayOrder: 1, createdAt: -1 });
  EventHighlightSchema.index(
    { title: "text", summary: "text", caption: "text" },
    { weights: { title: 5, summary: 3, caption: 2 }, name: "EventHighlightText_idx" }
  );
} catch (e) {
  // noop
}

export default mongoose.models.EventHighlight || mongoose.model("EventHighlight", EventHighlightSchema);
