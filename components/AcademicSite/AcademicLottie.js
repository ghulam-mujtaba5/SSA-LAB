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
  autoplay = true,
  hoverPlay = false,
  isHovered = false,
  loop = true,
  style = {},
}) {
  const [animationData, setAnimationData] = useState(directData || null);
  const [isLoading, setIsLoading] = useState(!directData && !!src);
  const [localHover, setLocalHover] = useState(false);

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

  const activeHover = hoverPlay ? (isHovered || localHover) : true;

  // Control playback based on hoverPlay & activeHover
  useEffect(() => {
    if (!lottieRef.current) return;
    try {
      lottieRef.current.setSpeed(speed);
      if (hoverPlay) {
        if (activeHover && !reduceMotion) {
          lottieRef.current.play();
        } else {
          lottieRef.current.goToAndStop(0, true);
        }
      } else {
        if (autoplay && !reduceMotion) {
          lottieRef.current.play();
        } else {
          lottieRef.current.pause();
        }
      }
    } catch (_) {}
  }, [safeAnimationData, speed, hoverPlay, activeHover, autoplay, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        background: "transparent",
        ...style,
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
            background: "transparent",
            color: "var(--academic-blue, #0284c7)",
            gap: "8px",
          }}
        >
          <Sparkles size={20} style={{ opacity: 0.5 }} />
        </div>
      )}

      {/* Main Lottie Player */}
      {safeAnimationData ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={safeAnimationData}
          autoplay={hoverPlay ? false : autoplay}
          loop={loop}
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", background: "transparent" }}
        />
      ) : !isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            color: "var(--academic-blue, #0284c7)",
            textAlign: "center",
            gap: "8px",
            background: "transparent",
          }}
        >
          <Shield size={36} strokeWidth={1.5} />
        </div>
      ) : null}
    </div>
  );
}
