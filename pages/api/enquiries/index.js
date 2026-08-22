import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Enquiry from "../../../models/Enquiry";
import { createAuditLog } from "../../../lib/auditLog";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !["admin", "editor"].includes(token.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Admin or Editor access required." });
    }

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
      console.error("Enquiries GET Error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch enquiries." });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, email, degree, enquiryType, topic, message } = req.body || {};

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and message are required fields.",
        });
      }

      const ipAddress =
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "";

      const newEnquiry = new Enquiry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        degree: degree ? degree.trim() : "",
        enquiryType: enquiryType || "General",
        topic: topic ? topic.trim() : "",
        message: message.trim(),
        status: "new",
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      });

      await newEnquiry.save();

      return res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully.",
        data: newEnquiry,
      });
    } catch (error) {
      console.error("Enquiries POST Error:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to submit enquiry.",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
