import { Outlet } from 'react-router';
import Stamp from '../site/Stamp';
import { useAuth } from '../../lib/auth';
import { usePortalDarkMode } from '../../lib/portalTheme';

// The route loader already guarantees a session; this waits for the member's
// profile so role-gated controls never flash in or out on first paint. It also
// owns the theme, so even the loading screen honours dark mode.
export default function RequirePortalAuth() {
  const { loading } = useAuth();
  const theme = usePortalDarkMode();

  if (loading) {
    return (
      <div role="status" aria-label="Loading your portal" className="grid min-h-screen place-items-center bg-hk-paper">
        <Stamp size={72} className="animate-pulse text-hk-red" />
      </div>
    );
  }

  return <Outlet context={theme} />;
}
