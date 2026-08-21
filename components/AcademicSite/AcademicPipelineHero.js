"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Database,
  FileCode2,
  BookOpenCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import styles from "./AcademicPipelineHero.module.css";

const EASE = [0.22, 1, 0.36, 1];

/* Wire paths in 720×480 canvas space — 1 input feeding SSA core, 3 outputs fanning out */
const WIRE_IN = "M 188 228 C 240 228, 268 227, 306 226";
const WIRE_TOOLS = "M 368 198 C 404 150, 442 108, 498 88";
const WIRE_PUBLICATIONS = "M 380 226 C 424 223, 466 219, 506 216";
const WIRE_ALUMNI = "M 362 254 C 400 304, 434 336, 480 356";

const CYCLE = "5.6s";
const SPLINE_TRAVEL = "0.45 0 0.25 1";
const SPLINE_REST = "0 0 1 1";

const OUTPUT_PULSE = {
  r: 3.8,
  keyPoints: "0;0;1",
  keySplines: `${SPLINE_REST};${SPLINE_TRAVEL}`,
  opacityKeys: "0;0;1;1;0",
  opacityTimes: "0;0.5;0.55;0.94;1",
};

const PULSES = [
  {
    id: "input",
    path: WIRE_IN,
    r: 4.4,
    keyPoints: "0;1;1",
    keySplines: `${SPLINE_TRAVEL};${SPLINE_REST}`,
    opacityKeys: "0;1;1;0;0",
    opacityTimes: "0;0.05;0.42;0.5;1",
  },
  { id: "tools", path: WIRE_TOOLS, ...OUTPUT_PULSE },
  { id: "publications", path: WIRE_PUBLICATIONS, ...OUTPUT_PULSE },
  { id: "alumni", path: WIRE_ALUMNI, ...OUTPUT_PULSE },
];

const STAGES = [
  {
    id: "all",
    label: "Complete Pipeline",
    desc: "Full automated flow from code collection to publication & project deployment",
  },
  {
    id: "input",
    label: "1. Source Evidence",
    desc: "Indexing 152K+ repositories, patch files & CVE vulnerability benchmarks",
  },
  {
    id: "core",
    label: "2. SSA Core Engine",
    desc: "Static analysis, clone detection, identifier renaming & obfuscation parsing",
  },
  {
    id: "tools",
    label: "3. Security Tools",
    desc: "SQVDT, VCIPR & DroidMD vulnerability detection platforms",
  },
  {
    id: "publications",
    label: "4. Publications",
    desc: "High-impact Q1 journal papers (Applied Soft Computing, IEEE, IJICS)",
  },
  {
    id: "alumni",
    label: "5. Innovation & Impact",
    desc: "Practical contribution to researchers, developers, industry, and society — BS, MS & PhD Security Platforms",
  },
];

const MOTION_KEYTIMES = "0;0.5;1";

function FloatCard({ delay, floatDuration, isActive, style, className, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`${styles.card} ${className || ""} ${isActive ? styles.cardActive : ""}`}
      style={style}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }
        }
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function AcademicPipelineHero() {
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState("all");
  const barHeights = [14, 22, 18, 28, 38];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });

  const wiresX = useTransform(sx, (v) => v * 5);
  const wiresY = useTransform(sy, (v) => v * 4);
  const coreX = useTransform(sx, (v) => v * 9);
  const coreY = useTransform(sy, (v) => v * 7);
  const cardsX = useTransform(sx, (v) => v * 14);
  const cardsY = useTransform(sy, (v) => v * 11);

  useEffect(() => {
    if (reduceMotion || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) return;
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, mx, my]);

  const activeStageInfo = STAGES.find((s) => s.id === activeStage);

  return (
    <div className={styles.pipelineWrapper}>
      {/* Interactive Stage Selector Bar */}
      <div className={styles.stageTabsRow} aria-label="Pipeline Stage Selector">
        {STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={`${styles.stageTab} ${activeStage === stage.id ? styles.stageTabActive : ""}`}
            onClick={() => setActiveStage(stage.id)}
          >
            {stage.label}
          </button>
        ))}
      </div>

      <div className={styles.canvas} aria-label="SSA Security Research Pipeline Diagram">
        {/* SVG Wires Layer */}
        <motion.div className={styles.layer} style={{ x: wiresX, y: wiresY }}>
          <svg className={styles.wires} viewBox="0 0 720 480" preserveAspectRatio="none">
            {[
              { id: "input", d: WIRE_IN },
              { id: "tools", d: WIRE_TOOLS },
              { id: "publications", d: WIRE_PUBLICATIONS },
              { id: "alumni", d: WIRE_ALUMNI },
            ].map(({ id, d }, i) => {
              const isWireHighlighted = activeStage === "all" || activeStage === id || activeStage === "core";
              return (
                <motion.path
                  key={d}
                  className={`${styles.wirePath} ${isWireHighlighted ? styles.wireHighlighted : styles.wireDimmed}`}
                  d={d}
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isWireHighlighted ? 1 : 0.25 }}
                  transition={{ duration: 0.8, delay: 0.7 + i * 0.12, ease: EASE }}
                />
              );
            })}

            {!reduceMotion &&
              PULSES.map(({ id, path, r, keyPoints, keySplines, opacityKeys, opacityTimes }) => {
                const isPulseActive = activeStage === "all" || activeStage === id || activeStage === "core";
                if (!isPulseActive) return null;
                return (
                  <g key={path}>
                    <circle className={styles.pulseHalo} r={r * 2.4} opacity="0">
                      <animateMotion
                        dur={CYCLE}
                        repeatCount="indefinite"
                        path={path}
                        keyPoints={keyPoints}
                        keyTimes={MOTION_KEYTIMES}
                        keySplines={keySplines}
                        calcMode="spline"
                      />
                      <animate
                        attributeName="opacity"
                        values={opacityKeys.replace(/1/g, "0.35")}
                        keyTimes={opacityTimes}
                        dur={CYCLE}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle className={styles.pulseDot} r={r} opacity="0">
                      <animateMotion
                        dur={CYCLE}
                        repeatCount="indefinite"
                        path={path}
                        keyPoints={keyPoints}
                        keyTimes={MOTION_KEYTIMES}
                        keySplines={keySplines}
                        calcMode="spline"
                      />
                      <animate
                        attributeName="opacity"
                        values={opacityKeys}
                        keyTimes={opacityTimes}
                        dur={CYCLE}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
          </svg>
        </motion.div>

        {/* SSA Core Box Layer */}
        <motion.div className={styles.layer} style={{ x: coreX, y: coreY }}>
          <FloatCard
            delay={0.6}
            floatDuration={5.2}
            isActive={activeStage === "all" || activeStage === "core"}
            className={`${styles.coreWrapPosition} ${styles.coreCard}`}
          >
            <div className={styles.cardHeader}>
              <Cpu size={16} color="#42c4e8" />
              <strong className={styles.cardTitle}>SSA Core Engine</strong>
              <span className={styles.dotLive} />
            </div>
            <p className={styles.cardBody}>
              Static Analysis · Vulnerability Scanning · Clone Detection
            </p>
            <div className={styles.coreBadge}>
              <ShieldCheck size={12} /> 324B+ Lines Indexed
            </div>
          </FloatCard>
        </motion.div>

        {/* Floating Outcome Cards Layer */}
        <motion.div className={styles.layer} style={{ x: cardsX, y: cardsY }}>
          {/* Input Card */}
          <FloatCard
            delay={0.4}
            floatDuration={4.4}
            isActive={activeStage === "all" || activeStage === "input"}
            className={styles.cardInput}
          >
            <div className={styles.cardHeader}>
              <Database size={15} color="#1d6685" />
              <strong className={styles.cardTitle}>Source Evidence</strong>
              <span className={styles.cardMeta}>INPUT</span>
            </div>
            <span className={styles.typedLine}>git clone & cve_parse_patch()</span>
            <p className={styles.cardBody}>152,823+ Open Source Repositories</p>
          </FloatCard>

          {/* Outcome 1: Security Tools */}
          <FloatCard
            delay={0.8}
            floatDuration={4.8}
            isActive={activeStage === "all" || activeStage === "tools"}
            className={styles.cardTool}
          >
            <div className={styles.cardHeader}>
              <FileCode2 size={15} color="#1d6685" />
              <strong className={styles.cardTitle}>Security Tools</strong>
              <span className={styles.cardMeta}>SQVDT</span>
            </div>
            <p className={styles.cardBody}>
              Vulnerability detection & obfuscation analyzer tools
            </p>
            <div className={styles.monoLine}>99.4% Accuracy</div>
          </FloatCard>

          {/* Outcome 2: Publications */}
          <FloatCard
            delay={0.9}
            floatDuration={5.6}
            isActive={activeStage === "all" || activeStage === "publications"}
            className={styles.cardPub}
          >
            <div className={styles.cardHeader}>
              <BookOpenCheck size={15} color="#1d6685" />
              <strong className={styles.cardTitle}>Publications</strong>
              <span className={styles.cardMeta}>Q1 JOURNAL</span>
            </div>
            <p className={styles.cardBody}>
              Applied Soft Computing & IEEE Security papers
            </p>
            <div className={styles.monoLine}>25+ Papers Published</div>
          </FloatCard>

          {/* Outcome 3: Innovation & Impact */}
          <FloatCard
            delay={1.0}
            floatDuration={5.0}
            isActive={activeStage === "all" || activeStage === "alumni"}
            className={styles.cardAlumni}
          >
            <div className={styles.cardHeader}>
              <Sparkles size={15} color="#1d6685" />
              <strong className={styles.cardTitle}>Innovation & Impact</strong>
              <span className={styles.cardMeta}>IMPACT</span>
            </div>
            <p className={styles.cardBody}>
              Practical contribution to researchers, developers, industry, and society
            </p>
            <div className={styles.monoLine}>Supervision & Security Platforms</div>
            <div className={styles.sparkContainer}>
              {barHeights.map((h, i) => (
                <span key={i} className={styles.sparkBar} style={{ height: `${h}px` }} />
              ))}
            </div>
          </FloatCard>
        </motion.div>
      </div>

      {/* Mobile Pipeline Deck (Clean Stacked Presentation) */}
      <div className={styles.mobilePipelineDeck} aria-label="Mobile Research Pipeline Cards">
        <div className={`${styles.mobileCard} ${styles.coreCard}`}>
          <div className={styles.cardHeader}>
            <Cpu size={16} color="#42c4e8" />
            <strong className={styles.cardTitle}>SSA Core Engine</strong>
            <span className={styles.dotLive} />
          </div>
          <p className={styles.cardBody}>
            Static Analysis · Vulnerability Scanning · Clone Detection
          </p>
          <div className={styles.coreBadge}>
            <ShieldCheck size={12} /> 324B+ Lines Indexed
          </div>
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.cardHeader}>
            <Database size={15} color="#1d6685" />
            <strong className={styles.cardTitle}>1. Source Evidence</strong>
            <span className={styles.cardMeta}>INPUT</span>
          </div>
          <span className={styles.typedLine}>git clone & cve_parse_patch()</span>
          <p className={styles.cardBody}>152,823+ Open Source Repositories</p>
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.cardHeader}>
            <FileCode2 size={15} color="#1d6685" />
            <strong className={styles.cardTitle}>2. Security Tools</strong>
            <span className={styles.cardMeta}>SQVDT</span>
          </div>
          <p className={styles.cardBody}>
            Vulnerability detection & obfuscation analyzer tools
          </p>
          <div className={styles.monoLine}>99.4% Accuracy</div>
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.cardHeader}>
            <BookOpenCheck size={15} color="#1d6685" />
            <strong className={styles.cardTitle}>3. Publications</strong>
            <span className={styles.cardMeta}>Q1 JOURNAL</span>
          </div>
          <p className={styles.cardBody}>
            Applied Soft Computing & IEEE Security papers
          </p>
          <div className={styles.monoLine}>25+ Papers Published</div>
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.cardHeader}>
            <Sparkles size={15} color="#1d6685" />
            <strong className={styles.cardTitle}>4. Innovation & Impact</strong>
            <span className={styles.cardMeta}>IMPACT</span>
          </div>
          <p className={styles.cardBody}>
            Practical contribution to researchers, developers, industry, and society
          </p>
          <div className={styles.monoLine}>Supervision & Security Platforms</div>
        </div>
      </div>

      {/* Stage Detail Callout Banner */}
      {activeStageInfo && (
        <div className={styles.stageDescriptionBanner}>
          <Sparkles size={16} color="var(--academic-blue)" />
          <span>{activeStageInfo.desc}</span>
        </div>
      )}
    </div>
  );
}
