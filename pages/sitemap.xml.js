import { defaultFypProjects } from "../data/fypProjects";

const STATIC_PAGES = [
  {
    path: "/",
    changefreq: "weekly",
    priority: 1.0,
    lastmod: "2026-08-14",
    image: {
      loc: "/academic/junaid-akram-professor.jpg",
      title: "Dr. Junaid Akram — SCSA Research Lab",
      caption: "Dr. Junaid Akram, Assistant Professor and Head of SCSA Research Lab",
    },
  },
  {
    path: "/about",
    changefreq: "monthly",
    priority: 0.9,
    lastmod: "2026-08-01",
    image: {
      loc: "/academic/scsa-research-group-logo.png",
      title: "SCSA Research Lab Logo",
    },
  },
  {
    path: "/research",
    changefreq: "weekly",
    priority: 0.95,
    lastmod: "2026-08-14",
  },
  {
    path: "/publications",
    changefreq: "weekly",
    priority: 0.95,
    lastmod: "2026-08-14",
  },
  {
    path: "/supervision",
    changefreq: "weekly",
    priority: 0.9,
    lastmod: "2026-08-14",
  },
  {
    path: "/team",
    changefreq: "monthly",
    priority: 0.85,
    lastmod: "2026-08-01",
    image: {
      loc: "/academic/scsa-research-group-logo.png",
      title: "SCSA Research Lab Team",
    },
  },
  {
    path: "/events",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: "2026-08-01",
  },
  {
    path: "/contact",
    changefreq: "monthly",
    priority: 0.8,
    lastmod: "2026-08-01",
  },
  {
    path: "/privacy-policy",
    changefreq: "yearly",
    priority: 0.5,
    lastmod: "2026-08-01",
  },
];

export async function getServerSideProps({ req, res }) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host;
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const protocol =
    forwardedProtocol || (host?.startsWith("localhost") ? "http" : "https");
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.ssa-lab.tech";

  // Build list of all project case studies and supervision opportunity pages
  const projectPages = defaultFypProjects.map((p) => {
    const isOpp =
      p.isOpportunity ||
      p.projectType === "Open FYP Opportunity" ||
      p.projectType === "COMSATS FYP Opportunity";
    const path = isOpp
      ? `/supervision/opportunities/${p.slug}`
      : `/supervision/projects/${p.slug}`;

    return {
      path,
      changefreq: "monthly",
      priority: 0.8,
      lastmod: "2026-08-01",
      image: p.coverImage
        ? {
            loc: p.coverImage,
            title: p.title,
            caption: p.coverAlt || `${p.title} case study poster`,
          }
        : undefined,
    };
  });

  const allPages = [...STATIC_PAGES, ...projectPages];

  const buildUrl = (page) => {
    const imageBlock = page.image
      ? `<image:image>` +
        `<image:loc>${base}${page.image.loc}</image:loc>` +
        (page.image.title
          ? `<image:title>${escapeXml(page.image.title)}</image:title>`
          : "") +
        (page.image.caption
          ? `<image:caption>${escapeXml(page.image.caption)}</image:caption>`
          : "") +
        `</image:image>`
      : "";

    return (
      `<url>` +
      `<loc>${base}${page.path}</loc>` +
      `<lastmod>${page.lastmod}</lastmod>` +
      `<changefreq>${page.changefreq}</changefreq>` +
      `<priority>${page.priority}</priority>` +
      imageBlock +
      `</url>`
    );
  };

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    allPages.map(buildUrl).join("\n") +
    `\n</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(xml);
  res.end();

  return { props: {} };
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function Sitemap() {
  return null;
}
