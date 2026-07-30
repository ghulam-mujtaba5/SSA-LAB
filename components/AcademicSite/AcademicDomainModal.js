import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  BookOpen,
  AlertCircle,
  Compass,
  Building,
  Wrench,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import styles from "./AcademicDomainModal.module.css";

export default function AcademicDomainModal({ domain, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!domain) return null;

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(`modal-section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-domain-title"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.headerMeta}>
              <span className={styles.numberBadge}>
                {domain.number || domain.id}
              </span>
              <span className={styles.domainTag}>SCSA Lab Research Domain</span>
            </div>
            <h2 id="modal-domain-title" className={styles.modalTitle}>
              {domain.title}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close detail modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Bar / Tabs */}
        <div className={styles.navTabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "overview" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("overview")}
          >
            <BookOpen size={14} /> Overview
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "key-problems" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("key-problems")}
          >
            <AlertCircle size={14} /> Key Problems
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "directions" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("directions")}
          >
            <Compass size={14} /> Current Research Directions
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "lab-work" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("lab-work")}
          >
            <Building size={14} /> Related Lab Work
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "tools" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("tools")}
          >
            <Wrench size={14} /> Tools & Datasets
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab === "ideas" ? styles.activeTab : ""
            }`}
            onClick={() => scrollToSection("ideas")}
          >
            <Lightbulb size={14} /> Project Ideas
          </button>
        </div>

        {/* Modal Content Sections (In Exact Requested Order) */}
        <div className={styles.modalBody}>
          {/* 1. Overview */}
          <section id="modal-section-overview" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>
                <BookOpen size={20} />
              </span>
              <h3 className={styles.sectionTitle}>Overview</h3>
            </div>
            <p className={styles.overviewText}>
              {domain.overview || domain.description}
            </p>
          </section>

          {/* 2. Key Problems */}
          {domain.keyProblems && domain.keyProblems.length > 0 && (
            <section
              id="modal-section-key-problems"
              className={styles.sectionBlock}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <AlertCircle size={20} />
                </span>
                <h3 className={styles.sectionTitle}>Key Research Problems</h3>
              </div>
              <ul className={styles.itemList}>
                {domain.keyProblems.map((problem, i) => (
                  <li key={i} className={styles.itemCard}>
                    <AlertCircle size={16} className={styles.bulletIcon} />
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Current Research Directions */}
          {domain.currentDirections && domain.currentDirections.length > 0 && (
            <section
              id="modal-section-directions"
              className={styles.sectionBlock}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Compass size={20} />
                </span>
                <h3 className={styles.sectionTitle}>
                  Current Research Directions
                </h3>
              </div>
              <div className={styles.directionGrid}>
                {domain.currentDirections.map((direction, i) => (
                  <div key={i} className={styles.directionChip}>
                    <ShieldCheck size={16} className={styles.directionIcon} />
                    <span>{direction}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Related Lab Work */}
          {domain.relatedLabWork && (
            <section id="modal-section-lab-work" className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Building size={20} />
                </span>
                <h3 className={styles.sectionTitle}>Related SCSA Lab Work</h3>
              </div>
              <div className={styles.labWorkBox}>
                {domain.relatedLabWork.summary && (
                  <p className={styles.labWorkSummary}>
                    {domain.relatedLabWork.summary}
                  </p>
                )}
                {domain.relatedLabWork.items && (
                  <div className={styles.labWorkGrid}>
                    {domain.relatedLabWork.items.map((item, i) => (
                      <div key={i} className={styles.labWorkItem}>
                        <CheckCircle2
                          size={16}
                          style={{ color: "var(--academic-blue, #0284c7)" }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 5. Tools & Datasets */}
          {domain.toolsAndDatasets && (
            <section id="modal-section-tools" className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Wrench size={20} />
                </span>
                <h3 className={styles.sectionTitle}>Tools & Datasets</h3>
              </div>
              <div className={styles.resourcesBox}>
                {domain.toolsAndDatasets.summary && (
                  <p className={styles.resourcesSummary}>
                    {domain.toolsAndDatasets.summary}
                  </p>
                )}
                {domain.toolsAndDatasets.items && (
                  <div className={styles.resourceLinks}>
                    {domain.toolsAndDatasets.items.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.resourceLinkCard}
                      >
                        <span>{res.name}</span>
                        <ExternalLink size={15} className={styles.extIcon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 6. Project Ideas */}
          {domain.projectIdeas && domain.projectIdeas.length > 0 && (
            <section id="modal-section-ideas" className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Lightbulb size={20} />
                </span>
                <h3 className={styles.sectionTitle}>
                  Suitable Research and FYP Ideas
                </h3>
              </div>
              <div className={styles.projectsGrid}>
                {domain.projectIdeas.map((idea, i) => (
                  <div key={i} className={styles.projectIdeaCard}>
                    <span className={styles.ideaBadge}>Idea #{i + 1}</span>
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.closeButton}
            style={{ width: "auto", padding: "8px 16px", borderRadius: "8px" }}
            onClick={onClose}
          >
            Close Panel
          </button>
          <Link href="/supervision" className={styles.footerCta}>
            Apply for Supervision / FYP <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
