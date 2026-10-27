"use client";

import { useEffect, useState } from "react";
import { TourCard } from "@/components/cards/TourCard";
import { useJourneys } from "@/components/JourneyProvider";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextButton } from "@/components/ui/TextButton";
import { whatsappLink } from "@/data/site";
import {
  destinationLabel,
  isKeralaView,
  journeysEyebrow,
  resultsSummary,
} from "@/lib/journeys";
import { cx } from "@/lib/utils";
import styles from "./Journeys.module.css";

/** Filterable journey grid with collection tabs, style chips and the compare checkboxes. */
export function Journeys() {
  const {
    places,
    travelStyles,
    filters,
    matches,
    applyFilters,
    showRegion,
    resetFilters,
    revealCount,
    compared,
    toggleCompare,
    planTrip,
  } = useJourneys();
  const keralaView = isKeralaView(filters.region);
  const place = filters.destination
    ? destinationLabel(places, filters.destination)
    : "";
  // A new key rebuilds the grid so the cards' entrance animation plays again.
  const gridKey = [...Object.values(filters), revealCount].join("|");
  const [highlightKey, setHighlightKey] = useState("");

  // After "Find my journey" or a destination card: scroll to the results and point them out.
  useEffect(() => {
    if (!revealCount) return;
    const found = matches.length > 0 && Boolean(filters.destination);
    const target = document.getElementById(
      !matches.length ? "no-results" : found ? "results-count" : "journeys",
    );
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusTarget = found
      ? document.getElementById(`journey-${matches[0].id}`)
      : target;
    focusTarget?.focus({ preventScroll: true });
    target?.scrollIntoView({
      block: "start",
      behavior: reduced ? "instant" : "smooth",
    });
    setHighlightKey(found ? gridKey : "");
    // Runs once per reveal request; the other values come from the same render.
  }, [revealCount]);

  return (
    <section
      id="journeys"
      className={cx(styles.section, "section")}
      tabIndex={-1}
      aria-labelledby="journey-title"
    >
      <div className="wrap">
        <SectionHeading
          eyebrow={journeysEyebrow(filters.region)}
          eyebrowId="journey-eyebrow"
          title={
            place ? (
              `${place} journey ideas`
            ) : (
              <>
                A few days.
                <br />A different rhythm.
              </>
            )
          }
          titleId="journey-title"
          intro={
            <>
              Short escapes, family time and a little romance.
              <br />
              Compare sample routes, then make one your own.
            </>
          }
        />
        <div
          className={styles.scope}
          role="group"
          aria-label="Choose journey collection"
        >
          <button
            type="button"
            className={cx(styles.scopeButton, keralaView && styles.active)}
            aria-pressed={keralaView}
            onClick={() => showRegion("Kerala")}
          >
            Kerala journeys
          </button>
          <button
            type="button"
            className={cx(styles.scopeButton, !keralaView && styles.active)}
            aria-pressed={!keralaView}
            onClick={() => showRegion("all")}
          >
            All India journeys <Icon name="arrow" />
          </button>
        </div>
        <div className={styles.filterRow}>
          <div
            className={styles.chips}
            role="group"
            aria-label="Filter journeys by style"
          >
            <Chip
              active={filters.style === "all"}
              onClick={() => applyFilters({ style: "all" })}
            >
              All styles
            </Chip>
            {travelStyles.map((s) => (
              <Chip
                key={s}
                active={filters.style === s}
                onClick={() => applyFilters({ style: s })}
              >
                {s}
              </Chip>
            ))}
          </div>
          <TextButton
            id="reset-filters"
            className={styles.reset}
            onClick={resetFilters}
          >
            Reset filters <Icon name="reset" />
          </TextButton>
        </div>
        <p id="results-count" className={styles.resultsCount} role="status">
          {resultsSummary(matches.length, filters, places)}
        </p>
        <div key={gridKey} className={cx(styles.grid, "reveal")} id="tour-grid">
          {matches.map((t, i) => (
            <TourCard
              key={t.id}
              tour={t}
              index={i}
              found={highlightKey === gridKey}
              compared={compared.includes(t.id)}
              onCompareChange={(on) => toggleCompare(t.id, on)}
            />
          ))}
        </div>
        <div
          id="no-results"
          className={styles.empty}
          tabIndex={-1}
          hidden={matches.length > 0}
        >
          <h3>
            {place
              ? `Let’s plan your ${place} escape.`
              : "Your next trip is still out there."}
          </h3>
          <p>
            {place
              ? "No sample journeys match these filters. Tell us your dates and we’ll help shape a route around your plans."
              : "Try a wider search, or ask us to create a route around your plans."}
          </p>
          <div className={styles.emptyActions}>
            {place && (
              <Button arrow onClick={() => planTrip(place)}>
                Plan a custom trip
              </Button>
            )}
            <Button
              id="clear-empty"
              variant={place ? "outline" : "dark"}
              onClick={resetFilters}
            >
              Show Kerala journeys
            </Button>
          </div>
        </div>
        <noscript>
          <p>
            To filter and compare journeys, please enable JavaScript. You can
            also{" "}
            <a href={whatsappLink()} target="_blank" rel="noopener">
              ask Canty Tours for a Kerala itinerary on WhatsApp
            </a>
            .
          </p>
        </noscript>
        <p className="fineprint">
          Every journey is a sample route, shaped around you. Prices are on
          request: hotels, activities and availability are confirmed in your
          personalised quotation. Flights are not assumed to be included.
        </p>
      </div>
    </section>
  );
}
