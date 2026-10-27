// Journeys are content: one JSON file each in content/journeys, edited in Pages CMS (.pages.yml)
// and read by src/lib/content.ts. This file only describes their shape.

export type Region = "Kerala" | "North" | "South" | "West" | "Northeast";

/** A travel style's name, e.g. "Family". The list lives in content/styles. */
export type TravelStyle = string;

/** Photographer and licence of a photo, shown in the privacy dialog as the licences require. */
export type PhotoCredit = {
  creator: string;
  license: string;
  licenseUrl: string;
  sourcePage: string;
};

/** A sample itinerary shown in the journey grid, detail dialog and comparison. */
export type Tour = {
  /** The JSON file's name; the journey's page is /journeys/<id>/. */
  id: string;
  name: string;
  destination: string;
  /** Main region. The "South India" filter also includes Kerala tours. */
  region: Region;
  /** All regions the route covers, when it crosses more than one (e.g. Kerala & Tamil Nadu). */
  regions?: Region[];
  /** Overrides the region text on the card, e.g. "KERALA & TAMIL NADU". */
  regionLabel?: string;
  /** Main style: shown on the card tag. */
  style: TravelStyle;
  /** Extra styles the tour also matches in the style filter. */
  styles?: TravelStyle[];
  days: number;
  nights: number;
  /** Photo path inside public/assets, e.g. "destinations/kollam.jpg". */
  image: string;
  alt: string;
  /** Credit for a photo that is not the business's own. */
  credit?: PhotoCredit;
  /** Places visited; a picked destination matches a tour through these. */
  places: string[];
  /** Experiences a destination choice can match, e.g. "Houseboat". */
  experiences?: string[];
  route: string;
  description: string;
  pace: string;
  ideal: string;
  highlights: string;
  /** Extra caution shown in the detail dialog before the standard disclaimer. */
  planningNote?: string;
  /** One entry per day. */
  itinerary: string[];
  /** Practical notes shown under the itinerary. */
  notes?: string;
  /** Published itinerary this summary was checked against (listed in the privacy dialog). */
  source?: { title: string; url: string; reviewed: string };
};
