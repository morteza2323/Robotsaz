'use client'
import { useParams } from 'next/navigation'

import Link from "next/link";
import styles from "./page.module.scss";
import ProductCard from "../../components/ProductCard";
import GalleryLightbox from "@/app/components/GalleryLightbox";
import { useData } from "@/app/context/DataContext";

export default function ProductDetailPage() {
  const { products: ctxProducts } = useData();

  // id as numericId from route
  const params = useParams();
  const idNum = Number(params?.id ?? 0);

  // find product from context
  const product =
    ctxProducts.find((p) => String(p.numericId) === String(idNum)) ||
    ctxProducts.find((p) => p.numericId === idNum);

  // not found
  if (!product) {
    return (
      <main className={styles.product}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
            <Link href="/">Home</Link>
            <span className={styles.sep}>/</span>
            <Link href="/products">Products</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>Unknown</span>
          </nav>

          <div className={styles.head}>
            <h1 className={styles.title}>Product Not Found</h1>
            <p className="text-muted">
              This product may have been removed or moved.
            </p>
            <Link href="/products" className={styles.btnGhost}>
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // safe fallbacks
  const title = product.title || "—";
  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const short = product.short || "";
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const highlights = Array.isArray(product.highlights)
    ? product.highlights
    : [];

  // related products (exclude current)
  const related = ctxProducts
    .filter((p) => String(p.numericId) !== String(product.numericId))
    .slice(0, 3)
    .map((p) => ({
      id: String(p.numericId),
      title: p.title,
      img: p.gallery?.[0] || "/images/placeholder.jpg",
      href: `/products/${p.numericId}`,
    }));

  return (
    <main className={styles.product}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
          <Link href="/">Home</Link>
          <span className={styles.sep}>/</span>
          <Link href="/products">Products</Link>
          <span className={styles.sep}>/</span>
          <span className={styles.current}>{title}</span>
        </nav>

        <div className={styles.head}>
          <h1 className={styles.title}>{title}</h1>

          {!!badges.length && (
            <div className={styles.badges}>
              {badges.map((b) => (
                <span key={b} className={styles.badge}>
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body: gallery + sticky aside */}
        <section className={styles.mainGrid}>
          {/* Gallery */}
          <GalleryLightbox images={gallery} />

          {/* Sticky aside: CTAs */}
          <aside className={styles.aside}>
            <div className={styles.stickyBox}>
              {short && <p className={styles.short}>{short}</p>}

              <div className={styles.actions}>
                <Link href="/contact" className={styles.btnPrimary}>
                  Request Quote
                </Link>
                <Link href="/contact" className={styles.btnGhost}>
                  Have a question?
                </Link>
              </div>

              {!!highlights.length && (
                <section className={styles.highlights}>
                  {highlights.map((h, i) => (
                    <div key={i} className={styles.hItem}>
                      <span className={styles.tick}>✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </aside>
        </section>

        {/* Technical specs */}
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

        {/* FAQ (static sample) */}
        <section className={styles.faq}>
          <h2>FAQ</h2>
          <details className={styles.q}>
            <summary>What is the delivery time?</summary>
            <p>Depending on quantity and customization: 7–20 business days.</p>
          </details>
          <details className={styles.q}>
            <summary>Can the gear ratio/input be customized?</summary>
            <p>Yes, ratios and input flanges can be configured per order.</p>
          </details>
          <details className={styles.q}>
            <summary>How are warranty and support handled?</summary>
            <p>6-month build warranty + post-delivery technical support.</p>
          </details>
        </section>

        {/* Related products */}
        {!!related.length && (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2>Related Products</h2>
              <Link className={styles.moreLink} href="/products">
                View All
              </Link>
            </div>
            <div className={styles.grid3}>
              {related.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
