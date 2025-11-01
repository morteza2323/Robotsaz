import styles from "./page.module.scss";

export const metadata = {
  title: "Contact Us | Robotsaz",
  description: "Ways to get in touch with Robotsaz Green Industry Inc.",
};

const COMPANY = {
  name: "Robotsaz Green Industry Inc.",
  email: "reza@robotsaz.com",
  addressText: "777 Fort Street, Victoria, BC V8W 1G9, Canada",
  mapsQuery: "777 Fort Street, Victoria, BC V8W 1G9, Canada",
  youtube: "https://www.youtube.com/@robotsaz",
  linkedin: "https://www.linkedin.com/in/reza-abdolahi",
  website: "https://www.3drobotsaz.com",
};

function gmailComposeLink({ to, subject = "", body = "" }) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function ContactPage() {
  const gmailLink = gmailComposeLink({
    to: COMPANY.email,
    subject: "Inquiry from Robotsaz Website",
    body: "Hello,\n\nI would like to get in touch regarding...\n\nThanks,\n",
  });

  return (
    <main className={styles.contact}>
      <div className="container">
        <h1>Contact Robotsaz</h1>
        <p className={styles.lead}>
          For project coordination and collaborations, use one of the following
          channels.
        </p>

        <section className={styles.cardGrid}>
          {/* Company details */}
          <div className={styles.card}>
            <h2>Company Details</h2>
            <ul className={styles.list}>
              <li>
                <span className={styles.k}>Name:</span>
                <span className={styles.v}>{COMPANY.name}</span>
              </li>
              <li>
                <span className={styles.k}>Email:</span>
                <span className={styles.v}>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                  <span className={styles.sep}>·</span>
                  <a
                    href={gmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.action}
                    title="Compose with Gmail"
                  >
                    Send via Gmail
                  </a>
                </span>
              </li>

              <li>
                <span className={styles.k}>Address:</span>
                <span className={styles.v}>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      COMPANY.mapsQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {COMPANY.addressText}
                  </a>
                </span>
              </li>
              <li>
                <span className={styles.k}>Website:</span>
                <span className={styles.v}>
                  <a
                    href={COMPANY.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    3drobotsaz.com
                  </a>
                </span>
              </li>
              <li>
                <span className={styles.k}>Social:</span>
                <span className={styles.v}>
                  <a
                    href={COMPANY.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                  <span className={styles.sep}>·</span>
                  <a
                    href={COMPANY.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </span>
              </li>
              <li>
                <span className={styles.k}>Support Hours:</span>
                <span className={styles.v}>Mon–Fri, 9:00–17:00</span>
              </li>
            </ul>
          </div>

          {/* Quick help */}
          <div className={styles.card}>
            <h2>At a Glance</h2>
            <p className="text-muted">
              Best contact method: Email. For urgent matters, please call.
            </p>
            <div className={styles.actions}>
              <a
                href={gmailLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btn}
              >
                Send via Gmail
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  COMPANY.mapsQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnGhost}
              >
                Open in Maps
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
