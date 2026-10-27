// "Where to?" places are content: one JSON file each in content/places, edited in Pages CMS
// (.pages.yml) and read by src/lib/content.ts. This file only describes their shape.
import type { PhotoCredit, Region } from "./tours";

/** A choice in the "Where to?" photo picker. Photos are stored in public/assets. */
export type Place = {
  name: string;
  /** The name with a soft hyphen where a very long word may break in its photo tile. */
  tileName?: string;
  /** Filter value when it differs from the name (Alleppey matches Alappuzha routes). */
  value?: string;
  /** Region to select with the place; Kerala when omitted. */
  region?: Region;
  /** Photo path inside public/assets, e.g. "destinations/kollam.jpg". */
  image: string;
  /** The picker's small copy (public/assets/thumbs/<file>) when there is one, else the photo. */
  thumb: string;
  alt: string;
  /** Credit for a photo that is not the business's own. */
  credit?: PhotoCredit;
};

/** The filter value a place selects. */
export const placeValue = (p: Place) => p.value ?? p.name;
