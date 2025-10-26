"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import FeatureMosaic from "./components/FeatureMosaic";
import { useData } from "./context/DataContext";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  const { products, projects } = useData();

  const randomProducts = useMemo(() => {
    if (!products?.length) return [];
    return [...products].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [products]);

  const randomProjects = useMemo(() => {
    if (!projects?.length) return [];
    return [...projects].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [projects]);

  return (
    <main className={styles.home}>
      {/* ✅ Hero */}
      <Hero />

      {/* ✅ Feature Section */}
      <FeatureMosaic />

      {/* ✅ KPI Section */}
      <section className={styles.kpiSection}>
        <div className="container">
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <span className={styles.num}>30+</span>
              <span className={styles.label}>Years of Experience</span>
            </div>
            <div className={styles.kpi}>
              <span className={styles.num}>6+</span>
              <span className={styles.label}>Industrial Projects</span>
            </div>
            <div className={styles.kpi}>
              <span className={styles.num}>8+</span>
              <span className={styles.label}>Featured Products</span>
            </div>
            <div className={styles.kpi}>
              <span className={styles.num}>2019</span>
              <span className={styles.label}>Established Year</span>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Random Products */}
      {randomProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.headerRow}>
              <h2>Featured Products</h2>
              <Link className={styles.moreLink} href="/products">
                View All
              </Link>
            </div>

            <div className={styles.grid3}>
              {randomProducts.map((p) => (
                <ProductCard key={p.numericId} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ Random Projects */}
      {randomProjects.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <h2 className={styles.center}>Projects</h2>

            <div className={styles.projects}>
              {randomProjects.map((pr) => (
                <ProjectCard key={pr.numericId} {...pr} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Ready to Start?</h2>
          <p className="text-muted">Custom design, precision manufacturing, full support.</p>
          <Link href="/contact" className={styles.ctaBtn}>
            Request Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
