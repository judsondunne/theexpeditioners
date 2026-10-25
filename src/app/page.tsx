import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { HookStory } from "@/components/home/HookStory";
import { EducatorsTeaser, FinalCta, MapRoomTeaser, RecognitionSection, SiblingsSection } from "@/components/home/Sections";
import { TrilogyShelf } from "@/components/home/TrilogyShelf";
import { JsonLd } from "@/components/ui/JsonLd";
import { bookOne } from "@/content/books";
import { shelfEntries } from "@/lib/shelf";
import { pageMetadata } from "@/lib/seo";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "The Expeditioners Books — Adventure Trilogy by S. S. Taylor",
  absoluteTitle: true,
  description: "Maps, codes and clockwork. Explore S. S. Taylor’s illustrated adventure trilogy for ages 10–14, read the books in order and choose your next book.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <HookStory
        cover={{ src: bookOne.cover.src, alt: bookOne.cover.alt }}
      />
      <TrilogyShelf entries={shelfEntries()} />
      <SiblingsSection />
      <RecognitionSection />
      <MapRoomTeaser />
      <EducatorsTeaser />
      <FinalCta />
      <JsonLd data={[personSchema("author"), personSchema("illustrator")]} />
    </>
  );
}
