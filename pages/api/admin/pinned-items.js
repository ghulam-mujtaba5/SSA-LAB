import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";

async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  await dbConnect();

  try {
    const { includeUnpinned, q } = req.query;

    const pinnedProjects = await Project.find({ pinned: true })
      .select("title slug description image published updatedAt pinned tags category")
      .sort({ updatedAt: -1 })
      .lean();

    const items = [
      ...pinnedProjects.map((p) => ({ ...p, type: "project" })),
    ];

    // Sort combined items by when they were last updated (most recent first)
    items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    let candidates = [];
    if (includeUnpinned === "true") {
      const searchRegex = q ? new RegExp(String(q).trim(), "i") : null;
      const projectFilter = { pinned: { $ne: true } };

      if (searchRegex) {
        projectFilter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ];
      }

      const unpinnedProjects = await Project.find(projectFilter)
        .select("title slug description image published updatedAt pinned tags")
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();
      candidates.push(
        ...unpinnedProjects.map((p) => ({ ...p, type: "project" })),
      );
    }

    res.status(200).json({
      success: true,
      data: items,
      candidates,
      stats: {
        total: items.length,
        projects: pinnedProjects.length,
      },
    });
  } catch (error) {
    console.error("Error fetching pinned items:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export default handler;
