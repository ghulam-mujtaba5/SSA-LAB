// pages/api/publications/[id].js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongoose";
import Publication from "../../../models/Publication";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { updatePublicationSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { _id: id } : { slug: id };

  if (req.method === "GET") {
    try {
      const pub = await Publication.findOne(filter).lean();
      if (!pub) {
        return res.status(404).json({ success: false, message: "Publication not found" });
      }
      res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
      return res.status(200).json({ success: true, data: pub });
    } catch (error) {
      console.error("Publication GET error:", error);
      return res.status(500).json({ success: false, message: "Error retrieving publication" });
    }
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session || !["admin", "editor"].includes(session.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  if (req.method === "PUT") {
    try {
      const {
        title,
        year,
        authors,
        venue,
        type,
        href,
        bibtex,
        abstract,
        pdfUrl,
        codeUrl,
        featured,
        published,
        tags,
        displayOrder,
        slug,
      } = req.body;

      const updateData = { ...req.body, adminModified: true };

      if (year !== undefined) updateData.year = String(year);
      if (featured !== undefined) updateData.featured = Boolean(featured);
      if (published !== undefined) updateData.published = Boolean(published);
      if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);

      if (title && !slug && !isObjectId) {
        // Optionally update slug if title changed
        updateData.slug = slugify(title, { lower: true, strict: true });
      }

      if (tags !== undefined) {
        updateData.tags = Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
      }

      const updated = await Publication.findOneAndUpdate(filter, { $set: updateData }, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Publication not found" });
      }

      await createAuditLog({
        session,
        action: "update",
        entity: "Publication",
        entityId: updated._id.toString(),
        details: `Publication updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Publication PUT error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to update publication",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await Publication.findOneAndDelete(filter);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Publication not found" });
      }

      await createAuditLog({
        session,
        action: "delete",
        entity: "Publication",
        entityId: deleted._id.toString(),
        details: `Publication deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: "Publication deleted successfully" });
    } catch (error) {
      console.error("Publication DELETE error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete publication" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(updatePublicationSchema)(handler);
