const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sites.google.com/view/temporaryr";

module.exports = {
  siteUrl,
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  sitemapBaseFileName: "sitemap-0",
  exclude: [
    "/admin",
    "/admin/*",
    "/api/*",
    "/sitemap.xml",
    "/sitemap-dynamic.xml",
    "/feed.xml",
    "/privacy-policy",
    "/resume",
    "/portfolio",
    "/portfolio/*",
    "/projects",
    "/projects/*",
    "/services",
    "/insights",
    "/insights/*",
    "/articles",
    "/articles/*",
    "/uses",
    "/search",
    "/404",
    "/500",
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: ["/admin/", "/api/", "/search", "/portfolio", "/portfolio/"],
      },
    ],
  },
};

