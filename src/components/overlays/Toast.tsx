"use client";

import { useJourneys } from "@/components/JourneyProvider";
import { cx } from "@/lib/utils";
import styles from "./Toast.module.css";

/** Short status message near the bottom of the screen (see notify() in JourneyProvider). */
export function Toast() {
  const { toast } = useJourneys();
  return (
    <div
      id="toast"
      className={cx(styles.toast, toast.visible && styles.visible)}
      role="status"
    >
      {toast.message}
    </div>
  );
}
