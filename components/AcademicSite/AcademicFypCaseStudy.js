import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";
import AcademicImageLightbox from "./AcademicImageLightbox";
import styles from "./AcademicFypCaseStudy.module.css";

const dimensions = {
  "/academic/fyp/megilance-final-year-project-poster.jpeg": [639, 1600],
  "/academic/fyp/megilance-landing-page.png": [1075, 876],
  "/academic/fyp/megilance-system-architecture.png": [974, 1713],
  "/academic/fyp/megilance-ai-fraud-analysis.png": [980, 1024],
  "/academic/fyp/megilance-client-dashboard.png": [1920, 886],
  "/academic/fyp/megilance-freelancer-earnings-dashboard.png": [1915, 890],
  "/academic/fyp/megilance-admin-command-center.png": [1909, 891],
  "/academic/fyp/megilance-ai-matching.png": [1916, 893],
  "/academic/fyp/megilance-ai-features.png": [2520, 1080],
};

function getDimensions(src, fallback = [1600, 900]) {
  return dimensions[src] || fallback;
}

export default function AcademicFypCaseStudy({ projects = [] }) {
  if (!projects || !projects.length) return null;
  const featured = projects.find((project) => project.featured) || projects[0];
  const isOpportunity =
    featured.isOpportunity ||
    featured.projectType === "Open FYP Opportunity" ||
    featured.projectType === "COMSATS FYP Opportunity";

  const [coverWidth, coverHeight] = getDimensions(featured.coverImage, [900, 1200]);
  const studentsList = (featured.students || []).filter(
    (s) => s.name && s.name !== "Available COMSATS FYP Group"
  );

  return (
    <section className={styles.caseStudy}>
      {/* Header Intro */}
      <div className={styles.caseIntro}>
        <div className={styles.caseCopy}>
          <p className={styles.eyebrow}>
            {isOpportunity ? "Open Supervision Topic" : "Supervised Student Project"}
          </p>
          <div className={styles.statusRow}>
            <span>{featured.status}</span>
            <span>{featured.session}</span>
            <span>{featured.programme}</span>
          </div>
          <h2>{featured.title}</h2>
          <p className={styles.summary}>{featured.summary}</p>
          <div className={styles.specializations}>
            {(featured.specializations || []).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          {featured.liveUrl ? (
            <a
              className={styles.liveLink}
              href={featured.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              View deployed project <ArrowUpRight size={16} />
            </a>
          ) : null}
        </div>
        {featured.coverImage ? (
          <div className={styles.poster}>
            <AcademicImageLightbox
              src={featured.coverImage}
              alt={featured.coverAlt || featured.title}
              width={coverWidth}
              height={coverHeight}
              caption={`${featured.title} — project poster`}
              priority
              sizes="(max-width: 780px) 92vw, 34vw"
            />
          </div>
        ) : null}
      </div>

      {/* Record Meta Bar */}
      <div className={styles.academicRecord}>
        <article>
          <Users size={21} />
          <span>{isOpportunity ? "Availability" : "Students"}</span>
          {isOpportunity ? (
            <p>
              <strong>Open for BS Supervision</strong>
              <small>COMSATS University Islamabad, Lahore</small>
            </p>
          ) : studentsList.length > 0 ? (
            studentsList.map((student) => (
              <p key={`${student.name}-${student.registration || ""}`}>
                <strong>{student.name}</strong>
                {student.registration ? <small>{student.registration}</small> : null}
              </p>
            ))
          ) : (
            <p>
              <strong>Supervised Research Project</strong>
            </p>
          )}
        </article>

        <article>
          <GraduationCap size={22} />
          <span>Supervision</span>
          <p>
            <strong>{featured.supervisor || "Dr. Junaid Akram"}</strong>
            <small>Lead Supervisor</small>
          </p>
          {featured.coSupervisor ? (
            <p>
              <strong>{featured.coSupervisor}</strong>
              <small>Co-supervisor</small>
            </p>
          ) : null}
        </article>

        <article>
          <ShieldCheck size={21} />
          <span>Institution</span>
          <p>
            <strong>{featured.nature || "Software Security Research"}</strong>
            <small>{featured.institution || "COMSATS University Islamabad, Lahore Campus"}</small>
          </p>
        </article>
      </div>

      {/* Problem & Solution Block */}
      {featured.problem || featured.solution ? (
        <div className={styles.problemSolution}>
          {featured.problem ? (
            <article>
              <p className={styles.eyebrow}>
                {isOpportunity ? "Proposed research problem" : "Research problem"}
              </p>
              <h3>Problem Statement & Challenge</h3>
              <p>{featured.problem}</p>
            </article>
          ) : null}
          {featured.solution ? (
            <article>
              <p className={styles.eyebrow}>
                {isOpportunity ? "Proposed research methodology" : "Supervised solution"}
              </p>
              <h3>Methodology & Technical Approach</h3>
              <p>{featured.solution}</p>
            </article>
          ) : null}
        </div>
      ) : null}

      {/* Open FYP Opportunity Deliverables Section */}
      {isOpportunity && (
        <div className={styles.detailGrid}>
          {featured.expectedDeliverables && featured.expectedDeliverables.length > 0 ? (
            <article>
              <p className={styles.eyebrow}>Expected deliverables</p>
              <ul>
                {featured.expectedDeliverables.map((item) => (
                  <li key={item}>
                    <ShieldCheck size={17} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          <article>
            <p className={styles.eyebrow}>Supervision prerequisites</p>
            <h3>Recommended Prerequisites</h3>
            <p>{featured.prerequisites || "Strong programming and software engineering skills."}</p>
            <div className={styles.technologyList}>
              {(featured.technologies || []).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>

          <article>
            <p className={styles.eyebrow}>Source & Verification</p>
            <h3>Official Listing Details</h3>
            <p>
              <strong>Source:</strong> {featured.source || "Official COMSATS Supervision Listing"}
            </p>
            <p style={{ marginTop: "6px" }}>
              <strong>Last Verified:</strong> {featured.lastVerified || "July 2026"}
            </p>
            <div style={{ marginTop: "16px" }}>
              <Link href="/contact" className={styles.liveLink}>
                Request Supervision <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        </div>
      )}

      {/* System Architecture Section (Only if present in project data) */}
      {!isOpportunity && featured.architecture && featured.architecture.length > 0 ? (
        <div className={styles.architectureSection}>
          <div className={styles.architectureHeading}>
            <p className={styles.eyebrow}>System architecture</p>
            <h3>System Design & Component Layers</h3>
            <p>
              System breakdown and design separation between application engine, intelligence services, and data models.
            </p>
          </div>
          <div className={styles.architectureGrid}>
            {featured.architecture.map((stage, index) => (
              <article key={stage.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Layers3 size={20} />
                <h4>{stage.title}</h4>
                <p>{stage.detail}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {/* Implementation Screenshots (Only if present in project data) */}
      {!isOpportunity && featured.gallery && featured.gallery.length > 0 ? (
        <div className={styles.evidenceSection}>
          <div className={styles.evidenceHeading}>
            <div>
              <p className={styles.eyebrow}>Implementation evidence</p>
              <h3>Selected Screenshots & Visuals</h3>
            </div>
            <p>Click any visual to inspect at full size.</p>
          </div>
          <div className={styles.evidenceGrid}>
            {featured.gallery
              .slice()
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((image, index) => {
                const [width, height] = getDimensions(image.url);
                return (
                  <figure
                    key={`${image.url}-${index}`}
                    className={index === 0 || index === 5 ? styles.wideEvidence : undefined}
                  >
                    <AcademicImageLightbox
                      src={image.url}
                      alt={image.alt || image.caption || featured.title}
                      width={width}
                      height={height}
                      caption={image.caption}
                      className={styles.evidenceButton}
                      sizes="(max-width: 780px) 94vw, 42vw"
                    />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                );
              })}
          </div>
        </div>
      ) : null}

      {/* Completed Project Details Grid */}
      {!isOpportunity && (
        <div className={styles.detailGrid}>
          {featured.objectives && featured.objectives.length > 0 ? (
            <article>
              <p className={styles.eyebrow}>Project objectives</p>
              <ul>
                {featured.objectives.map((item) => (
                  <li key={item}>
                    <ShieldCheck size={17} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {featured.outcome ? (
            <article>
              <p className={styles.eyebrow}>Documented outcome</p>
              <h3>Project Results & Deliverables</h3>
              <p>{featured.outcome}</p>
              {featured.technologies && featured.technologies.length > 0 ? (
                <div className={styles.technologyList}>
                  {featured.technologies.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ) : null}

          {featured.contributions && featured.contributions.length > 0 ? (
            <article>
              <p className={styles.eyebrow}>Student contributions</p>
              <ul>
                {featured.contributions.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {featured.limitations && featured.limitations.length > 0 ? (
            <article>
              <p className={styles.eyebrow}>Research maturity</p>
              <h3>Documented Limitations</h3>
              <ul>
                {featured.limitations.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
