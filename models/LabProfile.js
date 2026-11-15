import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    qualification: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PillarSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    iconName: { type: String, default: "ShieldCheck", trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const MilestoneSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true },
    era: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    tag: { type: String, default: "", trim: true },
    badge: { type: String, default: "", trim: true },
    summary: { type: String, required: true, trim: true },
    achievements: { type: [String], default: [] },
    stats: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const ImpactStatSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const PartnerLogoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    imageDark: { type: String, default: "", trim: true },
    imageLight: { type: String, default: "", trim: true },
    href: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const LabProfileSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true, index: true },
    name: { type: String, required: true, default: "Junaid Akram, PhD", trim: true },
    shortName: { type: String, default: "Junaid Akram", trim: true },
    role: { type: String, default: "Assistant Professor", trim: true },
    institution: {
      type: String,
      default: "University of Nottingham Ningbo China",
      trim: true,
    },
    department: {
      type: String,
      default: "School of Computer Science",
      trim: true,
    },
    lab: {
      type: String,
      default: "Software Security Assessment Lab",
      trim: true,
    },
    labShort: { type: String, default: "SSA Research Lab", trim: true },
    office: { type: String, default: "School of Computer Science (Ext. 6424)", trim: true },
    phone: { type: String, default: "+86 (0) 574 88180000 (Ext. 6424)", trim: true },
    emails: { type: [String], default: ["Junaid.Akram@nottingham.edu.cn", "junaid.tsinghua@yahoo.com"] },
    labEmail: { type: String, default: "", trim: true },
    googleScholar: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    researchGate: { type: String, default: "", trim: true },
    orcid: { type: String, default: "", trim: true },
    officialProfile: { type: String, default: "", trim: true },
    officialFypIdeas: { type: String, default: "", trim: true },
    sourceSite: { type: String, default: "https://www.ssa-lab.tech", trim: true },
    credentials: { type: [String], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    pillars: { type: [PillarSchema], default: [] },
    milestones: { type: [MilestoneSchema], default: [] },
    impactStats: { type: [ImpactStatSchema], default: [] },
    partnerLogos: { type: [PartnerLogoSchema], default: [] },
    adminModified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.LabProfile || mongoose.model("LabProfile", LabProfileSchema);
