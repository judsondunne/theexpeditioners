import type { SourceRef } from "./types";

/*
 * The homepage story: a short scroll sequence that sets up Book One and ends
 * on its question. Every line is grounded in a source below — the premise in
 * Publishers Weekly and Kirkus, the characters in the author's own series
 * copy, the plot in Book One's back cover. Wording is original to this site.
 */

const pw: SourceRef = {
  label: "Publishers Weekly review of Book One",
  url: "https://www.publishersweekly.com/978-1-938073-06-9",
};
const back1: SourceRef = { label: "Back cover, Book One, Harlow Brook Books paperback (2019)" };
const authorSite: SourceRef = {
  label: "Series description on the author's website (also the original McSweeney's jacket copy)",
  url: "https://www.sarahstewarttaylor.com/expeditioners",
};

export interface StoryBeat {
  id: string;
  /** Small running label, e.g. "1880 — 1980". */
  kicker: string;
  /** Lines appear one after another as the reader scrolls through the beat. */
  lines: string[];
  sources: SourceRef[];
}

export const storyBeats: StoryBeat[] = [
  {
    id: "machines",
    kicker: "1880 — 1980",
    lines: ["In 1880, the world built its first computers.", "A century later, they failed."],
    sources: [pw],
  },
  {
    id: "edges",
    kicker: "The maps were wrong",
    lines: [
      "Strange lands turned up that no map had ever shown.",
      "Steam and clockwork took the place of electricity, and the race to explore began.",
    ],
    sources: [pw, authorSite],
  },
  {
    id: "dispatch",
    kicker: "A dispatch",
    lines: [
      "Alexander West, famed Explorer of the Realm, is presumed dead.",
      "Then a man with a clockwork hand leads his son Kit to half of a strange map.",
    ],
    sources: [back1],
  },
  {
    id: "siblings",
    kicker: "The Expeditioners",
    lines: ["Kit, the brain.", "M.K., the tinkerer.", "Zander, the brave."],
    sources: [authorSite],
  },
  {
    id: "canyon",
    kicker: "Arizona",
    lines: [
      "With government agents on their trail, they follow the map to a remote canyon in the Arizona desert,",
      "and a fabled treasure in gold.",
    ],
    sources: [back1, pw],
  },
];

export const storyQuestion = {
  kicker: "Book One",
  text: "But what is waiting at the bottom of Drowned Man's Canyon?",
};

/** Typed out on the dispatch slip in the third beat. */
export const dispatchText = "FAMED EXPLORER OF THE REALM ALEXANDER WEST PRESUMED DEAD IN FAZIAN RAINFOREST STOP";
