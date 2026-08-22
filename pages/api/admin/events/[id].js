import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import LabEvent from '../../../../models/LabEvent';
import { createAuditLog } from '../../../../lib/auditLog';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const event = await LabEvent.findById(id).lean();
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error retrieving event' });
    }
  }

  if (!session || !['admin', 'editor'].includes(session.role)) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, type, date, category, location, summary, caption, image, link, tags, featured, published, displayOrder } = req.body;
      const updateData = {
        title,
        type: type || 'highlight',
        date: date || '',
        category: category || 'General',
        location: location || '',
        summary: summary || '',
        caption: caption || '',
        image: image || '',
        link: link || '',
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      };

      if (tags !== undefined) {
        updateData.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
      }

      const updated = await LabEvent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });

      await createAuditLog({
        session,
        action: 'update',
        entity: 'LabEvent',
        entityId: id,
        details: `Event updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Event PUT error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to update event' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await LabEvent.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });

      await createAuditLog({
        session,
        action: 'delete',
        entity: 'LabEvent',
        entityId: id,
        details: `Event deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
