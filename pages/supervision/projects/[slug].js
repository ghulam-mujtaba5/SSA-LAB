import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AcademicSiteLayout from "../../../components/AcademicSite/AcademicSiteLayout";
import AcademicFypCaseStudy from "../../../components/AcademicSite/AcademicFypCaseStudy";
import { defaultFypProjects } from "../../../data/fypProjects";
import dbConnect from "../../../lib/mongoose";
import FypProject from "../../../models/FypProject";
import { breadcrumbSchema, softwareProjectSchema, scholarlyArticleSchema, faqSchema } from "../../../components/SEO";
import styles from "../../../components/AcademicSite/AcademicSite.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssa-lab.tech";

// Explicit semantic cross-linking maps for Tier A research topics
const SEMANTIC_RELATIONS = {
  "software-vulnerability-detection-llm-model": [
    "llm-based-vulnerability-patch-optimizer",
    "vulnerability-management-benchmarking-system",
    "xss-vulnerability-detection-defense",
    "token-based-semantic-code-clone-detection"
  ],
  "token-based-semantic-code-clone-detection": [
    "source-code-structure-capturing-recommendation",
    "feature-envy-detection-refactoring-system",
    "code-smell-detection-refactoring-system",
    "software-vulnerability-detection-llm-model"
  ],
  "llm-based-vulnerability-patch-optimizer": [
    "software-vulnerability-detection-llm-model",
    "vulnerability-management-benchmarking-system",
    "automatic-patching-similar-code-fragments",
    "token-based-semantic-code-clone-detection"
  ],
  "feature-envy-detection-refactoring-system": [
    "code-smell-detection-refactoring-system",
    "source-code-structure-capturing-recommendation",
    "token-based-semantic-code-clone-detection",
    "software-vulnerability-detection-llm-model"
  ],
  "robust-android-malware-detector": [
    "malware-feature-extraction-instruction-frequency",
    "malware-feature-extraction-machine-learning",
    "detection-and-defense-vulnerability-openssl",
    "software-vulnerability-detection-llm-model"
  ],
  "xss-vulnerability-detection-defense": [
    "software-vulnerability-detection-llm-model",
    "vulnerability-management-benchmarking-system",
    "detection-and-defense-vulnerability-openssl",
    "llm-based-vulnerability-patch-optimizer"
  ],
  "vulnerability-management-benchmarking-system": [
    "software-vulnerability-detection-llm-model",
    "building-benchmark-vulnerable-source-code",
    "llm-based-vulnerability-patch-optimizer",
    "xss-vulnerability-detection-defense"
  ],
  "source-code-structure-capturing-recommendation": [
    "feature-envy-detection-refactoring-system",
    "token-based-semantic-code-clone-detection",
    "intra-inter-project-software-dependency-analysis",
    "code-smell-detection-refactoring-system"
  ]
};

function getSmartRelatedProjects(currentSlug, allProjects) {
  const current = allProjects.find((p) => p.slug === currentSlug);
  const preferredSlugs = SEMANTIC_RELATIONS[currentSlug] || [];
  
  const preferred = preferredSlugs
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter(Boolean);

  const categoryMatches = allProjects.filter(
    (p) =>
      p.slug !== currentSlug &&
      !preferredSlugs.includes(p.slug) &&
      (p.category === current?.category || p.nature === current?.nature)
  );

  const remaining = allProjects.filter(
    (p) =>
      p.slug !== currentSlug &&
      !preferredSlugs.includes(p.slug) &&
      !categoryMatches.includes(p)
  );

  return [...preferred, ...categoryMatches, ...remaining].slice(0, 3);
}

export default function FypCaseStudyDetailPage({ project, relatedProjects = [] }) {
  if (!project) {
    return (
      <AcademicSiteLayout
        title="Project Not Found"
        path="/supervision"
        description="The requested project case study could not be found."
      >
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Project Case Study Not Found</h2>
          <p style={{ margin: "16px 0 24px" }}>
            The requested project case study does not exist or may have been updated.
          </p>
          <Link href="/supervision" className={styles.primaryButton}>
            <ArrowLeft size={16} /> Return to Supervision List
          </Link>
        </div>
      </AcademicSiteLayout>
    );
  }

  const projectKeywords = [
    project.title,
    ...(project.specializations || []),
    ...(project.technologies || []),
    project.nature || "Software Security Research",
    "COMSATS FYP Supervision",
    "Dr. Junaid Akram"
  ].join(", ");

  const projectCitations = [
    {
      title: project.title,
      authors: [
        project.supervisor || "Dr. Junaid Akram",
        ...(project.students || []).map((s) => (typeof s === "string" ? s : s.name)),
      ].filter(Boolean),
      year: project.session ? project.session.replace(/[^0-9]/g, "").slice(0, 4) || "2026" : "2026",
      venue: "COMSATS University Islamabad, Software Security Assessment Lab",
      href: `${SITE_URL}/supervision/projects/${project.slug}`,
      pdfUrl: project.reportUrl || undefined,
    },
  ];

  const projectJsonLd = [
    breadcrumbSchema([
      { name: "Supervision", url: `${SITE_URL}/supervision` },
      { name: project.title, url: `${SITE_URL}/supervision/projects/${project.slug}` },
    ]),
    softwareProjectSchema({
      name: project.title,
      description: project.summary || `Supervised software security project: ${project.title}`,
      url: `${SITE_URL}/supervision/projects/${project.slug}`,
      image: project.coverImage ? `${SITE_URL}${project.coverImage}` : undefined,
      programmingLanguages: project.technologies || project.techStack || [],
      keywords: projectKeywords,
    }),
    scholarlyArticleSchema({
      title: project.title,
      description: project.summary || `Supervised research case study: ${project.title}`,
      authors: [
        project.supervisor || "Dr. Junaid Akram",
        ...(project.students || []).map((s) => (typeof s === "string" ? s : s.name)),
      ].filter(Boolean),
      venue: "COMSATS University Islamabad, SSA Research Lab",
      year: project.session ? project.session.replace(/[^0-9]/g, "").slice(0, 4) || "2026" : "2026",
      href: `${SITE_URL}/supervision/projects/${project.slug}`,
      keywords: projectKeywords,
    }),
    faqSchema([
      {
        question: `What is the objective of the project "${project.title}"?`,
        answer: project.summary || `This project investigates ${project.title} within the Software Security Assessment Lab under the supervision of Dr. Junaid Akram.`,
      },
      {
        question: `Who conducted this research project?`,
        answer: `Supervised by ${project.supervisor || "Dr. Junaid Akram"} at COMSATS University Islamabad, Lahore Campus with student researchers ${(project.students || []).map((s) => (typeof s === "string" ? s : s.name)).join(", ") || "SSA Lab members"}.`,
      },
      {
        question: `What technologies and frameworks were utilized?`,
        answer: (project.technologies || project.techStack || []).join(", ") || "Python, Machine Learning, Program Analysis",
      },
    ]),
  ];

  const metaTitle = `${project.title} | Case Study`;
  const metaDescription = project.summary
    ? project.summary.length > 155
      ? `${project.summary.substring(0, 152)}...`
      : project.summary
    : `Research case study for ${project.title} supervised by Dr. Junaid Akram at SSA Research Lab.`;

  return (
    <AcademicSiteLayout
      title={metaTitle}
      path={`/supervision/projects/${project.slug}`}
      description={metaDescription}
      keywords={projectKeywords}
      jsonLd={projectJsonLd}
      citations={projectCitations}
    >
      {/* Top Navigation & Breadcrumb */}
      <div className={styles.detailBreadcrumbBand}>
        <div className={styles.breadcrumbInner}>
          <Link href="/supervision" className={styles.breadcrumbBack}>
            <ArrowLeft size={16} /> Back to Supervision Directory
          </Link>
          <div className={styles.breadcrumbMeta}>
            <span>{project.session || "COMSATS Supervision"}</span>
            <span>·</span>
            <span>{project.supervisor || "Dr. Junaid Akram"}</span>
          </div>
        </div>
      </div>

      {/* Main Full Case Study Component */}
      <AcademicFypCaseStudy projects={[project]} />

      {/* Related Projects Section */}
      {relatedProjects.length > 0 ? (
        <section className={`${styles.section} ${styles.softSection}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Supervised Projects Portfolio</p>
              <h2>Related Research & Supervised Projects</h2>
            </div>
            <Link href="/supervision" className={styles.textLink}>
              View all projects <ExternalLink size={15} />
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {relatedProjects.slice(0, 3).map((item) => (
              <article key={item.slug} className={styles.relatedCard}>
                <span className={styles.relatedBadge}>{item.category || item.status}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className={styles.relatedCardFooter}>
                  <small>
                    {(item.students || []).map((s) => s.name).join(", ")}
                  </small>
                  <Link href={`/supervision/projects/${item.slug}`} className={styles.cardLink}>
                    View Case Study <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </AcademicSiteLayout>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params?.slug;

  try {
    await dbConnect();
    const dbProject = await FypProject.findOne({ slug, published: true }).lean();

    if (dbProject) {
      const allDb = await FypProject.find({ published: true }).lean();
      const cleanAll = JSON.parse(JSON.stringify(allDb));
      const related = getSmartRelatedProjects(slug, cleanAll);

      return {
        props: {
          project: JSON.parse(JSON.stringify(dbProject)),
          relatedProjects: related,
        },
      };
    }
  } catch (error) {
    console.error("DB query fallback for case study detail:", error?.message);
  }

  // Fallback to static defaultFypProjects
  const project = defaultFypProjects.find((p) => p.slug === slug || String(p._id) === slug);
  const relatedProjects = getSmartRelatedProjects(slug, defaultFypProjects);

  return {
    props: {
      project: project || null,
      relatedProjects: relatedProjects || [],
    },
  };
}
