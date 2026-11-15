import React from "react";
import Head from "next/head";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ssa-lab.tech";
const SITE_NAME = "SSA Research Lab";
const PERSON_NAME = "Junaid Akram";
const PERSON_NAME_FULL = "Junaid Akram, PhD";
const TWITTER_HANDLE = "@JunaidAkramPhD";
const TWITTER_SITE = "@SSALab";
const OG_IMAGE = `${SITE_URL}/academic/junaid-akram-professor.jpg`;
const AFFILIATION = "University of Nottingham Ningbo China";

export default function SEO({
  title = `SSA Research Lab | Software Security Research`,
  description = "Academic profile of Dr. Junaid Akram and the Software Security Assessment Lab at University of Nottingham Ningbo China.",
  url = SITE_URL,
  image = OG_IMAGE,
  imageWidth = 755,
  imageHeight = 716,
  imageAlt = "Dr. Junaid Akram — SSA Research Lab",
  type = "website",
  canonical = url,
  keywords,
  author = PERSON_NAME_FULL,
  locale = "en_US",
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  noindex = false,
  publishedTime,
  modifiedTime,
  jsonLd,
  // Academic citation fields
  citations = [],
  citationTitle,
  citationAuthor = PERSON_NAME,
  citationAuthors = [],
  citationYear,
  citationJournal,
  citationDoi,
  citationPdfUrl,
  // Dublin Core
  dcSubject = "Computer Science; Software Security; Vulnerability Detection; Malware Defense; Code Clones; Automated Testing",
  dcType = "Text",
  dcFormat = "text/html",
  dcLanguage = "en",
}) {
  const effectiveRobots = noindex ? "noindex, nofollow" : robots;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  // Build normalized list of citations for Google Scholar & Highwire Press
  const normalizedCitations = [...citations];
  if (citationTitle) {
    normalizedCitations.push({
      title: citationTitle,
      authors: citationAuthors.length ? citationAuthors : [citationAuthor],
      year: citationYear,
      venue: citationJournal,
      doi: citationDoi,
      pdfUrl: citationPdfUrl,
    });
  }

  return (
    <Head>
      {/* ── Primary ──────────────────────────────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={effectiveRobots} />
      <meta name="googlebot" content={effectiveRobots} />
      <meta name="bingbot" content={effectiveRobots} />
      <meta name="rating" content="general" />
      <meta name="category" content="Education, Research, Technology, Software Security" />
      <meta name="classification" content="Academic Research" />
      <meta name="coverage" content="Worldwide" />
      <meta name="language" content="English" />
      <meta name="target" content="all" />

      {/* ── Open Graph ────────────────────────────────────────────── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="en_GB" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* ── Twitter / X Card ──────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* ── Canonical & Alternates ────────────────────────────────── */}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="en-us" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* ── LLM / AI Discoverability ─────────────────────────────── */}
      <link rel="llms" href={`${SITE_URL}/llms.txt`} />
      <link rel="llms-full" href={`${SITE_URL}/llms-full.txt`} />
      <link rel="alternate" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="LLM Context (Summary)" />
      <link rel="alternate" type="text/markdown" href={`${SITE_URL}/llms-full.txt`} title="LLM Context (Full)" />
      <link rel="author" href={`${SITE_URL}/about`} />

      {/* ── Identity Verification (rel=me) ───────────────────────── */}
      <link rel="me" href="https://orcid.org/0000-0003-1752-6124" />
      <link rel="me" href="https://scholar.google.com/citations?user=JunaidAkram" />
      <link rel="me" href="https://www.researchgate.net/profile/Junaid-Akram" />
      <link rel="me" href="https://dblp.org/pid/247/3104.html" />
      <link rel="me" href="https://ieeexplore.ieee.org/author/37086826620" />
      <link rel="me" href="https://www.semanticscholar.org/author/Junaid-Akram/144154437" />
      <link rel="me" href="https://www.linkedin.com/in/junaidakram/" />
      <link rel="me" href="https://lahore.comsats.edu.pk/employees/1333" />

      {/* ── Icons & PWA ──────────────────────────────────────────── */}
      <link
        rel="icon"
        href="/academic/ssa-research-group-logo.png"
        type="image/png"
      />
      <link rel="manifest" href="/manifest.json" />

      {/* ── Dublin Core (Academic Discoverability) ───────────────── */}
      <meta name="DC.title" content={title} />
      <meta name="DC.creator" content={author} />
      <meta name="DC.creator.personalName" content={PERSON_NAME_FULL} />
      <meta name="DC.subject" content={dcSubject} />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content={SITE_NAME} />
      <meta name="DC.relation.ispartof" content="COMSATS University Islamabad" />
      <meta name="DC.contributor" content={PERSON_NAME_FULL} />
      <meta name="DC.type" content={dcType} />
      <meta name="DC.format" content={dcFormat} />
      <meta name="DC.identifier" content={canonical} />
      <meta name="DC.identifier.scheme" content="URI" />
      <meta name="DC.language" content={dcLanguage} />
      <meta name="DC.rights" content={`© ${new Date().getFullYear()} ${PERSON_NAME_FULL}`} />

      {/* ── Google Scholar / Highwire Press Citation Meta Tags ────── */}
      {normalizedCitations.length === 0 ? (
        <>
          <meta name="citation_author" content={citationAuthor} />
          <meta name="citation_author_institution" content={AFFILIATION} />
          <meta name="citation_language" content="en" />
          <meta name="citation_online_date" content={new Date().toISOString().split("T")[0]} />
        </>
      ) : (
        normalizedCitations.map((pub, idx) => {
          const rawAuthors = pub.authors || pub.author || PERSON_NAME;
          const authorList = Array.isArray(rawAuthors)
            ? rawAuthors
            : typeof rawAuthors === "string"
            ? rawAuthors.split(/,| and /i).map((a) => a.trim()).filter(Boolean)
            : [PERSON_NAME];

          const cleanDoi = pub.doi || (pub.href?.includes("doi.org/") ? pub.href.replace(/https?:\/\/doi\.org\//, "") : "");

          return (
            <React.Fragment key={`meta-pub-${idx}`}>
              <meta name="citation_title" content={pub.title} />
              {authorList.map((auth, aIdx) => (
                <meta key={`meta-auth-${idx}-${aIdx}`} name="citation_author" content={auth} />
              ))}
              <meta name="citation_author_institution" content={AFFILIATION} />
              {pub.year && <meta name="citation_publication_date" content={`${pub.year}/01/01`} />}
              {pub.year && <meta name="citation_date" content={String(pub.year)} />}
              {pub.type === "Conference" || pub.booktitle ? (
                <meta name="citation_conference_title" content={pub.venue || pub.booktitle} />
              ) : (
                <meta name="citation_journal_title" content={pub.venue || pub.journal} />
              )}
              {cleanDoi && <meta name="citation_doi" content={cleanDoi} />}
              {pub.volume && <meta name="citation_volume" content={String(pub.volume)} />}
              {pub.issue && <meta name="citation_issue" content={String(pub.issue)} />}
              {pub.firstpage && <meta name="citation_firstpage" content={String(pub.firstpage)} />}
              {pub.pdfUrl && <meta name="citation_pdf_url" content={pub.pdfUrl} />}
              {pub.href && <meta name="citation_abstract_html_url" content={pub.href} />}
              <meta name="citation_language" content="en" />
            </React.Fragment>
          );
        })
      )}

      {/* ── JSON-LD Structured Data ───────────────────────────────── */}
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </Head>
  );
}

/* ================================================================
   SCHEMA HELPERS
   ================================================================ */

export function personSchema(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON_NAME_FULL,
    givenName: "Junaid",
    familyName: "Akram",
    honorificPrefix: "Dr.",
    honorificSuffix: "PhD",
    url: SITE_URL,
    image: OG_IMAGE,
    jobTitle: "Assistant Professor & Research Lab Director",
    description:
      "Assistant Professor in the School of Computer Science at University of Nottingham Ningbo China (UNNC), HEC-approved PhD Supervisor, and software-security researcher leading the Software Security Assessment Lab. Specializing in LLM vulnerability detection, Android malware analysis, semantic code clones, and automated program testing.",
    email: "mailto:Junaid.Akram@nottingham.edu.cn",
    worksFor: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#university`,
      name: AFFILIATION,
      url: "https://www.nottingham.edu.cn",
    },
    affiliation: {
      "@type": "ResearchOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "Software Security Assessment Lab",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Tsinghua University",
        url: "https://www.tsinghua.edu.cn",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "University of Luxembourg",
        url: "https://www.uni.lu",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Zhejiang University of Technology",
        url: "https://www.zjut.edu.cn",
      },
    ],
    sameAs: [
      "https://orcid.org/0000-0003-1752-6124",
      "https://scholar.google.com/citations?user=JunaidAkram",
      "https://www.researchgate.net/profile/Junaid-Akram",
      "https://dblp.org/pid/247/3104.html",
      "https://ieeexplore.ieee.org/author/37086826620",
      "https://www.semanticscholar.org/author/Junaid-Akram/144154437",
      "https://www.scopus.com/authid/detail.uri?authorId=57200277387",
      "https://dl.acm.org/profile/99659556271",
      "https://www.nottingham.edu.cn/",
      "https://lahore.comsats.edu.pk/employees/1333",
      "https://www.linkedin.com/in/junaidakram/",
    ],
    knowsAbout: [
      "Cyber Security",
      "Software Vulnerability Detection",
      "LLM-based Automated Program Repair",
      "Software Testing and Verification",
      "Malware Detection and Defense",
      "Code Clone Detection",
      "Software Evolution and Maintenance",
      "Android and IoT Security",
      "DevSecOps and Source Code Analysis",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "PhD in Software Engineering",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "Tsinghua University",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "HEC-Approved PhD Supervisor",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Higher Education Commission of Pakistan",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Postdoctoral Research in Software Verification",
        recognizedBy: {
          "@type": "CollegeOrUniversity",
          name: "University of Luxembourg / SnT",
        },
      },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Assistant Professor of Computer Science",
      occupationLocation: {
        "@type": "City",
        name: "Lahore, Pakistan",
      },
    },
    ...overrides,
  };
}

export function profilePageSchema(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    name: `${PERSON_NAME} — Academic Profile`,
    url: SITE_URL,
    description:
      "Academic profile, empirical research, peer-reviewed publications, student supervision, and international collaborations of Dr. Junaid Akram.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...overrides,
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "Research, publications, student supervision, and software security benchmarks of the Software Security Assessment Lab.",
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "Software Security Assessment Lab",
    alternateName: [
      "SSA Research Lab",
      "SSA Lab",
      "SCSA Lab",
      "Software Security Assessment Laboratory",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/academic/ssa-research-group-logo.png`,
      width: 1098,
      height: 1298,
    },
    image: `${SITE_URL}/academic/ssa-research-group-logo.png`,
    email: "ssa.laab@gmail.com",
    foundingDate: "2023",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#university`,
      name: AFFILIATION,
      url: "https://lahore.comsats.edu.pk",
    },
    founder: { "@id": `${SITE_URL}/#person` },
    member: [{ "@id": `${SITE_URL}/#person` }],
    knowsAbout: [
      "Software Security Assessment",
      "Source Code Vulnerability Detection",
      "Malware Defense",
      "Semantic Code Clone Detection",
      "DevSecOps",
      "Automated Program Repair",
    ],
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    sameAs: [
      "https://lahore.comsats.edu.pk",
      "https://orcid.org/0000-0003-1752-6124",
    ],
  };
}

export function navigationSchema() {
  const items = [
    ["About", "/about"],
    ["Research", "/research"],
    ["Publications", "/publications"],
    ["Supervision", "/supervision"],
    ["Team", "/team"],
    ["Events", "/events"],
    ["Contact", "/contact"],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#navigation`,
    name: "Primary Navigation",
    numberOfItems: items.length,
    itemListElement: items.map(([name, path], index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name,
      url: `${SITE_URL}${path}`,
    })),
  };
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  };
}

export function collectionPageSchema({ name, url, description, items = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
        ...(item.description ? { description: item.description } : {}),
        ...(item.image ? { image: item.image } : {}),
      })),
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
  };
}

export function scholarlyArticleSchema({
  title,
  headline,
  description,
  authors,
  venue,
  journal,
  booktitle,
  year,
  doi,
  href,
  pdfUrl,
  keywords,
}) {
  const articleTitle = title || headline;
  const rawAuthors = authors || PERSON_NAME_FULL;
  const authorList = Array.isArray(rawAuthors)
    ? rawAuthors
    : typeof rawAuthors === "string"
    ? rawAuthors.split(/,| and /i).map((a) => a.trim()).filter(Boolean)
    : [PERSON_NAME_FULL];

  const cleanDoi = doi || (href?.includes("doi.org/") ? href.replace(/https?:\/\/doi\.org\//, "") : "");
  const articleUrl = href || `${SITE_URL}/publications`;

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": cleanDoi ? `https://doi.org/${cleanDoi}` : `${articleUrl}#article`,
    headline: articleTitle,
    name: articleTitle,
    description: description || venue || journal || booktitle,
    url: articleUrl,
    author: authorList.map((authName) => ({
      "@type": "Person",
      name: authName,
      ...(authName.includes("Junaid Akram")
        ? {
            "@id": `${SITE_URL}/#person`,
            affiliation: {
              "@type": "CollegeOrUniversity",
              name: AFFILIATION,
            },
          }
        : {}),
    })),
    datePublished: year ? `${year}-01-01` : undefined,
    isPartOf: {
      "@type": booktitle ? "Event" : "Periodical",
      name: venue || journal || booktitle || "Academic Publication",
    },
    ...(cleanDoi ? { identifier: cleanDoi, sameAs: `https://doi.org/${cleanDoi}` } : {}),
    ...(pdfUrl ? { encoding: { "@type": "MediaObject", contentUrl: pdfUrl, encodingFormat: "application/pdf" } } : {}),
    ...(keywords ? { keywords } : {}),
    publisher: {
      "@type": "Organization",
      name: "Academic Publisher",
    },
    inLanguage: "en-US",
  };
}

export function articleSchema(props) {
  return scholarlyArticleSchema(props);
}

export function datasetSchema({
  name,
  description,
  url,
  keywords,
  creator = PERSON_NAME_FULL,
  license = "https://creativecommons.org/licenses/by/4.0/",
  temporalCoverage,
  spatialCoverage = "Worldwide",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: url || `${SITE_URL}/research`,
    keywords: keywords || "software security, benchmark dataset, vulnerability detection, source code analysis",
    creator: {
      "@id": `${SITE_URL}/#person`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    license,
    ...(temporalCoverage ? { temporalCoverage } : {}),
    spatialCoverage,
    isAccessibleForFree: true,
  };
}

export function softwareProjectSchema({
  name,
  description,
  url,
  codeRepository,
  programmingLanguages = [],
  image,
  dateCreated,
  keywords,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name,
    description,
    url,
    ...(codeRepository ? { codeRepository } : {}),
    ...(programmingLanguages.length
      ? { programmingLanguage: programmingLanguages }
      : {}),
    ...(image ? { image } : {}),
    ...(dateCreated ? { dateCreated } : {}),
    ...(keywords ? { keywords } : {}),
    author: { "@id": `${SITE_URL}/#person` },
    funder: {
      "@type": "CollegeOrUniversity",
      name: AFFILIATION,
    },
  };
}

export function serviceSchema({
  name = "Research collaboration",
  description = "Academic research and student supervision in software security.",
  serviceType,
  areaServed,
  url,
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areaServed || { "@type": "Country", name: "Pakistan" },
    ...(url ? { url } : {}),
  };
}

export function professionalServiceSchema(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "@id": `${SITE_URL}/#research-lab`,
    name: "Software Security Assessment Lab",
    url: SITE_URL,
    image: `${SITE_URL}/academic/ssa-research-group-logo.png`,
    description:
      "Research group focused on source-code security assessment, vulnerability detection, software testing, malware analysis, and code-clone detection.",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: AFFILIATION,
    },
    email: "mailto:ssa.laab@gmail.com",
    ...overrides,
  };
}

export function faqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function speakableSchema({ url, cssSelectors = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors.length
        ? cssSelectors
        : ["h1", "[data-speakable]", "meta[name='description']"],
    },
  };
}

export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  image,
  organizer,
  eventStatus = "https://schema.org/EventScheduled",
  eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
    eventStatus,
    eventAttendanceMode,
    location: location || {
      "@type": "Place",
      name: "COMSATS University Islamabad, Lahore Campus",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Defence Road, Off Raiwind Road",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
    },
    organizer: organizer || { "@id": `${SITE_URL}/#organization` },
  };
}

export function courseSchema({
  name,
  description,
  provider,
  url,
  educationalLevel,
  keywords,
  inLanguage = "en",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    ...(url ? { url } : {}),
    ...(educationalLevel ? { educationalLevel } : {}),
    ...(keywords ? { keywords } : {}),
    inLanguage,
    provider: provider || {
      "@type": "CollegeOrUniversity",
      name: AFFILIATION,
      url: "https://lahore.comsats.edu.pk",
    },
    instructor: { "@id": `${SITE_URL}/#person` },
  };
}

export function personMemberSchema({
  name,
  role,
  image,
  url,
  university,
  researchArea,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    ...(image ? { image } : {}),
    ...(url ? { url } : {}),
    memberOf: { "@id": `${SITE_URL}/#organization` },
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: university || AFFILIATION,
    },
    ...(researchArea ? { knowsAbout: researchArea } : {}),
  };
}

export function contactPageSchema({ url }) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url,
    name: "Contact SSA Research Lab",
    description:
      "Get in touch with Dr. Junaid Akram and the Software Security Assessment Lab for research collaboration, student supervision, or general inquiries.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function academicResearchPageSchema({ url, name, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    description,
    about: {
      "@type": "ResearchOrganization",
      "@id": `${SITE_URL}/#organization`,
    },
    author: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en-US",
  };
}
