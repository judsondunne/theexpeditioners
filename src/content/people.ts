import type { Person } from "./types";

/*
 * Author and illustrator. Biographies are short and factual; every line has a
 * source. Photos are only shown once the family supplies an approved,
 * credited portrait (see docs/ASSET_MANIFEST.md).
 */

export const author: Person = {
  id: "author",
  name: "S. S. Taylor",
  alsoKnownAs: ["Sarah Stewart Taylor"],
  role: "Author",
  bio: {
    paragraphs: [
      "S. S. Taylor is the name Sarah Stewart Taylor writes under for The Expeditioners, her illustrated adventure trilogy for young readers.",
      "A former journalist and teacher, she lives on a farm in Vermont, where her family raises sheep and grows blueberries. She has loved maps since she was ten, when she found a mistake on a map of her own neighborhood.",
      "As Sarah Stewart Taylor she also writes mysteries for adults, including the Sweeney St. George and Maggie D'arcy series and the Vermont novels Agony Hill and Hunter's Heart Ridge, and she wrote the graphic novel Amelia Earhart: This Broad Ocean, illustrated by Ben Towle.",
    ],
    status: "verified",
    sources: [
      { label: "sarahstewarttaylor.com — The Expeditioners", url: "https://www.sarahstewarttaylor.com/expeditioners" },
      { label: "sarahstewarttaylor.com — About", url: "https://www.sarahstewarttaylor.com/about" },
      { label: "sarahstewarttaylor.com — Other books", url: "https://www.sarahstewarttaylor.com/other-books" },
      { label: "Hachette contributor page for S. S. Taylor", url: "https://www.littlebrownlibrary.com/contributor/s-s-taylor/" },
      { label: "Original series website biography (archived) — source of the map anecdote" },
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
      "Katherine Roy drew the covers and interior illustrations for The Expeditioners, including the map of Drowned Man's Canyon printed on the back of the original Book One jacket.",
      "She is the author and illustrator of acclaimed nonfiction picture books, among them Neighborhood Sharks, a Sibert Honor book, How to Be an Elephant and Making More. She lives in western Oregon.",
    ],
    status: "verified",
    sources: [
      { label: "katherineroy.com — About", url: "https://www.katherineroy.com/" },
      { label: "Kirkus Reviews listing for Book One", url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/" },
      { label: "Katherine Roy's blog, 2012–2015 (archived) — jacket map and cover process posts" },
    ],
  },
  links: [{ label: "katherineroy.com", url: "https://www.katherineroy.com/" }],
};
