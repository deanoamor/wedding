// Ganti NEXT_PUBLIC_SITE_URL dengan domain asli sebelum rilis (mis. https://www.boendaida.id).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://boendaida.id").replace(/\/$/, "");
export const SITE_NAME = "Boenda Ida Wedding Organizer";
