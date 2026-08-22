import dbConnect from '../../../lib/mongoose';
import LabProfile from '../../../models/LabProfile';
import Publication from '../../../models/Publication';
import TeamMember from '../../../models/TeamMember';
import ResearchDomain from '../../../models/ResearchDomain';
import LabEvent from '../../../models/LabEvent';
import Project from '../../../models/Project';
import FypProject from '../../../models/FypProject';

import * as staticAcademicData from '../../../data/academicSite';
import { defaultFypProjects as staticFypProjects } from '../../../data/fypProjects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    // Fetch from MongoDB in parallel
    const [profileDoc, pubDocs, teamDocs, domainDocs, eventDocs, projectDocs, fypDocs] = await Promise.all([
      LabProfile.findOne({ key: 'default' }).lean().catch(() => null),
      Publication.find({ published: true }).sort({ year: -1, displayOrder: 1, createdAt: -1 }).lean().catch(() => []),
      TeamMember.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean().catch(() => []),
      ResearchDomain.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 }).lean().catch(() => []),
      LabEvent.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean().catch(() => []),
      Project.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean().catch(() => []),
      FypProject.find({ published: true }).sort({ displayOrder: 1, createdAt: -1 }).lean().catch(() => []),
    ]);

    // Format profile
    const academicProfile = profileDoc
      ? {
          name: profileDoc.name || staticAcademicData.academicProfile.name,
          shortName: profileDoc.shortName || staticAcademicData.academicProfile.shortName,
          role: profileDoc.role || staticAcademicData.academicProfile.role,
          institution: profileDoc.institution || staticAcademicData.academicProfile.institution,
          lab: profileDoc.lab || staticAcademicData.academicProfile.lab,
          labShort: profileDoc.labShort || staticAcademicData.academicProfile.labShort,
          office: profileDoc.office || staticAcademicData.academicProfile.office,
          emails: profileDoc.emails?.length ? profileDoc.emails : staticAcademicData.academicProfile.emails,
          labEmail: profileDoc.labEmail || staticAcademicData.academicProfile.labEmail,
          googleScholar: profileDoc.googleScholar || staticAcademicData.academicProfile.googleScholar,
          linkedin: profileDoc.linkedin || staticAcademicData.academicProfile.linkedin,
          researchGate: profileDoc.researchGate || staticAcademicData.academicProfile.researchGate,
          orcid: profileDoc.orcid || staticAcademicData.academicProfile.orcid,
          officialProfile: profileDoc.officialProfile || staticAcademicData.academicProfile.officialProfile,
          officialFypIdeas: profileDoc.officialFypIdeas || staticAcademicData.academicProfile.officialFypIdeas,
          sourceSite: profileDoc.sourceSite || staticAcademicData.academicProfile.sourceSite,
          credentials: profileDoc.credentials?.length ? profileDoc.credentials : staticAcademicData.academicProfile.credentials,
          experience: profileDoc.experience?.length ? profileDoc.experience : staticAcademicData.academicProfile.experience,
          education: profileDoc.education?.length ? profileDoc.education : staticAcademicData.academicProfile.education,
        }
      : staticAcademicData.academicProfile;

    const labMilestones = profileDoc?.milestones?.length ? profileDoc.milestones : staticAcademicData.labMilestones;
    const labPillars = profileDoc?.pillars?.length ? profileDoc.pillars : staticAcademicData.labPillars;
    const labImpactStats = profileDoc?.impactStats?.length ? profileDoc.impactStats : staticAcademicData.labImpactStats;
    const partnerLogos = profileDoc?.partnerLogos?.length ? profileDoc.partnerLogos : staticAcademicData.partnerLogos;

    // Format publications
    const publications = pubDocs?.length ? pubDocs : staticAcademicData.publications;

    // Format team members by category
    const isPgResearcher = (c) => c === 'pg_researcher' || c === 'pg-researcher';
    const isCoInvestigator = (c) => c === 'co_investigator' || c === 'co-investigator' || c === 'faculty';
    const isAlumni = (c) => c === 'alumnus' || c === 'alumni';
    const isCollaborator = (c) => c === 'collaborator';

    const pgResearchers = teamDocs?.filter((t) => isPgResearcher(t.category)).length
      ? teamDocs.filter((t) => isPgResearcher(t.category))
      : staticAcademicData.pgResearchers;

    const coInvestigators = teamDocs?.filter((t) => isCoInvestigator(t.category)).length
      ? teamDocs.filter((t) => isCoInvestigator(t.category))
      : staticAcademicData.coInvestigators;

    const alumniPlacements = teamDocs?.filter((t) => isAlumni(t.category)).length
      ? teamDocs.filter((t) => isAlumni(t.category))
      : staticAcademicData.alumniPlacements;

    const collaborators = teamDocs?.filter((t) => isCollaborator(t.category)).length
      ? teamDocs.filter((t) => isCollaborator(t.category))
      : staticAcademicData.collaborators;

    // Format research domains
    const researchDomains = domainDocs?.length
      ? domainDocs.map((d) => ({
          id: d.domainId || d.slug,
          slug: d.slug,
          number: d.number,
          graphicKey: d.graphicKey || d.domainId || d.slug,
          title: d.title,
          image: d.image,
          description: d.description,
          overview: d.overview || d.description,
          keyProblems: d.keyProblems || [],
          currentDirections: d.currentDirections || [],
          relatedLabWork: d.relatedLabWork || { items: [], summary: "" },
          toolsAndDatasets: d.toolsAndDatasets || { items: [], summary: "" },
          projectIdeas: d.projectIdeas || [],
          caseStudies: d.caseStudies || [],
          coreTopics: d.coreTopics || [],
          toolsTechnologies: d.toolsTechnologies || [],
        }))
      : staticAcademicData.researchDomains;

    // Format events
    const highlightDocs = eventDocs?.filter((e) => !e.isGalleryItem && e.type !== 'gallery') || [];
    const galleryDocs = eventDocs?.filter((e) => e.isGalleryItem || e.type === 'gallery') || [];

    const eventHighlights = highlightDocs.length
      ? highlightDocs
      : staticAcademicData.eventHighlights;

    const eventGallery = galleryDocs.length
      ? galleryDocs
      : staticAcademicData.eventGallery;

    // Format projects
    const researchProjects = projectDocs?.filter((p) => p.projectType === 'Research').length
      ? projectDocs.filter((p) => p.projectType === 'Research')
      : staticAcademicData.researchProjects;

    const supervisedProjects = projectDocs?.filter((p) => p.projectType === 'Supervised').length
      ? projectDocs.filter((p) => p.projectType === 'Supervised')
      : staticAcademicData.supervisedProjects;

    // Format FYP projects & opportunities
    const fypProjects = fypDocs?.length ? fypDocs : staticFypProjects;

    const dynamicOpportunities = fypDocs?.filter(
      (p) => p.isOpportunity || p.categoryType === 'future' || p.status === 'Available for Supervision'
    ).map((p) => ({
      title: p.title,
      type: p.opportunityType || p.type || "COMSATS Listed Supervision Topic",
      availability: p.availability || (p.published ? "Available for supervision" : "Pending"),
      prerequisites: p.prerequisites || (p.technologies || []).join(', ') || "Software security, Python/C++",
      source: p.source || "SSA Research Lab",
      lastVerified: p.academicYear || "Current Academic Year",
      summary: p.summary || p.description || "",
      expectedDeliverables: Array.isArray(p.expectedDeliverables) && p.expectedDeliverables.length > 0
        ? p.expectedDeliverables
        : (p.objectives || []),
      slug: p.slug,
    }));

    const fypOpportunities = dynamicOpportunities?.length
      ? dynamicOpportunities
      : staticAcademicData.fypOpportunities;

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    return res.status(200).json({
      success: true,
      data: {
        academicProfile,
        researchDomains,
        researchProjects,
        publications,
        supervisedProjects,
        alumniPlacements,
        fypOpportunities,
        collaborators,
        eventHighlights,
        eventGallery,
        partnerLogos,
        pgResearchers,
        coInvestigators,
        labMilestones,
        labPillars,
        labImpactStats,
        fypProjects,
      },
    });
  } catch (error) {
    console.error('Dynamic site-data error:', error);
    // Return static data on error as ultimate resilient fallback
    return res.status(200).json({
      success: true,
      source: 'fallback',
      data: {
        ...staticAcademicData,
        fypProjects: staticFypProjects,
      },
    });
  }
}
