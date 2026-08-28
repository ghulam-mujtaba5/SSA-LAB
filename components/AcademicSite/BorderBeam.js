import React from "react";
import styles from "./BorderBeam.module.css";

/**
 * BorderBeam
 * Animated border glow beam traveling along the edges of cards / containers.
 * Inspired by Magic UI & Aceternity UI.
 */
export default function BorderBeam({
  className = "",
  size = 180,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = "#0284c7",
  colorTo = "#38bdf8",
  delay = 0,
}) {
  return (
    <div
      style={{
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `-${delay}s`,
      }}
      className={`${styles.borderBeam} ${className}`}
      aria-hidden="true"
    />
  );
}
