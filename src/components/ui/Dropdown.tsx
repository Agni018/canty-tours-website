"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { SelectOption } from "@/data/options";
import { cx } from "@/lib/utils";
import { Icon } from "./Icon";
import styles from "./Dropdown.module.css";

type DropdownProps = {
  /** Prefix for the element ids (label, button, list). */
  id: string;
  label: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Bordered like a form input, with a form label: for use inside forms. */
  boxed?: boolean;
  /** Column styles from the parent, as with DestinationPicker. */
  className?: string;
  labelClassName?: string;
};

const valueOf = (o: SelectOption) => (typeof o === "string" ? o : o.value);
const labelOf = (o: SelectOption) => (typeof o === "string" ? o : o.label);

/**
 * Custom select: a labelled button that opens a styled list instead of the platform dropdown,
 * using the same disclosure pattern as the "Where to?" picker. Keyboard: ↓/↑ on the button opens
 * it on the chosen option, ↓/↑/Home/End move, Enter or Space picks, Escape closes; Tab away or a
 * press outside closes it too.
 */
export function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  boxed,
  className,
  labelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const focusChosenOnOpen = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const chosen = options.find((o) => valueOf(o) === value) ?? options[0];

  function focusChosen() {
    list.current
      ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?.focus();
  }

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) toggle.current?.focus({ preventScroll: true });
  }

  // While open: move to the chosen option if opened from the keyboard; close on a press outside.
  useEffect(() => {
    if (!open) return;
    if (focusChosenOnOpen.current) focusChosen();
    const onPress = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPress);
    return () => document.removeEventListener("pointerdown", onPress);
  }, [open]);

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
      return;
    }
    const buttons = Array.from(list.current?.querySelectorAll("button") ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) {
      // On the toggle: ↓/↑ opens the list on the chosen option.
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      if (open) focusChosen();
      else {
        focusChosenOnOpen.current = true;
        setOpen(true);
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: buttons.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    buttons[Math.max(0, Math.min(buttons.length - 1, moves[e.key]))].focus();
  }

  return (
    <div
      ref={root}
      className={cx(styles.dropdown, boxed && styles.boxed, className)}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        // Close when focus moves elsewhere; a null target (focus briefly on the page) is ignored.
        if (e.relatedTarget && !root.current?.contains(e.relatedTarget))
          setOpen(false);
      }}
    >
      <label
        id={`${id}-label`}
        htmlFor={`${id}-toggle`}
        className={labelClassName ?? (boxed ? styles.formLabel : undefined)}
      >
        {label}
      </label>
      <button
        ref={toggle}
        id={`${id}-toggle`}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => {
          focusChosenOnOpen.current = false;
          setOpen((o) => !o);
        }}
      >
        <span id={`${id}-value`}>{labelOf(chosen)}</span>
        <Icon name="chevronDown" className={styles.chevron} />
      </button>
      <div
        ref={list}
        id={`${id}-list`}
        className={styles.list}
        role="group"
        aria-labelledby={`${id}-label`}
        hidden={!open}
      >
        {options.map((o) => (
          <button
            key={valueOf(o)}
            type="button"
            className={styles.option}
            aria-pressed={valueOf(o) === value}
            onClick={() => {
              onChange(valueOf(o));
              close(true);
            }}
          >
            {labelOf(o)}
            <Icon name="check" className={styles.check} />
          </button>
        ))}
      </div>
    </div>
  );
}
