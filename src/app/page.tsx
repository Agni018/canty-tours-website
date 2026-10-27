import { CompareBar } from "@/components/overlays/CompareBar";
import { CompareDialog } from "@/components/overlays/CompareDialog";
import { Approach } from "@/components/sections/Approach";
import { BeyondKerala } from "@/components/sections/BeyondKerala";
import { Destinations } from "@/components/sections/Destinations";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { IntroStrip } from "@/components/sections/IntroStrip";
import { Journeys } from "@/components/sections/Journeys";
import { PlanSection } from "@/components/sections/PlanSection";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroStrip />
      <Destinations />
      <Journeys />
      <Approach />
      <Testimonials />
      <BeyondKerala />
      <PlanSection />
      <Faq />
      <CompareBar />
      <CompareDialog />
    </>
  );
}
