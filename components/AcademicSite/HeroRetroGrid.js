import React from "react";
import styles from "./HeroRetroGrid.module.css";

/**
 * HeroRetroGrid
 * High-performance 3D perspective grid background inspired by Magic UI & Aceternity UI.
 * Creates an immersive deep-tech / cybersecurity environment with zero CPU/canvas lag.
 */
export default function HeroRetroGrid({ className = "", angle = 65, opacity = 0.45 }) {
  return (
    <div
      className={`${styles.gridWrapper} ${className}`}
      style={{ "--grid-angle": `${angle}deg`, "--grid-opacity": opacity }}
      aria-hidden="true"
    >
      <div className={styles.gridPerspective}>
        <div className={styles.gridPlane} />
      </div>
      <div className={styles.gridGradientOverlay} />
    </div>
  );
}
