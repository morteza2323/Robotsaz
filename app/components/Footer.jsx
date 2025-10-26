import styles from "./Footer.module.scss";

export const COMPANY = {
  email: "reza.abdolahi@gmail.com",
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

export default function Footer() {
  const gmailLink = gmailComposeLink({
    to: COMPANY.email,
    subject: "Contact from Robotsaz Website",
    body: "Hello,\n\nI want to contact you regarding...",
  });
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <h3>Robotsaz</h3>
            <p className="text-muted">Robotsaz Green Industry Inc.</p>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Quick Access</h4>
            <ul className={styles.list}>
              <li>
                <a className={styles.link} href="/products">
                  Products
                </a>
              </li>
              <li>
                <a className={styles.link} href="/projects">
                  Projects
                </a>
              </li>
              <li>
                <a className={styles.link} href="/contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Contact</h4>
            <ul className={styles.list}>
              <li>
                <a
                  className={styles.link}
                  href={gmailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  reza.abdolahi@gmail.com
                </a>
              </li>
              <li>777 Fort St, Victoria BC</li>
            </ul>
          </div>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} Robotsaz – All rights reserved.
        </div>
      </div>
    </footer>
  );
}
