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
  const [activeType, setActiveType] = useState("all"); // 'all', 'running', 'completed', 'future'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (router.query.tab) {
      const tabParam = String(router.query.tab).toLowerCase();
      if (["all", "running", "completed", "complete", "future", "opportunities", "open"].includes(tabParam)) {
        if (tabParam === "complete") setActiveType("completed");
        else if (["future", "opportunities", "open"].includes(tabParam)) setActiveType("future");
        else setActiveType(tabParam);
      }
    }
  }, [router.query.tab]);

  // Partition all projects into running, completed, and open future opportunities
  const { runningProjects, completedProjects, futureProjects, allSupervised } = useMemo(() => {
    const running = [];
    const completed = [];
    const future = [];
    const supervised = [];

    projects.forEach((p) => {
      const isOpp =
        p.isOpportunity ||
        p.categoryType === "future" ||
        (p.projectType && (p.projectType.includes("Opportunity") || p.projectType.includes("Future") || p.projectType.includes("Open"))) ||
        (p.status && p.status.toLowerCase().includes("available"));

      if (isOpp) {
        future.push(p);
      } else {
        supervised.push(p);
        const isRunning =
          p.categoryType === "running" ||
          p.isRunning ||
          (p.status && p.status.toLowerCase().includes("running"));

        if (isRunning) {
          running.push(p);
        } else {
          completed.push(p);
        }
      }
    });

    return {
      runningProjects: running,
      completedProjects: completed,
      futureProjects: future,
      allSupervised: supervised,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let baseList = [];
    if (activeType === "running") baseList = runningProjects;
    else if (activeType === "completed") baseList = completedProjects;
    else if (activeType === "future") baseList = futureProjects;
    else baseList = [...runningProjects, ...completedProjects];

    return baseList.filter((project) => {
      // Category filter
      const matchesCategory =
        activeCategory === "All" ||
        project.category === activeCategory ||
        (activeCategory === "Vulnerability & Security" &&
          (project.nature?.includes("Security") ||
            project.specializations?.some((s) => s.includes("Security")))) ||
        (activeCategory === "AI & Machine Learning" &&
          (project.nature?.includes("Research") ||
            project.specializations?.some(
              (s) => s.includes("Intelligence") || s.includes("Learning")
            )));

      // Search filter
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const titleMatch = project.title?.toLowerCase().includes(query);
      const summaryMatch = project.summary?.toLowerCase().includes(query);
      const studentMatch = (project.students || []).some(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.registration?.toLowerCase().includes(query)
      );
      const techMatch = (project.technologies || []).some((t) =>
        t.toLowerCase().includes(query)
      );
      const instMatch = project.institution?.toLowerCase().includes(query);
      const prereqMatch = project.prerequisites?.toLowerCase().includes(query);

      return matchesCategory && (titleMatch || summaryMatch || studentMatch || techMatch || instMatch || prereqMatch);
    });
  }, [runningProjects, completedProjects, futureProjects, activeCategory, activeType, searchQuery]);

  return (
    <section className={`${styles.section} ${styles.fypListingSection}`}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Supervision Directory</p>
          <h2>Research Supervision & Capstone Projects</h2>
          <p className={styles.sectionLead}>
            Explore running research projects, completed student capstones, and open supervision dissertation topics led by Dr. Junaid Akram, PhD at SSA Lab.
          </p>
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
          <strong>{futureProjects.length}</strong> Open Supervision Topics
        </span>
        <span className={styles.listingStatsDivider}>·</span>
        <span>
          <ShieldCheck
            size={14}
            style={{
              display: "inline",
              verticalAlign: "-2px",
              color: "var(--brand-primary)",
            }}
          />{" "}
          SSA Lab Verified Directory
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
            All Supervised ({allSupervised.length})
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
            Open Topics ({futureProjects.length})
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
            const isFeatured = project.featured;
            const isOpp =
              project.isOpportunity ||
              project.categoryType === "future" ||
              (project.projectType && (project.projectType.includes("Opportunity") || project.projectType.includes("Open")));
            const detailUrl = isOpp
              ? `/supervision/opportunities/${project.slug}`
              : `/supervision/projects/${project.slug}`;

            return (
              <article
                key={project.slug || project._id}
                className={`${styles.fypCard} ${isFeatured ? styles.fypCardFeatured : ""}`}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                }}
              >
                <div className={styles.fypCardTop}>
                  <div className={styles.fypCardBadges}>
                    <span className={styles.categoryBadge}>
                      {isOpp ? "Open Supervision Topic" : (project.category || "Supervised Project")}
                    </span>
                    {isFeatured ? (
                      <span className={styles.featuredBadge}>
                        <Sparkles size={12} /> Spotlight
                      </span>
                    ) : null}
                  </div>
                  <span className={styles.sessionBadge}>
                    {isOpp ? "Available for Supervision" : project.session}
                  </span>
                </div>

                <h3 className={styles.fypCardTitle}>
                  <Link href={detailUrl}>{project.title}</Link>
                </h3>

                <p className={styles.fypCardSummary}>{project.summary}</p>

                {/* Open Opportunity Meta (Eligibility & Institution) */}
                {isOpp ? (
                  <div style={{ margin: "10px 0", fontSize: "0.8rem", color: "var(--academic-muted)", lineHeight: 1.5 }}>
                    <div>
                      <strong style={{ color: "var(--academic-text)" }}>Eligibility: </strong>
                      {project.programme || "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations"}
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <strong style={{ color: "var(--academic-text)" }}>Institution: </strong>
                      {project.institution || "University of Nottingham Ningbo China"}
                    </div>
                    {project.prerequisites && (
                      <div style={{ marginTop: "3px" }}>
                        <strong style={{ color: "var(--academic-text)" }}>Prerequisites: </strong>
                        {project.prerequisites}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Students list for supervised projects */}
                {!isOpp && project.students && project.students.length > 0 ? (
                  <div
                    className={styles.fypCardStudents}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "10px",
                    }}
                  >
                    {project.students.map((s, idx) => {
                      const staticStudentMap = {
                        "Ghulam Mujtaba": "/academic/students/ghulam-mujtaba.png",
                        "Muhammad Waqar Ul Mulk": "/academic/students/muhammad-waqar-ul-mulk.png",
                        "Muhammad Muneeb Azhar": "/academic/students/muhammad-muneeb-azhar.png",
                        "Hafiz Muhammad Shams ul Huda": "/academic/students/hafiz-shams-ul-huda.png",
                      };
                      const avatar = s.image || staticStudentMap[s.name];
                      return (
                        <span
                          key={s.name || idx}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: avatar ? "6px" : "3px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--academic-border)",
                            padding: avatar ? "2px 8px 2px 4px" : "3px 8px",
                            borderRadius: "16px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {avatar && (
                            <img
                              src={avatar}
                              alt={s.name}
                              width={18}
                              height={18}
                              style={{ borderRadius: "50%", objectFit: "cover" }}
                            />
                          )}
                          {s.profileUrl ? (
                            <a
                              href={s.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.studentProfileLink}
                            >
                              {s.name}{" "}
                              <ExternalLink
                                size={10}
                                style={{ display: "inline", verticalAlign: "-1px" }}
                              />
                            </a>
                          ) : (
                            <span style={{ fontWeight: 500 }}>{s.name}</span>
                          )}
                          {s.registration ? (
                            <small style={{ opacity: 0.75, marginLeft: "2px" }}>
                              ({s.registration})
                            </small>
                          ) : (
                            ""
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : null}

                {/* Technologies */}
                <div className={styles.fypCardTech}>
                  {(project.technologies || []).slice(0, 5).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className={styles.fypCardActions}>
                  <Link href={detailUrl} className={styles.viewDetailBtn}>
                    {isOpp ? "View Topic Details" : "View Case Study"} <ArrowRight size={15} />
                  </Link>

                  {isOpp ? (
                    <Link
                      href="/contact"
                      className={styles.liveDemoBtn}
                    >
                      Apply / Inquire <ExternalLink size={14} />
                    </Link>
                  ) : project.liveUrl ? (
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
