"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./GalleryLightbox.module.scss";

export default function GalleryLightbox({ images = [] }) {
  if (!images.length) return null;

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const openAt = (i) => { setIndex(i); setOpen(true); };
  const close = () => setOpen(false);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  // کلیدهای کیبورد
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  const [main, ...thumbs] = images;

  return (
    <div className={styles.gallery}>
      {/* عکس اصلی (اولین آیتم آرایه) */}
      <div className={styles.main} onClick={() => openAt(0)} aria-label="نمایش بزرگ">
        <img src={main} alt="Product Main Image" />
      </div>

      {/* بندانگشتی‌ها */}
      {thumbs.length > 0 && (
        <div className={styles.thumbs}>
          {images.map((src, i) => (
            <button key={i} className={styles.thumb} onClick={() => openAt(i)} aria-label={`image display ${i+1}`}>
              <img src={src} alt={`image ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* لایت‌باکس */}
      {open && (
        <div className={styles.overlay} onClick={close} role="dialog" aria-modal="true">
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={close} aria-label="بستن">×</button>
            <button className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="previous">‹</button>
            <img className={styles.full} src={images[index]} alt={`image ${index + 1}`} />
            <button className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="next">›</button>

            <div className={styles.counter}>{index + 1} / {images.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
