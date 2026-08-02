import dbConnect from "../../lib/mongoose";
import Enquiry from "../../models/Enquiry";
import { sendEmail, buildEnquiryEmailHtml } from "../../lib/resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, email, degree, enquiryType, topic, message } = req.body || {};

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full Name is required." });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "A valid email address is required." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message content is required." });
    }

    await dbConnect();

    // Capture IP address if available
    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "";

    // 1. Save Enquiry to MongoDB
    const newEnquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      degree: degree ? degree.trim() : "",
      enquiryType: enquiryType || "General",
      topic: topic ? topic.trim() : "",
      message: message.trim(),
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      status: "new",
    });

    // 2. Dispatch Email via Resend to recipient
    const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "ssalab0101@gmail.com";
    const emailSubject = `[SCSA Lab] ${newEnquiry.enquiryType}: ${newEnquiry.name} ${newEnquiry.topic ? `- ${newEnquiry.topic}` : ""}`;
    const emailHtml = buildEnquiryEmailHtml({
      name: newEnquiry.name,
      email: newEnquiry.email,
      degree: newEnquiry.degree,
      enquiryType: newEnquiry.enquiryType,
      topic: newEnquiry.topic,
      message: newEnquiry.message,
      createdAt: newEnquiry.createdAt,
    });

    // Asynchronously or await email dispatch
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been successfully submitted.",
      data: {
        id: newEnquiry._id,
        createdAt: newEnquiry.createdAt,
        emailSent: emailResult.success,
      },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to process enquiry.",
    });
  }
}
