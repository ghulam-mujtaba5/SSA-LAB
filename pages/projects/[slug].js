import React from "react";
import ProjectDetail from "../../components/Projects/ProjectDetail";
import AcademicSiteLayout from "../../components/AcademicSite/AcademicSiteLayout";
import { defaultFypProjects } from "../../data/fypProjects";
import dbConnect from "../../lib/mongoose";
import Project from "../../models/Project";
import FypProject from "../../models/FypProject";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../../components/AcademicSite/AcademicSite.module.css";

export default function ProjectSlugPage({ project }) {
  if (!project) {
    return (
      <AcademicSiteLayout
        title="Project Not Found"
        path="/projects"
        description="The requested project case study could not be found."
      >
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Project Case Study Not Found</h2>
          <p style={{ margin: "16px 0 24px" }}>
            The requested project does not exist or may have been updated.
          </p>
          <Link href="/projects" className={styles.primaryButton}>
            <ArrowLeft size={16} /> Return to Projects Portfolio
          </Link>
        </div>
      </AcademicSiteLayout>
    );
  }

  return (
    <AcademicSiteLayout
      title={`${project.title} — Project Case Study`}
      path={`/projects/${project.slug}`}
      description={project.summary || project.description || `Case study for ${project.title}`}
    >
      <ProjectDetail project={project} />
    </AcademicSiteLayout>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params?.slug;

  try {
    await dbConnect();
    const dbProject = await Project.findOne({ slug, published: true }).lean();

    if (dbProject) {
      return {
        props: {
          project: JSON.parse(JSON.stringify(dbProject)),
        },
      };
    }

    const dbFyp = await FypProject.findOne({ slug, published: true }).lean();
    if (dbFyp) {
      return {
        props: {
          project: JSON.parse(JSON.stringify(dbFyp)),
        },
      };
    }
  } catch (error) {
    console.error("Project lookup fallback:", error?.message || error);
  }

  const fallback = defaultFypProjects.find((p) => p.slug === slug) || null;

  return {
    props: {
      project: fallback ? JSON.parse(JSON.stringify(fallback)) : null,
    },
  };
}
