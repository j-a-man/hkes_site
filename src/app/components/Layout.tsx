import { Outlet, Link, useLocation, useLoaderData } from 'react-router';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Moon, Sun, Mail, MapPin, Instagram, Linkedin } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';
import TikTokIcon from './icons/TikTokIcon';

interface LoaderData {
  globalContent: Record<string, Record<string, any>>;
}

export default function Layout() {
  const { globalContent } = useLoaderData() as LoaderData;
  const social = globalContent.social ?? {};
  const footer = globalContent.footer ?? {};
  const socialLinks = [
    { name: 'Instagram', href: social.instagram_url || '#', icon: Instagram },
    { name: 'TikTok', href: social.tiktok_url || '#', icon: TikTokIcon },
    { name: 'LinkedIn', href: social.linkedin_url || '#', icon: Linkedin },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const eventLinks = [
    { name: 'View All Events', path: '/events' },
    { name: 'Fundraisers', path: '/fundraisers' },
    { name: 'Banquets', path: '/events?filter=banquets' },
    { name: 'Social Events', path: '/events?filter=social' },
    { name: 'Cultural Events', path: '/events?filter=cultural' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-['Poppins'] bg-background text-foreground transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1a1b1e]/80 backdrop-blur-md z-[60] transition-colors duration-300 border-b border-transparent shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            
            {/* Left Side: Mobile Hamburger & Desktop Logo */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-[#fa4e5b] hover:text-[#ff7a65] transition-colors focus:outline-none p-2 -ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
              
              <Link to="/" className="hidden lg:flex items-center">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Logo size={48} />
                </motion.div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/"
                className={`text-sm uppercase font-bold tracking-wider transition-colors hover:text-[#fa4e5b] ${
                  location.pathname === '/' ? 'text-[#fa4e5b]' : 'text-gray-900/70 dark:text-gray-100/70'
                }`}
              >
                Home
              </Link>

              {/* Events Dropdown Desktop */}
              <div className="relative group py-6">
                <Link
                  to="/events"
                  className={`text-sm uppercase font-bold tracking-wider transition-colors hover:text-[#fa4e5b] flex items-center gap-1 ${
                    location.pathname.includes('/events') || location.pathname.includes('/fundraisers')
                      ? 'text-[#fa4e5b]'
                      : 'text-gray-900/70 dark:text-gray-100/70'
                  }`}
                >
                  Events
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Link>

                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-56">
                  <div className="bg-white dark:bg-[#202123] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl flex flex-col p-2">
                    {eventLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#fa4e5b] dark:hover:text-[#fa4e5b] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors whitespace-nowrap"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm uppercase font-bold tracking-wider transition-colors hover:text-[#fa4e5b] ${
                    location.pathname === link.path
                      ? 'text-[#fa4e5b]'
                      : 'text-gray-900/70 dark:text-gray-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side: Dark Mode, Portal, Mobile Logo */}
            <div className="flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-[#fa4e5b] bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <Link
                  to="/portal"
                  className="hidden md:block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wider shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  PORTAL
                </Link>
                
                <Link to="/" className="flex lg:hidden items-center">
                  <Logo size={40} />
                </Link>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Wrapper - Extracted outside nav to avoid stacking context traps */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[50] bg-white dark:bg-[#1a1b1e] overflow-y-auto"
            style={{ paddingTop: '6rem' }}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
        <div className="flex flex-col px-8 pb-12 space-y-6">
          <Link
            to="/"
            className={`text-2xl uppercase font-bold tracking-wider transition-colors ${
              location.pathname === '/' ? 'text-[#fa4e5b]' : 'text-gray-900 dark:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {/* Mobile Events Dropdown */}
          <div className="w-full">
            <button 
              onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
              className="w-full flex justify-between items-center text-2xl uppercase font-bold tracking-wider transition-colors text-gray-900 dark:text-white hover:text-[#fa4e5b] dark:hover:text-[#fa4e5b]"
            >
              <span>Events</span>
              <ChevronDown 
                size={24} 
                className={`transition-transform duration-300 ${mobileEventsOpen ? 'rotate-180 text-[#fa4e5b]' : ''}`} 
              />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mobileEventsOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                {eventLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg uppercase font-bold tracking-wider transition-colors ${
                      location.pathname === link.path ? 'text-[#fa4e5b]' : 'text-gray-500 dark:text-gray-400'
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileEventsOpen(false);
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-2xl uppercase font-bold tracking-wider transition-colors ${
                location.pathname === link.path ? 'text-[#fa4e5b]' : 'text-gray-900 dark:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-8 flex">
            <Link
              to="/portal"
              className="bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white px-8 py-4 rounded-full font-bold tracking-wider shadow-md w-full text-center hover:shadow-lg transition-shadow"
              onClick={() => setMobileMenuOpen(false)}
            >
              MEMBER PORTAL
            </Link>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 mt-24 relative z-10">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-[#1a1b1e] text-gray-800 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 relative z-10 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#ffbba1] via-[#fa4e5b] to-[#ff7a65]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <Logo size={44} />
                <span className="font-bold tracking-wide text-gray-900 dark:text-white">HKES</span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {footer.blurb}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] text-white flex items-center justify-center shadow-md"
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider w-fit"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Get Involved</h3>
              <div className="flex flex-col space-y-3">
                <Link to="/events" className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider w-fit">Events</Link>
                <Link to="/fundraisers" className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider w-fit">Fundraisers</Link>
                <Link to="/portal" className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider w-fit">Member Portal</Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <div className="flex flex-col space-y-4">
                <a href="mailto:hkes@binghamton.edu" className="flex items-start gap-3 text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[#FFF8F6] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-[#fa4e5b]" />
                  </span>
                  <span className="pt-1.5">hkes@binghamton.edu</span>
                </a>
                <div className="flex items-start gap-3 text-gray-500 text-sm">
                  <span className="w-8 h-8 rounded-full bg-[#FFF8F6] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-[#fa4e5b]" />
                  </span>
                  <span className="pt-1.5">Binghamton University<br />4400 Vestal Pkwy E, Binghamton, NY 13902</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              {footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
