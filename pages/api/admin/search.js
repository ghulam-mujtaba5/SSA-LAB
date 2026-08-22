import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";
import FypProject from "../../../models/FypProject";
import Enquiry from "../../../models/Enquiry";
import User from "../../../models/User";
import Publication from "../../../models/Publication";
import Member from "../../../models/Member";
import ResearchDomain from "../../../models/ResearchDomain";
import EventHighlight from "../../../models/EventHighlight";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !["admin", "editor"].includes(token.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const { q = "", limit = 10, type = "all" } = req.query;
  const query = String(q).trim();
  if (!query)
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });

  try {
    await dbConnect();
    const sanitized = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(sanitized, "i");
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const results = [];

    // Search Projects
    if (type === "all" || type === "projects") {
      const projects = await Project.find({
        $or: [{ title: regex }, { tags: regex }, { category: regex }, { description: regex }],
      })
        .select({
          _id: 1,
          title: 1,
          slug: 1,
          published: 1,
          createdAt: 1,
          category: 1,
        })
        .limit(limitNum)
        .lean();

      projects.forEach(project => {
        results.push({
          ...project,
          type: "Project",
        });
      });
    }

    // Search FYP Projects
    if (type === "all" || type === "fyp" || type === "fypProjects") {
      const fypProjects = await FypProject.find({
        $or: [{ title: regex }, { summary: regex }, { tags: regex }, { academicYear: regex }],
      })
        .select({
          _id: 1,
          title: 1,
          slug: 1,
          status: 1,
          createdAt: 1,
          academicYear: 1,
        })
        .limit(limitNum)
        .lean();

      fypProjects.forEach(fyp => {
        results.push({
          ...fyp,
          type: "FypProject",
        });
      });
    }

    // Search Publications
    if (type === "all" || type === "publications") {
      const pubs = await Publication.find({
        $or: [{ title: regex }, { authors: regex }, { venue: regex }, { tags: regex }],
      })
        .select({
          _id: 1,
          title: 1,
          slug: 1,
          year: 1,
          venue: 1,
          published: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      pubs.forEach(p => {
        results.push({
          ...p,
          type: "Publication",
        });
      });
    }

    // Search Team Members
    if (type === "all" || type === "team" || type === "members") {
      const members = await Member.find({
        $or: [{ name: regex }, { role: regex }, { topic: regex }, { affiliation: regex }, { bio: regex }],
      })
        .select({
          _id: 1,
          name: 1,
          slug: 1,
          category: 1,
          role: 1,
          published: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      members.forEach(m => {
        results.push({
          ...m,
          title: m.name,
          type: "Member",
        });
      });
    }

    // Search Research Domains
    if (type === "all" || type === "research" || type === "researchDomains") {
      const domains = await ResearchDomain.find({
        $or: [{ title: regex }, { description: regex }, { overview: regex }],
      })
        .select({
          _id: 1,
          title: 1,
          domainId: 1,
          slug: 1,
          number: 1,
          published: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      domains.forEach(d => {
        results.push({
          ...d,
          type: "ResearchDomain",
        });
      });
    }

    // Search Events & Highlights
    if (type === "all" || type === "events" || type === "newsEvents") {
      const events = await EventHighlight.find({
        $or: [{ title: regex }, { summary: regex }, { location: regex }, { caption: regex }],
      })
        .select({
          _id: 1,
          title: 1,
          slug: 1,
          category: 1,
          published: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      events.forEach(e => {
        results.push({
          ...e,
          type: "EventHighlight",
        });
      });
    }

    // Search Enquiries
    if (type === "all" || type === "enquiries") {
      const enquiries = await Enquiry.find({
        $or: [{ name: regex }, { email: regex }, { topic: regex }, { message: regex }],
      })
        .select({
          _id: 1,
          name: 1,
          email: 1,
          topic: 1,
          status: 1,
          enquiryType: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      enquiries.forEach(enquiry => {
        results.push({
          ...enquiry,
          title: enquiry.topic || enquiry.name || enquiry.email,
          type: "Enquiry",
        });
      });
    }

    // Search Users (admin only)
    if ((type === "all" || type === "users") && token.role === "admin") {
      const users = await User.find({
        $or: [{ name: regex }, { email: regex }, { username: regex }],
      })
        .select({
          _id: 1,
          name: 1,
          username: 1,
          email: 1,
          role: 1,
          createdAt: 1,
        })
        .limit(limitNum)
        .lean();

      users.forEach(user => {
        results.push({
          ...user,
          title: user.name || (user.username ? `@${user.username}` : user.email),
          type: "User",
        });
      });
    }

    // Sort by relevance (title match first) and recency
    results.sort((a, b) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();
      const queryLower = query.toLowerCase();
      
      const aStartsWith = aTitle.startsWith(queryLower);
      const bStartsWith = bTitle.startsWith(queryLower);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Sort by date if both match equally
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      success: true,
      data: results.slice(0, limitNum),
    });
  } catch (error) {
    console.error("Admin Search API error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
