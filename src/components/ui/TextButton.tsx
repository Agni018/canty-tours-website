import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils";
import styles from "./TextButton.module.css";

/** Low-emphasis button that looks like a text link. */
export function TextButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cx(styles.textButton, className)}
      {...props}
    />
  );
}
