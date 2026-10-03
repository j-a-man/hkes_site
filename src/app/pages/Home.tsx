import { useLoaderData, useRouteLoaderData } from 'react-router';
import HomeHero from '../components/home/HomeHero';
import NextStops from '../components/home/NextStops';
import StatsBand from '../components/home/StatsBand';
import Scrapbook from '../components/home/Scrapbook';
import JoinSection from '../components/home/JoinSection';
import Marquee from '../components/site/Marquee';
import type { EventRow, GalleryPhotoRow } from '../lib/queries';
import { sectionContent } from '../lib/siteContentManifest';
import { safeUrl, splitEvents, type ContentMap } from '../lib/site';

interface LoaderData {
  content: ContentMap;
  events: EventRow[];
  photos: GalleryPhotoRow[];
}

export default function Home() {
  const { content, events, photos } = useLoaderData() as LoaderData;
  const root = useRouteLoaderData('root') as { globalContent: ContentMap; contactContent: ContentMap };
  const instagramUrl = safeUrl(root.globalContent.social?.instagram_url);
  const instagramHandle = sectionContent('contact', 'info', root.contactContent.info).instagram_handle;

  const hero = sectionContent('home', 'hero', content.hero);
  const marquee = sectionContent('home', 'marquee', content.marquee);
  const { upcoming, past } = splitEvents(events);

  return (
    <>
      <HomeHero hero={hero} nextEvent={upcoming[0]} instagramHandle={instagramHandle} />
      <div className="relative z-10 -mx-[5vw] -my-9 -rotate-2 bg-hk-red-deep text-white shadow-[0_14px_28px_-16px_rgba(30,23,20,0.7)]">
        <Marquee items={(marquee.items as { text: string }[]).map((item) => item.text).filter(Boolean)} />
      </div>
      <NextStops
        content={sectionContent('home', 'events_preview', content.events_preview)}
        upcoming={upcoming}
        recent={past}
        instagramUrl={instagramUrl}
        instagramHandle={instagramHandle}
      />
      <StatsBand items={sectionContent('home', 'stats', content.stats).items} />
      <Scrapbook content={sectionContent('home', 'gallery_preview', content.gallery_preview)} photos={photos} />
      <JoinSection content={sectionContent('home', 'get_involved', content.get_involved)} instagramUrl={instagramUrl} />
    </>
  );
}
