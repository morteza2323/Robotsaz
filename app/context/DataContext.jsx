"use client";
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bcRef = useRef(null); // BroadcastChannel

  // ---- fetchers
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "خطا در دریافت محصولات");
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "خطا در محصولات");
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "خطا در دریافت پروژه‌ها");
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "خطا در پروژه‌ها");
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([refreshProducts(), refreshProjects()]);
    } finally {
      setLoading(false);
    }
  }, [refreshProducts, refreshProjects]);

  // ---- initial load
  useEffect(() => { refreshAll(); }, [refreshAll]);

  // ---- helpers
  const upsertProduct = useCallback((item) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => String(p.numericId) === String(item.numericId));
      if (idx === -1) return [item, ...prev];
      const copy = prev.slice();
      copy[idx] = item;
      return copy;
    });
  }, []);
  const removeProduct = useCallback((numericId) => {
    setProducts(prev => prev.filter(p => String(p.numericId) !== String(numericId)));
  }, []);

  const upsertProject = useCallback((item) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => String(p.numericId) === String(item.numericId));
      if (idx === -1) return [item, ...prev];
      const copy = prev.slice();
      copy[idx] = item;
      return copy;
    });
  }, []);
  const removeProject = useCallback((numericId) => {
    setProjects(prev => prev.filter(p => String(p.numericId) !== String(numericId)));
  }, []);

  // ---- BroadcastChannel: دریافت پیام از تب‌های دیگر
  useEffect(() => {
    bcRef.current = new BroadcastChannel("robotsaz-data");
    const bc = bcRef.current;

    bc.onmessage = (ev) => {
      const msg = ev.data || {};
      // سبک 1: فقط ریفرش
      if (msg.type === "REFRESH_ALL") {
        refreshAll();
      }

      // سبک 2 (اختیاری): به جای fetch، مستقیم patch کنیم
      if (msg.type === "PRODUCT_UPSERT" && msg.payload) upsertProduct(msg.payload);
      if (msg.type === "PROJECT_UPSERT" && msg.payload) upsertProject(msg.payload);
      if (msg.type === "PRODUCT_REMOVE" && msg.numericId) removeProduct(msg.numericId);
      if (msg.type === "PROJECT_REMOVE" && msg.numericId) removeProject(msg.numericId);
    };

    return () => bc.close();
  }, [refreshAll, upsertProduct, upsertProject, removeProduct, removeProject]);

  // ---- Auto-refresh وقتی تب فوکوس می‌گیرد
  useEffect(() => {
    const onFocus = () => refreshAll();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshAll]);

  // ---- (اختیاری) Polling ملایم هر 60 ثانیه وقتی تب فوکوس است
  useEffect(() => {
    let timer;
    const start = () => (timer = setInterval(() => {
      if (document.visibilityState === "visible") refreshAll();
    }, 60000));
    const stop = () => timer && clearInterval(timer);
    start();
    return () => stop();
  }, [refreshAll]);

  // ---- ابزار broadcast برای مصرف در Dashboard
  const broadcast = useCallback((msg) => {
    try { bcRef.current?.postMessage(msg); } catch {}
  }, []);

  const value = useMemo(() => ({
    products, projects, loading, error,
    refreshAll, refreshProducts, refreshProjects,
    upsertProduct, removeProduct, upsertProject, removeProject,
    setProducts, setProjects,
    broadcast, // ⬅️ بفرست به بقیه تب‌ها/صفحات
  }), [
    products, projects, loading, error,
    refreshAll, refreshProducts, refreshProjects,
    upsertProduct, removeProduct, upsertProject, removeProject, broadcast
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider />");
  return ctx;
}
