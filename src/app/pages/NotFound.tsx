import { PlacardFrame, PlacardLabel } from '../components/site/Placard';
import SiteButton from '../components/site/SiteButton';

// Also rendered outside the site layout (e.g. unknown /portal/* paths), so it
// brings its own paper background.
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-hk-paper px-5 py-24 font-['Poppins'] text-hk-ink">
      <div className="w-full max-w-md -rotate-1">
        <PlacardFrame>
          <PlacardLabel zh="冇呢個站" en="404 · No such stop" />
          <h1 className="mt-4 font-marker text-[2.75rem] leading-none text-hk-red">Wrong stop!</h1>
          <p className="mt-4 leading-relaxed text-hk-ink-soft">This page doesn't exist or may have moved. Hop back on and we'll take you somewhere real.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <SiteButton to="/" size="sm">
              Back home
            </SiteButton>
            <SiteButton to="/events" variant="outline-ink" size="sm">
              See events
            </SiteButton>
          </div>
        </PlacardFrame>
      </div>
    </section>
  );
}
