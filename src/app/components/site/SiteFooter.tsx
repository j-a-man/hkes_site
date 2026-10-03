import { Link } from 'react-router';
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';
import Stamp from './Stamp';
import { TornEdge } from './Paper';
import { NAV_ITEMS } from './nav';
import type { SocialLink } from '../../lib/site';

const SOCIAL_ICONS = { Instagram, TikTok: TikTokIcon, LinkedIn: Linkedin };

interface SiteFooterProps {
  footer: Record<string, any>;
  contact: Record<string, any>;
  socials: SocialLink[];
}

export default function SiteFooter({ footer, contact, socials }: SiteFooterProps) {
  return (
    <footer className="paper-grain relative overflow-hidden bg-hk-red text-white [--grain-opacity:0.1]">
      <TornEdge position="top" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Stamp size={88} className="-rotate-6 text-white" label="HKES seal" />
            <p className="mt-6 max-w-sm leading-relaxed">{footer.blurb}</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.name];
                  return (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`HKES on ${social.name}`}
                        className="grid h-11 w-11 place-items-center rounded-full border-2 border-white transition-colors hover:bg-white hover:text-hk-red focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <Icon size={18} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em]">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="group inline-flex items-baseline gap-3 font-display text-xl uppercase focus-visible:outline-3 focus-visible:outline-white">
                    <span className="decoration-2 underline-offset-4 group-hover:underline">{item.label}</span>
                    <span lang="zh-HK" className="font-zh text-base normal-case">
                      {item.zh}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em]">Say hi</h2>
            <ul className="mt-5 space-y-4">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:underline focus-visible:outline-3 focus-visible:outline-white">
                    <Mail size={18} aria-hidden="true" className="shrink-0" />
                    {contact.email}
                  </a>
                </li>
              )}
              {(contact.location_name || contact.location_address) && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
                  <span>
                    {contact.location_name}
                    {contact.location_address && (
                      <>
                        <br />
                        {contact.location_address}
                      </>
                    )}
                  </span>
                </li>
              )}
              <li>
                <Link to="/portal" className="inline-flex items-center gap-2 font-semibold hover:underline focus-visible:outline-3 focus-visible:outline-white">
                  Member portal
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-white/25 pt-6 text-sm">{footer.copyright}</p>
      </div>

      <p
        aria-hidden="true"
        className="mt-8 select-none text-center font-display text-[clamp(5rem,23.4vw,21rem)] leading-[0.74] text-hard-shadow [margin-bottom:-0.12em]"
      >
        HKES
      </p>
    </footer>
  );
}
