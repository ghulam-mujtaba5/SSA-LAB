import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    degree: {
      type: String,
      trim: true,
      default: "",
    },
    enquiryType: {
      type: String,
      enum: [
        "FYP Supervision",
        "Research Collaboration",
        "MS/PhD Inquiry",
        "General",
      ],
      default: "General",
    },
    topic: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ enquiryType: 1 });

export default mongoose.models.Enquiry ||
  mongoose.model("Enquiry", EnquirySchema);
