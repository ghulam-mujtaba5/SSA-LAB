import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      // Denormalize for easier display
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "bulk_delete",
        "bulk-delete",
        "bulk-publish",
        "bulk-draft",
        "reorder",
        "login_success",
        "login_fail",
        "pin",
        "unpin",
        "upload",
        "status_change",
      ],
    },
    entity: {
      type: String,
      required: true,
      enum: [
        "Article",
        "Project",
        "FypProject",
        "Publication",
        "Member",
        "TeamMember",
        "ResearchDomain",
        "EventHighlight",
        "LabEvent",
        "NewsEvent",
        "LabProfile",
        "SiteSettings",
        "Enquiry",
        "MediaAsset",
        "User",
        "Auth",
        "Setting",
        "SavedSearch",
        "PinnedItem",
      ],
    },
    entityId: {
      type: String, // Can be ObjectId or other identifiers
    },
    details: {
      type: String, // e.g., "Deleted 5 articles"
    },
  },
  { timestamps: true }
);

try {
  AuditLogSchema.index({ entity: 1, createdAt: -1 });
  AuditLogSchema.index({ user: 1, createdAt: -1 });
  AuditLogSchema.index({ action: 1, createdAt: -1 });
} catch (e) {
  // noop
}

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
