import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import LabEvent from '../../../../models/LabEvent';
import { createAuditLog } from '../../../../lib/auditLog';
import slugify from 'slugify';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const query = {};
      if (req.query.type && req.query.type !== 'all') {
        query.type = req.query.type;
      }
      if (req.query.search) {
        const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { caption: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ];
      }

      const events = await LabEvent.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error('Events GET error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load events' });
    }
  }

  if (req.method === 'POST') {
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const { title, type, date, category, location, summary, caption, image, link, tags, featured, published, displayOrder } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }

      let slug = slugify(`${type || 'event'}-${title}`, { lower: true, strict: true });
      if (!slug) slug = `event-${Date.now()}`;

      const existing = await LabEvent.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const event = await LabEvent.create({
        title,
        slug,
        type: type || 'highlight',
        date: date || '',
        category: category || 'General',
        location: location || '',
        summary: summary || '',
        caption: caption || '',
        image: image || '',
        link: link || '',
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: 'create',
        entity: 'LabEvent',
        entityId: event._id.toString(),
        details: `Event created: ${event.title} (${event.type})`,
      });

      return res.status(201).json({ success: true, data: event });
    } catch (error) {
      console.error('Event POST error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create event' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
