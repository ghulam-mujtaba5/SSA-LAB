// Run before sitemap generation: node scripts/generate-sitemap-paths.js
const fs = require("fs");

async function main() {
  const SITE =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.ssa-lab.tech";

  try {
    const projRes = await fetch(`${SITE}/api/projects?limit=1000&fields=slug,updatedAt`);

    const projects = projRes.ok
      ? (await projRes.json()).data || (await projRes.json()).projects || []
      : [];

    const paths = [
      ...projects.map((p) => ({
        loc: `/supervision/projects/${p.slug}`,
        lastmod: p.updatedAt || new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.8,
      })),
    ];

    fs.writeFileSync("sitemap-paths.json", JSON.stringify(paths, null, 2));
    console.log(`✓ Wrote ${paths.length} sitemap paths`);
  } catch (e) {
    console.warn("⚠ Sitemap path generation fallback:", e.message);
    fs.writeFileSync("sitemap-paths.json", "[]");
  }
}

main();
