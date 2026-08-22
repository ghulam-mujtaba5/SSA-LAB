// pages/api/research-domains/index.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import ResearchDomain from "../../../models/ResearchDomain";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { createResearchDomainSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { published, search, page = 1, limit = 50 } = req.query;

      const query = {};
      if (published === "false") {
        query.published = false;
      } else if (published === "all") {
        // no published filter
      } else {
        query.published = true;
      }

      if (search) {
        const sanitized = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
          { title: { $regex: sanitized, $options: "i" } },
          { description: { $regex: sanitized, $options: "i" } },
          { overview: { $regex: sanitized, $options: "i" } },
          { coreTopics: { $regex: sanitized, $options: "i" } },
        ];
      }

      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const skip = (safePage - 1) * safeLimit;

      const [domains, total] = await Promise.all([
        ResearchDomain.find(query)
          .sort({ displayOrder: 1, createdAt: 1 })
          .skip(skip)
          .limit(safeLimit)
          .lean(),
        ResearchDomain.countDocuments(query),
      ]);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        success: true,
        data: domains,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit) || 1,
        },
      });
    } catch (error) {
      console.error("Research domains GET error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch research domains" });
    }
  }

  if (req.method === "POST") {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
    }

    try {
      const { title, description, published: isPub, displayOrder } = req.body;
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required.",
        });
      }

      let domainId = req.body.domainId
        ? slugify(req.body.domainId, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });
      if (!domainId) domainId = `domain-${Date.now()}`;

      let slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : domainId;
      if (!slug) slug = domainId;

      const existing = await ResearchDomain.findOne({ $or: [{ domainId }, { slug }] });
      if (existing) {
        const suffix = Math.floor(Math.random() * 1000);
        domainId = `${domainId}-${suffix}`;
        slug = `${slug}-${suffix}`;
      }

      const domain = await ResearchDomain.create({
        ...req.body,
        domainId,
        slug,
        published: isPub !== undefined ? Boolean(isPub) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: "create",
        entity: "ResearchDomain",
        entityId: domain._id.toString(),
        details: `Research Domain created: ${domain.title}`,
      });

      return res.status(201).json({ success: true, data: domain });
    } catch (error) {
      console.error("Research domain create error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to create research domain",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(createResearchDomainSchema)(handler);
