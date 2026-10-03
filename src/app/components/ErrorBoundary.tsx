import { isRouteErrorResponse, useRouteError } from 'react-router';
import NotFound from '../pages/NotFound';
import { PlacardFrame, PlacardLabel } from './site/Placard';
import SiteButton from './site/SiteButton';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-hk-paper px-5 py-24 font-['Poppins'] text-hk-ink">
      <div className="w-full max-w-md -rotate-1">
        <PlacardFrame>
          <PlacardLabel zh="出咗啲問題" en="Something went wrong" />
          <h1 className="mt-4 font-marker text-[2.75rem] leading-none text-hk-red">Oops!</h1>
          <p className="mt-4 leading-relaxed text-hk-ink-soft">We hit an unexpected error loading this page. Please try again, or head back home.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <SiteButton type="button" size="sm" onClick={() => window.location.reload()}>
              Try again
            </SiteButton>
            <SiteButton to="/" variant="outline-ink" size="sm">
              Back home
            </SiteButton>
          </div>
        </PlacardFrame>
      </div>
    </section>
  );
}
