import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { MembershipPlansSection } from "@/components/sections/MembershipPlansSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GovernanceSection } from "@/components/sections/GovernanceSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PillarsSection />
        <ValueSection />
        <MembershipPlansSection />
        <EventsSection />
        <GovernanceSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
