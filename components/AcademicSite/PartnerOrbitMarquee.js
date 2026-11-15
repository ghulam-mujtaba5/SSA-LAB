import React from "react";
import Image from "next/image";
import { ExternalLink, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./PartnerOrbitMarquee.module.css";

const defaultStaticPartnerMap = {
  "University of Nottingham Ningbo China": "/academic/nottingham-university-logo.svg",
  "University of Nottingham": "/academic/nottingham-university-logo.svg",
  "COMSATS University Islamabad": "/academic/comsats-university-islamabad-logo.png",
  "Tsinghua University": "/academic/tsinghua-university-logo.webp",
  "University of Luxembourg (SnT)": "/academic/snt-university-luxembourg-logo.png",
  "SES Satellites": "/academic/ses-logo.png",
  "King Fahd University (KFUPM)": "/academic/king-fahd-university-logo.png",
};

/**
 * PartnerOrbitMarquee
 * Smooth infinite sliding track of academic and industrial collaborators with glassmorphism,
 * hover pause, and tactile elevation. Inspired by Magic UI Marquee & Orbiting patterns.
 */
export default function PartnerOrbitMarquee({ partners = [] }) {
  if (!partners || partners.length === 0) return null;

  // Duplicate list to create a seamless infinite loop
  const marqueeItems = [...partners, ...partners];

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeFadeLeft} aria-hidden="true" />
      <div className={styles.marqueeFadeRight} aria-hidden="true" />
      
      <div className={styles.marqueeTrack}>
        {marqueeItems.map((partner, idx) => {
          const isNottingham = partner.name?.toLowerCase().includes("nottingham") || partner.image?.toLowerCase().includes("nottingham");
          const partnerImg = isDark && partner.imageDark
            ? partner.imageDark
            : isDark && isNottingham
            ? "/academic/nottingham-university-logo-dark.svg"
            : !isDark && partner.imageLight
            ? partner.imageLight
            : partner.image || defaultStaticPartnerMap[partner.name] || "/academic/comsats-university-islamabad-logo.png";
          return (
            <a
              key={`${partner.name}-${idx}`}
              href={partner.href || "#"}
              target="_blank"
              rel="noreferrer"
              className={styles.partnerCard}
              title={`${partner.name} (${partner.role || "Partner"})`}
            >
              <div className={styles.partnerLogoWrap}>
                <Image
                  src={partnerImg}
                  alt={partner.name}
                  width={150}
                  height={44}
                  className={styles.partnerImg}
                />
              </div>
              <div className={styles.partnerInfo}>
                <div className={styles.partnerTitleRow}>
                  <span className={styles.partnerName}>{partner.name}</span>
                  <ExternalLink size={12} className={styles.externalIcon} />
                </div>
                {partner.role && (
                  <span className={styles.partnerRoleBadge}>
                    <Sparkles size={10} className={styles.sparkleIcon} />
                    {partner.role}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
