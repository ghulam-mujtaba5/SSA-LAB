// pages/api/admin/publications/import-bibtex.js
import { getToken } from "next-auth/jwt";
import dbConnect from "../../../../lib/mongoose";
import Publication from "../../../../models/Publication";
import { createAuditLog } from "../../../../lib/auditLog";
import slugify from "slugify";

/**
 * Robust BibTeX string parser
 */
function parseBibTeX(rawBibtex) {
  if (!rawBibtex || typeof rawBibtex !== "string") return [];

  const entries = [];
  // Regex to match @entryType{key, body}
  const entryRegex = /@([a-zA-Z]+)\s*\{\s*([^,]*),([\s\S]*?)(?=\n\s*@|\s*$)/g;
  let match;

  while ((match = entryRegex.exec(rawBibtex)) !== null) {
    const rawType = match[1].toLowerCase();
    const citeKey = match[2].trim();
    const body = match[3];

    // Determine type
    let type = "Conference";
    if (rawType === "article") type = "Journal";
    else if (rawType === "inproceedings" || rawType === "conference") type = "Conference";
    else if (rawType === "incollection" || rawType === "inbook" || rawType === "book") type = "Book Chapter";
    else if (rawType === "techreport" || rawType === "misc" || rawType === "unpublished") type = "Preprint";
    else if (rawType === "patent") type = "Patent";

    const fields = {};
    // Extract key = {val} or key = "val" or key = val
    const fieldRegex = /([a-zA-Z_-]+)\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|([^\s,]+))/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      const key = fieldMatch[1].toLowerCase();
      const val = (fieldMatch[2] !== undefined ? fieldMatch[2] : fieldMatch[3] !== undefined ? fieldMatch[3] : fieldMatch[4] || "")
        .replace(/\s+/g, " ")
        .trim();
      fields[key] = val;
    }

    const title = fields.title || citeKey || "Untitled Publication";
    const authors = fields.author || fields.authors || "Unknown Authors";
    const venue = fields.journal || fields.booktitle || fields.publisher || fields.institution || fields.school || "Academic Venue";
    const year = fields.year || String(new Date().getFullYear());
    const href = fields.url || (fields.doi ? `https://doi.org/${fields.doi}` : "");
    const abstract = fields.abstract || "";
    const pdfUrl = fields.pdf || fields.pdfurl || "";

    const rawEntry = match[0].trim();

    entries.push({
      title,
      authors,
      venue,
      year: String(year),
      type,
      href,
      abstract,
      pdfUrl,
      bibtex: rawEntry,
      tags: fields.keywords ? fields.keywords.split(/[,;]/).map((k) => k.trim()).filter(Boolean) : [],
    });
  }

  return entries;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session || !["admin", "editor"].includes(session.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  const rawBibtex = req.body?.bibtex || req.body?.content || req.body?.raw || req.body?.text;
  if (!rawBibtex || typeof rawBibtex !== "string" || !rawBibtex.trim()) {
    return res.status(400).json({
      success: false,
      message: "BibTeX text content is required.",
    });
  }

  try {
    await dbConnect();
    const parsedEntries = parseBibTeX(rawBibtex);

    if (!parsedEntries.length) {
      return res.status(400).json({
        success: false,
        message: "No valid BibTeX entries found in the provided text.",
      });
    }

    const imported = [];

    for (const item of parsedEntries) {
      let slug = slugify(`${item.year}-${item.title}`, { lower: true, strict: true });
      if (!slug) slug = `pub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const existing = await Publication.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
      }

      const pub = await Publication.create({
        ...item,
        slug,
        published: true,
        featured: false,
        adminModified: true,
      });

      imported.push(pub);
    }

    await createAuditLog({
      session,
      action: "create",
      entity: "Publication",
      details: `Imported ${imported.length} publications via BibTeX batch import`,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${imported.length} publication(s).`,
      count: imported.length,
      data: imported,
    });
  } catch (error) {
    console.error("BibTeX import error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to import BibTeX entries.",
    });
  }
}
