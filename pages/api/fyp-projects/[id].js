import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import { normalizeFypPayload } from "../../../lib/fypProjects";
import { createAuditLog } from "../../../lib/auditLog";
import FypProject from "../../../models/FypProject";

function getFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) return { _id: id };
  return {
    slug: String(id)
      .replace(/[^a-z0-9-]/gi, "")
      .slice(0, 180),
  };
}

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const canManage = session && ["admin", "editor"].includes(session.role);
  await dbConnect();

  if (req.method === "GET") {
    try {
      const filter = getFilter(id);
      if (!canManage) filter.published = true;
      const project = await FypProject.findOne(filter).lean();
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "FYP project not found",
        });
      }

      res.setHeader(
        "Cache-Control",
        canManage ? "private, no-store" : "public, s-maxage=120, stale-while-revalidate=600",
      );
      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      console.error("FYP project GET error:", error?.message || error);
      return res.status(500).json({
        success: false,
        message: "Failed to load FYP project",
      });
    }
  }

  if (!["PUT", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!canManage) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const filter = getFilter(id);

    if (req.method === "PUT") {
      const payload = normalizeFypPayload(req.body);
      const project = await FypProject.findOneAndUpdate(filter, payload, {
        new: true,
        runValidators: true,
      });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "FYP project not found",
        });
      }

      await createAuditLog({
        session,
        action: "update",
        entity: "FypProject",
        entityId: project._id.toString(),
        details: `FYP project updated: ${project.title}`,
      });

      return res.status(200).json({ success: true, data: project });
    }

    const project = await FypProject.findOneAndDelete(filter);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "FYP project not found",
      });
    }

    await createAuditLog({
      session,
      action: "delete",
      entity: "FypProject",
      entityId: project._id.toString(),
      details: `FYP project deleted: ${project.title}`,
    });

    return res.status(204).end();
  } catch (error) {
    console.error("FYP project mutation error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to update FYP project",
    });
  }
}

