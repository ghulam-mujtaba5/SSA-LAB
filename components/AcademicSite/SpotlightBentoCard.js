import React, { useRef, useState, useCallback } from "react";
import styles from "./SpotlightBentoCard.module.css";

/**
 * SpotlightBentoCard
 * Bento grid card with smooth cursor-tracking spotlight glow and glowing border.
 * Inspired by Aceternity UI Bento Grid & 21st.dev.
 */
export default function SpotlightBentoCard({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.18)",
  onClick,
  onKeyDown,
  tabIndex = 0,
  role = "button",
  ariaLabel,
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.spotlightCard} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      style={{
        "--spotlight-x": `${coords.x}px`,
        "--spotlight-y": `${coords.y}px`,
        "--spotlight-color": spotlightColor,
      }}
    >
      {/* Background Spotlight Glow */}
      <div
        className={styles.spotlightEffect}
        style={{ opacity: isHovered ? 1 : 0 }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
