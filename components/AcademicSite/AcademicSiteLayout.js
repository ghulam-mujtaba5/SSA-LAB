import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";
import { academicProfile } from "../../data/academicSite";
import { useAcademicData } from "../../context/AcademicDataContext";
import AcademicFooter from "./AcademicFooter";
import Breadcrumbs, { generateBreadcrumbsFromPath } from "../Breadcrumbs/Breadcrumbs";
import SEO, {
  webSiteSchema,
  organizationSchema,
  clientServicesSchema,
  personSchema,
  navigationSchema,
  breadcrumbSchema,
} from "../SEO";
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
  { label: "Research Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ssa-lab.tech";

/** Build the base JSON-LD schemas injected on every page */
function buildBaseSchemas(path, extraSchemas = [], breadcrumbs = [], pageTitle = "") {
  const schemas = [
    webSiteSchema(),
    organizationSchema(),
    clientServicesSchema(),
    personSchema(),
    navigationSchema(),
  ];
  // Breadcrumb for all inner pages
  if (path && path !== "/" && !path.startsWith("/admin")) {
    const rawCrumbs =
      breadcrumbs && breadcrumbs.length > 0
        ? breadcrumbs
        : generateBreadcrumbsFromPath(path, pageTitle);

    if (rawCrumbs.length > 0) {
      schemas.push(
        breadcrumbSchema(
          rawCrumbs.map((c) => ({
            name: c.label || c.name,
            url: c.href
              ? c.href.startsWith("http")
                ? c.href
                : `${SITE_URL}${c.href}`
              : `${SITE_URL}${path.split("?")[0].split("#")[0]}`,
          }))
        )
      );
    }
  }
  return [...schemas, ...extraSchemas];
}

export default function AcademicSiteLayout({
  children,
  title,
  description,
  path = "",
  keywords,
  jsonLd,
  image,
  type,
  citations,
  breadcrumbs,
  hideBreadcrumbs = false,
}) {
  const router = useRouter();
  const { siteData } = useAcademicData();
  const profile = siteData.academicProfile || academicProfile;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const labName = profile.labShort || profile.lab || "SSA Research Lab";
  const pageTitle = title
    ? `${title} | ${labName}`
    : `${labName} | Software Security Research`;
  const canonical = `${SITE_URL}${path}`;
  const extraSchemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const allSchemas = buildBaseSchemas(path, extraSchemas, breadcrumbs, title);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <SEO
        title={pageTitle}
        description={description}
        url={canonical}
        canonical={canonical}
        keywords={keywords}
        jsonLd={allSchemas}
        {...(citations ? { citations } : {})}
        {...(image ? { image } : {})}
        {...(type ? { type } : {})}
      />

      <div className={styles.site}>
        <a href="#main-content" className={styles.skipToContent}>
          Skip to main content
        </a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.brand} aria-label="SSA Research Lab Home">
              <span className={styles.logoWrap}>
                <Image
                  src="/academic/ssa-research-group-logo.png"
                  alt="SSA Research Lab"
                  width={90}
                  height={60}
                  priority
                />
              </span>
              <span className={styles.brandWordmarkWrap}>
                <Image
                  src="/academic/ssa-wordmark-dark.svg"
                  alt="SSA Research Lab - Software Security Assessment"
                  width={220}
                  height={60}
                  className={styles.wordmarkDark}
                  priority
                />
                <Image
                  src="/academic/ssa-wordmark-light.svg"
                  alt="SSA Research Lab - Software Security Assessment"
                  width={220}
                  height={60}
                  className={styles.wordmarkLight}
                  priority
                />
              </span>
            </Link>

            <nav className={styles.desktopNav} aria-label="Primary navigation">
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? router.pathname === "/" || router.pathname === "/portfolio"
                    : router.pathname === item.href ||
                      (item.hasDropdown && router.pathname.startsWith("/supervision"));

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.href}
                      className={`${styles.navDropdown} ${dropdownOpen ? styles.dropdownActive : ""}`}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={item.href}
                        className={`${styles.dropdownTrigger} ${active ? styles.activeNav : ""}`}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                      >
                        {item.label} <ChevronDown size={14} className={styles.dropdownChevron} />
                      </Link>

                      <div
                        className={styles.dropdownMenu}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        role="menu"
                        aria-label={`${item.label} sub-navigation`}
                      >
                        {item.children.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={styles.dropdownItem}
                            role="menuitem"
                            onClick={() => {
                              if (dropdownTimeoutRef.current) {
                                clearTimeout(dropdownTimeoutRef.current);
                              }
                              setDropdownOpen(false);
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
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

        {!hideBreadcrumbs && path && path !== "/" && !path.startsWith("/admin") && (
          <Breadcrumbs items={breadcrumbs} path={path} pageTitle={title} />
        )}

        <main id="main-content">{children}</main>

        <AcademicFooter />
      </div>
    </>
  );
}
