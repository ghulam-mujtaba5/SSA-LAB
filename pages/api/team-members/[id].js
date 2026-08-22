// pages/api/team-members/[id].js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongoose";
import Member from "../../../models/Member";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { updateMemberSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { _id: id } : { slug: id };

  if (req.method === "GET") {
    try {
      const member = await Member.findOne(filter).lean();
      if (!member) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }
      res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res.status(200).json({ success: true, data: member });
    } catch (error) {
      console.error("Team member GET error:", error);
      return res.status(500).json({ success: false, message: "Error retrieving team member" });
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
      if (req.body.featured !== undefined) updateData.featured = Boolean(req.body.featured);
      if (req.body.displayOrder !== undefined) updateData.displayOrder = Number(req.body.displayOrder);

      const updated = await Member.findOneAndUpdate(filter, { $set: updateData }, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }

      await createAuditLog({
        session,
        action: "update",
        entity: "Member",
        entityId: updated._id.toString(),
        details: `Team member updated: ${updated.name}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Team member PUT error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to update team member",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await Member.findOneAndDelete(filter);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Team member not found" });
      }

      await createAuditLog({
        session,
        action: "delete",
        entity: "Member",
        entityId: deleted._id.toString(),
        details: `Team member deleted: ${deleted.name}`,
      });

      return res.status(200).json({ success: true, message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Team member DELETE error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete team member" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(updateMemberSchema)(handler);
