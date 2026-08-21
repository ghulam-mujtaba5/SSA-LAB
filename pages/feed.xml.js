const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ssa-lab.tech";

const entries = [
  {
    title: "Research Projects and Tools",
    path: "/research",
    description:
      "Current and completed SSA Lab research in software security, vulnerability detection, testing, malware, and code analysis.",
    category: "Research",
  },
  {
    title: "Selected Publications",
    path: "/publications",
    description:
      "Selected journal and conference publications by Dr. Junaid Akram.",
    category: "Publications",
  },
  {
    title: "Supervision Directory",
    path: "/supervision",
    description:
      "Final-year student project supervision, FYP opportunities, and alumni placement outcomes.",
    category: "Supervision",
  },
  {
    title: "People & Partners",
    path: "/team",
    description:
      "Principal investigator, MS/PhD researchers, BS engineering teams, and institutional partners of SSA Lab.",
    category: "Team",
  },
  {
    title: "Events & Presentations",
    path: "/events",
    description:
      "International conference keynotes, workshops, and research presentations by SSA Lab.",
    category: "Events",
  },
  {
    title: "About SSA Lab",
    path: "/about",
    description:
      "Profile, background, global research collaborations, and lab milestones of SSA Research Lab.",
    category: "About",
  },
];

export async function getServerSideProps({ res }) {
  const buildDate = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SSA Research Lab — Software Security Assessment</title>
    <link>${SITE_URL}</link>
    <description>Research, publications, and supervision updates from the Software Security Assessment Lab at COMSATS University Islamabad, Lahore Campus. Led by Dr. Junaid Akram.</description>
    <language>en-us</language>
    <managingEditor>junaidakram@cuilahore.edu.pk (Junaid Akram)</managingEditor>
    <webMaster>ssa.laab@gmail.com (SSA Lab)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>
    <category>Computer Science</category>
    <category>Software Security</category>
    <category>Academic Research</category>
    <image>
      <url>${SITE_URL}/academic/ssa-research-group-logo.png</url>
      <title>SSA Research Lab</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${entries
  .map(
    (entry) => `    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${SITE_URL}${entry.path}</link>
      <description><![CDATA[${entry.description}]]></description>
      <guid isPermaLink="true">${SITE_URL}${entry.path}</guid>
      <category><![CDATA[${entry.category}]]></category>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Feed() {
  return null;
}
