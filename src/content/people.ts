import type { Person } from "./types";

/*
 * Factual biographies adapted from the creators’ official introductions.
 * Portrait provenance and book-list sources are recorded in docs/ASSET_MANIFEST.md
 * and docs/CONTENT_VERIFICATION.md.
 */

export const author: Person = {
  id: "author",
  name: "S. S. Taylor",
  alsoKnownAs: ["Sarah Stewart Taylor"],
  role: "Author",
  bio: {
    paragraphs: [
      "Sarah Stewart Taylor is the author of The Expeditioners trilogy, the Sweeney St. George mysteries set in New England, the Maggie D’Arcy mysteries set in Ireland and on Long Island, and Agony Hill and Hunter’s Heart Ridge, set in rural Vermont in the 1960s.",
      "Her work has been nominated for the Agatha Award, the Dashiell Hammett Prize and the Mystery Writers of America’s Sue Grafton Memorial Award, and her mysteries have appeared on numerous best-of-the-year lists. She also wrote Amelia Earhart: This Broad Ocean, an Eisner Award-nominated graphic novel illustrated by Ben Towle.",
      "A former journalist and teacher, Sarah lives and writes on a Vermont farm with her family, where they raise sheep and grow blueberries. Her journalism has appeared in The Washington Post, The New York Times and The Boston Globe.",
    ],
    status: "verified",
    sources: [
      { label: "sarahstewarttaylor.com — The Expeditioners", url: "https://www.sarahstewarttaylor.com/expeditioners" },
      { label: "sarahstewarttaylor.com — About", url: "https://www.sarahstewarttaylor.com/about" },
      { label: "sarahstewarttaylor.com — Other books", url: "https://www.sarahstewarttaylor.com/other-books" },
      { label: "Hachette contributor page for S. S. Taylor", url: "https://www.littlebrownlibrary.com/contributor/s-s-taylor/" },
      { label: "National Endowment for the Humanities — Sarah Stewart Taylor", url: "https://www.neh.gov/humanities/author/sarah-stewart-taylor" },
    ],
  },
  links: [
    { label: "sarahstewarttaylor.com", url: "https://www.sarahstewarttaylor.com/" },
    { label: "Instagram", url: "https://www.instagram.com/sarahstewarttaylor/" },
    { label: "Facebook", url: "https://www.facebook.com/SarahStewartTaylorAuthor" },
  ],
};

export const illustrator: Person = {
  id: "illustrator",
  name: "Katherine Roy",
  role: "Illustrator",
  bio: {
    paragraphs: [
      "Katherine Roy is an author and illustrator of children’s books about science and the natural world. Her books include Neighborhood Sharks: Hunting with the Great Whites of California’s Farallon Islands, a Robert F. Sibert Honor book; How to Be an Elephant: Growing Up in the African Wild; and Making More: How Life Begins, winner of the 2023 Oregon Spirit Book Award for Nonfiction.",
      "She illustrated The Expeditioners and The Secret of King Triton’s Lair, drawing the covers, interior art and the original Drowned Man’s Canyon jacket map. Her other illustrated books include Otis and Will Discover the Deep and Sea Without a Shore by Barb Rosenstock, The Fire of Stars by Kirsten W. Larson, Red Rover by Richard Ho, and Chasing Eruptions by Curtis Manley.",
      "Katherine lives in western Oregon with her husband and sons. Alongside writing and drawing, she shares science and nature crafts with children through local television appearances. She is represented by Stephen Barr at Writers House.",
    ],
    status: "verified",
    sources: [
      { label: "Katherine Roy — official biography", url: "https://www.katherineroy.com/about" },
      { label: "Kirkus Reviews listing for Book One", url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/" },
      { label: "Katherine Roy's blog, 2012–2015 (archived) — jacket map and cover process posts" },
    ],
  },
  links: [{ label: "katherineroy.com", url: "https://www.katherineroy.com/" }],
};

/** Book lists checked against the creators’ official websites and publishers, October 2026. */
export const authorBibliography = [
  { title: "The Expeditioners", href: "/books", books: ["The Expeditioners and the Treasure of Drowned Man’s Canyon", "The Expeditioners and the Secret of King Triton’s Lair", "The Expeditioners and the Lost City of Maps"] },
  { title: "Sweeney St. George", href: "https://www.sarahstewarttaylor.com/sweeney-st-george", books: ["O’ Artful Death", "Mansions of the Dead", "Judgment of the Grave", "Still as Death"] },
  { title: "Maggie D’Arcy", href: "https://www.sarahstewarttaylor.com/maggie-d-arcy-series", books: ["The Mountains Wild", "A Distant Grave", "The Drowning Sea", "A Stolen Child"] },
  { title: "Franklin Warren and Alice Bellows", href: "https://www.sarahstewarttaylor.com/", books: ["Agony Hill", "Hunter’s Heart Ridge"] },
  { title: "Short fiction", href: "https://us.macmillan.com/books/9781250378552/mudseason/", books: ["Mud Season: A Bethany, Vermont Story"] },
  { title: "Graphic novel", href: "https://www.sarahstewarttaylor.com/other-books", books: ["Amelia Earhart: This Broad Ocean — illustrated by Ben Towle"] },
];

export const illustratorBibliography = [
  { title: "Written and illustrated by Katherine Roy", books: ["Neighborhood Sharks: Hunting with the Great Whites of California’s Farallon Islands", "How to Be an Elephant: Growing Up in the African Wild", "Making More: How Life Begins"] },
  { title: "Illustrated by Katherine Roy", books: ["The Expeditioners and the Treasure of Drowned Man’s Canyon — S. S. Taylor", "The Expeditioners and the Secret of King Triton’s Lair — S. S. Taylor", "Otis and Will Discover the Deep — Barb Rosenstock", "Red Rover — Richard Ho", "The Fire of Stars — Kirsten W. Larson", "Sea Without a Shore — Barb Rosenstock", "Chasing Eruptions — Curtis Manley"] },
];
