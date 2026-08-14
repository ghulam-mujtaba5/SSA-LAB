import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Article from "../../../models/Article";
import Project from "../../../models/Project";

async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "'items' array is required." });
  }

  try {
    await dbConnect();

    // We persist order by setting updatedAt in descending order for the provided sequence.
    // First item gets most recent timestamp, next gets slightly older, etc.
    const now = Date.now();
    const opsArticles = [];
    const opsProjects = [];

    items.forEach((it, idx) => {
      const ts = new Date(now - idx * 1000); // ensure distinct 1-second timestamps
      const targetId = it.id || it._id;
      if (!targetId) return;

      if (it?.type === "article") {
        opsArticles.push({
          updateOne: {
            filter: { _id: targetId },
            update: { $set: { updatedAt: ts, pinned: true } },
          },
        });
      } else if (it?.type === "project") {
        opsProjects.push({
          updateOne: {
            filter: { _id: targetId },
            update: { $set: { updatedAt: ts, pinned: true } },
          },
        });
      }
    });

    if (opsArticles.length) {
      await Article.bulkWrite(opsArticles, { ordered: false });
    }
    if (opsProjects.length) {
      await Project.bulkWrite(opsProjects, { ordered: false });
    }

    return res.status(200).json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error reordering pinned items:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

export default handler;
