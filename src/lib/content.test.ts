import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assetPath, loadContent, parsePlace, parseTour } from "./content";

const journey = {
  name: "Hills",
  region: "Kerala",
  style: "Family",
  days: 2,
  nights: 1,
  image: "/assets/destinations/hills.jpg",
  alt: "Green hills",
  route: "Kochi → Munnar",
  places: ["Munnar"],
  itinerary: ["Drive up.", "Drive back."],
};

/** A throwaway site folder with content/<files> and empty public/assets/<photos>. */
function site(files: Record<string, unknown>, photos: string[] = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "canty-content-"));
  const write = (file: string, data: string) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, data);
  };
  for (const [file, data] of Object.entries(files))
    write(
      path.join(root, "content", file),
      typeof data === "string" ? data : JSON.stringify(data),
    );
  for (const photo of photos) write(path.join(root, "assets", photo), "");
  return {
    contentDir: path.join(root, "content"),
    assetsDir: path.join(root, "assets"),
  };
}

describe("reading content", () => {
  it("accepts photo paths the way Pages CMS writes them", () => {
    expect(assetPath("/assets/destinations/a.jpg")).toBe("destinations/a.jpg");
    expect(assetPath("destinations/a.jpg")).toBe("destinations/a.jpg");
    expect(assetPath("public/assets/a.jpg")).toBe("a.jpg");
  });

  it("treats empty optional fields as not set, and numbers saved as text as numbers", () => {
    const warnings: string[] = [];
    const t = parseTour(
      "hills",
      {
        ...journey,
        days: "2",
        regionLabel: "",
        styles: [],
        planningNote: null,
        credit: { creator: "", license: "" },
        source: { title: "", url: "" },
      },
      (m) => warnings.push(m),
    );
    expect(t).toMatchObject({
      id: "hills",
      days: 2,
      image: "destinations/hills.jpg",
    });
    expect(t?.regionLabel).toBeUndefined();
    expect(t?.styles).toBeUndefined();
    expect(t?.planningNote).toBeUndefined();
    expect(t?.credit).toBeUndefined();
    expect(t?.source).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it("leaves out an entry with missing fields and says which", () => {
    const warnings: string[] = [];
    const t = parseTour(
      "hills",
      { ...journey, region: "Kerela", days: undefined, itinerary: [] },
      (m) => warnings.push(m),
    );
    expect(t).toBeUndefined();
    expect(warnings).toEqual([
      "journeys/hills.json is left out of the site: fill in region, days, itinerary.",
    ]);
  });

  it("turns a | in a place's tile name into a soft hyphen", () => {
    const p = parsePlace(
      "tvm",
      {
        name: "Thiruvananthapuram",
        tileName: "Thiruvanantha|puram",
        image: "a.jpg",
        alt: "A",
      },
      () => {},
      (image) => image,
    );
    expect(p?.tileName).toBe(`Thiruvanantha${String.fromCharCode(0xad)}puram`);
  });

  it("orders entries and checks them against each other", () => {
    const warnings: string[] = [];
    const content = loadContent({
      ...site(
        {
          "styles/family.json": { name: "Family", order: 2 },
          "styles/beaches.json": { name: "Beaches", order: 1 },
          "journeys/later.json": { ...journey, name: "Later", order: 20 },
          "journeys/first.json": { ...journey, name: "First", order: 10 },
          "journeys/unsorted.json": { ...journey, style: "Wildlife" },
          "journeys/broken.json": "{ not json",
          "places/munnar.json": {
            name: "Munnar",
            image: "/assets/destinations/hills.jpg",
            alt: "Hills",
          },
          "places/goa.json": {
            name: "Goa",
            image: "/assets/goa.jpg",
            alt: "Goa",
          },
        },
        ["destinations/hills.jpg", "thumbs/hills.jpg"],
      ),
      warn: (m) => warnings.push(m),
    });
    expect(content.travelStyles).toEqual(["Beaches", "Family"]);
    expect(content.tours.map((t) => t.id)).toEqual([
      "first",
      "later",
      "unsorted",
    ]);
    expect(content.places.map((p) => [p.name, p.thumb])).toEqual([
      ["Goa", "goa.jpg"],
      ["Munnar", "thumbs/hills.jpg"],
    ]);
    expect(warnings).toEqual([
      "journeys/broken.json is left out: it is not valid JSON.",
      'journeys/unsorted.json: "Wildlife" is not a travel style.',
      '"Goa" place: photo goa.jpg is not in public/assets.',
      '"Goa" place: no journey lists "Goa" under Places, so picking it shows the trip planner instead.',
    ]);
  });

  it("reads the site's own content", () => {
    const { tours, places, travelStyles } = loadContent({ warn: () => {} });
    expect(tours.length).toBeGreaterThan(0);
    expect(places.length).toBeGreaterThan(0);
    expect(travelStyles.length).toBeGreaterThan(0);
  });
});
