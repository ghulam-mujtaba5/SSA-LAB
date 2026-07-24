import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Microscope,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Award,
  ExternalLink,
  Code2,
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicPipelineHero from "./AcademicPipelineHero";
import {
  academicProfile,
  partnerLogos,
  publications,
  researchDomains,
  researchProjects,
  supervisedProjects,
} from "../../data/academicSite";
import styles from "./AcademicSite.module.css";

const impactStats = [
  { value: "152,823+", label: "Repositories Analyzed", detail: "Open-source C/C++ & Java projects" },
  { value: "324B+", label: "Lines of Code Indexed", detail: "Code clone & vulnerability detection" },
  { value: "25+", label: "Journal Publications", detail: "Q1 Applied Soft Computing, IEEE & IJICS" },
  { value: "40+", label: "Supervised Researchers", detail: "BS, MS & PhD students & FYP alumni" },
];

export default function AcademicHome() {
  return (
    <AcademicSiteLayout
      description="Academic profile of Dr. Junaid Akram, Assistant Professor at COMSATS University Islamabad, Lahore Campus, and lead of the Source Code Security Assessment Lab."
    >
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Software security research & supervision</p>
            <h1>
              Building safer software through research, testing, and code analysis.
            </h1>
            <p className={styles.heroLead}>
              {academicProfile.name} is an Assistant Professor at COMSATS University Islamabad, Lahore Campus, and leads research in source code security assessment, vulnerability detection, software testing, and malware analysis.
            </p>
            <ul className={styles.credentialList}>
              {academicProfile.credentials.map((credential) => (
                <li key={credential}>
                  <ShieldCheck size={18} /> {credential}
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Link href="/research" className={styles.primaryButton}>
                Explore Research <ArrowRight size={17} />
              </Link>
              <Link href="/alumni" className={styles.secondaryButton}>
                Supervision & FYP Alumni
              </Link>
            </div>
          </div>
          <div className={styles.heroPortrait}>
            <AcademicImageLightbox
              src="/academic/junaid-akram-professor.jpg"
              alt="Dr. Junaid Akram at a research event"
              width={755}
              height={716}
              priority
              caption="Dr. Junaid Akram — Lead of SCSA Lab at COMSATS University Islamabad, Lahore Campus"
              className={styles.heroPortraitImage}
              sizes="(max-width: 780px) 100vw, 42vw"
            />
            <div className={styles.portraitCaption}>
              <strong>{academicProfile.name}</strong>
              <span>{academicProfile.role}</span>
              <span>{academicProfile.institution}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Animated Research & Security Pipeline Section */}
      <section className={styles.pipelineSection} aria-label="SCSA Research Pipeline">
        <div className={styles.pipelineContainer}>
          <div className={styles.pipelineHeader}>
            <span className={styles.eyebrow}>Interactive Research Workflow</span>
            <h2>SCSA Security Analysis & Outcome Pipeline</h2>
            <p>
              How our lab transforms source code repositories, patch data, and test suites into verified security benchmarks, published research, and student production systems.
            </p>
          </div>
          <div className={styles.pipelineVisualizer}>
            <AcademicPipelineHero />
          </div>
        </div>
      </section>

      {/* Live Impact Statistics Bar (Simula Style) */}
      <section className={styles.impactStrip} aria-label="Research Impact Statistics">
        <div className={styles.impactGrid}>
          {impactStats.map((stat) => (
            <div key={stat.label} className={styles.impactItem}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Core Focus Strip */}
      <section className={styles.introStrip} aria-label="Academic focus">
        <div>
          <Microscope size={23} />
          <span>Research</span>
          <strong>Source code security</strong>
        </div>
        <div>
          <BookOpen size={23} />
          <span>Education</span>
          <strong>BS, MS & PhD supervision</strong>
        </div>
        <div>
          <GraduationCap size={23} />
          <span>Impact</span>
          <strong>Student projects & alumni</strong>
        </div>
      </section>

      {/* Core Research Domains */}
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
          {researchDomains.map((domain, index) => (
            <article key={domain.title} className={styles.domainItem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{domain.title}</h3>
              <p>{domain.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Research Projects & Security Tools */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Selected work & software</p>
            <h2>Research platforms and security tools</h2>
          </div>
        </div>
        <div className={styles.featuredProject}>
          <div className={styles.projectImage}>
            <AcademicImageLightbox
              src="/academic/vulnerability-detection-dashboard.png"
              alt="Vulnerability detection platform interface"
              width={838}
              height={744}
              caption="Source-code vulnerability detection platform from the SCSA research portfolio"
              className={styles.projectLightbox}
            />
          </div>
          <div className={styles.projectCopy}>
            <span>{researchProjects[4].status}</span>
            <h3>{researchProjects[4].title}</h3>
            <p>{researchProjects[4].summary}</p>
            <small>{researchProjects[4].collaboration}</small>
            <Link href="/research" className={styles.textLink}>
              Read about projects & tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Supervised FYP & Alumni Work */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Student work</p>
            <h2>Supervision, FYPs, and alumni projects</h2>
          </div>
          <Link href="/alumni" className={styles.textLink}>
            Explore supervision <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.studentGrid}>
          {supervisedProjects.slice(0, 4).map((project) => (
            <article key={`${project.student}-${project.title}`}>
              <span>{project.term}</span>
              <h3>{project.title}</h3>
              <p>{project.student}</p>
              <small>{project.institution}</small>
            </article>
          ))}
        </div>
      </section>

      {/* Publications & Opportunity Callout */}
      <section className={`${styles.section} ${styles.splitSection}`}>
        <div>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Publications</p>
              <h2>Selected research output</h2>
            </div>
          </div>
          <div className={styles.compactList}>
            {publications.slice(0, 4).map((publication) => (
              <article key={publication.title}>
                <span>{publication.year}</span>
                <div>
                  <h3>{publication.title}</h3>
                  <p>{publication.venue}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/publications" className={styles.textLink}>
            View all publications <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.opportunityPanel}>
          <p className={styles.eyebrow}>Join the lab</p>
          <h2>Interested in research or an FYP?</h2>
          <p>
            The SCSA Lab welcomes motivated BS, MS, and PhD students interested in cyber security, software testing, vulnerability analysis, malware detection, and code analysis.
          </p>
          <Link href="/contact" className={styles.primaryButton}>
            Discuss an opportunity <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Partner Affiliations */}
      <section className={styles.partners}>
        <p>Academic and research affiliations</p>
        <div>
          {partnerLogos.map((partner) => (
            <figure key={partner.name}>
              <a href={partner.href} target="_blank" rel="noreferrer">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={240}
                  height={80}
                />
              </a>
            </figure>
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}
