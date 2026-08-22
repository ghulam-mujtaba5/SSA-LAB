// pages/api/news-events/index.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../lib/mongoose";
import EventHighlight from "../../../models/EventHighlight";
import { createAuditLog } from "../../../lib/auditLog";
import slugify from "slugify";
import { validate } from "../../../lib/validation/validator";
import { createEventHighlightSchema } from "../../../lib/validation/schemas";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const {
        category,
        type,
        isGalleryItem,
        featured,
        published,
        year,
        search,
        page = 1,
        limit = 50,
      } = req.query;

      const query = {};

      if (published === "false") {
        query.published = false;
      } else if (published === "all") {
        // no published filter
      } else {
        query.published = true;
      }

      if (category && category !== "all") {
        query.category = category;
      }

      if (type && type !== "all") {
        if (type === "gallery") query.isGalleryItem = true;
        else if (type === "highlight") query.isGalleryItem = false;
      }

      if (isGalleryItem === "true") query.isGalleryItem = true;
      if (isGalleryItem === "false") query.isGalleryItem = false;
      if (featured === "true") query.featured = true;
      if (year) query.year = String(year);

      if (search) {
        const sanitized = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
          { title: { $regex: sanitized, $options: "i" } },
          { summary: { $regex: sanitized, $options: "i" } },
          { caption: { $regex: sanitized, $options: "i" } },
          { venue: { $regex: sanitized, $options: "i" } },
          { location: { $regex: sanitized, $options: "i" } },
        ];
      }

      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const skip = (safePage - 1) * safeLimit;

      const [events, total] = await Promise.all([
        EventHighlight.find(query)
          .sort({ displayOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .lean(),
        EventHighlight.countDocuments(query),
      ]);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        success: true,
        data: events,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit) || 1,
        },
      });
    } catch (error) {
      console.error("News & Events GET error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch news and events" });
    }
  }

  if (req.method === "POST") {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session || !["admin", "editor"].includes(session.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
    }

    try {
      const { title, summary, published: isPub, displayOrder } = req.body;
      if (!title || !summary) {
        return res.status(400).json({
          success: false,
          message: "Title and summary are required.",
        });
      }

      let slug = req.body.slug
        ? slugify(req.body.slug, { lower: true, strict: true })
        : slugify(`${req.body.category || "event"}-${title}`, { lower: true, strict: true });
      if (!slug) slug = `event-${Date.now()}`;

      const existing = await EventHighlight.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const event = await EventHighlight.create({
        ...req.body,
        slug,
        published: isPub !== undefined ? Boolean(isPub) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: "create",
        entity: "EventHighlight",
        entityId: event._id.toString(),
        details: `Event created: ${event.title}`,
      });

      return res.status(201).json({ success: true, data: event });
    } catch (error) {
      console.error("News & Event create error:", error);
      const status = error?.code === 11000 ? 409 : 400;
      return res.status(status).json({
        success: false,
        message: error?.message || "Failed to create event",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default validate(createEventHighlightSchema)(handler);
