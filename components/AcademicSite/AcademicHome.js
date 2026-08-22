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
import AcademicLottie from "./AcademicLottie";
import {
  academicProfile,
  partnerLogos,
  publications,
  researchDomains,
  supervisedProjects,
} from "../../data/academicSite";
import { defaultFypProjects } from "../../data/fypProjects";
import { useAcademicData } from "../../context/AcademicDataContext";
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
  const { siteData } = useAcademicData();
  const academicProfileData = siteData.academicProfile || academicProfile;
  const researchDomainsData = siteData.researchDomains || researchDomains;
  const publicationsData = siteData.publications || publications;
  const partnerLogosData = siteData.partnerLogos || partnerLogos;
  const supervisedProjectsData = siteData.supervisedProjects || supervisedProjects;
  const fypProjectsData = siteData.fypProjects || defaultFypProjects;
  const labImpactStatsData = (siteData.labImpactStats?.length ? siteData.labImpactStats : impactStats).slice(0, 4);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Filter top Tier A research projects for the homepage showcase
  const topProjects = fypProjectsData
    .filter((p) => !p.isOpportunity && p.slug !== "megilance-ai-blockchain-freelancing-platform")
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
          "The SSA Lab is a dedicated academic research laboratory led by Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus. The lab specializes in source-code vulnerability detection, LLM automated program repair, semantic code clone analysis, malware defense, and software verification.",
      },
      {
        question: "Who directs the SSA Research Lab?",
        answer:
          "The lab is directed by Dr. Junaid Akram, Assistant Professor and HEC-approved PhD supervisor, who earned his PhD in Software Engineering from Tsinghua University and completed postdoctoral research at SnT, University of Luxembourg.",
      },
      {
        question: "What major tools and benchmarks has the SSA Lab created?",
        answer:
          "The lab has developed SQVDT (repository-scale vulnerability detection), VCIPR (patch-guided function-level detection), DroidSD (indexed Android app similarity detection), DroidMD (source-level Android malware detection), and IBFET (Hadoop-based 324B+ LOC clone analysis).",
      },
      {
        question: "How to collaborate or apply for student supervision?",
        answer:
          "Prospective research collaborators and students at COMSATS University Islamabad can contact Dr. Junaid Akram via email at junaidakram@cuilahore.edu.pk or through the Contact page.",
      },
    ]),
  ];

  return (
    <AcademicSiteLayout
      title="Software Security & Source Code Analysis Research"
      path="/"
      description="Software Security Assessment Lab led by Dr. Junaid Akram at COMSATS University Islamabad, Lahore. Specializing in LLM vulnerability detection, code clone analysis, and malware detection."
      keywords="Software Security Assessment Lab, Dr. Junaid Akram, software vulnerability detection, LLM vulnerability detection, semantic code clone detection, COMSATS University Lahore, malware analysis, automated software testing"
      jsonLd={homeJsonLd}
      citations={publicationsData.slice(0, 5)}
    >
      {selectedDomain && (
        <AcademicDomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
        />
      )}
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Software security research & supervision</p>
            <h1>
              Advancing software security through source-code analysis, testing, and vulnerability research.
            </h1>
            <p className={styles.heroLead}>
              Led by Dr Junaid Akram at COMSATS University Islamabad, Lahore Campus, the SSA Lab develops practical methods and tools for vulnerability detection, malware analysis, code-clone analysis, and automated software testing.
            </p>
            <ul className={styles.credentialList}>
              {(academicProfileData.credentials || []).map((credential) => (
                <li key={credential}>
                  <ShieldCheck size={18} /> {credential}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Link href="/research" className={styles.primaryButton}>
                Explore Research <ArrowRight size={17} />
              </Link>
              <Link href="/supervision" className={styles.secondaryButton}>
                Supervision Directory
              </Link>
            </div>
          </div>

          <div className={styles.heroIllustrationContainer}>
            <div className={styles.heroIllustrationGlow} />
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
            <div className={styles.heroProfileCard}>
              <div className={styles.heroProfileCardHeader}>
                <div className={styles.heroProfileStatusDot} />
                <span className={styles.heroProfileCardTitle}>PROFILES</span>
              </div>
              <div className={styles.heroProfileButtons}>
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
                  title="View COMSATS Official Faculty Profile"
                >
                  <BookOpen size={14} className={styles.heroProfileBtnIcon} />
                  <span>COMSATS</span>
                  <ExternalLink size={11} className={styles.heroProfileBtnExternal} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verified Research Impact Statistics Bar */}
      <section className={styles.impactStrip} aria-label="Research Impact Statistics">
        <div className={styles.impactContainer}>
          <div className={styles.impactGrid}>
            {labImpactStatsData.map((stat) => (
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
                <strong>{stat.value}</strong>
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
          <div className={styles.lottieCard} style={{ maxWidth: "280px", width: "100%", height: "180px", minHeight: "150px", flexShrink: 0, padding: "8px", overflow: "hidden" }}>
            <AcademicLottie src="/lottie/web-coding.json" ariaLabel="Live Vulnerability Inspection Animation" speed={0.85} />
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <InteractiveCodeScanner />
        </div>
      </section>

      {/* 3. Main Research Domains with AI PNG Images & Bottom-Left Pop Corner Hover Effect */}
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
              <div className={styles.cornerCardIllustrationBottomLeft}>
                <span className={styles.cornerBadgeDotBottomLeft} />
                <img
                  src={domainIllustrationMap[domain.id] || "/academic/illustrations/homepage-hero.webp"}
                  alt={`${domain.title} 3D Illustration`}
                  style={{ maxHeight: "110px", width: "auto", objectFit: "contain" }}
                  loading="lazy"
                />
              </div>
              <h3>{domain.title}</h3>
              <p>{domain.description}</p>
            </article>
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
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/research" className={styles.textLink}>
              View complete research architecture <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Selected Publications */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Publications</p>
            <h2>Selected research output</h2>
          </div>
          <Link href="/publications" className={styles.textLink}>
            View all publications <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.compactList}>
          {publicationsData.slice(0, 4).map((publication) => (
            <article key={publication.title}>
              <span>{publication.year}</span>
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
            <p className={styles.eyebrow}>Supervision</p>
            <h2>Research Project Supervision</h2>
          </div>
          <Link href="/supervision" className={styles.textLink}>
            Explore supervision directory <ArrowRight size={16} />
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
      </section>

      {/* Final Contact CTA */}
      <section className={styles.ctaBand} style={{ textAlign: "center", padding: "48px 24px" }}>
        <div>
          <p className={styles.eyebrow}>Collaborate with SSA Lab</p>
          <h2>Interested in software security research or student supervision?</h2>
          <p style={{ maxWidth: "640px", margin: "12px auto 24px" }}>
            Dr Junaid Akram supervises BS, MS, and PhD students in software vulnerability detection, automated testing, malware analysis, and code clone research.
          </p>
          <Link href="/contact" className={styles.primaryButton}>
            Contact the lab <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Academic Partners (Above Footer) */}
      <section className={styles.partners}>
        <p className={styles.eyebrow} style={{ textAlign: "center", marginBottom: "6px" }}>
          Institutional Network
        </p>
        <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "1.45rem", fontWeight: 700 }}>
          Academic & Industrial Partners
        </h2>
        <div className={styles.partnerRowWrapper}>
          <div className={styles.partnerCardGrid}>
            {partnerLogosData.map((partner) => {
              const staticPartnerMap = {
                "COMSATS University Islamabad": "/academic/comsats-university-islamabad-logo.png",
                "Tsinghua University": "/academic/tsinghua-university-logo.webp",
                "University of Luxembourg (SnT)": "/academic/snt-university-luxembourg-logo.png",
                "SES Satellites": "/academic/ses-logo.png",
                "King Fahd University (KFUPM)": "/academic/king-fahd-university-logo.png",
              };
              const partnerImg = partner.image || staticPartnerMap[partner.name];
              return (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.partnerCardBox}
                  title={partner.name}
                >
                  <div className={styles.partnerLogoWrap}>
                    <Image
                      src={partnerImg}
                      alt={partner.name}
                      width={180}
                      height={50}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3>{partner.name}</h3>
                  <span className={styles.partnerRole}>{partner.role}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </AcademicSiteLayout>
  );
}
