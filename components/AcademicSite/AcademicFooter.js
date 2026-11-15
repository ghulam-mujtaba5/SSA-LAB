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
  Globe,
} from "lucide-react";
import { academicProfile } from "../../data/academicSite";
import { useAcademicData } from "../../context/AcademicDataContext";
import styles from "./AcademicFooter.module.css";

const EASE = [0.22, 1, 0.36, 1];

const RESEARCH_LINKS = [
  { href: "/research", label: "Research Projects & Tools" },
  { href: "/publications", label: "Selected Publications" },
  { href: "/research#domains", label: "Source Code Security Domains" },
];

export default function AcademicFooter() {
  const { siteData } = useAcademicData();
  const profile = siteData.academicProfile || academicProfile;
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();

  const supervisionLinks = [
    { href: "/supervision?tab=running", label: "Running Projects" },
    { href: "/supervision?tab=completed", label: "Completed Projects" },
    { href: "/supervision?tab=future", label: "Future Projects & Topics" },
    { href: "/team", label: "People & Lab Members" },
    { href: profile.officialFypIdeas || academicProfile.officialFypIdeas, label: "COMSATS Supervision Topics", external: true },
  ];

  const labLinks = [
    { href: "/about", label: "About Dr. Junaid Akram, PhD" },
    { href: "/events", label: "Research Seminars & Events" },
    { href: profile.officialProfile || academicProfile.officialProfile, label: "Official COMSATS Profile", external: true },
    { href: "/contact", label: "Office Hours & Location" },
    { href: "/admin/login", label: "Admin Portal" },
  ];

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
                alt="SSA Research Lab"
                width={90}
                height={60}
                className={styles.logoImage}
                itemProp="logo"
              />
              <div className={styles.brandTitle}>
                <strong itemProp="name">{profile.labShort || profile.lab}</strong>
              </div>
            </Link>
            <p className={styles.brandDesc} itemProp="description">
              Advancing source-code vulnerability detection, automated software
              testing, LLM-based program repair, and semantic code-clone intelligence
              at scale.
            </p>
            <div className={styles.metaRow}>
              <ShieldCheck size={15} /> HEC-Approved PhD Supervisor · Postdoc (SnT Luxembourg)
            </div>
          </div>

          {/* Column 2: Research Quick Links */}
          <nav className={styles.col} aria-label="Research Links">
            <h3 className={styles.colHeading}>Research</h3>
            <ul className={styles.linkList}>
              {RESEARCH_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <ArrowRight size={13} className={styles.linkArrow} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Supervision */}
          <nav className={styles.col} aria-label="Supervision Links">
            <h3 className={styles.colHeading}>Supervision</h3>
            <ul className={styles.linkList}>
              {supervisionLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      <ExternalLink size={13} className={styles.linkArrow} />
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <ArrowRight size={13} className={styles.linkArrow} />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Contact & Office */}
          <div className={styles.col}>
            <h3 className={styles.colHeading}>Contact & Office</h3>
            <div className={styles.contactItem}>
              <Mail size={15} />
              <a href={`mailto:${profile.emails?.[0] || 'Junaid.Akram@nottingham.edu.cn'}`} itemProp="email">
                {profile.emails?.[0] || 'Junaid.Akram@nottingham.edu.cn'}
              </a>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={15} />
              <span itemProp="address">{profile.office}</span>
            </div>

            <div className={styles.socialRow}>
              <a
                href={profile.googleScholar}
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                title="Google Scholar Profile"
                aria-label="Google Scholar"
              >
                <GraduationCap size={16} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                title="LinkedIn Profile"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={profile.officialProfile}
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                title="University Official Profile"
                aria-label="University Profile"
                itemProp="sameAs"
              >
                <Globe size={16} />
              </a>
              <a
                href={profile.github || "https://github.com/ssalab"}
                target="_blank"
                rel="noreferrer"
                className={styles.socialBtn}
                title="GitHub Organization & Code"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {profile.name || academicProfile.name} · {profile.lab || academicProfile.lab}. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
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
      <svg className={styles.watermark} aria-hidden="true" role="presentation" viewBox="0 0 540 160">
        <text x="10" y="130" fill="currentColor">SSA LAB</text>
      </svg>
    </footer>
  );
}
