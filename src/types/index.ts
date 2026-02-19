export type ButtonVariant = "default" | "secondary" | "outline" | "ghost";

export interface NavLink {
  label: string;
  href: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant: ButtonVariant;
}

export interface Pillar {
  icon: "brain" | "handshake" | "rocket";
  title: string;
  description: string;
}
