import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ShieldCheck,
  Send,
  Sparkles,
  Cpu,
  Zap,
  CheckCircle2,
  Building,
  Users,
  Calendar,
  Award,
  Maximize2,
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import {
  profilePageSchema,
  personSchema,
  collectionPageSchema,
  softwareProjectSchema,
  articleSchema,
  eventSchema,
  courseSchema,
  contactPageSchema,
  faqSchema,
  serviceSchema,
  breadcrumbSchema,
  personMemberSchema,
} from "../SEO";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sites.google.com/view/temporaryr";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicLottie from "./AcademicLottie";
import AcademicResearchPipeline from "./AcademicResearchPipeline";
import AcademicFypListing from "./AcademicFypListing";
import AcademicDomainModal from "./AcademicDomainModal";
import { useRouter } from "next/router";
import PlexusCanvas from "../Backgrounds/PlexusCanvas";
import {
  academicProfile,
  alumniPlacements,
  collaborators,
  eventGallery,
  eventHighlights,
  fypOpportunities,
  partnerLogos,
  publications,
  researchDomains,
  researchProjects,
  supervisedProjects,
  pgResearchers,
  coInvestigators,
  labMilestones,
  labPillars,
  labImpactStats,
} from "../../data/academicSite";
import { defaultFypProjects } from "../../data/fypProjects";
import styles from "./AcademicSite.module.css";

function PageIntro({ eyebrow, title, lead, showLogo = true }) {
  return (
    <section className={styles.pageIntro} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
      <div style={{ flex: '1 1 min(100%, 580px)' }}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      {showLogo && (
        <div className={`${styles.projectIllustrationCard} ${styles.floatAnim}`} style={{ flexShrink: 0, margin: '0 auto', padding: '16px 24px' }}>
          <div className={styles.illustrationGlow} />
          <Image
            src="/academic/scsa-research-group-logo.png"
            alt="SCSA Research Group Official Branding Logo"
            width={160}
            height={106}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      )}
    </section>
  );
}

export function AboutPage() {
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [activeCollabTab, setActiveCollabTab] = useState("all");

  const currentMilestone = labMilestones[activeEraIndex] || labMilestones[0];

  const renderPillarIcon = (name) => {
    switch (name) {
      case "ShieldCheck":
        return <ShieldCheck size={24} />;
      case "Sparkles":
        return <Sparkles size={24} />;
      case "Cpu":
        return <Cpu size={24} />;
      case "Zap":
        return <Zap size={24} />;
      default:
        return <BookOpen size={24} />;
    }
  };

  const aboutJsonLd = [
    profilePageSchema({
      url: `${SITE_URL}/about`,
      "@id": `${SITE_URL}/about`,
      name: "About SCSA Research Lab",
      description:
        "Source Code Security Assessment (SCSA) Research Lab — Profile, global research collaborations, MS & PhD researchers, lab journey timeline, and core security research pillars.",
    }),
    personSchema(),
  ];

  return (
    <AcademicSiteLayout
      title="About SCSA Research Lab"
      path="/about"
      description="Source Code Security Assessment (SCSA) Research Lab — Profile, global research collaborations, MS & PhD researchers, lab journey timeline, and core security research pillars."
      keywords="Junaid Akram PhD, SCSA Lab history, software security researcher, COMSATS Lahore professor, Tsinghua University PhD, University of Luxembourg postdoc"
      jsonLd={aboutJsonLd}
    >
      {/* 1. HERO & LAB MISSION OVERVIEW WITH DIRECTOR CARD */}
      <div className={styles.aboutHeroRow}>
        <PageIntro
          eyebrow="About SCSA Lab & Collaborations"
          title="Pioneering Source-Code Security Assessment & AI-Driven Software Reliability"
          lead="The Source Code Security Assessment (SCSA) Research Lab unites academic rigor, global international partnerships, and industrial applications to discover software vulnerabilities, synthesize security patches, defend against malware, and automate software verification."
        />
        {coInvestigators[0] && (
          <aside className={styles.aboutDirectorCard}>
            <div className={styles.aboutDirectorAvatar}>
              <Image
                src={coInvestigators[0].image}
                alt={coInvestigators[0].name}
                width={72}
                height={72}
              />
            </div>
            <div className={styles.aboutDirectorInfo}>
              <h3 className={styles.aboutDirectorName}>{coInvestigators[0].name}</h3>
              <span className={styles.aboutDirectorTitle}>Assistant Professor & HEC PhD Supervisor</span>
              <span className={styles.aboutDirectorMeta}>
                Tsinghua University PhD · SnT Luxembourg Postdoc
              </span>
              <div className={styles.aboutDirectorLinks}>
                <a
                  href={`mailto:${coInvestigators[0].email}`}
                  className={styles.aboutDirectorBtn}
                  title="Send Email"
                >
                  <Mail size={12} /> Email
                </a>
                {coInvestigators[0].googleScholar && (
                  <a
                    href={coInvestigators[0].googleScholar}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.aboutDirectorBtn}
                    title="Google Scholar"
                  >
                    Scholar <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 2. GLOBAL INSTITUTIONAL & UNIVERSITY PARTNERS (SINGLE ROW SHOWCASE - ONE ROW ONLY) */}
      <section className={styles.section} style={{ paddingTop: 0, paddingBottom: "24px" }}>
        <div className={styles.sectionHeading} style={{ marginBottom: "16px" }}>
          <div>
            <p className={styles.eyebrow}>Institutional Network</p>
            <h2>Academic & Industrial Partners</h2>
          </div>
          <p style={{ maxWidth: "560px", color: "var(--academic-muted)", fontSize: "0.85rem", margin: 0 }}>
            Global research partnerships driving joint security assessments, satellite testing, and vulnerability remediation.
          </p>
        </div>
        <div className={styles.partnerRowWrapper}>
          <div className={styles.partnerCardGrid}>
            {partnerLogos.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className={styles.partnerCardBox}
              >
                <div className={styles.partnerLogoWrap}>
                  <Image src={partner.image} alt={partner.name} width={180} height={50} style={{ objectFit: "contain" }} />
                </div>
                <h4>{partner.name}</h4>
                <span className={styles.partnerRole}>{partner.role}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LAB IMPACT METRICS COUNTER GRID */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.statsGrid}>
          {labImpactStats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statNote}>{stat.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SCIENTIFIC METHODOLOGY & LAB PILLARS */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Core Principles</p>
            <h2>Research Pillars & Technological Capabilities</h2>
          </div>
        </div>
        <div className={styles.pillarsGrid}>
          {labPillars.map((pillar) => (
            <article key={pillar.id} className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                {renderPillarIcon(pillar.iconName)}
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. LAB EVOLUTION & RESEARCH JOURNEY TIMELINE (INTERACTIVE STEPPER) */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Lab Evolution & Story</p>
            <h2>Research Journey & Key Milestones</h2>
          </div>
          <p style={{ maxWidth: "600px", color: "var(--academic-muted)", fontSize: "0.9rem", margin: 0 }}>
            Explore how SCSA Lab evolved from big-data source analytics at Tsinghua University to satellite CPS testing at SnT Luxembourg and AI-driven program repair at COMSATS.
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          {/* Timeline Nav / Stepper */}
          <div className={styles.timelineNav}>
            {labMilestones.map((ms, idx) => {
              const isActive = activeEraIndex === idx;
              return (
                <button
                  key={ms.era}
                  type="button"
                  className={`${styles.timelineTab} ${isActive ? styles.activeTimelineTab : ""}`}
                  onClick={() => setActiveEraIndex(idx)}
                >
                  <span className={styles.timelineTabNum}>0{idx + 1}</span>
                  <div className={styles.timelineTabMeta}>
                    <h4>{ms.year}</h4>
                    <span>{ms.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timeline Card Display */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineCardHeader}>
              <span className={styles.timelineEraBadge}>
                <Sparkles size={13} /> {currentMilestone.tag}
              </span>
              <span className={styles.timelineLocation}>
                <MapPin size={14} /> {currentMilestone.location}
              </span>
            </div>
            <h3 className={styles.timelineCardTitle}>{currentMilestone.title}</h3>
            <p className={styles.timelineSummary}>{currentMilestone.summary}</p>

            <ul className={styles.achievementList}>
              {currentMilestone.achievements.map((item, i) => (
                <li key={i} className={styles.achievementItem}>
                  <CheckCircle2 size={16} className={styles.achievementIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.timelineStatsRow}>
              {Object.entries(currentMilestone.stats).map(([k, v]) => (
                <div key={k} className={styles.timelineStatBadge}>
                  {k.toUpperCase()}: <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PEOPLE & COLLABORATION ECOSYSTEM (INTERACTIVE FILTER TABS) */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Team & Networks</p>
            <h2>Collaborators & Research Personnel</h2>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.collabFilterBar}>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "all" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("all")}
          >
            All Members & Collaborators
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "leadership" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("leadership")}
          >
            Lab Leadership & PIs
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "international" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("international")}
          >
            International Collaborators
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "pg" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("pg")}
          >
            MS & PhD Researchers
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "fyp" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("fyp")}
          >
            BS / FYP Teams
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeCollabTab === "alumni" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveCollabTab("alumni")}
          >
            Alumni Placements
          </button>
        </div>

        {/* Render Cards Grid according to active tab */}
        <div className={styles.collabGrid}>
          {/* Leadership & Co-Investigators */}
          {(activeCollabTab === "all" || activeCollabTab === "leadership" || activeCollabTab === "international") &&
            coInvestigators
              .filter((person) => {
                if (activeCollabTab === "leadership") return person.badge === "Lab Director";
                if (activeCollabTab === "international") return person.badge !== "Lab Director";
                return true;
              })
              .map((person) => (
                <article key={person.name} className={styles.collabCard}>
                  <div className={styles.collabTop}>
                    <div className={styles.collabAvatar}>
                      {person.image ? (
                        <Image src={person.image} alt={person.name} width={56} height={56} />
                      ) : (
                        person.name.charAt(0)
                      )}
                    </div>
                    <div className={styles.collabMeta}>
                      <h3>{person.name}</h3>
                      <span className={styles.collabBadge}>{person.badge}</span>
                      <div className={styles.collabDegree}>{person.role}</div>
                    </div>
                  </div>
                  <div className={styles.collabBody}>
                    <p className={styles.collabTopic}>{person.bio}</p>
                    <div className={styles.collabFocus}>
                      <strong>Focus:</strong> {person.specialization}
                    </div>
                  </div>
                  <div className={styles.collabFooter}>
                    {person.email && (
                      <a href={`mailto:${person.email}`} className={styles.collabLinkBtn}>
                        <Mail size={12} /> Email
                      </a>
                    )}
                    {person.googleScholar && (
                      <a href={person.googleScholar} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                        Scholar <ExternalLink size={12} />
                      </a>
                    )}
                    {person.orcid && (
                      <a href={person.orcid} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                        ORCID <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}

          {/* MS & PhD Postgraduate Researchers */}
          {(activeCollabTab === "all" || activeCollabTab === "pg") &&
            pgResearchers.map((student) => (
              <article key={student.id} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar}>
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{student.name}</h3>
                    <span className={styles.collabRegId}>{student.id}</span>
                    <div className={styles.collabDegree}>{student.degree}</div>
                  </div>
                </div>
                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>
                    <strong>Thesis Topic:</strong> "{student.topic}"
                  </p>
                  <div className={styles.collabFocus}>
                    <strong>Research Focus:</strong> {student.focus}
                  </div>
                </div>
                <div className={styles.collabFooter}>
                  <span className={styles.sessionBadge}>{student.status}</span>
                </div>
              </article>
            ))}

          {/* BS / FYP Engineering Researchers */}
          {(activeCollabTab === "all" || activeCollabTab === "fyp") &&
            defaultFypProjects.slice(0, 4).map((fyp) => (
              <article key={fyp.slug} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--academic-cyan)" }}>
                    <GraduationCap size={24} />
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{fyp.title.split("—")[0]}</h3>
                    <span className={styles.collabBadge}>{fyp.programme} · {fyp.session}</span>
                  </div>
                </div>
                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>{fyp.summary}</p>
                  <div className={styles.collabFocus}>
                    <strong>Student Team:</strong> {fyp.students.map((s) => s.name).join(", ")}
                  </div>
                </div>
                <div className={styles.collabFooter}>
                  <Link href={`/projects/${fyp.slug}`} className={styles.cardLink}>
                    View Project <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}

          {/* Alumni Industry Placements */}
          {(activeCollabTab === "all" || activeCollabTab === "alumni") &&
            alumniPlacements.map((alum) => (
              <article key={`${alum.name}-${alum.organization}`} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    <Building size={24} />
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{alum.name}</h3>
                    <span className={styles.collabBadge}>{alum.term} Alumni</span>
                    <div className={styles.collabDegree}>{alum.organization}</div>
                  </div>
                </div>
                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>
                    Successfully transitioned into top technology, cybersecurity, and consulting firms following SCSA Lab supervision.
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>

    </AcademicSiteLayout>
  );
}

export function ResearchPage() {
  const router = useRouter();
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  React.useEffect(() => {
    if (router.query.domain) {
      const match = researchDomains.find(
        (d) =>
          d.id === router.query.domain ||
          d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === router.query.domain
      );
      if (match) {
        setSelectedDomain(match);
      }
    }
  }, [router.query.domain]);

  const researchJsonLd = [
    collectionPageSchema({
      name: "SCSA Research Lab — Software Security Research",
      url: `${SITE_URL}/research`,
      description:
        "Research areas, platforms, and software-security tools developed by Dr. Junaid Akram and the SCSA Lab.",
      items: researchProjects.map((p) => ({
        name: p.title || p.name,
        url: `${SITE_URL}/research`,
        description: p.description,
      })),
    }),
    ...researchProjects.slice(0, 6).map((p) =>
      softwareProjectSchema({
        name: p.title || p.name,
        description: p.description,
        url: `${SITE_URL}/research`,
        keywords: p.tags ? p.tags.join(", ") : undefined,
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="Research"
      path="/research"
      description="Research areas, platforms, and software-security tools developed by Dr. Junaid Akram and the SCSA Lab."
      keywords="software vulnerability detection, malware analysis, code clone detection, software testing, source code security, SCSA Lab research projects"
      jsonLd={researchJsonLd}
    >
      {selectedDomain && (
        <AcademicDomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
        />
      )}

      <PageIntro
        eyebrow="Research"
        title="Software security research with practical reach."
        lead="The lab studies vulnerabilities, malware, code clones, software evolution, and testing at scales ranging from individual functions to billions of lines of code."
      />

      <section className={styles.section}>
        <div className={styles.domainGrid}>
          {researchDomains.map((domain, index) => (
            <article
              key={domain.title}
              className={`${styles.domainItem} ${styles.interactiveDomainItem}`}
              onClick={() => setSelectedDomain(domain)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedDomain(domain);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Open detailed panel for ${domain.title}`}
            >
              <div className={styles.domainItemHeader}>
                <span>{domain.number || String(index + 1).padStart(2, "0")}</span>
                <span className={styles.domainClickBadge}>
                  Explore Roadmap <ArrowRight size={13} />
                </span>
              </div>
              {domain.image && (
                <div className={styles.cornerCardIllustration}>
                  <div className={styles.cornerBadgeDot} />
                  <Image
                    src={domain.image}
                    alt={domain.title}
                    width={135}
                    height={135}
                    className={styles.illustrationImage}
                  />
                </div>
              )}
              <h2>{domain.title}</h2>
              <p>{domain.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Full Interactive Research Workflow Pipeline */}
      <section className={`${styles.section} ${styles.pipelineSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Research workflow</p>
            <h2>From source evidence to validated outcomes</h2>
          </div>
        </div>
        <AcademicResearchPipeline />
      </section>

      {/* Projects & Tools with Expandable Technical Specifications */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Projects & tools</p>
            <h2>Current and completed research platforms</h2>
          </div>
        </div>
        <div className={styles.projectList}>
          {researchProjects.map((project, idx) => {
            const isExpanded = expandedProject === idx;
            return (
              <article key={project.title} style={{ marginBottom: "20px" }}>
                <div>
                  <span className={styles.sessionBadge}>{project.status}</span>
                  <h3 style={{ marginTop: "8px" }}>{project.title}</h3>
                  <p>{project.summary}</p>
                  <small>{project.collaboration}</small>

                  {/* Expandable Technical Details Button */}
                  {project.details ? (
                    <div style={{ marginTop: "12px" }}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                        onClick={() => setExpandedProject(isExpanded ? null : idx)}
                      >
                        {isExpanded ? "Hide Technical Details" : "Technical Specifications"} {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  ) : null}

                  {/* Expanded Technical Details Box */}
                  {isExpanded && project.details ? (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "14px 16px",
                        background: "var(--academic-card-bg, rgba(255,255,255,0.04))",
                        borderRadius: "8px",
                        border: "1px solid var(--academic-border, #e5e7eb)",
                        fontSize: "0.88rem",
                      }}
                    >
                      <p style={{ margin: "4px 0" }}>
                        <strong>Problem:</strong> {project.details.problem}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Approach:</strong> {project.details.approach}
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Outcome:</strong> {project.details.outcome}
                      </p>
                    </div>
                  ) : null}
                </div>
                {project.image && (
                  <div className={styles.cornerCardIllustration} style={{ margin: 0, padding: "18px" }}>
                    <div className={styles.cornerBadgeDot} />
                    <AcademicImageLightbox
                      src={project.image}
                      alt={`${project.title} research visual`}
                      width={320}
                      height={320}
                      caption={project.title}
                      className={styles.illustrationImage}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function PublicationsPage() {
  const [filterType, setFilterType] = useState("All");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const filteredPubs = publications.filter((pub) => {
    if (filterType === "All") return true;
    if (filterType === "Journal") return pub.type === "Journal";
    if (filterType === "Conference") return pub.type === "Conference";
    return true;
  });

  const handleCopyBibtex = (bibtex, index) => {
    if (!bibtex) return;
    navigator.clipboard.writeText(bibtex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const pubsJsonLd = [
    collectionPageSchema({
      name: "Publications — Dr. Junaid Akram",
      url: `${SITE_URL}/publications`,
      description:
        "Peer-reviewed journal and conference publications by Dr. Junaid Akram in software security, testing, malware, and code analysis.",
      items: publications.map((p) => ({
        name: p.title,
        url: p.doi ? `https://doi.org/${p.doi}` : `${SITE_URL}/publications`,
        description: p.venue,
      })),
    }),
    ...publications.slice(0, 8).map((p) =>
      articleSchema({
        headline: p.title,
        description: p.abstract || p.venue,
        url: p.doi ? `https://doi.org/${p.doi}` : `${SITE_URL}/publications`,
        datePublished: p.year ? `${p.year}-01-01` : undefined,
        dateModified: p.year ? `${p.year}-01-01` : undefined,
        keywords: p.keywords || p.tags?.join(", "),
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="Publications"
      path="/publications"
      description="Peer-reviewed journal and conference publications by Dr. Junaid Akram in software security, testing, malware, and code analysis."
      keywords="Junaid Akram publications, software security papers, vulnerability detection research, code clone analysis papers, malware detection journal, IEEE conference papers"
      jsonLd={pubsJsonLd}
    >
      <PageIntro
        eyebrow="Publications"
        title="Peer-reviewed research output."
        lead="Research spanning source-code vulnerability detection, Android malware and clone analysis, software testing, and scalable code assessment."
      />

      {/* 1. Academic Profiles Link Bar */}
      <section className={styles.section} style={{ paddingBottom: "12px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <a
            href={academicProfile.googleScholar}
            target="_blank"
            rel="noreferrer"
            className={styles.primaryButton}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            Google Scholar Profile <ExternalLink size={14} />
          </a>
          <a
            href={academicProfile.orcid}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            ORCID ({academicProfile.orcid.replace("https://orcid.org/", "")}) <ExternalLink size={14} />
          </a>
          <a
            href={academicProfile.researchGate}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            ResearchGate Profile <ExternalLink size={14} />
          </a>
          <a
            href={academicProfile.officialProfile}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            COMSATS Profile <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* 2. Publication Filter & Counter */}
      <section className={styles.section}>
        <div className={styles.fypFilterBar} style={{ marginBottom: "20px" }}>
          <div className={styles.categoryPills}>
            <button
              type="button"
              className={`${styles.filterPill} ${filterType === "All" ? styles.filterPillActive : ""}`}
              onClick={() => setFilterType("All")}
            >
              All Publications ({publications.length})
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${filterType === "Journal" ? styles.filterPillActive : ""}`}
              onClick={() => setFilterType("Journal")}
            >
              Journal Papers ({publications.filter((p) => p.type === "Journal").length})
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${filterType === "Conference" ? styles.filterPillActive : ""}`}
              onClick={() => setFilterType("Conference")}
            >
              Conference Papers ({publications.filter((p) => p.type === "Conference").length})
            </button>
          </div>
        </div>

        {/* Publications List */}
        <div className={styles.publicationList}>
          {filteredPubs.map((publication, index) => (
            <article key={publication.title}>
              <span>{publication.year}</span>
              <div>
                <span className={styles.categoryBadge} style={{ marginBottom: "6px", display: "inline-block" }}>
                  {publication.type || "Peer-Reviewed"}
                </span>
                <h2>{publication.title}</h2>
                <p>{publication.authors}</p>
                <small>{publication.venue}</small>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                {publication.href && (
                  <a
                    href={publication.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.textLink}
                    aria-label={`Open ${publication.title}`}
                  >
                    DOI Link <ExternalLink size={14} />
                  </a>
                )}
                {publication.bibtex ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                    onClick={() => handleCopyBibtex(publication.bibtex, index)}
                    title="Copy BibTeX Citation"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={12} style={{ color: "#10b981" }} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> BibTeX
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <a
            className={styles.sourceNote}
            href="https://docs.google.com/presentation/d/1arPiJH7qh6eBlYHkRl61SeIet7LnoqsEMP5tj547U0g/present"
            target="_blank"
            rel="noreferrer"
          >
            View ICST 2019 conference presentation deck <ExternalLink size={15} />
          </a>
        </div>
      </section>

      {/* Collaboration Callout */}
      <section className={styles.ctaBand}>
        <div>
          <p className={styles.eyebrow}>Research Collaboration</p>
          <h2>Interested in co-authoring or reviewing research?</h2>
        </div>
        <Link href="/contact" className={styles.primaryButton}>
          Contact Dr Junaid <ArrowRight size={17} />
        </Link>
      </section>
    </AcademicSiteLayout>
  );
}

export function SupervisionPage({ fypProjects = [] }) {
  const supervisionJsonLd = [
    collectionPageSchema({
      name: "FYP Supervision — Dr. Junaid Akram",
      url: `${SITE_URL}/supervision`,
      description:
        "Supervised final-year student projects, FYP opportunities, and student research under Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus.",
      items: supervisedProjects.map((p) => ({
        name: p.title,
        url: `${SITE_URL}/supervision`,
        description: `${p.student} — ${p.institution}`,
      })),
    }),
    ...supervisedProjects.slice(0, 6).map((p) =>
      courseSchema({
        name: p.title,
        description: `Final-year project by ${p.student} at ${p.institution}, supervised by Dr. Junaid Akram.`,
        url: `${SITE_URL}/supervision`,
        educationalLevel: p.level || "Undergraduate",
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="Supervision"
      path="/supervision"
      description="Supervised final-year student projects, FYP opportunities, and student research under Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus."
      keywords="FYP supervision COMSATS, Junaid Akram student supervision, software security final year projects, BS MS PhD research supervision Pakistan"
      jsonLd={supervisionJsonLd}
    >
      <PageIntro
        eyebrow="FYP Supervision"
        title="Supervised final-year projects and research opportunities."
        lead="Explore open COMSATS final-year project topics alongside completed student projects supervised under Dr Junaid Akram's SCSA Laboratory."
      />

      {/* Interactive Directory Component */}
      <AcademicFypListing projects={fypProjects} />

      {/* Student Placements & Internships */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Placement outcomes</p>
            <h2>Supervised student placements & careers</h2>
          </div>
        </div>
        <div className={styles.placementList}>
          {alumniPlacements.map((placement) => (
            <article key={`${placement.name}-${placement.organization}`}>
              <div>
                <h3>{placement.name}</h3>
                <p>{placement.organization}</p>
              </div>
              <span>{placement.term}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Supervision Application Guidance */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>How to apply</p>
            <h2>Supervision Guidance for Students</h2>
          </div>
        </div>
        <div style={{ maxWidth: "780px", lineHeight: "1.7" }}>
          <p>
            BS Software Engineering and BS Computer Science students interested in FYP supervision at COMSATS University Islamabad, Lahore Campus should email Dr Junaid Akram with the following details:
          </p>
          <ul style={{ margin: "16px 0 24px 20px" }}>
            <li>Group member names and registration numbers</li>
            <li>Current CGPA and transcript highlight</li>
            <li>Selected FYP opportunity title or proposed original research topic</li>
            <li>Technical background (programming languages, frameworks, security/ML interest)</li>
          </ul>
          <Link href="/contact" className={styles.primaryButton}>
            Submit Supervision Inquiry <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function TeamPage() {
  const [activeTab, setActiveTab] = useState("all");

  const showPi = activeTab === "all" || activeTab === "pi";
  const showMs = activeTab === "all" || activeTab === "ms";
  const showBs = activeTab === "all" || activeTab === "bs";
  const showAlumni = activeTab === "all" || activeTab === "alumni";
  const showPartners = activeTab === "all" || activeTab === "partners";

  const teamJsonLd = [
    collectionPageSchema({
      name: "SCSA Lab — People & Partners",
      url: `${SITE_URL}/team`,
      description:
        "Dr. Junaid Akram, international co-investigators, MS/PhD researchers, BS engineering teams, alumni, and partner institutions of SCSA Lab.",
      items: [
        ...coInvestigators.map((m) => ({ name: m.name, url: `${SITE_URL}/team` })),
        ...pgResearchers.map((m) => ({ name: m.name, url: `${SITE_URL}/team` })),
      ],
    }),
    personSchema(),
    ...coInvestigators.slice(0, 4).map((m) =>
      personMemberSchema({
        name: m.name,
        role: m.role || "Co-Investigator",
        image: m.image ? `${SITE_URL}${m.image}` : undefined,
        url: m.profileUrl || `${SITE_URL}/team`,
        university: m.institution,
        researchArea: m.researchArea,
      })
    ),
    ...pgResearchers.slice(0, 4).map((m) =>
      personMemberSchema({
        name: m.name,
        role: m.program || "Researcher",
        image: m.image ? `${SITE_URL}${m.image}` : undefined,
        url: `${SITE_URL}/team`,
        researchArea: m.researchArea,
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="People & Partners"
      path="/team"
      description="Dr. Junaid Akram, international co-investigators, MS/PhD researchers, BS engineering teams, alumni, and partner institutions of SCSA Lab."
      keywords="SCSA Lab team, software security researchers, COMSATS research group members, PhD students software security, international collaborators Pakistan"
      jsonLd={teamJsonLd}
    >
      {/* PAGE INTRO HEADER */}
      <PageIntro
        eyebrow="SCSA Research & Development Team"
        title="People, Collaborators & Institutional Partners"
        lead="Connecting principal investigators, international co-investigators, postgraduate MS & PhD thesis researchers, undergraduate BS engineering teams, and institutional partner organizations across software security and program repair."
      />

      {/* INTERACTIVE CATEGORY FILTER BAR */}
      <section className={styles.section} style={{ paddingTop: "24px", paddingBottom: "24px" }}>
        <div className={styles.collabFilterBar}>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "all" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("all")}
          >
            🌟 All Categories
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "pi" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("pi")}
          >
            👨‍🏫 Faculty & Co-Investigators ({coInvestigators.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "ms" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("ms")}
          >
            🎓 Postgraduate Team — MS & PhD ({pgResearchers.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "bs" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("bs")}
          >
            💻 Undergraduate Team — BS Engineering ({defaultFypProjects.length + supervisedProjects.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "alumni" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("alumni")}
          >
            💼 Alumni & Placements ({alumniPlacements.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "partners" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("partners")}
          >
            🏛️ Institutional Partners ({partnerLogos.length})
          </button>
        </div>
      </section>

      {/* 1. PRINCIPAL INVESTIGATORS & MAIN COLLABORATORS */}
      {showPi && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Core Leadership & Faculty</p>
              <h2>Principal Investigators & Co-Investigators</h2>
            </div>
            <p style={{ maxWidth: "540px", color: "var(--academic-muted)", fontSize: "0.88rem", margin: 0 }}>
              Leading research across COMSATS, SnT Luxembourg, Tsinghua University, and KFUPM.
            </p>
          </div>

          <div className={styles.collabGrid}>
            {coInvestigators.map((pi) => (
              <article key={pi.name} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar}>
                    {pi.image ? (
                      <AcademicImageLightbox
                        src={pi.image}
                        alt={pi.name}
                        width={120}
                        height={120}
                        caption={`${pi.name} — ${pi.role}`}
                      />
                    ) : (
                      <span>{pi.name.split(" ").map((n) => n[0]).join("")}</span>
                    )}
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{pi.name}</h3>
                    <span className={styles.collabBadge}>{pi.badge}</span>
                    <div className={styles.collabDegree}>{pi.role}</div>
                    <div className={styles.collabFocus} style={{ marginTop: "4px" }}>
                      {pi.affiliation}
                    </div>
                  </div>
                </div>

                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>
                    <strong>Specialization:</strong> {pi.specialization}
                  </p>
                  {pi.bio && <p className={styles.collabFocus}>{pi.bio}</p>}
                </div>

                <div className={styles.collabFooter}>
                  {pi.email && (
                    <a href={`mailto:${pi.email}`} className={styles.collabLinkBtn}>
                      <Mail size={13} /> Email
                    </a>
                  )}
                  {pi.googleScholar && (
                    <a href={pi.googleScholar} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                      <ExternalLink size={13} /> Scholar
                    </a>
                  )}
                  {pi.orcid && (
                    <a href={pi.orcid} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                      <ExternalLink size={13} /> ORCID
                    </a>
                  )}
                  {pi.officialProfile && (
                    <a href={pi.officialProfile} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                      <ExternalLink size={13} /> Official Profile
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. POSTGRADUATE RESEARCHERS (MS & PHD STUDENTS) */}
      {showMs && (
        <section className={`${styles.section} ${styles.softSection}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Postgraduate Research Team</p>
              <h2>MS Computer Science Thesis Researchers</h2>
            </div>
            <p style={{ maxWidth: "560px", color: "var(--academic-muted)", fontSize: "0.88rem", margin: 0 }}>
              Master of Science (MS CS) researchers working on vulnerability repair, AST/CFG code summarizers, Graph Neural Networks, and search-based testing under Dr. Junaid Akram's supervision.
            </p>
          </div>

          <div className={styles.collabGrid}>
            {pgResearchers.map((student) => (
              <article key={student.id} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ background: "rgba(6, 182, 212, 0.1)", border: "2px solid var(--academic-cyan)" }}>
                    <GraduationCap size={24} style={{ color: "var(--academic-cyan)" }} />
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{student.name}</h3>
                    <span className={styles.collabRegId}>{student.id}</span>
                    <div className={styles.collabDegree}>{student.degree}</div>
                    <div className={styles.collabBadge} style={{ marginTop: "4px", background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                      {student.status}
                    </div>
                  </div>
                </div>

                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>
                    <strong>Thesis Topic:</strong> "{student.topic}"
                  </p>
                  <p className={styles.collabFocus}>
                    <strong>Research Focus:</strong> {student.focus}
                  </p>
                </div>

                <div className={styles.collabFooter}>
                  <span className={styles.collabFocus} style={{ fontSize: "0.74rem" }}>
                    <Building size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {student.institution}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. UNDERGRADUATE RESEARCHERS & FYP TEAMS (BS STUDENTS) */}
      {showBs && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Undergraduate Research Team</p>
              <h2>BS Software Engineering Teams & Supervised Researchers</h2>
            </div>
            <p style={{ maxWidth: "560px", color: "var(--academic-muted)", fontSize: "0.88rem", margin: 0 }}>
              Final-year project engineering teams and supervised undergraduate researchers at COMSATS University Islamabad and Xiamen University Malaysia.
            </p>
          </div>

          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.2rem", marginBottom: "18px" }}>
            Active COMSATS BS Final-Year Engineering Teams
          </h3>

          <div className={styles.collabGrid} style={{ marginBottom: "48px" }}>
            {defaultFypProjects.map((fyp) => (
              <article key={fyp.slug} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ borderRadius: "8px", width: "48px", height: "48px" }}>
                    <Users size={22} />
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{fyp.title}</h3>
                    <span className={styles.collabBadge}>{fyp.programme} · {fyp.session}</span>
                    <div className={styles.collabDegree}>{fyp.projectType} ({fyp.nature})</div>
                  </div>
                </div>

                <div className={styles.collabBody}>
                  <p className={styles.collabFocus} style={{ marginBottom: "12px" }}>
                    {fyp.summary}
                  </p>
                  <p className={styles.collabTopic} style={{ fontSize: "0.8rem", margin: 0 }}>
                    <strong>Team Members:</strong>
                  </p>
                  <ul style={{ margin: "6px 0 12px 18px", padding: 0, fontSize: "0.78rem", color: "var(--academic-muted)" }}>
                    {fyp.students.map((st) => (
                      <li key={st.name}>
                        <strong>{st.name}</strong> {st.registration && `(${st.registration})`}
                      </li>
                    ))}
                  </ul>
                  {fyp.supervisor && (
                    <div className={styles.collabFocus} style={{ fontSize: "0.75rem" }}>
                      Supervisor: <strong>{fyp.supervisor}</strong> {fyp.coSupervisor && `| Co-Supervisor: ${fyp.coSupervisor}`}
                    </div>
                  )}
                </div>

                <div className={styles.collabFooter}>
                  <Link href="/fyp" className={styles.collabLinkBtn}>
                    View FYP Details <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.2rem", marginBottom: "18px" }}>
            Supervised Undergraduate Student Projects & Alumni
          </h3>

          <div className={styles.collabGrid}>
            {supervisedProjects.map((proj) => (
              <article key={`${proj.student}-${proj.title}`} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ width: "44px", height: "44px", fontSize: "0.9rem" }}>
                    {proj.student.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className={styles.collabMeta}>
                    <h3>{proj.student}</h3>
                    <span className={styles.collabBadge}>{proj.term}</span>
                    <div className={styles.collabDegree}>{proj.institution}</div>
                  </div>
                </div>
                <div className={styles.collabBody}>
                  <p className={styles.collabTopic}>
                    <strong>Supervised Project:</strong> "{proj.title}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 4. ALUMNI & CAREER PLACEMENTS */}
      {showAlumni && (
        <section className={`${styles.section} ${styles.softSection}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Career Outcomes</p>
              <h2>Supervised Alumni Placements & Industrial Careers</h2>
            </div>
            <p style={{ maxWidth: "540px", color: "var(--academic-muted)", fontSize: "0.88rem", margin: 0 }}>
              Graduates mentored in the lab progressing to top global advisories, software tech leaders, and corporate research centers.
            </p>
          </div>

          <div className={styles.placementList}>
            {alumniPlacements.map((placement) => (
              <article key={`${placement.name}-${placement.organization}`}>
                <div>
                  <h3>{placement.name}</h3>
                  <p>{placement.organization}</p>
                </div>
                <span>{placement.term}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. INSTITUTIONAL PARTNERS & ACADEMIC AFFILIATIONS */}
      {showPartners && (
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Institutional Network</p>
              <h2>Academic & Industry Partners</h2>
            </div>
            <p style={{ maxWidth: "540px", color: "var(--academic-muted)", fontSize: "0.88rem", margin: 0 }}>
              Institutional affiliations and research partnerships driving joint security assessments and program repair.
            </p>
          </div>

          <div className={styles.partnerRowWrapper}>
            <div className={styles.partnerCardGrid}>
              {partnerLogos.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.partnerCardBox}
                >
                  <div className={styles.partnerLogoWrap}>
                    <Image src={partner.image} alt={partner.name} width={180} height={50} style={{ objectFit: "contain" }} />
                  </div>
                  <h4>{partner.name}</h4>
                  <span className={styles.partnerRole}>{partner.role}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </AcademicSiteLayout>
  );
}

export function EventsPage() {
  const eventsJsonLd = [
    collectionPageSchema({
      name: "SCSA Lab — Events & Presentations",
      url: `${SITE_URL}/events`,
      description:
        "Selected international conference keynotes, workshops, and research presentations led by Dr. Junaid Akram and SCSA Research Lab.",
      items: eventHighlights.map((e) => ({
        name: e.title,
        url: `${SITE_URL}/events`,
        description: e.description || e.venue,
      })),
    }),
    ...eventHighlights.slice(0, 6).map((e) =>
      eventSchema({
        name: e.title,
        description: e.description || `${e.type || "Event"} — ${e.venue || "International conference"}`,
        startDate: e.year ? `${e.year}-01-01` : undefined,
        url: `${SITE_URL}/events`,
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="Events & Presentations"
      path="/events"
      description="Selected international conference keynotes, workshops, and research presentations led by Dr. Junaid Akram and SCSA Research Lab."
      keywords="Junaid Akram keynote, software security conference, SCSA Lab events, international research workshops, Pakistan cybersecurity conference"
      jsonLd={eventsJsonLd}
    >
      <PageIntro
        eyebrow="International Events & Keynotes"
        title="Research presented and shared on global stages."
        lead="Selected international workshops, keynotes, peer-reviewed conference presentations, and academic partnership events featuring Dr Junaid Akram and SCSA Research Lab."
      />

      {/* 1. KEYNOTE & CONFERENCE HIGHLIGHTS */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Keynote & Conference Highlights</p>
            <h2>International Presentations & Workshops</h2>
          </div>
        </div>

        <div className={styles.eventList}>
          {eventHighlights.map((event) => (
            <article key={event.title} className={styles.eventCardItem}>
              <div className={styles.eventYearBox}>
                <Calendar size={18} style={{ color: "var(--academic-blue)", marginBottom: "4px" }} />
                <span className={styles.eventYearNumber}>{event.year}</span>
              </div>
              <div className={styles.eventContentBody}>
                <div className={styles.eventMetaRow}>
                  <span className={styles.eventBadgeTag}>
                    <Award size={13} /> {event.badge}
                  </span>
                  <span className={styles.eventLocation}>
                    <MapPin size={13} /> {event.location}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", fontWeight: "600", color: "var(--academic-text)" }}>
                  {event.venue}
                </p>
                <p className={styles.eventSummaryText}>{event.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. EVENT PHOTOGRAPHY GALLERY */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Event Gallery</p>
            <h2>Oral Presentations & Poster Exhibition</h2>
          </div>
          <p style={{ maxWidth: "600px", color: "var(--academic-muted)", fontSize: "0.9rem", margin: 0 }}>
            Click on any photo to view full resolution in the interactive lightbox viewer.
          </p>
        </div>

        <div className={styles.eventGalleryGrid}>
          {eventGallery.map((image) => {
            const isPortrait = image.orientation === "portrait";
            return (
              <article key={image.src} className={styles.eventGalleryCard}>
                <div className={`${styles.eventMediaBox} ${isPortrait ? styles.eventMediaPortrait : styles.eventMediaLandscape}`}>
                  <span className={styles.eventTopBadge}>
                    <Sparkles size={12} /> {image.badge}
                  </span>
                  <AcademicImageLightbox
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    caption={image.caption}
                    className={styles.eventImageButton}
                    sizes="(max-width: 868px) 100vw, 50vw"
                  />
                  <div className={styles.eventExpandHint}>
                    <Maximize2 size={13} /> Expand Photo
                  </div>
                </div>

                <div className={styles.eventCardMetaBody}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--academic-cyan)" }}>
                      {image.category} · {image.date}
                    </span>
                    <span className={styles.eventLocation} style={{ fontSize: "0.78rem" }}>
                      <MapPin size={12} /> {image.location}
                    </span>
                  </div>
                  <h3>{image.title}</h3>
                  <p>{image.caption}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    enquiryType: "FYP Supervision",
    topic: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const contactJsonLd = [
    contactPageSchema({ url: `${SITE_URL}/contact` }),
    personSchema(),
    serviceSchema({
      name: "Research Collaboration & Student Supervision",
      description:
        "Dr. Junaid Akram accepts collaboration requests, research proposals, and student supervision enquiries in software security, vulnerability detection, and automated testing.",
      serviceType: "Academic Research Supervision",
      url: `${SITE_URL}/contact`,
    }),
    faqSchema([
      {
        question: "How can I apply for FYP supervision by Dr. Junaid Akram?",
        answer:
          "Email junaidakram@cuilahore.edu.pk with your group members' names, registration numbers, current CGPA, selected FYP topic, and technical background.",
      },
      {
        question: "What research areas does the SCSA Lab focus on?",
        answer:
          "The SCSA Lab focuses on software vulnerability detection, code clone analysis, malware detection, automated software testing, and software evolution.",
      },
      {
        question: "Is Dr. Junaid Akram an HEC-approved PhD supervisor?",
        answer:
          "Yes. Dr. Junaid Akram is an HEC-approved PhD supervisor at COMSATS University Islamabad, Lahore Campus.",
      },
      {
        question: "What is Dr. Junaid Akram's office location?",
        answer:
          "H Block, Room 14, COMSATS University Islamabad, Lahore Campus, Defence Road, Off Raiwind Road, Lahore, Pakistan.",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Contact"
      path="/contact"
      description="Contact Dr. Junaid Akram and the Source Code Security Assessment Lab at COMSATS University Islamabad, Lahore Campus."
      keywords="contact Junaid Akram, SCSA Lab contact, COMSATS Lahore faculty contact, PhD supervision enquiry Pakistan, software security collaboration"
      jsonLd={contactJsonLd}
    >
      <PageIntro
        eyebrow="Contact"
        title="Discuss research, supervision, or collaboration."
        lead="For research collaboration, student supervision, and SCSA Lab enquiries, use the verified institutional contact details below or submit an enquiry form."
      />

      <section className={`${styles.section} ${styles.contactStage}`}>
        <div className={styles.contactPlexus} aria-hidden="true">
          <PlexusCanvas maxNodes={54} maxDistance={105} speed={0.18} intensity={0.35} />
        </div>

        <div className={styles.contactVisual}>
          <div className={styles.lottieCard}>
            <AcademicLottie
              src="/academic/lottie/security-research.json"
              ariaLabel="Animated software security shield"
              className={styles.securityLottie}
            />
          </div>
          <div>
            <p className={styles.eyebrow}>SCSA Research Lab</p>
            <h2>Software security, testing, and student research.</h2>
            <p>
              Include your research topic, degree programme, or collaboration objective so the enquiry can be assessed efficiently.
            </p>
          </div>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <Mail size={24} />
            <span>Email</span>
            <a href={`mailto:${academicProfile.emails[0]}`}>
              {academicProfile.emails[0]}
            </a>
            <a href={`mailto:${academicProfile.labEmail}`}>
              {academicProfile.labEmail}
            </a>
          </div>

          <div className={styles.contactCard}>
            <MapPin size={24} />
            <span>Office Location</span>
            <strong>{academicProfile.office}</strong>
            <p>{academicProfile.institution}</p>
            <p className={styles.officePhone}>
              <Phone size={15} /> {academicProfile.officePhone}
            </p>
          </div>

          <div className={styles.contactCard}>
            <ExternalLink size={24} />
            <span>Academic Profiles</span>
            <a href={academicProfile.officialProfile} target="_blank" rel="noreferrer">
              Official COMSATS profile
            </a>
            <a href={academicProfile.googleScholar} target="_blank" rel="noreferrer">
              Google Scholar
            </a>
            <a href={academicProfile.orcid} target="_blank" rel="noreferrer">
              ORCID profile
            </a>
            <a href={academicProfile.researchGate} target="_blank" rel="noreferrer">
              ResearchGate
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Enquiry Form Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Send an enquiry</p>
            <h2>Supervision & Research Enquiry Form</h2>
          </div>
        </div>

        {formSubmitted ? (
          <div
            style={{
              padding: "24px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "8px",
              maxWidth: "680px",
            }}
          >
            <h3 style={{ color: "#10b981", margin: "0 0 8px" }}>Enquiry Prepared</h3>
            <p>
              Thank you, <strong>{formData.name}</strong>. Your enquiry details have been formatted. Please also feel free to email directly to{" "}
              <a href={`mailto:${academicProfile.emails[0]}`}>{academicProfile.emails[0]}</a> for immediate follow-up.
            </p>
            <button
              type="button"
              className={styles.secondaryButton}
              style={{ marginTop: "16px" }}
              onClick={() => setFormSubmitted(false)}
            >
              Send another enquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "16px",
              maxWidth: "680px",
              padding: "24px",
              background: "var(--academic-card-bg, rgba(255,255,255,0.03))",
              borderRadius: "12px",
              border: "1px solid var(--academic-border, #e5e7eb)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--academic-border, #ccc)",
                    background: "transparent",
                    color: "inherit",
                  }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="email">
                  Institutional Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--academic-border, #ccc)",
                    background: "transparent",
                    color: "inherit",
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="degree">
                  Degree Programme / Organisation
                </label>
                <input
                  id="degree"
                  type="text"
                  placeholder="e.g. BS Software Engineering (FA22)"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--academic-border, #ccc)",
                    background: "transparent",
                    color: "inherit",
                  }}
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="enquiryType">
                  Enquiry Type
                </label>
                <select
                  id="enquiryType"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--academic-border, #ccc)",
                    background: "var(--academic-bg, #fff)",
                    color: "inherit",
                  }}
                  value={formData.enquiryType}
                  onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                >
                  <option value="FYP Supervision">BS FYP Supervision Request</option>
                  <option value="Research Collaboration">Research Collaboration</option>
                  <option value="MS/PhD Inquiry">MS / PhD Supervision Inquiry</option>
                  <option value="General">General Enquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="topic">
                Research Topic or Project Title
              </label>
              <input
                id="topic"
                type="text"
                placeholder="e.g. Source code vulnerability detection / MegiLance"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--academic-border, #ccc)",
                  background: "transparent",
                  color: "inherit",
                }}
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="message">
                Message Details *
              </label>
              <textarea
                id="message"
                required
                rows={4}
                placeholder="Describe your background, proposed research idea, or supervision query..."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--academic-border, #ccc)",
                  background: "transparent",
                  color: "inherit",
                }}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className={styles.primaryButton} style={{ justifySelf: "start" }}>
              Submit Enquiry <Send size={15} />
            </button>
          </form>
        )}
      </section>

      {/* Map Section */}
      <section className={`${styles.section} ${styles.campusSection}`}>
        <div className={styles.campusCopy}>
          <p className={styles.eyebrow}>Visit the campus</p>
          <h2>COMSATS University Islamabad, Lahore Campus</h2>
          <p>
            1.5 KM Defence Road, Off Raiwind Road, Lahore, Pakistan. Room 14 is located in H Block. Meetings should be arranged in advance via email.
          </p>
          <a
            className={styles.textLink}
            href="https://www.google.com/maps/search/?api=1&query=COMSATS+University+Islamabad+Lahore+Campus"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps <ExternalLink size={15} />
          </a>
        </div>
        <div className={styles.campusMap}>
          <iframe
            title="Map of COMSATS University Islamabad, Lahore Campus"
            src="https://www.google.com/maps?q=COMSATS+University+Islamabad+Lahore+Campus&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function PrivacyPage() {
  return (
    <AcademicSiteLayout
      title="Privacy Policy"
      path="/privacy-policy"
      description="Privacy information for the academic website of Dr. Junaid Akram and the SCSA Research Lab."
    >
      <PageIntro
        eyebrow="Privacy"
        title="A simple academic website with minimal data collection."
        lead="This site presents public academic information. It does not sell personal data or require a visitor account."
      />
      <section className={`${styles.section} ${styles.prose}`}>
        <h2>Information you provide</h2>
        <p>
          If you contact Dr. Junaid Akram or the SCSA Lab by email or form, the information you send is used only to respond to your enquiry, research proposal, collaboration request, or supervision question.
        </p>
        <h3>Analytics and essential operation</h3>
        <p>
          The site may use privacy-conscious traffic analytics and essential browser storage for preferences such as the selected visual theme. No visitor profile is sold or used for unrelated advertising.
        </p>
        <h3>External links</h3>
        <p>
          Links to LinkedIn, ResearchGate, ORCID, publishers, and partner institutions are governed by those services&apos; own privacy policies.
        </p>
        <h3>Contact</h3>
        <p>
          Privacy questions can be sent to{" "}
          <a href={`mailto:${academicProfile.emails[0]}`}>
            {academicProfile.emails[0]}
          </a>
          .
        </p>
      </section>
    </AcademicSiteLayout>
  );
}
