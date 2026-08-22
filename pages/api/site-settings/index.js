// pages/api/site-settings/index.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import LabProfile from "../../../models/LabProfile";
import { createAuditLog } from "../../../lib/auditLog";
import { validate } from "../../../lib/validation/validator";
import { updateLabProfileSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      let profile = await LabProfile.findOne({ key: "default" }).lean();
      if (!profile) {
        profile = await LabProfile.create({ key: "default" });
      }

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      console.error("Site Settings GET error:", error);
      return res.status(500).json({ success: false, message: "Failed to load site settings" });
    }
  }

  if (req.method === "PUT" || req.method === "POST") {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
    }

    try {
      const payload = { ...req.body, adminModified: true };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

      const updated = await LabProfile.findOneAndUpdate(
        { key: "default" },
        { $set: payload },
        { new: true, upsert: true, runValidators: true }
      );

      await createAuditLog({
        session,
        action: "update",
        entity: "LabProfile",
        entityId: updated._id.toString(),
        details: "Site Profile & Settings updated",
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Site Settings update error:", error);
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to update site settings",
      });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(updateLabProfileSchema)(handler);
