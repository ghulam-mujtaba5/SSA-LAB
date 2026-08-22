// pages/api/admin/stats.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";
import FypProject from "../../../models/FypProject";
import Enquiry from "../../../models/Enquiry";
import User from "../../../models/User";
import AuditLog from "../../../models/AuditLog";
import DailyStat from "../../../models/DailyStat";

import Publication from "../../../models/Publication";
import TeamMember from "../../../models/TeamMember";
import ResearchDomain from "../../../models/ResearchDomain";
import LabEvent from "../../../models/LabEvent";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ 
        success: false, 
        message: "Database connection failed. Please check server logs.",
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    try {
      const { startDate, endDate } = req.query;

      // Build the date filter for queries
      const dateFilter = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        dateFilter.$lte = endOfDay;
      }

      const auditLogQuery = AuditLog.find(
        Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name");

      let dailyStatQuery;
      if (Object.keys(dateFilter).length > 0) {
        dailyStatQuery = DailyStat.find({ date: dateFilter })
          .sort({ date: "asc" })
          .lean();
      } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dailyStatQuery = DailyStat.find({ date: { $gte: thirtyDaysAgo } })
          .sort({ date: "asc" })
          .lean();
      }

      let totalViews = 0;
      try {
        const totalViewsAggregation = await DailyStat.aggregate([
          {
            $match:
              Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {},
          },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]);
        totalViews =
          totalViewsAggregation.length > 0 ? totalViewsAggregation[0].total : 0;
      } catch (aggregationError) {
        console.error("Error in views aggregation:", aggregationError);
      }

      let projectCount = 0;
      let fypCount = 0;
      let enquiryCount = 0;
      let userCount = 0;
      let publicationCount = 0;
      let teamCount = 0;
      let domainCount = 0;
      let eventCount = 0;
      let recentActivity = [];
      let viewStats = [];

      try {
        [
          projectCount,
          fypCount,
          enquiryCount,
          userCount,
          publicationCount,
          teamCount,
          domainCount,
          eventCount,
          recentActivity,
          viewStats,
        ] = await Promise.all([
          Project.countDocuments().catch(() => 0),
          FypProject.countDocuments().catch(() => 0),
          Enquiry.countDocuments().catch(() => 0),
          User.countDocuments().catch(() => 0),
          Publication.countDocuments().catch(() => 0),
          TeamMember.countDocuments().catch(() => 0),
          ResearchDomain.countDocuments().catch(() => 0),
          LabEvent.countDocuments().catch(() => 0),
          auditLogQuery.catch(() => []),
          dailyStatQuery.catch(() => []),
        ]);
      } catch (promiseError) {
        console.error("Error in Promise.all:", promiseError);
      }

      res.status(200).json({
        success: true,
        data: {
          stats: {
            projects: projectCount,
            fypProjects: fypCount,
            enquiries: enquiryCount,
            users: userCount,
            publications: publicationCount,
            teamMembers: teamCount,
            researchDomains: domainCount,
            events: eventCount,
            newsEvents: eventCount,
            views: totalViews,
          },
          recentActivity,
          viewStats,
        },
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}