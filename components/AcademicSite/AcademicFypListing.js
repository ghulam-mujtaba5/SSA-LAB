import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react";
import styles from "./AcademicSite.module.css";

const CATEGORIES = [
  "All",
  "Vulnerability & Security",
  "AI & Machine Learning",
  "Full-Stack & Systems",
];

export default function AcademicFypListing({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("all"); // 'all', 'completed', 'opportunity'
  const [searchQuery, setSearchQuery] = useState("");

  const { completedProjects, openOpportunities } = useMemo(() => {
    const completed = [];
    const opportunities = [];
    projects.forEach((p) => {
      if (p.isOpportunity || p.projectType === "Open FYP Opportunity" || p.projectType === "COMSATS FYP Opportunity") {
        opportunities.push(p);
      } else {
        completed.push(p);
      }
    });
    return { completedProjects: completed, openOpportunities: opportunities };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const isOpp = project.isOpportunity || project.projectType === "Open FYP Opportunity" || project.projectType === "COMSATS FYP Opportunity";
      
      // Type tab filter
      if (activeType === "completed" && isOpp) return false;
      if (activeType === "opportunity" && !isOpp) return false;

      // Category filter
      const matchesCategory =
        activeCategory === "All" ||
        project.category === activeCategory ||
        (activeCategory === "Vulnerability & Security" &&
          (project.nature?.includes("Security") || project.specializations?.some((s) => s.includes("Security")))) ||
        (activeCategory === "AI & Machine Learning" &&
          (project.nature?.includes("Research") || project.specializations?.some((s) => s.includes("Intelligence") || s.includes("Learning"))));

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
  }, [projects, activeCategory, activeType, searchQuery]);

  return (
    <section className={`${styles.section} ${styles.fypListingSection}`}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Supervision Directory</p>
          <h2>Supervised Final-Year Projects & Supervision Opportunities</h2>
          <p className={styles.sectionLead}>
            Explore completed student projects supervised by Dr. Junaid Akram alongside current open FYP topics for COMSATS students.
          </p>
        </div>
      </div>

      {/* Summary Counts Ribbon */}
      <div className={styles.listingStatsRow} style={{ marginBottom: "20px" }}>
        <span>
          <strong>{completedProjects.length}</strong> Completed Student Projects
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <strong>{openOpportunities.length}</strong> Current FYP Opportunities
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "-2px", color: "var(--brand-primary)" }} /> SCSA Lab Verified Directory
        </span>
      </div>

      {/* Segmented Type Switcher & Filters */}
      <div className={styles.fypFilterBar}>
        <div className={styles.categoryPills} aria-label="Directory View Selector">
          <button
            type="button"
            className={`${styles.filterPill} ${activeType === "all" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveType("all")}
          >
            All Projects & Ideas ({projects.length})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeType === "completed" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveType("completed")}
          >
            Completed Projects ({completedProjects.length})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeType === "opportunity" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveType("opportunity")}
          >
            Open FYP Opportunities ({openOpportunities.length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search topic, student, technology..."
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

      {/* Category Pills Bar */}
      <div className={styles.categoryPills} style={{ marginBottom: "24px" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ""}`}
            style={{ fontSize: "0.82rem", padding: "4px 12px" }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Cards Grid */}
      <div className={styles.fypCardGrid}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const isOpp = project.isOpportunity || project.projectType === "Open FYP Opportunity" || project.projectType === "COMSATS FYP Opportunity";
            const isFeatured = project.featured;
            const detailUrl = isOpp
              ? `/supervision/opportunities/${project.slug}`
              : `/supervision/projects/${project.slug}`;

            return (
              <article
                key={project.slug || project._id}
                className={`${styles.fypCard} ${isFeatured ? styles.fypCardFeatured : ""}`}
                style={isOpp ? { borderTop: "3px solid var(--brand-accent, #3b82f6)" } : undefined}
              >
                <div className={styles.fypCardTop}>
                  <div className={styles.fypCardBadges}>
                    <span className={styles.categoryBadge} style={isOpp ? { background: "rgba(59,130,246,0.12)", color: "#2563eb" } : undefined}>
                      {isOpp ? "Open FYP Opportunity" : project.category || "Final Year Project"}
                    </span>
                    {isFeatured ? (
                      <span className={styles.featuredBadge}>
                        <Sparkles size={12} /> Spotlight
                      </span>
                    ) : null}
                  </div>
                  <span className={styles.sessionBadge}>{project.session}</span>
                </div>

                <h3 className={styles.fypCardTitle}>
                  <Link href={detailUrl}>{project.title}</Link>
                </h3>

                <p className={styles.fypCardSummary}>{project.summary}</p>

                {/* Students list or Opportunity badge */}
                {!isOpp && project.students && project.students.length > 0 ? (
                  <div className={styles.fypCardStudents}>
                    <Users size={14} className={styles.metaIcon} />
                    <span>
                      {project.students.map((s, idx) => (
                        <strong key={s.name || idx}>
                          {s.profileUrl ? (
                            <a
                              href={s.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.studentProfileLink}
                            >
                              {s.name} <ExternalLink size={11} style={{ display: "inline", verticalAlign: "-1px" }} />
                            </a>
                          ) : (
                            s.name
                          )}
                          {s.registration ? <small> ({s.registration})</small> : ""}
                          {idx < project.students.length - 1 ? " · " : ""}
                        </strong>
                      ))}
                    </span>
                  </div>
                ) : isOpp ? (
                  <div className={styles.fypCardStudents} style={{ color: "var(--brand-primary)" }}>
                    <BookOpen size={14} className={styles.metaIcon} />
                    <span>Available for COMSATS BS Supervision</span>
                  </div>
                ) : null}

                {/* Technologies / Prerequisites */}
                <div className={styles.fypCardTech}>
                  {(project.technologies || []).slice(0, 5).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className={styles.fypCardActions}>
                  <Link href={detailUrl} className={styles.viewDetailBtn}>
                    {isOpp ? "View Opportunity Proposal" : "View Case Study"} <ArrowRight size={15} />
                  </Link>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.liveDemoBtn}
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
            <p>No projects matched your search criteria.</p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setActiveCategory("All");
                setActiveType("all");
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
