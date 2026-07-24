import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import { normalizeFypPayload } from "../../../lib/fypProjects";
import { createAuditLog } from "../../../lib/auditLog";
import FypProject from "../../../models/FypProject";

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();

  if (req.method === "GET") {
    try {
      const canManage = session && ["admin", "editor"].includes(session.role);
      const query = canManage && req.query.admin === "true"
        ? {}
        : { published: true };

      if (req.query.status) query.status = String(req.query.status).slice(0, 40);
      if (req.query.search) {
        query.$text = { $search: String(req.query.search).slice(0, 120) };
      }

      const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
      const projects = await FypProject.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      res.setHeader(
        "Cache-Control",
        canManage ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=300",
      );
      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      console.error("FYP projects GET error:", error?.message || error);
      return res.status(500).json({
        success: false,
        message: "Failed to load FYP projects",
      });
    }
  }

  if (req.method === "POST") {
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    try {
      const payload = normalizeFypPayload(req.body);
      if (!payload.title || !payload.summary || !payload.slug) {
        return res.status(400).json({
          success: false,
          message: "Title and summary are required.",
        });
      }

      const project = await FypProject.create(payload);
      await createAuditLog({
        session,
        action: "create",
        entity: "FypProject",
        entityId: project._id.toString(),
        details: `FYP project created: ${project.title}`,
      });

      return res.status(201).json({ success: true, data: project });
    } catch (error) {
      const duplicate = error?.code === 11000;
      console.error("FYP projects POST error:", error?.message || error);
      return res.status(duplicate ? 409 : 400).json({
        success: false,
        message: duplicate
          ? "An FYP project with this title already exists."
          : error?.message || "Failed to create FYP project",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

