import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewStageSection } from "@/components/sections/NewStageSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { InternationalSection } from "@/components/sections/InternationalSection";
import { GovernanceSection } from "@/components/sections/GovernanceSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NewStageSection />
        <PillarsSection />
        <ValueSection />
        <EventsSection />
        <InternationalSection />
        <GovernanceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
