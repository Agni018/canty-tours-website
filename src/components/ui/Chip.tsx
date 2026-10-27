import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils";
import styles from "./Chip.module.css";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean };

/** Pill-shaped toggle used for filters. */
export function Chip({
  active,
  className,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={cx(styles.chip, active && styles.active, className)}
      aria-pressed={active}
      {...props}
    />
  );
}
