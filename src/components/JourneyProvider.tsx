"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RegionFilter } from "@/data/options";
import type { Content } from "@/lib/content";
import {
  defaultFilters,
  filterTours,
  filtersFromQuery,
  filtersToQuery,
  tourVisiting,
  type Filters,
} from "@/lib/journeys";
import { scrollToSection } from "@/lib/utils";

/** A request for EnquiryForm to fill in a destination and take focus. */
export type TripRequest = { destination: string };

const MAX_COMPARE = 3;

function useJourneyState({ tours, places, travelStyles }: Content) {
  // `fields` is what the finder shows; `filters` is what the grid shows. Picking in the finder
  // only changes `fields` until the visitor presses "Find my journey" or another filter control.
  const [{ fields, filters }, setFilterState] = useState({
    fields: defaultFilters,
    filters: defaultFilters,
  });
  // Bumped when the results should be scrolled to and pointed out (see Journeys).
  const [revealCount, setRevealCount] = useState(0);
  const [compared, setCompared] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const matches = filterTours(tours, filters);

  function notify(message: string) {
    setToast({ message, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3500,
    );
  }

  /** Updates the finder and shows the result in the grid. */
  function applyFilters(changes: Partial<Filters>) {
    setFilterState((s) => {
      const next = { ...s.fields, ...changes };
      return { fields: next, filters: next };
    });
  }

  // The grid's filters live in the address too (?style=Family), so a filtered view can be
  // shared, reloaded or returned to with Back. Read once on arrival, then kept in step.
  useEffect(() => {
    const fromUrl = filtersFromQuery(location.search, travelStyles);
    if (Object.keys(fromUrl).length) applyFilters(fromUrl);
  }, []);
  useEffect(() => {
    const search = filtersToQuery(filters, location.search);
    if (search !== location.search)
      history.replaceState(
        history.state,
        "",
        location.pathname + search + location.hash,
      );
  }, [filters]);

  return {
    /** All journeys, "Where to?" places and travel styles, in display order. */
    tours,
    places,
    travelStyles,
    fields,
    filters,
    /** Tours currently shown in the grid, in order. */
    matches,
    /** Changes the finder without updating the grid yet. */
    setFields(changes: Partial<Filters>) {
      setFilterState((s) => ({ ...s, fields: { ...s.fields, ...changes } }));
    },
    applyFilters,
    revealCount,
    /** Finder submit: show the finder's choices and point out the results. */
    findJourneys() {
      applyFilters({});
      setRevealCount((n) => n + 1);
    },
    showDestination(destination: string) {
      const region = tourVisiting(tours, destination)?.region ?? "all";
      applyFilters({ destination, region, style: "all", duration: "all" });
      setRevealCount((n) => n + 1);
    },
    showRegion(region: RegionFilter) {
      applyFilters({ destination: "", region, style: "all", duration: "all" });
      scrollToSection("journeys");
    },
    resetFilters() {
      applyFilters(defaultFilters);
    },

    compared,
    /** Adds or removes a tour from the comparison; refuses a fourth one. */
    toggleCompare(id: string, on: boolean) {
      if (on && compared.length >= MAX_COMPARE) {
        notify("You can compare up to 3 journeys. Remove one to add another.");
        return;
      }
      setCompared((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));
    },
    clearCompare() {
      setCompared([]);
    },

    compareOpen,
    setCompareOpen,
    privacyOpen,
    setPrivacyOpen,

    tripRequest,
    /** Fills the trip planner with a destination, scrolls to it and focuses it. */
    planTrip(destination: string) {
      setTripRequest({ destination });
    },

    toast,
    notify,
  };
}

const JourneyContext = createContext<ReturnType<typeof useJourneyState> | null>(
  null,
);

type JourneyProviderProps = {
  /** Read from content/ at build time by the root layout. */
  content: Content;
  children: ReactNode;
};

/** Holds the site's content and shared state: filters, comparison, dialogs, trip requests, toast. */
export function JourneyProvider({ content, children }: JourneyProviderProps) {
  return (
    <JourneyContext value={useJourneyState(content)}>{children}</JourneyContext>
  );
}

export function useJourneys() {
  const value = useContext(JourneyContext);
  if (!value)
    throw new Error("useJourneys must be used inside <JourneyProvider>");
  return value;
}
