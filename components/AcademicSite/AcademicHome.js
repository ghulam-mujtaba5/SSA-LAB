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
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicPipelineHero from "./AcademicPipelineHero";
import AcademicDomainModal from "./AcademicDomainModal";
import {
  academicProfile,
  partnerLogos,
  publications,
  researchDomains,
  supervisedProjects,
} from "../../data/academicSite";
import styles from "./AcademicSite.module.css";

const impactStats = [
  { value: "324B+", label: "Lines of Code Indexed", detail: "Hadoop IBFET code-clone analysis study" },
  { value: "152,823+", label: "Repositories Analyzed", detail: "SQVDT open-source vulnerability platform" },
  { value: "30,500+", label: "Android Apps Analyzed", detail: "DroidSD similarity detection evaluation" },
];

export default function AcademicHome() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <AcademicSiteLayout
      description="Advancing software security through source-code analysis, testing, and vulnerability research. Led by Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus."
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
              Led by Dr Junaid Akram at COMSATS University Islamabad, Lahore Campus, the SCSA Lab develops practical methods and tools for vulnerability detection, malware analysis, code-clone analysis, and automated software testing.
            </p>
            <ul className={styles.credentialList}>
              {academicProfile.credentials.map((credential) => (
                <li key={credential}>
                  <ShieldCheck size={18} /> {credential}
                </li>
              ))}
            </ul>

            {/* Profile quick buttons */}
            <div className={styles.profileBadgeRow} style={{ margin: "16px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href={academicProfile.googleScholar}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryButton}
                style={{ padding: "6px 14px", fontSize: "0.85rem" }}
              >
                Google Scholar <ExternalLink size={13} />
              </a>
              <a
                href={academicProfile.officialProfile}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryButton}
                style={{ padding: "6px 14px", fontSize: "0.85rem" }}
              >
                COMSATS Profile <ExternalLink size={13} />
              </a>
            </div>

            <div className={styles.actions}>
              <Link href="/research" className={styles.primaryButton}>
                Explore Research <ArrowRight size={17} />
              </Link>
              <Link href="/supervision" className={styles.secondaryButton}>
                Supervision Directory
              </Link>
            </div>
          </div>

          <div className={styles.heroPortrait}>
            <AcademicImageLightbox
              src="/academic/junaid-akram-professor.jpg"
              alt="Dr. Junaid Akram"
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

      {/* 2. Verified Research Impact Statistics Bar */}
      <section className={styles.impactStrip} aria-label="Research Impact Statistics">
        <div className={styles.impactGrid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {impactStats.map((stat) => (
            <div key={stat.label} className={styles.impactItem}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Research Domains */}
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
                <span className={styles.domainClickBadge}>Explore Roadmap →</span>
              </div>
              <h3>{domain.title}</h3>
              <p>{domain.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Workflow Preview */}
      <section className={styles.pipelineSection} aria-label="SCSA Research Pipeline Preview">
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
      </section>

      {/* Supervision & Projects Preview */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Supervision</p>
            <h2>Research project supervision</h2>
          </div>
          <Link href="/supervision" className={styles.textLink}>
            Explore supervision directory <ArrowRight size={16} />
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

      {/* Final Contact CTA */}
      <section className={styles.ctaBand} style={{ textAlign: "center", padding: "48px 24px" }}>
        <div>
          <p className={styles.eyebrow}>Collaborate with SCSA Lab</p>
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
        <p>Academic and research affiliations</p>
        <div className={styles.partnerRowWrapper}>
          <div className={styles.partnerGrid}>
            {partnerLogos.map((partner) => (
              <figure key={partner.name}>
                <a href={partner.href} target="_blank" rel="noreferrer" title={partner.name}>
                  <div className={styles.partnerLogoWrap}>
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={180}
                      height={50}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </a>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </AcademicSiteLayout>
  );
}
