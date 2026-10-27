"use client";

import { IndiaCard } from "@/components/cards/IndiaCard";
import { useJourneys } from "@/components/JourneyProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextButton } from "@/components/ui/TextButton";
import { indiaHighlights, indiaLinks } from "@/data/destinations";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./BeyondKerala.module.css";

/** Destinations outside Kerala; each one filters the journey grid. */
export function BeyondKerala() {
  const { showDestination, showRegion } = useJourneys();

  return (
    <section id="beyond-kerala" className={cx(styles.section, "section")}>
      <div className="wrap">
        <SectionHeading
          eyebrow="KERALA AT HEART. INDIA ON THE HORIZON."
          title="There’s a whole India beyond."
          intro={
            <>
              Another landscape, another story.
              <br />
              Our journey ideas reach further, too.
            </>
          }
        />
        <div className={cx(styles.grid, "reveal")}>
          {indiaHighlights.map((d) => (
            <IndiaCard
              key={d.destination}
              name={d.destination}
              {...d}
              onClick={() => showDestination(d.destination)}
            />
          ))}
        </div>
        <div className={cx(styles.links, "reveal")}>
          <span>Keep exploring</span>
          {indiaLinks.map((l) => (
            <TextButton
              key={l.destination}
              onClick={() => showDestination(l.destination)}
            >
              {l.label} <Icon name="arrow" />
            </TextButton>
          ))}
          <TextButton onClick={() => showRegion("all")}>
            View all India journeys <Icon name="arrow" />
          </TextButton>
        </div>
      </div>
    </section>
  );
}
