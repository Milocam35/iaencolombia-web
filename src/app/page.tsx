import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsTicker } from "@/components/sections/NewsTicker";
import {
  MembershipProfileProvider,
  ProfileSelector,
} from "@/components/sections/MembershipProfile";
import { ValueSection } from "@/components/sections/ValueSection";
import { InstitutionalVideo } from "@/components/sections/InstitutionalVideo";
import { UniverseSection } from "@/components/sections/UniverseSection";
import { AlliancesSection } from "@/components/sections/AlliancesSection";
import { MembershipPlansSection } from "@/components/sections/MembershipPlansSection";
import { EventsSection } from "@/components/sections/EventsSection";
import {
  KnowledgeSection,
  CommunicationsSection,
} from "@/components/sections/InstitutionalSections";
import { NewslettersSection } from "@/components/sections/NewslettersSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { CTASection } from "@/components/sections/CTASection";
import { PRESIDENT_VIDEO } from "@/data/publicExperience";
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="public-home opcion3-home">
        <HeroSection />
        <NewsTicker />
        <MembershipProfileProvider>
          <div className="site-container op3-conversion">
            <ValueSection />
            <ProfileSelector />
            <UniverseSection />
          </div>
          <div className="op3-editorial-band">
            <div className="site-container op3-editorial-columns">
              <InstitutionalVideo resource={PRESIDENT_VIDEO} />
              <AlliancesSection />
              <Suspense
                fallback={
                  <section
                    className="op3-editorial newsletter-loading"
                    aria-busy="true"
                    aria-label="Cargando actualidad"
                  >
                    <h2>Conocimiento y actualidad</h2>
                    <p>Cargando ediciones de ACIA al día…</p>
                  </section>
                }
              >
                <NewslettersSection />
              </Suspense>
            </div>
          </div>
          <MembershipPlansSection />
        </MembershipProfileProvider>
        <EventsSection />
        <KnowledgeSection />
        <CommunicationsSection />
        <PillarsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
