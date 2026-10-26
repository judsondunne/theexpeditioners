import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { plates, maps } from "@/content/engravings";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({ title: "Pictures and credits", description: "Sources and credits for the cover lettering, book illustrations, author portraits, award graphics, historical engravings and maps on The Expeditioners website.", path: "/credits" });
export default function CreditsPage() { return <>
<header className="container-x py-12"><Breadcrumbs items={[{name:"Pictures and credits",path:"/credits"}]} /><h1 className="display mt-10 text-[clamp(3rem,8vw,7rem)]">Pictures and credits</h1></header>
      <section id="credits" aria-labelledby="credits-title" className="on-night scroll-mt-20 bg-night py-16 text-cream md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-cream/60">Credits</p>
            <h2 id="credits-title" className="mt-4 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-[1.08]">
              Pictures on this site
            </h2>
          </div>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            <div>
              <h3 className="label text-signal">From the books</h3>
              <ul className="mt-4 space-y-2 font-serif text-[1.05rem] leading-relaxed text-cream/85">
                <li>Covers of Books One and Two, interior illustrations and the Drowned Man&rsquo;s Canyon map: Katherine Roy.</li>
                <li>Cover of Book Three: Harlow Brook Books (2019).</li>
                <li>Series lettering on the covers: designed for the original McSweeney&rsquo;s McMullens editions.</li>
              </ul>
            </div>
            <div>
              <h3 className="label text-signal">Public-domain engravings &amp; maps</h3>
              <ul className="mt-4 space-y-2 font-serif text-[1.02rem] leading-relaxed text-cream/85">
                {Object.values(maps).map((m) => (
                  <li key={m.src}>{m.credit}</li>
                ))}
                {Object.values(plates).map((p) => (
                  <li key={p.title}>
                    <em>{p.title}.</em> {p.credit}
                  </li>
                ))}
                <li>Small line drawings of instruments, vehicles and travellers: Pearson Scott Foresman, donated to the public domain via Wikimedia Commons.</li>
              </ul>
            </div>
            <div>
              <h3 className="label text-signal">Typefaces</h3>
              <p className="mt-3 font-serif text-[1.02rem] leading-relaxed text-cream/85">
                League Gothic, Libre Caslon Text, IBM Plex Mono and Reenie Beanie, all under the SIL Open Font License.
              </p>
            </div>
          </div>
        </div>
      </section>
<section className="container-x py-16 prose-field"><h2>Portraits and recognition marks</h2>
<p>Katherine Roy portrait: Tim Stout.</p>
<p>Texas Bluebonnet Award graphic: Texas Library Association. Dorothy Canfield Fisher award logo: Hedda Peterson, reproduced on Thetford Academy Library’s historical award page. Indie Next List graphic: American Booksellers Association.</p>
</section>
</>; }
