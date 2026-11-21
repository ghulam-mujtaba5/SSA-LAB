import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import TeamMember from '../../../../models/TeamMember';
import { createAuditLog } from '../../../../lib/auditLog';
import slugify from 'slugify';

export default async function handler(req, res) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const query = {};
      if (req.query.category && req.query.category !== 'all') {
        const cat = req.query.category;
        if (cat === 'junior' || cat === 'junior_collaborator' || cat === 'junior-collaborator' || cat === 'junior-researcher' || cat === 'junior_researcher') {
          query.category = { $in: ['junior-collaborator', 'junior_collaborator', 'junior-researcher', 'junior_researcher'] };
        } else if (cat === 'pg_researcher' || cat === 'pg-researcher') {
          query.category = { $in: ['pg_researcher', 'pg-researcher'] };
        } else if (cat === 'co_investigator' || cat === 'co-investigator' || cat === 'faculty') {
          query.category = { $in: ['co_investigator', 'co-investigator', 'faculty'] };
        } else if (cat === 'alumni' || cat === 'alumnus') {
          query.category = { $in: ['alumni', 'alumnus'] };
        } else {
          query.category = cat;
        }
      }
      if (req.query.search) {
        const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
          { topic: { $regex: search, $options: 'i' } },
          { affiliation: { $regex: search, $options: 'i' } },
        ];
      }

      const members = await TeamMember.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      return res.status(200).json({ success: true, data: members });
    } catch (error) {
      console.error('Team GET error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load team members' });
    }
  }

  if (req.method === 'POST') {
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const { name, category, role, degree, university, affiliation, period, placement, currentPosition, year, topic, focus, researchGroup, expertise, collaborationArea, country, bio, image, socialLinks, publications, published, displayOrder } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
      }

      let slug = slugify(`${category || 'team'}-${name}`, { lower: true, strict: true });
      if (!slug) slug = `member-${Date.now()}`;

      const existing = await TeamMember.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const member = await TeamMember.create({
        name,
        slug,
        category: category || 'pg_researcher',
        role: role || '',
        degree: degree || '',
        university: university || '',
        affiliation: affiliation || '',
        period: period || '',
        placement: placement || '',
        currentPosition: currentPosition || '',
        year: year || '',
        topic: topic || '',
        focus: focus || '',
        researchGroup: researchGroup || '',
        expertise: Array.isArray(expertise) ? expertise : typeof expertise === 'string' ? expertise.split(',').map((e) => e.trim()).filter(Boolean) : [],
        collaborationArea: collaborationArea || '',
        country: country || '',
        bio: bio || '',
        image: image || '',
        socialLinks: socialLinks || {},
        publications: Array.isArray(publications) ? publications : typeof publications === 'string' ? publications.split('\n').map((p) => p.trim()).filter(Boolean) : [],
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
        adminModified: true,
      });

      await createAuditLog({
        session,
        action: 'create',
        entity: 'TeamMember',
        entityId: member._id.toString(),
        details: `Team member created: ${member.name} (${member.category})`,
      });

      return res.status(201).json({ success: true, data: member });
    } catch (error) {
      console.error('Team POST error:', error);
      return res.status(400).json({ success: false, message: error?.message || 'Failed to create team member' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
