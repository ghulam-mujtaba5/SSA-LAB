"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import styles from "./AcademicImageLightbox.module.css";

export default function AcademicImageLightbox({
  src,
  alt,
  width,
  height,
  caption,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 780px) 100vw, 50vw",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const modal =
    mounted && open
      ? createPortal(
          <div
            className={styles.backdrop}
            role="dialog"
            aria-modal="true"
            aria-label={`Expanded image: ${alt}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div className={styles.dialog}>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close expanded image"
                onClick={() => setOpen(false)}
                autoFocus
              >
                <X size={22} />
              </button>
              <div className={styles.expandedImage}>
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  sizes="95vw"
                />
              </div>
              {caption && <p>{caption}</p>}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className={`${styles.trigger} ${className}`}
        onClick={() => setOpen(true)}
        aria-label={`Open larger image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
        <span className={styles.zoomHint}>
          <Maximize2 size={15} />
          View
        </span>
      </button>
      {modal}
    </>
  );
}
