import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyDetail } from "@/components/sections/JourneyDetail";
import { phone } from "@/data/site";
import { getContent } from "@/lib/content";
import { durationText, relatedTours } from "@/lib/journeys";

// One page per journey, built ahead of time; any other id is a 404 (the static export needs this).
export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().tours.map((t) => ({ id: t.id }));
}

type Props = { params: Promise<{ id: string }> };

// Set by the deploy workflow; absolute preview URLs are only added when it is (see app/layout.tsx).
const siteUrl = process.env.SITE_URL;

async function tourFor(params: Props["params"]) {
  const { id } = await params;
  return getContent().tours.find((t) => t.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await tourFor(params);
  if (!t) return {};
  const title = `${t.name}: ${durationText(t)} | Canty Tours`;
  const description = `${t.description} Sample route: ${t.route}. Shaped around you, price on request.`;
  const image = { url: `assets/${t.image}`, alt: t.alt };
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Canty Tours",
      locale: "en_IN",
      title,
      description,
      ...(siteUrl && { url: `journeys/${t.id}/`, images: [image] }),
    },
    twitter: {
      card: siteUrl ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function JourneyPage({ params }: Props) {
  const t = await tourFor(params);
  if (!t) notFound();

  // Search data for the route. Only what the page shows: no prices, ratings or availability.
  const trip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t.name,
    description: t.description,
    touristType: t.ideal,
    ...(siteUrl && {
      url: `${siteUrl}/journeys/${t.id}/`,
      image: `${siteUrl}/assets/${t.image}`,
    }),
    itinerary: {
      "@type": "ItemList",
      numberOfItems: t.itinerary.length,
      itemListElement: t.itinerary.map((day, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Day ${i + 1}`,
        description: day,
      })),
    },
    provider: {
      "@type": "TravelAgency",
      name: "Canty Tours",
      telephone: phone.tel,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so the data can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trip).replace(/</g, "\\u003c"),
        }}
      />
      <JourneyDetail tour={t} related={relatedTours(getContent().tours, t)} />
    </>
  );
}
