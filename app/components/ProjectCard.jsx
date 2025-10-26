"use client";
import Link from "next/link";
import styles from "./ProjectCard.module.scss";

export default function ProjectCard(props) {
  const {
    href,
    numericId,
    id,
    title,
    cover,
    gallery,
    summary,
    tags,
  } = props;

  // آیدی صحیح
  const pid = numericId ?? id;
  const link = href ?? (pid ? `/projects/${pid}` : "#");

  // انتخاب تصویر کاور
  const imgSrc = cover || (gallery?.[0]) || "/no-image.png";

  return (
    <div className={styles.card}>
      <div className={styles.imgBox}>
        <img src={imgSrc} alt={title || "project"} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {summary && <p className={styles.summary}>{summary}</p>}

        {!!tags?.length && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <Link href={link} className={styles.moreLink}> Project Details</Link>
      </div>
    </div>
  );
}
