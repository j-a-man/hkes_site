import { ArrowRight } from 'lucide-react';
import SectionHeading from '../site/SectionHeading';
import SiteButton from '../site/SiteButton';
import StickerPhoto from '../site/StickerPhoto';
import Reveal from '../Reveal';
import type { GalleryPhotoRow } from '../../lib/queries';
import type { SectionContent } from '../../lib/siteContentManifest';

const TILTS = ['-rotate-2', 'rotate-[1.5deg]', '-rotate-1', 'rotate-2', '-rotate-[1.5deg]', 'rotate-1'];

interface ScrapbookProps {
  content: SectionContent;
  photos: GalleryPhotoRow[];
}

export default function Scrapbook({ content, photos }: ScrapbookProps) {
  if (photos.length === 0) return null;

  return (
    <section className="bg-hk-paper pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            zh="相簿"
            eyebrow={content.eyebrow}
            title={content.heading}
            subtitle={content.subheading}
            action={
              <SiteButton to="/gallery" variant="outline-ink">
                {content.button_text}
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
            }
          />
        </Reveal>

        <Reveal className="mt-16">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-3 md:gap-y-14">
            {photos.slice(0, 6).map((photo, i) => (
              <li
                key={photo.id}
                className={`${TILTS[i % TILTS.length]} transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.03] ${i >= 4 ? 'max-md:hidden' : ''}`}
              >
                <StickerPhoto src={photo.url} alt={photo.event_name} caption={photo.event_name} tape={i % 3 === 1 ? 'corners' : 'top'} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
