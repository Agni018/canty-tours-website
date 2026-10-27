import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Tour } from "@/data/tours";
import { durationText, highlightList, regionLabel } from "@/lib/journeys";
import { asset, cx, journeyPath } from "@/lib/utils";
import styles from "./TourCard.module.css";

type TourCardProps = {
  tour: Tour;
  /** Position in the grid; staggers the entrance animation. */
  index?: number;
  /** Briefly highlights the card after a destination search. */
  found?: boolean;
  /** The compare checkbox shows only when these are given (not in "more journeys" lists). */
  compared?: boolean;
  onCompareChange?: (on: boolean) => void;
};

/**
 * Journey card linking to the journey's page. The title link covers the whole card (one link
 * per card for keyboard and screen-reader users); the compare checkbox sits above it.
 */
export function TourCard({
  tour: t,
  index = 0,
  found,
  compared,
  onCompareChange,
}: TourCardProps) {
  return (
    <article
      id={`journey-${t.id}`}
      className={cx(styles.card, found && styles.found)}
      style={{ "--i": index } as CSSProperties}
      tabIndex={-1}
      aria-labelledby={`journey-title-${t.id}`}
    >
      <div className={styles.photo}>
        <img
          src={asset(t.image)}
          alt={t.alt}
          loading="lazy"
          draggable={false}
        />
        <span className={styles.tag}>{t.style}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          {`${durationText(t)}   ·   ${regionLabel(t)}`}
        </p>
        <h3 id={`journey-title-${t.id}`}>
          <Link href={journeyPath(t.id)} className={styles.link}>
            {t.name}
          </Link>
        </h3>
        <p className={styles.route}>{t.route}</p>
        <ul className={styles.highlights} aria-label="Highlights">
          {highlightList(t)
            .slice(0, 3)
            .map((h) => (
              <li key={h}>{h}</li>
            ))}
        </ul>
        <div className={styles.bottom}>
          <span className={styles.view} aria-hidden="true">
            View journey <Icon name="arrow" />
          </span>
          {onCompareChange && (
            <label className={styles.compare}>
              <input
                type="checkbox"
                checked={compared}
                onChange={(e) => onCompareChange(e.target.checked)}
              />{" "}
              Compare
            </label>
          )}
        </div>
      </div>
    </article>
  );
}
