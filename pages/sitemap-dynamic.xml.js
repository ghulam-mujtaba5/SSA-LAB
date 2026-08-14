// This page previously served a separate dynamic sitemap.
// Now sitemap.xml.js serves the complete sitemap (static + dynamic).
// Redirect to the canonical sitemap URL to avoid 404s for any cached references.

export async function getServerSideProps({ res }) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.ssa-lab.tech";
  res.setHeader("Location", `${base}/sitemap.xml`);
  res.statusCode = 301;
  res.end();
  return { props: {} };
}

export default function SiteMapDynamic() {
  return null;
}

