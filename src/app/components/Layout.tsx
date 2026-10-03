import { Outlet, ScrollRestoration, useLoaderData } from 'react-router';
import SiteHeader from './site/SiteHeader';
import SiteFooter from './site/SiteFooter';
import { sectionContent } from '../lib/siteContentManifest';
import { socialLinks, type ContentMap } from '../lib/site';

interface LoaderData {
  globalContent: ContentMap;
  contactContent: ContentMap;
}

export default function Layout() {
  const { globalContent, contactContent } = useLoaderData() as LoaderData;
  const footer = sectionContent('global', 'footer', globalContent.footer);
  const contact = sectionContent('contact', 'info', contactContent.info);

  return (
    <div className="flex min-h-screen flex-col bg-hk-paper font-['Poppins'] text-hk-ink antialiased selection:bg-hk-red selection:text-white">
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-hk-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      {/* Clips decorative overhang (tilted stickers, tape, the marquee) without creating a scroll container. */}
      <main id="main" className="flex-1 overflow-x-clip">
        <Outlet />
      </main>
      <SiteFooter footer={footer} contact={contact} socials={socialLinks(globalContent.social)} />
      <ScrollRestoration />
    </div>
  );
}
