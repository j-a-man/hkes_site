import { Instagram } from 'lucide-react';
import CtaPoster from '../site/CtaPoster';
import { Tape } from '../site/Paper';
import SectionHeading from '../site/SectionHeading';
import SiteButton from '../site/SiteButton';
import Reveal from '../Reveal';
import type { SectionContent } from '../../lib/siteContentManifest';

const TAPE_TILTS = ['-rotate-6', 'rotate-3', '-rotate-2'];

interface JoinSectionProps {
  content: SectionContent;
  instagramUrl?: string;
}

export default function JoinSection({ content, instagramUrl }: JoinSectionProps) {
  const steps: { title: string; description: string }[] = content.steps ?? [];

  return (
    <section className="bg-hk-paper pb-28 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading zh="加入我們" eyebrow={content.eyebrow} title={content.heading} subtitle={content.subheading} />
        </Reveal>

        {steps.length > 0 && (
          <Reveal className="mt-16">
            <ol className="grid gap-10 md:grid-cols-3 md:gap-7">
              {steps.map((step, i) => (
                <li key={`${step.title}-${i}`} className="relative rounded-[22px] border border-hk-line bg-white px-7 pb-8 pt-10 shadow-[0_18px_34px_-24px_rgba(30,23,20,0.45)]">
                  <Tape className={`-top-3.5 left-7 ${TAPE_TILTS[i % TAPE_TILTS.length]}`} />
                  <span className="font-display text-5xl leading-none text-hk-red">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-5 font-display text-xl font-normal uppercase leading-tight text-hk-ink">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-hk-ink-soft">{step.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        <CtaPoster heading={content.cta_heading} body={content.cta_body} className="mt-24">
          {instagramUrl && (
            <SiteButton href={instagramUrl} variant="white">
              <Instagram size={18} aria-hidden="true" />
              {content.instagram_button_text}
            </SiteButton>
          )}
          <SiteButton to="/contact" variant="outline-white">
            {content.contact_button_text}
          </SiteButton>
        </CtaPoster>
      </div>
    </section>
  );
}
