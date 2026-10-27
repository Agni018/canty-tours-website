import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cx } from "@/lib/utils";
import styles from "./Brand.module.css";

type BrandProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  logo?: boolean;
};

/** "Canty / TOURS & TRAVELS" wordmark link, optionally with the mountain logo. */
export function Brand({ logo, className, href, ...link }: BrandProps) {
  return (
    <Link href={href} className={cx(styles.brand, className)} {...link}>
      {logo && (
        <svg viewBox="0 0 42 42" aria-hidden="true">
          <circle
            cx="21"
            cy="21"
            r="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M9 28 20 12l4 7 4-5 7 14M14 24h18M19 29h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="29" cy="10" r="2" fill="currentColor" />
        </svg>
      )}
      <span>
        Canty<span className={styles.sub}>TOURS &amp; TRAVELS</span>
      </span>
    </Link>
  );
}
