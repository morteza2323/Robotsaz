"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import ProductCard from "../components/ProductCard";
import { useData } from "@/app/context/DataContext"; // ⬅️ from context

const CATEGORIES = [
  { key: "all",        label: "All" },
  { key: "industrial", label: "Industrial" },
  { key: "printed",    label: "3D Printed" },
  { key: "education",  label: "Educational" },
];

const SORTS = [
  { key: "relevance",  label: "Most Relevant" },
  { key: "title-asc",  label: "Title (A→Z)" },
  { key: "title-desc", label: "Title (Z→A)" },
];

export default function ProductsPage() {
  const { products: ctxProducts } = useData(); // ⬅️ data from context
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [debouncedQ, setDebouncedQ] = useState(q);

  // Debounce search for better UX
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // Map real data → current card structure
  const RAW = useMemo(() => {
    return (ctxProducts || []).map((p) => ({
      id: String(p.numericId),                          // card key
      title: p.title,
      img: p.gallery?.[0] || "/images/placeholder.jpg", // cover
      href: `/products/${p.numericId}`,                 // detail link
      category: mapBadgesToCategory(p.badges),          // category from badges
      tags: Array.isArray(p.badges) ? p.badges : [],    // for search
    }));
  }, [ctxProducts]);

  const products = useMemo(() => {
    let list = [...RAW];

    // Category filter
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    // Search in title/tags
    if (debouncedQ) {
      const needle = normalize(debouncedQ);
      list = list.filter((p) => {
        const hay = normalize([p.title, ...(p.tags || [])].join(" "));
        return hay.includes(needle);
      });
    }

    // Sorting
    switch (sort) {
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title, "fa"));
        break;
      case "title-desc":
        list.sort((a, b) => b.title.localeCompare(a.title, "fa"));
        break;
      default:
        // relevance
        if (debouncedQ) {
          list.sort((a, b) => {
            const A = Number(a.title.includes(debouncedQ));
            const B = Number(b.title.includes(debouncedQ));
            return B - A;
          });
        }
    }

    return list;
  }, [RAW, debouncedQ, category, sort]);

  return (
    <main className={styles.products}>
      <div className="container">
        {/* Simple breadcrumb */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Products</span>
        </nav>

        <header className={styles.head}>
          <h1>Products</h1>
          <p className="text-muted">Search, filter, and browse Robotsaz products.</p>
        </header>

        {/* Controls bar */}
        <section className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: gearbox, educational, 3D ..."
              aria-label="Search products"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className={styles.clear}
                aria-label="Clear"
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.pills}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`${styles.pill} ${
                    category === c.key ? styles.pillActive : ""
                  }`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className={styles.sort}>
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results */}
        {products.length ? (
          <section className={styles.results}>
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.empty}>
            <div className={styles.emptyCard}>
              <h3>No products found</h3>
              <p className="text-muted">
                Try a different keyword or adjust the filters.
              </p>
              <button
                onClick={() => {
                  setQ("");
                  setCategory("all");
                  setSort("relevance");
                }}
                className={styles.btnGhost}
              >
                Clear Filters
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/** Map badges → page categories */
function mapBadgesToCategory(badges = []) {
  const b = badges.map((x) => String(x).toLowerCase());
  if (b.some((t) => t.includes("industrial"))) return "industrial";
  if (b.some((t) => t.includes("3d"))) return "printed";
  if (b.some((t) => t.includes("education"))) return "education";
  return "industrial"; // sensible default (you can change to "printed"/"education" or "other")
}

/** Simple normalization for search */
function normalize(s = "") {
  return s
    .toLowerCase()
    .replace(/[‌\u200c]/g, " ") // zero-width non-joiner
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // Arabic→Latin digits
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) // Persian→Latin digits
    .trim();
}
