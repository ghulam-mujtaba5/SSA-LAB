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
  "/academic/fyp/megilance-final-year-project-poster.jpeg": [639, 1600],
  "/academic/fyp/megilance-landing-page.png": [1075, 876],
  "/academic/fyp/megilance-system-architecture.png": [974, 1713],
  "/academic/fyp/megilance-ai-fraud-analysis.png": [980, 1024],
  "/academic/fyp/megilance-client-dashboard.png": [1920, 886],
  "/academic/fyp/megilance-freelancer-earnings-dashboard.png": [1915, 890],
  "/academic/fyp/megilance-admin-command-center.png": [1909, 891],
  "/academic/fyp/megilance-ai-matching.png": [1916, 893],
  "/academic/fyp/megilance-ai-features.png": [2520, 1080],
  "/academic/fyp/robust-android-malware-detector-poster.webp": [1200, 3000],
  "/academic/fyp/robust-android-malware-security-dashboard.webp": [1524, 1184],
  "/academic/fyp/robust-android-malware-uploaded-apps.webp": [1538, 1166],
  "/academic/fyp/robust-android-malware-risk-analysis.webp": [1502, 1548],
};

function getDimensions(src) {
  return defaultDimensions[src] || [1920, 1080];
}

export default function ProjectGallerySlider({ gallery = [], projectTitle = "Project" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailRailRef = useRef(null);

  // Filter out any invalid items
  const items = (gallery || [])
    .filter((item) => item && item.url)
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
