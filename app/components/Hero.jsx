import Link from 'next/link';
import styles from './Hero.module.scss';

export default function Hero(){
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.texts}>
            <h1>Professional Robotics Design & 3D Printing</h1>
            <p className="text-muted">
              Precision mechanics, industrial robotics and rapid prototyping for educational and industrial applications.
            </p>
            <div className={styles.cta}>
              <Link href="/products" className="btn">View Products</Link>
              <Link href="/contact" className="btn-ghost">Request Collaboration</Link>
            </div>
          </div>
          <div className={styles.media}>
            <img src="/robotsaz.jpg" alt="Robotsaz" />
          </div>
        </div>
      </div>
    </section>
  );
}
