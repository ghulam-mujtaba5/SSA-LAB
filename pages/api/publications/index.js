// pages/api/publications/index.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import Publication from "../../../models/Publication";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { createPublicationSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const {
        year,
        type,
        highlight,
        featured,
        published,
        search,
        page = 1,
        limit = 50,
        sortBy = "year",
        sortOrder = "desc",
      } = req.query;

      const query = {};

      // Public endpoint defaults to published: true unless explicitly specified by an authenticated request
      if (published === "false") {
        query.published = false;
      } else if (published === "all") {
        // no published filter
      } else {
        query.published = true;
      }

      if (year && year !== "all") {
        query.year = String(year);
      }

      if (type && type !== "all") {
        query.type = type;
      }

      if (highlight === "true") query.highlight = true;
      if (featured === "true") query.featured = true;

      if (search) {
        const sanitized = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
          { title: { $regex: sanitized, $options: "i" } },
          { authors: { $regex: sanitized, $options: "i" } },
          { venue: { $regex: sanitized, $options: "i" } },
          { abstract: { $regex: sanitized, $options: "i" } },
          { tags: { $regex: sanitized, $options: "i" } },
        ];
      }

      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const skip = (safePage - 1) * safeLimit;

      const sort =
        sortBy === "year"
          ? { year: sortOrder === "asc" ? 1 : -1, displayOrder: 1, createdAt: -1 }
          : { [sortBy]: sortOrder === "asc" ? 1 : -1, createdAt: -1 };

      const [publications, total] = await Promise.all([
        Publication.find(query).sort(sort).skip(skip).limit(safeLimit).lean(),
        Publication.countDocuments(query),
      ]);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        success: true,
        data: publications,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit) || 1,
        },
      });
    } catch (error) {
      console.error("Publications GET error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch publications" });
    }
  }

  if (req.method === "POST") {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
    }

    try {
      const {
        title,
        year,
        authors,
        venue,
        type,
        href,
        bibtex,
        abstract,
        pdfUrl,
        codeUrl,
        featured,
        published: isPub,
        tags,
        displayOrder,
      } = req.body;

      if (!title || !authors || !venue || !year) {
        return res.status(400).json({
          success: false,
          message: "Title, authors, venue, and year are required.",
        });
      }

      let slug = req.body.slug
        ? slugify(req.body.slug, { lower: true, strict: true })
        : slugify(`${year}-${title}`, { lower: true, strict: true });
      if (!slug) slug = `pub-${Date.now()}`;

      const existing = await Publication.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const publication = await Publication.create({
        title,
        slug,
        year: String(year),
        authors,
        venue,
        type: type || "Journal",
        href: href || "",
        bibtex: bibtex || "",
        abstract: abstract || "",
        pdfUrl: pdfUrl || "",
        codeUrl: codeUrl || "",
        featured: Boolean(featured),
        published: isPub !== undefined ? Boolean(isPub) : true,
        displayOrder: Number(displayOrder) || 0,
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: "create",
        entity: "Publication",
        entityId: publication._id.toString(),
        details: `Publication created: ${publication.title}`,
      });

      return res.status(201).json({ success: true, data: publication });
    } catch (error) {
      console.error("Publication create error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to create publication",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(createPublicationSchema)(handler);
