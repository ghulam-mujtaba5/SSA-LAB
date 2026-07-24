import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import styles from "./AcademicSite.module.css";

const CATEGORIES = [
  "All",
  "Vulnerability & Security",
  "AI & Machine Learning",
  "Blockchain & Web3",
  "Full-Stack & Systems",
];

export default function AcademicFypListing({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      const matchesCategory =
        activeCategory === "All" ||
        project.category === activeCategory ||
        (activeCategory === "Vulnerability & Security" &&
          (project.nature?.includes("Security") || project.specializations?.some((s) => s.includes("Security")))) ||
        (activeCategory === "AI & Machine Learning" &&
          (project.nature?.includes("Research") || project.specializations?.some((s) => s.includes("Intelligence") || s.includes("Learning")))) ||
        (activeCategory === "Blockchain & Web3" &&
          (project.category?.includes("Blockchain") || project.specializations?.some((s) => s.includes("Blockchain"))));

      // Search filter
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const titleMatch = project.title?.toLowerCase().includes(query);
      const summaryMatch = project.summary?.toLowerCase().includes(query);
      const studentMatch = (project.students || []).some(
        (s) => s.name?.toLowerCase().includes(query) || s.registration?.toLowerCase().includes(query),
      );
      const techMatch = (project.technologies || []).some((t) => t.toLowerCase().includes(query));

      return matchesCategory && (titleMatch || summaryMatch || studentMatch || techMatch);
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <section className={`${styles.section} ${styles.fypListingSection}`}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Supervised FYP Directory</p>
          <h2>Final-Year Student Projects ({projects.length})</h2>
          <p className={styles.sectionLead}>
            Explore completed final-year projects supervised by Dr. Junaid Akram across software security, artificial intelligence, static analysis, and blockchain systems.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.fypFilterBar}>
        <div className={styles.categoryPills} aria-label="Project Category Filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search title, student, technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search FYP Projects"
          />
          {searchQuery ? (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className={styles.listingStatsRow}>
        <span>
          Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> supervised projects
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "-2px", color: "var(--brand-primary)" }} /> SCSA Lab Verified Records
        </span>
      </div>

      {/* Projects Cards Grid */}
      <div className={styles.fypCardGrid}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const isFeatured = project.featured;
            return (
              <article
                key={project.slug || project._id}
                className={`${styles.fypCard} ${isFeatured ? styles.fypCardFeatured : ""}`}
              >
                <div className={styles.fypCardTop}>
                  <div className={styles.fypCardBadges}>
                    <span className={styles.categoryBadge}>
                      {project.category || "Final Year Project"}
                    </span>
                    {isFeatured ? (
                      <span className={styles.featuredBadge}>
                        <Sparkles size={12} /> Featured Spotlight
                      </span>
                    ) : null}
                  </div>
                  <span className={styles.sessionBadge}>{project.session}</span>
                </div>

                <h3 className={styles.fypCardTitle}>
                  <Link href={`/alumni/case-study/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p className={styles.fypCardSummary}>{project.summary}</p>

                {/* Students list */}
                <div className={styles.fypCardStudents}>
                  <Users size={14} className={styles.metaIcon} />
                  <span>
                    {(project.students || []).map((s, idx) => (
                      <strong key={s.name || idx}>
                        {s.name}
                        {s.registration ? <small> ({s.registration})</small> : ""}
                        {idx < project.students.length - 1 ? " · " : ""}
                      </strong>
                    ))}
                  </span>
                </div>

                {/* Technologies */}
                <div className={styles.fypCardTech}>
                  {(project.technologies || []).slice(0, 5).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                  {(project.technologies || []).length > 5 ? (
                    <span className={styles.moreTech}>
                      +{(project.technologies || []).length - 5} more
                    </span>
                  ) : null}
                </div>

                {/* Card Actions */}
                <div className={styles.fypCardActions}>
                  <Link
                    href={`/alumni/case-study/${project.slug}`}
                    className={styles.viewDetailBtn}
                  >
                    View Detailed Case Study <ArrowRight size={15} />
                  </Link>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.liveDemoBtn}
                      title="View deployed live application"
                    >
                      Live App <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className={styles.noResultsBox}>
            <p>No supervised projects matched your search criteria.</p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
