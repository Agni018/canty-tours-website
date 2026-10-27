import { cx } from "@/lib/utils";
import styles from "./Icon.module.css";

const paths = {
  // ↗ "go" arrow used on links and buttons
  arrow: "M5 11 11 5M6 5h5v5",
  // ↺ reset
  reset: "M3.6 8.6a4.5 4.5 0 1 0 1.3-4.1M4.6 2.4v2.4H7",
  // ✳ decorative spark
  spark: "M8 2.5v11M2.5 8h11M4.1 4.1l7.8 7.8M11.9 4.1l-7.8 7.8",
  check: "M3.5 8.5 6.5 11.5 12.5 4.5",
  chevronDown: "m4 6 4 4 4-4",
  chevronLeft: "m10 3-5 5 5 5",
  chevronRight: "m6 3 5 5-5 5",
  // ☰ menu
  menu: "M2.5 4.5h11M2.5 8h11M2.5 11.5h11",
};

type IconProps = { name: keyof typeof paths; className?: string };

/**
 * Small line icon drawn as SVG, so it looks the same in every font and on every device
 * (the brand fonts have no ↗ ↺ ✳ ✓ glyphs). Sized to the surrounding text; hidden from
 * screen readers because the text next to it already says what it does.
 */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={cx(styles.icon, styles[name], className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
