import { useLoaderData } from 'react-router';
import { Arrow } from '../components/site/Doodles';
import CtaPoster from '../components/site/CtaPoster';
import { Tape } from '../components/site/Paper';
import PosterHero from '../components/site/PosterHero';
import SectionHeading from '../components/site/SectionHeading';
import SiteButton from '../components/site/SiteButton';
import Stamp from '../components/site/Stamp';
import Reveal from '../components/Reveal';
import type { Profile } from '../lib/auth';
import { sectionContent } from '../lib/siteContentManifest';
import { initials, type ContentMap } from '../lib/site';

interface LoaderData {
  content: ContentMap;
  eboard: Pick<Profile, 'id' | 'full_name' | 'title' | 'avatar_url'>[];
}

const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const CARD_TILTS = ['-rotate-2', 'rotate-[1.5deg]', '-rotate-1', 'rotate-2'];

export default function About() {
  const { content, eboard } = useLoaderData() as LoaderData;
  const hero = sectionContent('about', 'hero', content.hero);
  const who = sectionContent('about', 'who_we_are', content.who_we_are);
  const values = sectionContent('about', 'what_we_value', content.what_we_value);
  const team = sectionContent('about', 'team', content.team);
  const getInvolved = sectionContent('about', 'get_involved', content.get_involved);
  const valueItems: { title: string; description: string }[] = values.values ?? [];

  return (
    <>
      <PosterHero zh="關於我們" eyebrow="About HKES" title={hero.heading} subtitle={hero.subheading} />

      <section className="bg-hk-paper pb-28 pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {who.body && (
            <Reveal className="grid items-center gap-14 lg:grid-cols-12">
              <div className="relative mx-auto lg:col-span-5">
                <Stamp size={280} className="-rotate-[8deg] text-hk-red" label="The HKES seal" />
                <p className="absolute -bottom-8 -right-2 flex items-end gap-1 font-hand text-2xl font-semibold text-hk-ink sm:-right-14">
                  <Arrow className="mb-2 h-8 w-12 rotate-180 text-hk-ink" />
                  our seal
                </p>
              </div>
              <div className="lg:col-span-7">
                <SectionHeading zh="我們是誰" eyebrow="Who we are" title={who.heading} />
                <p className="mt-8 text-lg leading-relaxed text-hk-ink sm:text-xl sm:leading-relaxed">{who.body}</p>
              </div>
            </Reveal>
          )}

          {valueItems.length > 0 && (
            <Reveal className="mt-28">
              <SectionHeading zh="價值" eyebrow="What we're about" title={values.heading} />
              <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {valueItems.map((value, i) => (
                  <li key={`${value.title}-${i}`} className="border-t-2 border-hk-ink pt-6">
                    <span lang="zh-HK" aria-hidden="true" className="font-zh text-5xl leading-none text-hk-red">
                      {CHINESE_NUMERALS[i] ?? i + 1}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-normal uppercase leading-tight text-hk-ink">{value.title}</h3>
                    <p className="mt-3 leading-relaxed text-hk-ink-soft">{value.description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {eboard.length > 0 && (
            <Reveal className="mt-28">
              <SectionHeading zh="幹事會" eyebrow="E-Board" title={team.heading} subtitle={team.subheading} />
              <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-4">
                {eboard.map((member, i) => (
                  <li key={member.id} className={CARD_TILTS[i % CARD_TILTS.length]}>
                    <figure className="relative bg-white p-2.5 pb-4 shadow-[0_1px_2px_rgba(30,23,20,0.12),0_18px_32px_-16px_rgba(30,23,20,0.5)] sm:p-3 sm:pb-5">
                      <Tape className="-top-3.5 left-1/2 -translate-x-1/2 -rotate-3" />
                      <div className="grid aspect-square place-items-center overflow-hidden bg-hk-red">
                        {member.avatar_url ? (
                          <img src={member.avatar_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        ) : (
                          <span aria-hidden="true" className="font-display text-5xl text-white sm:text-6xl">
                            {initials(member.full_name)}
                          </span>
                        )}
                      </div>
                      <figcaption className="mt-3 text-center">
                        <span className="block truncate font-hand text-2xl font-semibold leading-tight text-hk-ink">{member.full_name}</span>
                        <span className="mt-2 inline-block rounded-full bg-hk-red px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                          {member.title}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <CtaPoster heading={getInvolved.heading} body={getInvolved.body} className="mt-28">
            <SiteButton to="/events" variant="white">
              {getInvolved.explore_button_text}
            </SiteButton>
            <SiteButton to="/contact" variant="outline-white">
              {getInvolved.contact_button_text}
            </SiteButton>
          </CtaPoster>
        </div>
      </section>
    </>
  );
}
