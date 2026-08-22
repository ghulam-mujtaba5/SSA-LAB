import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "../../../../lib/mongoose";
import Project from "../../../../models/Project";
import FypProject from "../../../../models/FypProject";
import Publication from "../../../../models/Publication";
import TeamMember from "../../../../models/TeamMember";
import ResearchDomain from "../../../../models/ResearchDomain";
import LabEvent from "../../../../models/LabEvent";
import Enquiry from "../../../../models/Enquiry";
import DailyStat from "../../../../models/DailyStat";

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

      const dateMatch = fromDate
        ? { $match: { createdAt: { $gte: fromDate } } }
        : null;

      const [
        fypStats,
        projectStats,
        pubStats,
        teamStats,
        enquiryStats,
        fypByDate,
        projectsByDate,
        pubsByDate,
      ] = await Promise.all([
        FypProject.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Project.aggregate([
          { $group: { _id: "$published", count: { $sum: 1 } } },
        ]),
        Publication.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]),
        TeamMember.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
        ]),
        Enquiry.aggregate([
          { $group: { _id: "$enquiryType", count: { $sum: 1 } } },
        ]),
        FypProject.aggregate([
          ...(dateMatch ? [dateMatch] : []),
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Project.aggregate([
          ...(dateMatch ? [dateMatch] : []),
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Publication.aggregate([
          ...(dateMatch ? [dateMatch] : []),
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      // KPIs
      const [
        totalFyp,
        totalProjects,
        totalPublications,
        totalTeam,
        totalDomains,
        totalEvents,
        totalEnquiries,
      ] = await Promise.all([
        FypProject.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        Project.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        Publication.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        TeamMember.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        ResearchDomain.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        LabEvent.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
        Enquiry.countDocuments(
          fromDate ? { createdAt: { $gte: fromDate } } : {},
        ),
      ]);

      const [completedFyp, publishedProjects, publishedPubs] = await Promise.all([
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
        Publication.countDocuments(
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
          fypStats,
          projectStats,
          pubStats,
          teamStats,
          enquiryStats,
          articlesByDate: fypByDate,
          fypByDate,
          projectsByDate,
          pubsByDate,
          kpis: {
            totalArticles: totalFyp,
            totalFyp,
            totalProjects,
            totalPublications,
            totalTeam,
            totalDomains,
            totalEvents,
            totalEnquiries,
            publishedArticles: completedFyp,
            publishedProjects,
            publishedPublications: publishedPubs,
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
      console.error("Admin analytics API error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
