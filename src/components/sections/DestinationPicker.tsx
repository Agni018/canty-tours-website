"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useJourneys } from "@/components/JourneyProvider";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { regionOptions, type RegionFilter } from "@/data/options";
import { placeValue, type Place } from "@/data/places";
import { destinationLabel } from "@/lib/journeys";
import { asset, cx } from "@/lib/utils";
import styles from "./DestinationPicker.module.css";

type DestinationPickerProps = {
  /** Column styles from the finders. */
  className?: string;
  labelClassName?: string;
};

const regionChoiceLabel = (value: string) => {
  if (value === "Kerala") return "All Kerala";
  const option = regionOptions.find(
    (o) => typeof o !== "string" && o.value === value,
  );
  return typeof option === "object" ? option.label : value;
};

/**
 * "Where to?" field of the finder: a button that opens a grid of destination photos plus the
 * regions. Choosing updates the finder; the grid changes when the finder is submitted.
 * Keyboard: ↓ on the button opens it, arrow keys/Home/End move through the photos, Escape closes.
 */
export function DestinationPicker({
  className,
  labelClassName,
}: DestinationPickerProps) {
  const { fields, setFields, places } = useJourneys();
  const [open, setOpen] = useState(false);
  const focusChoiceOnOpen = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const options = useRef<HTMLDivElement>(null);

  const place = places.find((p) => placeValue(p) === fields.destination);
  const label = fields.destination
    ? destinationLabel(places, fields.destination)
    : (
        regionOptions.find(
          (o) => typeof o !== "string" && o.value === fields.region,
        ) as { label: string } | undefined
      )?.label;

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) toggle.current?.focus({ preventScroll: true });
  }

  function openPanel(focusChoice = false) {
    focusChoiceOnOpen.current = focusChoice;
    setOpen(true);
  }

  // While open: keep the panel within the viewport, and close on Escape or an outside click.
  useEffect(() => {
    if (!open) return;
    const fit = () => {
      const el = panel.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      el.style.setProperty(
        "--picker-height",
        `${Math.max(80, window.innerHeight - top - 16)}px`,
      );
    };
    // The finder may still be moving up (see FinderBar): measure once it has come to rest.
    let closed = false;
    const finder = panel.current?.offsetParent as HTMLElement | null;
    Promise.allSettled(
      finder?.getAnimations().map((a) => a.finished) ?? [],
    ).then(() => {
      if (closed || !panel.current) return;
      if (
        window.innerHeight - panel.current.getBoundingClientRect().top <
        320
      ) {
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        finder?.scrollIntoView({
          block: "start",
          behavior: reduced ? "instant" : "smooth",
        });
      }
      fit();
    });
    if (focusChoiceOnOpen.current) {
      const chosen =
        options.current?.querySelector<HTMLButtonElement>(
          '[aria-pressed="true"]',
        ) ?? options.current?.querySelector<HTMLButtonElement>("button");
      chosen?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", fit);
    window.addEventListener("scroll", fit, { passive: true });
    return () => {
      closed = true;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", fit);
      window.removeEventListener("scroll", fit);
    };
  }, [open]);

  function choosePlace(p: Place) {
    setFields({ destination: placeValue(p), region: p.region ?? "Kerala" });
    close(true);
  }

  function chooseRegion(region: RegionFilter) {
    setFields({ destination: "", region });
    close(true);
  }

  // Arrow keys move through the photo grid row by row; the column count comes from the CSS.
  function moveFocus(e: ReactKeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 0,
      ArrowUp: 0,
    };
    if (!(e.key in steps) && e.key !== "Home" && e.key !== "End") return;
    const buttons = Array.from(e.currentTarget.querySelectorAll("button"));
    const current = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (current < 0) return;
    e.preventDefault();
    const columns = getComputedStyle(e.currentTarget).gridTemplateColumns.split(
      " ",
    ).length;
    const step =
      e.key === "ArrowDown"
        ? columns
        : e.key === "ArrowUp"
          ? -columns
          : steps[e.key];
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? buttons.length - 1
          : Math.max(0, Math.min(buttons.length - 1, current + step));
    buttons[next].focus();
  }

  return (
    <div
      ref={root}
      className={className}
      onBlur={(e) => {
        // Close when focus moves outside; a null target (focus briefly on the page) is ignored.
        if (e.relatedTarget && !root.current?.contains(e.relatedTarget))
          close();
      }}
    >
      <label
        id="where-label"
        htmlFor="destination-toggle"
        className={labelClassName}
      >
        WHERE TO?
      </label>
      <button
        ref={toggle}
        id="destination-toggle"
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="destination-panel"
        aria-labelledby="where-label destination-label"
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openPanel(true);
          }
        }}
      >
        {place && (
          <img
            className={styles.thumb}
            src={asset(place.thumb)}
            alt=""
            width={24}
            height={24}
            draggable={false}
          />
        )}
        <span id="destination-label">{label}</span>
        <Icon name="chevronDown" className={styles.chevron} />
      </button>
      <div
        ref={panel}
        id="destination-panel"
        className={styles.panel}
        role="region"
        aria-labelledby="destination-panel-title"
        hidden={!open}
      >
        <div className={styles.heading}>
          <div>
            <p className={cx("eyebrow", styles.eyebrow)}>
              KERALA &amp; A LITTLE BEYOND
            </p>
            <h3 id="destination-panel-title">Find your happy place.</h3>
            <p>Choose a view. We’ll help you get there.</p>
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Close destination choices"
            onClick={() => close(true)}
          >
            ×
          </button>
        </div>
        <div
          ref={options}
          className={styles.options}
          role="group"
          aria-label="Places to explore"
          onKeyDown={moveFocus}
        >
          {places.map((p) => (
            <button
              key={p.name}
              type="button"
              className={styles.choice}
              aria-pressed={placeValue(p) === fields.destination}
              onClick={() => choosePlace(p)}
            >
              <span className={styles.photo}>
                <img
                  src={asset(p.thumb)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                  draggable={false}
                />
                <span className={styles.check}>
                  <Icon name="check" />
                </span>
              </span>
              <span className={styles.name}>{p.tileName ?? p.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.regions}>
          <span>Or explore a little wider</span>
          <div role="group" aria-label="Journey regions">
            {regionOptions.map((o) => {
              const value = (
                typeof o === "string" ? o : o.value
              ) as RegionFilter;
              return (
                <Chip
                  key={value}
                  active={!fields.destination && fields.region === value}
                  onClick={() => chooseRegion(value)}
                >
                  {regionChoiceLabel(value)}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
