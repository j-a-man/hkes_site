import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Stamp from './Stamp';
import { Squiggle } from './Doodles';

export const NAV_ITEMS = [
  { to: '/events', label: 'Events', zh: '活動' },
  { to: '/fundraisers', label: 'Fundraisers', zh: '籌款' },
  { to: '/gallery', label: 'Gallery', zh: '相簿' },
  { to: '/about', label: 'About', zh: '關於我們' },
  { to: '/contact', label: 'Contact', zh: '聯絡我們' },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-hk-line bg-hk-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 rounded-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-hk-red">
            <Stamp size={44} className="text-hk-red" />
            <span className="leading-none">
              <span className="block font-display text-xl text-hk-ink">HKES</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-hk-ink-soft">Binghamton</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative block rounded-full px-4 py-2 text-[15px] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-hk-red ${
                        isActive ? 'text-hk-red' : 'text-hk-ink hover:text-hk-red'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <Squiggle className="absolute inset-x-3 -bottom-0.5 h-2 text-hk-red" strokeWidth={2.5} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/portal"
              className="hidden items-center gap-1.5 rounded-full border-2 border-hk-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink transition-colors hover:bg-hk-ink hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red sm:inline-flex"
            >
              Member portal
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-hk-ink transition-colors hover:bg-hk-blush focus-visible:outline-3 focus-visible:outline-hk-red lg:hidden"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would otherwise trap this fixed panel. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="site-menu"
            aria-label="Main"
            className="paper-grain fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-hk-red text-white lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ul className="flex flex-col px-5 pb-10 pt-6 sm:px-8">
              {[{ to: '/', label: 'Home', zh: '主頁' }, ...NAV_ITEMS].map((item) => (
                <li key={item.to} className="border-b border-white/20">
                  <NavLink to={item.to} end={item.to === '/'} className="flex items-baseline justify-between gap-4 py-4 focus-visible:outline-3 focus-visible:outline-white">
                    {({ isActive }) => (
                      <>
                        <span className={`font-display text-[1.75rem] uppercase leading-none sm:text-[2rem] ${isActive ? 'text-hard-shadow' : ''}`}>{item.label}</span>
                        <span lang="zh-HK" className="shrink-0 whitespace-nowrap font-zh text-xl text-white/85">
                          {item.zh}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="px-5 pb-12 sm:px-8">
              <Link
                to="/portal"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-hk-red"
              >
                <span lang="zh-HK" className="font-zh text-base normal-case tracking-normal">
                  會員專區
                </span>
                Member portal
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
