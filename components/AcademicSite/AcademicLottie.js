"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import { Play, Pause, Shield, Sparkles } from "lucide-react";

export default function AcademicLottie({
  src,
  animationData: directData,
  className,
  ariaLabel,
  speed = 0.85,
  interactive = true,
  showControls = true,
}) {
  const [animationData, setAnimationData] = useState(directData || null);
  const [isLoading, setIsLoading] = useState(!directData && !!src);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const safeAnimationData = useMemo(() => {
    if (directData) return JSON.parse(JSON.stringify(directData));
    if (animationData) return JSON.parse(JSON.stringify(animationData));
    return null;
  }, [directData, animationData]);

  // Fetch JSON if src is passed
  useEffect(() => {
    if (directData || !src) return;

    let cancelled = false;
    setIsLoading(true);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Lottie fetch error:", err?.message || err);
        if (!cancelled) {
          setAnimationData(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src, directData]);

  // Set Speed
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [safeAnimationData, speed]);

  // Intersection Observer for viewport auto play/pause (saves performance)
  useEffect(() => {
    if (!containerRef.current || !lottieRef.current || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPaused) {
          lottieRef.current?.play();
        } else {
          lottieRef.current?.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [safeAnimationData, reduceMotion, isPaused]);

  const togglePlayPause = () => {
    if (!lottieRef.current) return;
    if (isPaused) {
      lottieRef.current.play();
      setIsPaused(false);
    } else {
      lottieRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        cursor: interactive ? "pointer" : "default",
      }}
      onClick={interactive ? togglePlayPause : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--academic-soft, #f8fafc)",
            borderRadius: "12px",
            color: "var(--academic-blue, #0284c7)",
            gap: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <Sparkles size={24} style={{ opacity: 0.6 }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8 }}>
            Loading Animation...
          </span>
        </div>
      )}

      {/* Main Lottie Player */}
      {safeAnimationData ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={safeAnimationData}
          autoplay={!reduceMotion && !isPaused}
          loop={!reduceMotion}
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}
        />
      ) : !isLoading ? (
        /* Fallback Graphic if JSON not loaded */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            color: "var(--academic-blue, #0284c7)",
            textAlign: "center",
            gap: "12px",
          }}
        >
          <Shield size={48} strokeWidth={1.5} />
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--academic-ink, #0f172a)" }}>
            Software Security Assessment
          </span>
        </div>
      ) : null}

      {/* Interactive Controls Overlay Badge (Shown on Hover) */}
      {showControls && safeAnimationData && isHovered && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: "rgba(15, 23, 42, 0.85)",
            color: "#ffffff",
            fontSize: "0.72rem",
            fontWeight: 600,
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10,
            pointerEvents: "none",
            transition: "all 0.2s ease",
          }}
        >
          {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          <span>{isPaused ? "Play" : "Pause"}</span>
        </div>
      )}
    </div>
  );
}
