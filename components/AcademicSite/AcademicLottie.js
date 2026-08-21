"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

export default function AcademicLottie({
  src,
  animationData: directData,
  className,
  ariaLabel,
  speed = 0.85,
}) {
  const [animationData, setAnimationData] = useState(directData || null);
  const [isLoading, setIsLoading] = useState(!directData && !!src);

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

  // Set Speed and ensure active continuous playback
  useEffect(() => {
    if (lottieRef.current) {
      try {
        lottieRef.current.setSpeed(speed);
        lottieRef.current.play();
      } catch (_) {}
    }
  }, [safeAnimationData, speed]);

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
      }}
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
          }}
        >
          <Sparkles size={22} style={{ opacity: 0.6 }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8 }}>
            Loading Animation...
          </span>
        </div>
      )}

      {/* Main Lottie Player — Always continuously loops without pause or stop */}
      {safeAnimationData ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={safeAnimationData}
          autoplay={true}
          loop={true}
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
    </div>
  );
}
