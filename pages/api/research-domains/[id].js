// pages/api/research-domains/[id].js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongoose";
import ResearchDomain from "../../../models/ResearchDomain";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { updateResearchDomainSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { _id: id } : { $or: [{ slug: id }, { domainId: id }] };

  if (req.method === "GET") {
    try {
      const domain = await ResearchDomain.findOne(filter).lean();
      if (!domain) {
        return res.status(404).json({ success: false, message: "Research domain not found" });
      }
      res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res.status(200).json({ success: true, data: domain });
    } catch (error) {
      console.error("Research domain GET error:", error);
      return res.status(500).json({ success: false, message: "Error retrieving research domain" });
    }
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session || !["admin", "editor"].includes(session.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  if (req.method === "PUT") {
    try {
      const updateData = { ...req.body, adminModified: true };

      if (req.body.published !== undefined) updateData.published = Boolean(req.body.published);
      if (req.body.displayOrder !== undefined) updateData.displayOrder = Number(req.body.displayOrder);

      const updated = await ResearchDomain.findOneAndUpdate(filter, { $set: updateData }, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Research domain not found" });
      }

      await createAuditLog({
        session,
        action: "update",
        entity: "ResearchDomain",
        entityId: updated._id.toString(),
        details: `Research domain updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Research domain PUT error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to update research domain",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await ResearchDomain.findOneAndDelete(filter);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Research domain not found" });
      }

      await createAuditLog({
        session,
        action: "delete",
        entity: "ResearchDomain",
        entityId: deleted._id.toString(),
        details: `Research domain deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: "Research domain deleted successfully" });
    } catch (error) {
      console.error("Research domain DELETE error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete research domain" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(updateResearchDomainSchema)(handler);
