import React from "react";
import Head from "next/head";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ssa-lab.tech";
const SITE_NAME = "SSA Research Lab";
const PERSON_NAME = "Junaid Akram";
const PERSON_NAME_FULL = "Dr. Junaid Akram, PhD";
const TWITTER_HANDLE = "@JunaidAkramPhD";
const TWITTER_SITE = "@SSALab";
const OG_IMAGE = `${SITE_URL}/academic/junaid-akram-professor.jpg`;
const LOGO_IMAGE = `${SITE_URL}/academic/ssa-research-group-logo.png`;
const AFFILIATION = "University of Nottingham Ningbo China";

/**
 * Normalizes an array of schemas into a single Schema.org @graph container
 */
function buildUnifiedJsonLdGraph(schemas) {
  if (!schemas || schemas.length === 0) return null;
  const flat = [];

  for (const item of schemas) {
    if (!item) continue;
    if (item["@graph"] && Array.isArray(item["@graph"])) {
      flat.push(...item["@graph"]);
    } else {
      const { "@context": _ctx, ...rest } = item;
      flat.push(rest);
    }
  }

  // Deduplicate schemas sharing the same @id
  const seenIds = new Set();
  const deduplicated = [];
  for (const node of flat) {
    if (node["@id"]) {
      if (seenIds.has(node["@id"])) continue;
      seenIds.add(node["@id"]);
    }
    deduplicated.push(node);
  }

  return {
    "@context": "https://schema.org",
    "@graph": deduplicated,
  };
}

export default function SEO({
  title = `SSA Research Lab | Software Security Research`,
  description = "Software Security Assessment (SSA) Lab led by Dr. Junaid Akram, PhD (former Postdoc at SnT, University of Luxembourg) at University of Nottingham Ningbo China. Static code analysis, vulnerability detection, malware defense, code clone auditing, and automated software testing.",
  url = SITE_URL,
  image = OG_IMAGE,
  imageWidth = 755,
  imageHeight = 716,
  imageAlt = "Dr. Junaid Akram, PhD — SSA Research Lab",
  type = "website",
  canonical = url,
  keywords = "Software Security Assessment, Vulnerability Detection, Static Application Security Testing, SAST, Code Audit, Malware Detection, Code Clone Analysis, Automated Software Testing, Dr Junaid Akram, Dr Junaid Akram PhD, Postdoc SnT Luxembourg, Tsinghua University PhD, University of Nottingham Ningbo China, UNNC",
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
  dcSubject = "Computer Science; Software Security; Vulnerability Detection; Malware Defense; Code Clones; Automated Testing; SAST; Code Auditing; DevSecOps",
  dcType = "Text",
  dcFormat = "text/html",
  dcLanguage = "en",
}) {
  const effectiveRobots = noindex ? "noindex, nofollow" : robots;
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const consolidatedGraph = buildUnifiedJsonLdGraph(schemas);

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
      {/* ── Primary Search Engine Directives ──────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={effectiveRobots} />
      <meta name="googlebot" content={effectiveRobots} />
      <meta name="bingbot" content={effectiveRobots} />
      <meta name="rating" content="general" />
      <meta
        name="category"
        content="Education, Research, Technology, Software Security, Cybersecurity, Code Auditing"
      />
      <meta name="classification" content="Academic Research & Software Security Assessment" />
      <meta name="coverage" content="Worldwide" />
      <meta name="language" content="English" />
      <meta name="target" content="all" />

      {/* ── Geographic & Regional Metadata ────────────────────────── */}
      <meta name="geo.region" content="CN-33" />
      <meta name="geo.placename" content="Ningbo, Zhejiang, China" />
      <meta name="geo.position" content="29.8000;121.5600" />
      <meta name="ICBM" content="29.8000, 121.5600" />

      {/* ── Topical & AI Discoverability ─────────────────────────── */}
      <meta
        name="subject"
        content="Software Security Assessment, Vulnerability Detection, Malware Analysis, Code Clone Detection, Automated Software Testing"
      />
      <meta name="topic" content="Software Security Research & Vulnerability Assessment" />
      <meta name="summary" content={description} />
      <meta name="abstract" content={description} />

      {/* ── Open Graph (Facebook, LinkedIn, Discord) ──────────────── */}
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

      {/* ── LLM / AI Engine Discoverability ───────────────────────── */}
      <link rel="llms" href={`${SITE_URL}/llms.txt`} />
      <link rel="llms-full" href={`${SITE_URL}/llms-full.txt`} />
      <link
        rel="alternate"
        type="text/markdown"
        href={`${SITE_URL}/llms.txt`}
        title="LLM Context (Summary)"
      />
      <link
        rel="alternate"
        type="text/markdown"
        href={`${SITE_URL}/llms-full.txt`}
        title="LLM Context (Full)"
      />
      <link rel="author" href={`${SITE_URL}/about`} />

      {/* ── Identity Verification (rel=me) ───────────────────────── */}
      <link rel="me" href="https://orcid.org/0000-0003-1752-6124" />
      <link rel="me" href="https://scholar.google.com/citations?user=Jmlx3rkAAAAJ" />
      <link rel="me" href="https://www.researchgate.net/profile/Junaid-Akram" />
      <link rel="me" href="https://dblp.org/pid/247/3104.html" />
      <link rel="me" href="https://ieeexplore.ieee.org/author/37086826620" />
      <link rel="me" href="https://www.semanticscholar.org/author/Junaid-Akram/144154437" />
      <link rel="me" href="https://www.scopus.com/authid/detail.uri?authorId=57200277387" />
      <link rel="me" href="https://dl.acm.org/profile/99659556271" />
      <link rel="me" href="https://www.linkedin.com/in/junaidakram/" />
      <link rel="me" href="https://www.nottingham.edu.cn/" />

      {/* ── Icons & PWA ──────────────────────────────────────────── */}
      <link
        rel="icon"
        href="/academic/ssa-research-group-logo.png"
        type="image/png"
      />
      <link rel="manifest" href="/manifest.json" />

      {/* ── Dublin Core (Academic & Commercial Discoverability) ───── */}
      <meta name="DC.title" content={title} />
      <meta name="DC.creator" content={author} />
      <meta name="DC.creator.personalName" content={PERSON_NAME_FULL} />
      <meta name="DC.subject" content={dcSubject} />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content={SITE_NAME} />
      <meta name="DC.relation.ispartof" content={AFFILIATION} />
      <meta name="DC.contributor" content={PERSON_NAME_FULL} />
      <meta name="DC.type" content={dcType} />
      <meta name="DC.format" content={dcFormat} />
      <meta name="DC.identifier" content={canonical} />
      <meta name="DC.identifier.scheme" content="URI" />
      <meta name="DC.language" content={dcLanguage} />
      <meta name="DC.coverage" content="Worldwide" />
      <meta
        name="DC.audience"
        content="Academic Researchers, Computer Scientists, Software Engineers, Cybersecurity Professionals, Enterprise Clients"
      />
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

          const cleanDoi =
            pub.doi ||
            (pub.href?.includes("doi.org/")
              ? pub.href.replace(/https?:\/\/doi\.org\//, "")
              : "");

          return (
            <React.Fragment key={`meta-pub-${idx}`}>
              <meta name="citation_title" content={pub.title} />
              {authorList.map((auth, aIdx) => (
                <meta
                  key={`meta-auth-${idx}-${aIdx}`}
                  name="citation_author"
                  content={auth}
                />
              ))}
              <meta name="citation_author_institution" content={AFFILIATION} />
              {pub.year && (
                <meta
                  name="citation_publication_date"
                  content={`${pub.year}/01/01`}
                />
              )}
              {pub.year && (
                <meta name="citation_date" content={String(pub.year)} />
              )}
              {pub.type === "Conference" || pub.booktitle ? (
                <meta
                  name="citation_conference_title"
                  content={pub.venue || pub.booktitle}
                />
              ) : (
                <meta
                  name="citation_journal_title"
                  content={pub.venue || pub.journal}
                />
              )}
              {cleanDoi && <meta name="citation_doi" content={cleanDoi} />}
              {pub.volume && (
                <meta name="citation_volume" content={String(pub.volume)} />
              )}
              {pub.issue && (
                <meta name="citation_issue" content={String(pub.issue)} />
              )}
              {pub.firstpage && (
                <meta name="citation_firstpage" content={String(pub.firstpage)} />
              )}
              {pub.pdfUrl && <meta name="citation_pdf_url" content={pub.pdfUrl} />}
              {pub.href && (
                <meta
                  name="citation_abstract_html_url"
                  content={pub.href}
                />
              )}
              <meta name="citation_language" content="en" />
            </React.Fragment>
          );
        })
      )}

      {/* ── JSON-LD Structured Data Graph (Schema.org / Google Search) ─ */}
      {consolidatedGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(consolidatedGraph).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </Head>
  );
}

/* ================================================================
   SCHEMA HELPERS (Rich Entity Graph for Search & Answer Engines)
   ================================================================ */

export function personSchema(overrides = {}) {
  return {
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
      "Assistant Professor in the School of Computer Science at University of Nottingham Ningbo China (UNNC), HEC-approved PhD Supervisor, and software-security researcher leading the Software Security Assessment Lab. Specializing in source code vulnerability detection, LLM automated program repair, Android malware analysis, semantic code clones, and automated program testing.",
    email: "mailto:Junaid.Akram@nottingham.edu.cn",
    telephone: "+86 (0) 574 88180000",
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
      "https://scholar.google.com/citations?user=Jmlx3rkAAAAJ",
      "https://www.researchgate.net/profile/Junaid-Akram",
      "https://dblp.org/pid/247/3104.html",
      "https://ieeexplore.ieee.org/author/37086826620",
      "https://www.semanticscholar.org/author/Junaid-Akram/144154437",
      "https://www.scopus.com/authid/detail.uri?authorId=57200277387",
      "https://dl.acm.org/profile/99659556271",
      "https://www.nottingham.edu.cn/en/Science-Engineering/Department/CS/People.aspx",
      "https://www.linkedin.com/in/junaidakram/",
    ],
    knowsAbout: [
      "Cyber Security",
      "Software Security Assessment",
      "Static Application Security Testing (SAST)",
      "Source Code Vulnerability Detection",
      "LLM-based Automated Program Repair",
      "Software Testing and Verification",
      "Malware Detection and Defense",
      "Code Clone Detection",
      "Software Evolution and Maintenance",
      "Android and IoT Security",
      "DevSecOps and Source Code Analysis",
      "Software Bill of Materials (SBOM) Validation",
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
        name: "Postdoctoral Research in Software Verification & Testing",
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
        name: "Ningbo, Zhejiang, China",
      },
    },
    ...overrides,
  };
}

export function profilePageSchema(overrides = {}) {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    name: `${PERSON_NAME_FULL} — Academic & Research Profile`,
    url: SITE_URL,
    description:
      "Academic profile, empirical research, peer-reviewed publications, student supervision, and software security assessment capabilities of Dr. Junaid Akram, PhD.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...overrides,
  };
}

export function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "Research, publications, student supervision, software security assessments, and vulnerability benchmarks of the Software Security Assessment Lab.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    creator: { "@id": `${SITE_URL}/#person` },
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
      url: LOGO_IMAGE,
      width: 1098,
      height: 1298,
    },
    image: LOGO_IMAGE,
    email: "Junaid.Akram@nottingham.edu.cn",
    telephone: "+86 (0) 574 88180000",
    foundingDate: "2023",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#university`,
      name: AFFILIATION,
      url: "https://www.nottingham.edu.cn",
    },
    founder: { "@id": `${SITE_URL}/#person` },
    member: [{ "@id": `${SITE_URL}/#person` }],
    address: {
      "@type": "PostalAddress",
      streetAddress: "199 Taikang East Road, School of Computer Science",
      addressLocality: "Ningbo",
      addressRegion: "Zhejiang",
      postalCode: "315100",
      addressCountry: "CN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+86-574-88180000",
        contactType: "Software Security Assessment & Research Inquiries",
        email: "Junaid.Akram@nottingham.edu.cn",
        availableLanguage: ["English", "Chinese"],
        areaServed: "Worldwide",
      },
    ],
    knowsAbout: [
      "Software Security Assessment",
      "Static Application Security Testing (SAST)",
      "Source Code Vulnerability Detection",
      "Malware Defense and Obfuscation Analysis",
      "Semantic Code Clone Detection",
      "DevSecOps Automation",
      "Automated Program Repair",
      "Software Testing and Constraint Verification",
      "Software Bill of Materials (SBOM) Quality",
      "Open Source Vulnerability Benchmarking",
    ],
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@id": `${SITE_URL}/#services`,
    },
    sameAs: [
      "https://www.nottingham.edu.cn",
      "https://orcid.org/0000-0003-1752-6124",
      "https://scholar.google.com/citations?user=Jmlx3rkAAAAJ",
      "https://dblp.org/pid/247/3104.html",
      "https://www.linkedin.com/in/junaidakram/",
    ],
  };
}

/**
 * Dedicated schema for Software Security Assessment Client & Industry Services
 * Enables search engine ranking for commercial & institutional client acquisitions
 */
export function clientServicesSchema() {
  return {
    "@type": ["ProfessionalService", "ResearchOrganization"],
    "@id": `${SITE_URL}/#services`,
    name: "Software Security Assessment & Code Audit Services — SSA Lab",
    alternateName: "SSA Security Consulting & Vulnerability Assessment",
    url: `${SITE_URL}/research`,
    image: LOGO_IMAGE,
    description:
      "Expert software security assessment, static application security testing (SAST), vulnerability benchmark auditing, proprietary code clone detection, obfuscated Android/IoT malware analysis, and automated test generation for industry clients and research partners.",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "199 Taikang East Road, School of Computer Science",
      addressLocality: "Ningbo",
      addressRegion: "Zhejiang",
      postalCode: "315100",
      addressCountry: "CN",
    },
    email: "mailto:Junaid.Akram@nottingham.edu.cn",
    telephone: "+86-574-88180000",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Security Assessment & Research Offerings",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Static Application Security Testing (SAST) & Source Code Vulnerability Audit",
            description:
              "Deep empirical source code auditing identifying memory corruption, injection flaws, OWASP Top 10 vulnerabilities, and authorization defects in C/C++, Java, Python, Go, and TypeScript.",
            serviceType: "Security Assessment & Code Audit",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Quantitative Vulnerability Detection & Benchmark Analysis (SQVDT & VCIPR)",
            description:
              "Repository-scale automated vulnerability scanning and patch validation leveraging SQVDT and VCIPR benchmark platforms across massive codebases.",
            serviceType: "Vulnerability Scanning & Benchmarking",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Semantic Code Clone & Proprietary Code Leakage Audit",
            description:
              "Detection of Type-1 through Type-4 semantic code clones, open-source license violations (GPL/AGPL), and proprietary intellectual property leakage using distributed Hadoop IBFET indexing.",
            serviceType: "Code Clone & Intellectual Property Audit",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Obfuscated Android Malware & IoT Binary Analysis",
            description:
              "Advanced decompilation, bytecode similarity analysis, and neural ensemble malware classification for Android APKs (DroidMD, DroidSD) and IoT firmware binaries (MTHAEL).",
            serviceType: "Malware Analysis & Mobile Security",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automated Software Test Generation & Constraint-Based Verification",
            description:
              "Constraint-based and search-based automated test-data generation, test-smell identification, and mission-critical software verification (ARC System).",
            serviceType: "Automated Software Testing & Verification",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Academic-Industry Collaborative Research & Sponsored Supervision",
            description:
              "Joint R&D grant proposals, corporate DevSecOps training, and postgraduate research supervision (PhD, Master's) in software security.",
            serviceType: "Academic Research & Sponsored Supervision",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
      ],
    },
  };
}

export function professionalServiceSchema(overrides = {}) {
  return {
    ...clientServicesSchema(),
    ...overrides,
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
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
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
        name: item.name || item.label,
        item:
          item.url ||
          (item.href
            ? item.href.startsWith("http")
              ? item.href
              : `${SITE_URL}${item.href}`
            : `${SITE_URL}/`),
      })),
    ],
  };
}

export function collectionPageSchema({ name, url, description, items = [] }) {
  return {
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

  const cleanDoi =
    doi ||
    (href?.includes("doi.org/")
      ? href.replace(/https?:\/\/doi\.org\//, "")
      : "");
  const articleUrl = href || `${SITE_URL}/publications`;

  return {
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
            sameAs: "https://orcid.org/0000-0003-1752-6124",
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
    ...(cleanDoi
      ? { identifier: cleanDoi, sameAs: `https://doi.org/${cleanDoi}` }
      : {}),
    ...(pdfUrl
      ? {
          encoding: {
            "@type": "MediaObject",
            contentUrl: pdfUrl,
            encodingFormat: "application/pdf",
          },
        }
      : {}),
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
    "@type": "Dataset",
    name,
    description,
    url: url || `${SITE_URL}/research`,
    keywords:
      keywords ||
      "software security, benchmark dataset, vulnerability detection, source code analysis",
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
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areaServed || { "@type": "AdministrativeArea", name: "Worldwide" },
    ...(url ? { url } : {}),
  };
}

export function faqSchema(faqs = []) {
  return {
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
      name: "University of Nottingham Ningbo China",
      address: {
        "@type": "PostalAddress",
        streetAddress: "199 Taikang East Road",
        addressLocality: "Ningbo, Zhejiang",
        addressCountry: "CN",
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
      url: "https://www.nottingham.edu.cn",
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
    "@type": "ContactPage",
    url,
    name: "Contact SSA Research Lab",
    description:
      "Get in touch with Dr. Junaid Akram, PhD and the Software Security Assessment Lab for research collaboration, client software security assessment, code audits, or student supervision.",
    mainEntity: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function academicResearchPageSchema({ url, name, description }) {
  return {
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
