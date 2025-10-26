import Link from "next/link";
import styles from "./ProductCard.module.scss";

export default function ProductCard({ numericId, title, img, price, href }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img src={img} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {price && <p className={styles.price}>{price}</p>}
        <Link href={href || `/products/${numericId}`} className={styles.btn}>
          Product Details
        </Link>
      </div>
    </div>
  );
}
