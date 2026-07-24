import Head from "next/head";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sites.google.com/view/temporaryr";
const SITE_NAME = "Junaid Akram — SCSA Research Lab";
const PERSON_NAME = "Junaid Akram";
const OG_IMAGE = `${SITE_URL}/academic/junaid-akram-professor.jpg`;

export default function SEO({
  title = `${PERSON_NAME} | Software Security Research`,
  description = "Academic profile of Dr. Junaid Akram and the Source Code Security Assessment Lab at COMSATS University Islamabad, Lahore Campus.",
  url = SITE_URL,
  image = OG_IMAGE,
  imageWidth = 755,
  imageHeight = 716,
  imageAlt = "Dr. Junaid Akram",
  type = "website",
  canonical = url,
  keywords = "Junaid Akram, SCSA Lab, software security, vulnerability detection, software testing, COMSATS Lahore",
  author = PERSON_NAME,
  locale = "en_US",
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  noindex = false,
  publishedTime,
  modifiedTime,
  jsonLd,
}) {
  const effectiveRobots = noindex ? "noindex, nofollow" : robots;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={effectiveRobots} />
      <meta name="googlebot" content={effectiveRobots} />
      <meta name="bingbot" content={effectiveRobots} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <link rel="llms" href={`${SITE_URL}/llms.txt`} />
      <link rel="llms-full" href={`${SITE_URL}/llms-full.txt`} />
      <link
        rel="icon"
        href="/academic/scsa-research-group-logo.png"
        type="image/png"
      />
      <link rel="manifest" href="/manifest.json" />

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

export function personSchema(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON_NAME,
    givenName: "Junaid",
    familyName: "Akram",
    honorificSuffix: "PhD",
    url: SITE_URL,
    image: OG_IMAGE,
    jobTitle: "Assistant Professor",
    description:
      "Assistant Professor, HEC-approved PhD Supervisor, and software-security researcher leading the Source Code Security Assessment Lab.",
    email: "mailto:junaidakram@cuilahore.edu.pk",
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad, Lahore Campus",
    },
    affiliation: {
      "@type": "ResearchOrganization",
      name: "Source Code Security Assessment Lab",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Tsinghua University" },
      {
        "@type": "CollegeOrUniversity",
        name: "University of Luxembourg",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/junaidakram/",
      "https://www.researchgate.net/profile/Junaid-Akram",
      "https://orcid.org/0000-0003-1752-6124",
    ],
    knowsAbout: [
      "Cyber Security",
      "Software Vulnerability Detection",
      "Software Testing",
      "Malware Detection",
      "Code Clone Detection",
      "Software Evolution and Maintenance",
    ],
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
      "Research, publications, supervision, and people of the Source Code Security Assessment Lab.",
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "Source Code Security Assessment Lab",
    alternateName: "SCSA Research Lab",
    url: SITE_URL,
    logo: `${SITE_URL}/academic/scsa-research-group-logo.png`,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad, Lahore Campus",
    },
    founder: { "@id": `${SITE_URL}/#person` },
  };
}

export function navigationSchema() {
  const items = [
    ["About", "/about"],
    ["Research", "/research"],
    ["Publications", "/publications"],
    ["FYP Supervision", "/alumni"],
    ["Team", "/team"],
    ["Contact", "/contact"],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
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

export function collectionPageSchema({
  name,
  url,
  description,
  items = [],
}) {
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
  };
}

export function softwareProjectSchema({
  name,
  description,
  url,
  codeRepository,
  programmingLanguages = [],
  image,
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
    author: { "@id": `${SITE_URL}/#person` },
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
    name: "Source Code Security Assessment Lab",
    url: SITE_URL,
    image: `${SITE_URL}/academic/scsa-research-group-logo.png`,
    description:
      "Research group focused on source-code security assessment, vulnerability detection, software testing, malware analysis, and code-clone detection.",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "COMSATS University Islamabad, Lahore Campus",
    },
    email: "mailto:scsa.laab@gmail.com",
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
    ...(readingTime ? { timeRequired: `PT${readingTime}M` } : {}),
    ...(wordCount ? { wordCount } : {}),
  };
}

