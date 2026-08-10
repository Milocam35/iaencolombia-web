const configuredAdminPlatformUrl =
  process.env.NEXT_PUBLIC_ADMIN_PLATFORM_URL?.trim();

export const ADMIN_PLATFORM_URL =
  configuredAdminPlatformUrl || "https://admin.iaencolombia.org/login";

const configuredAciaApiUrl = process.env.NEXT_PUBLIC_ACIA_API_URL?.trim();

export const ACIA_API_URL = (
  configuredAciaApiUrl || "https://plataforma-acia-u40543.vm.elestio.app"
).replace(/\/+$/, "");
