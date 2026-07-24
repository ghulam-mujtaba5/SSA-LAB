"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react";
import { useReducedMotion } from "framer-motion";

export default function AcademicLottie({
  src,
  className,
  ariaLabel,
  speed = 0.8,
}) {
  const [animationData, setAnimationData] = useState(null);
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const safeAnimationData = useMemo(
    () => (animationData ? JSON.parse(JSON.stringify(animationData)) : null),
    [animationData],
  );

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setAnimationData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (lottieRef.current) lottieRef.current.setSpeed(speed);
  }, [animationData, speed]);

  useEffect(() => {
    if (!containerRef.current || !lottieRef.current || reduceMotion) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) lottieRef.current?.play();
        else lottieRef.current?.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animationData, reduceMotion]);

  if (!safeAnimationData) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={safeAnimationData}
        autoplay={!reduceMotion}
        loop={!reduceMotion}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
