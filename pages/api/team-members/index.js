// pages/api/team-members/index.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Member from "../../../models/Member";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { createMemberSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const {
        category,
        status,
        published,
        search,
        page = 1,
        limit = 100,
      } = req.query;

      const query = {};

      if (published === "false") {
        query.published = false;
      } else if (published === "all") {
        // no published filter
      } else {
        query.published = true;
      }

      if (status && status !== "all") {
        query.status = status;
      }

      if (category && category !== "all") {
        const cat = category.toLowerCase();
        if (cat === "junior" || cat === "junior_collaborator" || cat === "junior-collaborator" || cat === "junior-researcher" || cat === "junior_researcher") {
          query.category = { $in: ["junior-collaborator", "junior_collaborator", "junior-researcher", "junior_researcher"] };
        } else if (cat === "pg_researcher" || cat === "pg-researcher") {
          query.category = { $in: ["pg_researcher", "pg-researcher"] };
        } else if (cat === "co_investigator" || cat === "co-investigator" || cat === "faculty") {
          query.category = { $in: ["co_investigator", "co-investigator", "faculty"] };
        } else if (cat === "alumni" || cat === "alumnus") {
          query.category = { $in: ["alumni", "alumnus"] };
        } else {
          query.category = category;
        }
      }

      if (search) {
        const sanitized = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
          { name: { $regex: sanitized, $options: "i" } },
          { role: { $regex: sanitized, $options: "i" } },
          { topic: { $regex: sanitized, $options: "i" } },
          { specialization: { $regex: sanitized, $options: "i" } },
          { affiliation: { $regex: sanitized, $options: "i" } },
          { bio: { $regex: sanitized, $options: "i" } },
        ];
      }

      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);
      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const skip = (safePage - 1) * safeLimit;

      const [members, total] = await Promise.all([
        Member.find(query)
          .sort({ displayOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .lean(),
        Member.countDocuments(query),
      ]);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        success: true,
        data: members,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit) || 1,
        },
      });
    } catch (error) {
      console.error("Team members GET error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch team members" });
    }
  }

  if (req.method === "POST") {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
    }

    try {
      const { name, category, role, published: isPub, displayOrder } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: "Name is required." });
      }

      let slug = req.body.slug
        ? slugify(req.body.slug, { lower: true, strict: true })
        : slugify(`${category || "member"}-${name}`, { lower: true, strict: true });
      if (!slug) slug = `member-${Date.now()}`;

      const existing = await Member.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const member = await Member.create({
        ...req.body,
        slug,
        category: category || "pg-researcher",
        published: isPub !== undefined ? Boolean(isPub) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: "create",
        entity: "Member",
        entityId: member._id.toString(),
        details: `Team member created: ${member.name} (${member.category})`,
      });

      return res.status(201).json({ success: true, data: member });
    } catch (error) {
      console.error("Team member create error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to create team member",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(createMemberSchema)(handler);
