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
import ProjectGallerySlider from "./ProjectGallerySlider";
import styles from "./AcademicFypCaseStudy.module.css";

const dimensions = {
  "/academic/fyp/ai-dermatologist-poster.webp": [2304, 5760],
  "/academic/fyp/apneaguard-dashboard.webp": [1408, 768],
  "/academic/fyp/apneaguard-mobile-interface.webp": [720, 1472],
  "/academic/fyp/apneaguard-poster.webp": [730, 1718],
  "/academic/fyp/apneaguard-telemetry-monitor.webp": [1024, 559],
  "/academic/fyp/code-clone-ast-similarity.webp": [1262, 1346],
  "/academic/fyp/code-clone-semantic-benchmark.webp": [1682, 1822],
  "/academic/fyp/code-clone-token-pipeline.webp": [1024, 768],
  "/academic/fyp/code-smell-analysis-pipeline.webp": [1920, 909],
  "/academic/fyp/code-smell-detection-poster.webp": [1312, 3264],
  "/academic/fyp/code-smell-evaluation-dashboard.webp": [1920, 909],
  "/academic/fyp/code-smell-refactoring-engine.webp": [1920, 909],
  "/academic/fyp/cric-craft-player-biomechanics.webp": [1880, 906],
  "/academic/fyp/cric-craft-video-annotation.webp": [1919, 782],
  "/academic/fyp/cric-craft-vision-analytics.webp": [3840, 2160],
  "/academic/fyp/feature-envy-ast-refactoring-graph.webp": [1166, 1776],
  "/academic/fyp/feature-envy-detection-matrix.webp": [1492, 1660],
  "/academic/fyp/feature-envy-gnn-architecture.webp": [1336, 530],
  "/academic/fyp/llm-patch-cve-repair-benchmarks.webp": [1019, 818],
  "/academic/fyp/llm-patch-docker-validation.webp": [1263, 1280],
  "/academic/fyp/llm-patch-prompt-architecture.webp": [1260, 428],
  "/academic/fyp/megilance-admin-command-center.png": [1909, 891],
  "/academic/fyp/megilance-ai-features.png": [2520, 1080],
  "/academic/fyp/megilance-ai-fraud-analysis.png": [980, 1024],
  "/academic/fyp/megilance-ai-matching.png": [1916, 893],
  "/academic/fyp/megilance-client-dashboard.png": [1920, 886],
  "/academic/fyp/megilance-final-year-project-poster.jpeg": [639, 1600],
  "/academic/fyp/megilance-freelancer-earnings-dashboard.png": [1915, 890],
  "/academic/fyp/megilance-landing-page.png": [1075, 876],
  "/academic/fyp/megilance-system-architecture.png": [974, 1713],
  "/academic/fyp/multisense-acoustic-biomarkers.webp": [1536, 1024],
  "/academic/fyp/multisense-screening-dashboard.webp": [1672, 941],
  "/academic/fyp/multisense-video-landmark-attention.webp": [1536, 1024],
  "/academic/fyp/robust-android-malware-detector-poster.webp": [4800, 12000],
  "/academic/fyp/robust-android-malware-risk-analysis.webp": [1502, 1548],
  "/academic/fyp/robust-android-malware-security-dashboard.webp": [1524, 1184],
  "/academic/fyp/robust-android-malware-uploaded-apps.webp": [1538, 1166],
  "/academic/fyp/source-code-structure-poster.webp": [3000, 7500],
  "/academic/fyp/source-structure-architecture.webp": [3840, 2160],
  "/academic/fyp/source-structure-component-map.webp": [1724, 909],
  "/academic/fyp/source-structure-dependency-graph.webp": [1744, 906],
  "/academic/fyp/test-data-gen-architecture.webp": [2048, 1152],
  "/academic/fyp/test-data-gen-coverage-dashboard.webp": [1343, 766],
  "/academic/fyp/test-data-gen-mutation-synthesis.webp": [1254, 1254],
  "/academic/fyp/test-data-generation-poster.webp": [2400, 6000],
  "/academic/fyp/vbs-benchmark-dashboard.webp": [1920, 909],
  "/academic/fyp/vbs-cve-evaluation.webp": [1920, 909],
  "/academic/fyp/vbs-patch-pipeline.webp": [1920, 1080],
  "/academic/fyp/vuln-detect-ast-prompt-tuning.webp": [1224, 1698],
  "/academic/fyp/vuln-detect-benchmark-evaluation.webp": [1335, 1484],
  "/academic/fyp/vuln-detect-llm-pipeline.webp": [1045, 669],
  "/academic/fyp/vulnerability-patch-recommendation-poster.webp": [2304, 5760],
  "/academic/fyp/xss-sniper-attack-analysis.webp": [1917, 943],
  "/academic/fyp/xss-sniper-dashboard.webp": [1918, 877],
  "/academic/fyp/xss-sniper-scan-results.webp": [1329, 804],
  "/academic/fyp/xss-vulnerability-poster.webp": [4800, 12000],
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
          <h1>{featured.title}</h1>
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
              <strong>{featured.availability || "Open for Supervision"}</strong>
              <small>{featured.targetAudience || featured.programme || "BSc / BEng / MSc / PhD Supervision"}</small>
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
            <strong>{featured.supervisor || "Dr. Junaid Akram, PhD"}</strong>
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
            <small>{featured.institution || (isOpportunity ? "University of Nottingham Ningbo China" : "SSA Research Lab")}</small>
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

          {featured.suitability ? (
            <article>
              <p className={styles.eyebrow}>Candidate & Project Suitability</p>
              <h3>Project Suitability & Academic Fit</h3>
              <p>
                {typeof featured.suitability === "string"
                  ? featured.suitability
                  : featured.suitability.idealCandidate || featured.suitability.background}
              </p>
              {typeof featured.suitability === "object" && featured.suitability.academicAlignment && (
                <p style={{ marginTop: "10px", fontSize: "0.95rem" }}>
                  <strong>Academic Alignment:</strong> {featured.suitability.academicAlignment}
                </p>
              )}
              {typeof featured.suitability === "object" && featured.suitability.careerImpact && (
                <p style={{ marginTop: "8px", fontSize: "0.95rem" }}>
                  <strong>Career & Research Impact:</strong> {featured.suitability.careerImpact}
                </p>
              )}
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
              <strong>Source:</strong> {featured.source || "SSA Research Lab & UNNC Academic Mentorship"}
            </p>
            <p style={{ marginTop: "6px" }}>
              <strong>Last Verified:</strong> {featured.lastVerified || "November 2026"}
            </p>
            <div style={{ marginTop: "16px" }}>
              <Link href="/contact" className={styles.liveLink}>
                Request Supervision <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        </div>
      )}

      {/* System Architecture Section */}
      {featured.architecture && featured.architecture.length > 0 ? (
        <div className={styles.architectureSection}>
          <div className={styles.architectureHeading}>
            <p className={styles.eyebrow}>System architecture</p>
            <h3>{isOpportunity ? "Proposed System Architecture" : "System Design & Component Layers"}</h3>
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

      {/* Implementation Screenshots (Single-Box Interactive Slideshow - excludes redundant cover poster) */}
      {!isOpportunity && featured.gallery && featured.gallery.filter((g) => g.url !== featured.coverImage).length > 0 ? (
        <div className={styles.evidenceSection}>
          <div className={styles.evidenceHeading}>
            <div>
              <p className={styles.eyebrow}>Implementation evidence & interfaces</p>
              <h3>Interactive Visual Showcase</h3>
            </div>
            <p>Use slideshow controls, arrows, or thumbnails to explore architecture and UI layers.</p>
          </div>
          <ProjectGallerySlider
            gallery={featured.gallery.filter((g) => g.url !== featured.coverImage)}
            projectTitle={featured.title}
          />
        </div>
      ) : null}

      {/* Project Objectives & Outcomes Grid */}
      {(featured.objectives && featured.objectives.length > 0) || (!isOpportunity && featured.outcome) ? (
        <div className={styles.detailGrid}>
          {featured.objectives && featured.objectives.length > 0 ? (
            <article>
              <p className={styles.eyebrow}>{isOpportunity ? "Research objectives" : "Project objectives"}</p>
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
      ) : null}
    </section>
  );
}
