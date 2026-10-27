import { asset } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./IndiaCard.module.css";

type IndiaCardProps = {
  name: string;
  tagline: string;
  cta: string;
  image: string;
  alt: string;
  onClick: () => void;
};

/** Compact photo-and-text card for a destination outside Kerala. */
export function IndiaCard({
  name,
  tagline,
  cta,
  image,
  alt,
  onClick,
}: IndiaCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img src={asset(image)} alt={alt} loading="lazy" />
      <span>
        <small>{tagline}</small>
        <strong>{name}</strong>
        <span>
          {cta} <Icon name="arrow" />
        </span>
      </span>
    </button>
  );
}
