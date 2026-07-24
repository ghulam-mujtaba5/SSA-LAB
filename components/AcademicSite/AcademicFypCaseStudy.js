import {
  ArrowUpRight,
  CheckCircle2,
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
  if (!projects.length) return null;
  const featured =
    projects.find((project) => project.featured) || projects[0];
  const additional = projects.filter(
    (project) => String(project._id || project.slug) !== String(featured._id || featured.slug),
  );
  const [coverWidth, coverHeight] = getDimensions(featured.coverImage, [900, 1200]);

  return (
    <>
      <section className={styles.caseStudy}>
        <div className={styles.caseIntro}>
          <div className={styles.caseCopy}>
            <p className={styles.eyebrow}>Supervised FYP case study</p>
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
                caption={`${featured.title} — final project poster`}
                priority
                sizes="(max-width: 780px) 92vw, 34vw"
              />
            </div>
          ) : null}
        </div>

        <div className={styles.academicRecord}>
          <article>
            <Users size={21} />
            <span>Students</span>
            {(featured.students || []).map((student) => (
              <p key={`${student.name}-${student.registration}`}>
                <strong>{student.name}</strong>
                {student.registration ? <small>{student.registration}</small> : null}
              </p>
            ))}
          </article>
          <article>
            <GraduationCap size={22} />
            <span>Supervision</span>
            <p>
              <strong>{featured.supervisor}</strong>
              <small>Supervisor</small>
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
            <span>Project record</span>
            <p>
              <strong>{featured.nature}</strong>
              <small>{featured.institution}</small>
            </p>
          </article>
        </div>

        <div className={styles.problemSolution}>
          <article>
            <p className={styles.eyebrow}>Research problem</p>
            <h3>Trust, pricing, and payment barriers</h3>
            <p>{featured.problem}</p>
          </article>
          <article>
            <p className={styles.eyebrow}>Supervised solution</p>
            <h3>A hybrid marketplace architecture</h3>
            <p>{featured.solution}</p>
          </article>
        </div>

        <div className={styles.architectureSection}>
          <div className={styles.architectureHeading}>
            <p className={styles.eyebrow}>System architecture</p>
            <h3>Web2 delivery, AI intelligence, and Web3 trust</h3>
            <p>
              The project separates marketplace operations, decision intelligence, and
              payment assurance so each layer can be tested and evolved independently.
            </p>
          </div>
          <div className={styles.architectureGrid}>
            {(featured.architecture || []).map((stage, index) => (
              <article key={stage.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Layers3 size={20} />
                <h4>{stage.title}</h4>
                <p>{stage.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.evidenceSection}>
          <div className={styles.evidenceHeading}>
            <div>
              <p className={styles.eyebrow}>Implementation evidence</p>
              <h3>Selected product screens</h3>
            </div>
            <p>Open any image to inspect the interface at full size.</p>
          </div>
          <div className={styles.evidenceGrid}>
            {(featured.gallery || [])
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

        <div className={styles.detailGrid}>
          <article>
            <p className={styles.eyebrow}>Project objectives</p>
            <ul>
              {(featured.objectives || []).map((item) => (
                <li key={item}>
                  <ShieldCheck size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <p className={styles.eyebrow}>Documented outcome</p>
            <h3>From proposal to working system</h3>
            <p>{featured.outcome}</p>
            <div className={styles.technologyList}>
              {(featured.technologies || []).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
          <article>
            <p className={styles.eyebrow}>Student contributions</p>
            <ul>
              {(featured.contributions || []).map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <p className={styles.eyebrow}>Research maturity</p>
            <h3>Limitations stated transparently</h3>
            <ul>
              {(featured.limitations || []).map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {additional.length ? (
        <section className={styles.additionalProjects}>
          <div>
            <p className={styles.eyebrow}>Supervised project archive</p>
            <h2>Additional FYP research</h2>
          </div>
          <div className={styles.additionalGrid}>
            {additional.map((project) => (
              <article key={project._id || project.slug}>
                <span>{project.session || project.status}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <small>
                  {(project.students || []).map((student) => student.name).join(" · ")}
                </small>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
