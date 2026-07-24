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
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicLottie from "./AcademicLottie";
import AcademicResearchPipeline from "./AcademicResearchPipeline";
import AcademicFypListing from "./AcademicFypListing";
import PlexusCanvas from "../Backgrounds/PlexusCanvas";
import {
  academicProfile,
  alumniPlacements,
  collaborators,
  eventGallery,
  eventHighlights,
  fypOpportunities,
  learningResources,
  partnerLogos,
  publications,
  researchDomains,
  researchProjects,
  supervisedProjects,
} from "../../data/academicSite";
import styles from "./AcademicSite.module.css";

function PageIntro({ eyebrow, title, lead }) {
  return (
    <section className={styles.pageIntro}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
  );
}

export function AboutPage() {
  return (
    <AcademicSiteLayout
      title="About"
      path="/about"
      description="Profile, background, and research focus of Dr. Junaid Akram and the Source Code Security Assessment Lab."
    >
      <PageIntro
        eyebrow="About"
        title="Research leadership grounded in software security."
        lead="Dr. Junaid Akram is an Assistant Professor and HEC-approved PhD supervisor whose work connects source-code analysis, vulnerability research, software testing, and student development."
      />

      <section className={`${styles.section} ${styles.profileGrid}`}>
        <div className={styles.profileImage}>
          <AcademicImageLightbox
            src="/academic/junaid-akram-professor.jpg"
            alt="Dr. Junaid Akram"
            width={755}
            height={716}
            caption="Dr. Junaid Akram — Assistant Professor, COMSATS University Islamabad, Lahore Campus"
          />
        </div>
        <div className={styles.prose}>
          <h2>{academicProfile.name}</h2>
          <p>
            {academicProfile.role} at {academicProfile.institution}. He completed postdoctoral research at the Interdisciplinary Centre for Security, Reliability and Trust (SnT), University of Luxembourg, and earned his PhD from Tsinghua University.
          </p>
          <p>
            His research focuses on practical ways to identify, assess, and mitigate weaknesses in software systems. This includes static and dynamic code analysis, software vulnerability detection, code clone analysis, malware detection, automated testing, and test-data generation.
          </p>
          <h3>{academicProfile.lab}</h3>
          <p>
            The SCSA Lab develops methods and tools for improving the security and robustness of software at source-code level. Its work brings together academic research, industry collaboration, and the supervision of BS, MS, and PhD students.
          </p>

          {/* Profiles links bar */}
          <div className={styles.profileBadgeRow} style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "16px 0" }}>
            <a href={academicProfile.googleScholar} target="_blank" rel="noreferrer" className={styles.secondaryButton} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
              Google Scholar <ExternalLink size={13} />
            </a>
            <a href={academicProfile.orcid} target="_blank" rel="noreferrer" className={styles.secondaryButton} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
              ORCID <ExternalLink size={13} />
            </a>
            <a href={academicProfile.researchGate} target="_blank" rel="noreferrer" className={styles.secondaryButton} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
              ResearchGate <ExternalLink size={13} />
            </a>
            <a href={academicProfile.officialProfile} target="_blank" rel="noreferrer" className={styles.secondaryButton} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
              COMSATS Profile <ExternalLink size={13} />
            </a>
          </div>

          <div className={styles.actions}>
            <Link href="/research" className={styles.primaryButton}>
              Explore research <ArrowRight size={17} />
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.careerGrid}`}>
        <div>
          <p className={styles.eyebrow}>Experience</p>
          <h2>Academic and industrial research</h2>
          <div className={styles.timelineList}>
            {academicProfile.experience.map((item) => (
              <article key={`${item.role}-${item.organization}`}>
                <span>{item.period}</span>
                <h3>{item.role}</h3>
                <p>{item.organization}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className={styles.eyebrow}>Education</p>
          <h2>Research training</h2>
          <div className={styles.timelineList}>
            {academicProfile.education.map((item) => (
              <article key={item.qualification}>
                <span>{item.period}</span>
                <h3>{item.qualification}</h3>
                <p>{item.institution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Affiliations</p>
            <h2>Research connections</h2>
          </div>
        </div>
        <div className={styles.partnerGrid}>
          {partnerLogos.map((partner) => (
            <figure key={partner.name}>
              <a href={partner.href} target="_blank" rel="noreferrer">
                <Image src={partner.image} alt={partner.name} width={300} height={100} />
              </a>
              <figcaption>{partner.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function ResearchPage() {
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <AcademicSiteLayout
      title="Research"
      path="/research"
      description="Research areas, platforms, and software-security tools developed by Dr. Junaid Akram and the SCSA Lab."
    >
      <PageIntro
        eyebrow="Research"
        title="Software security research with practical reach."
        lead="The lab studies vulnerabilities, malware, code clones, software evolution, and testing at scales ranging from individual functions to billions of lines of code."
      />

      <section className={styles.section}>
        <div className={styles.domainGrid}>
          {researchDomains.map((domain, index) => (
            <article key={domain.title} className={styles.domainItem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
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
                  <AcademicImageLightbox
                    src={project.image}
                    alt={`${project.title} research visual`}
                    width={640}
                    height={420}
                    caption={project.title}
                    className={styles.projectDetailImage}
                  />
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

  return (
    <AcademicSiteLayout
      title="Publications"
      path="/publications"
      description="Peer-reviewed journal and conference publications by Dr. Junaid Akram in software security, testing, malware, and code analysis."
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
  return (
    <AcademicSiteLayout
      title="Supervision"
      path="/supervision"
      description="Supervised final-year student projects, FYP opportunities, and student research under Dr. Junaid Akram at COMSATS University Islamabad, Lahore Campus."
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
  return (
    <AcademicSiteLayout
      title="People & Partners"
      path="/team"
      description="Dr. Junaid Akram, academic collaborators, and research partners connected with the SCSA Lab."
    >
      <PageIntro
        eyebrow="People & partners"
        title="Research built through academic collaboration."
        lead="The SCSA Lab connects faculty, collaborators, students, and institutional partners across software security and software engineering."
      />

      <section className={`${styles.section} ${styles.profileGrid}`}>
        <div className={styles.profileImage}>
          <AcademicImageLightbox
            src="/academic/junaid-akram-professor.jpg"
            alt="Dr. Junaid Akram"
            width={755}
            height={716}
            caption="Dr. Junaid Akram — SCSA Research Lab lead"
          />
        </div>
        <div className={styles.prose}>
          <p className={styles.eyebrow}>Lab lead</p>
          <h2>{academicProfile.name}</h2>
          <p>{academicProfile.role}</p>
          <p>{academicProfile.institution}</p>
          <ul className={styles.plainList}>
            {academicProfile.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className={styles.textLink} href={`mailto:${academicProfile.emails[0]}`}>
            <Mail size={16} /> {academicProfile.emails[0]}
          </a>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Academic collaborators</p>
            <h2>Co-authors & Research Partners</h2>
          </div>
        </div>
        <div className={styles.peopleGrid}>
          {collaborators.map((person) => (
            <article key={person.name}>
              <AcademicImageLightbox
                src={person.image}
                alt={person.name}
                width={260}
                height={260}
                caption={person.name}
                className={styles.personImage}
              />
              <div>
                <h3>{person.name}</h3>
                <p>{person.details}</p>
                <a href={`mailto:${person.email}`}>{person.email}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.partners}>
        <p>Research affiliations and partner institutions</p>
        <div>
          {partnerLogos.map((partner) => (
            <figure key={partner.name}>
              <a href={partner.href} target="_blank" rel="noreferrer">
                <Image src={partner.image} alt={partner.name} width={240} height={80} />
              </a>
            </figure>
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function EventsPage() {
  return (
    <AcademicSiteLayout
      title="Events"
      path="/events"
      description="Selected conference, workshop, and research partnership events attended by Dr. Junaid Akram."
    >
      <PageIntro
        eyebrow="Events"
        title="Research presented and shared internationally."
        lead="Selected international workshops, conferences, and academic partnership events led or attended by Dr Junaid Akram."
      />

      <section className={styles.section}>
        <div className={styles.eventList}>
          {eventHighlights.map((event, index) => (
            <article key={event}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{event}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Event gallery</p>
            <h2>Workshops, conferences, and partnerships</h2>
          </div>
        </div>
        <div className={styles.eventGallery}>
          {eventGallery.map((image, index) => (
            <figure key={image.src} className={index < 2 ? styles.eventFeature : undefined}>
              <AcademicImageLightbox
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                caption={image.caption}
                className={styles.eventImageButton}
                sizes="(max-width: 780px) 100vw, 33vw"
              />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function ResourcesPage() {
  return (
    <AcademicSiteLayout
      title="Learning Resources"
      path="/resources"
      description="Learning diagrams and visual references covering machine learning, generative AI infrastructure, networking, and modern AI concepts."
    >
      <PageIntro
        eyebrow="Learning resources"
        title="Visual references for advanced learning."
        lead="Explore visual learning resources covering machine learning, generative AI infrastructure, networking, retrieval-augmented generation, and agentic systems."
      />

      <section className={styles.section}>
        <div className={styles.resourceGrid}>
          {learningResources.map((resource) => (
            <article key={resource.title}>
              <AcademicImageLightbox
                src={resource.image}
                alt={resource.title}
                width={resource.width}
                height={resource.height}
                caption={resource.title}
                className={styles.resourceImage}
                sizes="(max-width: 780px) 100vw, 50vw"
              />
              <div>
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={resource.image}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryButton}
                    style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                  >
                    Open High-Res Diagram <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </article>
          ))}
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

  return (
    <AcademicSiteLayout
      title="Contact"
      path="/contact"
      description="Contact Dr. Junaid Akram and the Source Code Security Assessment Lab at COMSATS University Islamabad, Lahore Campus."
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
