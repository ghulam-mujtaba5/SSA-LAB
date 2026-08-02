import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Enquiry from "../../../models/Enquiry";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const {
        search = "",
        status = "",
        enquiryType = "",
        page = 1,
        limit = 20,
      } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { topic: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ];
      }

      if (status && status !== "all") {
        query.status = status;
      }

      if (enquiryType && enquiryType !== "all") {
        query.enquiryType = enquiryType;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [enquiries, total, totalNew, totalRead, totalReplied, totalArchived] =
        await Promise.all([
          Enquiry.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
          Enquiry.countDocuments(query),
          Enquiry.countDocuments({ status: "new" }),
          Enquiry.countDocuments({ status: "read" }),
          Enquiry.countDocuments({ status: "replied" }),
          Enquiry.countDocuments({ status: "archived" }),
        ]);

      return res.status(200).json({
        success: true,
        data: enquiries,
        stats: {
          total: totalNew + totalRead + totalReplied + totalArchived,
          new: totalNew,
          read: totalRead,
          replied: totalReplied,
          archived: totalArchived,
        },
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Admin Enquiries GET Error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch enquiries." });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id, status, adminNotes } = req.body || {};

      if (!id) {
        return res.status(400).json({ success: false, message: "Enquiry ID is required." });
      }

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

      return res.status(200).json({
        success: true,
        message: "Enquiry updated successfully.",
        data: updatedEnquiry,
      });
    } catch (error) {
      console.error("Admin Enquiries PATCH Error:", error);
      return res.status(500).json({ success: false, message: "Failed to update enquiry." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, message: "Enquiry ID is required." });
      }

      const deleted = await Enquiry.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Enquiry not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Enquiry deleted successfully.",
      });
    } catch (error) {
      console.error("Admin Enquiries DELETE Error:", error);
      return res.status(500).json({ success: false, message: "Failed to delete enquiry." });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
