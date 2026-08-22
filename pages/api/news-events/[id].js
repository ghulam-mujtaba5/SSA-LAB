// pages/api/news-events/[id].js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongoose";
import EventHighlight from "../../../models/EventHighlight";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { updateEventHighlightSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { _id: id } : { slug: id };

  if (req.method === "GET") {
    try {
      const event = await EventHighlight.findOne(filter).lean();
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      console.error("Event GET error:", error);
      return res.status(500).json({ success: false, message: "Error retrieving event" });
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
      if (req.body.isGalleryItem !== undefined) updateData.isGalleryItem = Boolean(req.body.isGalleryItem);
      if (req.body.displayOrder !== undefined) updateData.displayOrder = Number(req.body.displayOrder);

      const updated = await EventHighlight.findOneAndUpdate(filter, { $set: updateData }, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      await createAuditLog({
        session,
        action: "update",
        entity: "EventHighlight",
        entityId: updated._id.toString(),
        details: `Event updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Event PUT error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to update event",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await EventHighlight.findOneAndDelete(filter);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      await createAuditLog({
        session,
        action: "delete",
        entity: "EventHighlight",
        entityId: deleted._id.toString(),
        details: `Event deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
      console.error("Event DELETE error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete event" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(updateEventHighlightSchema)(handler);
