"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * NumberTicker
 * Smooth spring-based count-up animation for impact statistics (e.g. 324, 152823, 15, 50).
 * Preserves suffixes (+, B+, K+) and locale formatting.
 * Inspired by Magic UI & Emil Kowalski animation physics.
 */
export default function NumberTicker({
  value = "0",
  direction = "up",
  delay = 0,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  
  // Extract number and suffix from strings like "324B+", "152,823+", "15+", "50+"
  const rawString = String(value);
  const match = rawString.match(/^([\d,\.]+)(.*)$/);
  
  const numString = match ? match[1].replace(/,/g, "") : "0";
  const suffix = match ? match[2] : "";
  const targetNumber = parseFloat(numString) || 0;
  const isInteger = !numString.includes(".");

  const motionValue = useMotionValue(direction === "down" ? targetNumber : 0);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 120,
    mass: 1,
  });

  const [displayNumber, setDisplayNumber] = useState(
    direction === "down" ? targetNumber.toLocaleString() : "0"
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : targetNumber);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, direction, motionValue, targetNumber]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (isInteger) {
        setDisplayNumber(Math.round(latest).toLocaleString());
      } else {
        setDisplayNumber(latest.toFixed(1));
      }
    });
    return () => unsubscribe();
  }, [springValue, isInteger]);

  return (
    <span ref={ref} className={className}>
      {displayNumber}
      {suffix}
    </span>
  );
}
