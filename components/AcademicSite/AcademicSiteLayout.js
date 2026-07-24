import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu, X, Mail, MapPin, ExternalLink } from "lucide-react";
import { academicProfile } from "../../data/academicSite";
import AcademicFooter from "./AcademicFooter";
import styles from "./AcademicSite.module.css";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Supervision", href: "/supervision" },
  { label: "Resources", href: "/resources" },
  { label: "People & Partners", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sites.google.com/view/temporaryr";

export default function AcademicSiteLayout({
  children,
  title,
  description,
  path = "",
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const pageTitle = title
    ? `${title} | ${academicProfile.name}`
    : `${academicProfile.name} | Software Security Research`;
  const canonical = `${siteUrl}${path}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="author" content={academicProfile.name} />
        <meta
          name="keywords"
          content="Junaid Akram, SCSA Lab, software security, vulnerability detection, software testing, malware detection, code clone detection, COMSATS Lahore, FYP supervision"
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content={`${siteUrl}/academic/junaid-akram-professor.jpg`}
        />
        <meta property="og:site_name" content={academicProfile.labShort} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: academicProfile.name,
              jobTitle: academicProfile.role,
              worksFor: {
                "@type": "CollegeOrUniversity",
                name: academicProfile.institution,
              },
              affiliation: {
                "@type": "ResearchOrganization",
                name: academicProfile.lab,
              },
              alumniOf: [
                {
                  "@type": "CollegeOrUniversity",
                  name: "Tsinghua University",
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "University of Luxembourg",
                },
              ],
              email: `mailto:${academicProfile.emails[0]}`,
              sameAs: [
                academicProfile.linkedin,
                academicProfile.researchGate,
                academicProfile.orcid,
                academicProfile.officialProfile,
              ],
              knowsAbout: [
                "Cyber Security",
                "Software Vulnerability Detection",
                "Software Testing",
                "Malware Detection",
                "Code Clone Detection",
                "Software Evolution and Maintenance",
              ],
            }),
          }}
        />
      </Head>

      <div className={styles.site}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.brand} aria-label="SCSA home">
              <span className={styles.logoWrap}>
                <Image
                  src="/academic/scsa-research-group-logo.png"
                  alt="SCSA Research Group"
                  width={44}
                  height={52}
                  priority
                />
              </span>
              <span className={styles.brandText}>
                <strong>{academicProfile.shortName}</strong>
                <small>{academicProfile.labShort}</small>
              </span>
            </Link>

            <nav className={styles.desktopNav} aria-label="Primary navigation">
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? router.pathname === "/portfolio"
                    : router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? styles.activeNav : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className={styles.menuButton}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {menuOpen && (
            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </header>

        <main>{children}</main>

        <AcademicFooter />
      </div>
    </>
  );
}
