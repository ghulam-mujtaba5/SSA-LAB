import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AcademicSiteLayout from "../../../components/AcademicSite/AcademicSiteLayout";
import AcademicFypCaseStudy from "../../../components/AcademicSite/AcademicFypCaseStudy";
import { defaultFypProjects } from "../../../data/fypProjects";
import dbConnect from "../../../lib/mongoose";
import FypProject from "../../../models/FypProject";
import styles from "../../../components/AcademicSite/AcademicSite.module.css";

export default function FypCaseStudyDetailPage({ project, relatedProjects = [] }) {
  if (!project) {
    return (
      <AcademicSiteLayout
        title="Project Not Found"
        path="/supervision"
        description="The requested FYP case study could not be found."
      >
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Project Case Study Not Found</h2>
          <p style={{ margin: "16px 0 24px" }}>
            The requested final-year project case study does not exist or may have been updated.
          </p>
          <Link href="/supervision" className={styles.primaryButton}>
            <ArrowLeft size={16} /> Return to FYP Supervision List
          </Link>
        </div>
      </AcademicSiteLayout>
    );
  }

  return (
    <AcademicSiteLayout
      title={`${project.title} — Supervised FYP Case Study`}
      path={`/supervision/projects/${project.slug}`}
      description={project.summary || `Supervised Final Year Project case study: ${project.title}`}
    >
      {/* Top Navigation & Breadcrumb */}
      <div className={styles.detailBreadcrumbBand}>
        <div className={styles.breadcrumbInner}>
          <Link href="/supervision" className={styles.breadcrumbBack}>
            <ArrowLeft size={16} /> Back to FYP Supervision Directory
          </Link>
          <div className={styles.breadcrumbMeta}>
            <span>{project.session || "COMSATS FYP"}</span>
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
              <p className={styles.eyebrow}>Supervised FYP Portfolio</p>
              <h2>More Supervised Projects</h2>
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
      const allDb = await FypProject.find({ published: true, slug: { $ne: slug } })
        .limit(4)
        .lean();
      return {
        props: {
          project: JSON.parse(JSON.stringify(dbProject)),
          relatedProjects: JSON.parse(JSON.stringify(allDb)),
        },
      };
    }
  } catch (error) {
    console.error("DB query fallback for case study detail:", error?.message);
  }

  // Fallback to static defaultFypProjects
  const project = defaultFypProjects.find((p) => p.slug === slug || String(p._id) === slug);
  const relatedProjects = defaultFypProjects.filter((p) => p.slug !== slug);

  return {
    props: {
      project: project || null,
      relatedProjects: relatedProjects || [],
    },
  };
}
