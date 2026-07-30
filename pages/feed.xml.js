const entries = [
  {
    title: "Research Projects and Tools",
    path: "/research",
    description:
      "Current and completed SCSA Lab research in software security, vulnerability detection, testing, malware, and code analysis.",
  },
  {
    title: "Selected Publications",
    path: "/publications",
    description:
      "Selected journal and conference publications by Dr. Junaid Akram.",
  },
  {
    title: "Supervision",
    path: "/alumni",
    description:
      "Selected supervised student projects and internship outcomes.",
  },
];

export async function getServerSideProps({ res }) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://sites.google.com/view/temporaryr";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SCSA Research Lab — Source Code Security Assessment</title>
    <link>${base}</link>
    <description>Research, publications, and supervision updates from the Source Code Security Assessment Lab.</description>
    <language>en-us</language>
${entries
  .map(
    (entry) => `    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${base}${entry.path}</link>
      <description><![CDATA[${entry.description}]]></description>
      <guid isPermaLink="true">${base}${entry.path}</guid>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Feed() {
  return null;
}

