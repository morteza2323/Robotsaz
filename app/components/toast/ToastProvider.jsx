"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ToastProvider.module.scss";

const ToastCtx = createContext(null);
let idCounter = 0;

export function ToastProvider({ children, duration = 4000 }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, opts = {}) => {
      const id = ++idCounter;
      const t = {
        id,
        message,
        title: opts.title,
        variant: opts.variant || "info", // success | error | warning | info | loading
        duration:
          typeof opts.duration === "number" ? opts.duration : duration, // ms
      };

      setToasts((prev) => [...prev, t]);

      // Auto-dismiss only if duration > 0
      if (t.duration > 0) {
        setTimeout(() => remove(id), t.duration);
      }

      return id;
    },
    [duration, remove]
  );

  const api = {
    show,
    success: (msg, o) => show(msg, { ...o, variant: "success" }),
    error: (msg, o) => show(msg, { ...o, variant: "error" }),
    warning: (msg, o) => show(msg, { ...o, variant: "warning" }),
    info: (msg, o) => show(msg, { ...o, variant: "info" }),

    // ✅ Loading method: duration=0 means it won't auto-close; close later with toast.dismiss(id)
    loading: (msg, o) => show(msg, { ...o, variant: "loading", duration: 0 }),

    dismiss: remove,
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}

      {mounted &&
        createPortal(
          <div className={styles.overlay} aria-live="polite" aria-atomic="true">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`${styles.toast} ${styles[t.variant]}`}
                style={{ animationDuration: `${Math.max(t.duration || 0, 400)}ms` }}
              >
                {t.title && <h3 className={styles.title}>{t.title}</h3>}
                <p className={styles.message}>{t.message}</p>

                <div className={styles.buttons}>
                  <button onClick={() => remove(t.id)} className={styles.btnClose}>
                    Close
                  </button>
                </div>

                {/* Progress bar: if duration=0 show indeterminate animation */}
                <div
                  className={`${styles.progress} ${
                    t.duration === 0 ? styles.indeterminate : ""
                  }`}
                  style={t.duration > 0 ? { animationDuration: `${t.duration}ms` } : undefined}
                />
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
