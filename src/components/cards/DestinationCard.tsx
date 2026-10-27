import { asset } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./DestinationCard.module.css";

type DestinationCardProps = {
  name: string;
  tagline: string;
  details: string;
  image: string;
  alt: string;
  onClick: () => void;
};

/** Large photo card for a Kerala destination. The first card in a grid spans wider on mobile. */
export function DestinationCard({
  name,
  tagline,
  details,
  image,
  alt,
  onClick,
}: DestinationCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img src={asset(image)} alt={alt} loading="lazy" />
      <span className={styles.top}>{tagline}</span>
      <span className={styles.bottom}>
        <span>
          {name}
          <small>{details}</small>
        </span>
        <span className={styles.arrow}>
          <Icon name="arrow" />
        </span>
      </span>
    </button>
  );
}
