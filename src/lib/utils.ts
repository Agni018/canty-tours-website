/** Joins class names, skipping falsy ones: cx("a", isOn && "b") */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

/** URL of a file in public/assets, including the GitHub Pages base path. */
export function asset(file: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/${file}`;
}

/** Scrolls a page section (by id) into view. */
export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView();
}

/** Path of a journey's page, for next/link (which adds the base path itself). */
export function journeyPath(id: string): string {
  return `/journeys/${id}/`;
}

/**
 * Full address of a journey's page, for WhatsApp messages and sharing, or "" when the page isn't
 * served over http(s): a file:// link would expose the visitor's local folder.
 */
export function journeyUrl(id: string): string {
  if (!/^https?:$/.test(location.protocol)) return "";
  return `${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${journeyPath(id)}`;
}
