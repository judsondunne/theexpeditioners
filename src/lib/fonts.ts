import { IBM_Plex_Mono, League_Gothic, Newsreader, Reenie_Beanie } from "next/font/google";

/** Display: a 1903 American wood-type gothic — period-right for an expedition broadside. */
export const league = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league",
  display: "swap",
});

/** Text and editorial statements: a variable serif with optical sizes and true italics. */
export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

/** Technical labels, navigation, coordinates. */
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
