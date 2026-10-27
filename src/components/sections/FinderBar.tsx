"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useJourneys } from "@/components/JourneyProvider";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  durationOptions,
  styleOptions,
  type DurationFilter,
  type StyleFilter,
} from "@/data/options";
import { cx } from "@/lib/utils";
import { DestinationPicker } from "./DestinationPicker";
import styles from "./FinderBar.module.css";

/**
 * "Where to / kind of escape / time" bar on the hero photo. Changes apply on submit.
 * While the visitor uses it, it moves to the top of the hero and the hero copy fades out of
 * sight (see Hero.module.css), so its lists open with room below them. It starts on a click
 * or a key other than Tab, not on focus alone, so tabbing through the page moves nothing.
 * A click, not a press: moving on the press would slide the field away from under the pointer
 * before the release, and the click that opens the list would be lost.
 */
export function FinderBar() {
  const { fields, setFields, findJourneys, travelStyles } = useJourneys();
  const form = useRef<HTMLFormElement>(null);
  // How far the finder moves up while in use; null when not in use.
  const [lift, setLift] = useState<number | null>(null);
  const active = lift !== null;

  function activate() {
    const el = form.current;
    if (active || !el) return;
    // offsetTop ignores transforms, so this is the distance from its resting place to the top
    // of the hero. If the page is already scrolled, it stops just under the fixed header.
    const hero = el.offsetParent as HTMLElement;
    const toHeroTop =
      el.offsetTop - parseFloat(getComputedStyle(hero).paddingTop);
    const headerBottom =
      document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const toHeader = el.getBoundingClientRect().top - headerBottom - 16;
    setLift(Math.max(0, Math.min(toHeroTop, toHeader)));
  }

  // While in use: a press outside the finder puts everything back.
  useEffect(() => {
    if (!active) return;
    const onPress = (e: PointerEvent) => {
      if (!form.current?.contains(e.target as Node)) setLift(null);
    };
    document.addEventListener("pointerdown", onPress);
    return () => document.removeEventListener("pointerdown", onPress);
  }, [active]);

  return (
    <form
      ref={form}
      id="finder"
      className={cx(styles.finder, "wrap")}
      aria-label="Find a journey"
      data-active={active || undefined}
      style={active ? ({ "--lift": `${lift}px` } as CSSProperties) : undefined}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // The first Escape closes an open list (it handles that itself); the next one exits.
          if (!form.current?.querySelector('[aria-expanded="true"]'))
            setLift(null);
        } else if (e.key !== "Tab" && e.key !== "Shift") activate();
      }}
      onBlur={(e) => {
        // Tabbing out puts everything back; a null target (focus briefly on the page) is ignored.
        if (e.relatedTarget && !form.current?.contains(e.relatedTarget))
          setLift(null);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setLift(null);
        findJourneys();
      }}
    >
      <DestinationPicker
        className={styles.field}
        labelClassName={styles.label}
      />
      <Dropdown
        id="finder-style"
        label="YOUR KIND OF ESCAPE"
        options={styleOptions(travelStyles)}
        value={fields.style}
        onChange={(style) => setFields({ style: style as StyleFilter })}
        className={styles.field}
        labelClassName={styles.label}
      />
      <Dropdown
        id="finder-duration"
        label="TIME TO GET AWAY"
        options={durationOptions}
        value={fields.duration}
        onChange={(duration) =>
          setFields({ duration: duration as DurationFilter })
        }
        className={styles.field}
        labelClassName={styles.label}
      />
      <Button
        type="submit"
        variant="orange"
        raised
        arrow
        className={styles.submit}
      >
        Find my journey
      </Button>
    </form>
  );
}
