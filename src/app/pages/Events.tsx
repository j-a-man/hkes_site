import { useMemo, useState } from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router';
import FilterChips from '../components/site/FilterChips';
import Placard, { ComingSoonPlacard } from '../components/site/Placard';
import PosterHero from '../components/site/PosterHero';
import Reveal from '../components/Reveal';
import type { EventRow } from '../lib/queries';
import { sectionContent } from '../lib/siteContentManifest';
import { dateParts, safeUrl, splitEvents, type ContentMap } from '../lib/site';

interface LoaderData {
  content: ContentMap;
  events: EventRow[];
}

function GroupHeading({ zh, title, count }: { zh: string; title: string; count: number }) {
  return (
    <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span lang="zh-HK" className="font-zh text-2xl text-hk-red">
        {zh}
      </span>
      <span className="font-display text-3xl font-normal uppercase text-hk-ink">{title}</span>
      {count > 0 && <span className="text-sm font-semibold text-hk-ink-soft">({count})</span>}
    </h2>
  );
}

export default function Events() {
  const { content, events } = useLoaderData() as LoaderData;
  const root = useRouteLoaderData('root') as { globalContent: ContentMap; contactContent: ContentMap };
  const hero = sectionContent('events', 'hero', content.hero);
  const instagramUrl = safeUrl(root.globalContent.social?.instagram_url);
  const instagramHandle = sectionContent('contact', 'info', root.contactContent.info).instagram_handle;

  const { upcoming, past } = useMemo(() => splitEvents(events), [events]);
  const categories = useMemo(() => Array.from(new Set(events.map((e) => e.category))).sort(), [events]);
  const [category, setCategory] = useState('All');
  const inCategory = (event: EventRow) => category === 'All' || event.category === category;
  const shownUpcoming = upcoming.filter(inCategory);
  const shownPast = past.filter(inCategory);

  return (
    <>
      <PosterHero zh="活動" eyebrow="HKES events" title={hero.heading} subtitle={hero.subheading} />

      <section className="bg-hk-paper pb-28 pt-14 md:pt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {categories.length > 1 && <FilterChips label="Filter events by category" options={['All', ...categories]} value={category} onChange={setCategory} />}

          <Reveal className="mt-12">
            <GroupHeading zh="下一站" title="Coming up" count={shownUpcoming.length} />
            {shownUpcoming.length > 0 ? (
              <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {shownUpcoming.map((event) => (
                  <li key={event.id}>
                    <Placard event={event} showImage showDescription />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <ComingSoonPlacard instagramUrl={instagramUrl} instagramHandle={instagramHandle} />
              </div>
            )}
          </Reveal>

          {shownPast.length > 0 && (
            <Reveal className="mt-24">
              <GroupHeading zh="上一站" title="Past events" count={shownPast.length} />
              <ul className="mt-8 border-t-2 border-hk-ink">
                {shownPast.map((event) => {
                  const { month, day, year } = dateParts(event.event_date);
                  return (
                    <li key={event.id} className="grid grid-cols-[5.25rem_1fr] items-center gap-x-4 gap-y-2 border-b border-hk-line py-5 sm:grid-cols-[6.5rem_1fr_auto] sm:gap-x-8">
                      <p className="leading-none text-hk-ink">
                        <span className="block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">
                          {month} {year}
                        </span>
                        <span className="mt-1 block font-display text-3xl">{day}</span>
                      </p>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-hk-ink">{event.name}</h3>
                        <p className="mt-0.5 text-sm text-hk-ink-soft">
                          {[event.event_time, event.location].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="col-start-2 justify-self-start rounded-full border border-hk-ink/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-hk-ink-soft sm:col-start-auto sm:justify-self-end">
                        {event.category}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
