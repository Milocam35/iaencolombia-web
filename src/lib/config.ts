export const ADMIN_PLATFORM_URL = "https://admin.iaencolombia.org";

export const MEMBER_PORTAL_URL = "https://mi.iaencolombia.org";

export const AFFILIATION_PATH = "/afiliate";

const configuredAciaApiUrl = process.env.NEXT_PUBLIC_ACIA_API_URL?.trim();

export const ACIA_API_URL = (
  configuredAciaApiUrl || "https://plataforma-acia-u40543.vm.elestio.app"
).replace(/\/+$/, "");

export const ACIA_EQUIPO_URL =
  process.env.NEXT_PUBLIC_ACIA_EQUIPO_URL?.trim() || "/equipo";

export const ACIA_PAPERS_URL =
  process.env.NEXT_PUBLIC_ACIA_PAPERS_URL?.trim() || "/papers";

export const ACIA_OBSERVATORIO_URL =
  process.env.NEXT_PUBLIC_ACIA_OBSERVATORIO_URL?.trim() || "/observatorio";

export const BOLD_MEMBERSHIP_PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_ENABLED?.trim().toLowerCase() ===
  "true";

export const BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED =
  process.env.NEXT_PUBLIC_BOLD_MEMBERSHIP_PAYMENTS_SANDBOX_NOTICE_ENABLED?.trim().toLowerCase() ===
  "true";
