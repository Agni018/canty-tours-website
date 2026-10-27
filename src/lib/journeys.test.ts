import { describe, expect, it } from "vitest";
import type { Place } from "../data/places";
import type { Tour } from "../data/tours";
import {
  defaultFilters,
  destinationLabel,
  durationText,
  enquiryMessage,
  filterTours,
  filtersFromQuery,
  filtersToQuery,
  highlightList,
  journeyEnquiryMessage,
  journeyMessage,
  journeysEyebrow,
  relatedTours,
  resultsSummary,
  type Enquiry,
  type Filters,
} from "./journeys";

// Made-up content, so the tests don't change when the business edits its journeys in the CMS.
const tour = (id: string, t: Partial<Tour> = {}): Tour => ({
  id,
  name: `Journey ${id}`,
  destination: "Kerala",
  region: "Kerala",
  style: "Family",
  days: 3,
  nights: 2,
  image: "destinations/test.jpg",
  alt: "",
  places: [],
  route: "Kochi → Kochi",
  description: "",
  pace: "",
  ideal: "",
  highlights: "",
  itinerary: ["Arrive."],
  ...t,
});

const tours = [
  tour("munnar", {
    places: ["Kochi", "Munnar"],
    style: "Mountains",
    styles: ["Honeymoon"],
    days: 4,
    nights: 3,
  }),
  tour("houseboat", {
    name: "An Overnight on Alleppey's Waterways",
    style: "Slow escapes",
    days: 2,
    nights: 1,
    places: ["Kochi", "Alappuzha"],
    route: "Kochi → Alappuzha → Kochi",
    highlights: "Backwater cruising, Overnight houseboat ,",
    itinerary: ["Board a houseboat at noon.", "Return to Kochi."],
  }),
  tour("kollam", { places: ["Kollam"], experiences: ["Houseboat"] }),
  tour("temples", {
    destination: "Kerala & Tamil Nadu",
    region: "South",
    regions: ["Kerala", "South"],
    style: "Culture & heritage",
    days: 8,
    nights: 7,
  }),
  tour("goa", { destination: "Goa", region: "West", style: "Beaches" }),
  tour("ladakh", { destination: "Ladakh", region: "North", days: 7 }),
];

const place = (name: string, p: Partial<Place> = {}): Place => ({
  name,
  image: "x.jpg",
  thumb: "x.jpg",
  alt: "",
  ...p,
});
const places = [place("Munnar"), place("Alleppey", { value: "Alappuzha" })];
const styles = ["Family", "Honeymoon", "Mountains"];

const ids = (f: Partial<Filters>) =>
  filterTours(tours, { ...defaultFilters, ...f }).map((t) => t.id);
const byId = (id: string) => tours.find((t) => t.id === id)!;

describe("filterTours", () => {
  it("shows Kerala routes by default, including Kerala & Tamil Nadu ones", () => {
    expect(ids({})).toEqual(["munnar", "houseboat", "kollam", "temples"]);
  });
  it("includes the Kerala routes under South India", () => {
    expect(ids({ region: "South" })).toEqual(ids({ region: "Kerala" }));
  });
  it("matches places by name, whatever their capitals or spaces", () => {
    expect(ids({ destination: "Munnar" })).toEqual(["munnar"]);
    expect(ids({ destination: " munnar " })).toEqual(["munnar"]);
    expect(ids({ region: "all", destination: "Goa" })).toEqual(["goa"]);
  });
  it("matches Houseboat through stays, cruises and experiences", () => {
    expect(ids({ destination: "Houseboat" })).toEqual(["houseboat", "kollam"]);
  });
  it("matches extra styles as well as the main one", () => {
    expect(ids({ region: "all", style: "Honeymoon" })).toEqual(["munnar"]);
    expect(ids({ region: "all", style: "Mountains" })).toEqual(["munnar"]);
  });
  it("splits durations at 5 days", () => {
    expect(ids({ region: "all", duration: "short" })).toEqual([
      "munnar",
      "houseboat",
      "kollam",
      "goa",
    ]);
    expect(ids({ region: "all", duration: "long" })).toEqual([
      "temples",
      "ladakh",
    ]);
  });
});

describe("filters in the address", () => {
  it("reads known filters and ignores anything else", () => {
    expect(
      filtersFromQuery("?region=North&style=Family&duration=nope&x=1", styles),
    ).toEqual({ region: "North", style: "Family" });
    expect(filtersFromQuery("?destination=%20Munnar%20", styles)).toEqual({
      destination: "Munnar",
    });
    expect(filtersFromQuery("", styles)).toEqual({});
  });
  it("accepts only the travel styles in the content", () => {
    expect(filtersFromQuery("?style=Wildlife", styles)).toEqual({});
    expect(filtersFromQuery("?style=Wildlife", ["Wildlife"])).toEqual({
      style: "Wildlife",
    });
  });
  it("writes only what differs from the default, keeping other parameters", () => {
    expect(filtersToQuery(defaultFilters, "")).toBe("");
    expect(
      filtersToQuery({ ...defaultFilters, style: "Family" }, "?utm_source=wa"),
    ).toBe("?utm_source=wa&style=Family");
    expect(filtersToQuery(defaultFilters, "?style=Family")).toBe("");
  });
});

describe("labels", () => {
  it("shows place names rather than filter values", () => {
    expect(destinationLabel(places, "Alappuzha")).toBe("Alleppey");
    expect(destinationLabel(places, "Rajasthan")).toBe("Rajasthan");
    expect(
      resultsSummary(
        2,
        { ...defaultFilters, destination: "Alappuzha", style: "Family" },
        places,
      ),
    ).toBe(
      "2 journey ideas in Kerala · Including Alleppey · Family · Select up to 3 to compare",
    );
  });
  it("names the collection above the grid", () => {
    expect(journeysEyebrow("Kerala")).toBe("YOUR KERALA STORY STARTS HERE");
    expect(journeysEyebrow("South")).toBe("YOUR SOUTH INDIA STORY STARTS HERE");
    expect(journeysEyebrow("all")).toBe("YOUR NEXT INDIA STORY STARTS HERE");
  });
  it("uses the singular for one night", () => {
    expect(durationText(byId("houseboat"))).toBe("2 days / 1 night");
    expect(durationText(byId("munnar"))).toBe("4 days / 3 nights");
  });
});

describe("journey pages", () => {
  it("lists the highlights one by one", () => {
    expect(highlightList(byId("houseboat"))).toEqual([
      "Backwater cruising",
      "Overnight houseboat",
    ]);
  });
  it("suggests journeys from the same region first, never the journey itself", () => {
    expect(relatedTours(tours, byId("houseboat")).map((t) => t.id)).toEqual([
      "munnar",
      "kollam",
      "temples",
    ]);
  });
});

describe("WhatsApp messages", () => {
  const houseboat = byId("houseboat");
  it("asks about one journey, with its link when there is one", () => {
    expect(
      journeyMessage(
        houseboat,
        "https://example.com/journeys/kerala-houseboat/",
      ),
    ).toBe(
      [
        "Hi Canty Tours! I'm interested in the “An Overnight on Alleppey's Waterways” sample journey (2 days / 1 night).",
        "Route: Kochi → Alappuzha → Kochi",
        "https://example.com/journeys/kerala-houseboat/",
        "",
        "Please share availability, pricing and inclusions.",
      ].join("\n"),
    );
    expect(journeyMessage(houseboat, "")).not.toContain("https://");
  });
  it("builds the enquiry from a journey's page", () => {
    expect(
      journeyEnquiryMessage(
        houseboat,
        {
          name: "Asha",
          date: "2026-12-20",
          occasion: "Honeymoon / couple",
          travellers: "2 travellers",
          budget: "Let’s discuss",
          notes: "",
        },
        "https://example.com/journeys/kerala-houseboat/",
      ),
    ).toBe(
      [
        "Hi Canty Tours! I'd like to plan the “An Overnight on Alleppey's Waterways” sample journey (2 days / 1 night).",
        "Route: Kochi → Alappuzha → Kochi",
        "https://example.com/journeys/kerala-houseboat/",
        "",
        "Name: Asha",
        "Travel date: 2026-12-20",
        "Occasion: Honeymoon / couple",
        "Travellers: 2 travellers",
        "Budget per person: Let’s discuss",
        "",
        "Please share availability, pricing and inclusions.",
      ].join("\n"),
    );
  });
  it("builds the trip planner text", () => {
    const enquiry: Enquiry = {
      name: "Asha",
      destination: "Goa",
      date: "",
      tripLength: "2 days",
      occasion: "To discuss",
      travellers: "2 travellers",
      budget: "Let’s discuss",
      pace: "A bit of everything",
      notes: "From Pune",
    };
    expect(enquiryMessage(enquiry)).toBe(
      [
        "Hi Canty Tours! I'd like to plan a holiday with you.",
        "",
        "Name: Asha",
        "Destination: Goa",
        "Travel date: Flexible / to discuss",
        "Preferred trip length: 2 days",
        "Occasion: To discuss",
        "Travellers: 2 travellers",
        "Budget per person: Let’s discuss",
        "Travel style: A bit of everything",
        "Other details: From Pune",
        "",
        "Please share itinerary options, availability, pricing and inclusions.",
      ].join("\n"),
    );
  });
});
