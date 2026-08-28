import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
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
  Search,
  LayoutGrid,
  List,
  FileText,
  X,
  Quote,
  HelpCircle,
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import {
  profilePageSchema,
  personSchema,
  collectionPageSchema,
  softwareProjectSchema,
  articleSchema,
  scholarlyArticleSchema,
  datasetSchema,
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
  "https://www.ssa-lab.tech";
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
import { useAcademicData } from "../../context/AcademicDataContext";
import styles from "./AcademicSite.module.css";

function PageIntro({ eyebrow, title, lead, illustration = null, action = null }) {
  return (
    <section className={styles.pageIntro}>
      <div className={styles.pageIntroInner}>
        <div className={styles.pageIntroText}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1>{title}</h1>
          {lead && <p className={styles.leadText}>{lead}</p>}
          {action && <div className={styles.pageIntroActions}>{action}</div>}
        </div>
        {illustration && (
          <div className={styles.pageIntroIllustration}>
            {illustration}
          </div>
        )}
      </div>
    </section>
  );
}

export function AboutPage() {
  const { siteData } = useAcademicData();
  const labMilestonesData = siteData.labMilestones || labMilestones;
  const coInvestigatorsData = siteData.coInvestigators || coInvestigators;
  const partnerLogosData = siteData.partnerLogos || partnerLogos;
  const labImpactStatsData = (siteData.labImpactStats || labImpactStats).slice(0, 4);
  const labPillarsData = siteData.labPillars || labPillars;
  const alumniPlacementsData = siteData.alumniPlacements || alumniPlacements;
  const pgResearchersData = siteData.pgResearchers || pgResearchers;

  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [activeCollabTab, setActiveCollabTab] = useState("all");

  const currentMilestone = labMilestonesData[activeEraIndex] || labMilestonesData[0] || {
    era: "default",
    year: "2023",
    badge: "Current",
    tag: "Software Security",
    location: "COMSATS Lahore",
    title: "SSA Research Lab",
    summary: "Advancing software security through empirical assessment and verification.",
    achievements: [],
    stats: {},
  };

  const renderPillarIcon = (name, image) => {
    if (image) {
      return (
        <img
          src={image}
          alt={name}
          width={54}
          height={54}
          style={{ objectFit: "contain", maxHeight: "54px" }}
        />
      );
    }
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
      name: "Dr. Junaid Akram — Academic Profile & SSA Research Lab",
      description:
        "Academic profile of Dr. Junaid Akram, Assistant Professor & HEC-approved PhD supervisor leading the Software Security Assessment Lab at COMSATS University Islamabad, Lahore Campus.",
    }),
    personSchema(),
    faqSchema([
      {
        question: "Who is Dr. Junaid Akram?",
        answer:
          "Dr. Junaid Akram is an Assistant Professor of Computer Science and an HEC-approved PhD supervisor leading the Software Security Assessment (SSA) Research Lab at COMSATS University Islamabad, Lahore Campus. He earned his PhD in Software Engineering from Tsinghua University and completed postdoctoral research at SnT, University of Luxembourg.",
      },
      {
        question: "What are Dr. Junaid Akram's primary research domains?",
        answer:
          "His primary research areas include source-code software vulnerability detection, LLM-based automated program repair, semantic code clone analysis, Android and IoT malware defense, software testing, and DevSecOps.",
      },
      {
        question: "What institutions are affiliated with Dr. Junaid Akram?",
        answer:
          "Dr. Junaid Akram has been affiliated with Tsinghua University (PhD), University of Luxembourg / SnT (Postdoc), SES Satellites Luxembourg (Visiting Researcher), Xiamen University Malaysia (Assistant Professor), and COMSATS University Islamabad, Lahore Campus (Assistant Professor).",
      },
      {
        question: "Where can I view Dr. Junaid Akram's verified research profiles?",
        answer:
          "You can verify Dr. Junaid Akram's scholarly profiles on ORCID (0000-0003-1752-6124), Google Scholar (user=JunaidAkram), DBLP, ResearchGate, and the official COMSATS University faculty portal.",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Dr. Junaid Akram — Academic Profile & SSA Lab"
      path="/about"
      description="Academic profile of Dr. Junaid Akram, Assistant Professor & HEC PhD supervisor leading the Software Security Assessment Lab at COMSATS University Islamabad, Lahore."
      keywords="Dr Junaid Akram, Junaid Akram PhD, SSA Research Lab, COMSATS Lahore, Tsinghua University PhD, University of Luxembourg postdoc, HEC PhD supervisor, software security researcher"
      jsonLd={aboutJsonLd}
    >
      {/* 1. HERO & LAB MISSION OVERVIEW WITH DIRECTOR CARD */}
      <div className={styles.aboutHeroWrapper}>
        <PageIntro
          eyebrow="About SSA Lab & Collaborations"
          title="Pioneering Source-Code Security Assessment & AI-Driven Software Reliability"
          lead="The Software Security Assessment (SSA) Research Lab unites academic rigor, global international partnerships, and industrial applications to discover software vulnerabilities, synthesize security patches, defend against malware, and automate software verification."
          illustration={
            <div className={styles.aboutHeroLottieWrap}>
              <AcademicLottie
                src="/lottie/ai-brain.json"
                ariaLabel="AI Software Security Inspection Animation"
                speed={0.8}
              />
            </div>
          }
        />
        {coInvestigatorsData[0] && (
          <div className={styles.aboutDirectorCardBanner}>
            <aside className={styles.aboutDirectorCard}>
              <div className={styles.aboutDirectorAvatar}>
                <Image
                  src={coInvestigatorsData[0].image || "/academic/co-investigators/dr-junaid-akram.webp"}
                  alt={coInvestigatorsData[0].name}
                  width={72}
                  height={72}
                />
              </div>
              <div className={styles.aboutDirectorInfo}>
                <h3 className={styles.aboutDirectorName}>{coInvestigatorsData[0].name}</h3>
                <span className={styles.aboutDirectorTitle}>Assistant Professor & HEC PhD Supervisor</span>
                <span className={styles.aboutDirectorMeta}>
                  Tsinghua University PhD · SnT Luxembourg Postdoc
                </span>
                <div className={styles.aboutDirectorLinks}>
                  <a
                    href={`mailto:${coInvestigatorsData[0].email}`}
                    className={styles.aboutDirectorBtn}
                    title="Send Email"
                  >
                    <Mail size={12} /> Email
                  </a>
                  {coInvestigatorsData[0].googleScholar && (
                    <a
                      href={coInvestigatorsData[0].googleScholar}
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
          </div>
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
            {partnerLogosData.map((partner) => {
              const partnerImg = partner.image || staticPartnerMap[partner.name];
              return (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.partnerCardBox}
                >
                  <div className={styles.partnerLogoWrap}>
                    <Image src={partnerImg} alt={partner.name} width={180} height={50} style={{ objectFit: "contain" }} />
                  </div>
                  <h3>{partner.name}</h3>
                  <span className={styles.partnerRole}>{partner.role}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. LAB IMPACT METRICS COUNTER GRID */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.statsGrid}>
          {labImpactStatsData.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statNote}>{stat.note || stat.detail}</div>
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
          {labPillarsData.map((pillar) => (
            <article key={pillar.id || pillar.title} className={styles.pillarCard}>
              <div className={styles.pillarIconWrap}>
                {renderPillarIcon(pillar.iconName, pillar.image)}
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc || pillar.description}</p>
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
            <p style={{ maxWidth: "600px", color: "var(--academic-muted)", fontSize: "0.9rem", margin: 0 }}>
              Explore how SSA Lab evolved from big-data source analytics at Tsinghua University to satellite CPS testing at SnT Luxembourg and AI-driven program repair at COMSATS.
            </p>
          </div>
        </div>

        <div className={styles.timelineWrapper}>
          {/* Timeline Nav / Stepper */}
          <div className={styles.timelineNav}>
            {labMilestonesData.map((ms, idx) => {
              const isActive = activeEraIndex === idx;
              return (
                <button
                  key={ms.era || ms.year || idx}
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
                <Sparkles size={13} /> {currentMilestone.tag || currentMilestone.badge}
              </span>
              <span className={styles.timelineLocation}>
                <MapPin size={14} /> {currentMilestone.location}
              </span>
            </div>
            <h3 className={styles.timelineCardTitle}>{currentMilestone.title}</h3>
            <p className={styles.timelineSummary}>{currentMilestone.summary}</p>

            {currentMilestone.achievements && currentMilestone.achievements.length > 0 && (
              <ul className={styles.achievementList}>
                {currentMilestone.achievements.map((item, i) => (
                  <li key={i} className={styles.achievementItem}>
                    <CheckCircle2 size={16} className={styles.achievementIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentMilestone.stats && (
              <div className={styles.timelineStatsRow}>
                {Object.entries(currentMilestone.stats).map(([k, v]) => (
                  <div key={k} className={styles.timelineStatBadge}>
                    {k.toUpperCase()}: <strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. PEOPLE & RESEARCH COMMUNITY CALLOUT (STREAMLINED SUMMARY LINKING TO /team) */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Team & Networks</p>
            <h2>Research Personnel & Global Collaborators</h2>
          </div>
          <Link href="/team" className={styles.textLink}>
            Explore full directory <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.aboutTeamSpotlightGrid}>
          <div className={styles.aboutTeamSpotlightCard}>
            <div className={styles.aboutTeamSpotlightIcon} style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
              <Users size={24} />
            </div>
            <div className={styles.aboutTeamSpotlightContent}>
              <h3>Faculty & Co-Investigators ({coInvestigatorsData.length})</h3>
              <p>
                International academic partnerships spanning COMSATS Lahore, Tsinghua University, SnT Luxembourg, and KFUPM.
              </p>
              <Link href="/team?tab=pi" className={styles.aboutTeamLink}>
                View Faculty & Co-Investigators <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className={styles.aboutTeamSpotlightCard}>
            <div className={styles.aboutTeamSpotlightIcon} style={{ background: "rgba(6, 182, 212, 0.12)", color: "var(--academic-cyan)" }}>
              <GraduationCap size={24} />
            </div>
            <div className={styles.aboutTeamSpotlightContent}>
              <h3>Postgraduate MS & PhD Theses ({pgResearchersData.length})</h3>
              <p>
                Active Master of Science (MS CS) researchers working on LLM vulnerability detection, program repair, and GNNs.
              </p>
              <Link href="/team?tab=ms" className={styles.aboutTeamLink}>
                View MS & PhD Researchers <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className={styles.aboutTeamSpotlightCard}>
            <div className={styles.aboutTeamSpotlightIcon} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <Building size={24} />
            </div>
            <div className={styles.aboutTeamSpotlightContent}>
              <h3>Alumni Placements ({alumniPlacementsData.length})</h3>
              <p>
                Graduates transitioning into top global technology advisories, cybersecurity firms, and enterprise software teams.
              </p>
              <Link href="/team?tab=alumni" className={styles.aboutTeamLink}>
                View Supervised Alumni <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <div className={styles.btnOrbitWrap}>
            <Link href="/team" className={styles.primaryButton}>
              View Complete People & Partners Directory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </AcademicSiteLayout>
  );
}

export function ResearchPage() {
  const router = useRouter();
  const { siteData } = useAcademicData();
  const researchDomainsData = siteData.researchDomains || researchDomains;
  const [selectedDomain, setSelectedDomain] = useState(null);

  React.useEffect(() => {
    if (router.query.domain) {
      const match = researchDomainsData.find(
        (d) =>
          d.id === router.query.domain ||
          d.slug === router.query.domain ||
          d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === router.query.domain
      );
      if (match) {
        setSelectedDomain(match);
      }
    }
  }, [router.query.domain, researchDomainsData]);

  const researchJsonLd = [
    collectionPageSchema({
      name: "SSA Research Lab — Software Security Research",
      url: `${SITE_URL}/research`,
      description:
        "Research areas, domain roadmaps, and analysis workflows developed by Dr. Junaid Akram and the SSA Lab.",
      items: researchDomainsData.map((d) => ({
        name: d.title,
        url: `${SITE_URL}/research?domain=${d.id || d.slug}`,
        description: d.description,
      })),
    }),
    datasetSchema({
      name: "Hadoop IBFET 324B+ Lines of Code Clone Corpus",
      description:
        "Large-scale code clone index corpus spanning over 324 billion lines of source code processed with distributed Hadoop MapReduce inverted indexing.",
      url: `${SITE_URL}/research?domain=code-clone-analysis`,
      keywords: "code clone detection, Hadoop, IBFET, big data source code analysis, software evolution",
    }),
    datasetSchema({
      name: "SQVDT 152,823+ Open-Source Repository Vulnerability Benchmark",
      description:
        "Comprehensive empirical benchmark of 152,823+ C/C++ open-source software repositories for scalable quantitative source-code vulnerability detection.",
      url: `${SITE_URL}/research?domain=vulnerability-detection`,
      keywords: "vulnerability detection, SQVDT, software security assessment, CVE benchmarking, static analysis",
    }),
    datasetSchema({
      name: "DroidSD & DroidMD 30,500+ Android Application Security Benchmark",
      description:
        "Evaluated dataset of 30,500 Android APKs for bytecode feature extraction, code clone detection, and source-level obfuscated malware defense.",
      url: `${SITE_URL}/research?domain=malware-detection`,
      keywords: "Android malware detection, DroidSD, DroidMD, bytecode similarity, mobile security",
    }),
    datasetSchema({
      name: "VCIPR Function-Level Security Patch Benchmark",
      description:
        "Function-level vulnerable code identification benchmark matching unpatched vulnerable functions to verified security patches.",
      url: `${SITE_URL}/research?domain=vulnerability-detection`,
      keywords: "VCIPR, security patch analysis, function-level vulnerability detection, automated program repair",
    }),
    faqSchema([
      {
        question: "What are the core research pillars of the SSA Lab?",
        answer:
          "The lab focuses on six pillars: 1) Cyber Security, 2) Software Vulnerability Detection, 3) Software Testing & Automated Test Data Generation, 4) Malware Detection & Obfuscation Defense, 5) Code Clone Analysis, and 6) Software Evolution & Reuse.",
      },
      {
        question: "What scale of data does the SSA Lab's research address?",
        answer:
          "The lab's research scales from individual vulnerable statements and functions to repository-scale analysis (152,823+ repositories in SQVDT) and massive distributed corpora (324+ billion lines of code in Hadoop IBFET).",
      },
      {
        question: "What tools has the SSA Lab created for software vulnerability detection?",
        answer:
          "Key platforms include SQVDT (scalable quantitative vulnerability detection), VCIPR (patch-guided function-level identification), DroidSD (indexed Android app similarity detection), and DroidMD (source-level Android malware detection).",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Software Security Research Domains & Frameworks"
      path="/research"
      description="Explore software security research domains, vulnerability detection roadmaps, code clone detection, and analysis workflows developed by Dr. Junaid Akram at SSA Lab."
      keywords="software security research, software vulnerability detection, malware analysis, code clone detection, software testing, source code security, COMSATS Lahore"
      jsonLd={researchJsonLd}
    >
          {selectedDomain && (
        <AcademicDomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
        />
      )}

      <PageIntro
        eyebrow="SSA Research Roadmaps"
        title="Software Security Research with Practical Reach"
        lead="The lab studies source-code vulnerabilities, Android & IoT malware, code clones, software evolution, and testing at scales ranging from individual functions to 324+ billion lines of code."
      />

      {/* Research Domains Visual Cards */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Core Pillars</p>
            <h2>Research Domain Roadmaps</h2>
          </div>
        </div>

        <div className={styles.domainGrid}>
          {researchDomainsData.map((domain, index) => (
            <article
              key={domain.id || domain.slug || domain.title}
              className={`${styles.domainItem} ${styles.interactiveDomainItem}`}
              onClick={() => setSelectedDomain(domain)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedDomain(domain);
                }
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
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

      {/* Direct link to Publications to prevent duplication */}
      <section className={styles.ctaBand}>
        <div>
          <p className={styles.eyebrow}>Peer-Reviewed Literature & Tools</p>
          <h2>Explore Published Papers, Benchmarks & Tools</h2>
          <p style={{ margin: "8px 0 0 0", color: "var(--academic-muted)", fontSize: "0.92rem", maxWidth: "600px" }}>
            All empirical research findings, platforms (SQVDT, VCIPR, DroidSD, DroidMD), and datasets are published with full DOI links and citations in our Publications directory.
          </p>
        </div>
        <div className={styles.btnOrbitWrap}>
          <Link href="/publications" className={styles.primaryButton}>
            View Publications & Papers <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function PublicationsPage() {
  const { siteData } = useAcademicData();
  const publicationsData = siteData.publications || publications;
  const profile = siteData.academicProfile || academicProfile;

  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'row'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'
  const [selectedCitationPub, setSelectedCitationPub] = useState(null);
  const [citationFormat, setCitationFormat] = useState("bibtex"); // 'bibtex', 'ieee', 'apa'
  const [copiedModal, setCopiedModal] = useState(false);

  // Helper to extract domain topic chips from paper titles
  const getPubTags = (title = "") => {
    const tags = [];
    const t = title.toLowerCase();
    if (t.includes("malware") || t.includes("droidmd") || t.includes("mthael")) tags.push("Malware Security");
    if (t.includes("vulnerability") || t.includes("sqvdt") || t.includes("vcipr") || t.includes("benchmark")) tags.push("Vulnerability Detection");
    if (t.includes("clone") || t.includes("obfuscated") || t.includes("droidcc") || t.includes("droidsd")) tags.push("Code Clone Analysis");
    if (t.includes("testing") || t.includes("algorithm") || t.includes("courseware")) tags.push("Software Verification");
    if (tags.length === 0) tags.push("Software Security");
    return tags;
  };

  const filteredPubs = React.useMemo(() => {
    return publicationsData
      .filter((pub) => {
        // Category filter
        if (filterType === "Journal" && pub.type !== "Journal") return false;
        if (filterType === "Conference" && pub.type !== "Conference") return false;

        // Search filter
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          pub.title?.toLowerCase().includes(q) ||
          pub.authors?.toLowerCase().includes(q) ||
          pub.venue?.toLowerCase().includes(q) ||
          pub.year?.includes(q)
        );
      })
      .sort((a, b) => {
        const yearA = parseInt(a.year, 10) || 0;
        const yearB = parseInt(b.year, 10) || 0;
        return sortOrder === "newest" ? yearB - yearA : yearA - yearB;
      });
  }, [publicationsData, filterType, searchQuery, sortOrder]);

  const handleCopyModalCitation = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedModal(true);
    setTimeout(() => setCopiedModal(false), 2200);
  };

  const generateIeeeCitation = (pub) => {
    if (!pub) return "";
    return `${pub.authors}, "${pub.title}," ${pub.venue}, ${pub.year}.`;
  };

  const generateApaCitation = (pub) => {
    if (!pub) return "";
    return `${pub.authors} (${pub.year}). ${pub.title}. ${pub.venue}.`;
  };

  const generateRisCitation = (pub) => {
    if (!pub) return "";
    const typeTag = pub.type === "Conference" ? "CONF" : "JOUR";
    const authorLines = (pub.authors || "")
      .split(/,| and /i)
      .map((a) => a.trim())
      .filter(Boolean)
      .map((a) => `AU  - ${a}`)
      .join("\n");
    return [
      `TY  - ${typeTag}`,
      `TI  - ${pub.title}`,
      authorLines,
      `JO  - ${pub.venue}`,
      `PY  - ${pub.year}`,
      pub.href ? `UR  - ${pub.href}` : "",
      `ER  - `,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const pubsJsonLd = [
    collectionPageSchema({
      name: "Publications — Dr. Junaid Akram",
      url: `${SITE_URL}/publications`,
      description:
        "Peer-reviewed journal and conference publications by Dr. Junaid Akram in software security, testing, malware, and code analysis.",
      items: publicationsData.map((p) => ({
        name: p.title,
        url: p.href || `${SITE_URL}/publications`,
        description: p.venue,
      })),
    }),
    ...publicationsData.map((p) =>
      scholarlyArticleSchema({
        title: p.title,
        authors: p.authors,
        venue: p.venue,
        year: p.year,
        href: p.href,
        doi: p.doi,
        pdfUrl: p.pdfUrl,
      })
    ),
    faqSchema([
      {
        question: "Where are Dr. Junaid Akram's software security papers published?",
        answer:
          "Dr. Junaid Akram's research is published in top-tier SCIE/Scopus-indexed venues including IEEE Transactions on Computers, Software: Practice and Experience (Wiley), Applied Soft Computing (Elsevier), IET Information Security, International Journal of Information and Computer Security, and IEEE ICST / COMPSAC conferences.",
      },
      {
        question: "How can I export or cite publications from the SSA Research Lab?",
        answer:
          "Click the 'Cite' button next to any publication to instantly copy citations in BibTeX, IEEE, APA, or RIS (EndNote/Zotero) formats, or click the DOI link to access the publisher version.",
      },
      {
        question: "What are Dr. Junaid Akram's verified Google Scholar and ORCID profiles?",
        answer:
          "Dr. Junaid Akram's publications can be verified on Google Scholar (https://scholar.google.com/citations?user=JunaidAkram), ORCID (https://orcid.org/0000-0003-1752-6124), DBLP, and ResearchGate.",
      },
    ]),
  ];

  const totalJournals = publicationsData.filter((p) => p.type === "Journal").length;
  const totalConfs = publicationsData.filter((p) => p.type === "Conference").length;
  const totalDoi = publicationsData.filter((p) => p.href).length;

  return (
    <AcademicSiteLayout
      title="Software Security Publications & Research Papers"
      path="/publications"
      description="Peer-reviewed journal and conference publications by Dr. Junaid Akram on software vulnerability detection, program repair, code clones, and malware analysis."
      keywords="Junaid Akram publications, software security research papers, software vulnerability detection papers, code clone analysis papers, malware detection journal, IEEE conference papers, COMSATS research"
      jsonLd={pubsJsonLd}
      citations={publicationsData}
    >
      {/* Page intro header */}
      <PageIntro
        eyebrow="Peer-Reviewed Literature"
        title="Publications & Research Output"
        lead="Discover empirical research spanning source-code vulnerability assessment, Android malware analysis, code clones, and automated software verification."
        illustration={
          <div className={styles.pageHeroIllustrationWrap}>
            <Image
              src="/academic/illustrations/publications-hero.webp"
              alt="Publications & Research Output Illustration"
              width={280}
              height={280}
              priority
              className={styles.illustrationImage}
            />
          </div>
        }
      />

      {/* 1. Key Impact Stats Banner */}
      <section className={styles.section} style={{ paddingTop: 0, paddingBottom: "16px" }}>
        <div className={styles.listingStatsGrid}>
          <div className={styles.statMetricCard}>
            <div className={styles.statMetricIcon}>
              <BookOpen size={22} />
            </div>
            <div className={styles.statMetricContent}>
              <div className={styles.statMetricNumber}>{publicationsData.length}</div>
              <p>Selected Publications</p>
            </div>
          </div>

          <div className={styles.statMetricCard}>
            <div className={styles.statMetricIcon} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <Award size={22} />
            </div>
            <div className={styles.statMetricContent}>
              <div className={styles.statMetricNumber}>{totalJournals}</div>
              <p>Journal Articles (SCIE Q1/Q2)</p>
            </div>
          </div>

          <div className={styles.statMetricCard}>
            <div className={styles.statMetricIcon} style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>
              <Users size={22} />
            </div>
            <div className={styles.statMetricContent}>
              <div className={styles.statMetricNumber}>{totalConfs}</div>
              <p>IEEE Conference Papers</p>
            </div>
          </div>

          <div className={styles.statMetricCard}>
            <div className={styles.statMetricIcon} style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
              <ExternalLink size={22} />
            </div>
            <div className={styles.statMetricContent}>
              <div className={styles.statMetricNumber}>{totalDoi}</div>
              <p>Direct DOI / Open Access</p>
            </div>
          </div>
        </div>

        {/* Academic Profiles Link Buttons */}
        <div className={styles.pubProfileButtonsRow}>
          <a
            href={profile.googleScholar || academicProfile.googleScholar}
            target="_blank"
            rel="noreferrer"
            className={styles.primaryButton}
            style={{ fontSize: "0.83rem", padding: "8px 16px" }}
          >
            Google Scholar Profile <ExternalLink size={14} />
          </a>
          <a
            href={academicProfile.orcid}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
            style={{ fontSize: "0.83rem", padding: "8px 16px" }}
          >
            ORCID ({academicProfile.orcid.replace("https://orcid.org/", "")}) <ExternalLink size={14} />
          </a>
          <a
            href={academicProfile.researchGate}
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
            style={{ fontSize: "0.83rem", padding: "8px 16px" }}
          >
            ResearchGate <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* 2. Interactive Search & Multi-Filter Toolbar */}
      <section className={`${styles.section} ${styles.toolbarSection}`}>
        <div className={styles.toolbarContainer}>
          <div className={styles.toolbarTopRow}>
            {/* Search Input */}
            <div className={styles.toolbarSearchBox}>
              <Search size={16} className={styles.toolbarSearchIcon} />
              <input
                type="text"
                className={styles.toolbarSearchInput}
                placeholder="Search by title, author, venue, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search publications"
              />
              {searchQuery ? (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  ×
                </button>
              ) : null}
            </div>

            {/* View Mode Toggle & Sort Selector */}
            <div className={styles.toolbarRightControls}>
              <div className={styles.viewModeGroup} aria-label="Layout View Switcher">
                <button
                  type="button"
                  className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Visual Cards View"
                >
                  <LayoutGrid size={15} /> Grid
                </button>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${viewMode === "row" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("row")}
                  title="Compact Executive List View"
                >
                  <List size={15} /> Compact
                </button>
              </div>

              <select
                className={styles.sortSelect}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort Order"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className={styles.categoryPillsRow}>
            <button
              type="button"
              className={`${styles.pubFilterTag} ${filterType === "All" ? styles.pubFilterTagActive : ""}`}
              onClick={() => setFilterType("All")}
            >
              All Publications ({publications.length})
            </button>
            <button
              type="button"
              className={`${styles.pubFilterTag} ${filterType === "Journal" ? styles.pubFilterTagActive : ""}`}
              onClick={() => setFilterType("Journal")}
            >
              Journals ({totalJournals})
            </button>
            <button
              type="button"
              className={`${styles.pubFilterTag} ${filterType === "Conference" ? styles.pubFilterTagActive : ""}`}
              onClick={() => setFilterType("Conference")}
            >
              Conferences ({totalConfs})
            </button>
          </div>
        </div>

        {/* 3. Publications Output (Grid Cards vs Compact Rows) */}
        {filteredPubs.length > 0 ? (
          viewMode === "grid" ? (
            <div className={styles.pubCardGrid}>
              {filteredPubs.map((pub) => {
                const isJournal = pub.type === "Journal";
                const tags = getPubTags(pub.title);
                const authorsFormatted = pub.authors
                  ? pub.authors.replace("Junaid Akram", "<strong>Junaid Akram</strong>")
                  : "";

                return (
                  <article
                    key={pub.title}
                    className={styles.pubVisualCard}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                  >
                    <div>
                      <div className={styles.pubCardTop}>
                        <span
                          className={`${styles.venuePill} ${
                            isJournal ? styles.venuePillJournal : styles.venuePillConference
                          }`}
                        >
                          {pub.type || "Peer-Reviewed"}
                        </span>
                        <span className={styles.pubYearBadge}>{pub.year}</span>
                      </div>

                      <h3 className={styles.pubCardTitle} style={{ marginTop: "12px" }}>
                        {pub.title}
                      </h3>

                      <p
                        className={styles.pubAuthorsList}
                        style={{ marginTop: "10px" }}
                        dangerouslySetInnerHTML={{ __html: authorsFormatted }}
                      />

                      <p className={styles.pubVenueText} style={{ marginTop: "8px" }}>
                        {pub.venue}
                      </p>

                      {/* Topic Tags */}
                      <div className={styles.pubTagsRow} style={{ marginTop: "14px" }}>
                        {tags.map((t) => (
                          <span key={t} className={styles.pubTopicTag}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.pubCardFooter}>
                      {pub.href ? (
                        <a
                          href={pub.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.pubActionBtn} ${styles.pubPrimaryBtn}`}
                        >
                          DOI Article <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--academic-muted)" }}>Peer-Reviewed</span>
                      )}

                      <button
                        type="button"
                        className={`${styles.pubActionBtn} ${styles.pubSecondaryBtn}`}
                        onClick={() => {
                          setSelectedCitationPub(pub);
                          setCitationFormat("bibtex");
                        }}
                      >
                        <Quote size={13} /> Cite & Abstract
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Compact Row View */
            <div className={styles.pubRowList}>
              {filteredPubs.map((pub) => {
                const isJournal = pub.type === "Journal";
                return (
                  <article key={pub.title} className={styles.pubRowItem}>
                    <div className={styles.pubRowYear}>{pub.year}</div>
                    <div>
                      <span
                        className={`${styles.venuePill} ${
                          isJournal ? styles.venuePillJournal : styles.venuePillConference
                        }`}
                      >
                        {pub.type}
                      </span>
                    </div>
                    <div>
                      <h4 className={styles.pubRowTitle}>{pub.title}</h4>
                      <p className={styles.pubRowAuthors}>{pub.authors} · <span style={{ color: "var(--academic-blue)" }}>{pub.venue}</span></p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {pub.href && (
                        <a
                          href={pub.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.pubActionBtn} ${styles.pubPrimaryBtn}`}
                          style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                        >
                          DOI <ExternalLink size={12} />
                        </a>
                      )}
                      <button
                        type="button"
                        className={`${styles.pubActionBtn} ${styles.pubSecondaryBtn}`}
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                        onClick={() => {
                          setSelectedCitationPub(pub);
                          setCitationFormat("bibtex");
                        }}
                      >
                        <Quote size={12} /> Cite
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <div className={styles.noResultsBox} style={{ margin: "40px 0", textAlign: "center" }}>
            <p>No publications found matching "{searchQuery}".</p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setSearchQuery("");
                setFilterType("All");
              }}
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        <div style={{ marginTop: "36px" }}>
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

      {/* 4. Interactive Citation & Abstract Modal Drawer */}
      {selectedCitationPub ? (
        <div className={styles.modalOverlay} onClick={() => setSelectedCitationPub(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.sessionBadge} style={{ marginBottom: "6px" }}>
                  {selectedCitationPub.type} · {selectedCitationPub.year}
                </span>
                <h3 className={styles.modalTitle}>{selectedCitationPub.title}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--academic-muted)" }}>
                  {selectedCitationPub.authors}
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--academic-blue)" }}>
                  {selectedCitationPub.venue}
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedCitationPub(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Format Selector Tabs */}
            <div className={styles.citationFormatTabs}>
              <button
                type="button"
                className={`${styles.citationTab} ${citationFormat === "bibtex" ? styles.citationTabActive : ""}`}
                onClick={() => setCitationFormat("bibtex")}
              >
                BibTeX Format
              </button>
              <button
                type="button"
                className={`${styles.citationTab} ${citationFormat === "ieee" ? styles.citationTabActive : ""}`}
                onClick={() => setCitationFormat("ieee")}
              >
                IEEE Style
              </button>
              <button
                type="button"
                className={`${styles.citationTab} ${citationFormat === "apa" ? styles.citationTabActive : ""}`}
                onClick={() => setCitationFormat("apa")}
              >
                APA Style
              </button>
              <button
                type="button"
                className={`${styles.citationTab} ${citationFormat === "ris" ? styles.citationTabActive : ""}`}
                onClick={() => setCitationFormat("ris")}
              >
                RIS / EndNote
              </button>
            </div>

            {/* Citation Content Box */}
            {citationFormat === "bibtex" && (
              <div className={styles.bibtexCodeBox}>
                <button
                  type="button"
                  className={styles.copyFloatingBtn}
                  onClick={() => handleCopyModalCitation(selectedCitationPub.bibtex || generateIeeeCitation(selectedCitationPub))}
                >
                  {copiedModal ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                  {copiedModal ? "Copied!" : "Copy BibTeX"}
                </button>
                {selectedCitationPub.bibtex || generateIeeeCitation(selectedCitationPub)}
              </div>
            )}

            {citationFormat === "ieee" && (
              <div className={styles.bibtexCodeBox}>
                <button
                  type="button"
                  className={styles.copyFloatingBtn}
                  onClick={() => handleCopyModalCitation(generateIeeeCitation(selectedCitationPub))}
                >
                  {copiedModal ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                  {copiedModal ? "Copied!" : "Copy IEEE"}
                </button>
                {generateIeeeCitation(selectedCitationPub)}
              </div>
            )}

            {citationFormat === "apa" && (
              <div className={styles.bibtexCodeBox}>
                <button
                  type="button"
                  className={styles.copyFloatingBtn}
                  onClick={() => handleCopyModalCitation(generateApaCitation(selectedCitationPub))}
                >
                  {copiedModal ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                  {copiedModal ? "Copied!" : "Copy APA"}
                </button>
                {generateApaCitation(selectedCitationPub)}
              </div>
            )}

            {citationFormat === "ris" && (
              <div className={styles.bibtexCodeBox}>
                <button
                  type="button"
                  className={styles.copyFloatingBtn}
                  onClick={() => handleCopyModalCitation(generateRisCitation(selectedCitationPub))}
                >
                  {copiedModal ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                  {copiedModal ? "Copied!" : "Copy RIS"}
                </button>
                {generateRisCitation(selectedCitationPub)}
              </div>
            )}

            {selectedCitationPub.href ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={selectedCitationPub.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryButton}
                  style={{ fontSize: "0.85rem", padding: "8px 18px" }}
                >
                  Open Full Publisher Paper (DOI) <ExternalLink size={14} />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Collaboration Callout */}

      <section className={styles.ctaBand}>
        <div>
          <p className={styles.eyebrow}>Research Collaboration</p>
          <h2>Interested in co-authoring or reviewing research?</h2>
        </div>
        <div className={styles.btnOrbitWrap}>
          <Link href="/contact" className={styles.primaryButton}>
            Contact Dr Junaid <ArrowRight size={17} />
          </Link>
        </div>
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
      softwareProjectSchema({
        name: p.title,
        description: `Final-year supervised research project by ${p.student} at ${p.institution}, supervised by Dr. Junaid Akram.`,
        url: `${SITE_URL}/supervision`,
        keywords: p.technologies ? p.technologies.join(", ") : undefined,
      })
    ),
    faqSchema([
      {
        question: "Who can apply for FYP or thesis supervision at SSA Lab?",
        answer:
          "BS Software Engineering, BS Computer Science, and MS/PhD students at COMSATS University Islamabad, Lahore Campus are eligible to apply for FYP and research thesis supervision under Dr. Junaid Akram.",
      },
      {
        question: "What are the key FYP project topics currently offered by Dr. Junaid Akram?",
        answer:
          "Active topics include LLM-based vulnerability detection, automated vulnerability patch optimization, semantic code clone detection, graph neural network code smell analysis, and robust Android malware detection.",
      },
      {
        question: "How do students contact Dr. Junaid Akram for supervision approval?",
        answer:
          "Interested student groups should prepare their member names, registration numbers, CGPA, technical skills, and preferred project ideas, and contact Dr. Junaid Akram at junaidakram@cuilahore.edu.pk or visit H Block Room 14, COMSATS Lahore.",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Software Engineering FYP Supervision & Research Projects"
      path="/supervision"
      description="Explore BS & MS Software Engineering FYP supervision, running projects, and research opportunities led by Dr. Junaid Akram at COMSATS University Islamabad, Lahore."
      keywords="Software Engineering FYP Supervision, COMSATS FYP projects, software security research, cybersecurity FYP ideas, BS software engineering projects, Dr Junaid Akram supervision"
      jsonLd={supervisionJsonLd}
    >
      <PageIntro
        eyebrow="FYP Supervision"
        title="Supervised final-year projects and research opportunities."
        lead="Explore open COMSATS final-year project topics alongside completed student projects supervised under Dr Junaid Akram's SSA Laboratory."
        illustration={
          <div className={styles.pageHeroIllustrationWrap}>
            <Image
              src="/academic/illustrations/supervision-hero.webp"
              alt="Supervised final-year projects and research opportunities"
              width={280}
              height={280}
              priority
              className={styles.illustrationImage}
            />
          </div>
        }
      />

      {/* Interactive Directory Component */}
      <AcademicFypListing projects={fypProjects} />

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
          <div className={styles.btnOrbitWrap}>
            <Link href="/contact" className={styles.primaryButton}>
              Submit Supervision Inquiry <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

const staticCoInvestigatorMap = {
  "Prof. Ping Luo": "/academic/ping-luo.jpg",
  "Dr. Mohammad Hammoudeh": "/academic/mohammad-hammoudeh.jpg",
  "Dr. Junaid Akram": "/academic/junaid-akram-professor.jpg",
  "Dr. Danish Vasan": "/academic/danish-vassan.jpg",
  "Dr. Majid Mumtaz": "/academic/majid-mumtaz.png",
  "Dr. Adel F. Ahmed": "/academic/adel-ahmed.png",
};

const staticPgMap = {
  "Muhammad Haris": "/academic/muhammad-haris.png",
  "Muhammad Orangzaib": "/academic/muhammad-orangzaib.png",
  "Mahzaib Mukhtar": "/academic/mahzaib-mukhtar.png",
  "Zain Ul Abdeen": "/academic/zain-ul-abdeen.png",
  "Ahsan Nisar": "/academic/ahsan-nisar.png",
  "Farina Iqbal": "/academic/farina-iqbal.png",
  "Hafsa Butt": "/academic/hafsa-butt.png",
};

const staticPartnerMap = {
  "COMSATS University Islamabad": "/academic/comsats-university-islamabad-logo.png",
  "Tsinghua University": "/academic/tsinghua-university-logo.webp",
  "University of Luxembourg (SnT)": "/academic/snt-university-luxembourg-logo.png",
  "SES Satellites": "/academic/ses-logo.png",
  "King Fahd University (KFUPM)": "/academic/king-fahd-university-logo.png",
};

const staticStudentMap = {
  "Ghulam Mujtaba": "/academic/students/ghulam-mujtaba.png",
  "Muhammad Waqar Ul Mulk": "/academic/students/muhammad-waqar-ul-mulk.png",
  "Muhammad Muneeb Azhar": "/academic/students/muhammad-muneeb-azhar.png",
  "Hafiz Muhammad Shams ul Huda": "/academic/students/hafiz-shams-ul-huda.png",
};

export function TeamPage() {
  const { siteData } = useAcademicData();
  const coInvestigatorsData = siteData.coInvestigators || coInvestigators;
  const pgResearchersData = siteData.pgResearchers || pgResearchers;
  const alumniPlacementsData = siteData.alumniPlacements || alumniPlacements;
  const partnerLogosData = siteData.partnerLogos || partnerLogos;
  const supervisedProjectsData = siteData.supervisedProjects || supervisedProjects;
  const fypProjectsData = siteData.fypProjects || defaultFypProjects;

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  React.useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  const showPi = activeTab === "all" || activeTab === "pi";
  const showMs = activeTab === "all" || activeTab === "ms";
  const showBs = activeTab === "all" || activeTab === "bs";
  const showAlumni = activeTab === "all" || activeTab === "alumni";
  const showPartners = activeTab === "all" || activeTab === "partners";

  const allPersonnel = [
    ...coInvestigatorsData.map((c) => ({ ...c, type: "Faculty & Investigator" })),
    ...pgResearchersData.map((p) => ({ ...p, type: "Postgraduate MS/PhD Researcher" })),
  ];

  const teamJsonLd = [
    collectionPageSchema({
      name: "SSA Lab — People & Partners",
      url: `${SITE_URL}/team`,
      description:
        "Dr. Junaid Akram, international co-investigators, MS/PhD researchers, BS engineering teams, alumni, and partner institutions of SSA Lab.",
      items: [
        ...allPersonnel.map((p) => ({ name: p.name, url: `${SITE_URL}/team` })),
      ],
    }),
    personSchema(),
    ...coInvestigatorsData.slice(0, 4).map((m) =>
      personMemberSchema({
        name: m.name,
        role: m.role || "Co-Investigator",
        image: m.image ? `${SITE_URL}${m.image}` : undefined,
        url: m.profileUrl || `${SITE_URL}/team`,
        university: m.institution,
        researchArea: m.researchArea,
      })
    ),
    ...pgResearchersData.slice(0, 4).map((m) =>
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
      description="Dr. Junaid Akram, international co-investigators, MS/PhD researchers, BS engineering teams, alumni, and partner institutions of SSA Lab."
      keywords="SSA Lab team, software security researchers, COMSATS research group members, PhD students software security, international collaborators Pakistan"
      jsonLd={teamJsonLd}
    >
      {/* PAGE INTRO HEADER */}
      <PageIntro
        eyebrow="SSA Research & Development Team"
        title="People, Collaborators & Institutional Partners"
        lead="Connecting principal investigators, international co-investigators, postgraduate MS & PhD thesis researchers, undergraduate BS engineering teams, and institutional partner organizations across software security and program repair."
        illustration={
          <div className={styles.pageHeroIllustrationWrap}>
            <Image
              src="/academic/illustrations/team-hero.webp"
              alt="People, Collaborators & Institutional Partners 3D Illustration"
              width={280}
              height={280}
              priority
              className={styles.illustrationImage}
            />
          </div>
        }
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
            👨‍🏫 Faculty & Co-Investigators ({coInvestigatorsData.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "ms" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("ms")}
          >
            🎓 Postgraduate Team — MS & PhD ({pgResearchersData.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "bs" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("bs")}
          >
            💻 Undergraduate Team — BS Engineering ({fypProjectsData.filter((p) => !p.isOpportunity && (p.institution || "").includes("COMSATS")).length + supervisedProjectsData.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "alumni" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("alumni")}
          >
            💼 Alumni & Placements ({alumniPlacementsData.length})
          </button>
          <button
            type="button"
            className={`${styles.collabTab} ${activeTab === "partners" ? styles.activeCollabTab : ""}`}
            onClick={() => setActiveTab("partners")}
          >
            🏛️ Institutional Partners ({partnerLogosData.length})
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
            {coInvestigatorsData.map((pi) => {
              const piImage = pi.image || staticCoInvestigatorMap[pi.name];
              return (
                <article key={pi.name} className={styles.collabCard}>
                  <div className={styles.collabTop}>
                    <div className={styles.collabAvatar}>
                      {piImage ? (
                        <AcademicImageLightbox
                          src={piImage}
                          alt={pi.name}
                          width={120}
                          height={120}
                          caption={`${pi.name} — ${pi.role}`}
                          showZoomHint={false}
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
              );
            })}
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
            {pgResearchersData.map((student) => {
              const studentImage = student.image || staticPgMap[student.name];
              return (
                <article key={student.id || student.name} className={styles.collabCard}>
                  <div className={styles.collabTop}>
                    <div className={styles.collabAvatar} style={{ border: "2.5px solid var(--academic-cyan)" }}>
                      {studentImage ? (
                        <AcademicImageLightbox
                          src={studentImage}
                          alt={student.name}
                          width={120}
                          height={120}
                          caption={`${student.name} (${student.id || student.memberId}) — ${student.degree}`}
                          showZoomHint={false}
                        />
                      ) : (
                        <span style={{ color: "var(--academic-cyan)", fontSize: "0.95rem" }}>
                          {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                      )}
                    </div>
                    <div className={styles.collabMeta}>
                      <h3>{student.name}</h3>
                      <span className={styles.collabBadge}>{student.degree} {student.id ? `· ${student.id}` : student.memberId ? `· ${student.memberId}` : ""}</span>
                      <div className={styles.collabBadge} style={{ marginTop: "4px", background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                        {student.status}
                      </div>
                    </div>
                  </div>

                  <div className={styles.collabBody}>
                    <p className={styles.collabTopic} style={{ marginBottom: "8px" }}>
                      <strong>Thesis:</strong> {student.topic || student.specialization}
                    </p>
                    <p className={styles.collabFocus}>
                      <strong>Research Focus:</strong> {student.focus || student.bio}
                    </p>
                  </div>

                  <div className={styles.collabFooter}>
                    <span className={styles.collabFocus} style={{ fontSize: "0.74rem" }}>
                      <Building size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {student.institution || "COMSATS University Islamabad"}
                    </span>
                    {student.email && (
                      <a href={`mailto:${student.email}`} className={styles.collabLinkBtn}>
                        <Mail size={13} /> Email
                      </a>
                    )}
                    {student.linkedin && (
                      <a href={student.linkedin} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                        <ExternalLink size={13} /> LinkedIn
                      </a>
                    )}
                    {student.googleScholar && (
                      <a href={student.googleScholar} target="_blank" rel="noreferrer" className={styles.collabLinkBtn}>
                        <ExternalLink size={13} /> Scholar
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
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
            COMSATS BS Final-Year Engineering Teams
          </h3>

          <div className={styles.collabGrid} style={{ marginBottom: "48px" }}>
            {fypProjectsData
              .filter((fyp) => !fyp.isOpportunity && (fyp.institution || "").includes("COMSATS"))
              .map((fyp) => (
                <article key={fyp.slug || fyp._id} className={styles.collabCard}>
                  <div className={styles.collabTop}>
                    <div className={styles.collabAvatar} style={{ borderRadius: "8px", width: "48px", height: "48px" }}>
                      <Users size={22} />
                    </div>
                    <div className={styles.collabMeta}>
                      <h3>{fyp.title}</h3>
                      <span className={styles.collabBadge}>{fyp.programme} · {fyp.session}</span>
                      <div className={styles.collabDegree}>{fyp.projectType || "Final Year Project"} ({fyp.nature || "Software Security"})</div>
                    </div>
                  </div>

                  <div className={styles.collabBody}>
                    <p className={styles.collabFocus} style={{ marginBottom: "12px" }}>
                      {fyp.summary}
                    </p>
                    {fyp.students && fyp.students.length > 0 && (
                      <div style={{ marginTop: "12px", marginBottom: "14px" }}>
                        <p className={styles.collabTopic} style={{ fontSize: "0.8rem", marginBottom: "8px" }}>
                          <strong>Team Members:</strong>
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {fyp.students.map((st) => {
                            const studentAvatar = st.image || staticStudentMap[st.name];
                            return (
                              <div
                                key={st.name}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: studentAvatar ? "8px" : "4px",
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid var(--academic-border)",
                                  padding: studentAvatar ? "3px 10px 3px 4px" : "4px 10px",
                                  borderRadius: "18px",
                                }}
                              >
                                {studentAvatar && (
                                  <img
                                    src={studentAvatar}
                                    alt={st.name}
                                    width={24}
                                    height={24}
                                    style={{ borderRadius: "50%", objectFit: "cover" }}
                                  />
                                )}
                                <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--academic-text)" }}>
                                  {st.name}
                                  {st.registration && (
                                    <span style={{ color: "var(--academic-muted)", fontSize: "0.72rem", marginLeft: "4px" }}>
                                      ({st.registration})
                                    </span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {fyp.supervisor && (
                      <div className={styles.collabFocus} style={{ fontSize: "0.75rem" }}>
                        Supervisor: <strong>{fyp.supervisor}</strong> {fyp.coSupervisor && `| Co-Supervisor: ${fyp.coSupervisor}`}
                      </div>
                    )}
                  </div>

                  <div className={styles.collabFooter}>
                    <Link href={`/supervision/projects/${fyp.slug}`} className={styles.collabLinkBtn}>
                      View FYP Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
          </div>

          <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.2rem", marginBottom: "18px" }}>
            International Supervised Student Projects (Xiamen University)
          </h3>

          <div className={styles.collabGrid}>
            {supervisedProjectsData.map((proj) => (
              <article key={`${proj.student}-${proj.title}`} className={styles.collabCard}>
                <div className={styles.collabTop}>
                  <div className={styles.collabAvatar} style={{ width: "44px", height: "44px", fontSize: "0.9rem", background: "rgba(6, 182, 212, 0.1)", color: "var(--academic-cyan)" }}>
                    <GraduationCap size={22} />
                  </div>
                  <div className={styles.collabMeta}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>{proj.student}</h3>
                    <span className={styles.collabBadge}>{proj.term}</span>
                    <div className={styles.collabDegree}>{proj.institution}</div>
                  </div>
                </div>
                <div className={styles.collabBody}>
                  <p className={styles.collabFocus} style={{ marginBottom: "8px" }}>
                    <strong>Research Project:</strong> {proj.title}
                  </p>
                  <div className={styles.collabFocus} style={{ fontSize: "0.78rem", color: "var(--academic-muted)" }}>
                    Supervisor: <strong style={{ color: "var(--academic-text)" }}>Dr. Junaid Akram</strong>
                  </div>
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
            {alumniPlacementsData.map((placement) => (
              <article key={`${placement.name}-${placement.organization}`}>
                <div>
                  <h3>{placement.name}</h3>
                  <p>{placement.organization || placement.affiliation}</p>
                </div>
                <span>{placement.term || placement.period}</span>
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
              {partnerLogosData.map((partner) => {
                const partnerImg = partner.image || staticPartnerMap[partner.name];
                return (
                  <a
                    key={partner.name}
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.partnerCardBox}
                  >
                    <div className={styles.partnerLogoWrap}>
                      <Image src={partnerImg} alt={partner.name} width={180} height={50} style={{ objectFit: "contain" }} />
                    </div>
                    <h3>{partner.name}</h3>
                    <span className={styles.partnerRole}>{partner.role}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </AcademicSiteLayout>
  );
}

export function EventsPage() {
  const { siteData } = useAcademicData();
  const eventHighlightsData = siteData.eventHighlights || eventHighlights;
  const eventGalleryData = siteData.eventGallery || eventGallery;

  const eventsJsonLd = [
    collectionPageSchema({
      name: "SSA Lab — Events & Presentations",
      url: `${SITE_URL}/events`,
      description:
        "Selected international conference keynotes, workshops, and research presentations led by Dr. Junaid Akram and SSA Research Lab.",
      items: eventHighlightsData.map((e) => ({
        name: e.title,
        url: `${SITE_URL}/events`,
        description: e.description || e.summary || e.venue,
      })),
    }),
    ...eventHighlightsData.slice(0, 6).map((e) =>
      eventSchema({
        name: e.title,
        description: e.description || e.summary || `${e.category || e.badge || "Event"} — ${e.venue || "International conference"}`,
        startDate: e.year ? `${e.year}-01-01` : undefined,
        url: `${SITE_URL}/events`,
      })
    ),
  ];

  return (
    <AcademicSiteLayout
      title="Events & Presentations"
      path="/events"
      description="Selected international conference keynotes, workshops, and research presentations led by Dr. Junaid Akram and SSA Research Lab."
      keywords="Junaid Akram keynote, software security conference, SSA Lab events, international research workshops, Pakistan cybersecurity conference"
      jsonLd={eventsJsonLd}
    >
      <PageIntro
        eyebrow="International Events & Keynotes"
        title="Research presented and shared on global stages."
        lead="Selected international workshops, keynotes, peer-reviewed conference presentations, and academic partnership events featuring Dr Junaid Akram and SSA Research Lab."
        illustration={
          <div className={styles.pageHeroIllustrationWrap}>
            <Image
              src="/academic/illustrations/event-hero.webp"
              alt="International Events & Keynotes 3D Illustration"
              width={280}
              height={280}
              priority
              className={styles.illustrationImage}
            />
          </div>
        }
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
          {eventHighlightsData.map((event) => (
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
          {eventGalleryData.map((image) => {
            const isPortrait = image.orientation === "portrait";
            return (
              <article key={image.src || image.image} className={styles.eventGalleryCard}>
                <div className={`${styles.eventMediaBox} ${isPortrait ? styles.eventMediaPortrait : styles.eventMediaLandscape}`}>
                  <span className={styles.eventTopBadge}>
                    <Sparkles size={12} /> {image.badge}
                  </span>
                  <AcademicImageLightbox
                    src={image.src || image.image}
                    alt={image.alt || image.title}
                    width={image.width || 1280}
                    height={image.height || 900}
                    caption={image.caption || image.title}
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
                      {image.category} {image.date ? `· ${image.date}` : ""}
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
  const { siteData } = useAcademicData();
  const profile = siteData.academicProfile || academicProfile;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    enquiryType: "FYP Supervision",
    topic: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry. Please try again.");
      }

      setFormSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CONTACT_FAQS = [
    {
      question: "How can I apply for FYP supervision by Dr. Junaid Akram?",
      answer:
        "Email junaidakram@cuilahore.edu.pk with your group members' names, registration numbers, current CGPA, selected FYP topic, and technical background.",
    },
    {
      question: "What research areas does the SSA Lab focus on?",
      answer:
        "The SSA Lab focuses on software vulnerability detection, code clone analysis, malware detection, automated software testing, and software evolution.",
    },
    {
      question: "Is Dr. Junaid Akram an HEC-approved PhD supervisor?",
      answer:
        "Yes. Dr. Junaid Akram is an HEC-approved PhD supervisor at COMSATS University Islamabad, Lahore Campus.",
    },
    {
      question: "What is Dr. Junaid Akram's office location?",
      answer:
        `${profile.office || academicProfile.office}, COMSATS University Islamabad, Lahore Campus, Defence Road, Off Raiwind Road, Lahore, Pakistan.`,
    },
  ];

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
    faqSchema(CONTACT_FAQS),
  ];

  return (
    <AcademicSiteLayout
      title="Contact SSA Research Lab"
      path="/contact"
      description="Contact Dr. Junaid Akram and the SSA Research Lab at COMSATS University Islamabad, Lahore Campus for research collaborations and student supervision inquiries."
      keywords="contact Junaid Akram, SSA Lab contact, COMSATS Lahore faculty contact, PhD supervision enquiry Pakistan, software security collaboration"
      jsonLd={contactJsonLd}
    >
      <PageIntro
        eyebrow="Contact"
        title="Discuss research, supervision, or collaboration."
        lead="For research collaboration, student supervision, and SSA Lab enquiries, use the verified institutional contact details below or submit an enquiry form."
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
          <div className={styles.contactVisualCopy}>
            <p className={styles.eyebrow}>SSA Research Lab</p>
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
            <a href={`mailto:${profile.emails?.[0] || academicProfile.emails[0]}`}>
              {profile.emails?.[0] || academicProfile.emails[0]}
            </a>
            <a href={`mailto:${profile.labEmail || academicProfile.labEmail}`}>
              {profile.labEmail || academicProfile.labEmail}
            </a>
          </div>

          <div className={styles.contactCard}>
            <MapPin size={24} />
            <span>Office Location</span>
            <strong>{profile.office || academicProfile.office}</strong>
            <p>{profile.institution || academicProfile.institution}</p>
          </div>

          <div className={styles.contactCard}>
            <ExternalLink size={24} />
            <span>Academic Profiles</span>
            <a href={profile.officialProfile || academicProfile.officialProfile} target="_blank" rel="noreferrer">
              Official COMSATS profile
            </a>
            <a href={profile.googleScholar || academicProfile.googleScholar} target="_blank" rel="noreferrer">
              Google Scholar
            </a>
            <a href={profile.orcid || academicProfile.orcid} target="_blank" rel="noreferrer">
              ORCID profile
            </a>
            <a href={profile.researchGate || academicProfile.researchGate} target="_blank" rel="noreferrer">
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
            <p className={styles.sectionLead}>
              Submit your research interests, FYP supervision requests, or collaboration inquiries directly to Dr. Junaid Akram.
            </p>
          </div>
        </div>

        {formSubmitted ? (
          <div
            style={{
              padding: "28px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "12px",
              maxWidth: "680px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <CheckCircle2 size={24} style={{ color: "#10b981" }} />
              <h3 style={{ color: "#10b981", margin: 0, fontSize: "1.2rem" }}>Enquiry Submitted Successfully</h3>
            </div>
            <p style={{ marginTop: "12px", lineHeight: "1.6" }}>
              Thank you, <strong>{formData.name}</strong>. Your enquiry has been received and saved into our research database. An email notification with your details has also been dispatched to the lab director at <strong>jnd.akram@hotmail.com</strong>.
            </p>
            <button
              type="button"
              className={styles.secondaryButton}
              style={{ marginTop: "16px" }}
              onClick={() => {
                setFormSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  degree: "",
                  enquiryType: "FYP Supervision",
                  topic: "",
                  message: "",
                });
              }}
            >
              Send another enquiry
            </button>
          </div>
        ) : (
          <div className={styles.enquirySectionGrid}>
            <form
              onSubmit={handleSubmit}
              className={styles.enquiryFormCard}
            >
              {submitError && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    color: "#ef4444",
                    fontSize: "0.9rem",
                  }}
                >
                  {submitError}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "6px" }} htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    className={styles.formInput}
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
                    disabled={isSubmitting}
                    className={styles.formInput}
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
                    disabled={isSubmitting}
                    placeholder="e.g. BS Software Engineering (FA22)"
                    className={styles.formInput}
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
                    disabled={isSubmitting}
                    className={styles.enquirySelect}
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
                  disabled={isSubmitting}
                  placeholder="e.g. Source code vulnerability detection / MegiLance"
                  className={styles.formInput}
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
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Describe your background, proposed research idea, or supervision query..."
                  className={styles.formInput}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className={styles.btnOrbitWrap} style={{ justifySelf: "start" }}>
                <button type="submit" disabled={isSubmitting} className={styles.primaryButton} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? "Sending Enquiry..." : "Submit Enquiry"} <Send size={15} />
                </button>
              </div>
            </form>

            <aside className={styles.enquirySidebarCard}>
              <div className={styles.enquiryIllustrationBox}>
                <img
                  src="/academic/illustrations/contact-hero.webp"
                  alt="Supervision & Research Enquiry 3D Illustration"
                  width={220}
                  height={200}
                  style={{ objectFit: 'contain', maxHeight: '190px' }}
                  className={styles.illustrationImage}
                />
              </div>
              <div className={styles.enquirySidebarDetails}>
                <h3>Direct Consultation</h3>
                <p>
                  Submit your research background, degree program, or collaboration inquiry directly to Dr. Junaid Akram for research and FYP assessment.
                </p>
                <div className={styles.enquirySidebarBadge}>
                  <ShieldCheck size={16} /> 24–48h Response Window
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* ── FAQ Section (Visible matching FAQPage Schema) ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 min(100%, 600px)' }}>
            <p className={styles.eyebrow}>Frequently Asked Questions</p>
            <h2>Supervision & Research FAQs</h2>
            <p className={styles.sectionLead}>
              Common questions about SSA Lab student requirements, research tools, thesis topics, and meeting schedules.
            </p>
          </div>
          <div className={styles.projectIllustrationCard} style={{ flexShrink: 0, margin: '0 auto', padding: '12px 18px' }}>
            <img
              src="/academic/illustrations/faq-helpdesk.webp"
              alt="SSA Lab FAQs 3D Illustration"
              width={160}
              height={140}
              style={{ objectFit: 'contain', maxHeight: '130px' }}
              className={styles.illustrationImage}
            />
          </div>
        </div>
        <div className={styles.faqGrid}>
          {CONTACT_FAQS.map((faq, index) => (
            <div key={index} className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>
                <HelpCircle size={18} className={styles.faqIcon} />
                {faq.question}
              </h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className={`${styles.section} ${styles.campusSection}`}>
        <div className={styles.campusCopy}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <img
              src="/academic/illustrations/ai-chatbot-assistant.webp"
              alt="Lab Directions & Assistance 3D Avatar"
              width={56}
              height={56}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <p className={styles.eyebrow} style={{ margin: 0 }}>Visit the campus</p>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>COMSATS University Islamabad, Lahore Campus</h2>
            </div>
          </div>
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.9950334812693!2d74.2660163750567!3d31.417409952044813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190209632870bb%3A0x6e788c7f7ec49e48!2sCOMSATS%20University%20Islamabad%2C%20Lahore%20Campus!5e0!3m2!1sen!2s!4v1724261700000!5m2!1sen!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
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
      description="Privacy policy for the academic website of Dr. Junaid Akram and the Software Security Assessment (SSA) Research Lab at COMSATS University Islamabad."
    >
      <PageIntro
        eyebrow="Privacy"
        title="A simple academic website with minimal data collection."
        lead="This site presents public academic information. It does not sell personal data or require a visitor account."
      />
      <section className={`${styles.section} ${styles.prose}`}>
        <h2>Information you provide</h2>
        <p>
          If you contact Dr. Junaid Akram or the SSA Lab by email or form, the information you send is used only to respond to your enquiry, research proposal, collaboration request, or supervision question.
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
