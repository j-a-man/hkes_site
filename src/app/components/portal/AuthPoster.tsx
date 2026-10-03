import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Sparkle } from '../site/Doodles';
import { PlacardFrame, PlacardLabel } from '../site/Placard';
import Stamp from '../site/Stamp';

interface AuthPosterProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

// Sign-in screens: a red HKES flyer with the form on a placard, like the
// public site, so the portal entrance feels part of the same place.
export default function AuthPoster({ title, subtitle, children }: AuthPosterProps) {
  return (
    <main className="paper-grain relative flex min-h-screen flex-col overflow-hidden bg-hk-red px-4 py-6 font-['Poppins'] text-hk-ink antialiased [--grain-opacity:0.1] sm:px-8">
      <span
        lang="zh-HK"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.2em] -right-[0.04em] select-none font-zh text-[clamp(9rem,30vw,24rem)] leading-none text-hk-red-deep/35"
      >
        會員
      </span>
      <Sparkle className="absolute left-[12%] top-[22%] hidden h-9 w-9 text-white md:block" />
      <Sparkle filled={false} className="absolute left-[16%] top-[30%] hidden h-5 w-5 text-white/80 md:block" />

      <Link to="/" className="relative inline-flex w-fit items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-white hover:underline focus-visible:outline-3 focus-visible:outline-white">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to HKES
      </Link>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md -rotate-1">
          <PlacardFrame>
            <div className="flex items-center gap-4">
              <Stamp size={56} className="-rotate-6 text-hk-red" label="HKES seal" />
              <PlacardLabel zh="會員專區" en="Member portal" />
            </div>
            <h1 className="mt-6 font-marker text-[2.6rem] leading-none text-hk-red">{title}</h1>
            <p className="mt-3 text-hk-ink-soft">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </PlacardFrame>
        </div>
      </div>
    </main>
  );
}
