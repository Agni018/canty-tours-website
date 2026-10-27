"use client";

import type { ReactNode } from "react";
import { useJourneys } from "@/components/JourneyProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Tour } from "@/data/tours";
import { durationText } from "@/lib/journeys";
import { journeyPath } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import styles from "./CompareDialog.module.css";

/** Side-by-side table of the selected journeys. */
export function CompareDialog() {
  const { tours, compared, compareOpen, setCompareOpen } = useJourneys();
  const items = tours.filter((t) => compared.includes(t.id));

  const rows: [string, (t: Tour) => ReactNode][] = [
    ["Duration", (t) => durationText(t)],
    ["Route", (t) => t.route],
    ["Travel style", (t) => t.style],
    ["Pace", (t) => t.pace],
    ["A good fit for", (t) => t.ideal],
    ["Highlights", (t) => t.highlights],
    [
      "Next step",
      (t) => (
        // Closing first, so the comparison isn't still open on coming back.
        <Button
          href={`${journeyPath(t.id)}#enquire`}
          className={styles.planButton}
          onClick={() => setCompareOpen(false)}
        >
          Plan this journey <Icon name="arrow" />
        </Button>
      ),
    ],
  ];

  return (
    <Modal
      id="compare-dialog"
      size="wide"
      open={compareOpen}
      onClose={() => setCompareOpen(false)}
      labelledBy="compare-title"
      closeLabel="Close comparison"
    >
      <p className="eyebrow">FIND YOUR KIND OF JOURNEY</p>
      <h2 id="compare-title">A little side by side.</h2>
      <div id="compare-content">
        {compareOpen && (
          <>
            <div
              className={styles.scroll}
              tabIndex={0}
              aria-label="Journey comparison table; scroll horizontally on smaller screens"
            >
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Your journey</th>
                    {items.map((t) => (
                      <th scope="col" key={t.id}>
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {items.map((t) => (
                        <td key={t.id}>{value(t)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fineprint">
              Sample routes, not confirmed packages. Prices are on request; your
              final itinerary and inclusions will be agreed in writing.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
