import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { analyticsConfig } from "@/lib/analytics";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How the official Expeditioners website handles information: no accounts, no advertising, no data collected from children.",
  path: "/privacy",
});

/*
 * LEGAL REVIEW NEEDED before launch. This page describes what the code in
 * this repository actually does; update it whenever an integration changes.
 */
export default function PrivacyPage() {
  const analyticsOn = Boolean(analyticsConfig.plausibleDomain);
  const newsletterOn = Boolean(process.env.NEXT_PUBLIC_NEWSLETTER_ACTION);
  return (
    <div className="paper-grain relative bg-paper">
      <div className="container-x relative z-10 pb-24 pt-8 md:pb-32">
        <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} className="text-ink-2" />
        <h1 className="display mt-14 text-[clamp(3.4rem,9vw,7rem)]">Privacy</h1>
        <div className="prose-field mt-10">
          <p>
            This is the official website for The Expeditioners books. It exists to tell people about the books and help
            them find a copy. We have tried to keep it as simple, and as respectful of your privacy, as possible.
          </p>
          <h2>The short version</h2>
          <ul>
            <li>There are no user accounts, logins or comments.</li>
            <li>There is no advertising and no advertising trackers.</li>
            <li>We do not knowingly collect personal information from children.</li>
            <li>We do not sell or share personal information.</li>
          </ul>
          <h2>Visiting the site</h2>
          <p>
            Like any website, the servers that deliver these pages receive technical information such as your IP address,
            browser type and the page requested. Our hosting provider uses this to deliver and protect the site and keeps
            it only for a limited period.
          </p>
          <h2>Analytics</h2>
          {analyticsOn ? (
            <p>
              We use Plausible Analytics, which does not use cookies and does not collect personal information, to count
              visits and see which pages are useful. We also count clicks on links to bookshops. A click to a retailer is not
              a purchase, and we never see what you buy.
            </p>
          ) : (
            <p>
              The site does not currently use any analytics service. If we add one, we will choose a privacy-friendly tool
              that does not use cookies, and we will update this page first.
            </p>
          )}
          <h2>Cookies</h2>
          <p>This site does not set cookies.</p>
          <h2>Email updates</h2>
          {newsletterOn ? (
            <p>
              If you choose to sign up for occasional news about the books, your email address is sent to our newsletter
              provider and used only for that purpose. You can unsubscribe at any time using the link in every email. Sign-up
              is intended for adults only.
            </p>
          ) : (
            <p>
              This site does not collect email addresses. News about the books is shared through the author&rsquo;s own
              newsletter at sarahstewarttaylor.com, which has its own privacy policy.
            </p>
          )}
          <h2>Interactive activities</h2>
          <p>The book-cipher activity processes your message in your browser. We do not receive the text you enter. Copying a cipher or sharing a guide happens only when you choose those actions.</p>
          <h2>Children</h2>
          <p>
            The Expeditioners is written for young readers, and we want the site to be safe for them to explore. It has no
            accounts or email sign-up forms intended for children, and we do not knowingly collect personal information from anyone under 13. If you
            believe a child has sent us personal information, please contact us and we will delete it.
          </p>
          <h2>Links to other sites</h2>
          <p>
            Links to bookshops, libraries, reviews and the author&rsquo;s website take you to sites with their own privacy
            policies, which we do not control.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent through the{" "}
            <a href="https://www.sarahstewarttaylor.com/contact" target="_blank" rel="noopener">
              author&rsquo;s contact page
            </a>
            .
          </p>
          <p className="label pt-4 text-ink-3">Last updated: October 25, 2026</p>
        </div>
      </div>
    </div>
  );
}
