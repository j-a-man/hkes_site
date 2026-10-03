import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import FilterChips from '../components/site/FilterChips';
import Lightbox from '../components/site/Lightbox';
import PosterHero from '../components/site/PosterHero';
import SectionHeading from '../components/site/SectionHeading';
import StickerPhoto from '../components/site/StickerPhoto';
import Reveal from '../components/Reveal';
import type { FeaturedRecapRow, GalleryPhotoRow } from '../lib/queries';
import { sectionContent } from '../lib/siteContentManifest';
import { formatDate, type ContentMap } from '../lib/site';

interface LoaderData {
  content: ContentMap;
  photos: GalleryPhotoRow[];
  recaps: FeaturedRecapRow[];
}

const TILTS = ['-rotate-1', 'rotate-[1.5deg]', 'rotate-[-1.5deg]', 'rotate-1'];

export default function Gallery() {
  const { content, photos, recaps } = useLoaderData() as LoaderData;
  const hero = sectionContent('gallery', 'hero', content.hero);

  const years = useMemo(() => Array.from(new Set(photos.map((p) => String(p.year)))).sort().reverse(), [photos]);
  const types = useMemo(() => Array.from(new Set(photos.map((p) => p.type))).sort(), [photos]);
  const [year, setYear] = useState('All');
  const [type, setType] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const shown = photos.filter((p) => (year === 'All' || String(p.year) === year) && (type === 'All' || p.type === type));

  return (
    <>
      <PosterHero zh="相簿" eyebrow="Gallery" title={hero.heading} subtitle={hero.subheading} />

      <section className="bg-hk-paper pb-24 pt-14 md:pt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {photos.length > 0 && (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {years.length > 1 && <FilterChips label="Filter photos by year" options={['All', ...years]} value={year} onChange={setYear} />}
              {types.length > 1 && <FilterChips label="Filter photos by type" options={['All', ...types]} value={type} onChange={setType} />}
            </div>
          )}

          {shown.length > 0 ? (
            <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 pt-3 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-12">
              {shown.map((photo, i) => (
                <li key={photo.id}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={`Open photo: ${photo.event_name}`}
                    className={`block w-full text-left transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.03] focus-visible:rotate-0 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-hk-red ${TILTS[i % TILTS.length]}`}
                  >
                    <StickerPhoto src={photo.url} alt={photo.event_name} caption={photo.event_name} tape={i % 3 === 2 ? 'corners' : 'top'} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 rounded-[22px] border-2 border-dashed border-hk-ink/20 px-6 py-16 text-center font-hand text-3xl text-hk-ink-soft">
              {photos.length > 0 ? 'No photos match those filters yet.' : 'Photos are on the way!'}
            </p>
          )}

          {recaps.length > 0 && (
            <Reveal className="mt-24">
              <SectionHeading zh="回顧" eyebrow="Featured recaps" title="Event recaps" />
              <ul className="mt-14 space-y-16 md:space-y-20">
                {recaps.map((recap, i) => (
                  <li key={recap.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                    {recap.image_url && (
                      <StickerPhoto
                        src={recap.image_url}
                        alt={recap.title}
                        aspect="aspect-[4/3]"
                        tape="corners"
                        className={`${i % 2 === 0 ? '-rotate-2' : 'rotate-2 md:order-2'}`}
                      />
                    )}
                    <div>
                      <p className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-hk-red-deep">
                        {recap.recap_date && <span>{formatDate(recap.recap_date, { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                        {recap.photo_count != null && <span className="rounded-full bg-hk-red px-3 py-1 text-white">{recap.photo_count} photos</span>}
                      </p>
                      <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-normal uppercase leading-[1.08] text-hk-ink">{recap.title}</h3>
                      {recap.excerpt && <p className="mt-4 text-lg leading-relaxed text-hk-ink-soft">{recap.excerpt}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      <Lightbox photos={shown} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
