import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("all"); // 'all', 'running', 'completed', 'opportunity'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (router.query.tab) {
      const tabParam = String(router.query.tab).toLowerCase();
      if (["all", "running", "completed", "complete", "future", "opportunity", "topics"].includes(tabParam)) {
        if (tabParam === "complete") setActiveType("completed");
        else if (tabParam === "opportunity" || tabParam === "topics") setActiveType("future");
        else setActiveType(tabParam);
      }
    }
  }, [router.query.tab]);

  const { runningProjects, completedProjects, futureProjects } = useMemo(() => {
    const running = [];
    const completed = [];
    const future = [];
    projects.forEach((p) => {
      const isRunning = p.categoryType === "running" || p.isRunning || (p.status && p.status.toLowerCase().includes("running"));
      const isFuture = p.categoryType === "future" || p.isOpportunity || p.isMsPhD || (p.status && p.status.toLowerCase().includes("future")) || (p.projectType && (p.projectType.includes("Opportunity") || p.projectType.includes("MS/PhD") || p.projectType.includes("Future")));
      
      if (isRunning) {
        running.push(p);
      } else if (isFuture) {
        future.push(p);
      } else {
        completed.push(p);
      }
    });
    return { runningProjects: running, completedProjects: completed, futureProjects: future };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const isRunning = project.categoryType === "running" || project.isRunning || (project.status && project.status.toLowerCase().includes("running"));
      const isFuture = project.categoryType === "future" || project.isOpportunity || project.isMsPhD || (project.status && project.status.toLowerCase().includes("future")) || (project.projectType && (project.projectType.includes("Opportunity") || project.projectType.includes("MS/PhD") || project.projectType.includes("Future")));
      const isCompleted = !isRunning && !isFuture;

      // Type tab filter
      if (activeType === "running" && !isRunning) return false;
      if (activeType === "completed" && !isCompleted) return false;
      if (activeType === "future" && !isFuture) return false;

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
      <div className={styles.sectionHeading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 min(100%, 600px)' }}>
          <p className={styles.eyebrow}>Supervision Directory</p>
          <h2>Research Supervision & Capstone Projects</h2>
          <p className={styles.sectionLead}>
            Explore running research projects, completed student capstones, and future MS/PhD research topics led by Dr. Junaid Akram at SCSA Lab.
          </p>
        </div>
        <div style={{ flexShrink: 0, margin: '0 auto' }}>
          <img 
            src="/ai-chatgpt/ai-robot-mascot.png" 
            alt="AI Assistant Mascot" 
            width={180} 
            height={180} 
            style={{ objectFit: 'contain', dropShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
          />
        </div>
      </div>

      {/* Summary Counts Ribbon */}
      <div className={styles.listingStatsRow} style={{ marginBottom: "20px" }}>
        <span>
          <strong>{runningProjects.length}</strong> Running Projects
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <strong>{completedProjects.length}</strong> Completed Projects
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <strong>{futureProjects.length}</strong> Future Projects & Topics
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
            All Projects ({projects.length})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeType === "running" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveType("running")}
          >
            Running Projects ({runningProjects.length})
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
            className={`${styles.filterPill} ${activeType === "future" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveType("future")}
          >
            Future Projects & Topics ({futureProjects.length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search topic, student, technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Supervised Projects"
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
                      {isOpp ? "Open Supervision Topic" : project.category || "Supervised Project"}
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
