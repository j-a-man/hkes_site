import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  CheckSquare,
  DollarSign,
  Image,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  PenSquare,
  QrCode,
  Send,
  Sun,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Toaster } from 'sonner';
import Stamp from './site/Stamp';
import { useAuth } from '../lib/auth';
import { usePortalTheme } from '../lib/portalTheme';

// Module-level so the scroll position survives even if this component remounts
// (e.g. a fresh page load) rather than resetting to the top of the nav list.
let savedSidebarScrollTop = 0;

const NAV_ITEMS: { to: string; label: string; zh: string; icon: LucideIcon }[] = [
  { to: '/portal/dashboard', label: 'Dashboard', zh: '總覽', icon: LayoutDashboard },
  { to: '/portal/deadlines', label: 'Deadlines', zh: '限期', icon: CheckSquare },
  { to: '/portal/graphics', label: 'Graphic requests', zh: '設計', icon: Image },
  { to: '/portal/posts', label: 'Post requests', zh: '帖文', icon: Send },
  { to: '/portal/reimbursements', label: 'Reimbursements', zh: '報銷', icon: DollarSign },
  { to: '/portal/members', label: 'Members', zh: '會員', icon: Users },
  { to: '/portal/announcements', label: 'Announcements', zh: '公告', icon: Megaphone },
  { to: '/portal/qr-campaigns', label: 'QR campaigns', zh: '抽獎', icon: QrCode },
  { to: '/portal/site-editor', label: 'Site editor', zh: '網站', icon: PenSquare },
];

const SIDEBAR_BUTTON =
  'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-white';

function NameTag() {
  const { profile } = useAuth();
  const title = profile?.title ?? (profile?.role === 'executive' ? 'Executive' : 'Member');
  return (
    <div className="-rotate-1 overflow-hidden rounded-2xl bg-hk-card text-hk-ink shadow-[4px_5px_0_0_rgba(0,0,0,0.18)]">
      <p className="bg-hk-red-deep px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
        <span lang="zh-HK" className="mr-1.5 font-zh text-xs tracking-normal">
          你好
        </span>
        Hello, my name is
      </p>
      <div className="px-4 pb-3 pt-2 text-center">
        <p className="truncate font-hand text-[1.75rem] font-semibold leading-tight">{profile?.full_name ?? '…'}</p>
        <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-hk-red">{profile ? title : ''}</p>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, darkMode, onToggleDark, onSignOut }: { onNavigate: () => void; darkMode: boolean; onToggleDark: () => void; onSignOut: () => void }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) navRef.current.scrollTop = savedSidebarScrollTop;
  }, []);

  return (
    <>
      <div className="shrink-0 px-5 pb-5 pt-6">
        <Link to="/portal/dashboard" onClick={onNavigate} className="flex items-center gap-3 rounded-xl focus-visible:outline-3 focus-visible:outline-white">
          <Stamp size={44} className="text-white" />
          <span className="leading-none">
            <span className="block font-display text-xl">HKES</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
              <span lang="zh-HK" className="mr-1 font-zh text-[11px] tracking-normal">
                會員專區
              </span>
              Member portal
            </span>
          </span>
        </Link>
        <div className="mt-6">
          <NameTag />
        </div>
      </div>

      <nav
        ref={navRef}
        aria-label="Portal"
        onScroll={(e) => {
          savedSidebarScrollTop = e.currentTarget.scrollTop;
        }}
        className="portal-sidebar-nav flex-1 overflow-y-auto px-3 py-2"
      >
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, zh, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-white ${
                    isActive ? 'bg-hk-card text-hk-red shadow-[3px_3px_0_0_rgba(0,0,0,0.18)]' : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} aria-hidden="true" className="shrink-0" />
                    <span className="flex-1">{label}</span>
                    <span lang="zh-HK" aria-hidden="true" className={`font-zh text-xs ${isActive ? 'text-hk-red/70' : 'text-white/55'}`}>
                      {zh}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 space-y-1 border-t border-white/20 px-3 py-4">
        <button type="button" onClick={onToggleDark} className={SIDEBAR_BUTTON}>
          {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
        <Link to="/" className={SIDEBAR_BUTTON}>
          <ArrowUpRight size={18} aria-hidden="true" />
          Public site
        </Link>
        <button type="button" onClick={onSignOut} className={SIDEBAR_BUTTON}>
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </>
  );
}

export default function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = usePortalTheme();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal');
  };

  const sidebarProps = {
    onNavigate: () => setMenuOpen(false),
    darkMode,
    onToggleDark: () => setDarkMode(!darkMode),
    onSignOut: handleSignOut,
  };

  return (
    <div className="min-h-screen bg-hk-paper font-['Poppins'] text-hk-ink antialiased selection:bg-hk-red selection:text-white">
      <aside className="paper-grain fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-hk-red text-white [--grain-opacity:0.1] lg:flex">
        <SidebarContent {...sidebarProps} />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hk-line bg-hk-paper/90 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="grid h-11 w-11 place-items-center rounded-full text-hk-ink hover:bg-hk-blush focus-visible:outline-3 focus-visible:outline-hk-red"
        >
          <Menu size={24} />
        </button>
        <Link to="/portal/dashboard" className="flex items-center gap-2.5">
          <Stamp size={34} className="text-hk-red" />
          <span className="font-display text-lg">HKES</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-hk-ink-soft">Portal</span>
        </Link>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[45] bg-[#120d0c]/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              aria-label="Portal menu"
              className="paper-grain fixed inset-y-0 left-0 z-50 flex w-[19rem] max-w-[85vw] flex-col bg-hk-red text-white [--grain-opacity:0.1] lg:hidden"
              initial={reduceMotion ? { opacity: 0 } : { x: '-100%' }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10"
              >
                <X size={22} />
              </button>
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-72">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8 lg:pt-12">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border-2 border-hk-shadow bg-hk-card px-4 py-3 font-['Poppins'] text-sm text-hk-ink shadow-[4px_4px_0_0_var(--color-hk-red)]",
            title: 'font-semibold',
            description: 'text-hk-ink-soft',
            error: 'border-hk-red!',
          },
        }}
      />
      <ScrollRestoration />
    </div>
  );
}
