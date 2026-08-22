import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import Publication from '../../../../models/Publication';
import { createAuditLog } from '../../../../lib/auditLog';
import slugify from 'slugify';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const query = {};
      if (req.query.search) {
        const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { authors: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
        ];
      }
      if (req.query.type && req.query.type !== 'all') {
        query.type = req.query.type;
      }
      if (req.query.year) {
        query.year = req.query.year;
      }

      const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
      const publications = await Publication.find(query)
        .sort({ year: -1, displayOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();

      return res.status(200).json({ success: true, data: publications });
    } catch (error) {
      console.error('Publications GET error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load publications' });
    }
  }

  if (req.method === 'POST') {
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const { title, year, authors, venue, type, href, bibtex, abstract, pdfUrl, codeUrl, featured, published, tags } = req.body;
      if (!title || !authors || !venue || !year) {
        return res.status(400).json({ success: false, message: 'Title, authors, venue, and year are required.' });
      }

      let slug = req.body.slug ? slugify(req.body.slug, { lower: true, strict: true }) : slugify(`${year}-${title}`, { lower: true, strict: true });
      if (!slug) slug = `pub-${Date.now()}`;

      // ensure uniqueness
      const existing = await Publication.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const pub = await Publication.create({
        title,
        slug,
        year: String(year),
        authors,
        venue,
        type: type || 'Journal',
        href: href || '',
        bibtex: bibtex || '',
        abstract: abstract || '',
        pdfUrl: pdfUrl || '',
        codeUrl: codeUrl || '',
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: 'create',
        entity: 'Publication',
        entityId: pub._id.toString(),
        details: `Publication created: ${pub.title}`,
      });

      return res.status(201).json({ success: true, data: pub });
    } catch (error) {
      console.error('Publications POST error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create publication' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
