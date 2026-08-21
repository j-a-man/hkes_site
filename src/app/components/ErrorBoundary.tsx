import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import NotFound from '../pages/NotFound';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="bg-white dark:bg-[#1a1b1e] min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[#fa4e5b] font-bold tracking-widest text-sm mb-4">OOPS</p>
        <h1 className="text-3xl mb-4">Something Went Wrong</h1>
        <p className="text-[#555555] dark:text-gray-400 mb-8 leading-relaxed">
          We hit an unexpected error loading this page. Please try again, or head back home.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(250,78,91,0.4)] hover:shadow-[0_12px_25px_rgba(250,78,91,0.5)] transition-all hover:-translate-y-1"
        >
          BACK HOME
        </Link>
      </div>
    </div>
  );
}
