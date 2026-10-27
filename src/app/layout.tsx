import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { JourneyProvider } from "@/components/JourneyProvider";
import { PrivacyDialog } from "@/components/overlays/PrivacyDialog";
import { Toast } from "@/components/overlays/Toast";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { phone } from "@/data/site";
import { getContent } from "@/lib/content";
import "./globals.css";

// Self-hosted at build time by next/font (no request to Google from the visitor's browser).
// Both are variable fonts, so every weight the CSS asks for is available.
const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const title = "Canty Tours — Kerala holidays, at your pace";
const description =
  "Plan a Kerala holiday with Canty Tours: Munnar, Alleppey, Thekkady, Wayanad and the coast. Compare sample itineraries, or plan a trip across India.";

// Public address of the site (e.g. https://user.github.io/repo), set by the deploy workflow.
// Link previews (WhatsApp, social) need absolute image URLs, so builds without it leave the
// image out rather than point at the wrong host.
const siteUrl = process.env.SITE_URL;
// The 960px copy: WhatsApp skips preview images much over 300 KB.
const previewImage = {
  url: "assets/kerala-960.jpg",
  width: 960,
  height: 540,
  alt: "A traditional boat on Kerala’s palm-lined backwaters",
};

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  openGraph: {
    type: "website",
    siteName: "Canty Tours",
    locale: "en_IN",
    title,
    description,
    ...(siteUrl && { url: "./", images: [previewImage] }),
  },
  twitter: {
    card: siteUrl ? "summary_large_image" : "summary",
    title,
    description,
  },
};

// Search data describing the business. Only facts shown on the site: no ratings or prices.
const travelAgency = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Canty Tours",
  description,
  telephone: phone.tel,
  areaServed: ["Kerala", "India"],
  ...(siteUrl && { url: siteUrl, image: `${siteUrl}/assets/kerala-960.jpg` }),
};

export const viewport: Viewport = {
  themeColor: "#0b3b2e",
};

/** Every page: header, footer and the site-wide dialogs around the page content. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // "<" is escaped so the data can never close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(travelAgency).replace(/</g, "\\u003c"),
          }}
        />
        <JourneyProvider content={getContent()}>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <PrivacyDialog />
          <Toast />
        </JourneyProvider>
      </body>
    </html>
  );
}
