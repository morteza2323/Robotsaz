import styles from "./page.module.scss";

export const metadata = {
  title: "About Us | Robotsaz",
  description:
    "Get to know Robotsaz Green Industry Inc. and our mission in robotics, precision mechanics, and green technologies.",
};

export default function AboutPage() {
  return (
    <main className={styles.about}>
      <div className="container">
        {/* Title & Lead */}
        <h1>About Robotsaz</h1>
        <div className={styles.leadWrapper} >
          <p className={styles.lead}>
            We build real-world solutions in{" "}
            <span className={styles.mark}>
              robotics and precision mechanics
            </span>{" "}
            and
            <span className={styles.mark}> green technologies</span> — from
            design to manufacturing and support.
          </p>
        </div>

        {/* KPIs */}
        <div className={styles.kpis}>
          <div className={styles.item}>
            <div className={styles.num}>30+ years</div>
            <div className={styles.label}>Experience</div>
          </div>
          <div className={styles.item}>
            <div className={styles.num}>10+</div>
            <div className={styles.label}>Industrial Projects</div>
          </div>
          <div className={styles.item}>
            <div className={styles.num}>4+</div>
            <div className={styles.label}>Flagship Products</div>
          </div>
          <div className={styles.item}>
            <div className={styles.num}>2019</div>
            <div className={styles.label}>Founded (Canada)</div>
          </div>
        </div>

        {/* Intro paragraphs */}
        <p>
          <strong>Robotsaz Green Industry Inc.</strong> was incorporated in 2019
          in Victoria, British Columbia. The company was founded by{" "}
          <strong>Engineer Mohamad Reza Abdolahi Pourarki</strong>, with over 30
          years of experience in designing and building mechanical and robotic
          systems.
        </p>
        <p>
          Our activities include industrial and educational robots, precision
          gearboxes, custom CNC machines, and off-grid solar power systems. A
          notable example is the <strong>Robotic Bar Screen (RBS)</strong> for
          automated wastewater screen cleaning.
        </p>

        {/* Highlights */}
        <div className={styles.highlights}>
          <div className={styles.card}>
            <div className={styles.title}>
              <span className={styles.icon}>🤖</span>Custom Robotics Design
            </div>
            <div className={styles.desc}>
              From concept to build, tailored to your industrial needs.
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.title}>
              <span className={styles.icon}>⚙️</span>Precision Mechanics
            </div>
            <div className={styles.desc}>
              High-accuracy planetary gearboxes and special mechanisms.
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.title}>
              <span className={styles.icon}>🌱</span>Green Technologies
            </div>
            <div className={styles.desc}>
              Off-grid solutions and energy optimization.
            </div>
          </div>
        </div>

        {/* Short Timeline */}
        <h2>Brief Timeline</h2>
        <div className={styles.timeline}>
          <div className={styles.row}>
            <span className={styles.year}>2019</span>
            <span className={styles.text}>
              Robotsaz incorporated in Victoria, Canada
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.year}>2021</span>
            <span className={styles.text}>
              Prototyping precision gearboxes and mechanisms
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.year}>2022</span>
            <span className={styles.text}>RBS — industrial release</span>
          </div>
          <div className={styles.row}>
            <span className={styles.year}>2024</span>
            <span className={styles.text}>
              MoltenMover and off-grid systems expansion
            </span>
          </div>
        </div>

        {/* Management Team */}
        <h2>Management Team</h2>
        <div className={styles.team}>
          <div className={styles.member}>
            <img src="/person.jpg" alt="Mohamad Reza Abdolahi Pourarki" />
            <h3>Mohamad Reza Abdolahi Pourarki</h3>
            <p className="text-muted">
              Founder & CEO — Lead Mechanical Systems Designer
            </p>
          </div>
          <div className={styles.member}>
            <img src="/person.jpg" alt="Ahmadreza Abdolahi Pourarki" />
            <h3>Ahmadreza Abdolahi Pourarki</h3>
            <p className="text-muted">
              Head of Engineering & Wastewater Network Analysis
            </p>
          </div>
        </div>

        {/* Callout */}
        <div className={styles.callout}>
          <p>“We make the complexities of robotics simple and reliable.”</p>
          <div className={styles.sub}>— Robotsaz Green Industry Inc.</div>
        </div>
      </div>

      {/* Soft Final CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Ready to launch your project?</h2>
          <div className={styles.ctaText}>
            <p className="text-muted">
              Custom design, precision manufacturing, and full support — let’s
              start today.
            </p>
            <a href="/contact" className={styles.ctaBtn}>
              Request Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
