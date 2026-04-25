import { Outlet, Link, useLocation } from 'react-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Fundraisers', path: '/fundraisers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-['Poppins']">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            
            <div className="flex items-center">
              <button
                className="text-[#fa4e5b] hover:text-[#ff7a65] transition-colors focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm uppercase font-bold tracking-wider transition-colors hover:text-[#fa4e5b] ${
                    location.pathname === link.path
                      ? 'text-[#fa4e5b]'
                      : 'text-[#1A1A1A]/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
                <Link
                  to="/portal"
                  className="hidden md:block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wider shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  PORTAL
                </Link>
                
                <Link to="/" className="flex items-center">
                  <img
                    src="/src/imports/merchlogo_designs_(1).png"
                    alt="HKES Logo"
                    className="h-10 w-auto opacity-80"
                  />
                </Link>
            </div>
            
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-24 bg-white/95 backdrop-blur-lg z-40 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-2xl uppercase font-bold tracking-wider transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#fa4e5b]'
                      : 'text-[#1A1A1A]'
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

      <footer className="bg-white text-[#1a1b1e] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-lg mb-6">About HKES</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
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

          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 HKES - Binghamton Hong Kong Exchange Square · Made with ❤️ at Binghamton
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
