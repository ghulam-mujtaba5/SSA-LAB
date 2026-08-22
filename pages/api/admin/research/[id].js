import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import ResearchDomain from '../../../../models/ResearchDomain';
import { createAuditLog } from '../../../../lib/auditLog';

import mongoose from 'mongoose';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();
  const { id } = req.query;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { _id: id } : { $or: [{ slug: id }, { domainId: id }] };

  if (req.method === 'GET') {
    try {
      const domain = await ResearchDomain.findOne(filter).lean();
      if (!domain) return res.status(404).json({ success: false, message: 'Research domain not found' });
      return res.status(200).json({ success: true, data: domain });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error retrieving research domain' });
    }
  }

  if (!session || !['admin', 'editor'].includes(session.role)) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, overview, number, graphicKey, image, keyProblems, currentDirections, caseStudies, coreTopics, toolsTechnologies, published, displayOrder } = req.body;
      const updateData = {
        title,
        description,
        overview: overview || '',
        number: number || '01',
        graphicKey: graphicKey || '',
        image: image || '',
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      };

      if (keyProblems !== undefined) {
        updateData.keyProblems = Array.isArray(keyProblems) ? keyProblems : typeof keyProblems === 'string' ? keyProblems.split('\n').map((p) => p.trim()).filter(Boolean) : [];
      }
      if (currentDirections !== undefined) {
        updateData.currentDirections = Array.isArray(currentDirections) ? currentDirections : typeof currentDirections === 'string' ? currentDirections.split('\n').map((d) => d.trim()).filter(Boolean) : [];
      }
      if (caseStudies !== undefined) {
        updateData.caseStudies = Array.isArray(caseStudies) ? caseStudies : [];
      }
      if (coreTopics !== undefined) {
        updateData.coreTopics = Array.isArray(coreTopics) ? coreTopics : typeof coreTopics === 'string' ? coreTopics.split(',').map((t) => t.trim()).filter(Boolean) : [];
      }
      if (toolsTechnologies !== undefined) {
        updateData.toolsTechnologies = Array.isArray(toolsTechnologies) ? toolsTechnologies : typeof toolsTechnologies === 'string' ? toolsTechnologies.split(',').map((t) => t.trim()).filter(Boolean) : [];
      }

      const updated = await ResearchDomain.findOneAndUpdate(filter, { $set: updateData }, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Research domain not found' });

      await createAuditLog({
        session,
        action: 'update',
        entity: 'ResearchDomain',
        entityId: updated._id.toString(),
        details: `Research domain updated: ${updated.title}`,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Research domain PUT error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to update research domain' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await ResearchDomain.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ success: false, message: 'Research domain not found' });

      await createAuditLog({
        session,
        action: 'delete',
        entity: 'ResearchDomain',
        entityId: deleted._id.toString(),
        details: `Research domain deleted: ${deleted.title}`,
      });

      return res.status(200).json({ success: true, message: 'Research domain deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete research domain' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
