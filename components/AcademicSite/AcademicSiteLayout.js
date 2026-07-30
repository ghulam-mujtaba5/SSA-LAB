import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu, X, Mail, MapPin, ExternalLink, ChevronDown } from "lucide-react";
import { academicProfile } from "../../data/academicSite";
import AcademicFooter from "./AcademicFooter";
import styles from "./AcademicSite.module.css";

const supervisionSubItems = [
  { label: "Running Projects", href: "/supervision?tab=running" },
  { label: "Completed Projects", href: "/supervision?tab=completed" },
  { label: "Future Projects & Topics", href: "/supervision?tab=future" },
];

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  {
    label: "Supervision",
    href: "/supervision",
    hasDropdown: true,
    children: supervisionSubItems,
  },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pageTitle = title
    ? `${title} | ${academicProfile.labShort}`
    : `${academicProfile.labShort} | Software Security Research`;
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
      </Head>

      <div className={styles.site}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.brand} aria-label="SCSA home">
              <span className={styles.logoWrap}>
                <Image
                  src="/academic/scsa-research-group-logo.png"
                  alt="SCSA Research Group"
                  width={54}
                  height={36}
                  priority
                />
              </span>
              <span className={styles.brandText}>
                <strong>{academicProfile.labShort}</strong>
                <small>{academicProfile.shortName}</small>
              </span>
            </Link>

            <nav className={styles.desktopNav} aria-label="Primary navigation">
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? router.pathname === "/portfolio"
                    : router.pathname === item.href ||
                      (item.hasDropdown && router.pathname.startsWith("/supervision"));

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.href}
                      className={styles.navDropdown}
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`${styles.dropdownTrigger} ${active ? styles.activeNav : ""}`}
                      >
                        {item.label} <ChevronDown size={14} className={styles.dropdownChevron} />
                      </Link>

                      {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                          {item.children.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={styles.dropdownItem}
                              onClick={() => setDropdownOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

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
                <React.Fragment key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={item.hasDropdown ? { fontWeight: 700 } : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.hasDropdown &&
                    item.children.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        style={{ paddingLeft: "24px", fontSize: "0.82rem", opacity: 0.85 }}
                      >
                        └ {sub.label}
                      </Link>
                    ))}
                </React.Fragment>
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
