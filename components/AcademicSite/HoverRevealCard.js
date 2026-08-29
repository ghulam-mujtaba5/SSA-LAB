import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AcademicLottie from "./AcademicLottie";
import styles from "./HoverRevealCard.module.css";

/**
 * HoverRevealCard
 * Top-tier Silicon Valley micro-interaction card:
 * - Resting state: clean, minimal layout
 * - Hover state: smooth CSS expansion with reveal tags + corner asset slide/fade
 * - Lottie animation: plays on mouseenter, stops/resets on mouseleave
 */
export default function HoverRevealCard({
  number,
  badgeText = "Explore Roadmap",
  title,
  description,
  tags = [],
  assetType = "image", // "image" | "lottie" | "svg"
  assetSrc,
  assetAlt,
  onClick,
  onKeyDown,
  tabIndex = 0,
  role = "button",
  ariaLabel,
  className = "",
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${styles.hoverCard} ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel || title}
    >
      <div className={styles.topAccent} aria-hidden="true" />

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          {number && <span className={styles.cardNumber}>{number}</span>}
          {badgeText && (
            <span className={styles.badge}>
              {badgeText} <ArrowRight size={13} />
            </span>
          )}
        </div>

        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>

        {tags && tags.length > 0 && (
          <div className={styles.revealSection}>
            <div className={styles.tagRow}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {assetSrc && (
        <div className={styles.cornerAssetWrap} aria-hidden="true">
          {assetType === "lottie" ? (
            <AcademicLottie
              src={assetSrc}
              hoverPlay={true}
              isHovered={isHovered}
              ariaLabel={assetAlt || title}
              style={{ width: "100%", height: "100%" }}
            />
          ) : assetType === "svg" ? (
            <img
              src={assetSrc}
              alt={assetAlt || title}
              className={styles.cornerImage}
              loading="lazy"
            />
          ) : (
            <img
              src={assetSrc}
              alt={assetAlt || title}
              className={styles.cornerImage}
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
}
