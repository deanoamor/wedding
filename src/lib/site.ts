// Public origin and base path. Override NEXT_PUBLIC_SITE_URL once a custom domain is live.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://deanoamor.github.io").replace(/\/$/, "");
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}/`;

export const SITE_NAME = "Boenda Ida Wedding Organizer";
export const SITE_TITLE = "Wedding Organizer Jakarta, Perencanaan Pernikahan Terpadu | Boenda Ida";
export const SITE_DESCRIPTION =
  "Boenda Ida, wedding organizer di Jakarta sejak 2014. Perencanaan pernikahan terpadu: layanan, menu katering, pilihan gedung, dan koordinasi hari-H.";
