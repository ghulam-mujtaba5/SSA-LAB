import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Microscope,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicPipelineHero from "./AcademicPipelineHero";
import AcademicDomainModal from "./AcademicDomainModal";
import DomainTechnicalGraphic, { DataInfrastructureGraphic } from "./AcademicTechnicalVisuals";
import InteractiveCodeScanner from "./InteractiveCodeScanner";
import HeroRetroGrid from "./HeroRetroGrid";
import BorderBeam from "./BorderBeam";
import SpotlightBentoCard from "./SpotlightBentoCard";
import NumberTicker from "./NumberTicker";
import Magnetic from "../AnimatedUI/Magnetic";
import {
  academicProfile,
  partnerLogos,
  publications,
  researchDomains,
  supervisedProjects,
} from "../../data/academicSite";
import { defaultFypProjects } from "../../data/fypProjects";
import { useAcademicData } from "../../context/AcademicDataContext";
import { useTheme } from "../../context/ThemeContext";
import {
  datasetSchema,
  faqSchema,
  profilePageSchema,
} from "../SEO";
import styles from "./AcademicSite.module.css";

const impactStats = [
  {
    value: "324B+",
    label: "Lines of Code Analyzed",
    detail: "Indexed on Hadoop MapReduce",
    image: "/academic/illustrations/billion-lines-code.webp",
  },
  {
    value: "152,823+",
    label: "Open-Source Repos Scanned",
    detail: "SQVDT Vulnerability Engine",
    image: "/academic/illustrations/repo-analyzed.webp",
  },
  {
    value: "15+",
    label: "High-Impact Publications",
    detail: "Applied Soft Computing, IEEE, IET",
    image: "/academic/illustrations/publications-hero.webp",
  },
  {
    value: "50+",
    label: "Researchers & Students Mentored",
    detail: "PhD, MS & BS Engineering Graduates",
    image: "/academic/illustrations/team-hero.webp",
  },
];

const domainIllustrationMap = {
  "cyber-security": "/academic/illustrations/cyber-security.webp",
  "vulnerability-detection": "/academic/illustrations/vulnerability-detection.webp",
  "software-testing": "/academic/illustrations/software-testing.webp",
  "malware-detection": "/academic/illustrations/malware-detection.webp",
  "code-clone-analysis": "/academic/illustrations/code-cloning.webp",
  "software-evolution-reuse": "/academic/illustrations/software-evolution-reuse.webp",
};

export default function AcademicHome() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { siteData } = useAcademicData();
  const academicProfileData = siteData.academicProfile || academicProfile;
  const researchDomainsData = siteData.researchDomains || researchDomains;
  const publicationsData = siteData.publications || publications;
  const partnerLogosData = siteData.partnerLogos || partnerLogos;
  const supervisedProjectsData = siteData.supervisedProjects || supervisedProjects;
  const fypProjectsData = siteData.fypProjects || defaultFypProjects;
  const labImpactStatsData = (siteData.labImpactStats?.length ? siteData.labImpactStats : impactStats).slice(0, 4);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Filter top Tier A research projects for the homepage showcase (curated preview)
  const topProjects = fypProjectsData
    .filter((p) => !p.isOpportunity)
    .slice(0, 4);

  const homeJsonLd = [
    profilePageSchema({
      name: "Dr. Junaid Akram — SSA Research Lab",
      description:
        "Software Security Assessment Lab led by Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus. Advancing vulnerability detection, malware analysis, semantic code clone detection, and automated software verification.",
    }),
    datasetSchema({
      name: "Hadoop IBFET 324B+ Lines of Code Clone Corpus",
      description:
        "Large-scale code clone index corpus spanning over 324 billion lines of source code processed with distributed Hadoop MapReduce inverted indexing.",
      keywords: "code clone detection, Hadoop, IBFET, big data source code analysis, software evolution",
    }),
    datasetSchema({
      name: "SQVDT 152,823+ Open-Source Repository Vulnerability Benchmark",
      description:
        "Comprehensive empirical benchmark of 152,823+ C/C++ open-source software repositories for scalable quantitative source-code vulnerability detection.",
      keywords: "vulnerability detection, SQVDT, software security assessment, CVE benchmarking, static analysis",
    }),
    faqSchema([
      {
        question: "What is the Software Security Assessment (SSA) Lab?",
        answer:
          "The SSA Lab is a dedicated academic research laboratory led by Dr. Junaid Akram. The lab specializes in source-code vulnerability detection, LLM automated program repair, semantic code clone analysis, malware defense, and software verification.",
      },
      {
        question: "Who directs the SSA Research Lab?",
        answer:
          "The lab is directed by Dr. Junaid Akram, Assistant Professor at University of Nottingham Ningbo China (UNNC), who earned his PhD in Software Engineering from Tsinghua University and completed postdoctoral research at SnT, University of Luxembourg.",
      },
      {
        question: "What major tools and benchmarks has the SSA Lab created?",
        answer:
          "The lab has developed SQVDT (repository-scale vulnerability detection), VCIPR (patch-guided function-level detection), DroidSD (indexed Android app similarity detection), DroidMD (source-level Android malware detection), and IBFET (Hadoop-based 324B+ LOC clone analysis).",
      },
      {
        question: "How to collaborate or apply for student supervision?",
        answer:
          "Prospective research collaborators and students can contact Dr. Junaid Akram via email at Junaid.Akram@nottingham.edu.cn or through the Contact page.",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Software Security & Source Code Analysis Research"
      path="/"
      description="Software Security Assessment Lab led by Dr. Junaid Akram at University of Nottingham Ningbo China. Specializing in source code security, LLM vulnerability detection, code clone analysis, and malware defense."
      keywords="Software Security Assessment Lab, Dr. Junaid Akram, software vulnerability detection, LLM vulnerability detection, semantic code clone detection, University of Nottingham Ningbo China, UNNC, malware analysis, automated software testing"
      jsonLd={homeJsonLd}
      citations={publicationsData.slice(0, 5)}
    >
      {selectedDomain && (
        <AcademicDomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
        />
      )}
      {/* 1. Hero Section with Retro Grid & Cyber Depth */}
      <section className={styles.hero} style={{ position: "relative", overflow: "hidden" }}>
        <HeroRetroGrid angle={65} opacity={0.35} />
        <div className={styles.heroInner} style={{ position: "relative", zIndex: 1 }}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Software security research & supervision</p>
            <h1>
              Advancing software security through source-code analysis, testing, and vulnerability research.
            </h1>
            <p className={styles.heroLead}>
              Led by Dr Junaid Akram, the SSA Lab develops practical methods and tools for vulnerability detection, malware analysis, code-clone analysis, and automated software testing.
            </p>
            <ul className={styles.credentialList}>
              {(academicProfileData.credentials || []).map((credential) => (
                <li key={credential}>
                  <ShieldCheck size={18} /> {credential}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <div className={styles.btnOrbitWrap}>
                <Magnetic>
                  <Link href="/research" className={styles.primaryButton}>
                    Explore Research <ArrowRight size={17} />
                  </Link>
                </Magnetic>
              </div>
              <div className={styles.btnOrbitWrap}>
                <Magnetic>
                  <Link href="/supervision" className={styles.secondaryButton}>
                    Supervision Directory
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className={styles.heroIllustrationContainer}>
            <AcademicImageLightbox
              src="/academic/illustrations/homepage-hero.webp"
              alt="SSA Research Lab — Software Security Assessment Platform"
              width={800}
              height={800}
              priority
              caption="SSA Research Lab — Advancing Software Security through Source-Code Analysis, Testing, and Vulnerability Research"
              className={styles.heroIllustrationLightbox}
              imageClassName={styles.heroIllustrationImg}
              sizes="(max-width: 780px) 100vw, 45vw"
            />
            <div className={styles.heroProfileCard} style={{ position: "relative", overflow: "hidden" }}>
              <BorderBeam size={160} duration={10} colorFrom="#0284c7" colorTo="#38bdf8" />
              <div className={styles.heroProfileCardHeader} style={{ position: "relative", zIndex: 2 }}>
                <Image
                  src="/academic/junaid-akram-professor.jpg"
                  alt="Dr. Junaid Akram"
                  width={32}
                  height={32}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--academic-cyan, #06b6d4)",
                    flexShrink: 0,
                  }}
                />
                <div className={styles.heroProfileStatusDot} />
                <span className={styles.heroProfileCardTitle}>Dr. Junaid Akram</span>
              </div>
              <div className={styles.heroProfileButtons} style={{ position: "relative", zIndex: 2 }}>
                <a
                  href={academicProfileData.googleScholar}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.heroProfileBtn}
                  title="View Google Scholar Profile & Citations"
                >
                  <GraduationCap size={14} className={styles.heroProfileBtnIcon} />
                  <span>Google Scholar</span>
                  <ExternalLink size={11} className={styles.heroProfileBtnExternal} />
                </a>

                <a
                  href={academicProfileData.officialProfile}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.heroProfileBtn}
                  title="View Faculty Profile"
                >
                  <BookOpen size={14} className={styles.heroProfileBtnIcon} />
                  <span>Faculty Profile</span>
                  <ExternalLink size={11} className={styles.heroProfileBtnExternal} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verified Research Impact Statistics Bar with Spring Physics NumberTicker */}
      <section className={styles.impactStrip} aria-label="Research Impact Statistics">
        <div className={styles.impactContainer}>
          <div className={styles.impactGrid}>
            {labImpactStatsData.map((stat, idx) => (
              <div key={stat.label} className={styles.impactItem}>
                {stat.image && (
                  <img
                    src={stat.image}
                    alt={stat.label}
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain', marginBottom: '8px' }}
                  />
                )}
                <strong>
                  <NumberTicker value={stat.value} delay={idx * 0.1} />
                </strong>
                <span>{stat.label}</span>
                <small>{stat.detail || stat.note}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Live Security Engineering Demo with Lottie Integration */}
      <section className={styles.section} id="live-demo">
        <div className={styles.sectionHeading} style={{ alignItems: "center" }}>
          <div>
            <p className={styles.eyebrow}>Interactive Vulnerability Inspection</p>
            <h2>Code Vulnerability & Remediation Analysis</h2>
            <p style={{ color: "var(--academic-muted, #64748b)", fontSize: "0.92rem", marginTop: "6px", maxWidth: "680px" }}>
              Explore real-world CVE vulnerability patterns and their verified secure remediations across multiple programming languages.
            </p>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <InteractiveCodeScanner />
        </div>
      </section>

      {/* 3. Main Research Domains with SpotlightBentoCard & Pop Corner Hover Effect */}
      <section className={styles.section} id="domains">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Research domains</p>
            <h2>Focused on practical software-security problems</h2>
          </div>
          <Link href="/research" className={styles.textLink}>
            View all research <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.domainGrid}>
          {researchDomainsData.map((domain, index) => (
            <SpotlightBentoCard
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
              ariaLabel={`Open detailed panel for ${domain.title}`}
            >
              <div className={styles.domainItemHeader} style={{ position: "relative", zIndex: 2 }}>
                <span>{domain.number || String(index + 1).padStart(2, "0")}</span>
                <span className={styles.domainClickBadge}>
                  Explore Roadmap <ArrowRight size={13} />
                </span>
              </div>
              <div className={styles.cornerCardIllustrationBottomLeft} style={{ position: "relative", zIndex: 2 }}>
                <img
                  src={domainIllustrationMap[domain.id || domain.slug] || domain.image || "/academic/illustrations/cyber-security.webp"}
                  alt={`${domain.title} 3D Illustration`}
                  style={{
                    maxHeight: "110px",
                    width: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 6px 14px rgba(0, 0, 0, 0.15))",
                  }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ position: "relative", zIndex: 2 }}>{domain.title}</h3>
              <p style={{ position: "relative", zIndex: 2 }}>{domain.description}</p>
            </SpotlightBentoCard>
          ))}
        </div>
      </section>

      {/* Interactive Workflow Preview */}
      <section className={styles.pipelineSection} aria-label="SSA Research Pipeline Preview">
        <div className={styles.pipelineContainer}>
          <div className={styles.pipelineHeader}>
            <span className={styles.eyebrow}>Research Methodology</span>
            <h2>How Our Research Works</h2>
            <p>
              How our lab transforms source code repositories, patch data, and test suites into verified security benchmarks, published research, and student production systems.
            </p>
          </div>
          <div className={styles.pipelineVisualizer}>
            <AcademicPipelineHero />
          </div>
        </div>
      </section>

      {/* Selected Publications */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Publications & Research</p>
            <h2>Current Research Projects</h2>
          </div>
          <Link href="/publications" className={styles.textLink}>
            View all publications <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.compactList}>
          {publicationsData.slice(0, 4).map((publication) => (
            <article key={publication.title}>
              <div>
                <h3>{publication.title}</h3>
                <p>{publication.venue}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Supervision & Projects Preview */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Supervision Directory Preview</p>
            <h2>Featured Student Research & Capstone Projects</h2>
            <p style={{ maxWidth: "640px", color: "var(--academic-muted)", fontSize: "0.9rem", margin: "6px 0 0 0" }}>
              A curated preview of active software security, LLM vulnerability repair, and student engineering projects supervised under Dr. Junaid Akram at SSA Lab.
            </p>
          </div>
          <Link href="/supervision" className={styles.textLink}>
            Explore all {fypProjectsData.length} projects <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.studentGrid}>
          {topProjects.map((project) => (
            <article key={project.slug}>
              <span className={styles.sessionBadge}>{project.projectType || project.status}</span>
              <h3>
                <Link href={`/supervision/projects/${project.slug}`}>{project.title}</Link>
              </h3>
              <p>{(project.students || []).map((s) => s.name || s).join(", ")}</p>
              <small>{project.programme} · {project.session}</small>
            </article>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <div className={styles.btnOrbitWrap} style={{ margin: "0 auto" }}>
            <Link href="/supervision" className={styles.primaryButton}>
              View Complete Supervision Directory ({fypProjectsData.length} Projects) <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final Contact CTA */}
      <section className={styles.ctaBand} style={{ textAlign: "center", padding: "48px 24px" }}>
        <div>
          <p className={styles.eyebrow} style={{ fontSize: "1rem", letterSpacing: "0.14em", marginBottom: "12px", textTransform: "uppercase" }}>
            Collaborate with SSA Lab
          </p>
          <h2 style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)", fontWeight: 700, margin: "0 auto", maxWidth: "800px" }}>
            If you are interested in software security, software testing, or code analysis
          </h2>
          <p style={{ maxWidth: "680px", margin: "16px auto 28px", fontSize: "1.05rem", lineHeight: "1.65", color: "var(--academic-muted)" }}>
            We supervise BS, MS, PhD, and Postdoc researchers.
          </p>
          <div className={styles.btnOrbitWrap} style={{ margin: "0 auto" }}>
            <Link href="/contact" className={styles.primaryButton}>
              Contact Us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Academic & Industrial Partners Network Showcase */}
      <section className={styles.partners} aria-label="Academic and research affiliations">
        <p>Academic and Research Affiliations</p>
        <div className={styles.partnerGrid}>
          {partnerLogosData.map((partner) => {
            const isNottingham = partner.name?.toLowerCase().includes("nottingham") || partner.image?.toLowerCase().includes("nottingham");
            const partnerImg = isDark && partner.imageDark
              ? partner.imageDark
              : isDark && isNottingham
              ? "/academic/nottingham-university-logo-dark.svg"
              : !isDark && partner.imageLight
              ? partner.imageLight
              : partner.image || "/academic/comsats-university-islamabad-logo.png";
            return (
              <figure key={partner.name}>
                <a
                  href={partner.href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  title={partner.name}
                >
                  <Image
                    src={partnerImg}
                    alt={partner.name}
                    width={200}
                    height={60}
                    style={{ objectFit: "contain", maxHeight: "46px", width: "auto" }}
                  />
                </a>
              </figure>
            );
          })}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}
