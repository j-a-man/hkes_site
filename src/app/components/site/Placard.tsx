import type { ReactNode } from 'react';
import { Clock, Instagram, MapPin } from 'lucide-react';
import SiteButton from './SiteButton';
import type { EventRow } from '../../lib/queries';
import { dateParts } from '../../lib/site';

// The white acrylic sign with its painted inner border, shared by every placard.
export function PlacardFrame({ children, muted = false, className = '' }: { children: ReactNode; muted?: boolean; className?: string }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-[22px] bg-hk-card p-2 shadow-[0_1px_2px_rgba(30,23,20,0.1),0_20px_36px_-22px_rgba(30,23,20,0.55)] ring-1 ring-hk-line ${className}`}
    >
      <div className={`flex h-full flex-col rounded-[16px] border-2 p-5 sm:p-6 ${muted ? 'border-hk-ink/25' : 'border-hk-red'}`}>{children}</div>
    </article>
  );
}

export function PlacardLabel({ zh, en, muted = false }: { zh: string; en: string; muted?: boolean }) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${muted ? 'text-hk-ink' : 'text-hk-red'}`}>
      <span lang="zh-HK" className="font-zh text-xl leading-none">
        {zh}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{en}</span>
    </p>
  );
}

interface PlacardProps {
  event: EventRow;
  // Past events read as "previous stop" in muted ink instead of red.
  past?: boolean;
  showImage?: boolean;
  showDescription?: boolean;
  className?: string;
}

// An event card styled after the hand-painted signs in Hong Kong's red
// minibuses: a white placard, the destination lettered in red, and the
// date boxed in the corner where the fare would go.
export default function Placard({ event, past = false, showImage = false, showDescription = false, className = '' }: PlacardProps) {
  const { month, day, weekday, year } = dateParts(event.event_date);
  const accent = past ? 'text-hk-ink' : 'text-hk-red';

  return (
    <PlacardFrame muted={past} className={className}>
      {showImage && event.image_url && (
        <div className="-mx-1 -mt-1 mb-5 aspect-[16/10] overflow-hidden rounded-[10px] bg-hk-blush">
          <img src={event.image_url} alt="" loading="lazy" decoding="async" className={`h-full w-full object-cover ${past ? 'grayscale-[60%]' : ''}`} />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <PlacardLabel zh={past ? '上一站' : '下一站'} en={past ? 'Previous stop' : 'Next stop'} muted={past} />
        {/* The full date is repeated in the details list for screen readers. */}
        <div
          aria-hidden="true"
          className={`shrink-0 rounded-xl px-3 pb-2 pt-2.5 text-center leading-none ${past ? 'bg-hk-ink/[0.06] text-hk-ink' : 'bg-hk-red text-white'}`}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{month}</span>
          <span className="mt-1 block font-display text-[1.75rem] leading-none">{day}</span>
        </div>
      </div>

      <h3 className={`mt-4 font-marker text-[1.75rem] leading-[1.15] ${accent}`}>{event.name}</h3>

      <ul className="mt-4 space-y-1.5 text-sm text-hk-ink-soft">
        <li className="flex items-center gap-2">
          <Clock size={15} className="shrink-0" aria-hidden="true" />
          <span>
            {weekday}, {month} {day}, {year}
            {event.event_time ? ` · ${event.event_time}` : ''}
          </span>
        </li>
        {event.location && (
          <li className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </li>
        )}
      </ul>

      {showDescription && event.description && <p className="mt-4 text-sm leading-relaxed text-hk-ink-soft">{event.description}</p>}

      <p className="mt-auto pt-5">
        <span
          className={`inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            past ? 'border-hk-ink/20 text-hk-ink-soft' : 'border-hk-red/30 text-hk-red-deep dark:border-hk-red/60 dark:text-[#ff8f94]'
          }`}
        >
          {event.category}
        </span>
      </p>
    </PlacardFrame>
  );
}

interface ComingSoonPlacardProps {
  instagramUrl?: string;
  instagramHandle?: string;
  showButton?: boolean;
  className?: string;
}

// Stands in for the next event while nothing upcoming is on the calendar.
export function ComingSoonPlacard({ instagramUrl, instagramHandle, showButton = true, className = '' }: ComingSoonPlacardProps) {
  return (
    <PlacardFrame className={className}>
      <PlacardLabel zh="下一站" en="Next stop" />
      <p className="mt-4 font-marker text-[1.75rem] leading-[1.15] text-hk-red">The next flyer is in the works!</p>
      <p className="mt-3 text-sm leading-relaxed text-hk-ink-soft">
        New events go up on Instagram first{instagramHandle ? `, so follow ${instagramHandle}` : ''} and you won't miss a thing.
      </p>
      {showButton && instagramUrl && (
        <p className="mt-auto pt-6">
          <SiteButton href={instagramUrl} variant="red" size="sm">
            <Instagram size={16} aria-hidden="true" />
            Follow along
          </SiteButton>
        </p>
      )}
    </PlacardFrame>
  );
}
