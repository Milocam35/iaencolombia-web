"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { MembershipCategoryId } from "@/lib/membershipPlans";
import { PROFILES } from "@/data/publicExperience";
import { EditorialIcon } from "@/components/ui/EditorialIcon";
const ProfileContext = createContext<{
  category: MembershipCategoryId;
  select: (category: MembershipCategoryId) => void;
} | null>(null);
export function MembershipProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [category, select] = useState<MembershipCategoryId>("personas");
  return (
    <ProfileContext.Provider value={{ category, select }}>
      {children}
    </ProfileContext.Provider>
  );
}
export function useMembershipProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw Error("Se requiere MembershipProfileProvider");
  return value;
}
export function ProfileSelector() {
  const { category, select } = useMembershipProfile();
  function choose(value: MembershipCategoryId) {
    select(value);
    requestAnimationFrame(() => {
      const target = document.getElementById("planes");
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  return (
    <section id="perfiles" className="op3-profile">
      <div className="op3-block-heading">
        <h2>Encuentra tu lugar en ACIA</h2>
        <p>Explora los beneficios y planes según tu perfil.</p>
      </div>
      <div
        className="op3-profile-list"
        role="group"
        aria-label="Elige tu perfil de afiliación"
      >
        {PROFILES.map((profile, i) => (
          <button
            key={profile.category}
            type="button"
            className="profile-card"
            aria-pressed={category === profile.category}
            aria-controls="membership-plans-panel"
            onClick={() => choose(profile.category)}
          >
            <span className="profile-icon">
              <EditorialIcon
                name={(["person", "company", "institution"] as const)[i]}
              />
            </span>
            <span>
              <strong>{profile.title}</strong>
              <span className="profile-description">{profile.description}</span>
            </span>
            <span className="profile-arrow" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>
      <a className="text-link" href="#planes">
        Ver todos los planes de afiliación <span aria-hidden="true">→</span>
      </a>
      <p className="op3-profile-note">
        Incluye Comunidad / Freemium y las categorías de afiliación.
      </p>
    </section>
  );
}
