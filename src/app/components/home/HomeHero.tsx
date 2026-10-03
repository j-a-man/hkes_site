import { motion, useReducedMotion } from 'motion/react';
import { Burst, Sparkle, Swoosh } from '../site/Doodles';
import { Tape } from '../site/Paper';
import Placard, { ComingSoonPlacard } from '../site/Placard';
import SiteButton from '../site/SiteButton';
import Stamp from '../site/Stamp';
import StickerPhoto from '../site/StickerPhoto';
import type { EventRow } from '../../lib/queries';
import type { SectionContent } from '../../lib/siteContentManifest';

interface HomeHeroProps {
  hero: SectionContent;
  nextEvent?: EventRow;
  instagramHandle?: string;
}

// The front page is one big HKES flyer: hand-lettered headline, a taped-up
// photo of the members, the seal stamped on, and the next event on a
// minibus placard.
export default function HomeHero({ hero, nextEvent, instagramHandle }: HomeHeroProps) {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number, from: { y?: number; rotate?: number; scale?: number } = { y: 22 }) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, y: 0, scale: 1, ...(from.rotate !== undefined ? { rotate: 0 } : {}) },
          transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const, delay },
        };

  return (
    <section className="paper-grain relative overflow-hidden bg-hk-red text-white [--grain-opacity:0.1]">
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-28 pt-12 sm:px-8 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-32 lg:pt-16">
        <div className="lg:col-span-7">
          <motion.p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]" {...enter(0)}>
            <Sparkle className="h-4 w-4" />
            {hero.eyebrow}
          </motion.p>

          <h1 className="mt-6">
            <motion.span className="block font-display text-[clamp(2rem,3.4vw,3.25rem)] font-normal uppercase leading-[1.05]" {...enter(0.08)}>
              {hero.heading_line1}
            </motion.span>
            <motion.span className="relative mt-3 inline-block lg:whitespace-nowrap" {...enter(0.2, { scale: 1.08 })}>
              <Burst className="absolute -left-6 -top-6 hidden h-8 w-10 -rotate-[24deg] lg:block" />
              <span className="block -rotate-3 font-marker text-[clamp(3.75rem,8.2vw,7.5rem)] leading-[1.02] text-hard-shadow">{hero.heading_line2}</span>
              <Swoosh className="absolute -bottom-3 left-[2%] h-5 w-[96%] -rotate-3 text-white" />
              <Sparkle className="absolute -right-1 -top-7 h-7 w-7 sm:-right-11 sm:-top-3 sm:h-10 sm:w-10" />
              <Sparkle filled={false} className="absolute -right-4 top-1 hidden h-5 w-5 sm:block" />
            </motion.span>
          </h1>

          <motion.p className="mt-10 max-w-[34rem] text-lg leading-relaxed" {...enter(0.32)}>
            {hero.body}
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...enter(0.4)}>
            <SiteButton to="/events" variant="white">
              {hero.primary_button_text}
            </SiteButton>
            <SiteButton to="/about" variant="outline-white">
              {hero.secondary_button_text}
            </SiteButton>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:max-w-none lg:pl-8">
          {/* The placard is pinned over the photo's top corner, so the caption below stays readable. */}
          <motion.div className="relative z-10 w-[88%] -rotate-[1.5deg] sm:w-[78%]" {...enter(0.35, { y: 30 })}>
            {nextEvent ? (
              <Placard event={nextEvent} />
            ) : (
              <ComingSoonPlacard instagramHandle={instagramHandle} showButton={false} />
            )}
          </motion.div>

          <motion.div className="relative -mt-12 ml-auto w-[80%]" {...enter(0.2, { y: -24, rotate: 6 })}>
            <StickerPhoto
              src={hero.image_skyline_url}
              alt="HKES members together"
              caption={hero.caption_big_little}
              aspect="aspect-square"
              tape="none"
              loading="eager"
              className="rotate-[3deg]"
            />
            <Tape className="-right-6 top-1 w-20 rotate-[42deg]" />
          </motion.div>

          <motion.div className="absolute -left-2 bottom-12 sm:-left-5" {...enter(0.55, { scale: 1.6, rotate: -30 })}>
            <Stamp size={104} className="-rotate-12 text-white" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
