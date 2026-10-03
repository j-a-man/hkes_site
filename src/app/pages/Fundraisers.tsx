import { useLoaderData } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { PlacardLabel } from '../components/site/Placard';
import PosterHero from '../components/site/PosterHero';
import SectionHeading from '../components/site/SectionHeading';
import SiteButton from '../components/site/SiteButton';
import Reveal from '../components/Reveal';
import type { FundraiserRow } from '../lib/queries';
import { sectionContent } from '../lib/siteContentManifest';
import { safeUrl, type ContentMap } from '../lib/site';

interface LoaderData {
  content: ContentMap;
  fundraisers: FundraiserRow[];
}

const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const RECEIPT_TILTS = ['lg:-rotate-1', 'lg:rotate-1', 'lg:-rotate-[0.5deg]'];

function money(amount: number | null) {
  return `$${Number(amount ?? 0).toLocaleString('en-US')}`;
}

function ActiveFundraiser({ fundraiser, support }: { fundraiser: FundraiserRow; support: Record<string, any> }) {
  const reduceMotion = useReducedMotion();
  const raised = Number(fundraiser.raised_amount);
  const goal = fundraiser.goal_amount != null ? Number(fundraiser.goal_amount) : null;
  const percent = goal ? Math.round((raised / goal) * 100) : null;
  const supportUrl = safeUrl(support.button_url);

  return (
    <article className="relative grid gap-12 rounded-[28px] border-2 border-hk-ink bg-white p-7 shadow-[8px_8px_0_0_var(--color-hk-red)] sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:p-12">
      {fundraiser.days_remaining != null && (
        <div className="absolute -right-3 -top-10 grid h-24 w-24 rotate-12 place-items-center rounded-full bg-hk-red text-center text-white shadow-[3px_4px_0_0_var(--color-hk-red-deep)] sm:-right-6 sm:h-28 sm:w-28">
          <p className="leading-none">
            <span className="block font-display text-3xl sm:text-4xl">{fundraiser.days_remaining}</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em]">{fundraiser.days_remaining === 1 ? 'day left' : 'days left'}</span>
          </p>
        </div>
      )}

      <div className="min-w-0">
        <PlacardLabel zh="進行中" en="Happening now" />
        <h2 className="mt-4 pr-20 font-display text-[clamp(1.45rem,5.6vw,2.75rem)] font-normal uppercase leading-[1.08] text-hk-ink lg:pr-0">{fundraiser.name}</h2>
        {fundraiser.description && <p className="mt-5 leading-relaxed text-hk-ink-soft">{fundraiser.description}</p>}
        <div className="mt-8">
          {supportUrl ? <SiteButton href={supportUrl}>{support.button_text}</SiteButton> : <SiteButton to="/contact">{support.button_text}</SiteButton>}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-hk-red">{money(raised)}</p>
        <p className="mt-3 text-hk-ink-soft">{goal ? `raised of our ${money(goal)} goal` : 'raised so far'}</p>
        {percent != null && (
          <>
            <div
              role="progressbar"
              aria-label={`${fundraiser.name} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(percent, 100)}
              className="mt-7 h-8 overflow-hidden rounded-full border-2 border-hk-ink bg-hk-paper p-1"
            >
              <motion.div
                className="h-full rounded-full bg-hk-red [background-image:repeating-linear-gradient(-45deg,transparent_0_10px,rgba(255,255,255,0.18)_10px_20px)]"
                initial={reduceMotion ? false : { width: 0 }}
                whileInView={{ width: `${Math.min(percent, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                style={reduceMotion ? { width: `${Math.min(percent, 100)}%` } : undefined}
              />
            </div>
            <p className="mt-3 font-hand text-2xl font-semibold text-hk-ink">{percent >= 100 ? 'Goal reached, thank you!' : `${percent}% of the way there!`}</p>
          </>
        )}
      </div>
    </article>
  );
}

function Receipt({ fundraiser }: { fundraiser: FundraiserRow }) {
  return (
    <div className="drop-shadow-[0_16px_18px_rgba(30,23,20,0.16)]">
      <article className="bg-white px-6 pb-12 pt-7 text-hk-ink [--zig:9px] [mask:conic-gradient(from_-45deg_at_bottom,#0000,#000_1deg_89deg,#0000_90deg)_50%/calc(2*var(--zig))_100%]">
        <header className="text-center">
          <p className="font-display text-lg uppercase leading-none">HKES</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-hk-ink-soft">Fundraiser receipt{fundraiser.year ? ` · ${fundraiser.year}` : ''}</p>
        </header>
        <hr className="my-5 border-0 border-t-2 border-dashed border-hk-ink/25" />
        <h3 className="text-lg font-semibold leading-snug">{fundraiser.name}</h3>
        {fundraiser.recap && <p className="mt-2 text-sm leading-relaxed text-hk-ink-soft">{fundraiser.recap}</p>}
        <hr className="my-5 border-0 border-t-2 border-dashed border-hk-ink/25" />
        <p className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">Total raised</span>
          <span className="font-display text-2xl text-hk-red">{money(fundraiser.raised_amount)}</span>
        </p>
        <hr className="my-5 border-0 border-t-2 border-dashed border-hk-ink/25" />
        <p className="text-center text-hk-red">
          <span lang="zh-HK" className="font-zh text-2xl">
            多謝！
          </span>{' '}
          <span className="font-hand text-2xl font-semibold">thank you!</span>
        </p>
      </article>
    </div>
  );
}

export default function Fundraisers() {
  const { content, fundraisers } = useLoaderData() as LoaderData;
  const hero = sectionContent('fundraisers', 'hero', content.hero);
  const support = sectionContent('fundraisers', 'support', content.support);
  const why = sectionContent('fundraisers', 'why_we_fundraise', content.why_we_fundraise);
  const reasons: { title: string; description: string }[] = why.items ?? [];

  const active = fundraisers.filter((f) => f.status === 'active');
  const past = fundraisers.filter((f) => f.status === 'past');

  return (
    <>
      <PosterHero zh="籌款" eyebrow="Fundraisers" title={hero.heading} subtitle={hero.subheading} />

      <section className="bg-hk-paper pb-28 pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {active.length > 0 && (
            <div className="space-y-16">
              {active.map((fundraiser) => (
                <Reveal key={fundraiser.id}>
                  <ActiveFundraiser fundraiser={fundraiser} support={support} />
                </Reveal>
              ))}
            </div>
          )}

          {reasons.length > 0 && (
            <Reveal className={active.length > 0 ? 'mt-28' : ''}>
              <SectionHeading zh="點解籌款" eyebrow="Where it goes" title={why.heading} />
              <ol className="mt-12 grid gap-10 md:grid-cols-3">
                {reasons.map((reason, i) => (
                  <li key={`${reason.title}-${i}`} className="border-t-2 border-hk-ink pt-6">
                    <span lang="zh-HK" aria-hidden="true" className="font-zh text-5xl leading-none text-hk-red">
                      {CHINESE_NUMERALS[i] ?? i + 1}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-normal uppercase leading-tight text-hk-ink">{reason.title}</h3>
                    <p className="mt-3 leading-relaxed text-hk-ink-soft">{reason.description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {past.length > 0 && (
            <Reveal className="mt-28">
              <SectionHeading zh="多謝支持" eyebrow="Thanks for your support" title="Past fundraisers" />
              <ul className="mt-14 grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {past.map((fundraiser, i) => (
                  <li key={fundraiser.id} className={RECEIPT_TILTS[i % RECEIPT_TILTS.length]}>
                    <Receipt fundraiser={fundraiser} />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
