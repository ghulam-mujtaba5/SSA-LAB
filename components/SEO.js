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
const AFFILIATION = "COMSATS University Islamabad, Lahore Campus";

export default function SEO({
  title = `SSA Research Lab | Software Security Research`,
  description = "Academic profile of Dr. Junaid Akram and the Software Security Assessment Lab at COMSATS University Islamabad, Lahore Campus.",
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
  citationTitle,
  citationAuthor = PERSON_NAME,
  citationYear,
  citationJournal,
  // Dublin Core
  dcSubject = "Computer Science; Software Security; Vulnerability Detection",
  dcType = "Text",
  dcFormat = "text/html",
  dcLanguage = "en",
}) {
  const effectiveRobots = noindex ? "noindex, nofollow" : robots;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

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
      <meta name="category" content="Education, Research, Technology" />
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

      {/* ── Identity Verification (rel=me) ───────────────────────── */}
      <link rel="me" href="https://www.linkedin.com/in/junaidakram/" />
      <link rel="me" href="https://orcid.org/0000-0003-1752-6124" />
      <link rel="me" href="https://www.researchgate.net/profile/Junaid-Akram" />

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
      <meta name="DC.subject" content={dcSubject} />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content={SITE_NAME} />
      <meta name="DC.contributor" content={PERSON_NAME_FULL} />
      <meta name="DC.type" content={dcType} />
      <meta name="DC.format" content={dcFormat} />
      <meta name="DC.identifier" content={canonical} />
      <meta name="DC.language" content={dcLanguage} />
      <meta name="DC.rights" content={`© ${new Date().getFullYear()} ${PERSON_NAME_FULL}`} />

      {/* ── Google Scholar / Academic Citation Meta ───────────────── */}
      <meta name="citation_author" content={citationAuthor} />
      <meta name="citation_author_institution" content={AFFILIATION} />
      <meta name="citation_language" content="en" />
      {citationTitle && <meta name="citation_title" content={citationTitle} />}
      {citationYear && <meta name="citation_year" content={String(citationYear)} />}
      {citationJournal && <meta name="citation_journal_title" content={citationJournal} />}
      <meta name="citation_online_date" content={new Date().toISOString().split("T")[0]} />

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
    honorificSuffix: "PhD",
    url: SITE_URL,
    image: OG_IMAGE,
    jobTitle: "Assistant Professor",
    description:
      "Assistant Professor, HEC-approved PhD Supervisor, and software-security researcher leading the Software Security Assessment Lab at COMSATS University Islamabad, Lahore Campus.",
    email: "mailto:junaidakram@cuilahore.edu.pk",
    telephone: "+92-42-111-001-007",
    worksFor: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#university`,
      name: AFFILIATION,
      url: "https://lahore.comsats.edu.pk",
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
      "https://www.linkedin.com/in/junaidakram/",
      "https://www.researchgate.net/profile/Junaid-Akram",
      "https://orcid.org/0000-0003-1752-6124",
      "https://lahore.comsats.edu.pk/employees/1333",
      "https://scholar.google.com/citations?user=JunaidAkram",
    ],
    knowsAbout: [
      "Cyber Security",
      "Software Vulnerability Detection",
      "Software Testing",
      "Malware Detection",
      "Code Clone Detection",
      "Software Evolution and Maintenance",
      "Android Security",
      "Software Security Assessment",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Assistant Professor",
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
      "Academic profile, research, publications, supervision, and collaborations of Dr. Junaid Akram.",
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
      "Research, publications, supervision, and people of the Software Security Assessment Lab.",
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
    alternateName: ["SSA Research Lab", "SSA Lab"],
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
    member: { "@id": `${SITE_URL}/#person` },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    sameAs: [
      "https://lahore.comsats.edu.pk",
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
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
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

export function articleSchema({
  headline,
  description,
  image,
  url,
  datePublished,
  dateModified,
  keywords,
  readingTime,
  wordCount,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline,
    description,
    image: image ? [image] : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished,
    dateModified,
    keywords,
    inLanguage: "en-US",
    ...(readingTime ? { timeRequired: `PT${readingTime}M` } : {}),
    ...(wordCount ? { wordCount } : {}),
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
