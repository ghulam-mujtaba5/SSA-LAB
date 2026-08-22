import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "../../../../lib/mongoose";
import Project from "../../../../models/Project";
import FypProject from "../../../../models/FypProject";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }
  if (!["admin", "editor"].includes(session.user?.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      await dbConnect();
      const rangeDays = Math.max(0, parseInt(req.query.range || "0", 10) || 0);
      const now = new Date();
      const fromDate =
        rangeDays > 0
          ? new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000)
          : null;

      const fypStats = await FypProject.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const projectStats = await Project.aggregate([
        { $group: { _id: "$published", count: { $sum: 1 } } },
      ]);

      const dateMatch = fromDate
        ? { $match: { createdAt: { $gte: fromDate } } }
        : null;
      const fypByDate = await FypProject.aggregate([
        ...(dateMatch ? [dateMatch] : []),
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const projectsByDate = await Project.aggregate([
        ...(dateMatch ? [dateMatch] : []),
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // KPIs
      const [totalFyp, totalProjects] = await Promise.all([
        FypProject.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        Project.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
      ]);
      const [completedFyp, publishedProjects] = await Promise.all([
        FypProject.countDocuments(
          fromDate
            ? { status: "Completed", createdAt: { $gte: fromDate } }
            : { status: "Completed" },
        ),
        Project.countDocuments(
          fromDate
            ? { published: true, createdAt: { $gte: fromDate } }
            : { published: true },
        ),
      ]);

      // Tag breakdowns
      const projectTags = await Project.aggregate([
        { $unwind: { path: "$tags", preserveNullAndEmptyArrays: false } },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]);

      // Category breakdown (projects)
      const projectCategories = await Project.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Top viewed projects
      const topViewedFilter = fromDate ? { createdAt: { $gte: fromDate } } : {};
      const topViewedProjects = await Project.find(topViewedFilter)
        .sort({ views: -1 })
        .limit(5)
        .select("title slug views createdAt")
        .lean();

      // Recent projects
      const recentFilter = fromDate ? { createdAt: { $gte: fromDate } } : {};
      const recentProjects = await Project.find(recentFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug createdAt published")
        .lean();

      res.status(200).json({
        success: true,
        data: {
          articleStats: fypStats,
          projectStats,
          articlesByDate: fypByDate,
          projectsByDate,
          kpis: {
            totalArticles: totalFyp,
            totalProjects,
            publishedArticles: completedFyp,
            publishedProjects,
          },
          articleTags: projectTags,
          projectTags,
          projectCategories,
          topViewedArticles: topViewedProjects,
          topViewedProjects,
          recentArticles: recentProjects,
          recentProjects,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
