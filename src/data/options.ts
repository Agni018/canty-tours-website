import type { TravelStyle } from "./tours";

export type RegionFilter =
  "all" | "Kerala" | "North" | "South" | "West" | "Northeast";
export type StyleFilter = "all" | TravelStyle;
export type DurationFilter = "all" | "short" | "long";

/** Option for the Select component; a plain string is both value and label. */
export type SelectOption = string | { value: string; label: string };

export const regionOptions: SelectOption[] = [
  { value: "Kerala", label: "Kerala — our first love" },
  { value: "all", label: "Anywhere in India" },
  { value: "North", label: "North India" },
  { value: "South", label: "South India" },
  { value: "West", label: "West India" },
  { value: "Northeast", label: "Northeast India" },
];

/** The style dropdown: "A little of everything", then the travel styles from content/styles. */
export const styleOptions = (styles: TravelStyle[]): SelectOption[] => [
  { value: "all", label: "A little of everything" },
  ...styles,
];

export const durationOptions: SelectOption[] = [
  { value: "all", label: "Any duration" },
  { value: "short", label: "Up to 5 days" },
  { value: "long", label: "6 days or more" },
];

// Trip form options. The first entry of each list is the default.
export const tripLengths = [
  "Flexible / to discuss",
  "2 days",
  "3–4 days",
  "5–6 days",
  "7–8 days",
  "9+ days",
];
export const travellerCounts = [
  "2 travellers",
  "Solo traveller",
  "3–4 travellers",
  "5–8 travellers",
  "9+ travellers / group",
];
export const occasions = [
  "To discuss",
  "Family holiday",
  "Honeymoon / couple",
  "Friends / group",
  "Solo holiday",
];
export const budgets = [
  "Let’s discuss",
  "Under ₹20,000",
  "₹20,000–₹40,000",
  "₹40,000–₹70,000",
  "₹70,000+",
];
export const paces = [
  "A bit of everything",
  "Easy and unhurried",
  "Culture and local life",
  "Mountains and adventure",
  "Beaches and downtime",
];
