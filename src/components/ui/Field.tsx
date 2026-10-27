import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import styles from "./Field.module.css";

type FieldProps = {
  label: ReactNode;
  full?: boolean;
  /** Id of the control, when it sits inside a custom wrapper instead of directly in the label. */
  htmlFor?: string;
  children: ReactNode;
};

/** Labelled form control (input or textarea) with the boxed form style. Dropdowns use Dropdown boxed. */
export function Field({ label, full, htmlFor, children }: FieldProps) {
  const className = cx(styles.field, full && styles.full);
  if (htmlFor) {
    return (
      <div className={className}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
      </div>
    );
  }
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  );
}
