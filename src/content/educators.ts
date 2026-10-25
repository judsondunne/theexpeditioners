import type { BookSlug, SourceRef } from "./types";

/*
 * Classroom material. Everything here is ORIGINAL to this site (status:
 * original-copy) unless a source is given, and is written to avoid spoilers.
 * No curriculum-standards alignment is claimed.
 */

export const themes: { title: string; text: string; source?: SourceRef }[] = [
  {
    title: "Maps, and what we can't see",
    text: "The series begins from a startling idea: that the maps of the world might be wrong. Kirkus Reviews singled out a line from Book One, “We know only what we can see,” which makes a natural starting point for talking about how maps are made, who makes them and what they leave out.",
    source: { label: "Kirkus Reviews, Book One", url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/" },
  },
  {
    title: "Codes, clues and careful thinking",
    text: "In Book One the siblings have to break a code hidden in an old book before they can follow their father's trail. Readers who like puzzles will want to try it themselves.",
    source: { label: "Kirkus Reviews, Book One", url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/" },
  },
  {
    title: "Three siblings, three strengths",
    text: "Kit is the brain, M.K. the tinkerer, Zander the brave. The books give students a way to talk about different kinds of intelligence and courage, and about working as a team.",
    source: { label: "Series description, sarahstewarttaylor.com", url: "https://www.sarahstewarttaylor.com/expeditioners" },
  },
  {
    title: "What if history had gone differently?",
    text: "In this world computers were invented in 1880 and failed a century later, leaving steam and clockwork in place of gasoline and electricity. It is a ready-made prompt for alternate-history thinking in social studies and science.",
    source: { label: "Publishers Weekly review of Book One", url: "https://www.publishersweekly.com/978-1-938073-06-9" },
  },
  {
    title: "Who owns a discovery?",
    text: "Kirkus noted the first book's underlying concern with the mistreatment of natural resources and of indigenous peoples. Discoveries in these books always raise the question of who has a claim to them.",
    source: { label: "Kirkus Reviews, Book One", url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/" },
  },
];

export const discussion: { book: BookSlug; questions: string[] }[] = [
  {
    book: "the-treasure-of-drowned-mans-canyon",
    questions: [
      "The series asks what it would mean to find out that the maps of the world were all wrong. What would change in your life if you couldn't trust a map?",
      "Kit, M.K. and Zander are called the brain, the tinkerer and the brave. Which fits you best? Can one person be all three?",
      "Their father leaves them only half of a map. Why might someone leave a puzzle instead of plain instructions?",
      "In this world, steam and clockwork do the work of electricity. What everyday things would be different? What would stay the same?",
      "Government agents want the map too. Who should a discovery belong to: the person who finds it, the government, or the people who already live there?",
    ],
  },
  {
    book: "the-secret-of-king-tritons-lair",
    questions: [
      "The siblings become students at the Academy for the Exploratory Sciences. What would you most want to learn at a school for explorers?",
      "Kit follows another of his father's maps while two world powers move toward war. How can a personal quest and big world events pull against each other?",
      "Some places stay unexplored because of storms and shipwrecks. What makes a place truly unknown: danger, distance or something else?",
    ],
  },
  {
    book: "the-lost-city-of-maps",
    questions: [
      "Kit sets out on a secret mission. How does a story change when a character has to act on their own?",
      "The book's search is for a city known only in legend. What is the difference between a legend and a fact, and how could an explorer tell them apart?",
      "Looking back over the trilogy, what do you think the maps were meant to teach the West children?",
    ],
  },
];

export interface Activity {
  id: string;
  title: string;
  time: string;
  summary: string;
  steps: string[];
  download?: { href: string; label: string; size: string };
  origin: string;
}

export const activities: Activity[] = [
  {
    id: "map-the-mistake",
    title: "Map it, then find the mistake",
    time: "45–60 minutes",
    summary:
      "S. S. Taylor has loved maps since she was ten, when she spotted a mistake on a map of her own neighborhood. Students draw a map of a place they know well, then trade maps and go looking for the errors.",
    steps: [
      "Each student draws a map of a familiar place: the route to school, the playground, their street. Add a title, a compass rose and a key.",
      "Swap maps with a partner. The partner checks the map against the real place (or a photo of it) and marks anything missing or misplaced.",
      "Discuss: What did every map leave out? Who decides what goes on a map? How could a map be wrong without anyone noticing?",
      "Finish with the printable field sheet: one clean final map, plus three things the mapmaker knows that the map doesn't show.",
    ],
    download: { href: "/downloads/mapmakers-field-sheet.pdf", label: "Mapmaker's field sheet (PDF)", size: "1 page" },
    origin: "Activity written for this site, inspired by the author's own story.",
  },
  {
    id: "send-a-dispatch",
    title: "Send a dispatch",
    time: "20–30 minutes",
    summary:
      "Before computers and email, news from far-off places travelled by telegraph, and every word cost money. Students write a dispatch of no more than 25 words announcing a land that appears on no map.",
    steps: [
      "Imagine you have just found a place no map shows. What is the single most important thing to report?",
      "Write it as a telegram: capital letters, no more than 25 words, and STOP instead of a full stop.",
      "Trade dispatches. Can your reader picture the place? Revise to make every word count.",
    ],
    origin: "Activity written for this site.",
  },
  {
    id: "book-cipher",
    title: "Break the code",
    time: "30–45 minutes",
    summary:
      "In Book One, the siblings have to crack a code hidden in an old book. Students build a simple book cipher and challenge each other to decode it.",
    steps: [
      "Pairs choose the same book (any classroom copy will do).",
      "Write a short secret message, then replace each word with three numbers: page, line and word position.",
      "Swap ciphers with another pair, who decode them using the same book. Talk about why the code is useless without the key.",
    ],
    origin: "Activity written for this site.",
  },
  {
    id: "explorers-vest",
    title: "Design your own Explorer's vest",
    time: "30 minutes",
    summary:
      "Kit's Explorer's vest is full of pockets, each holding something an explorer might need. This printable from the original series website asks readers to design their own.",
    steps: [
      "Look at Katherine Roy's drawing of Kit's vest on the Explore page.",
      "Print the outline and decide what goes in each pocket, and why. Label every item.",
      "Share: what would you pack for a land no one has mapped?",
    ],
    download: { href: "/downloads/explorers-vest-activity.pdf", label: "Explorer's vest printable (PDF)", size: "1 page" },
    origin: "Printable from the original series website, with art by Katherine Roy. Confirm before re-publishing.",
  },
];
