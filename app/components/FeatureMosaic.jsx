import styles from "./FeatureMosaic.module.scss";

const features = [
  {
    id: 1,
    title: "Custom Robotics Design",
    desc: "From idea to build — precision robots tailored to your industrial needs.",
    icon: "🤖",
    badge: "Custom",
  },
  {
    id: 2,
    title: "Precision Mechanics",
    desc: "High-accuracy planetary gearboxes and special mechanisms.",
    icon: "⚙️",
    badge: "Precision",
  },
  {
    id: 3,
    title: "Green Technologies",
    desc: "Off-grid solar systems and energy-efficient solutions.",
    icon: "🌱",
    badge: "Green",
  },
  {
    id: 4,
    title: "Rapid Prototyping",
    desc: "Professional 3D printing for functional parts and fast validation.",
    icon: "🧩",
    badge: "3D Print",
  },
];

export default function FeatureMosaic() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <h2>Why Robotsaz?</h2>
          <p className="text-muted">
            A synergistic blend of robotic design, precision mechanics, and clean technology — from idea to industrial execution.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Card 1 */}
          <article className={`${styles.card} ${styles.cardA}`}>
            <span className={styles.num}>01</span>
            <div className={styles.icon}>{features[0].icon}</div>
            <div className={styles.badge}>{features[0].badge}</div>
            <h3>{features[0].title}</h3>
            <p>{features[0].desc}</p>
          </article>

          {/* Card 2 */}
          <article className={`${styles.card} ${styles.cardB}`}>
            <span className={styles.num}>02</span>
            <div className={styles.icon}>{features[1].icon}</div>
            <div className={styles.badge}>{features[1].badge}</div>
            <h3>{features[1].title}</h3>
            <p>{features[1].desc}</p>
          </article>

          {/* Card 3 */}
          <article className={`${styles.card} ${styles.cardC}`}>
            <span className={styles.num}>03</span>
            <div className={styles.icon}>{features[2].icon}</div>
            <div className={styles.badge}>{features[2].badge}</div>
            <h3>{features[2].title}</h3>
            <p>{features[2].desc}</p>
          </article>

          {/* Card 4 */}
          <article className={`${styles.card} ${styles.cardD}`}>
            <span className={styles.num}>04</span>
            <div className={styles.icon}>{features[3].icon}</div>
            <div className={styles.badge}>{features[3].badge}</div>
            <h3>{features[3].title}</h3>
            <p>{features[3].desc}</p>
          </article>
        </div>

        {/* Value Strip */}
        <div className={styles.valueStrip}>
          <div className={styles.pill}>Technical Documentation</div>
          <div className={styles.pill}>After-Delivery Support</div>
          <div className={styles.pill}>Manufacturing Cost Optimization</div>
          <div className={styles.pill}>Industrial Safety & Security</div>
        </div>
      </div>
    </section>
  );
}
