import { Outlet, Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check initial dark mode preference
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
    { name: 'Blog', path: '/blog' },
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
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1a1b1e]/80 backdrop-blur-md z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            
            {/* Left Side: Mobile Hamburger & Desktop Logo */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-[#fa4e5b] hover:text-[#ff7a65] transition-colors focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
              
              <Link to="/" className="hidden lg:flex items-center">
                <img
                  src="/merchlogo_designs_(1).png"
                  alt="HKES Logo"
                  className="h-12 w-auto drop-shadow-sm hover:scale-105 transition-transform"
                />
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

              {/* Events Dropdown */}
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
                  <img
                    src="/merchlogo_designs_(1).png"
                    alt="HKES Logo"
                    className="h-10 w-auto opacity-80"
                  />
                </Link>
            </div>
            
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-24 bg-white/95 dark:bg-[#1a1b1e]/95 backdrop-blur-lg z-40 overflow-y-auto pb-10">
            <div className="flex flex-col items-center justify-start pt-10 min-h-[50vh] space-y-6">
              <Link
                to="/"
                className={`text-2xl uppercase font-bold tracking-wider transition-colors ${
                  location.pathname === '/' ? 'text-[#fa4e5b]' : 'text-gray-900 dark:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="flex flex-col items-center space-y-4 pt-2">
                <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Events</span>
                {eventLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg uppercase font-bold tracking-wider transition-colors ${
                      location.pathname === link.path ? 'text-[#fa4e5b]' : 'text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="w-12 h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

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
              
              <Link
                to="/portal"
                className="mt-8 bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white px-8 py-3 rounded-full font-bold tracking-wider shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                MEMBER PORTAL
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 mt-24">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-[#1a1b1e] text-gray-800 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-lg mb-6">About HKES</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                A cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider">Home</Link>
                <Link to="/events" className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider">Events</Link>
                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-500 hover:text-[#fa4e5b] text-sm transition-colors uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Follow Us</h3>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-[#fa4e5b] transition-colors text-sm font-medium">
                  Instagram
                </a>
                <a href="#" className="text-gray-500 hover:text-[#fa4e5b] transition-colors text-sm font-medium">
                  Facebook
                </a>
                <a href="#" className="text-gray-500 hover:text-[#fa4e5b] transition-colors text-sm font-medium">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 HKES - Binghamton Hong Kong Exchange Square · Made with ❤️ at Binghamton
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
