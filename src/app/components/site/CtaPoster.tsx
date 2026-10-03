import type { ReactNode } from 'react';
import { Sparkle } from './Doodles';
import Stamp from './Stamp';
import Reveal from '../Reveal';

interface CtaPosterProps {
  heading: string;
  body?: string;
  // Buttons; use the white and outline-white SiteButton variants.
  children: ReactNode;
  className?: string;
}

// The closing red flyer at the bottom of a page.
export default function CtaPoster({ heading, body, children, className = '' }: CtaPosterProps) {
  return (
    <Reveal className={`paper-grain relative overflow-hidden rounded-[28px] bg-hk-red px-7 py-14 text-white [--grain-opacity:0.1] sm:px-14 md:py-16 ${className}`}>
      <div className="relative max-w-2xl">
        <h2 className="-rotate-2 font-marker text-[clamp(2.6rem,6vw,4.5rem)] font-normal leading-[1.02] text-hard-shadow">{heading}</h2>
        {body && <p className="mt-7 max-w-lg text-lg leading-relaxed">{body}</p>}
        <div className="mt-9 flex flex-wrap gap-4">{children}</div>
      </div>
      <Stamp size={240} className="absolute -bottom-12 right-6 hidden rotate-12 text-white/90 md:block lg:right-16" />
      <Sparkle className="absolute right-[34%] top-10 hidden h-9 w-9 md:block" />
      <Sparkle filled={false} className="absolute right-[30%] top-24 hidden h-5 w-5 md:block" />
    </Reveal>
  );
}
