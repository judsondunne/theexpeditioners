import Link from "next/link";
import { CipherPractice } from "@/components/educators/CipherPractice";
import type { ReactNode } from "react";
import type { JournalArticle } from "./types";

/*
 * The Journal: a few genuinely useful articles, not a blog for its own sake.
 * Only entries with `isPublished: true` are routed, listed and put in the
 * sitemap. Facts in articles come from the same sources as the rest of the
 * site (see docs/CONTENT_VERIFICATION.md).
 */

export interface Article extends JournalArticle {
  kicker: string;
  body: () => ReactNode;
}

export const articles: Article[] = [
  {
    slug: "what-is-steampunk-for-young-readers",
    title: "What is steampunk? A guide for young readers",
    kicker: "Steam, gears & what-if worlds",
    description: "What makes a story steampunk? Explore steam power, clockwork inventions and alternate history through the world of The Expeditioners, for readers ages 10–14.",
    published: "2026-10-25",
    isPublished: true,
    status: "original-copy",
    readingMinutes: 4,
    body: () => <>
      <p>Imagine a world full of airships, elaborate brass instruments and machines that tick, crank and hiss. Now imagine that those inventions are part of everyday life. You are somewhere close to steampunk.</p>
      <p>Steampunk stories take the look and inventions of the age of steam and ask what else might have been possible. A machine can feel old-fashioned and fantastical at the same time. The fun is in the question: <em>what if history had taken another turn?</em></p>
      <h2>Three clues that you are in a steampunk story</h2>
      <ol>
        <li><strong>The machinery matters.</strong> Steam engines, clockwork, airships or mechanical contraptions do work that might otherwise belong to modern technology.</li>
        <li><strong>The past has been rearranged.</strong> The world may borrow from the nineteenth century without following the history in your school textbook.</li>
        <li><strong>Inventiveness opens doors.</strong> A character who can repair a machine, read an instrument or understand how something works may have an advantage.</li>
      </ol>
      <p>These are useful clues, rather than a checklist every book has to pass. Steampunk can be adventurous, funny, mysterious or frightening. Its machines can be practical, absurd or a little of both.</p>
      <h2>How The Expeditioners uses steampunk</h2>
      <p>In S. S. Taylor&rsquo;s trilogy, computers were invented in 1880. A century later, they failed. Steam and clockwork took the place of electricity, and lands appeared that the maps had never shown.</p>
      <p>That is the setting, rather than real history. The strange turn gives the West siblings a world where making and reading maps matters, a man can have a clockwork hand, and an exploration can begin with a piece of paper instead of a screen.</p>
      <p>The machines support the mystery. Kit, M.K. and Zander are following clues left by their father. They have a map, people chasing them, and a canyon to reach. You do not need to know how a steam engine works to follow the adventure.</p>
      <h2>Steampunk is not the same as historical fiction</h2>
      <p>A historical novel sets its story in a recognizable past. A steampunk story can invent a different past, or a world that resembles one. When you read, ask which details could belong to our history and which have been changed.</p>
      <p>In The Expeditioners, the early arrival and later failure of computers are part of that invented history. A real map or an old engraving on this site can help create the atmosphere without being a picture of something that actually happened in the story.</p>
      <h2>A what-if challenge for your own story</h2>
      <p>Pick one ordinary object: a bicycle, a school bell, a flashlight. Imagine that it must work without electricity. Draw an invention that could take its place. Label what powers it and what might go wrong.</p>
      <p>Then give the inventor a problem to solve. A marvelous machine becomes more interesting when somebody needs it to work, right now.</p>
      <h2>Where to explore next</h2>
      <p>Visit the <Link href="/explore#map-room">3D Map Room</Link> to explore Drowned Man&rsquo;s Canyon, or <Link href="/journal/how-to-make-a-book-cipher">try making a book cipher</Link>. For the story itself, begin with <Link href="/books/the-treasure-of-drowned-mans-canyon">The Treasure of Drowned Man&rsquo;s Canyon</Link>, the first of <Link href="/books">three books in reading order</Link>.</p>
      <p>Teachers and reading groups can find <Link href="/educators">discussion questions and classroom activities</Link> to take the ideas further.</p>
    </>,
  },
  {
    slug: "how-to-make-a-book-cipher",
    title: "How to make a book cipher: a code-breaking activity",
    kicker: "Make a secret message",
    description: "Make and decode a book cipher with a worked example and an interactive encoder. A free code-breaking activity for curious readers, families and classrooms.",
    published: "2026-10-25",
    isPublished: true,
    status: "original-copy",
    readingMinutes: 5,
    body: () => <>
      <p>A book can hide more than a story. If two people have the same book, they can use the positions of its words to send each other a message made entirely of numbers.</p>
      <p>In Book One of The Expeditioners, the West siblings must crack a code hidden in an old book. The activity below is a simple book cipher you can make yourself; it is our own example, rather than the puzzle from the novel.</p>
      <h2>What you need</h2>
      <ul><li>Two copies of the same book and edition, or two copies of a short text you write yourself.</li><li>Paper and a pencil.</li><li>A partner who knows which text is the key.</li></ul>
      <p>The edition matters. Different printings may put the same words on different pages or lines. Start with a short homemade key so both readers count exactly the same way.</p>
      <h2>The rule: page, line, word</h2>
      <p>Choose a word in your key. Write down its page number, then its line number, then its position on that line. Keep each group together with dashes and separate groups with a slash.</p>
      <p>For example, <strong>1-2-1</strong> means page one, line two, word one. Count words from the left, and agree to ignore punctuation. Your partner looks up each group and writes the words in order.</p>
      <CipherPractice />
      <h2>Decode the example</h2>
      <p>Using the key above, <strong>1-2-1 / 1-1-1 / 1-1-2</strong> becomes <strong>FOLLOW THE MAP</strong>. &ldquo;Follow&rdquo; is the first word of the second line; &ldquo;The&rdquo; and &ldquo;map&rdquo; are the first two words of the first line.</p>
      <p>Try <strong>1-3-1 / 1-1-4 / 1-3-3</strong>. It points to &ldquo;Bring,&rdquo; &ldquo;a&rdquo; and &ldquo;compass.&rdquo; You can check your answer by typing it into the encoder.</p>
      <h2>Make a challenge for a friend</h2>
      <ol>
        <li>Write a three-line key containing the words you want to use. Give your partner an identical copy.</li>
        <li>Choose a message of three to six words. Replace each word with its page–line–word position.</li>
        <li>Pass along the numbers. Can your partner decode the message without asking for a hint?</li>
        <li>Swap jobs. If an answer is different, compare how you counted lines and words before changing the cipher.</li>
      </ol>
      <p>When you move to a real book, decide whether headings count as lines and how to handle words split across two lines. A clear shared rule is part of making a code that works.</p>
      <h2>Why does the key matter?</h2>
      <p>The numbers are instructions for finding words. Without the right key, they do not tell the reader where to look. With the key, anyone who understands the rule can recover the message.</p>
      <p>This is a puzzle for play, not a way to protect private information. For your challenge, use an invented message and pass the key separately from the numbers.</p>
      <h2>Turn the code into an expedition</h2>
      <p>Encode a clue that leads to a place on a map. Ask a partner to decode it, find the place, and leave a second clue. The next puzzle can use a new key.</p>
      <p>Try the <Link href="/educators/field-sheet">printable mapmaker&rsquo;s field sheet</Link> for drawing that map. There are more <Link href="/educators#activities">activities for classrooms and reading groups</Link>, and the adventure that inspired this one begins in <Link href="/books/the-treasure-of-drowned-mans-canyon">Book One of The Expeditioners</Link>.</p>
    </>,
  },

  {
    slug: "is-the-expeditioners-right-for-my-reader",
    title: "Is The Expeditioners right for my reader?",
    kicker: "A guide for parents",
    description:
      "Ages, reading level, length, illustrations and what reviewers said: everything a parent or gift-giver needs to decide whether The Expeditioners suits a young reader.",
    published: "2026-10-25",
    isPublished: true,
    status: "original-copy",
    readingMinutes: 4,
    body: () => (
      <>
        <p>
          If you have a reader who pores over maps, takes things apart to see how they work, or wants a story that keeps
          moving, The Expeditioners was written with them in mind. Here is what to know before you choose it.
        </p>
        <h2>Who it&rsquo;s for</h2>
        <p>
          Kirkus Reviews recommends the books for ages 10 to 14, and School Library Journal for grades 4 to 7. Book One
          has a Lexile measure of 880L, and Book Two 820L. In practice that makes the series a good fit for confident
          readers in upper elementary school and for middle schoolers, and a satisfying read-aloud for younger siblings
          who like adventure.
        </p>
        <h2>What kind of story it is</h2>
        <p>
          The trilogy is set in a world where history took a different turn: computers were invented in 1880 and
          failed a century later, leaving steam and clockwork machines in place of electricity, and leaving whole
          regions of the world unmapped. Into that world come three siblings, Kit, M.K. and Zander West, following maps
          left by their father, a famous explorer.
        </p>
        <p>
          Reviewers reached for words like clues, codes and maps. Kirkus called the first book &ldquo;full of kid
          power,&rdquo; and School Library Journal described it as steampunk done well, with enough danger and
          suspense to keep even reluctant readers turning pages.
        </p>
        <h2>How long the books are</h2>
        <ul>
          <li>Book One, The Treasure of Drowned Man&rsquo;s Canyon: 364 pages in the current paperback.</li>
          <li>Book Two, The Secret of King Triton&rsquo;s Lair: 380 pages.</li>
          <li>Book Three, The Lost City of Maps: 256 pages.</li>
        </ul>
        <p>
          The chapters move quickly, and the chases (by airship, glider and boxcar, among others) keep the pages
          turning.
        </p>
        <h2>Pictures</h2>
        <p>
          The books are illustrated in black and white by Katherine Roy, who also painted the covers of the first two.
          Her map of Drowned Man&rsquo;s Canyon is in the <Link href="/explore#map-room">Map Room</Link>.
        </p>
        <h2>Where to start</h2>
        <p>
          Start with Book One. The three books tell one continuous story, so they are best read in order.{" "}
          <Link href="/books">See all three books in order</Link>, or go straight to{" "}
          <Link href="/books/the-treasure-of-drowned-mans-canyon">Book One</Link>.
        </p>
        <h2>For teachers and book groups</h2>
        <p>
          Discussion questions and printable activities, including a map-making exercise, are on the{" "}
          <Link href="/educators">educators page</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "behind-the-books",
    title: "Behind the books: how a love of maps became The Expeditioners",
    kicker: "The making of the trilogy",
    description:
      "How S. S. Taylor's lifelong love of maps, a what-if about computers, and Katherine Roy's illustrations came together in The Expeditioners.",
    published: "2026-10-25",
    isPublished: true,
    status: "original-copy",
    readingMinutes: 4,
    body: () => (
      <>
        <p>
          Every expedition begins with a map, and so did this one. S. S. Taylor (the name Sarah Stewart Taylor uses for
          The Expeditioners) has loved maps since she was ten years old, when she noticed a mistake on a map of her own
          neighborhood. A map, she discovered, could be wrong.
        </p>
        <h2>A world that took a different turn</h2>
        <p>
          That idea grew into the premise of the series. In the world of The Expeditioners, computers were invented in
          1880 and failed a century later. When they did, strange lands turned up that appeared on no map, and steam and
          clockwork took the place of gasoline and electricity. Every back cover asks what it would be like to wake up
          one day and discover that the maps of the world were all wrong.
        </p>
        <h2>Three siblings and a half-map</h2>
        <p>
          The story belongs to the West children: Kit, the brain; M.K., the tinkerer; and Zander, the brave. Their
          father, Alexander West, is a famed Explorer of the Realm, and when he is presumed dead, a mysterious man with a
          clockwork hand leads Kit to half of a strange map. From there the trail runs to a remote canyon in the Arizona
          desert, to a hidden island in the Caribbean, and across the Simerian Desert.
        </p>
        <h2>Drawing the world</h2>
        <p>
          Katherine Roy illustrated the series. For the first hardcover edition, published by McSweeney&rsquo;s McMullens
          in 2012, the book jacket unfolded into her map of Drowned Man&rsquo;s Canyon. Her drawings of Kit&rsquo;s
          Explorer&rsquo;s vest and of the Explorer with the Clockwork Hand are on the{" "}
          <Link href="/explore#art">Explore page</Link>.
        </p>
        <h2>A trilogy in full</h2>
        <p>
          Book Two, The Secret of King Triton&rsquo;s Lair, followed in 2014. In 2019 Harlow Brook Books brought the
          first two books back in paperback and published the third, The Lost City of Maps, completing the trilogy.
        </p>
        <p>
          Along the way, Book One was named to the Dorothy Canfield Fisher Award master list in Vermont and the Texas
          Bluebonnet Award master list, two lists that young readers themselves vote on.
        </p>
        <p>
          <Link href="/books">Read the books in order</Link>.
        </p>
      </>
    ),
  },
];

export const publishedArticles = articles.filter((a) => a.isPublished);

export function getArticle(slug: string) {
  return publishedArticles.find((a) => a.slug === slug);
}

/** Planned articles: kept here so the plan lives with the content, never rendered. */
export const plannedArticles = [
  "Adventure books with maps for middle-grade readers",
  "Steampunk for young readers: where to begin",
  "A map-making afternoon: an activity for families",
];
