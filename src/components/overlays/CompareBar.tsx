"use client";

import { useJourneys } from "@/components/JourneyProvider";
import { Button } from "@/components/ui/Button";
import { TextButton } from "@/components/ui/TextButton";
import { Icon } from "@/components/ui/Icon";
import styles from "./CompareBar.module.css";

/** Floating bar shown while journeys are selected for comparison. */
export function CompareBar() {
  const { compared, clearCompare, setCompareOpen } = useJourneys();
  const count = compared.length;

  return (
    <div id="compare-bar" className={styles.bar} hidden={count === 0}>
      <span id="compare-count">{`${count} of 3 journeys selected`}</span>
      <div>
        <TextButton id="compare-clear" onClick={clearCompare}>
          Clear
        </TextButton>
        <Button
          id="compare-open"
          small
          className={styles.open}
          disabled={count < 2}
          onClick={() => setCompareOpen(true)}
        >
          Compare journeys <Icon name="arrow" />
        </Button>
      </div>
    </div>
  );
}
