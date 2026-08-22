import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Enquiry from "../../../models/Enquiry";
import { createAuditLog } from "../../../lib/auditLog";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Admin or Editor access required." });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "Enquiry ID is required." });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const enquiry = await Enquiry.findById(id).lean();
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found." });
      }
      return res.status(200).json({ success: true, data: enquiry });
    } catch (error) {
      console.error("Enquiry GET [id] Error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch enquiry." });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const { status, adminNotes } = req.body || {};
      const updateData = {};

      if (status) {
        if (!["new", "read", "replied", "archived"].includes(status)) {
          return res.status(400).json({ success: false, message: "Invalid status value." });
        }
        updateData.status = status;
      }

      if (typeof adminNotes === "string") {
        updateData.adminNotes = adminNotes;
      }

      const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedEnquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found." });
      }

      await createAuditLog({
        session: token,
        action: "update",
        entity: "Enquiry",
        entityId: id,
        details: `Updated enquiry ${id}: status=${status || updatedEnquiry.status}${typeof adminNotes === "string" ? " (notes updated)" : ""}`,
      });

      return res.status(200).json({
        success: true,
        message: "Enquiry updated successfully.",
        data: updatedEnquiry,
      });
    } catch (error) {
      console.error("Enquiry PUT [id] Error:", error);
      return res.status(500).json({ success: false, message: "Failed to update enquiry." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await Enquiry.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Enquiry not found." });
      }

      await createAuditLog({
        session: token,
        action: "delete",
        entity: "Enquiry",
        entityId: id,
        details: `Deleted enquiry from ${deleted.email || deleted.name || id}`,
      });

      return res.status(200).json({
        success: true,
        message: "Enquiry deleted successfully.",
      });
    } catch (error) {
      console.error("Enquiry DELETE [id] Error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete enquiry." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
