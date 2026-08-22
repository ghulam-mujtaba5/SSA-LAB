// pages/api/admin/projects.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      await dbConnect();

      const {
        page = 1,
        limit = 10,
        sortBy = "displayOrder",
        sortOrder = "asc",
        search = "",
        status = "",
        category = "",
        published: publishedFilter = "",
        featured = "",
      } = req.query;

      const query = {};
      if (search) {
        const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.title = { $regex: sanitizedSearch, $options: "i" };
      }
      if (status && status !== "all") {
        if (status === "published") {
          query.published = true;
        } else if (status === "draft") {
          query.published = false;
        } else {
          query.status = status;
        }
      }
      if (category && category !== "all" && category !== "All") {
        query.category = category;
      }
      // Support "published" and "featured" query filters from the admin UI
      if (publishedFilter === "true") query.published = true;
      else if (publishedFilter === "false") query.published = false;
      if (featured === "true") query.featuredOnHome = true;
      else if (featured === "false") query.featuredOnHome = false;

      // Use displayOrder as primary sort, with a secondary sort for ties
      const sort = sortBy === "displayOrder"
        ? { displayOrder: sortOrder === "desc" ? -1 : 1, createdAt: -1 }
        : { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const skip = (page - 1) * limit;

      const projects = await Project.find(query)
        .select({
          title: 1,
          slug: 1,
          status: 1,
          category: 1,
          published: 1,
          scheduledAt: 1,
          featuredOnHome: 1,
          pinned: 1,
          image: 1,
          description: 1,
          tags: 1,
          links: 1,
          displayOrder: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Project.countDocuments(query);

      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Failed to fetch projects for admin:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
