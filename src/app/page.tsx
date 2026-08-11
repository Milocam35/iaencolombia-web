import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { MembershipPlansSection } from "@/components/sections/MembershipPlansSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GovernanceSection } from "@/components/sections/GovernanceSection";
import { CTASection } from "@/components/sections/CTASection";
import { CapabilitiesSection, CommunicationsSection, KnowledgeSection, RoadmapSection } from "@/components/sections/InstitutionalSections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PillarsSection />
        <CapabilitiesSection />
        <ValueSection />
        <MembershipPlansSection />
        <EventsSection />
        <RoadmapSection />
        <KnowledgeSection />
        <CommunicationsSection />
        <GovernanceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
