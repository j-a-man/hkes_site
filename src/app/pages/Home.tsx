import { useLoaderData, useRouteLoaderData } from 'react-router';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import EboardSpotlight from '../components/home/EboardSpotlight';
import GalleryPreview from '../components/home/GalleryPreview';
import GetInvolvedSection from '../components/home/GetInvolvedSection';
import type { GalleryPhotoRow } from '../lib/queries';
import type { Profile } from '../lib/auth';

interface LoaderData {
  content: Record<string, Record<string, any>>;
  eboard: Pick<Profile, 'id' | 'full_name' | 'title' | 'avatar_url'>[];
  photos: GalleryPhotoRow[];
}

export default function Home() {
  const { content, eboard, photos } = useLoaderData() as LoaderData;
  const root = useRouteLoaderData('root') as { globalContent: Record<string, Record<string, any>> } | undefined;
  const social = root?.globalContent?.social ?? {};
  return (
    <div className="bg-white dark:bg-[#1a1b1e] overflow-hidden font-['Poppins']">
      <HeroSection content={content.hero ?? {}} social={social} />
      <StatsSection content={content.stats ?? {}} />
      <EboardSpotlight content={content.eboard ?? {}} eboard={eboard} />
      <GalleryPreview content={content.gallery_preview ?? {}} photos={photos} />
      <GetInvolvedSection content={content.get_involved ?? {}} social={social} />
    </div>
  );
}
