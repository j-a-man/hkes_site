import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkle, Swoosh } from './Doodles';
import { TornEdge } from './Paper';

interface PosterHeroProps {
  // Cantonese label, also drawn huge behind the title.
  zh: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

// The red flyer that tops every inner page.
export default function PosterHero({ zh, eyebrow, title, subtitle, children }: PosterHeroProps) {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: 'easeOut' as const, delay } };

  return (
    <section className="paper-grain relative overflow-hidden bg-hk-red text-white [--grain-opacity:0.1]">
      <span
        lang="zh-HK"
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-[0.18em] right-[-0.04em] select-none whitespace-nowrap font-zh leading-none text-hk-red-deep/35 ${
          zh.length > 2 ? 'text-[clamp(5.5rem,13vw,11.5rem)]' : 'text-[clamp(9rem,26vw,22rem)]'
        }`}
      >
        {zh}
      </span>
      <Sparkle className="absolute right-[12%] top-12 hidden h-8 w-8 text-white/90 md:block" />
      <Sparkle filled={false} className="absolute right-[7%] top-28 hidden h-5 w-5 text-white/80 md:block" />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8 md:pb-28 md:pt-20">
        <motion.p className="flex items-baseline gap-3" {...rise(0)}>
          <span lang="zh-HK" className="font-zh text-3xl leading-none">
            {zh}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</span>
        </motion.p>
        <motion.h1
          className="mt-5 max-w-4xl font-display text-[clamp(2.75rem,8vw,6.25rem)] font-normal uppercase leading-[0.95] text-hard-shadow"
          {...rise(0.08)}
        >
          {title}
        </motion.h1>
        <motion.div {...rise(0.16)}>
          <Swoosh className="mt-4 h-5 w-48 text-white sm:w-64" />
          {subtitle && <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">{subtitle}</p>}
        </motion.div>
        {children}
      </div>

      <TornEdge position="bottom" />
    </section>
  );
}
