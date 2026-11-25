import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import TeamMember from '../../../../models/TeamMember';
import { createAuditLog } from '../../../../lib/auditLog';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const member = await TeamMember.findById(id).lean();
      if (!member) return res.status(404).json({ success: false, message: 'Team member not found' });
      return res.status(200).json({ success: true, data: member });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error retrieving team member' });
    }
  }

  if (!session || !['admin', 'editor'].includes(session.role)) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const updateData = {
        ...req.body,
        category: req.body.category || 'pg-researcher',
        published: req.body.published !== undefined ? Boolean(req.body.published) : true,
        featured: Boolean(req.body.featured),
        displayOrder: Number(req.body.displayOrder) || 0,
        adminModified: true,
      };

      const updated = await TeamMember.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Team member not found' });

      await createAuditLog({
        session,
        action: 'update',
        entity: 'TeamMember',
        entityId: id,
        details: `Team member updated: ${updated.name}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Team PUT error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to update team member' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await TeamMember.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Team member not found' });

      await createAuditLog({
        session,
        action: 'delete',
        entity: 'TeamMember',
        entityId: id,
        details: `Team member deleted: ${deleted.name}`,
      });

      return res.status(200).json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete team member' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
