import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import styles from "./Breadcrumbs.module.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.ssa-lab.tech";

/**
 * Pre-configured label dictionary for common URL segments
 */
const SEGMENT_LABELS = {
  about: "About",
  research: "Research",
  publications: "Publications",
  supervision: "Supervision",
  team: "Research Team",
  events: "Events",
  contact: "Contact",
  "privacy-policy": "Privacy Policy",
  projects: "Projects",
  opportunities: "Opportunities",
  alumni: "Alumni",
  "case-study": "Case Studies",
  fyp: "Supervision",
};

/**
 * Prettify any raw path segment slug into Title Case
 */
function formatSegmentTitle(segment) {
  if (!segment) return "";
  if (SEGMENT_LABELS[segment.toLowerCase()]) {
    return SEGMENT_LABELS[segment.toLowerCase()];
  }
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/**
 * Clean up page title for breadcrumb leaf display (strips lab suffix e.g. " | SSA Research Lab")
 */
function cleanPageTitle(title) {
  if (!title) return "";
  return title
    .replace(/\s*\|\s*SSA.*$/i, "")
    .replace(/\s*—\s*SSA.*$/i, "")
    .replace(/\s*\|\s*Case Study$/i, "")
    .replace(/\s*—\s*Supervised.*$/i, "")
    .replace(/\s*—\s*Open Opportunity$/i, "")
    .trim();
}

/**
 * Auto-generate breadcrumb trail from a path string
 */
export function generateBreadcrumbsFromPath(path, pageTitle = "") {
  if (!path || path === "/" || path === "") {
    return [];
  }

  const cleanPath = path.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  // Special-case route handlers for intuitive academic hierarchy
  if (segments[0] === "supervision" && segments[1] === "projects" && segments[2]) {
    const leaf = cleanPageTitle(pageTitle) || formatSegmentTitle(segments[2]);
    return [
      { label: "Supervision", href: "/supervision" },
      { label: "Projects", href: "/supervision?tab=running" },
      { label: leaf },
    ];
  }

  if (segments[0] === "supervision" && segments[1] === "opportunities" && segments[2]) {
    const leaf = cleanPageTitle(pageTitle) || formatSegmentTitle(segments[2]);
    return [
      { label: "Supervision", href: "/supervision" },
      { label: "Opportunities", href: "/supervision?tab=future" },
      { label: leaf },
    ];
  }

  if (segments[0] === "alumni" && segments[1] === "case-study" && segments[2]) {
    const leaf = cleanPageTitle(pageTitle) || formatSegmentTitle(segments[2]);
    return [
      { label: "Supervision", href: "/supervision" },
      { label: "Case Studies", href: "/supervision?tab=completed" },
      { label: leaf },
    ];
  }

  if (segments[0] === "projects" && segments[1]) {
    const leaf = cleanPageTitle(pageTitle) || formatSegmentTitle(segments[1]);
    return [
      { label: "Supervision", href: "/supervision" },
      { label: "Projects", href: "/supervision" },
      { label: leaf },
    ];
  }

  // Generic segment reconstruction
  let accumulatedPath = "";
  return segments.map((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label =
      isLast && pageTitle
        ? cleanPageTitle(pageTitle)
        : formatSegmentTitle(segment);

    return {
      label,
      href: isLast ? null : accumulatedPath,
    };
  });
}

/**
 * Semantic, accessible, microdata-enhanced Breadcrumbs component
 * Adheres to Schema.org BreadcrumbList microdata standards.
 */
export default function Breadcrumbs({ items, path = "", pageTitle = "" }) {
  // If explicitly hidden or root/admin, don't render
  if (path === "/" || path === "" || path.startsWith("/admin")) {
    return null;
  }

  const crumbs =
    items && items.length > 0
      ? items
      : generateBreadcrumbsFromPath(path, pageTitle);

  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  const currentAbsoluteUrl = `${SITE_URL}${path.split("?")[0].split("#")[0]}`;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
      <div className={styles.container}>
        <ol
          className={styles.list}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {/* Position 1: Home */}
          <li
            className={styles.item}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/"
              className={styles.link}
              itemProp="item"
              title="SSA Research Lab Home"
            >
              <Home size={13} className={styles.homeIcon} aria-hidden="true" />
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {/* Child breadcrumb segments */}
          {crumbs.map((crumb, idx) => {
            const position = idx + 2;
            const isLast = idx === crumbs.length - 1;
            const absoluteHref = crumb.href
              ? `${SITE_URL}${crumb.href}`
              : currentAbsoluteUrl;

            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                <li className={styles.separator} aria-hidden="true">
                  <ChevronRight size={13} />
                </li>
                <li
                  className={styles.item}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {isLast || !crumb.href ? (
                    <>
                      <span
                        className={styles.current}
                        itemProp="name"
                        aria-current="page"
                        title={crumb.label}
                      >
                        {crumb.label}
                      </span>
                      <link itemProp="item" href={absoluteHref} />
                    </>
                  ) : (
                    <Link
                      href={crumb.href}
                      className={styles.link}
                      itemProp="item"
                    >
                      <span itemProp="name">{crumb.label}</span>
                    </Link>
                  )}
                  <meta itemProp="position" content={String(position)} />
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
