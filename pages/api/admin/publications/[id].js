import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import Publication from '../../../../models/Publication';
import { createAuditLog } from '../../../../lib/auditLog';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const pub = await Publication.findById(id).lean();
      if (!pub) return res.status(404).json({ success: false, message: 'Publication not found' });
      return res.status(200).json({ success: true, data: pub });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error retrieving publication' });
    }
  }

  if (!session || !['admin', 'editor'].includes(session.role)) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, year, authors, venue, type, href, bibtex, abstract, pdfUrl, codeUrl, featured, published, tags } = req.body;
      const updateData = {
        title,
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
        adminModified: true,
      };

      if (tags) {
        updateData.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      }

      const updated = await Publication.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Publication not found' });

      await createAuditLog({
        session,
        action: 'update',
        entity: 'Publication',
        entityId: id,
        details: `Publication updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Publication PUT error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to update publication' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await Publication.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Publication not found' });

      await createAuditLog({
        session,
        action: 'delete',
        entity: 'Publication',
        entityId: id,
        details: `Publication deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: 'Publication deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete publication' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
