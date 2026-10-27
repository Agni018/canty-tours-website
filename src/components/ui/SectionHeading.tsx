import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  eyebrow: string;
  eyebrowId?: string;
  title: ReactNode;
  titleId?: string;
  intro: ReactNode;
};

/** Section title block: eyebrow and heading on the left, short intro on the right. */
export function SectionHeading({
  eyebrow,
  eyebrowId,
  title,
  titleId,
  intro,
}: SectionHeadingProps) {
  return (
    <div className={cx(styles.heading, "reveal")}>
      <div>
        <p className="eyebrow" id={eyebrowId}>
          {eyebrow}
        </p>
        <h2 id={titleId}>{title}</h2>
      </div>
      <p>{intro}</p>
    </div>
  );
}
