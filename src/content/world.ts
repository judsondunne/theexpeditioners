import type { BookSlug, SourceRef } from "./types";

/*
 * The world of the books, limited strictly to what official copy and
 * professional reviews state. Nothing here is invented lore; each entry has a
 * source. If an entry needs more detail, add it from the books themselves and
 * record the page reference in `source.note`.
 */

const pw: SourceRef = { label: "Publishers Weekly review of Book One", url: "https://www.publishersweekly.com/978-1-938073-06-9" };
const kirkus1: SourceRef = {
  label: "Kirkus Reviews, Book One",
  url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/",
};
const kirkus2: SourceRef = {
  label: "Kirkus Reviews, Book Two",
  url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/the-expeditioners-and-the-secret-of-king-tritons-l/",
};
const series: SourceRef = { label: "Series description, sarahstewarttaylor.com", url: "https://www.sarahstewarttaylor.com/expeditioners" };
const back = (n: 1 | 2 | 3): SourceRef => ({
  label: `Back cover, Book ${["One", "Two", "Three"][n - 1]}, Harlow Brook Books paperback (2019)`,
});
const boingBoing1: SourceRef = {
  label: "Boing Boing review of Book One, as printed on the Book One back cover",
  url: "https://boingboing.net/2013/08/20/the-expeditioners-and-the-trea.html",
};
const jacketMap: SourceRef = { label: "Katherine Roy's map on the reverse of the 2012 Book One jacket" };

export interface Character {
  id: string;
  name: string;
  epithet?: string;
  lines: string[];
  sources: SourceRef[];
}

export const characters: Character[] = [
  {
    id: "kit",
    name: "Kit West",
    epithet: "the brain",
    lines: ["The middle sibling, thirteen when the story begins, and the one who tells it.", "It is Kit who is led to half of his father's strange map."],
    sources: [series, pw, kirkus1, back(1)],
  },
  {
    id: "mk",
    name: "M.K. West",
    epithet: "the tinkerer",
    lines: ["The youngest West and the family inventor, never far from a wrench.", "Kirkus called her wrench-wielding, smart-mouthed and fearless."],
    sources: [series, kirkus1],
  },
  {
    id: "zander",
    name: "Zander West",
    epithet: "the brave",
    lines: ["The eldest of the three, fourteen in Book One.", "Kirkus Reviews introduces him simply as “brave Zander.”"],
    sources: [series, pw, kirkus1],
  },
];

export const adults: Character[] = [
  {
    id: "alexander",
    name: "Alexander West",
    lines: ["Their father: a famed Explorer of the Realm, presumed dead in the Fazian rainforest, whose maps keep turning up for his children."],
    sources: [back(1), back(2)],
  },
  {
    id: "clockwork",
    name: "The Explorer with the Clockwork Hand",
    lines: ["A mysterious figure who leads Kit to the first half-map and turns up again in Book Two."],
    sources: [back(1), kirkus2],
  },
];

export interface Place {
  name: string;
  detail: string;
  book: BookSlug;
  source: SourceRef;
}

export const places: Place[] = [
  { name: "The Fazian rainforest", detail: "Where Alexander West is presumed dead.", book: "the-treasure-of-drowned-mans-canyon", source: back(1) },
  {
    name: "Drowned Man's Canyon",
    detail: "A remote canyon in the Arizona desert, mapped by Katherine Roy on the back of the original Book One jacket.",
    book: "the-treasure-of-drowned-mans-canyon",
    source: back(1),
  },
  {
    name: "The Academy for the Exploratory Sciences",
    detail: "Where the West siblings become students in Book Two.",
    book: "the-secret-of-king-tritons-lair",
    source: back(2),
  },
  {
    name: "A hidden island in the Caribbean",
    detail: "An island known for its deadly storms.",
    book: "the-secret-of-king-tritons-lair",
    source: back(2),
  },
  { name: "The Simerian Desert", detail: "Crossed on Kit's first secret mission.", book: "the-lost-city-of-maps", source: back(3) },
  { name: "A secret desert city", detail: "A city known only in legend.", book: "the-lost-city-of-maps", source: back(3) },
];

export interface Marvel {
  name: string;
  detail: string;
  source: SourceRef;
  spot: "gear" | "airship" | "slug" | "condor" | "octopus" | "diver" | "pocketwatch" | "compass";
}

export const marvels: Marvel[] = [
  {
    name: "Steam & clockwork",
    detail: "With the computers gone, steam and clockwork technology take the place of gasoline and electricity.",
    source: pw,
    spot: "gear",
  },
  { name: "A clockwork hand", detail: "Worn by the mysterious Explorer who sets the story moving.", source: back(1), spot: "pocketwatch" },
  { name: "Airships and gliders", detail: "Among the ways the chase in Book One travels, along with boxcars.", source: boingBoing1, spot: "airship" },
  { name: "Giant green slugs and huge birds", detail: "Two of the dangers the siblings face in Book One.", source: kirkus1, spot: "slug" },
  {
    name: "Mechanical sea turtles",
    detail: "Telepathic ones: among the exotic creatures of Book Two, along with amphibious killer eels.",
    source: kirkus2,
    spot: "diver",
  },
];

export const institutions = [
  {
    name: "The Bureau of Newly Discovered Lands",
    detail: "The corrupt government bureau that covets the treasure in Book One.",
    source: pw,
  },
  { name: "Explorers of the Realm", detail: "The title held by Alexander West, the most famous of them.", source: back(1) },
] as const;

/** Places labelled on Katherine Roy's official map, with positions as fractions of the image. */
export const jacketMapPlaces = [
  { name: "Drowned Man's Canyon", x: 0.235, y: 0.43 },
  { name: "Ghost Falls", x: 0.155, y: 0.555 },
  { name: "Foley's Peak", x: 0.12, y: 0.145 },
  { name: "Twin Peaks", x: 0.375, y: 0.38 },
  { name: "Azure Creek", x: 0.4, y: 0.24 },
  { name: "Azure Canyon", x: 0.625, y: 0.12 },
  { name: "Azure Falls", x: 0.715, y: 0.22 },
  { name: "Azure City", x: 0.67, y: 0.27 },
  { name: "Azure Peak", x: 0.595, y: 0.38 },
  { name: "Phantom Peak", x: 0.893, y: 0.473 },
] as const;

export const jacketMapSource = jacketMap;
