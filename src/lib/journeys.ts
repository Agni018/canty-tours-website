// Pure journey logic (filtering, labels, message text, phone checks). No React or DOM here,
// so it is unit-tested in journeys.test.ts.
import {
  durationOptions,
  regionOptions,
  type DurationFilter,
  type RegionFilter,
  type SelectOption,
  type StyleFilter,
} from "../data/options";
import { placeValue, type Place } from "../data/places";
import type { Tour, TravelStyle } from "../data/tours";

export type Filters = {
  region: RegionFilter;
  style: StyleFilter;
  duration: DurationFilter;
  /** Place picked in the "Where to?" picker or a destination card; "" when none. */
  destination: string;
};

export const defaultFilters: Filters = {
  region: "Kerala",
  style: "all",
  duration: "all",
  destination: "",
};

/** "South India" also lists Kerala routes; routes through several regions match each of them. */
export function matchesRegion(t: Tour, region: RegionFilter): boolean {
  const regions = t.regions ?? [t.region];
  return (
    region === "all" ||
    regions.includes(region) ||
    (region === "South" && regions.includes("Kerala"))
  );
}

/** Names typed in the CMS match whatever their capitals or surrounding spaces. */
const sameName = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

const visits = (t: Tour, destination: string) =>
  sameName(t.destination, destination) ||
  t.places.some((p) => sameName(p, destination));

/** "Houseboat" matches any route with a houseboat stay or cruise; other places match by name. */
export function matchesDestination(t: Tour, destination: string): boolean {
  if (!destination) return true;
  if (sameName(destination, "Houseboat"))
    return (
      (t.experiences ?? []).some((e) => sameName(e, "Houseboat")) ||
      t.itinerary.some((day) => /houseboat/i.test(day))
    );
  return visits(t, destination);
}

export function filterTours(tours: Tour[], f: Filters): Tour[] {
  return tours.filter(
    (t) =>
      matchesRegion(t, f.region) &&
      (f.style === "all" ||
        t.style === f.style ||
        (t.styles ?? []).includes(f.style)) &&
      (f.duration === "all" ||
        (f.duration === "short" ? t.days <= 5 : t.days >= 6)) &&
      matchesDestination(t, f.destination),
  );
}

const optionValues = (options: SelectOption[]) =>
  options.map((o) => (typeof o === "string" ? o : o.value));

/**
 * Filters named in a page address (?region=North&style=Family), so filtered results can be
 * shared and survive a reload. Unknown keys and values are ignored: the address is untrusted.
 */
export function filtersFromQuery(
  search: string,
  styles: TravelStyle[],
): Partial<Filters> {
  const allowed: Record<Exclude<keyof Filters, "destination">, string[]> = {
    region: optionValues(regionOptions),
    style: ["all", ...styles],
    duration: optionValues(durationOptions),
  };
  const q = new URLSearchParams(search);
  const found: Partial<Filters> = {};
  for (const [key, values] of Object.entries(allowed)) {
    const v = q.get(key);
    if (v && values.includes(v)) Object.assign(found, { [key]: v });
  }
  const destination = q.get("destination")?.trim().slice(0, 60);
  if (destination) found.destination = destination;
  return found;
}

/**
 * The query string for `f`, keeping any other parameters already in `search` (e.g. campaign
 * tags). Default values are left out, so the plain page keeps a plain address.
 */
export function filtersToQuery(f: Filters, search: string): string {
  const q = new URLSearchParams(search);
  for (const key of Object.keys(defaultFilters) as (keyof Filters)[]) {
    if (f[key] === defaultFilters[key]) q.delete(key);
    else q.set(key, f[key]);
  }
  const query = q.toString();
  return query ? `?${query}` : "";
}

/** First tour that visits a destination, used to pick the region for a destination card. */
export function tourVisiting(
  tours: Tour[],
  destination: string,
): Tour | undefined {
  return tours.find((t) => visits(t, destination));
}

/** True when the grid shows the Kerala collection (Kerala or South India). */
export function isKeralaView(region: RegionFilter): boolean {
  return region === "Kerala" || region === "South";
}

/** Display name for a filter value: "Alappuzha" shows as "Alleppey". */
export function destinationLabel(places: Place[], destination: string): string {
  return places.find((p) => placeValue(p) === destination)?.name ?? destination;
}

export function journeysEyebrow(region: RegionFilter): string {
  if (region === "Kerala") return "YOUR KERALA STORY STARTS HERE";
  if (region === "South") return "YOUR SOUTH INDIA STORY STARTS HERE";
  return "YOUR NEXT INDIA STORY STARTS HERE";
}

/** The line above the grid, e.g. "6 journey ideas in Kerala · Family · Select up to 3 to compare". */
export function resultsSummary(
  count: number,
  f: Filters,
  places: Place[],
): string {
  const scope =
    f.region === "all"
      ? "across India"
      : f.region === "Kerala"
        ? "in Kerala"
        : `in ${f.region} India`;
  const parts = [
    scope +
      (f.destination
        ? ` · Including ${destinationLabel(places, f.destination)}`
        : ""),
  ];
  if (f.style !== "all") parts.push(f.style);
  if (f.duration !== "all")
    parts.push(f.duration === "short" ? "Up to 5 days" : "6 days or more");
  return `${count} journey idea${count === 1 ? "" : "s"} ${parts.join(" · ")} · Select up to 3 to compare`;
}

export function regionLabel(t: Tour): string {
  if (t.regionLabel) return t.regionLabel;
  return t.region === "Kerala" ? "KERALA" : `${t.region.toUpperCase()} INDIA`;
}

/** "4 days / 3 nights", or "2 days / 1 night". */
export function durationText(t: Tour): string {
  return `${t.days} days / ${t.nights} ${t.nights === 1 ? "night" : "nights"}`;
}

export type Enquiry = {
  name: string;
  destination: string;
  date: string;
  tripLength: string;
  occasion: string;
  travellers: string;
  budget: string;
  pace: string;
  notes: string;
};

/** WhatsApp message for the trip planner form. */
export function enquiryMessage(e: Enquiry): string {
  return [
    "Hi Canty Tours! I'd like to plan a holiday with you.",
    "",
    `Name: ${e.name}`,
    `Destination: ${e.destination}`,
    `Travel date: ${e.date || "Flexible / to discuss"}`,
    `Preferred trip length: ${e.tripLength || "Flexible / to discuss"}`,
    `Occasion: ${e.occasion || "To discuss"}`,
    `Travellers: ${e.travellers}`,
    `Budget per person: ${e.budget}`,
    `Travel style: ${e.pace}`,
    ...(e.notes ? [`Other details: ${e.notes}`] : []),
    "",
    "Please share itinerary options, availability, pricing and inclusions.",
  ].join("\n");
}

/** Quick "ask on WhatsApp" message about one journey. `link` is the page URL, or "". */
export function journeyMessage(t: Tour, link: string): string {
  return [
    `Hi Canty Tours! I'm interested in the “${t.name}” sample journey (${durationText(t)}).`,
    `Route: ${t.route}`,
    ...(link ? [link] : []),
    "",
    "Please share availability, pricing and inclusions.",
  ].join("\n");
}

/** The fields of the enquiry form on a journey's page (the journey sets the rest). */
export type JourneyEnquiry = Pick<
  Enquiry,
  "name" | "date" | "occasion" | "travellers" | "budget" | "notes"
>;

/** WhatsApp message from the enquiry form on a journey's page. `link` is the page URL, or "". */
export function journeyEnquiryMessage(
  t: Tour,
  e: JourneyEnquiry,
  link: string,
): string {
  return [
    `Hi Canty Tours! I'd like to plan the “${t.name}” sample journey (${durationText(t)}).`,
    `Route: ${t.route}`,
    ...(link ? [link] : []),
    "",
    `Name: ${e.name}`,
    `Travel date: ${e.date || "Flexible / to discuss"}`,
    `Occasion: ${e.occasion || "To discuss"}`,
    `Travellers: ${e.travellers}`,
    `Budget per person: ${e.budget}`,
    ...(e.notes ? [`Other details: ${e.notes}`] : []),
    "",
    "Please share availability, pricing and inclusions.",
  ].join("\n");
}

/** The highlights as a list: "Waterfalls, Tea country, Periyar" gives three items. */
export function highlightList(t: Tour): string[] {
  return t.highlights
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
}

/**
 * Up to `count` other journeys to suggest on a journey's page: those in the same region and
 * sharing a travel style first, then the same region, then a shared style; ties keep list order.
 */
export function relatedTours(tours: Tour[], t: Tour, count = 3): Tour[] {
  const stylesOf = (x: Tour) => [x.style, ...(x.styles ?? [])];
  const score = (x: Tour) =>
    (matchesRegion(x, t.region) ? 2 : 0) +
    (stylesOf(x).some((s) => stylesOf(t).includes(s)) ? 1 : 0);
  return tours
    .filter((x) => x.id !== t.id)
    .map((x, i) => ({ x, i, s: score(x) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, count)
    .map(({ x }) => x);
}
