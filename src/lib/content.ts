// Reads the site's content at build time: content/journeys, content/places and content/styles,
// one JSON file per entry, edited by the business in Pages CMS (see .pages.yml). Server only.
import fs from "node:fs";
import path from "node:path";
import { placeValue, type Place } from "../data/places";
import type { PhotoCredit, Region, Tour, TravelStyle } from "../data/tours";
import { matchesDestination } from "./journeys";

export type Content = {
  tours: Tour[];
  places: Place[];
  travelStyles: TravelStyle[];
};

type Raw = Record<string, unknown>;
/** Reports a content problem. Broken entries are left out so one mistake can't stop a deploy. */
type Warn = (message: string) => void;

const REGIONS: Region[] = ["Kerala", "North", "South", "West", "Northeast"];
const SOFT_HYPHEN = String.fromCharCode(0xad);

// Pages CMS may save an empty optional field as "", null or []: all of them mean "not set".
const text = (v: unknown) =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;
const texts = (v: unknown) =>
  Array.isArray(v) ? v.map(text).filter((s): s is string => Boolean(s)) : [];
const num = (v: unknown) => {
  const n = typeof v === "string" && v.trim() ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};
const some = <T>(list: T[]) => (list.length ? list : undefined);
const isRegion = (v: unknown): v is Region => REGIONS.includes(v as Region);
const isObject = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** "/assets/destinations/a.jpg", as Pages CMS writes it, becomes "destinations/a.jpg" for asset(). */
export const assetPath = (p: string) =>
  p.replace(/^\/+/, "").replace(/^(public\/)?assets\//, "");

type Present<T> = { [K in keyof T]-?: NonNullable<T[K]> };

/** The required fields, or undefined (with a warning) when any is empty or invalid. */
function required<T extends Raw>(
  file: string,
  fields: T,
  warn: Warn,
): Present<T> | undefined {
  const missing = Object.keys(fields).filter((key) => {
    const v = fields[key];
    return v === undefined || (Array.isArray(v) && !v.length);
  });
  if (!missing.length) return fields as Present<T>;
  warn(`${file} is left out of the site: fill in ${missing.join(", ")}.`);
  return undefined;
}

function credit(file: string, v: unknown, warn: Warn): PhotoCredit | undefined {
  if (!isObject(v)) return undefined;
  const c = {
    creator: text(v.creator),
    license: text(v.license),
    licenseUrl: text(v.licenseUrl),
    sourcePage: text(v.sourcePage),
  };
  if (Object.values(c).every((x) => x === undefined)) return undefined;
  return required(`${file} photo credit`, c, warn);
}

function source(v: unknown): Tour["source"] {
  if (!isObject(v)) return undefined;
  const title = text(v.title);
  const url = text(v.url);
  return title && url
    ? { title, url, reviewed: text(v.reviewed) ?? "" }
    : undefined;
}

export function parseTour(id: string, raw: Raw, warn: Warn): Tour | undefined {
  const file = `journeys/${id}.json`;
  const region = text(raw.region);
  const r = required(
    file,
    {
      name: text(raw.name),
      region: isRegion(region) ? region : undefined,
      style: text(raw.style),
      days: num(raw.days),
      nights: num(raw.nights),
      image: text(raw.image),
      alt: text(raw.alt),
      route: text(raw.route),
      itinerary: texts(raw.itinerary),
    },
    warn,
  );
  if (!r) return undefined;
  return {
    ...r,
    id,
    image: assetPath(r.image),
    destination: text(raw.destination) ?? "",
    regions: some(texts(raw.regions).filter(isRegion)),
    regionLabel: text(raw.regionLabel),
    styles: some(texts(raw.styles)),
    credit: credit(file, raw.credit, warn),
    places: texts(raw.places),
    experiences: some(texts(raw.experiences)),
    description: text(raw.description) ?? "",
    pace: text(raw.pace) ?? "",
    ideal: text(raw.ideal) ?? "",
    highlights: text(raw.highlights) ?? "",
    planningNote: text(raw.planningNote),
    notes: text(raw.notes),
    source: source(raw.source),
  };
}

/** `thumbOf` gives the picker's small copy of a photo. A "|" in tileName marks a break point. */
export function parsePlace(
  slug: string,
  raw: Raw,
  warn: Warn,
  thumbOf: (image: string) => string,
): Place | undefined {
  const file = `places/${slug}.json`;
  const r = required(
    file,
    { name: text(raw.name), image: text(raw.image), alt: text(raw.alt) },
    warn,
  );
  if (!r) return undefined;
  const image = assetPath(r.image);
  const region = text(raw.region);
  return {
    ...r,
    image,
    thumb: thumbOf(image),
    tileName: text(raw.tileName)?.split("|").join(SOFT_HYPHEN),
    value: text(raw.value),
    region: isRegion(region) ? region : undefined,
    credit: credit(file, raw.credit, warn),
  };
}

/** The JSON objects in a content folder, keyed by file name without ".json". */
function readFolder(dir: string, warn: Warn): { key: string; raw: Raw }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .flatMap((file) => {
      let raw: unknown;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      } catch {
        raw = undefined;
      }
      if (isObject(raw)) return [{ key: file.slice(0, -5), raw }];
      warn(`${path.basename(dir)}/${file} is left out: it is not valid JSON.`);
      return [];
    });
}

/** Lowest "order" first; entries without one come last, by name. */
function inOrder<T extends { name: string }>(
  entries: { order?: number; item?: T }[],
): T[] {
  return entries
    .filter((e): e is { order?: number; item: T } => Boolean(e.item))
    .sort(
      (a, b) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        a.item.name.localeCompare(b.item.name),
    )
    .map((e) => e.item);
}

type LoadOptions = { contentDir?: string; assetsDir?: string; warn?: Warn };

export function loadContent({
  contentDir = path.join(process.cwd(), "content"),
  assetsDir = path.join(process.cwd(), "public", "assets"),
  warn = (message) => console.warn(`Content: ${message}`),
}: LoadOptions = {}): Content {
  const read = (folder: string) =>
    readFolder(path.join(contentDir, folder), warn);
  const exists = (file: string) => fs.existsSync(path.join(assetsDir, file));
  const thumbOf = (image: string) => {
    const thumb = `thumbs/${path.posix.basename(image)}`;
    return exists(thumb) ? thumb : image;
  };

  const travelStyles = [
    ...new Set(
      inOrder(
        read("styles").map(({ raw }) => {
          const name = text(raw.name);
          return { order: num(raw.order), item: name ? { name } : undefined };
        }),
      ).map((s) => s.name),
    ),
  ];
  const tours = inOrder(
    read("journeys").map(({ key, raw }) => ({
      order: num(raw.order),
      item: parseTour(key, raw, warn),
    })),
  );
  const places = inOrder(
    read("places").map(({ key, raw }) => ({
      order: num(raw.order),
      item: parsePlace(key, raw, warn, thumbOf),
    })),
  );

  for (const t of tours) {
    if (!exists(t.image))
      warn(`journeys/${t.id}.json: photo ${t.image} is not in public/assets.`);
    for (const s of [t.style, ...(t.styles ?? [])])
      if (!travelStyles.includes(s))
        warn(`journeys/${t.id}.json: "${s}" is not a travel style.`);
  }
  for (const p of places) {
    if (!exists(p.image))
      warn(`"${p.name}" place: photo ${p.image} is not in public/assets.`);
    if (!tours.some((t) => matchesDestination(t, placeValue(p))))
      warn(
        `"${p.name}" place: no journey lists "${placeValue(p)}" under Places, so picking it shows the trip planner instead.`,
      );
  }
  return { tours, places, travelStyles };
}

let cached: Content | undefined;

/** The site's content. A production build reads it once; the dev server rereads every request. */
export function getContent(): Content {
  if (process.env.NODE_ENV !== "production") return loadContent();
  return (cached ??= loadContent());
}
