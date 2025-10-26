"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import ProjectCard from "../components/ProjectCard";
import { useData } from "@/app/context/DataContext"; // ⬅️ data from context

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "industrial", label: "Industrial" },
  { key: "energy", label: "Energy" },
  { key: "cnc", label: "CNC" },
  { key: "research", label: "Research" },
];

const STATUSES = [
  { key: "all", label: "All Statuses" },
  { key: "delivered", label: "Delivered" },
  { key: "in-progress", label: "In Progress" },
  { key: "prototype", label: "Prototype" },
];

const SORTS = [
  { key: "year-desc", label: "Newest" },
  { key: "year-asc", label: "Oldest" },
  { key: "title-asc", label: "Title (A→Z)" },
  { key: "title-desc", label: "Title (Z→A)" },
];

export default function ProjectsPage() {
  const { projects: ctxProjects } = useData(); // ⬅️
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("year-desc");
  const [debouncedQ, setDebouncedQ] = useState(q);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // Map real data → current card structure
  const RAW = useMemo(() => {
    return (ctxProjects || []).map((p) => ({
      id: String(p.numericId), // for key and href
      title: p.title,
      cover: p.gallery?.[0] || "/images/placeholder.jpg", // cover
      year: p.year || 0,
      status: p.status || "delivered",
      category: mapTagsToCategory(p.tags), // category from tags
      tags: Array.isArray(p.tags) ? p.tags : [],
      summary: p.summary || "",
      href: `/projects/${p.numericId}`, // detail link
    }));
  }, [ctxProjects]);

  const projects = useMemo(() => {
    let list = [...RAW];

    if (category !== "all") list = list.filter((p) => p.category === category);
    if (status !== "all") list = list.filter((p) => p.status === status);

    if (debouncedQ) {
      const needle = normalize(debouncedQ);
      list = list.filter((p) => {
        const hay = normalize(
          [p.title, p.summary, ...(p.tags || [])].join(" ")
        );
        return hay.includes(needle);
      });
    }

    switch (sort) {
      case "year-asc":
        list.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "title-asc":
        list.sort((a, b) => a.title.localeCompare(b.title, "fa"));
        break;
      case "title-desc":
        list.sort((a, b) => b.title.localeCompare(a.title, "fa"));
        break;
      default:
        // year-desc
        list.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return list;
  }, [RAW, debouncedQ, category, status, sort]);

  return (
    <main className={styles.projects}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>Projects</span>
        </nav>

        <header className={styles.head}>
          <h1>Projects</h1>
          <p className="text-muted">
            Real-world samples of robotic design, precision mechanics, and clean
            energy.
          </p>
        </header>

        {/* Search/Filter controls */}
        <section className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: RBS, Solar, CNC ..."
              aria-label="Search projects"
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

            <div className={styles.selects}>
              <label>
                Status:
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sort:
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {/* Results */}
        {projects.length ? (
          <section className={styles.results}>
            <div className={styles.grid}>
              {projects.map((p) => (
                <ProjectCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        ) : (
          <section className={styles.empty}>
            <div className={styles.emptyCard}>
              <h3>No projects found</h3>
              <p className="text-muted">
                Try another keyword or adjust the filters.
              </p>
              <button
                className={styles.btnGhost}
                onClick={() => {
                  setQ("");
                  setCategory("all");
                  setStatus("all");
                  setSort("year-desc");
                }}
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

/* Map tags → categories */
function mapTagsToCategory(tags = []) {
  const t = tags.map((x) => String(x).toLowerCase());
  if (
    t.some(
      (s) =>
        s.includes("خورشیدی") || s.includes("solar") || s.includes("energy")
    )
  )
    return "energy";
  if (t.some((s) => s.includes("cnc"))) return "cnc";
  if (
    t.some(
      (s) => s.includes("پژوهش") || s.includes("research") || s.includes("r&d")
    )
  )
    return "research";
  return "industrial"; // sensible default
}

/* Simple normalization for search */
function normalize(s = "") {
  return s
    .toLowerCase()
    .replace(/[‌\u200c]/g, " ") // zero-width non-joiner
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // Arabic→Latin digits
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) // Persian→Latin digits
    .trim();
}
