"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Mail,
  MapPin,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  BookOpen,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { academicProfile } from "../../data/academicSite";
import styles from "./AcademicFooter.module.css";

const EASE = [0.22, 1, 0.36, 1];

const RESEARCH_LINKS = [
  { href: "/research", label: "Research Projects & Tools" },
  { href: "/publications", label: "Selected Publications" },
  { href: "/research#domains", label: "Source Code Security Domains" },
];

const SUPERVISION_LINKS = [
  { href: "/supervision?tab=running", label: "Running Projects" },
  { href: "/supervision?tab=completed", label: "Completed Projects" },
  { href: "/supervision?tab=future", label: "Future Projects & Topics" },
  { href: "/team", label: "People & Lab Members" },
  { href: academicProfile.officialFypIdeas, label: "COMSATS Supervision Topics", external: true },
];

const LAB_LINKS = [
  { href: "/about", label: "About Dr. Junaid Akram" },
  { href: "/events", label: "Research Seminars & Events" },
  { href: academicProfile.officialProfile, label: "Official COMSATS Profile", external: true },
  { href: "/contact", label: "Office Hours & Location" },
  { href: "/admin/login", label: "Admin Portal" },
];

export default function AcademicFooter() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* Blueprint Top Pipeline Wire with Traveling Pulse Node */}
      <div className={styles.wire} aria-hidden="true">
        <span className={styles.wirePulse} />
        <span className={styles.wireNode} />
      </div>

      <motion.div
        className={styles.frame}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
        itemScope
        itemType="https://schema.org/ResearchOrganization"
      >
        <div className={styles.content}>
          {/* Brand Identity Column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoWrap} aria-label="SSA Research Lab Home">
              <Image
                src="/academic/ssa-research-group-logo.png"
                alt="SSA Research Group"
                width={90}
                height={60}
                className={styles.logoImage}
                itemProp="logo"
              />
              <div className={styles.brandTitles}>
                <strong itemProp="name">{academicProfile.labShort}</strong>
                <span itemProp="founder">{academicProfile.name}</span>
              </div>
            </Link>
            <p className={styles.tagline} itemProp="description">
              Source code security assessment, vulnerability detection, automated software testing, and malware analysis at COMSATS University Islamabad, Lahore Campus.
            </p>
            <div className={styles.institutionBadge} itemProp="parentOrganization">
              <GraduationCap size={15} /> {academicProfile.institution}
            </div>
          </div>

          {/* Nav Column 1: Research */}
          <nav className={styles.navCol} aria-label="Research links">
            <strong className={styles.colTitle}>Research & Tools</strong>
            {RESEARCH_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Nav Column 2: Supervision & Students */}
          <nav className={styles.navCol} aria-label="Supervision links">
            <strong className={styles.colTitle}>Supervision & Students</strong>
            {SUPERVISION_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Nav Column 3: Direct Institutional Details */}
          <div className={styles.contactCol}>
            <strong className={styles.colTitle}>Direct Contact</strong>
            <p className={styles.contactItem}>
              <Mail size={15} />
              <a href={`mailto:${academicProfile.emails[0]}`} itemProp="email">
                {academicProfile.emails[0]}
              </a>
            </p>
            <p className={styles.contactItem}>
              <Phone size={15} />
              <span itemProp="telephone">{academicProfile.officePhone}</span>
            </p>
            <p className={styles.contactItem}>
              <MapPin size={15} />
              <span itemProp="address">{academicProfile.office}</span>
            </p>
            <div className={styles.socialRow}>
              <a
                href={academicProfile.googleScholar}
                target="_blank"
                rel="me noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Google Scholar Profile"
                title="Google Scholar Profile"
                itemProp="sameAs"
              >
                <BookOpen size={18} />
              </a>
              <a
                href={academicProfile.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className={styles.socialIcon}
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
                itemProp="sameAs"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={academicProfile.officialProfile}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="COMSATS Official Profile"
                title="COMSATS Official Profile"
                itemProp="sameAs"
              >
                <ExternalLink size={18} />
              </a>
              <a
                href="https://github.com/ssa-lab"
                target="_blank"
                rel="me noopener noreferrer"
                className={styles.socialIcon}
                aria-label="GitHub Repository"
                title="GitHub Repository"
                itemProp="sameAs"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {academicProfile.name} · {academicProfile.lab}. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <span style={{ color: "var(--academic-muted)", fontSize: "0.82rem" }}>
              {academicProfile.office}, COMSATS Lahore
            </span>
            <Link
              href="/admin/login"
              rel="nofollow"
              className={styles.bottomLink}
              title="SSA Admin Portal Login"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <ShieldCheck size={14} style={{ color: "var(--academic-blue, #4f46e5)" }} />
              <span>Admin Portal</span>
            </Link>
            <button
              type="button"
              className={styles.toTop}
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              title="Back to top"
            >
              ↑
            </button>
          </div>
        </div>
      </motion.div>

      {/* Oversized subtle background watermark */}
      <div className={styles.watermark} aria-hidden="true">
        SSA LAB
      </div>
    </footer>
  );
}
