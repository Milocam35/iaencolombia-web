const configuredAdminPlatformUrl =
  process.env.NEXT_PUBLIC_ADMIN_PLATFORM_URL?.trim();

export const ADMIN_PLATFORM_URL =
  configuredAdminPlatformUrl || "https://plataforma-acia.vercel.app/login";
