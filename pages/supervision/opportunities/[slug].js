import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AcademicSiteLayout from "../../../components/AcademicSite/AcademicSiteLayout";
import AcademicFypCaseStudy from "../../../components/AcademicSite/AcademicFypCaseStudy";
import { defaultFypProjects } from "../../../data/fypProjects";
import dbConnect from "../../../lib/mongoose";
import FypProject from "../../../models/FypProject";
import styles from "../../../components/AcademicSite/AcademicSite.module.css";

export default function FypOpportunityDetailPage({ project, relatedProjects = [] }) {
  if (!project) {
    return (
      <AcademicSiteLayout
        title="Opportunity Not Found"
        path="/supervision"
        description="The requested supervision opportunity could not be found."
      >
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Supervision Opportunity Not Found</h2>
          <p style={{ margin: "16px 0 24px" }}>
            The requested supervision opportunity does not exist or may have been updated.
          </p>
          <Link href="/supervision" className={styles.primaryButton}>
            <ArrowLeft size={16} /> Return to Supervision Opportunities
          </Link>
        </div>
      </AcademicSiteLayout>
    );
  }

  return (
    <AcademicSiteLayout
      title={`${project.title} — Open Supervision Opportunity`}
      path={`/supervision/opportunities/${project.slug}`}
      description={project.summary || `Open Supervision Opportunity under Dr. Junaid Akram: ${project.title}`}
    >
      {/* Top Navigation & Breadcrumb */}
      <div className={styles.detailBreadcrumbBand}>
        <div className={styles.breadcrumbInner}>
          <Link href="/supervision" className={styles.breadcrumbBack}>
            <ArrowLeft size={16} /> Back to Supervision Directory
          </Link>
          <div className={styles.breadcrumbMeta}>
            <span>COMSATS Supervision Topic</span>
            <span>·</span>
            <span>Supervisor: Dr. Junaid Akram</span>
          </div>
        </div>
      </div>

      {/* Main Full Case Study / Opportunity Component */}
      <AcademicFypCaseStudy projects={[project]} />
    </AcademicSiteLayout>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params?.slug;

  try {
    await dbConnect();
    const dbProject = await FypProject.findOne({ slug, published: true }).lean();

    if (dbProject) {
      return {
        props: {
          project: JSON.parse(JSON.stringify(dbProject)),
        },
      };
    }
  } catch (error) {
    console.error("DB query fallback for opportunity detail:", error?.message);
  }

  // Fallback to static defaultFypProjects
  const project = defaultFypProjects.find((p) => p.slug === slug || String(p._id) === slug);

  return {
    props: {
      project: project || null,
    },
  };
}
