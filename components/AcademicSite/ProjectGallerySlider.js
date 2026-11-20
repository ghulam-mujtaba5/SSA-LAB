import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  Layers,
  Sparkles,
} from "lucide-react";
import styles from "./ProjectGallerySlider.module.css";

const defaultDimensions = {
  "/academic/fyp/ai-dermatologist-poster.webp": [2304, 5760],
  "/academic/fyp/apneaguard-dashboard.webp": [1408, 768],
  "/academic/fyp/apneaguard-mobile-interface.webp": [720, 1472],
  "/academic/fyp/apneaguard-poster.webp": [730, 1718],
  "/academic/fyp/apneaguard-telemetry-monitor.webp": [1024, 559],
  "/academic/fyp/code-clone-architecture.webp": [1163, 372],
  "/academic/fyp/code-clone-ast-similarity.webp": [1400, 800],
  "/academic/fyp/code-clone-semantic-benchmark.webp": [1400, 800],
  "/academic/fyp/code-clone-token-pipeline.webp": [1400, 800],
  "/academic/fyp/code-smell-analysis-dashboard.webp": [1268, 664],
  "/academic/fyp/code-smell-analysis-pipeline.webp": [1920, 909],
  "/academic/fyp/code-smell-code-inspector.webp": [1268, 659],
  "/academic/fyp/code-smell-dataset-pipeline.webp": [1271, 620],
  "/academic/fyp/code-smell-detection-poster.webp": [1312, 3264],
  "/academic/fyp/code-smell-evaluation-dashboard.webp": [1920, 909],
  "/academic/fyp/code-smell-refactoring-engine.webp": [1920, 909],
  "/academic/fyp/cric-craft-ball-analysis.webp": [1867, 836],
  "/academic/fyp/cric-craft-match-scorecard.webp": [1901, 853],
  "/academic/fyp/cric-craft-player-biomechanics.webp": [1880, 906],
  "/academic/fyp/cric-craft-video-annotation.webp": [1919, 782],
  "/academic/fyp/cric-craft-vision-analytics.webp": [3840, 2160],
  "/academic/fyp/feature-envy-ast-refactoring-graph.webp": [1400, 800],
  "/academic/fyp/feature-envy-detection-matrix.webp": [1400, 800],
  "/academic/fyp/feature-envy-gnn-architecture.webp": [1336, 530],
  "/academic/fyp/llm-patch-cve-repair-benchmarks.webp": [1019, 818],
  "/academic/fyp/llm-patch-docker-validation.webp": [1019, 818],
  "/academic/fyp/llm-patch-prompt-architecture.webp": [901, 782],
  "/academic/fyp/llm-patch-system-architecture.webp": [901, 782],
  "/academic/fyp/megilance-admin-command-center.png": [1909, 891],
  "/academic/fyp/megilance-ai-features.png": [2520, 1080],
  "/academic/fyp/megilance-ai-fraud-analysis.png": [980, 1024],
  "/academic/fyp/megilance-ai-matching.png": [1916, 893],
  "/academic/fyp/megilance-client-dashboard.png": [1920, 886],
  "/academic/fyp/megilance-final-year-project-poster.jpeg": [639, 1600],
  "/academic/fyp/megilance-freelancer-earnings-dashboard.png": [1915, 890],
  "/academic/fyp/megilance-landing-page.png": [1075, 876],
  "/academic/fyp/megilance-system-architecture.png": [974, 1713],
  "/academic/fyp/multisense-acoustic-biomarkers.webp": [1536, 1024],
  "/academic/fyp/multisense-model-training.webp": [1159, 690],
  "/academic/fyp/multisense-platform-architecture.webp": [1220, 625],
  "/academic/fyp/multisense-screening-dashboard.webp": [1672, 941],
  "/academic/fyp/multisense-screening-pipeline.webp": [1536, 1024],
  "/academic/fyp/multisense-video-landmark-attention.webp": [1536, 1024],
  "/academic/fyp/robust-android-malware-detector-poster.webp": [4800, 12000],
  "/academic/fyp/robust-android-malware-risk-analysis.webp": [1502, 1548],
  "/academic/fyp/robust-android-malware-security-dashboard.webp": [1524, 1184],
  "/academic/fyp/robust-android-malware-uploaded-apps.webp": [1538, 1166],
  "/academic/fyp/source-code-structure-poster.webp": [3000, 7500],
  "/academic/fyp/source-structure-architecture.webp": [3840, 2160],
  "/academic/fyp/source-structure-cfg-graph.webp": [1168, 622],
  "/academic/fyp/source-structure-component-map.webp": [1724, 909],
  "/academic/fyp/source-structure-dependency-graph.webp": [1744, 906],
  "/academic/fyp/test-data-gen-architecture.webp": [2048, 1152],
  "/academic/fyp/test-data-gen-coverage-dashboard.webp": [1343, 766],
  "/academic/fyp/test-data-gen-mutation-synthesis.webp": [1254, 1254],
  "/academic/fyp/test-data-generation-poster.webp": [2400, 6000],
  "/academic/fyp/vbs-benchmark-dashboard.webp": [1920, 909],
  "/academic/fyp/vbs-cve-evaluation.webp": [1920, 909],
  "/academic/fyp/vbs-patch-pipeline.webp": [1920, 1080],
  "/academic/fyp/vuln-detect-ast-prompt-tuning.webp": [1400, 800],
  "/academic/fyp/vuln-detect-benchmark-evaluation.webp": [1400, 800],
  "/academic/fyp/vuln-detect-llm-pipeline.webp": [1045, 669],
  "/academic/fyp/vulnerability-patch-recommendation-poster.webp": [2304, 5760],
  "/academic/fyp/xss-sniper-attack-analysis.webp": [1917, 943],
  "/academic/fyp/xss-sniper-dashboard.webp": [1918, 877],
  "/academic/fyp/xss-sniper-scan-results.webp": [1329, 804],
  "/academic/fyp/xss-vulnerability-poster.webp": [4800, 12000],
};

function getDimensions(src) {
  if (!src) return [1920, 1080];
  const clean = src.split("?")[0];
  return defaultDimensions[clean] || defaultDimensions[src] || [1920, 1080];
}

function getAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("/academic/fyp/") && !url.includes("?")) {
    return `${url}?v=2`;
  }
  return url;
}

export default function ProjectGallerySlider({ gallery = [], projectTitle = "Project" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailRailRef = useRef(null);

  // Filter out any invalid items and ensure asset versioning
  const items = (gallery || [])
    .filter((item) => item && item.url)
    .map((item) => ({ ...item, url: getAssetUrl(item.url) }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const total = items.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || total <= 1) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isLightboxOpen]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailRailRef.current) return;
    const activeThumb = thumbnailRailRef.current.children[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  if (total === 0) return null;

  const currentItem = items[currentIndex];
  const [currWidth, currHeight] = getDimensions(currentItem.url);

  return (
    <div className={styles.sliderContainer}>
      {/* Top Controls Header */}
      <div className={styles.sliderHeader}>
        <div className={styles.headerLeft}>
          <Layers size={16} className={styles.headerIcon} />
          <span className={styles.slideCounter}>
            Slide {currentIndex + 1} of {total}
          </span>
          <span className={styles.captionText}>
            {currentItem.caption || `${projectTitle} Screenshot ${currentIndex + 1}`}
          </span>
        </div>
        <div className={styles.headerActions}>
          {total > 1 && (
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setIsPlaying((p) => !p)}
              title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
          )}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsLightboxOpen(true)}
            title="Inspect Full Size Lightbox"
            aria-label="Inspect Full Size Lightbox"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Single Box Viewport */}
      <div className={styles.mainViewport}>
        <div
          className={styles.imageStage}
          onClick={() => setIsLightboxOpen(true)}
          title="Click to zoom image"
        >
          <Image
            src={currentItem.url}
            alt={currentItem.caption || `${projectTitle} visual`}
            width={currWidth}
            height={currHeight}
            className={styles.mainImage}
            priority={currentIndex === 0}
            unoptimized={typeof currentItem.url === "string" && currentItem.url.startsWith("/academic/fyp/")}
          />
        </div>

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.prevArrow}`}
              onClick={prevSlide}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.nextArrow}`}
              onClick={nextSlide}
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnail Carousel Strip */}
      {total > 1 && (
        <div className={styles.thumbnailStrip} ref={thumbnailRailRef}>
          {items.map((item, idx) => (
            <button
              key={`${item.url}-${idx}`}
              type="button"
              className={`${styles.thumbBtn} ${idx === currentIndex ? styles.activeThumb : ""}`}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
              }}
              aria-label={`Go to slide ${idx + 1}: ${item.caption || ""}`}
            >
              <Image
                src={item.url}
                alt={item.caption || `Thumbnail ${idx + 1}`}
                width={120}
                height={68}
                className={styles.thumbImage}
                unoptimized={typeof item.url === "string" && item.url.startsWith("/academic/fyp/")}
              />
              <span className={styles.thumbIndex}>{idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setIsLightboxOpen(false)}
            >
              ✕ Close
            </button>
            <div className={styles.lightboxImageWrapper}>
              <Image
                src={currentItem.url}
                alt={currentItem.caption || projectTitle}
                width={currWidth}
                height={currHeight}
                className={styles.lightboxImage}
                unoptimized={typeof currentItem.url === "string" && currentItem.url.startsWith("/academic/fyp/")}
              />
            </div>
            <div className={styles.lightboxCaption}>
              <p>{currentItem.caption || `${projectTitle} Screenshot ${currentIndex + 1}`}</p>
              <small>
                {currentIndex + 1} / {total} — Use arrow keys to navigate
              </small>
            </div>
            {total > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
                  onClick={prevSlide}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                  onClick={nextSlide}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
