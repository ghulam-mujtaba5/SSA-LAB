import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import ResearchDomain from '../../../../models/ResearchDomain';
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
          { description: { $regex: search, $options: 'i' } },
          { overview: { $regex: search, $options: 'i' } },
        ];
      }

      const domains = await ResearchDomain.find(query)
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();

      return res.status(200).json({ success: true, data: domains });
    } catch (error) {
      console.error('Research domains GET error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load research domains' });
    }
  }

  if (req.method === 'POST') {
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const { title, description, overview, number, graphicKey, image, keyProblems, currentDirections, caseStudies, coreTopics, toolsTechnologies, published, displayOrder } = req.body;
      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required.' });
      }

      let domainId = req.body.domainId ? slugify(req.body.domainId, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });
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
        domainId,
        slug,
        title,
        description,
        overview: overview || '',
        number: number || '01',
        graphicKey: graphicKey || domainId,
        image: image || '',
        keyProblems: Array.isArray(keyProblems) ? keyProblems : typeof keyProblems === 'string' ? keyProblems.split('\n').map((p) => p.trim()).filter(Boolean) : [],
        currentDirections: Array.isArray(currentDirections) ? currentDirections : typeof currentDirections === 'string' ? currentDirections.split('\n').map((d) => d.trim()).filter(Boolean) : [],
        caseStudies: Array.isArray(caseStudies) ? caseStudies : [],
        coreTopics: Array.isArray(coreTopics) ? coreTopics : typeof coreTopics === 'string' ? coreTopics.split(',').map((t) => t.trim()).filter(Boolean) : [],
        toolsTechnologies: Array.isArray(toolsTechnologies) ? toolsTechnologies : typeof toolsTechnologies === 'string' ? toolsTechnologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: 'create',
        entity: 'ResearchDomain',
        entityId: domain._id.toString(),
        details: `Research Domain created: ${domain.title}`,
      });

      return res.status(201).json({ success: true, data: domain });
    } catch (error) {
      console.error('Research domain POST error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create research domain' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
