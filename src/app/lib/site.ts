import type { EventRow } from './queries';

export type ContentMap = Record<string, Record<string, any>>;

// Local calendar date as YYYY-MM-DD, matching how event dates are stored.
export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Events stay upcoming until their date passes, so a stale "upcoming" flag can
// never advertise an event that already happened. Editors can still retire an
// event early by marking it past.
export function isUpcoming(event: Pick<EventRow, 'status' | 'event_date'>, today = todayISO()) {
  return event.status !== 'past' && event.event_date >= today;
}

export function splitEvents(events: EventRow[], today = todayISO()) {
  const upcoming = events.filter((e) => isUpcoming(e, today)).sort((a, b) => a.event_date.localeCompare(b.event_date));
  const past = events.filter((e) => !isUpcoming(e, today)).sort((a, b) => b.event_date.localeCompare(a.event_date));
  return { upcoming, past };
}

function parseISODate(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

export function formatDate(iso: string | null, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '';
  return parseISODate(iso).toLocaleDateString('en-US', options);
}

export function dateParts(iso: string) {
  const date = parseISODate(iso);
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: String(date.getDate()),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    year: String(date.getFullYear()),
  };
}

// Links typed into the Site Editor are rendered only when they are http(s) or
// mailto, so a stored `javascript:` URL can never run on the site.
export function safeUrl(url: unknown): string | undefined {
  if (typeof url !== 'string' || !url.trim()) return undefined;
  try {
    const parsed = new URL(url.trim(), window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

export interface SocialLink {
  name: 'Instagram' | 'TikTok' | 'LinkedIn';
  href: string;
}

export function socialLinks(social: Record<string, any> | undefined): SocialLink[] {
  const links: { name: SocialLink['name']; href: string | undefined }[] = [
    { name: 'Instagram', href: safeUrl(social?.instagram_url) },
    { name: 'TikTok', href: safeUrl(social?.tiktok_url) },
    { name: 'LinkedIn', href: safeUrl(social?.linkedin_url) },
  ];
  return links.filter((link): link is SocialLink => Boolean(link.href));
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
