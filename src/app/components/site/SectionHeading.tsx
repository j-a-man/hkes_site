import type { ReactNode } from 'react';
import { Squiggle } from './Doodles';

interface SectionHeadingProps {
  // Cantonese label shown above the heading, e.g. 下一站.
  zh: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({ zh, eyebrow, title, subtitle, align = 'left', action, className = '' }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} ${className}`}>
      <div className={centered ? 'flex flex-col items-center' : ''}>
        <p className="flex items-baseline gap-3 text-hk-red">
          <span lang="zh-HK" className="font-zh text-2xl leading-none">
            {zh}
          </span>
          {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-hk-red-deep">{eyebrow}</span>}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.5rem)] font-normal uppercase leading-[1.02] text-hk-ink">{title}</h2>
        <Squiggle className="mt-3 h-3 w-36 text-hk-red" />
        {subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-hk-ink-soft sm:text-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
