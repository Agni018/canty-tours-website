"use client";

import {
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import { cx } from "@/lib/utils";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  /** Called after the dialog closes (close button, Escape, backdrop click or code). */
  onClose: () => void;
  /** Id of the heading that names the dialog. */
  labelledBy: string;
  closeLabel: string;
  /** wide for tables, narrow for short forms; default fits reading content. */
  size?: "narrow" | "wide";
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Native <dialog> shown as a modal, closed by its × button, Escape or a click on the backdrop. */
export function Modal({
  open,
  onClose,
  labelledBy,
  closeLabel,
  size,
  onKeyDown,
  id,
  className,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      className={cx(styles.modal, size && styles[size], className)}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // A click on the dialog element itself outside its box is a click on the backdrop.
        // The second click of a double-click lands on the backdrop of a dialog the first click
        // opened, so it is ignored.
        const dialog = e.currentTarget;
        if (e.target !== dialog || e.detail > 1) return;
        const r = dialog.getBoundingClientRect();
        const outside =
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom;
        if (outside) dialog.close();
      }}
    >
      <button
        type="button"
        className={styles.close}
        aria-label={closeLabel}
        onClick={() => ref.current?.close()}
      >
        ×
      </button>
      {children}
    </dialog>
  );
}
