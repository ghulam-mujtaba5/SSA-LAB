const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.9 },
  { path: "/research", changefreq: "monthly", priority: 0.95 },
  { path: "/publications", changefreq: "monthly", priority: 0.9 },
  { path: "/alumni", changefreq: "monthly", priority: 0.9 },
  { path: "/resources", changefreq: "monthly", priority: 0.75 },
  { path: "/team", changefreq: "monthly", priority: 0.8 },
  { path: "/events", changefreq: "monthly", priority: 0.7 },
  { path: "/contact", changefreq: "yearly", priority: 0.7 },
];

export async function getServerSideProps({ req, res }) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host;
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const protocol =
    forwardedProtocol || (host?.startsWith("localhost") ? "http" : "https");
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    `${protocol}://${host}`;
  const now = new Date().toISOString();
  const urls = STATIC_PAGES.map((page) => ({
    loc: `${base}${page.path}`,
    lastmod: now,
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map(
        (url) =>
          `<url>` +
          `<loc>${url.loc}</loc>` +
          `<lastmod>${url.lastmod}</lastmod>` +
          `<changefreq>${url.changefreq}</changefreq>` +
          `<priority>${url.priority}</priority>` +
          `</url>`,
      )
      .join("") +
    `</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
