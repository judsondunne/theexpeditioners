import { IBM_Plex_Mono, League_Gothic, Libre_Caslon_Text, Reenie_Beanie } from "next/font/google";

/** Display: a 1903 American wood-type gothic — period-right for an expedition broadside. */
export const league = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league",
  display: "swap",
});

/** Paperback-style serif, matched to the cover subtitle and author line. */
export const newsreader = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["400", "700"],
  display: "swap",
});

/** Retained font asset for existing printable and social-card artwork. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

/** Pencil marginalia — used sparingly and always decoratively. */
export const reenie = Reenie_Beanie({
  subsets: ["latin"],
  variable: "--font-reenie",
  weight: "400",
  display: "swap",
  preload: false,
});

export const fontVariables = [league.variable, newsreader.variable, plexMono.variable, reenie.variable].join(" ");
