import { ArrowRight } from 'lucide-react';
import Placard, { ComingSoonPlacard } from '../site/Placard';
import SectionHeading from '../site/SectionHeading';
import SiteButton from '../site/SiteButton';
import Reveal from '../Reveal';
import type { EventRow } from '../../lib/queries';
import type { SectionContent } from '../../lib/siteContentManifest';

const TILTS = ['lg:-rotate-1', 'lg:rotate-1', 'lg:-rotate-[0.5deg]'];

interface NextStopsProps {
  content: SectionContent;
  upcoming: EventRow[];
  recent: EventRow[];
  instagramUrl?: string;
  instagramHandle?: string;
}

export default function NextStops({ content, upcoming, recent, instagramUrl, instagramHandle }: NextStopsProps) {
  return (
    <section className="bg-hk-paper pb-24 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            zh="下一站"
            eyebrow="Upcoming events"
            title={content.heading}
            subtitle={content.subheading}
            action={
              <SiteButton to="/events" variant="outline-ink">
                {content.button_text}
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
            }
          />
        </Reveal>

        <Reveal className="mt-14">
          {upcoming.length > 0 ? (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.slice(0, 3).map((event, i) => (
                <li key={event.id} className={TILTS[i % TILTS.length]}>
                  <Placard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <li className="lg:-rotate-1">
                <ComingSoonPlacard instagramUrl={instagramUrl} instagramHandle={instagramHandle} />
              </li>
              {recent.slice(0, 2).map((event, i) => (
                <li key={event.id} className={TILTS[(i + 1) % TILTS.length]}>
                  <Placard event={event} past />
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
