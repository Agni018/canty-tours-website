# Canty Tours

Website for Canty Tours: Kerala-first holiday ideas, journeys across India, and a trip planner that
prepares a WhatsApp message. Business contact: +91 89216 11825.

Built with **Next.js (React + TypeScript)** and exported as a static site to GitHub Pages. There is
no backend: nothing is stored, and enquiries go to WhatsApp from the visitor's browser.

## Run it

Requires Node.js 20.9 or newer.

```sh
npm install      # once
npm run dev      # http://localhost:3000, reloads on save
```

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`    | Local development server                              |
| `npm test`       | Unit tests (Vitest): filtering, content, enquiry text |
| `npm run format` | Format every file with Prettier                       |
| `npm run build`  | Type-check and export the static site to `out/`       |
| `npm run check`  | Format check + tests + build; the same checks CI runs |

## Project structure

```
content/                Edited in Pages CMS (see below), one JSON file per entry:
  journeys/             Sample journeys; the file name is the page address /journeys/<name>/
  places/               "Where to?" picker places
  styles/               Travel styles (the style filter)
.pages.yml              Pages CMS set-up: the editing forms for everything in content/
src/
  app/                  Next.js entry: layout (header, footer, fonts, metadata), home page,
                        journeys/[id]/ (one page per journey), global CSS, favicon
  components/
    ui/                 Reusable building blocks: Button, TextButton, Chip, Dropdown, Field,
                        Modal, SectionHeading, Brand, Icon
    cards/              TourCard, DestinationCard, IndiaCard
    sections/           One component per page section (Header, Hero, FinderBar, Journeys, …)
    overlays/           Dialogs, compare bar and toast
    JourneyProvider.tsx Content plus shared state: filters (kept in the address), comparison,
                        dialogs
  data/                 Types for the content above; destinations, dropdown options, contact
                        details, testimonials (real ones only; the section is hidden while empty)
  lib/                  Pure logic (filtering, labels, WhatsApp text), the content reader
                        (content.ts) and their tests
public/assets/          Photos, served as /assets/…; uploads from Pages CMS land here too
```

Each component keeps its styles next to it in a `*.module.css` file (CSS Modules, scoped to that
component). `src/app/globals.css` holds only colour/font tokens, element defaults and a few shared
utility classes (`wrap`, `section`, `eyebrow`, `light`, `fineprint`).

## Common edits

- **Journeys, "Where to?" places and travel styles:** in Pages CMS (next section), or by editing
  the JSON files in `content/` directly. New journeys appear in the grid, get their own page and
  join the filters; a new travel style becomes a filter chip and a choice in "Your kind of escape".
- **Change dropdown options:** `src/data/options.ts`; contact-form country codes:
  `src/data/countryCodes.ts`. Regions are fixed in code, because the region tabs and the "South
  India includes Kerala" rule depend on them.
- **Change destination cards:** `src/data/destinations.ts`.
- **Change the phone/WhatsApp number:** `src/data/site.ts`.

## Editing content in Pages CMS

[Pages CMS](https://pagescms.org) is a free online editor for content kept in a GitHub repository.
It shows the files in `content/` as forms (journeys, "Where to?" places, travel styles) and lets
photos be uploaded. Saving commits the change to the repository, and the usual deploy publishes it
about two minutes later. There is no server or database; `.pages.yml` describes the forms.

One-time set-up, by the repository owner:

1. Merge this into `main`.
2. Go to [app.pagescms.org](https://app.pagescms.org), sign in with GitHub and install the Pages CMS
   GitHub App on the account that owns this repository, giving it access to this repository.
3. Open the repository (branch `main`) in Pages CMS.
4. Invite the people who will edit content by email (Collaborators). They sign in with the link
   they receive and don't need a GitHub account. They can change content and photos, not the
   set-up.

Good to know:

- A journey's file name, and so its page address, comes from its name when it is created and
  can't be renamed in the editor, so links shared on WhatsApp keep working.
- A journey appears under a "Where to?" photo when its **Places on the route** include that
  place's name (or its "Matches journeys listing" value). Capitals don't matter.
- An entry missing a required field is left out of the site instead of stopping the update. The
  build log of the deploy (GitHub → Actions) lists anything left out or unmatched, under
  `Content:`.
- Pages CMS removes keys it doesn't know about when it saves a file, so a new field must be added
  to `.pages.yml` as well as to the types in `src/data/` and to `src/lib/content.ts`.
- `npm run dev` makes its list of journey pages when it starts: restart it to open the page of a
  journey added since. Everything else updates on reload.

## Deploy

Every push to `main` runs `.github/workflows/main.yml`: format check, tests, build, then deploy of
`out/` to GitHub Pages. Pull requests run the same checks without deploying.

One-time setting: **Settings → Pages → Source = GitHub Actions**. With the old "Deploy from a
branch" setting, GitHub also publishes the raw repository files and the two deploys overwrite each
other.

The site is served from a sub-path (`/canty-tours-uat`) on GitHub Pages; the workflow passes it to
the build as `BASE_PATH`. Image paths go through `asset()` in `src/lib/utils.ts` so they include it.

## Content sources

Routes are illustrative, with prices on request. No testimonials, performance claims, accreditation
or rates are fabricated. All quotes and bookings are handled directly with Canty Tours.

Most Kerala and Tamil Nadu itineraries are original, condensed day-by-day summaries of published
Paradise Holidays routes, reviewed on 19 October 2026 (the Ponmudi and Bekal–Kannur routes on
24 October 2026). They keep the published route order, key activities and optional or
time-dependent qualifications; no prices, guarantees, hotel, meal or transport inclusions are
transferred. Each tour's reference is its `source` in its `content/journeys/` file, and the list
is shown in the site's privacy dialog.

Five Kerala routes added on 24 October 2026 have no published equivalent and are original
suggestions: Fort Kochi and Cherai, Munnar and Chinnar, Nelliyampathy and Silent Valley, Thrissur,
and Thenmala and Palaruvi. Their access, permit, closing-day and seasonal notes were checked against
the Kerala Tourism, district tourism and forest department pages listed below.

Every place in the "Where to?" picker has at least one matching route. Alleppey matches Alappuzha
routes, Thiruvananthapuram matches Trivandrum routes, Fort Kochi & Mattancherry matches routes with a
Fort Kochi heritage day, Bekal Fort matches the Bekal route, and Houseboat matches overnight and
daytime houseboat routes. Meenmutty Falls is the waterfall at Kallar on the Ponmudi road, not the
one in Wayanad. The Kanyakumari, Madurai and Rameswaram routes appear in both the Kerala and South
India collections.

### Competitor comparison

- Paradise Holidays https://www.paradise-kerala.com/ : Kerala-first navigation, destination browsing, duration-based itinerary ideas, travel styles and planning FAQs. Applied with original Canty copy and sample routes, not competitor prices or business claims. Reviewed 12 October 2026.
- Route references: [4 days: Munnar and Alappuzha](https://www.paradise-kerala.com/tourpackage/Kerala-Tour-Packages/4days-3nights-alleppey-munnar-kerala-tour/), [5 days: Munnar, Thekkady and Alappuzha](https://www.paradise-kerala.com/tourpackage/Kerala-Tour-Packages/5days-4nights-Alleppey-Thekkady-Munnar/), [North Kerala options](https://www.paradise-kerala.com/tourpackage/North-Kerala-Tour-Packages/). Other routes are original suggested combinations.
- Planning references: Kerala Tourism’s [seasonal advice](https://www.keralatourism.org/faq/what-should-you-know-before-going-on-vacation-to-kerala), [Munnar access](https://www.keralatourism.org/munnar/location-munnar.php), [Wayanad access](https://www.keralatourism.org/campaigns/kerala365/wayanad-kerala), and [houseboat operator Q&A](https://www.keralatourism.org/travelcare/postdetails/view/14523). Routes require confirmation around actual arrival/departure times and current availability.
- Added-route references, checked 24 October 2026: Kerala Tourism on [Chinnar](https://keralatourism.org/munnar/chinnar-wildlife-sanctuary-munnar.php), [Nelliyampathy](https://www.keralatourism.org/ecotourism/trekking-programs/ecotourism-nelliyampathy/40), [the Palaruvi trek](https://www.keralatourism.org/ecotourism/trekking-programs/palaruvi-trek/26), [Kavvayi](https://keralatourism.org/destination/kavvayi-backwater-payyanur/376), [Muzhappilangad](https://keralatourism.org/destination/muzhappilangad-beach-unique/709) and [the Paradesi Synagogue](https://keralatourism.org/destination/synagogue-mattancherry/163); DTPC Kollam on [Palaruvi](https://www.dtpckollam.com/destination/palaruvi-waterfalls); Palakkad Tourism on [Silent Valley](https://palakkadtourism.org/place.php?id=9).

Earlier India-wide layout references:

- Thomas Cook https://www.thomascook.in/holidays/ : destination and traveller-interest browsing. Applied as region and style filters.
- SOTC https://www.sotc.in/holidays : custom holiday enquiry. Applied as a compact WhatsApp trip planner.
- Thrillophilia https://www.thrillophilia.com/countries/india/tours : scannable journey offerings. Applied as duration, route, itinerary and side-by-side comparison.

Original layout and copy; no competitor branding or proprietary descriptions copied. Earlier references checked 11 October 2026.

### Photos

"Where to?" picker photos are stored in `public/assets/destinations/`, resized to 960–1200px wide
with camera metadata removed, plus a 480px copy in `public/assets/thumbs/` for the picker. A place
added in Pages CMS uses its main photo in the picker until a 480px copy with the same file name is
added to `public/assets/thumbs/`. Photo credits entered in Pages CMS are listed in the privacy
dialog automatically. Most come from Wikimedia Commons under CC BY-SA, CC BY or public domain;
photographer, licence and source page for each are in `src/data/places.ts` and shown in the
privacy dialog, as the licences require.

Downloaded from Unsplash, re-sized for the site, used under the [Unsplash License](https://unsplash.com/license):

- Munnar, Vivek Kumar: https://unsplash.com/photos/tea-gardens-on-munnar-hills-JS_ohjocm00
- Varkala, Nandu Vasudevan: https://unsplash.com/photos/BU0lMokk7tA
- Wayanad, Niranjan V S: https://unsplash.com/photos/mountains-covered-in-lush-green-vegetation-stand-tall-rTiBFR2c99c
- Kerala: https://images.unsplash.com/photo-1602216056096-3b40cc0c9944
- Rajasthan: https://unsplash.com/photos/LgQoL6eOdHs
- Ladakh, Vivek: https://unsplash.com/photos/MEaPZmSKyws
- Taj Mahal: https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f
- Goa, Arun Prakash: https://unsplash.com/photos/weeJiR-xXC0
- Sikkim, North Bengal Tourism: https://unsplash.com/photos/E6rnGEJnvYo

Typography: Playfair Display (headings) and Montserrat (text) from Google Fonts, self-hosted at build time by `next/font`.
