"use client";

import { DestinationCard } from "@/components/cards/DestinationCard";
import { useJourneys } from "@/components/JourneyProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { keralaHighlights, morePlaces } from "@/data/destinations";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./Destinations.module.css";

/** Kerala destination cards; each one filters the journey grid to that place. */
export function Destinations() {
  const { showDestination } = useJourneys();

  return (
    <section id="destinations" className="section wrap">
      <SectionHeading
        eyebrow="ONE KERALA. SO MANY WAYS TO FEEL IT."
        title={
          <>
            Follow the green.
            <br />
            Find your happy place.
          </>
        }
        intro={
          <>
            From mist on the tea hills to a slow bend in the river.
            <br />
            Choose a place to explore the journeys that take you there.
          </>
        }
      />
      <div className={cx(styles.grid, "reveal")}>
        {keralaHighlights.map((d) => (
          <DestinationCard
            key={d.destination}
            {...d}
            onClick={() => showDestination(d.destination)}
          />
        ))}
      </div>
      <div className={cx(styles.more, "reveal")}>
        <span>A little further into Kerala</span>
        {morePlaces.map((p) => (
          <button
            type="button"
            key={p.destination}
            onClick={() => showDestination(p.destination)}
          >
            {p.destination} <Icon name="arrow" />
            <small>{p.details}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
