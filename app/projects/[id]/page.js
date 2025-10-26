"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";
import ProjectCard from "../../components/ProjectCard";
import GalleryLightbox from "@/app/components/GalleryLightbox";
import { useData } from "@/app/context/DataContext";

const STATUS_LABELS = {
  delivered: "Delivered",
  "in-progress": "In Progress",
  prototype: "Prototype",
};

export default function ProjectDetailPage() {
  const { projects: ctxProjects } = useData();
  const params = useParams();
  const idStr = params?.id ?? "";
  const idNum = Number(idStr);

  // Find project by numericId
  const project =
    ctxProjects.find((p) => String(p.numericId) === String(idStr)) ||
    ctxProjects.find((p) => p.numericId === idNum);

  // Related projects (exclude current)
  const related = useMemo(() => {
    return (ctxProjects || [])
      .filter((p) => String(p.numericId) !== String(project?.numericId))
      .slice(0, 3)
      .map((p) => ({
        id: String(p.numericId),
        title: p.title,
        cover: p.gallery?.[0] || "/images/placeholder.jpg",
        year: p.year,
        status: p.status,
        summary: p.summary,
        href: `/projects/${p.numericId}`,
      }));
  }, [ctxProjects, project]);

  if (!project) {
    return (
      <main className={styles.project}>
        <div className="container">
          <nav className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span className={styles.sep}>/</span>
            <Link href="/projects">Projects</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>Not Found</span>
          </nav>

          <div className={styles.headRow}>
            <h1 className={styles.title}>Project Not Found</h1>
            <div className={styles.meta} />
          </div>

          <section className={styles.ctaSection}>
            <p className="text-muted">This project may have been removed or moved.</p>
            <Link href="/projects" className={styles.ctaBtn}>
              Back to Projects
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const specs = Array.isArray(project.specs) ? project.specs : [];
  const statusLabel = project.status ? STATUS_LABELS[project.status] : null;

  return (
    <main className={styles.project}>
      {/* Simple header */}
      <div className={styles.topbar}>
        <div className="container">
          <nav className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span className={styles.sep}>/</span>
            <Link href="/projects">Projects</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>{project.title}</span>
          </nav>

          <div className={styles.headRow}>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.meta}>
              {statusLabel && (
                <span className={`${styles.badge} ${styles[project.status]}`}>
                  {statusLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Gallery + Sidebar (year, tags, CTA) */}
        <section className={styles.mainGrid}>
          <GalleryLightbox images={gallery} />

          {(project.summary || project.year || tags.length) && (
            <aside className={styles.aside}>
              <div className={styles.box}>
                {project.summary && (
                  <>
                    <h3>Project Summary</h3>
                    <p className="text-muted">{project.summary}</p>
                    <div className={styles.hr} />
                  </>
                )}

                <div className={styles.metaCard}>
                  {project.year && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}>🗓️</span>
                      <div>
                        <div className={styles.metaLabel}>Year</div>
                        <div className={styles.metaValue}>{project.year}</div>
                      </div>
                    </div>
                  )}

                  {!!tags.length && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}>🏷️</span>
                      <div className={styles.tagsWrap}>
                        <div className={styles.metaLabel}>Tags</div>
                        <div className={styles.tags}>
                          {tags.map((t) => (
                            <span key={t} className={styles.tag}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <a href="/contact" className={styles.btnPrimary}>
                    Request Collaboration
                  </a>
                  <a href="/contact" className={styles.btnGhost}>
                    Have a question?
                  </a>
                </div>
              </div>
            </aside>
          )}
        </section>

        {/* Overview below gallery/sidebar */}
        {project.overview && (
          <section className={styles.overviewBox}>
            <h2>Project Description</h2>
            <p>{project.overview}</p>
          </section>
        )}

        {/* Technical specs (optional) */}
        {!!specs.length && (
          <section className={styles.specs}>
            <h2>Technical Specifications</h2>
            <div className={styles.table}>
              {specs.map(([k, v], idx) => (
                <div key={`${k}-${idx}`} className={styles.row}>
                  <div className={styles.k}>{k}</div>
                  <div className={styles.v}>{v}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related projects */}
        {!!related.length && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2>Related Projects</h2>
              <Link className={styles.moreLink} href="/projects">
                View All
              </Link>
            </div>
            <div className={styles.grid3}>
              {related.map((p) => (
                <ProjectCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className={styles.ctaSection}>
          <h2>Got an idea for the next project?</h2>
          <p className="text-muted">Custom design and precise execution at your side.</p>
          <a href="/contact" className={styles.ctaBtn}>
            Request Consultation
          </a>
        </section>
      </div>
    </main>
  );
}
