import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { ShieldCheck, Cpu, Lock, Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./LoadingAnimation.module.css";

const DEFAULT_LOGO = "/academic/scsa-research-group-logo.webp";

const LoadingAnimation = ({
  visible = true,
  backdropBlur,
  backdropOpacity,
  showStars = true,
  showScanline = true,
  showLogo = true,
  logoSrc = DEFAULT_LOGO,
  size = "md", // 'sm' | 'md' | 'lg' | 'xl'
  fullscreen = true,
  message,
  submessage,
  progress, // 0-100
  variant = "ssa-cyber", // 'ssa-cyber' | 'atom' | 'shield' | 'quantum' | 'ring'
  sizePx, // for ring variant (number)
}) => {
  const { theme } = useTheme();
  const [stars, setStars] = useState([]);
  const [cyberParticles, setCyberParticles] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const bgColor = useMemo(() => {
    if (typeof backdropOpacity !== "number") return undefined;
    const base = theme === "dark" ? [6, 13, 26] : [248, 250, 252];
    return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${Math.max(0, Math.min(backdropOpacity, 1))})`;
  }, [backdropOpacity, theme]);

  // Generate ambient starfield and quantum dust particles
  useEffect(() => {
    if (!showStars) return;
    const count = size === "xl" ? 24 : size === "lg" ? 18 : size === "sm" ? 8 : 14;

    const s = Array.from({ length: count }).map((_, i) => ({
      id: `star-${i}`,
      size: Math.random() * 2.5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      dur: 2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.7,
    }));
    setStars(s);

    const cp = Array.from({ length: 8 }).map((_, i) => ({
      id: `cp-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      dur: 4 + Math.random() * 5,
      delay: Math.random() * 2,
    }));
    setCyberParticles(cp);
  }, [showStars, size]);

  // Interactive 3D mouse parallax tilt effect
  const handleMouseMove = (e) => {
    if (!containerRef.current || !fullscreen) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Automatic phase status messages based on progress percentage
  const autoMessage = useMemo(() => {
    if (message) return message;
    if (typeof progress !== "number") return "Initializing SSA Cyber Core...";
    const p = Math.max(0, Math.min(100, progress));
    if (p < 25) return "Initializing SSA Cyber Core...";
    if (p < 55) return "Scanning Security & Analytics Modules...";
    if (p < 85) return "Synchronizing Deep Intelligence Engines...";
    if (p < 100) return "Verifying Cryptographic Tokens...";
    return "SSA Security Core Active";
  }, [message, progress]);

  const scale =
    size === "sm" ? 0.75 : size === "lg" ? 1.25 : size === "xl" ? 1.5 : 1;

  const ringSize = useMemo(() => {
    if (typeof sizePx === "number" && sizePx > 0) return sizePx;
    if (size === "sm") return 18;
    if (size === "lg") return 28;
    if (size === "xl") return 36;
    return 22; // md
  }, [sizePx, size]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${styles.container} ${!fullscreen ? styles.inline : ""} ${
        !visible ? styles.hidden : ""
      }`}
      data-theme={theme}
      role={typeof progress === "number" ? "progressbar" : "status"}
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
      aria-label={autoMessage}
      aria-valuemin={typeof progress === "number" ? 0 : undefined}
      aria-valuemax={typeof progress === "number" ? 100 : undefined}
      aria-valuenow={
        typeof progress === "number"
          ? Math.max(0, Math.min(100, progress))
          : undefined
      }
      style={{
        backdropFilter:
          typeof backdropBlur === "number" ? `blur(${backdropBlur}px)` : undefined,
        WebkitBackdropFilter:
          typeof backdropBlur === "number" ? `blur(${backdropBlur}px)` : undefined,
        backgroundColor: bgColor,
      }}
    >
      {/* Background Starfield & Floating Quantum Dust */}
      {showStars && (
        <div className={styles.stars} aria-hidden="true">
          {stars.map((s) => (
            <span
              key={s.id}
              className={styles.star}
              style={{
                width: s.size,
                height: s.size,
                left: `${s.x}%`,
                top: `${s.y}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
                opacity: s.opacity,
              }}
            />
          ))}
          {cyberParticles.map((cp) => (
            <span
              key={cp.id}
              className={styles.cyberParticle}
              style={{
                left: `${cp.x}%`,
                top: `${cp.y}%`,
                width: cp.size,
                height: cp.size,
                animationDuration: `${cp.dur}s`,
                animationDelay: `${cp.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Cyber Scanline Laser Overlay */}
      {showScanline && <div className={styles.scanlineOverlay} aria-hidden="true" />}

      {/* Main Flagship Animation: SSA-Cyber */}
      {(variant === "ssa-cyber" || variant === "atom" || variant === "quantum" || variant === "shield") && (
        <div
          className={styles.stage}
          style={{
            transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${scale})`,
          }}
        >
          <div className={styles.spinnerBox}>
            {/* Cyber Radar Grid & Crosshairs */}
            <div className={styles.radarGrid} aria-hidden="true">
              <div className={styles.radarRingOuter} />
              <div className={styles.radarRingInner} />
              <div className={styles.radarLineHorizontal} />
              <div className={styles.radarLineVertical} />
              <div className={styles.radarSweep} />
              <span className={`${styles.crosshairTick} ${styles.tickTop}`}>+</span>
              <span className={`${styles.crosshairTick} ${styles.tickRight}`}>+</span>
              <span className={`${styles.crosshairTick} ${styles.tickBottom}`}>+</span>
              <span className={`${styles.crosshairTick} ${styles.tickLeft}`}>+</span>
            </div>

            {/* 3D Multi-Axis Orbital Rings */}
            <div className={styles.orbitContainer1}>
              <div className={styles.orbit1}>
                <div className={styles.electron1} />
              </div>
            </div>

            <div className={styles.orbitContainer2}>
              <div className={styles.orbit2}>
                <div className={styles.electron2} />
              </div>
            </div>

            <div className={styles.orbitContainer3}>
              <div className={styles.orbit3}>
                <div className={styles.electron3} />
              </div>
            </div>

            {/* Center Core: SSA Lab Shield Emblem or Dynamic SVG Core */}
            <div className={styles.centralShieldCore} aria-hidden="true">
              <div className={styles.shieldGlowHalo} />
              {showLogo && logoSrc ? (
                <div className={styles.logoWrap}>
                  <Image
                    src={logoSrc}
                    alt="SSA Lab Emblem"
                    width={96}
                    height={64}
                    className={styles.logoImage}
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className={styles.svgShieldIcon}>
                  <ShieldCheck size={36} strokeWidth={1.8} />
                </div>
              )}
              <div className={styles.corePulseBadge}>
                <span className={styles.livePulseDot} />
                <span className={styles.coreTagText}>SSA CORE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ring Variant for Compact Inline Elements */}
      {variant === "ring" && (
        <div
          className={styles.ringWrap}
          style={{ width: ringSize, height: ringSize }}
        >
          <span className={styles.ringTrack} />
          <span className={styles.ringIndicator} />
        </div>
      )}

      {/* Dynamic Progress Bar & Diagnostics Meta Section */}
      {(autoMessage || typeof progress === "number") && variant !== "ring" && (
        <div className={styles.meta}>
          <div className={styles.statusBadge}>
            <Activity className={styles.statusIcon} size={14} />
            <span className={styles.messageText}>{autoMessage}</span>
          </div>

          {submessage && <div className={styles.submessageText}>{submessage}</div>}

          {typeof progress === "number" && (
            <div className={styles.progress} aria-hidden="true">
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                >
                  <span className={styles.progressBarSpark} />
                </div>
              </div>
              <span className={styles.progressText}>
                {Math.round(Math.max(0, Math.min(100, progress)))}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
