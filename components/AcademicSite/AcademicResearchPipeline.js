import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Braces } from "lucide-react";
import styles from "./AcademicResearchPipeline.module.css";

const stages = [
  {
    label: "Stage 01 — Evidence",
    title: "Source Artifact Ingestion",
    detail: "Repositories, CVE benchmarks, smart contracts, APKs & patch histories",
    image: "/academic/illustrations/stage-1.webp",
  },
  {
    label: "Stage 02 — Analysis",
    title: "AST & Semantic Parsing",
    detail: "Control/data flow graphs, clone detection & obfuscation normalization",
    image: "/academic/illustrations/stage-2.webp",
  },
  {
    label: "Stage 03 — Detection",
    title: "Vulnerability Engine",
    detail: "Isolating security flaws, malware behaviors & test smells (SQVDT, VCIPR)",
    image: "/academic/illustrations/stage-3.webp",
  },
  {
    label: "Stage 04 — Validation",
    title: "Empirical Benchmarking",
    detail: "Precision/recall evaluation, CWE ground truths & patch verification",
    image: "/academic/illustrations/stage-4.webp",
  },
  {
    label: "Stage 05 — Transfer",
    title: "Publications & Project Deliverables",
    detail: "Q1 journal papers, open-source tools deployment & student project deliverables",
    image: "/academic/illustrations/stage-5.webp",
  },
];

export default function AcademicResearchPipeline() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.pipeline} aria-label="Software security research workflow">
      <div className={styles.pipelineLine} aria-hidden="true">
        <span />
      </div>
      <div className={styles.stageGrid}>
        {stages.map((stage) => {
          return (
            <motion.article
              key={stage.title}
              initial={false}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.iconBox}>
                <Image
                  src={stage.image}
                  alt={stage.title}
                  width={44}
                  height={44}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span>{stage.label}</span>
              <h3>{stage.title}</h3>
              <p>{stage.detail}</p>
            </motion.article>
          );
        })}
      </div>
      <div className={styles.codeMark} aria-hidden="true">
        <Braces size={20} />
        SSA Laboratory — End-to-End Vulnerability Research Pipeline
      </div>
    </div>
  );
}
