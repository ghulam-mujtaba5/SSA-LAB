import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import AcademicSiteLayout from "./AcademicSiteLayout";
import AcademicImageLightbox from "./AcademicImageLightbox";
import AcademicLottie from "./AcademicLottie";
import AcademicResearchPipeline from "./AcademicResearchPipeline";
import AcademicFypCaseStudy from "./AcademicFypCaseStudy";
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
            {academicProfile.role} at {academicProfile.institution}. He
            completed postdoctoral research at the Interdisciplinary Centre for
            Security, Reliability and Trust (SnT), University of Luxembourg,
            and earned his PhD from Tsinghua University.
          </p>
          <p>
            His research focuses on practical ways to identify, assess, and
            mitigate weaknesses in software systems. This includes static and
            dynamic code analysis, software vulnerability detection, code clone
            analysis, malware detection, automated testing, and test-data
            generation.
          </p>
          <h3>{academicProfile.lab}</h3>
          <p>
            The SCSA Lab develops methods and tools for improving the security
            and robustness of software at source-code level. Its work brings
            together academic research, industry collaboration, and the
            supervision of BS, MS, and PhD students.
          </p>
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
  return (
    <AcademicSiteLayout
      title="Research"
      path="/research"
      description="Research areas, projects, and software-security tools developed by Dr. Junaid Akram and the SCSA Lab."
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
      <section className={`${styles.section} ${styles.pipelineSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Research workflow</p>
            <h2>From source evidence to validated outcomes</h2>
          </div>
        </div>
        <AcademicResearchPipeline />
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Projects & tools</p>
            <h2>Current and completed work</h2>
          </div>
        </div>
        <div className={styles.projectList}>
          {researchProjects.map((project) => (
            <article key={project.title}>
              <div>
                <span>{project.status}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <small>{project.collaboration}</small>
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
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function PublicationsPage() {
  return (
    <AcademicSiteLayout
      title="Publications"
      path="/publications"
      description="Selected journal and conference publications by Dr. Junaid Akram in software security, testing, malware, and code analysis."
    >
      <PageIntro
        eyebrow="Publications"
        title="Selected journal and conference papers."
        lead="Research spanning source-code vulnerability detection, Android malware and clone analysis, software testing, and scalable code assessment."
      />
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Current COMSATS opportunities</p>
            <h2>FYP ideas listed for student supervision</h2>
          </div>
          <a
            href={academicProfile.officialFypIdeas}
            target="_blank"
            rel="noreferrer"
            className={styles.textLink}
          >
            Official FYP listing <ExternalLink size={15} />
          </a>
        </div>
        <div className={styles.fypGrid}>
          {fypOpportunities.map((project) => (
            <article key={project.title}>
              <div className={styles.fypMeta}>
                <span>{project.type}</span>
                <strong>{project.availability}</strong>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <small>{project.prerequisites}</small>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.publicationList}>
          {publications.map((publication) => (
            <article key={publication.title}>
              <span>{publication.year}</span>
              <div>
                <h2>{publication.title}</h2>
                <p>{publication.authors}</p>
                <small>{publication.venue}</small>
              </div>
              {publication.href && (
                <a
                  href={publication.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${publication.title}`}
                >
                  DOI <ExternalLink size={15} />
                </a>
              )}
            </article>
          ))}
        </div>
        <a
          className={styles.sourceNote}
          href="https://docs.google.com/presentation/d/1arPiJH7qh6eBlYHkRl61SeIet7LnoqsEMP5tj547U0g/present"
          target="_blank"
          rel="noreferrer"
        >
          View the ICST conference presentation <ExternalLink size={15} />
        </a>
        <a
          className={styles.sourceNote}
          href="https://sites.google.com/view/temporaryr/publications"
          target="_blank"
          rel="noreferrer"
        >
          View the complete source publication list <ExternalLink size={15} />
        </a>
      </section>
    </AcademicSiteLayout>
  );
}

export function AlumniPage({ fypProjects = [] }) {
  return (
    <AcademicSiteLayout
      title="FYP Supervision"
      path="/alumni"
      description="Supervised final-year capstone projects, student research, and FYP opportunities under Dr. Junaid Akram."
    >
      <PageIntro
        eyebrow="FYP Supervision"
        title="Supervised final-year projects and student research."
        lead="Verified current COMSATS FYP opportunities alongside completed final-year capstone projects supervised under Dr. Junaid Akram's SCSA Laboratory."
      />
      <AcademicFypListing projects={fypProjects} />
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Current COMSATS opportunities</p>
            <h2>Final-year project ideas</h2>
          </div>
          <a
            className={styles.textLink}
            href={academicProfile.officialFypIdeas}
            target="_blank"
            rel="noreferrer"
          >
            View official FYP listing <ExternalLink size={15} />
          </a>
        </div>
        <div className={styles.fypGrid}>
          {fypOpportunities.map((project) => (
            <article key={project.title}>
              <div className={styles.fypMeta}>
                <span>{project.type}</span>
                <strong>{project.availability}</strong>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <small>Prerequisites: {project.prerequisites}</small>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Student projects</p>
            <h2>Selected supervised titles</h2>
          </div>
        </div>
        <div className={styles.studentGrid}>
          {supervisedProjects.map((project) => (
            <article key={`${project.student}-${project.title}`}>
              <span>{project.term}</span>
              <h3>{project.title}</h3>
              <p>{project.student}</p>
              <small>{project.institution}</small>
            </article>
          ))}
        </div>
      </section>
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Internship outcomes</p>
            <h2>Supervised student placements</h2>
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
      <section className={styles.ctaBand}>
        <div>
          <p className={styles.eyebrow}>Prospective students</p>
          <h2>Looking for FYP, MS, or PhD supervision?</h2>
        </div>
        <Link href="/contact" className={styles.primaryButton}>
          Contact Dr. Junaid <ArrowRight size={17} />
        </Link>
      </section>
    </AcademicSiteLayout>
  );
}

export function TeamPage() {
  return (
    <AcademicSiteLayout
      title="Team"
      path="/team"
      description="Dr. Junaid Akram, research collaborators, students, and partner institutions connected with the SCSA Lab."
    >
      <PageIntro
        eyebrow="People & partners"
        title="Research built through collaboration."
        lead="The SCSA Lab connects faculty, collaborators, students, and industry partners across software security and software-engineering research."
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
            <p className={styles.eyebrow}>Main collaborators</p>
            <h2>Academic collaboration</h2>
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
        <p>Research affiliations and partners</p>
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
        lead="Selected workshops, conferences, and partnership events recorded on the existing SCSA website."
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
            <p className={styles.eyebrow}>Original event archive</p>
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
        lead="The original SCSA learning diagrams are preserved here in a clearer, mobile-friendly gallery. Open any diagram to inspect it at full size."
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </AcademicSiteLayout>
  );
}

export function ContactPage() {
  return (
    <AcademicSiteLayout
      title="Contact"
      path="/contact"
      description="Contact Dr. Junaid Akram and the Source Code Security Assessment Lab at COMSATS University Islamabad, Lahore Campus."
    >
      <PageIntro
        eyebrow="Contact"
        title="Discuss research, supervision, or collaboration."
        lead="For research collaboration, student supervision, and SCSA Lab enquiries, use the verified institutional contact details below."
      />
      <section className={`${styles.section} ${styles.contactStage}`}>
        <div className={styles.contactPlexus} aria-hidden="true">
          <PlexusCanvas
            maxNodes={54}
            maxDistance={105}
            speed={0.18}
            intensity={0.35}
          />
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
              Include your research topic, degree programme, or collaboration
              objective so the enquiry can be assessed efficiently.
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
            <span>Office</span>
            <strong>{academicProfile.office}</strong>
            <p>{academicProfile.institution}</p>
            <p className={styles.officePhone}>
              <Phone size={15} /> {academicProfile.officePhone}
            </p>
          </div>
          <div className={styles.contactCard}>
            <ExternalLink size={24} />
            <span>Academic profiles</span>
            <a href={academicProfile.officialProfile} target="_blank" rel="noreferrer">
              COMSATS profile
            </a>
            <a href={academicProfile.researchGate} target="_blank" rel="noreferrer">
              ResearchGate
            </a>
            <a href={academicProfile.orcid} target="_blank" rel="noreferrer">
              ORCID
            </a>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.campusSection}`}>
        <div className={styles.campusCopy}>
          <p className={styles.eyebrow}>Visit the campus</p>
          <h2>COMSATS University Islamabad, Lahore Campus</h2>
          <p>
            1.5 KM Defence Road, Off Raiwind Road, Lahore, Pakistan.
            The map identifies the campus; meetings should be arranged in advance.
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
          If you contact Dr. Junaid Akram or the SCSA Lab by email, the
          information you send is used only to respond to your enquiry,
          research proposal, collaboration request, or supervision question.
        </p>
        <h3>Analytics and essential operation</h3>
        <p>
          The site may use privacy-conscious traffic analytics and essential
          browser storage for preferences such as the selected visual theme.
          No visitor profile is sold or used for unrelated advertising.
        </p>
        <h3>External links</h3>
        <p>
          Links to LinkedIn, ResearchGate, ORCID, publishers, and partner
          institutions are governed by those services&apos; own privacy
          policies.
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
